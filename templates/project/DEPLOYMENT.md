# Deployment — [PROJECT_NAME]

<!-- INSTRUCTION: Fill in all placeholders. This document must be accurate enough that
     an engineer who has never deployed this service can do it safely by following these steps.
     Review after every infrastructure change. -->

## Environments

<!-- INSTRUCTION: List every environment that exists. Include who can access each one
     and what it is used for. Staging should mirror production as closely as possible. -->

| Environment | URL | Purpose | Access |
|-------------|-----|---------|--------|
| Local | http://localhost:[PORT] | Development and unit testing | All developers |
| Staging | https://staging.[your-domain].com | Pre-release testing, QA, demos | Team + stakeholders |
| Production | https://[your-domain].com | Live users | Deploy team + on-call |

---

## Prerequisites

<!-- INSTRUCTION: List everything that must be installed and configured on the deploy machine
     before the deploy steps will work. Include version requirements. -->

Before deploying, ensure the following are installed and configured:

- [ ] **Node.js [VERSION]** — `node --version` should match `.nvmrc`
- [ ] **[Database CLI, e.g., psql 15]** — required for migration steps
- [ ] **[Cloud CLI, e.g., AWS CLI v2]** — configured with deploy credentials (`aws sts get-caller-identity`)
- [ ] **Docker [VERSION]** — required for building container images
- [ ] **Access to secrets** — confirm you can read from [Secrets Manager / Vault / 1Password]
- [ ] **Repository access** — you have push access to the deploy branch

---

## Environment Variables

<!-- INSTRUCTION: Document every environment variable the application reads.
     Never put real values here — use examples or format descriptions.
     Mark which are required vs. optional so a new deploy doesn't silently misconfigure. -->

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Port the server listens on | `3000` |
| `NODE_ENV` | Yes | Runtime environment | `production` |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens (min 32 chars) | `a-long-random-string` |
| `JWT_EXPIRY` | No | Token expiration time | `1h` |
| `[SERVICE_API_KEY]` | Yes | API key for [external service] | `sk_live_...` |
| `LOG_LEVEL` | No | Logging verbosity | `info` |
| `SENTRY_DSN` | No | Error tracking DSN | `https://abc@sentry.io/123` |
| `[YOUR_VARIABLE]` | Yes/No | Description | `example-value` |

> Secrets are managed via [AWS Secrets Manager / HashiCorp Vault / GitHub Secrets].
> See [Secrets Management](#secrets-management) below.

---

## Deploy Steps

<!-- INSTRUCTION: Write exact numbered steps for each environment.
     Commands must be copy-pasteable. Include verification steps so the deployer
     knows if something went wrong. -->

### Local

```bash
# 1. Install dependencies
npm ci

# 2. Copy environment file and fill in local values
cp .env.example .env

# 3. Start local database
docker-compose up -d db

# 4. Run database migrations
npm run db:migrate

# 5. Start the development server
npm run dev

# Verify: open http://localhost:3000/health — should return {"status":"ok"}
```

### Staging

```bash
# 1. Ensure you are on the correct branch
git checkout main && git pull

# 2. Build the Docker image
docker build -t [IMAGE_NAME]:staging .

# 3. Push the image to the container registry
docker tag [IMAGE_NAME]:staging [REGISTRY]/[IMAGE_NAME]:staging
docker push [REGISTRY]/[IMAGE_NAME]:staging

# 4. Run database migrations against staging DB
DATABASE_URL=[STAGING_DB_URL] npm run db:migrate

# 5. Deploy to staging environment
[aws ecs update-service --cluster staging --service [SERVICE_NAME] --force-new-deployment]

# 6. Wait for deployment to complete
[aws ecs wait services-stable --cluster staging --services [SERVICE_NAME]]

# Verify: curl https://staging.[your-domain].com/health
```

### Production

> **Before deploying to production:**
>
> - [ ] Staging deploy succeeded and has been tested
> - [ ] PR has been approved and merged
> - [ ] Deployment has been scheduled (no Friday deploys without on-call coverage)
> - [ ] Rollback plan is ready (see below)

```bash
# 1. Tag the release
git tag v[VERSION] && git push origin v[VERSION]

# 2. Build and push the production image
docker build -t [IMAGE_NAME]:[VERSION] .
docker push [REGISTRY]/[IMAGE_NAME]:[VERSION]

# 3. Run database migrations (back up DB first if schema changes)
[pg_dump $PROD_DATABASE_URL > backup-pre-v[VERSION].sql]
DATABASE_URL=[PROD_DB_URL] npm run db:migrate

# 4. Deploy to production
[aws ecs update-service --cluster production --service [SERVICE_NAME] \
  --force-new-deployment --task-definition [TASK_DEF]:[REVISION]]

# 5. Monitor the deploy (watch for errors)
[aws ecs wait services-stable --cluster production --services [SERVICE_NAME]]

# Verify: see Health Checks section
```

---

## Rollback Procedure

<!-- INSTRUCTION: Rollback steps must be tested before they are needed.
     Run a rollback drill at least once per quarter for production services. -->

### Application Rollback

```bash
# 1. Identify the previous stable task definition revision
[aws ecs describe-services --cluster production --services [SERVICE_NAME] \
  --query 'services[0].deployments']

# 2. Roll back to the previous revision
[aws ecs update-service --cluster production --service [SERVICE_NAME] \
  --task-definition [TASK_DEF]:[PREVIOUS_REVISION]]

# 3. Confirm rollback is complete
[aws ecs wait services-stable --cluster production --services [SERVICE_NAME]]
```

### Database Rollback

```bash
# If migrations were applied, roll them back BEFORE rolling back the app
npm run db:migrate:rollback

# If data was corrupted and migration rollback is insufficient, restore from backup
[pg_restore -d $PROD_DATABASE_URL backup-pre-v[VERSION].sql]
```

> **Warning:** Database rollbacks that reverse data migrations may cause permanent data loss.
> Contact the on-call lead before executing a database restore.

---

## Health Checks

<!-- INSTRUCTION: List exactly what to check after a deploy to confirm the service is healthy.
     Automated checks should run in CI; manual checks are for the deployer to verify by hand. -->

After every production deploy, verify:

| Check | Command / URL | Expected Result |
|-------|--------------|-----------------|
| API is up | `curl https://[your-domain].com/health` | `{"status":"ok","version":"[VERSION]"}` |
| Database connected | `curl https://[your-domain].com/health/db` | `{"db":"connected"}` |
| Error rate | Check [Datadog / Grafana] dashboard | < 0.1% error rate |
| Latency | Check [Datadog / Grafana] p95 latency | < [200ms] |
| Auth works | Log in with test account | Successful login |

If any check fails, initiate the rollback procedure immediately.

---

## Secrets Management

<!-- INSTRUCTION: Describe where secrets live in each environment.
     Secrets must never be stored in code, config files, or environment variable files checked into git. -->

| Environment | Secrets Location | Access Method |
|-------------|-----------------|---------------|
| Local | `.env` file (git-ignored) | Copy from `.env.example` and fill in manually |
| Staging | [AWS Secrets Manager / GitHub Secrets] | Injected at deploy time via CI |
| Production | [AWS Secrets Manager / HashiCorp Vault] | IAM role; app reads at startup |

**Rotating a secret:**

1. Generate a new secret value
2. Add the new value to [Secrets Manager] alongside the old value
3. Deploy the application (it will pick up the new value)
4. Verify the application is healthy with the new secret
5. Delete the old secret value

---

## On-Call and Escalation

<!-- INSTRUCTION: List who to contact when a deploy goes wrong.
     Include their preferred contact method and what they own. -->

| Role | Name | Contact | Owns |
|------|------|---------|------|
| On-call engineer | [Name / rotation] | [PagerDuty / Slack @handle] | Application layer |
| Database admin | [Name] | [Contact] | Database, migrations |
| Infrastructure | [Name] | [Contact] | AWS, networking, DNS |
| Engineering lead | [Name] | [Contact] | Escalation, decisions |

**Escalation path:** On-call engineer → Engineering lead → CTO

> For production incidents, open an incident in [PagerDuty / OpsGenie / Slack #incidents]
> and follow the runbook at [LINK TO RUNBOOK].
