# Deployment — TeamTracker API

## Environments

| Environment | URL | Purpose | Access |
|-------------|-----|---------|--------|
| Local | http://localhost:3000 | Development; unit and integration testing | All developers |
| Staging | https://staging.teamtracker.example.com | Pre-release testing, QA, client demos | Team + stakeholders |
| Production | https://app.teamtracker.example.com | Live customers | Deploy team + on-call only |

---

## Prerequisites

Before deploying, ensure the following are installed and configured:

- [ ] **Node.js 20** — `node --version` must be `v20.x.x` (check `.nvmrc`)
- [ ] **PostgreSQL client 15** — `psql --version` (for migration steps and DB verification)
- [ ] **AWS CLI v2** — `aws --version`; configured with deploy credentials (`aws sts get-caller-identity`)
- [ ] **Docker 24+** — `docker --version` (for building container images)
- [ ] **jq** — `jq --version` (used in deploy scripts for JSON parsing)
- [ ] **AWS access** — confirm you are in the `teamtracker-deploy` IAM group
- [ ] **GitHub access** — push access to the `teamtracker` repository

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port (defaults to 3000) | `3000` |
| `NODE_ENV` | Yes | Runtime environment | `production` |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://app:secret@db.example.com:5432/teamtracker` |
| `DATABASE_POOL_MIN` | No | Min DB connections in pool | `2` |
| `DATABASE_POOL_MAX` | No | Max DB connections in pool | `10` |
| `JWT_SECRET` | Yes | Secret for signing access tokens (min 48 chars) | `<generated random>` |
| `JWT_EXPIRY` | No | Access token expiry | `1h` |
| `JWT_REFRESH_SECRET` | Yes | Secret for signing refresh tokens | `<generated random>` |
| `SENDGRID_API_KEY` | Yes | SendGrid API key for email | `SG.xxxx` |
| `SENDGRID_FROM_EMAIL` | Yes | From address for outbound email | `noreply@teamtracker.example.com` |
| `AWS_REGION` | Yes | AWS region for S3 | `us-east-1` |
| `S3_BUCKET_NAME` | Yes | S3 bucket for file attachments | `teamtracker-attachments-prod` |
| `SENTRY_DSN` | No | Sentry error tracking DSN | `https://abc@sentry.io/123` |
| `DATADOG_API_KEY` | No | Datadog API key | `abc123` |
| `LOG_LEVEL` | No | Logging verbosity | `info` |
| `RATE_LIMIT_PER_MINUTE` | No | Requests per minute per user | `1000` |

> All production secrets are stored in AWS Secrets Manager under `teamtracker/production/*`.
> They are injected at container startup via the ECS task definition secrets configuration.
> Never put real values in `.env` files that are committed to git.

---

## Deploy Steps

### Local

```bash
# 1. Install dependencies
npm ci

# 2. Copy environment file
cp .env.example .env
# Edit .env — defaults work with Docker Compose

# 3. Start local services
docker-compose up -d

# 4. Run migrations
npm run db:migrate

# 5. Start dev server with hot reload
npm run dev

# Verify: curl http://localhost:3000/health
# Expected: {"status":"ok","version":"1.2.0","db":"connected"}
```

### Staging

Staging deploys happen automatically on every push to `main` via GitHub Actions.
To trigger a manual staging deploy:

```bash
# 1. Ensure you are on main with latest changes
git checkout main && git pull

# 2. Build and push Docker image (CI does this automatically — manual only if needed)
IMAGE_TAG=$(git rev-parse --short HEAD)
docker build -t teamtracker-api:$IMAGE_TAG .
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag teamtracker-api:$IMAGE_TAG \
  123456789.dkr.ecr.us-east-1.amazonaws.com/teamtracker-api:$IMAGE_TAG
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/teamtracker-api:$IMAGE_TAG

# 3. Run database migrations against staging
DATABASE_URL=$(aws secretsmanager get-secret-value \
  --secret-id teamtracker/staging/database_url --query SecretString --output text) \
  npm run db:migrate

# 4. Deploy to ECS staging
aws ecs update-service \
  --cluster teamtracker-staging \
  --service teamtracker-api \
  --force-new-deployment \
  --region us-east-1

# 5. Wait for deploy to complete (~2-3 minutes)
aws ecs wait services-stable \
  --cluster teamtracker-staging \
  --services teamtracker-api \
  --region us-east-1

# 6. Verify
curl https://staging.teamtracker.example.com/health
```

### Production

> **Pre-deploy checklist:**
> - [ ] Staging deploy has been running for at least 24 hours without errors
> - [ ] All PR-linked tests pass on `main`
> - [ ] Datadog staging dashboard shows no anomalies
> - [ ] Manual smoke test passed (see TESTING.md)
> - [ ] Deploy scheduled during low-traffic window (avoid 09:00–10:00 UTC and Friday PM)
> - [ ] On-call engineer is aware and monitoring
> - [ ] Rollback plan confirmed (task definition revision N-1 identified)

```bash
# 1. Tag the release
git tag v1.2.0 && git push origin v1.2.0

# 2. Build production image
IMAGE_TAG=v1.2.0
docker build -t teamtracker-api:$IMAGE_TAG .
docker tag teamtracker-api:$IMAGE_TAG \
  123456789.dkr.ecr.us-east-1.amazonaws.com/teamtracker-api:$IMAGE_TAG
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/teamtracker-api:$IMAGE_TAG

# 3. Back up database if schema changes exist in this release
pg_dump $PROD_DATABASE_URL > backups/pre-v1.2.0-$(date +%Y%m%d-%H%M%S).sql

# 4. Run database migrations
DATABASE_URL=$(aws secretsmanager get-secret-value \
  --secret-id teamtracker/production/database_url --query SecretString --output text) \
  npm run db:migrate

# 5. Update ECS task definition with new image tag, then deploy
# (In practice, this is done via Terraform or the CI/CD pipeline)
aws ecs update-service \
  --cluster teamtracker-production \
  --service teamtracker-api \
  --force-new-deployment \
  --region us-east-1

# 6. Monitor the deployment (check Datadog during this window)
aws ecs wait services-stable \
  --cluster teamtracker-production \
  --services teamtracker-api \
  --region us-east-1

# 7. Run health checks (see below)
```

---

## Rollback Procedure

Rollback should take less than 5 minutes. If in doubt, roll back first and investigate after.

### Application Rollback (under 3 minutes)

```bash
# 1. Identify the previous stable task definition revision
aws ecs describe-services \
  --cluster teamtracker-production \
  --services teamtracker-api \
  --query 'services[0].deployments' \
  --region us-east-1

# 2. Find the previous PRIMARY revision number, then roll back
PREVIOUS_REVISION=47  # Replace with actual previous revision
aws ecs update-service \
  --cluster teamtracker-production \
  --service teamtracker-api \
  --task-definition teamtracker-api:$PREVIOUS_REVISION \
  --region us-east-1

# 3. Confirm rollback is running
aws ecs wait services-stable \
  --cluster teamtracker-production \
  --services teamtracker-api \
  --region us-east-1

# 4. Verify health
curl https://app.teamtracker.example.com/health
```

### Database Migration Rollback

```bash
# Roll back the most recent migration
npm run db:migrate:rollback

# Roll back multiple migrations (specify count)
npm run db:migrate:rollback -- --count 2
```

> **Warning:** Database rollbacks that reverse data migrations may cause permanent data loss.
> If the migration added a column with data in it, rolling back the migration will drop that data.
> Always take a backup before running migrations on production. Contact the on-call lead before
> executing a database restore from backup.

---

## Health Checks

After every production deploy, verify all of the following before closing the deploy:

| Check | Command / URL | Expected Result |
|-------|--------------|-----------------|
| API responding | `curl https://app.teamtracker.example.com/health` | `{"status":"ok","version":"1.2.0","db":"connected"}` |
| Database connected | Included in /health response | `"db":"connected"` field present |
| Error rate | Datadog: TeamTracker > Production > Error Rate | < 0.1% over the past 5 minutes |
| p95 latency | Datadog: TeamTracker > Production > Latency p95 | < 200ms over the past 5 minutes |
| Task list working | `curl -H "Authorization: Bearer $TEST_TOKEN" https://app.teamtracker.example.com/tasks` | 200 response with task array |
| ECS service stable | `aws ecs describe-services --cluster teamtracker-production --services teamtracker-api` | `runningCount` equals `desiredCount` |

If any check fails, initiate the rollback procedure and notify the team in `#incidents`.

---

## Secrets Management

| Environment | Location | Access Method |
|-------------|---------|---------------|
| Local | `.env` file (git-ignored) | Copy `.env.example`, fill in manually |
| Staging | AWS Secrets Manager (`teamtracker/staging/*`) | ECS task role (auto-injected at startup) |
| Production | AWS Secrets Manager (`teamtracker/production/*`) | ECS task role (auto-injected at startup) |

**Rotating a production secret:**

```bash
# 1. Generate a new secret value
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")

# 2. Update in Secrets Manager (this does NOT restart the application yet)
aws secretsmanager put-secret-value \
  --secret-id teamtracker/production/jwt_secret \
  --secret-string "$NEW_SECRET"

# 3. Deploy a new ECS task (forces containers to reload secrets from Secrets Manager)
aws ecs update-service \
  --cluster teamtracker-production \
  --service teamtracker-api \
  --force-new-deployment

# 4. Note: rotating JWT_SECRET invalidates all active user sessions
#    Schedule during low-traffic hours and notify users if needed
```

---

## On-Call and Escalation

| Role | Name | Contact | Owns |
|------|------|---------|------|
| On-call engineer | Weekly rotation — see PagerDuty | PagerDuty alert | Application, services |
| Database admin | @carol | Slack DM or PagerDuty | PostgreSQL, RDS, migrations |
| Infrastructure | @dave | Slack DM or PagerDuty | AWS, ECS, networking, DNS |
| Engineering lead | @alice | Slack DM + mobile | Architectural decisions, escalation |

**Escalation path:** On-call engineer → Engineering lead → CTO

**Incident channel:** `#incidents` in Slack — post all production issues here immediately.

**Runbooks:**
- [Database connection pool exhaustion](https://notion.so/teamtracker/runbooks/db-pool)
- [High error rate — tasks endpoint](https://notion.so/teamtracker/runbooks/tasks-error-rate)
- [ECS service unstable](https://notion.so/teamtracker/runbooks/ecs-unstable)
- [SendGrid delivery failure](https://notion.so/teamtracker/runbooks/sendgrid)
