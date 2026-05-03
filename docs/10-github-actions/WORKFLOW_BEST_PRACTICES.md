# GitHub Actions Workflow Best Practices

Workflows that are hard to maintain are worse than no workflows. This doc covers patterns that keep your CI/CD reliable, fast, and easy to debug.

---

## Workflow File Conventions

### Name workflows for humans, not machines

```yaml
name: "PR Standards Check"   # good — readable in the UI
name: pr-standards            # less useful — looks like a filename
```

The `name` field appears in the GitHub Actions tab. Make it descriptive.

### Use `on:` triggers intentionally

Over-triggering wastes minutes and money. Under-triggering means important checks don't run.

```yaml
# Runs on PRs targeting main — most common pattern for CI
on:
  pull_request:
    branches: [main]

# Runs on pushes to main — for deployments/releases
on:
  push:
    branches: [main]

# Runs on a schedule — for security scans, health checks
on:
  schedule:
    - cron: "0 8 * * 1"  # 8am UTC every Monday

# Manual trigger — for release workflows
on:
  workflow_dispatch:
```

Avoid `on: push` to all branches unless the workflow is genuinely needed on every branch.

---

## Job Structure

### Keep jobs focused — one job, one responsibility

```yaml
jobs:
  lint:          # just linting
  test:          # just tests
  build:         # just building
  deploy:        # just deploying
```

Don't combine lint + test + build + deploy into one 200-line job. Separate jobs can run in parallel, fail independently, and are easier to retry.

### Use `needs:` to enforce order

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [...]

  deploy:
    needs: test          # deploy only runs if test passes
    runs-on: ubuntu-latest
    steps: [...]
```

Without `needs:`, all jobs run in parallel. With `needs:`, you control the dependency chain.

### Set `timeout-minutes` on every job

Hung steps can run for 6 hours and burn through your Actions minutes. Default is no timeout.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15   # fail loudly instead of hanging
    steps: [...]
```

Reasonable defaults: 10–15 min for lint/test, 20–30 min for builds, 5 min for simple scripts.

---

## Steps

### Name every step

```yaml
steps:
  - name: Checkout code
    uses: actions/checkout@v4

  - name: Set up Node.js 20
    uses: actions/setup-node@v4
    with:
      node-version: "20"

  - name: Install dependencies
    run: npm ci

  - name: Run tests
    run: npm test
```

Unnamed steps show up as "Run npm ci" in the UI — fine. But multi-command `run` blocks and actions with non-obvious purposes should always be named.

### Prefer `npm ci` over `npm install` in CI

`npm ci` is deterministic: it installs exactly what's in `package-lock.json` and fails if there's a mismatch. `npm install` can silently update the lockfile.

### Pin action versions to a full SHA for security-sensitive workflows

```yaml
# Acceptable for most repos — pin to major version
uses: actions/checkout@v4

# Best for high-security repos — pin to exact commit SHA
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
```

Pinning to `@v4` means you automatically get patch releases in that major version. Pinning to a SHA is immutable. Use SHA pinning in workflows that have write access or deploy permissions.

---

## Secrets and Permissions

### Use the minimum required permissions

```yaml
permissions:
  contents: read       # read the repo
  pull-requests: write # comment on PRs
  # don't add write: all unless you need it
```

Set permissions at the job level, not the workflow level, when jobs have different needs.

### Reference secrets from the repository/environment secrets

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  API_KEY: ${{ secrets.STAGING_API_KEY }}
```

Never hardcode tokens or credentials in workflow files. Even in "private" repos.

### Use environments for deployment workflows

```yaml
jobs:
  deploy:
    environment: production   # requires manual approval if configured
    env:
      DEPLOY_TOKEN: ${{ secrets.PROD_DEPLOY_TOKEN }}
```

GitHub environments let you require manual approval before a workflow can access production secrets. Use them for any deployment that matters.

---

## Caching Dependencies

Caching can cut 60–80% off install time for large dependency trees.

```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: npm ci
```

The cache key includes a hash of `package-lock.json`. When the lockfile changes, the cache is invalidated and rebuilt. Perfect freshness without manual invalidation.

Same pattern for Python (`pip cache`), Go (module cache), Ruby (bundler), etc.

---

## Conditional Steps and Skip Logic

### Use `if:` to skip steps on certain conditions

```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: ./scripts/deploy.sh
```

### Skip entire workflows for docs-only changes

```yaml
on:
  push:
    paths-ignore:
      - "docs/**"
      - "*.md"
      - ".github/ISSUE_TEMPLATE/**"
```

Or use positive matching to only run on relevant changes:

```yaml
on:
  push:
    paths:
      - "src/**"
      - "tests/**"
      - "package*.json"
```

This prevents a README edit from triggering a full 10-minute test suite.

---

## Matrix Builds

Run the same job across multiple configurations without copy-pasting:

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
      fail-fast: false   # don't cancel other matrix jobs if one fails
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci && npm test
```

`fail-fast: false` is important for debugging — you want to see which combinations fail, not just that one failed.

---

## Debugging Failed Workflows

### Read the step that failed, not just the job summary

GitHub shows a ❌ on the job. Click through to the specific step. The error is usually in the last 10–20 lines of that step's output.

### Enable debug logging

Add `ACTIONS_STEP_DEBUG: true` as a repository secret (value: `true`) to get verbose output on every step. Remove it after debugging — it's noisy and can expose environment values.

### Re-run a single failed job

In the Actions UI → click the failed workflow run → click "Re-run failed jobs." You don't need to push a new commit to retry flaky tests.

### Use `act` for local testing

[`act`](https://github.com/nektos/act) runs GitHub Actions locally in Docker. It's not perfect (no real GitHub secrets, some actions don't work), but it's faster than push-and-wait for iterating on workflow syntax.

```bash
act pull_request       # simulate a pull_request event
act -j build           # run only the 'build' job
```

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Workflow never triggers | Check `on:` — branch names must match exactly, including `main` vs `master` |
| Step fails silently | Use `set -e` in multi-line `run:` blocks, or check exit codes |
| Secrets not available | Secrets aren't passed to PRs from forks by default — use `pull_request_target` carefully |
| Cache never hits | Cache key changed — check hash function and path |
| Actions running on every push | Add `paths:` or `paths-ignore:` filters |
| Workflow file not found | YAML syntax error — run `yamllint` or paste into the Actions editor |
| Job hangs forever | Add `timeout-minutes:` to all jobs |

---

## Next Step

→ `docs/10-github-actions/BRANCHING_STRATEGY.md` — how branch strategy affects which workflows run and when
