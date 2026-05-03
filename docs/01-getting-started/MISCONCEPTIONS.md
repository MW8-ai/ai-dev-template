# Git and GitHub: Common Misconceptions

This doc exists because Git and GitHub are genuinely confusing, and the internet is full of half-explanations that make things worse. Read this before anything else.

---

## Pronunciation

- **Git** — rhymes with "sit" (one syllable, hard G)
- **GitHub** — "Git Hub" (two syllables, not "Gith-ub")
- **repo** — short for "repository" (re-PO-zi-tor-ee), usually just "repo" in conversation

---

## Git ≠ GitHub

This is the most important distinction in this entire doc.

| | Git | GitHub |
|---|---|---|
| What it is | A command-line tool | A website + cloud service |
| Who made it | Linus Torvalds (2005) | GitHub Inc. (now Microsoft) |
| Where it runs | On your computer | In a browser / on their servers |
| What it does | Tracks file changes locally | Hosts repos, adds collaboration features |
| Cost | Free, always | Free tier + paid plans |
| Required? | Yes — everything depends on it | No — you can use Git without GitHub |

**Analogy:** Git is like Microsoft Word's "Track Changes." GitHub is like Google Drive — a place to store and share those Word documents with others. You can use Track Changes without Google Drive.

---

## What a Repository Actually Is

A **repository** (repo) is a folder with a hidden `.git/` subfolder inside it. That `.git/` folder is where Git stores the entire history of every change ever made to the project.

```
my-project/          ← this is the repo (what you see)
├── .git/            ← this is where Git lives (don't touch)
├── src/
└── README.md
```

When someone says "clone the repo," they mean: download this folder (including its full history) to your computer.

**Common misconception:** "The repo is on GitHub." The repo is wherever Git has been initialized — your laptop, a server, GitHub's servers. GitHub hosts *a copy* of the repo. You have another copy locally. They stay in sync only when you explicitly push or pull.

---

## Local vs Remote

Every developer working on a project typically has:

1. **Their local copy** — on their laptop, fully functional, changes don't affect anyone else until pushed
2. **The remote** — usually on GitHub, the shared "source of truth"

```
Your laptop              GitHub
┌──────────────┐         ┌──────────────┐
│  local repo  │ ──push──▶  remote repo │
│  (your copy) │ ◀─pull──  (shared copy)│
└──────────────┘         └──────────────┘
```

Changes you make locally are **invisible to everyone else** until you push them. This is not a bug — it's the feature that lets multiple people work independently without stepping on each other.

---

## push, pull, fetch — What's the Difference?

These three commands are the source of enormous confusion.

### `git push`
Sends your local commits to the remote. Your changes become visible to others.

```bash
git push origin main
# "send my commits on the 'main' branch to the remote named 'origin'"
```

### `git pull`
Downloads commits from the remote AND immediately merges them into your current branch. Two operations in one.

```bash
git pull origin main
# equivalent to: git fetch origin main + git merge origin/main
```

### `git fetch`
Downloads commits from the remote but does NOT merge them. You can inspect what changed before deciding to merge.

```bash
git fetch origin
# now you can see what changed with: git log origin/main
# merge when ready with: git merge origin/main
```

**When to use fetch vs pull:**
- Use `git fetch` when you want to see what changed before merging (safer, more controlled)
- Use `git pull` when you trust the remote and just want to get up to date quickly
- In a team environment, `git fetch` first is a good habit — you can review before merging

---

## What a Branch Is

A branch is not a copy of the codebase. It's a lightweight pointer to a specific commit. Creating a branch costs almost nothing.

```
main:    A → B → C
                 ↑
feature:         C → D → E
```

`main` and `feature` both start from `C`. After you add commits `D` and `E` on `feature`, those commits only exist on `feature`. `main` is unaffected.

**Why branch?** So you can work on something — a bug fix, a new feature, an experiment — without breaking what's currently working on `main`. When you're done, you merge the branch back.

**Common misconception:** "I need to copy the project to make a branch." You don't. Git branches are just pointers. `git checkout -b my-feature` takes 0.01 seconds.

---

## What a Pull Request Is (and Isn't)

A **Pull Request (PR)** is a GitHub feature, not a Git feature. Git has no concept of a PR.

A PR is a request to merge one branch into another — specifically, a conversation-wrapped version of that request. It shows:
- What commits will be added
- What files changed (the "diff")
- A place for reviewers to comment, approve, or request changes

**Why "pull request"?** You're asking the maintainer to *pull* your changes into their branch. The name comes from open source workflows where you can't directly push to someone else's repo.

**Common misconception:** "I submitted a PR, so my code is merged." No. A PR is a *request*. It needs to be reviewed and approved before anyone merges it. Until it's merged, your branch and `main` are still separate.

---

## Merge vs Rebase vs Squash

These are three different ways to combine branches. Each has trade-offs.

### Merge
Creates a new "merge commit" that joins the two branch histories. Preserves the full history of both branches.

```
main:    A → B → C → M (merge commit)
                ↗
feature: D → E
```

**Use when:** You want to preserve the full history of what happened on the feature branch.

### Rebase
Replays your branch's commits on top of the target branch as if they were always there. No merge commit.

```
Before:         After rebase:
main:    A → B   main:    A → B
feature: A → C   feature: A → B → C (C replayed on B)
```

**Use when:** You want a clean, linear history. Avoid rebasing shared branches — rewriting history that others have already pulled causes conflicts.

### Squash
Collapses all commits on your branch into a single commit before merging.

```
feature: A → B → C → D (4 commits)
main after squash merge: ... → ABCD (one commit)
```

**Use when:** Your feature branch has messy WIP commits ("fix typo", "oops", "try again") that you don't want in the permanent history.

**This repo's default:** Squash merge for feature branches. Clean history, one commit per PR.

---

## The Staging Area (Why `git add` Exists)

Most version control systems automatically track all changes. Git doesn't — by design. You choose what goes into each commit.

```
Working directory → Staging area → Committed history
(files on disk)     (git add)      (git commit)
```

- **Working directory:** Where you edit files. Changes here are not tracked yet.
- **Staging area (index):** A holding area for changes you've selected for the next commit. (`git add`)
- **Committed:** Changes saved to the repo's history. Can't be accidentally overwritten.

**Why does staging exist?** So you can make 10 changes but only commit 5 of them — grouping related changes into a single coherent commit. This makes history easier to read and debug.

**Common mistake:** Running `git commit` without `git add` first. Nothing gets committed because nothing was staged.

---

## `origin` Is Just a Name

When you clone a repo, Git automatically sets up a remote called `origin` pointing to wherever you cloned from. It's a nickname. You could rename it to anything.

```bash
git remote -v
# origin  https://github.com/you/your-repo.git (fetch)
# origin  https://github.com/you/your-repo.git (push)
```

`origin/main` means: "the `main` branch as it exists on the remote named `origin`." It's a local snapshot of what that branch looked like the last time you fetched.

---

## HEAD

`HEAD` is a pointer to your current position in the repo's history. Usually it points to the tip (latest commit) of your current branch.

```bash
git log --oneline -3
# a1b2c3d (HEAD -> main) Add login page
# e4f5a6b Update README
# c7d8e9f Initial commit
```

When you switch branches, `HEAD` moves. When you make a new commit, `HEAD` moves forward to the new commit.

**Detached HEAD:** If you `git checkout <commit-hash>` instead of a branch name, HEAD points directly to a commit rather than a branch. You're not "on" any branch. Any commits you make won't be saved to a branch unless you create one.

---

## .gitignore

`.gitignore` tells Git which files and folders to ignore — never track, never commit, never push.

Common entries:
```
node_modules/     # dependency folder (huge, regeneratable)
.env              # environment variables (contains secrets)
*.log             # log files
dist/             # build output (regeneratable)
.DS_Store         # macOS metadata files
```

**Important:** `.gitignore` only ignores *untracked* files. If you already committed a file and then add it to `.gitignore`, Git will keep tracking it. You need to `git rm --cached <file>` to stop tracking it.

**Never commit secrets.** Once a secret is in git history, it's there forever (even if you delete the file in a later commit). Use `.gitignore` and environment variables.

---

## Commits Are Snapshots, Not Diffs

Git stores complete snapshots of your files at each commit, not just the changes between commits. Internally it uses clever compression so identical content isn't stored twice, but conceptually each commit is a full picture of the project at that moment.

This is why you can check out any commit and see exactly what the project looked like — you're not replaying a sequence of diffs.

---

## Best Practices (With the WHY)

### Commit early and often — small, focused commits
**Why:** Smaller commits are easier to review, easier to revert if something breaks, and easier to understand six months later. A commit called "Add user authentication" that's 2,000 lines long is impossible to review. Five commits across a week, each 200–400 lines, tells a story.

### Write commit messages in the imperative mood
**Why:** `Add login page` not `Added login page` or `Adding login page`. Git's own conventions use imperative mood, and it reads naturally: "If applied, this commit will: *Add login page*."

### Never commit directly to `main`
**Why:** `main` is the stable branch. Direct commits skip code review, can break CI, and can block teammates who need to pull. Always branch, PR, and merge.

### Pull before you push
**Why:** If someone else pushed while you were working, your push will be rejected. Pulling first (or fetching + rebasing) keeps your history clean and prevents "I have to force-push" situations.

### Don't force-push to shared branches
**Why:** Force-pushing rewrites history. Anyone who already pulled the old history now has a diverged repo. It causes confusion, lost work, and hard-to-resolve conflicts. Only force-push to your own private feature branches that nobody else is using.

### Keep secrets out of git, always
**Why:** Git history is permanent. A secret committed by accident stays in the history even if you delete it in the next commit. Rotating the secret is the only fix. Use `.gitignore`, environment variables, and a secrets manager.

### Use branches for every change, no matter how small
**Why:** Even a one-line fix should be a branch + PR. This ensures review happens, CI runs against the change, and the change is documented in the PR description. "It's too small to matter" is how small mistakes reach production.

---

## Quick Reference: Commands That Confuse People

| Command | What it does |
|---|---|
| `git init` | Create a new repo in the current folder |
| `git clone <url>` | Copy a remote repo to your computer |
| `git status` | Show what's changed and what's staged |
| `git add <file>` | Stage a file for the next commit |
| `git add .` | Stage all changed files |
| `git commit -m "msg"` | Save staged changes to history |
| `git push` | Send local commits to the remote |
| `git pull` | Fetch + merge from the remote |
| `git fetch` | Download from remote, don't merge |
| `git checkout -b <name>` | Create and switch to a new branch |
| `git switch <name>` | Switch to an existing branch (newer syntax) |
| `git merge <branch>` | Merge another branch into the current one |
| `git log --oneline` | Show commit history, compact |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |
| `git stash` | Temporarily save uncommitted changes |
| `git stash pop` | Restore stashed changes |

---

## Next Step

→ `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — make your first commit and push using these concepts
