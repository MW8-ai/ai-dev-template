# Release Process

How to tag, document, and publish a versioned release.

Related docs: [MERGE_STRATEGIES.md](./MERGE_STRATEGIES.md) | [ISSUE_TO_BRANCH_TO_PR.md](./ISSUE_TO_BRANCH_TO_PR.md)

---

## Quick Path

1. Ensure `main` is stable and all CI (Continuous Integration) checks pass
2. Update `CHANGELOG.md` with release notes for this version
3. Commit the changelog:

   ```bash
   git add CHANGELOG.md
   git commit -m "chore: prepare release v1.2.0"
   ```

4. Tag the release:

   ```bash
   git tag -a v1.2.0 -m "Release v1.2.0"
   ```

5. Push the tag:

   ```bash
   git push origin v1.2.0
   ```

6. On GitHub: **Releases → Draft a new release → Choose tag → Paste changelog → Publish**
7. If needed: trigger deployment via CI/CD pipeline or run the manual deploy command

---

## Full Explanation

### Semantic Versioning (SemVer)

SemVer is the standard version numbering format: `MAJOR.MINOR.PATCH`

| Part | When to Bump | Example |
|---|---|---|
| **MAJOR** | Breaking change — existing users must change how they use your software | `v1.9.0 → v2.0.0` |
| **MINOR** | New feature added, backwards compatible — existing users are unaffected | `v1.2.4 → v1.3.0` |
| **PATCH** | Bug fix, backwards compatible — no new features | `v1.2.3 → v1.2.4` |

Rules:

- When you bump MAJOR, reset MINOR and PATCH to 0: `v2.0.0`
- When you bump MINOR, reset PATCH to 0: `v1.3.0`
- Start at `v0.1.0` for initial development; `v1.0.0` signals the first stable public release
- Never reuse a version number

**Breaking change examples:**

- Renaming or removing a public API endpoint
- Changing the format of a config file
- Dropping support for a major runtime version (e.g., Node.js 16 → 18 only)

**Non-breaking change examples:**

- Adding a new API endpoint
- Adding optional parameters to an existing function
- Performance improvements with no behavior change

### CHANGELOG.md Format

Follow the [Keep a Changelog](https://keepachangelog.com/) convention:

```markdown
# Changelog

## [Unreleased]

## [1.2.0] - 2026-05-03

### Added
- User login via email and password (#42)
- Password reset flow with email verification (#51)

### Changed
- Session timeout extended from 30 to 60 minutes (#55)

### Fixed
- Null pointer error when session expires during checkout (#91)

### Removed
- Legacy `/api/v1/auth` endpoint (deprecated since v1.0.0)

## [1.1.2] - 2026-04-15

### Fixed
- Payment webhook silently dropped orders over $10,000 (#88)
```

Sections in order: **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**, **Security**

Keep an `[Unreleased]` section at the top during development. When releasing, rename it to the version number and date, then add a new empty `[Unreleased]` section above it.

### Git Tags: Annotated vs Lightweight

**Annotated tags** (preferred):

```bash
git tag -a v1.2.0 -m "Release v1.2.0"
```

- Stored as full git objects with a tagger name, email, date, and message
- Shown by `git describe`
- Can be signed with GPG

**Lightweight tags**:

```bash
git tag v1.2.0
```

- Just a pointer to a commit — no metadata
- Not recommended for releases because there is no record of who tagged it or when

Always use annotated tags (`-a`) for releases.

### GitHub Releases

After pushing a tag, create a GitHub Release to make it visible to users and attach release artifacts.

Steps:

1. Go to your repository on GitHub
2. Click **Releases** in the right sidebar (or navigate to `/releases`)
3. Click **Draft a new release**
4. Under **Choose a tag**, select the tag you just pushed (`v1.2.0`)
5. Set the **Release title** to `v1.2.0` (or a descriptive name like `v1.2.0 — Login & Password Reset`)
6. Paste the changelog entry for this version into the description
7. If attaching binaries (compiled executables, zip files), drag them into the assets section
8. Click **Publish release**

GitHub will send a notification to users who are watching the repository for releases.

### Release Branches

For most projects, releasing directly from `main` is sufficient. Release branches are needed when:

- You must maintain multiple major versions simultaneously (e.g., a library that supports both v1 and v2)
- You need to ship hotfixes to a deployed version while `main` has moved ahead significantly

Release branch naming convention: `release/v1.2.x` or `release/1.2`

```bash
# Create a release branch from a tag
git checkout -b release/v1.2.x v1.2.0
git push origin release/v1.2.x
```

Hotfixes to a release branch are cherry-picked back to `main`:

```bash
git cherry-pick <commit-sha>
```

### Pre-Releases

Use suffixes to signal unstable versions:

| Suffix | Meaning |
|---|---|
| `-alpha.1` | Early, unstable build — known to be incomplete |
| `-beta.1` | Feature-complete but may have bugs — for broader testing |
| `-rc.1` | Release Candidate — intended as the final version unless a bug is found |

Example: `v2.0.0-alpha.1`, `v2.0.0-beta.2`, `v2.0.0-rc.1`, then `v2.0.0`

On GitHub, check **"This is a pre-release"** when publishing so users know not to use it in production.

### Hotfix Process

When a critical bug is found in production and `main` already has unreleased changes:

1. **Create a hotfix branch from the release tag, not from main:**

   ```bash
   git checkout -b hotfix/issue-201-payment-crash v1.2.0
   ```

2. Fix the bug, write a test, commit:

   ```bash
   git commit -m "fix: prevent crash on payment over $10,000 (#201)"
   ```

3. Tag and release the hotfix:

   ```bash
   git tag -a v1.2.1 -m "Release v1.2.1"
   git push origin hotfix/issue-201-payment-crash
   git push origin v1.2.1
   ```

4. Merge the fix back to `main` so it is not lost in the next release:

   ```bash
   git checkout main
   git merge hotfix/issue-201-payment-crash
   ```

5. If you maintain a release branch (`release/v1.2.x`), merge there too:

   ```bash
   git checkout release/v1.2.x
   git merge hotfix/issue-201-payment-crash
   ```

6. Delete the hotfix branch and publish the GitHub Release.

---

## Next Step

→ [docs/03-development-workflow/RELEASE_VERSIONING.md](docs/03-development-workflow/RELEASE_VERSIONING.md) — semantic versioning rules, release labels, and rollback planning
