# Contributing to [PROJECT_NAME]

<!-- INSTRUCTION: Fill in all placeholders. A good CONTRIBUTING.md reduces back-and-forth
     on PRs and helps new contributors get productive quickly. Keep it honest:
     if review typically takes a week, say that — don't promise 48 hours you can't keep. -->

## Welcome

We're glad you want to contribute to [PROJECT_NAME]. This project is maintained by [team/org name]
and welcomes contributions of all kinds: bug reports, documentation improvements, feature proposals,
and code changes.

If you're not sure whether your planned change is a good fit, open an issue and ask first.
We'd rather discuss it early than have you invest time in a PR we can't merge.

---

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
The short version: be respectful, be constructive, and assume good intentions.

Violations can be reported to [conduct@your-domain.com].

---

## Getting Started

### 1. Fork and clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/[PROJECT_NAME].git
cd [PROJECT_NAME]
git remote add upstream https://github.com/[ORG]/[PROJECT_NAME].git
```

### 2. Create a branch

Always work on a branch, never directly on `main`.

```bash
git checkout -b [type]/[short-description]
# Examples:
#   feat/add-csv-export
#   fix/race-condition-task-assign
#   docs/update-deployment-guide
#   chore/upgrade-dependencies
```

### 3. Keep your fork up to date

```bash
git fetch upstream
git rebase upstream/main
```

---

## Development Setup

<!-- INSTRUCTION: These commands must work on a fresh checkout.
     Test them on a new machine or in a Docker container before publishing. -->

```bash
# Install dependencies
[npm ci | pip install -r requirements-dev.txt | bundle install]

# Copy the example environment file and fill in local values
cp .env.example .env

# Start local services (database, cache, etc.)
[docker-compose up -d]

# Run database migrations
[npm run db:migrate | python manage.py migrate]

# Start the development server
[npm run dev | python manage.py runserver | bundle exec rails server]

# Verify setup: open http://localhost:[PORT]
```

If setup fails, check [DEPLOYMENT.md](DEPLOYMENT.md) for prerequisite details,
or open an issue with your error output.

---

## Making Changes

### Branch naming

| Type | Prefix | Example |
|------|--------|---------|
| New feature | `feat/` | `feat/user-invitations` |
| Bug fix | `fix/` | `fix/null-pointer-on-empty-list` |
| Documentation | `docs/` | `docs/api-reference` |
| Refactor | `refactor/` | `refactor/extract-email-service` |
| Tests | `test/` | `test/add-coverage-for-auth` |
| Chores | `chore/` | `chore/upgrade-to-node-20` |

### Commit message format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <short summary in present tense>

<optional body — explain WHY, not what>

<optional footer — breaking changes, issue references>
```

**Examples:**

```text
feat(tasks): add CSV export for task lists

Closes #142

fix(auth): prevent token reuse after password reset

The old token was not invalidated when a password was changed,
allowing an attacker with a stolen token to maintain access.

Fixes #89

docs(contributing): add AI tools policy section
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`

---

## Testing

Before submitting a PR, ensure all tests pass locally:

```bash
# Run unit tests
[npm test | pytest | bundle exec rspec]

# Run integration tests
[npm run test:integration]

# Run linter
[npm run lint | flake8 | rubocop]
```

See [TESTING.md](TESTING.md) for full testing documentation.

**Requirements:**

- All existing tests must pass
- New behavior must have test coverage
- Bug fixes should include a regression test

---

## Submitting a Pull Request

1. **Push your branch** to your fork:

   ```bash
   git push origin [your-branch-name]
   ```

2. **Open a PR** against `main` (or the appropriate base branch).

3. **Fill in the PR template** completely. PRs with empty descriptions will be returned for revision.

4. **Link related issues** using `Closes #N` in the description so they auto-close on merge.

5. **Keep PRs focused** — one logical change per PR. Large PRs are hard to review and slow to merge.

6. **Respond to review comments** within [5 business days] or the PR may be closed.

### What makes a good PR description

- **What changed:** The specific behavior that is different
- **Why it changed:** The problem being solved or the value added
- **How to test it:** Steps the reviewer can follow to verify the change works
- **Risks:** Anything that could break or needs extra attention

---

## Code Review

### What to expect

- We aim to provide initial feedback within **[2–5 business days]**
- Reviews focus on correctness, maintainability, and test coverage — not style (that's the linter's job)
- Reviewers may request changes; this is normal and not personal
- Once approved, a maintainer will merge your PR

### Review standards

Reviewers will look at:

- Does the code do what the PR claims?
- Are edge cases handled?
- Are there tests for the new behavior?
- Is the code readable by someone unfamiliar with this area?
- Are there any security implications?
- Is the PR appropriately scoped, or does it mix unrelated changes?

---

## AI Tools Policy

<!-- INSTRUCTION: Define your project's position on AI-assisted code.
     Options range from "no AI tools" to "AI welcome with review" to "AI required".
     Whatever you choose, be explicit. Ambiguity leads to inconsistency. -->

[Choose one of the following positions and delete the others:]

**Option A — AI tools permitted with review:**
AI tools (GitHub Copilot, Claude, ChatGPT, Cursor, etc.) are permitted for writing code,
tests, and documentation. All AI-generated content must be reviewed and understood by the
contributor before submitting. You are responsible for the correctness of what you submit,
regardless of how it was generated. Mark AI-assisted code in your PR description.

**Option B — AI tools encouraged:**
This project is developed with AI assistance. We encourage contributors to use AI tools
to move faster. The PR checklist includes a reminder to review AI-generated code before merging.

**Option C — No AI tools:**
This project does not accept AI-generated code contributions. Please write all code yourself.
This policy exists because [reason: e.g., license concerns / compliance requirement / quality standard].

---

## Questions?

- Open a [GitHub Discussion](https://github.com/[ORG]/[PROJECT_NAME]/discussions) for questions
- Open an [Issue](https://github.com/[ORG]/[PROJECT_NAME]/issues) for bugs or feature requests
- Reach the maintainers at [contact@your-domain.com]
