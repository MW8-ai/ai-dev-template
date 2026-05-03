# Testing — TeamTracker API

## Test Strategy

| Type | Target | Rationale |
|------|--------|-----------|
| Unit tests | 80% of all tests | Fast (< 5s suite); test business logic in isolation using mocked DB; run on every save |
| Integration tests | 15% of all tests | Verify Knex queries, route-to-service wiring, and auth middleware against a real PostgreSQL instance |
| End-to-end tests | 5% of all tests | Cover the 5 critical user journeys (register, create team, create task, assign, complete); run in staging |

**Coverage minimum:** 75% line coverage, enforced in CI. Currently at ~82%.

**Testing principles:**
- Tests live adjacent to source code: `src/services/task-service.js` tested by `tests/task-service.test.js`
- All service layer functions have unit tests
- All API routes have at least one integration test covering the happy path and one for auth failure
- Bug fixes must include a regression test
- Flaky tests are P1 bugs — fix or delete within 48 hours of detection

---

## Running Tests

### Prerequisites

```bash
# Install dependencies (includes Jest, Supertest, test utilities)
npm ci

# Start the test database (unit tests don't need this, integration tests do)
docker-compose -f docker-compose.test.yml up -d

# Wait ~5 seconds for PostgreSQL to start, then migrate
npm run db:migrate:test
```

### Unit Tests

```bash
# Run all unit tests (no database required)
npm test

# Watch mode — re-runs affected tests on file save
npm test -- --watch

# Run a single test file
npm test -- tests/task-service.test.js

# Run tests matching a name pattern
npm test -- --testNamePattern="createTask"
```

### Integration Tests

```bash
# Requires Docker PostgreSQL to be running (see prerequisites above)
npm run test:integration

# Run a specific integration test file
npm run test:integration -- tests/integration/tasks-api.test.js
```

### End-to-End Tests

```bash
# Requires staging environment or local Docker Compose full stack
npm run test:e2e

# Run e2e in verbose mode to see each step
npm run test:e2e -- --verbose
```

### All Tests with Coverage

```bash
# Runs unit + integration, generates coverage report
npm run test:all

# Open coverage report in browser
open coverage/lcov-report/index.html
```

---

## Test Coverage Requirements

| Metric | Minimum | Current |
|--------|---------|---------|
| Line coverage | 75% | ~82% |
| Branch coverage | 65% | ~71% |
| Function coverage | 80% | ~88% |

CI fails if any metric drops below the minimum. Coverage is reported to Codecov on every PR.
The coverage badge in README reflects the latest `main` branch.

**Intentionally excluded from coverage:**
- `src/server.js` (entry point — tests run the app, not start it)
- `src/db/migrations/` (SQL migration files)
- `src/config/` (environment variable parsing — covered implicitly)

---

## Test Environments

| Environment | Database | External APIs | How to Start |
|-------------|----------|---------------|-------------|
| Unit (local) | Mocked with Jest mocks | All mocked | `npm test` — no setup required |
| Integration (local) | Docker PostgreSQL 15 | Mocked (SendGrid sandbox, S3 localstack) | `docker-compose -f docker-compose.test.yml up -d` |
| CI (GitHub Actions) | GitHub Actions service container (PostgreSQL 15) | Sandbox credentials from secrets | Automatic on PR |
| Staging (e2e) | Staging RDS instance (seeded with test data) | SendGrid sandbox, S3 test bucket | Runs nightly + on deploy |

**Test database setup:**

```bash
# Create test DB and run migrations
npm run db:migrate:test

# Seed test database with fixture data
npm run db:seed:test

# Reset test database (drop + recreate + migrate + seed)
npm run db:reset:test
```

---

## CI/CD Test Configuration

Tests run in GitHub Actions on every push and every PR targeting `main`.

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

**Test pipeline stages:**

1. **Lint** — ESLint + Prettier check (fails fast, ~15 seconds)
2. **Type check** — `tsc --noEmit` (fails fast, ~20 seconds)
3. **Unit tests** — Jest with 4 workers (parallel, ~45 seconds)
4. **Integration tests** — against PostgreSQL service container (~90 seconds)
5. **Coverage check** — fails if below 75% threshold
6. **E2e tests** — runs only on pushes to `main`, against staging environment

**Required GitHub secrets for CI:**

```
TEST_DATABASE_URL=postgresql://testuser:testpass@localhost:5432/teamtracker_test
JWT_SECRET=test-jwt-secret-ci-only
SENDGRID_API_KEY=SG.sandbox-key-for-testing
AWS_S3_TEST_BUCKET=teamtracker-test-attachments
CODECOV_TOKEN=<from Codecov>
```

---

## Performance Testing

Performance tests live in `tests/performance/` and use [k6](https://k6.io/).

```bash
# Install k6 (macOS)
brew install k6

# Run the standard load test against staging
k6 run tests/performance/load-test.js \
  --env BASE_URL=https://staging.teamtracker.example.com \
  --env AUTH_TOKEN=$(cat .staging-token)

# Targets:
# - Task list endpoint: p95 < 100ms at 500 RPS
# - Task creation: p95 < 200ms at 100 RPS
# - 0% error rate at normal load
# - < 1% error rate at 2x peak load
```

Performance tests run:
- Manually before every major release
- Automatically in CI on the `release/*` branch
- Quarterly baseline test against production (read-only endpoints only)

---

## Manual Testing Checklist

Run this smoke test after every staging deploy before promoting to production.

### Authentication
- [ ] Register new account — confirm welcome email arrives (SendGrid activity feed)
- [ ] Log in with valid credentials — confirm JWT returned
- [ ] Log in with wrong password — confirm 401 response, not 500
- [ ] Call protected endpoint without token — confirm 401 response
- [ ] Call protected endpoint with expired token — confirm 401 (not 403 or 500)

### Teams
- [ ] Create a team — confirm it appears in `GET /teams`
- [ ] Invite a user to a team — confirm invitation email arrives
- [ ] Accept invitation — confirm new member appears in team member list

### Tasks
- [ ] Create a task — confirm it appears in `GET /tasks`
- [ ] Assign task to a team member — confirm assignee field updates
- [ ] Update task status to "done" — confirm status change persists
- [ ] Delete a task — confirm it no longer appears in `GET /tasks` (soft delete)
- [ ] Upload a file attachment — confirm file accessible via pre-signed S3 URL

### Error handling
- [ ] Create a task with missing `title` field — confirm 400 with validation error body
- [ ] Access another team's tasks — confirm 403 (not 404 or 500)
- [ ] Upload a file > 10MB — confirm 413 with clear error message

### Observability
- [ ] Check Datadog APM — confirm requests appear and latency is within targets
- [ ] Check error rate — confirm 0% error rate during smoke test
