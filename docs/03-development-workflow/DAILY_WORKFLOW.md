# Daily Git Workflow

A developer's daily git routine — commands, order, and the reasoning behind each step.

Related docs: [ISSUE_TO_BRANCH_TO_PR.md](./ISSUE_TO_BRANCH_TO_PR.md) | [CODE_REVIEW.md](./CODE_REVIEW.md)

---

## Quick Path

**Morning:**

```bash
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main
# resolve conflicts if any, then start working
```

**During the day:**

```bash
git status                      # before every commit
git add -p                      # stage interactively
git commit -m "verb: short description"
git push origin your-branch     # push at least at end of each session
```

**End of day:**

```bash
git push origin your-branch     # push any remaining work
# check GitHub for review comments on open PRs
# update the issue if your status changed
```

---

## Full Explanation

### Morning Routine

#### 1. Switch to main and pull

```bash
git checkout main
git pull origin main
```

Before starting work, sync your local `main` branch with the remote. Other developers merged code overnight. If you skip this step, your feature branch will diverge from the current state of the project, and conflicts grow larger over time.

#### 2. Switch to your feature branch

```bash
git checkout feature/issue-42-user-login
```

Never work directly on `main`. Your feature branch is your workspace.

#### 3. Bring in changes from main

You have two options: merge or rebase.

**Option A — Merge (safe, preserves history):**

```bash
git merge main
```

This creates a merge commit that ties the two histories together. The branch history remains intact. Prefer this when working in a team and you want to preserve exactly when the sync happened.

**Option B — Rebase (clean, rewrites history):**

```bash
git rebase main
```

This replays your commits on top of the latest `main`, as if you had started your branch from today. The result is a linear history with no merge commits. Prefer this for personal branches when you want a clean history before opening a PR.

**When to use which:**

- Working with others on the same branch: use `merge`
- Solo on your own feature branch: either works; `rebase` gives cleaner history
- Branch has already been pushed and others may have pulled it: use `merge` to avoid rewriting shared history

#### 4. Resolve conflicts if any

If both you and another developer changed the same lines, git will flag a conflict:

```text
<<<<<<< HEAD
const timeout = 30;
=======
const timeout = 60;
>>>>>>> main
```

Open the file, decide which version is correct (or write a third version that's better than both), remove the conflict markers, then:

```bash
git add path/to/file.js
git merge --continue    # or: git rebase --continue
```

---

### During the Day

#### Check status before every commit

```bash
git status
```

This shows you which files are staged, which are modified but not staged, and which are untracked. Never commit without running this first — it prevents accidental commits of debug files, `.env` files, or generated output.

#### Stage interactively

```bash
git add -p
```

The `-p` flag (patch mode) walks you through each changed chunk and asks whether to stage it. This forces you to read what you are committing and lets you split a batch of changes into separate logical commits.

For example, if you fixed two bugs in one session, `git add -p` lets you stage the first bug's changes, commit them, then stage and commit the second bug separately — even though the changes happened in the same working session.

```bash
# For new files not yet tracked, you need git add first:
git add new-file.js
# Then stage changes interactively for modified files:
git add -p
```

#### Write clear commit messages

Format: `verb: short description` — use the imperative mood, lowercase, no period.

```bash
git commit -m "add email validation to login form"
git commit -m "fix null pointer in session handler"
git commit -m "refactor auth module to use dependency injection"
git commit -m "update CHANGELOG for v1.3.0"
```

**When to commit:** After each logical step, not after each line and not after a full day. A good rule: if you could explain the commit in one sentence without using "and", it is the right size.

Good commit: `"fix login redirect for unauthenticated users"`
Too big: `"fix login, add tests, update docs, upgrade eslint"`

#### Push regularly

```bash
git push origin feature/issue-42-user-login
```

Push at the end of every working session, minimum. Pushing serves as a backup, makes your work visible to teammates, and keeps your PR up to date. Do not let a full day of work exist only on your local machine.

---

### End of Day

```bash
# Push anything uncommitted or unpushed
git push origin feature/issue-42-user-login

# Check GitHub for review comments
# (open your PR in the browser or use the GitHub CLI)
gh pr view --web

# Update the issue if your status changed
# e.g., comment "Blocked on design approval" or "Code complete, in review"
```

---

### Useful Commands for Context-Switching

#### git stash — save work in progress without committing

When you need to switch branches to fix an urgent bug but your current work is not ready to commit:

```bash
# Save your uncommitted changes
git stash

# Switch to another branch, do the urgent work, come back
git checkout main
# ... fix the bug, commit, return ...
git checkout feature/issue-42-user-login

# Restore your saved changes
git stash pop
```

`git stash pop` applies the most recent stash and removes it from the stash list. Use `git stash list` to see all saved stashes if you have accumulated more than one.

#### git log --oneline — quick history view

```bash
git log --oneline
```

Output:

```text
a3f9c12 add email validation to login form
b8e2d01 fix null pointer in session handler
c1a4f88 initial login form scaffold
```

Add `--graph` for a visual branch diagram:

```bash
git log --oneline --graph --all
```

#### git diff — see changes before committing

```bash
# See all unstaged changes
git diff

# See staged changes (what will go into the next commit)
git diff --staged

# See changes between your branch and main
git diff main...HEAD
```

Always run `git diff --staged` before `git commit` to confirm exactly what is about to be committed.

---

## Next Step

→ [docs/03-development-workflow/CODE_REVIEW.md](docs/03-development-workflow/CODE_REVIEW.md) — how to give and receive code reviews: what to check, how to comment, and how to keep PRs moving
