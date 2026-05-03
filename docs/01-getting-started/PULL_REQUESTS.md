# Pull Requests

A pull request (PR) is how code gets reviewed and merged. It is the central collaboration mechanism on GitHub.

## Quick Path

```bash
# 1. Push your branch to GitHub
git push origin feature/my-feature
```

2. Go to your repository on GitHub — a yellow banner appears: "Compare & pull request." Click it.
3. Write a clear title and a description that explains what changed, why, and how to test it.
4. In the right sidebar, assign one or more **Reviewers**.
5. Click **Create pull request**.
6. Respond to review comments: make changes locally, commit, push — the PR updates automatically.
7. Once a reviewer clicks **Approve**, click **Merge pull request** → **Confirm merge**.
8. Delete the branch when GitHub prompts you to (it is safe — the commits live in `main` now).
9. Update your local copy:

```bash
git checkout main
git pull origin main
git branch -d feature/my-feature  # delete the local copy of the branch
```

---

## Full Explanation

### What a Pull Request Is and Why It Matters

A PR is a request for your branch to be "pulled into" another branch (usually `main`). But it is more than a merge button — it is a structured conversation about the code.

PRs matter for three reasons:

**Code review:** A second set of eyes catches bugs, logic errors, security issues, and inconsistencies with team conventions. Studies consistently show code review is one of the most effective defect-detection methods.

**Discussion and documentation:** PR comments are a permanent record of why decisions were made. Six months later, `git blame` on a line leads you to the PR, and the PR shows you the full discussion.

**History and auditability:** Regulated environments (finance, healthcare, security) often require evidence that changes were reviewed before deployment. A merged PR provides that.

### What Makes a Good PR Title

The title appears in commit history, email notifications, and the PR list. Make it instantly clear.

| Bad | Good |
|---|---|
| `fix bug` | `Fix login failure when email address has uppercase letters` |
| `update` | `Update pricing page copy for Q3 campaign` |
| `WIP` | Use a Draft PR instead (see below) |
| `changes` | `Add rate limiting to the public API endpoints` |
| `new feature` | `Add CSV export to the reports dashboard` |

Formula: **[Verb] [what] [context if needed].** Keep it under 72 characters.

### What Makes a Good PR Description

A description is not required but is almost always worth writing. Reviewers need to understand:

**What changed:** A brief summary of the code changes. Do not repeat the commit messages word for word — summarize the overall change.

**Why it changed:** The motivation. Link to the issue or ticket: "Fixes #142" (GitHub will automatically close issue #142 when the PR merges).

**How to test it:** The exact steps to verify the change works. Reviewers should not have to guess.

**Screenshots:** If you changed a UI, include before and after screenshots. Nothing speeds up UI review like visuals.

A solid template:

```markdown
## What changed
Replaced the custom session token validation logic with the `jsonwebtoken`
library. The old implementation had an off-by-one error in expiry checking.

## Why
Fixes #142 — users were being logged out 1 second early, causing failures
on slow connections.

## How to test
1. Log in with any account
2. Wait 55 minutes without interacting
3. Perform any action at the 59-minute mark — you should stay logged in
4. At 61 minutes, you should be redirected to the login page

## Screenshots
N/A — no UI changes
```

### The Review Process

After submitting the PR, assigned reviewers receive an email notification.

**As the author, during review:**
- Watch for review comments in your GitHub notifications or email
- For each comment: either make the change and push, or reply explaining why you disagree
- After pushing fixes: reply to comments with "Fixed in [commit hash]" or click "Resolve conversation" if the reviewer asked you to make a call
- Do not force-push to a branch under review — it makes it hard for reviewers to see what changed
- If you want a re-review after making changes, click **Re-request review** next to the reviewer's name

**As a reviewer, you have three options:**

| Action | Meaning |
|---|---|
| **Comment** | Leaving feedback without a formal verdict. The PR can still be merged. |
| **Approve** | You are satisfied with the changes. The PR is ready to merge. |
| **Request changes** | The PR should not be merged until specific issues are addressed. |

A common practice: distinguish between blocking and non-blocking feedback in comments. Use "nit:" prefix for minor style preferences that are not blockers:

```
nit: this variable name could be more descriptive, but it's fine as is
```

vs.

```
This will panic with a null pointer if `user.profile` is not set —
we need to add a null check here before the PR can merge
```

### Draft PRs

A Draft PR signals "I'm not ready for review yet." Use drafts to:

- Share work-in-progress with teammates for early informal feedback
- Get CI (Continuous Integration) checks running on your branch before it's review-ready
- Document what you're working on

To create a draft: when clicking "Create pull request," use the dropdown arrow and select **Create draft pull request**. When you're ready: click **Ready for review** on the PR page.

### Merging Options

GitHub offers three merge strategies. The repository settings may restrict which are available.

**Merge commit** (`git merge --no-ff`)
Creates a merge commit that ties the two branch histories together. The commit history shows when the branch diverged and when it merged. Best for: tracking feature completions, preserving full context.

```
* merge commit (main)
|\
| * commit 3 (feature branch)
| * commit 2
| * commit 1
|/
* previous commit (main)
```

**Squash and merge**
Combines all commits from the PR into one single commit on `main`. The feature branch's messy intermediate commits ("fix typo", "WIP", "oops forgot to save") disappear. Best for: keeping `main` history clean and readable.

```
* squashed commit (main) ← all feature branch commits combined
* previous commit (main)
```

**Rebase and merge**
Replays each commit from the feature branch on top of `main`, producing a linear history without a merge commit. Best for: teams that prefer linear history and are disciplined about commit messages.

See the repository's MERGE_STRATEGIES.md for which strategy your team uses.

### After Merge: Clean Up

After merging:

1. Click **Delete branch** on the GitHub PR page — this removes the remote branch
2. On your local machine:

```bash
# Switch back to main
git checkout main

# Pull the merged changes
git pull origin main

# Delete your local branch
git branch -d feature/my-feature
# If the branch wasn't fully merged to your local main yet, Git will warn you.
# Use -D (capital D) only if you're certain you don't need it.
```

Deleted branches are not gone — Git keeps all their commits. You can restore a branch from GitHub (there's a **Restore branch** button on the closed PR) or locally with `git checkout -b feature/my-feature <last-commit-hash>`.

---

## What to Read Next

- `docs/01-getting-started/BRANCH_PULL_MERGE.md` — branches and conflict resolution
- `docs/01-getting-started/COMMON_MISTAKES.md` — mistakes people make with PRs and how to recover
