# Testing — [PROJECT_NAME]

<!-- INSTRUCTION: Fill in all placeholders marked with [brackets].
     This document should be the single source of truth for how to run tests on this project.
     Every developer should be able to run the full test suite by following this file alone. -->

## Test Strategy

<!-- INSTRUCTION: Define the testing pyramid for this project.
     Explain why you chose this balance — different projects have different tradeoffs.
     A typical breakdown: 70-80% unit, 15-25% integration, 5-10% e2e. -->

| Type | Target Coverage | Rationale |
|------|----------------|-----------|
| Unit tests | [e.g., 80%] | Fast feedback; test business logic in isolation; no external dependencies |
| Integration tests | [e.g., 15%] | Verify database queries, API contracts, and service wiring |
| End-to-end tests | [e.g., 5%] | Validate critical user journeys; slow but high confidence |

**Testing principles for this project:**

- Tests live next to the code they test (`*.test.js` alongside `*.js`, or in a `/tests` mirror)
- Tests must pass before any PR is merged
- Flaky tests are treated as bugs — fix or delete, never skip

---

## Running Tests

<!-- INSTRUCTION: Replace the placeholder commands with exact commands that work in this repo.
     Include any required setup steps (e.g., running a test database). -->

### Prerequisites

```bash
# Install dependencies
[npm ci | pip install -r requirements-dev.txt | bundle install]

# Start test dependencies (database, cache, etc.)
[docker-compose -f docker-compose.test.yml up -d]
```

### Unit Tests

```bash
# Run all unit tests
[npm test | pytest | bundle exec rspec]

# Run with watch mode (re-runs on file change)
[npm test -- --watch | pytest-watch]

# Run a specific test file
[npm test -- path/to/file.test.js | pytest tests/test_feature.py]
```

### Integration Tests

```bash
# Run integration tests (requires running database)
[npm run test:integration | pytest -m integration]

# Run a single integration test
[npm run test:integration -- --grep "task creation"]
```

### End-to-End Tests

```bash
# Run e2e tests (requires staging environment or local stack)
[npm run test:e2e | pytest -m e2e]

# Run e2e in headed mode (shows browser)
[npm run test:e2e -- --headed]
```

### All Tests

```bash
# Run every test suite in sequence
[npm run test:all | make test]
```

---

## Test Coverage Requirements

<!-- INSTRUCTION: Define minimum coverage thresholds enforced in CI.
     Coverage alone doesn't guarantee quality — but it flags obviously untested code. -->

| Metric | Minimum Required | Current |
|--------|-----------------|---------|
| Line coverage | [e.g., 75%] | Check CI badge |
| Branch coverage | [e.g., 65%] | Check CI badge |
| Function coverage | [e.g., 80%] | Check CI badge |

CI will fail if coverage drops below the minimum. To view a coverage report locally:

```bash
[npm test -- --coverage | pytest --cov=src --cov-report=html]
# Open coverage/index.html in a browser
```

---

## Test Environments

<!-- INSTRUCTION: Describe where tests run and what they connect to.
     Developers need to understand if tests hit a real database, a mock, or a test double. -->

| Environment | Database | External APIs | Notes |
|-------------|----------|---------------|-------|
| Local (unit) | In-memory / mocked | All mocked | No setup required |
| Local (integration) | Docker PostgreSQL | Mocked or sandbox | Run `docker-compose up` first |
| CI | GitHub Actions service containers | Sandbox keys from secrets | Runs on every PR |
| Staging (e2e) | Staging DB (seeded) | Sandbox / test accounts | Runs nightly + on deploy |

**Test database setup:**

```bash
# Create and migrate the test database
[npm run db:test:setup | python manage.py migrate --settings=config.test]

# Seed with test data
[npm run db:test:seed]

# Reset between test runs
[npm run db:test:reset]
```

---

## CI/CD Test Configuration

<!-- INSTRUCTION: Describe how tests run in your CI pipeline.
     Link to the workflow file and explain any parallelization or matrix strategies. -->

Tests run automatically in GitHub Actions on:

- Every push to any branch
- Every pull request targeting `main` or `develop`

Workflow file: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)

**Test stages in CI:**

1. Lint (fails fast — runs in ~30 seconds)
2. Unit tests (parallelized across [N] workers)
3. Integration tests (runs against service containers)
4. Coverage check (fails if below threshold)
5. E2e tests (runs on `main` branch only, or staging deploy)

**CI environment variables required:**

```text
TEST_DATABASE_URL=postgresql://localhost:5432/test
JWT_SECRET=test-secret-not-used-in-production
[OTHER_REQUIRED_TEST_VARS]
```

---

## Performance Testing

<!-- INSTRUCTION: Describe any load tests, benchmarks, or performance regression tests.
     Even simple scripts that verify response time are worth documenting here. -->

Performance tests are located in [`/tests/performance/`](../../tests/performance/).

```bash
# Run load test (requires k6 or artillery installed)
[k6 run tests/performance/load-test.js | artillery run tests/performance/load-test.yml]

# Target: p95 response time < 200ms at 500 req/s
```

Performance tests run manually before major releases and quarterly on the staging environment.

---

## Manual Testing Checklist

<!-- INSTRUCTION: List the minimum set of manual checks to perform before any release.
     These are the "does the obvious stuff work?" checks that catch regressions automated tests miss. -->

Perform this smoke test after deploying to staging. Check each item before promoting to production.

### Authentication

- [ ] User can register a new account
- [ ] User can log in with valid credentials
- [ ] Invalid credentials return an error (not a 500)
- [ ] Password reset flow sends email and allows new password

### Core Features

- [ ] [Core feature 1] works end to end
- [ ] [Core feature 2] works end to end
- [ ] [Core feature 3] works end to end

### Error Handling

- [ ] 404 page displays correctly for unknown routes
- [ ] API returns JSON error body (not HTML) on 4xx/5xx
- [ ] Form validation errors display clearly to the user

### Performance

- [ ] Home/main page loads in < [N] seconds on a standard connection
- [ ] No obvious memory leaks after 10 minutes of use (check browser dev tools)

### Accessibility (if applicable)

- [ ] Page is navigable by keyboard
- [ ] Screen reader reads important content in logical order
