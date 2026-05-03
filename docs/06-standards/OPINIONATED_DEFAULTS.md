---

# Opinionated Defaults

This document records the specific choices we made so you don't have to debate them. Every default here has a reason. You can override any of them — but start here.

---

## Branch Naming

Use these prefixes. Enforce them with the `01-pr-standards.yml` workflow.

| Prefix | Use For | Example |
|---|---|---|
| `feature/` | New functionality | `feature/user-login` |
| `fix/` | Bug fixes | `fix/null-pointer-on-logout` |
| `docs/` | Documentation only | `docs/update-deployment-guide` |
| `chore/` | Maintenance, deps, config | `chore/upgrade-node-20` |
| `hotfix/` | Emergency production fix | `hotfix/payment-timeout` |
| `release/` | Release preparation | `release/v2.1.0` |

**Why:** Consistent branch names make PR lists readable and allow automated tooling to route branches correctly.

**Enforcement:** `.github/workflows/01-pr-standards.yml` rejects branches that don't match these patterns.

---

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Optional longer body. Explain WHY not WHAT.

Closes #42
```

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `revert`

**Rules:**
- Imperative mood: "Add feature" not "Added feature" or "Adding feature"
- Under 72 characters in the subject line
- Blank line between subject and body
- Reference issues in the footer: `Closes #N`, `Fixes #N`

**Good:** `fix(auth): handle uppercase email in login comparison`
**Bad:** `fixed stuff`, `WIP`, `asdf`

**Why:** Machine-readable commit messages enable automated changelogs, semantic versioning, and readable `git log`.

---

## Pull Request Rules

| Rule | Setting |
|---|---|
| PRs always required | Yes — no direct pushes to `main` |
| Minimum approvals | 1 for standard, 2 for security/infra |
| Author can self-approve | No |
| Stale review dismissal | Yes — new commits dismiss approvals |
| Conversations resolved | Required before merge |
| Branch up to date | Required |
| Status checks | All 00–05 workflows must pass |

**Why:** These rules prevent the most common team mistakes: merging without review, merging after a review is outdated, and merging with failing checks.

---

## Merge Strategy

**Default: Squash and merge**

Use squash merge for feature branches. This keeps `main` history linear and readable.

```
main:    A---B---S        (S = squashed feature)
feature:     C---D---E
```

**Exceptions:**
- Release branches → merge commit (preserve the release tag context)
- Hotfixes → merge commit (need full traceability for incident review)
- Long-running integration branches → merge commit (history matters)

**Why:** Squash keeps `main` clean. Each item on `main` is one logical change. Individual commit history lives on the feature branch PR for the duration you need it.

**Rebase merges: not recommended by default.** They rewrite SHA hashes and break bisect on complex histories.

---

## Code Review Turnaround

| Situation | Expected Response |
|---|---|
| Normal PR | 24 hours |
| Hotfix | 4 hours |
| Security PR | 4 hours, second reviewer required |
| Draft PR | No response required |

Reviewers acknowledge receipt with a comment if they can't complete the review within the window.

**Why:** Undefined expectations create bottlenecks. Explicit SLAs (Service Level Agreements) make the process predictable.

---

## Default Branch and Protection

- Default branch: `main`
- No direct pushes to `main` — ever
- Signed commits: optional for hobby, recommended for enterprise, required for government
- Force pushes: blocked on `main` permanently
- Branch deletion after merge: enabled (auto-delete merged branches)

---

## Versioning

Use [Semantic Versioning (SemVer)](https://semver.org/): `MAJOR.MINOR.PATCH`

| Bump | When |
|---|---|
| PATCH `1.0.x` | Bug fix, no API change |
| MINOR `1.x.0` | New feature, backwards compatible |
| MAJOR `x.0.0` | Breaking change |

Pre-release suffixes: `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1`

Tag format: `v1.2.3` (always prefix with `v`)

---

## File and Folder Naming

| Type | Convention | Example |
|---|---|---|
| Documentation | SCREAMING_SNAKE_CASE.md | `DEPLOYMENT.md` |
| Source files (JS/TS) | kebab-case | `task-service.js` |
| Source files (Python) | snake_case | `task_service.py` |
| Folders | kebab-case | `user-service/` |
| Environment variables | SCREAMING_SNAKE_CASE | `DATABASE_URL` |
| Constants in code | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |

---

## Secrets Management

| Environment | Secret Storage |
|---|---|
| Local development | `.env` file (gitignored) |
| CI/CD | GitHub Encrypted Secrets |
| Staging | Platform secret manager (AWS Secrets Manager, Vault, etc.) |
| Production | Platform secret manager — never on the filesystem |

`.env.example` must exist and document every variable. Never put real values in `.env.example`.

---

## Dependency Updates

Dependabot is configured in `.github/dependabot.yml` to check weekly.

- Auto-merge patch updates (lowest risk)
- Review minor and major updates manually
- Never auto-merge security updates without reading the advisory

---

## Why These Defaults Exist

Most teams spend weeks debating conventions and end up with inconsistent ones anyway. These defaults represent what experienced teams converge to after the debates. Adopt them, work with them for a month, and then override the ones that genuinely don't fit your context.

---

## Next Step

→ [Compliance documentation for regulated environments](docs/07-compliance/NIST_OVERVIEW.md)
