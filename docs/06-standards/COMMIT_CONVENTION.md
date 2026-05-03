# Commit Convention

A consistent commit format isn't bureaucracy — it's the foundation for automated changelogs, semantic versioning, and a readable git history that you can actually use to debug production incidents.

This repo follows the **Conventional Commits** specification.

---

## The Format

```text
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### The subject line (required)

```text
feat(auth): add OAuth2 login with Google
^    ^       ^
│    │       └─ short description — imperative, lowercase, no period
│    └────────── scope — what area of the codebase (optional but helpful)
└─────────────── type — what kind of change
```

**Rules for the subject line:**

- 50 characters or fewer (72 max if you must)
- Imperative mood: "add" not "added" or "adding"
- Lowercase
- No period at the end
- Describe *what* the commit does, not how

---

## Types

| Type | When to use |
|---|---|
| `feat` | A new feature visible to users or callers |
| `fix` | A bug fix |
| `docs` | Documentation changes only (no code) |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructure with no behavior change |
| `test` | Adding or updating tests |
| `chore` | Maintenance: deps, config, tooling, CI |
| `perf` | Performance improvement |
| `ci` | Changes to CI/CD workflows |
| `revert` | Reverts a previous commit |
| `build` | Build system or external dependency changes |

### Choosing between types

**`feat` vs `fix`:**

- `feat`: users gain a new capability they couldn't do before
- `fix`: existing behavior that was broken now works correctly

**`refactor` vs `fix`:**

- `refactor`: the external behavior is identical, the internal structure changed
- `fix`: the external behavior was wrong and is now correct

**`chore` vs `ci`:**

- `chore`: anything that's not user-facing and not CI (bump dependency versions, update `.gitignore`, regenerate lockfile)
- `ci`: changes to `.github/workflows/`, `Dockerfile`, `Makefile` targets, CI config files

---

## Scopes

Scopes are optional but recommended. They tell reviewers where to look.

```text
feat(auth): ...
fix(api): ...
docs(getting-started): ...
chore(deps): ...
```

Pick scopes that match your project's structure. Typical scopes:

| Project area | Scope |
|---|---|
| Authentication module | `auth` |
| REST API layer | `api` |
| Database layer | `db` |
| Frontend UI | `ui` |
| CLI tool | `cli` |
| Documentation | `docs` |
| Dependencies | `deps` |
| Tests | `tests` |

Don't over-scope. If the change touches the whole codebase, omit the scope.

---

## Breaking Changes

Breaking changes MUST be called out. Two ways:

**Option 1: `!` after the type/scope**

```text
feat(api)!: remove deprecated /v1/users endpoint
```

**Option 2: `BREAKING CHANGE:` in the footer**

```text
refactor(db): migrate from MySQL to PostgreSQL

BREAKING CHANGE: DATABASE_URL format changed.
Old format: mysql://user:pass@host/db
New format: postgresql://user:pass@host/db
Update your .env before deploying.
```

Both options trigger a **major version bump** in semantic versioning tools. Use them every time you break backward compatibility, no exceptions.

---

## The Body

The body is optional. Use it when the subject line can't tell the whole story.

```text
fix(auth): prevent session fixation on login

Before this fix, session IDs were not regenerated after successful
authentication. An attacker who obtains a pre-auth session ID could
use it post-auth. Now session.regenerate() is called after every
successful login.

Fixes #42
```

**Body guidelines:**

- Blank line between subject and body (required for git log to parse correctly)
- Wrap at 72 characters
- Explain *why* — the code shows *what*, the commit message explains *why*
- Reference issues and PRs where relevant

---

## Footers

Footers go after the body, separated by a blank line.

```text
feat(payments): add Stripe webhook verification

Adds HMAC signature verification to the Stripe webhook endpoint.
Without this, any HTTP client could trigger payment events.

Fixes #123
Reviewed-by: Jane Smith <jane@example.com>
BREAKING CHANGE: STRIPE_WEBHOOK_SECRET env var is now required.
```

Common footer tokens:

- `Fixes #<n>` — closes the issue when the PR is merged
- `Closes #<n>` — same as Fixes
- `Refs #<n>` — references without closing
- `BREAKING CHANGE:` — documents the breaking change
- `Reviewed-by:` — attribution
- `Co-authored-by:` — for paired work

---

## Examples

### Good commits

```text
feat(cart): add item quantity controls to cart page
```

```text
fix(api): return 404 instead of 500 when user not found

The user lookup was throwing an unhandled exception when the user
didn't exist in the database. Now returns a proper 404 with
{"error": "User not found"} response body.

Fixes #88
```

```text
docs: add MISCONCEPTIONS.md explaining Git vs GitHub
```

```text
chore(deps): upgrade express from 4.18.2 to 4.19.2
```

```text
feat(auth)!: require email verification before login

Previously users could log in immediately after registration.
Now they must verify their email address first.

BREAKING CHANGE: Existing unverified users will not be able to
log in until they verify their email. A migration script in
scripts/backfill-verification.js can send verification emails
to existing users.
```

### Bad commits (and why)

```text
fix stuff                     # no type, no scope, no description
WIP                           # not a real commit message
Added new feature for users   # past tense, no type
Update                        # uninformative
Fixed the bug that was causing the login page to not work correctly when the user had a session that expired # too long
```

---

## Why This Format?

### 1. Automated changelogs

Tools like `release-drafter` and `semantic-release` parse commit messages to generate changelogs automatically.

`feat` commits → "Features" section  
`fix` commits → "Bug Fixes" section  
`feat!` / `BREAKING CHANGE` → "Breaking Changes" section

Without consistent formatting, you're writing the changelog by hand every release.

### 2. Automated version bumping

Semantic versioning (MAJOR.MINOR.PATCH) maps directly to commit types:

| Commit type | Version bump |
|---|---|
| `BREAKING CHANGE` | MAJOR (1.0.0 → 2.0.0) |
| `feat` | MINOR (1.0.0 → 1.1.0) |
| `fix`, `perf`, others | PATCH (1.0.0 → 1.0.1) |

`semantic-release` or similar tools read your commits and determine the correct version automatically. No arguments about whether something is a major or minor change — the commit type decides.

### 3. Readable history

```bash
git log --oneline

feat(auth): add OAuth2 Google login
fix(api): correct pagination offset calculation
docs: update deployment guide for AWS
chore(deps): upgrade all minor versions
test(cart): add integration tests for checkout flow
refactor(db): extract query builder to separate module
```

This is a history you can actually reason about. You can find when a feature was added, when a bug was fixed, what changed in a deploy.

Compare to:

```bash
git log --oneline

misc changes
update
fix
wip
things
more stuff
final
final 2
```

### 4. Meaningful PR reviews

When commits are well-named, reviewers can understand the intent of each change without reading the code. `fix(auth): prevent session fixation on login` tells the reviewer exactly what to look for.

---

## Enforcing the Convention

### Locally with a commit-msg hook

Install `commitlint`:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

Create `commitlint.config.js`:

```javascript
module.exports = { extends: ["@commitlint/config-conventional"] };
```

Install the hook via `husky`:

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Now every commit is validated before it's saved.

### In CI with the PR title check

This repo's `01-pr-standards.yml` workflow validates that PR titles follow Conventional Commits format. PRs with non-conforming titles can't be merged.

### For squash merges

When squash-merging a PR, GitHub uses the PR title as the commit message. This is why PR titles should also follow Conventional Commits format — the PR title *becomes* the commit.

---

## Quick Reference Card

```text
feat(scope): description          → new feature (minor version bump)
fix(scope): description           → bug fix (patch version bump)
feat(scope)!: description         → breaking feature (major version bump)
docs: description                 → docs only, no release
style: description                → formatting only, no release
refactor(scope): description      → refactor, no behavior change
test(scope): description          → tests only
chore(scope): description         → maintenance, no release
perf(scope): description          → performance (patch version bump)
ci: description                   → CI config only
revert: revert <subject>          → undo a previous commit
```

---

## Next Step

→ `docs/06-standards/OPINIONATED_DEFAULTS.md` — the full set of conventions this repo enforces by default
