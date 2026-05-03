# Issue to Branch to Pull Request

The full professional development cycle — from a reported problem or planned feature to merged code.

Related docs: [DAILY_WORKFLOW.md](./DAILY_WORKFLOW.md) | [CODE_REVIEW.md](./CODE_REVIEW.md) | [MERGE_STRATEGIES.md](./MERGE_STRATEGIES.md)

---

## Quick Path

1. Create or find a GitHub Issue describing the work
2. Create a branch tied to that issue:
   ```bash
   git checkout -b feature/issue-42-user-login
   ```
3. Write code, make small and frequent commits
4. Push your branch:
   ```bash
   git push origin feature/issue-42-user-login
   ```
5. Open a Pull Request (PR) on GitHub, reference the issue in the body (`Closes #42`)
6. Get code review, address every piece of feedback
7. Merge PR — the issue auto-closes when "Closes #42" is in the PR body

---

## Full Explanation

### Why Issues Before Code

Starting with a GitHub Issue — even for small changes — captures the context that code cannot: why the work is being done, what problem it solves, and any decisions made before the first line is written. Issues enable asynchronous collaboration (teammates can comment before work starts), create a permanent history, and let managers and stakeholders track what is being worked on without reading commits.

If you skip the issue and go straight to code, future developers (including you in six months) have no record of why a change was made. The commit message says *what*, the issue says *why*.

### Issue Types

| Type | When to Use | Label |
|---|---|---|
| **Bug** | Something is broken or behaving incorrectly | `bug` |
| **Feature** | A new capability that does not exist yet | `enhancement` |
| **Task** | Work that is not code (documentation, config, setup) | `task` |
| **Tech Debt** | Refactoring or cleanup with no user-visible change | `tech-debt` |

When filing a bug, include: what you expected, what actually happened, and steps to reproduce. When filing a feature, include: the user need it solves and any acceptance criteria.

### Branch Naming

Use a prefix that signals the nature of the change, followed by the issue number and a short slug:

| Prefix | Use For |
|---|---|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation only |
| `chore/` | Non-production changes (CI, tooling, deps) |
| `hotfix/` | Urgent fix to a production release |

Examples:
```
feature/issue-42-user-login
fix/issue-91-null-pointer-logout
docs/issue-55-update-readme
chore/issue-10-upgrade-eslint
hotfix/issue-201-payment-crash
```

The issue number in the branch name makes it easy to look up context without searching. The short slug makes the branch readable in a terminal or PR list.

### Linking Branches to Issues

Two mechanisms exist:

1. **Naming convention**: Include `issue-42` in the branch name. This is visible but not enforced by GitHub — it is a team convention.
2. **GitHub's "Development" panel**: Open the issue on GitHub, click "Development" in the sidebar, and link the branch directly. GitHub will then show PR status on the issue.

Use both: name the branch with the issue number, and link it through GitHub's UI.

### Commit Often, Push Often

Small, frequent commits are better than one large commit for several reasons:

- **Easier to review**: A reviewer can understand one logical change at a time.
- **Easier to revert**: If one commit breaks something, you can revert just that commit.
- **Easier to debug**: `git bisect` can find the exact commit that introduced a bug.
- **Safer**: Pushing frequently means your work is backed up and visible to your team.

Aim to commit every time you complete a logical unit of work — a function, a test, a fix — not after every line and not after an entire day of work.

```bash
# Commit message format: verb + short description (imperative mood)
git commit -m "add email validation to login form"
git commit -m "fix null check in user session handler"
git commit -m "update README with setup instructions"
```

### PR Body Template

When opening a PR, fill in the description. A minimal PR description:

```
## What changed
- Added email validation before login form submission
- Returns a 422 error with a user-friendly message on invalid email

## Why
Fixes #42 — users were able to submit the login form with a malformed
email, causing a 500 error on the backend.

## How to test
1. Run `npm run dev`
2. Navigate to /login
3. Enter "notanemail" in the email field and submit
4. Confirm you see the validation error message

## Closes #42
```

The `Closes #42` line at the end is what triggers GitHub to auto-close the issue when the PR is merged. Without it, the issue stays open and must be closed manually.

### Code Review Cycle

After opening the PR:

1. **Assign a reviewer** — don't wait for someone to find it.
2. **Author reads every comment** and either makes the change or responds with a reason why not.
3. **Author marks conversations resolved** only after addressing them (not to dismiss them).
4. **Author re-requests review** after pushing changes — don't make reviewers search for updates.
5. **Do not merge your own PR** without at least one approval, except on solo projects.

If a review comment is taking too long, move the discussion to a Slack message or call rather than letting the PR sit.

### Post-Merge

After the PR is merged:

```bash
# Delete the remote branch (GitHub offers this automatically after merge)
# Then clean up locally:
git checkout main
git pull origin main
git branch -d feature/issue-42-user-login
```

Check that the issue was auto-closed. If not, close it manually with a comment linking to the merged PR.

---

## Next Step

→ [docs/03-development-workflow/DAILY_WORKFLOW.md](docs/03-development-workflow/DAILY_WORKFLOW.md) — the daily git routine: morning sync, committing, pushing, and end-of-day habits
