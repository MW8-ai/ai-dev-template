# Common Git Mistakes and How to Fix Them

These are the real mistakes developers make — not contrived examples. Each entry has the symptom you'll see, why it happened, and the exact fix.

---

## 1. Committed to main directly instead of a branch

**Symptom:** You ran `git commit` and realized you're on `main`, not a feature branch. The commit hasn't been pushed yet (or has been).

**Cause:** Forgot to run `git checkout -b` before starting work.

**Fix (commit not yet pushed):**

```bash
# 1. Create a new branch pointing at your current (main) commit
git branch feature/my-feature

# 2. Move main back to where it was before your commit
git reset HEAD~1  # moves main back one commit; your changes stay in your working directory

# 3. Switch to your feature branch
git checkout feature/my-feature

# 4. Stage and re-commit on the correct branch
git add .
git commit -m "Your message"
```

**Fix (commit already pushed to main):**

This is more serious if `main` is a protected branch. If you can push to `main` directly:

```bash
# 1. Create the feature branch from current main
git checkout -b feature/my-feature

# 2. Go back to main
git checkout main

# 3. Undo the commit on main (soft reset keeps changes staged)
git reset --soft HEAD~1

# 4. Force-push main back (only if you're the only one who could have pulled it)
git push --force-with-lease origin main

# 5. Commit on the feature branch instead
git checkout feature/my-feature
git push origin feature/my-feature
```

If `main` is protected, ask an admin to revert the commit via GitHub's UI.

---

## 2. Pushed sensitive data (API key, password) to GitHub

**Symptom:** You notice a secret in a committed file. It may have been pushed to a public or private repository.

**Cause:** Forgot to add the file to `.gitignore`, or accidentally staged `.env`.

**Fix:**

```bash
# Step 0: Revoke the secret IMMEDIATELY
# Log into the service (AWS, Stripe, etc.) and revoke or rotate the key.
# This must happen before anything else — GitHub scanners and bots harvest
# leaked keys within seconds of a push to a public repo.

# Step 1: Remove the file from tracking (but keep it locally)
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from tracking and add to .gitignore"
git push

# Step 2: Remove from history using git filter-repo (install first: pip install git-filter-repo)
git filter-repo --path .env --invert-paths
git push --force-with-lease origin main

# Step 3: Ask GitHub support to purge cached views if the repo was public
# GitHub stores cached views that persist even after force-push
```

> **Warning:** `git filter-repo` rewrites all commits that touched the file. Everyone with a clone of the repo must re-clone. Coordinate with your team before doing this.

The `.gitignore` must be committed before you will ever accidentally commit a secret again. See the `.gitignore` template at the root of this repo.

---

## 3. Merge conflict panic — abandoned the branch

**Symptom:** You ran `git merge` or `git pull`, saw conflict markers in files, panicked, and are unsure what state your repo is in.

**Cause:** Two branches modified the same lines in the same file.

**Fix:**

```bash
# Option A: Abort the merge entirely and return to clean state
git merge --abort
# Your branch is back to where it was before you started the merge

# Option B: Resolve the conflicts manually
# 1. Find conflicted files
git status
# both modified: src/auth.js

# 2. Open each file. Find and resolve conflict markers:
# <<<<<<< HEAD
# your version
# =======
# incoming version
# >>>>>>> main
# Edit the file to its correct final state. Remove the markers.

# 3. Stage each resolved file
git add src/auth.js

# 4. Complete the merge
git commit
```

VS Code makes this easier: open the conflicted file and it shows colored sections with one-click "Accept Current Change / Accept Incoming Change / Accept Both Changes" buttons.

---

## 4. Wrong commit message — can I change it after pushing?

**Symptom:** You pushed a commit with a terrible message ("asdf", "fix", "please work") and want to fix it.

**Cause:** Rushed commit before pushing.

**Fix (not yet pushed):**

```bash
# Amend the most recent commit message (before pushing)
git commit --amend -m "Add email validation to the signup form"
# This rewrites the commit — fine before pushing, dangerous after
```

**Fix (already pushed, and you are the only one with this branch):**

```bash
# Amend locally
git commit --amend -m "Better message here"

# Force-push the amended commit (only safe if nobody else has pulled this branch)
git push --force-with-lease origin feature/my-branch
```

**Fix (already pushed to main, or others have the branch):**

Do not amend. Create a new commit with a clarifying message instead:

```bash
git commit --allow-empty -m "Note: previous commit 'asdf' implemented X — see PR #42 for details"
```

Or just leave it. A bad commit message in history is a minor problem. Rewriting shared history is a major problem.

---

## 5. Forgot to pull before starting work — now there are conflicts

**Symptom:** You ran `git push` and got "rejected — your branch is behind the remote." When you pull, you get merge conflicts.

**Cause:** Your local `main` was behind the remote when you started your branch. Others merged changes while you were working.

**Fix:**

```bash
# 1. Fetch the latest state from GitHub without merging
git fetch origin

# 2. See what's different
git log HEAD..origin/main --oneline

# 3a. If you're on main and haven't branched yet, just pull
git pull origin main

# 3b. If you're on a feature branch, rebase your branch on top of main
git rebase origin/main
# Resolve any conflicts that arise (see mistake #3 above), then:
git rebase --continue

# 3c. Or merge main into your feature branch (simpler, creates a merge commit)
git merge origin/main
```

**Prevention:** At the start of every work session:

```bash
git checkout main && git pull origin main && git checkout your-branch
```

---

## 6. git add . included files that shouldn't be committed

**Symptom:** `git status` shows or `git diff --cached` reveals files you didn't intend to stage (build artifacts, test databases, local config files).

**Cause:** Used `git add .` without checking what it would capture.

**Fix:**

```bash
# Unstage a specific file (keeps changes in your working directory)
git restore --staged path/to/file.db

# Unstage all staged changes at once
git restore --staged .

# Then check what's staged before committing
git diff --cached

# Add only what you want
git add src/feature.js src/feature.test.js
git commit -m "Add feature"
```

**Prevention:** Add build artifacts, databases, and generated files to `.gitignore` before they ever get staged. Use `git status` or `git diff --cached` to review staged changes before every commit.

---

## 7. Deleted a branch before merging (how to recover)

**Symptom:** You deleted a branch (locally or on GitHub) that had commits you needed. The commits seem gone.

**Cause:** Ran `git branch -D` (force delete) locally, or clicked Delete on GitHub prematurely.

**Fix (deleted locally, still on GitHub):**

```bash
# The remote branch still exists — just check it out again
git fetch origin
git checkout -b feature/my-feature origin/feature/my-feature
```

**Fix (deleted on GitHub, still have local branch):**

```bash
git push origin feature/my-feature
```

**Fix (deleted both local and remote):**

Git keeps "orphaned" commits for about 30 days before garbage collecting them. Find the commit hash:

```bash
# Show the reflog — a log of every position HEAD has been at
git reflog
# a3f9b12 HEAD@{4}: commit: Add login page
# d4e5678 HEAD@{5}: checkout: moving from feature/my-feature to main

# Recreate the branch pointing at that commit
git checkout -b feature/my-feature a3f9b12
```

Also check GitHub: closed PR pages have a **Restore branch** button that works even after deletion.

---

## 8. Force pushed and overwrote someone else's work

**Symptom:** A teammate is missing commits from a branch. Their work is gone. `git log` on the branch doesn't show their commits.

**Cause:** Someone ran `git push --force` (without `--lease`) on a shared branch, replacing the remote branch with their local version and discarding commits that existed only on the remote.

**Fix:**

```bash
# Find the teammate's commits in the reflog on their machine
# Ask them to run:
git reflog

# Or search the repository's reflog on GitHub (Settings → Branches → View reflog, if enabled)

# Once you have the commit hash of the lost work:
git checkout -b recovery/teammates-work <their-commit-hash>

# Cherry-pick those commits back to the branch
git checkout feature/shared-branch
git cherry-pick <commit-hash-1> <commit-hash-2>
git push origin feature/shared-branch
```

**Prevention:** Never use `git push --force` on a shared branch. Always use `git push --force-with-lease` — it fails if the remote has commits your local copy doesn't know about, protecting against exactly this scenario.

---

## 9. "Detached HEAD" state — what it means and how to get back

**Symptom:** `git status` shows `HEAD detached at a3f9b12`. You're nervous about what that means.

**Cause:** You checked out a specific commit hash, tag, or remote branch without creating a local branch. You are now "on" a commit rather than on a branch. New commits you make here are not attached to any branch and will be lost when you switch away.

**Fix:**

```bash
# If you haven't made any commits in detached HEAD state
# Just switch back to your branch
git checkout main
# or
git switch main

# If you made commits in detached HEAD state that you want to keep
# Create a branch from your current position before switching away
git checkout -b salvage/detached-work
# Now those commits are on a real branch

# Alternatively, cherry-pick the commits onto an existing branch
git log --oneline  # note the commit hashes
git checkout main
git cherry-pick <commit-hash>
```

Detached HEAD is not dangerous as long as you understand it. It is useful for inspecting old commits. Just don't commit there unless you immediately create a branch.

---

## 10. .gitignore not working because file was already tracked

**Symptom:** You added a file to `.gitignore` but `git status` still shows it as modified. Adding it to `.gitignore` didn't stop Git from tracking it.

**Cause:** `.gitignore` only prevents **new** files from being tracked. If a file was already committed, Git continues tracking it regardless of `.gitignore`.

**Fix:**

```bash
# Remove the file from Git's index (tracking) without deleting it from disk
git rm --cached path/to/file.log

# For a directory
git rm --cached -r build/

# Commit the removal
git commit -m "Stop tracking build/ output directory"

# Now .gitignore will prevent it from being re-added
```

After this, the file stays on your disk but Git ignores it. Your teammates should do the same (the file won't be deleted from their machines by the commit — they'll just stop tracking it after they pull and run `git rm --cached`).

---

## What to Read Next

- `docs/01-getting-started/GIT_TERMS_EXPLAINED.md` — understand the concepts behind these fixes
- `docs/02-dev-environment/GIT_CLI_SETUP.md` — full command reference
- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — fix authentication errors

---

## Next Step

→ [docs/05-confusion-troubleshooting/COMMON_PITFALLS_AND_TROUBLESHOOTING.md](docs/05-confusion-troubleshooting/COMMON_PITFALLS_AND_TROUBLESHOOTING.md) — deeper troubleshooting for common Git and GitHub pitfalls
