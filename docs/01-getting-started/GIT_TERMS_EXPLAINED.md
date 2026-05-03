# Git Terms Explained

A reference glossary for people learning Git. Every term includes a plain definition, an analogy to make it concrete, and a real example you can try.

---

## Repository (Repo)

**Definition:** A project folder that Git tracks. It contains your files plus the complete history of every change ever made to them. Repositories can live on your computer (local), on GitHub (remote), or both.

**Analogy:** A repository is like a filing cabinet for a project, except this filing cabinet remembers every document that was ever stored in it, who put it there, when, and what it used to look like before any edits.

**Example:**
```bash
# Create a new repository in the current folder
git init my-project
cd my-project
# A hidden .git/ folder now exists — that's the repository
ls -a
# .  ..  .git
```

---

## Commit

**Definition:** A commit is a saved snapshot of your project at a specific point in time. Each commit has a unique identifier (a SHA-1 hash like `a3f9b12c`), a message, an author, and a timestamp. Commits are permanent and build a chain of history.

**Analogy:** A commit is like a save point in a video game. When you commit, you're saying "this is a good state — I can always come back here." Unlike hitting Ctrl+S to save a file, commits are intentional checkpoints with a description of what changed.

**Example:**
```bash
# After editing files:
git add README.md
git commit -m "Add project overview to README"
# [main (root-commit) a3f9b12] Add project overview to README
# 1 file changed, 12 insertions(+)
```

---

## Branch

**Definition:** A branch is an independent line of development within a repository. It starts as a copy of another branch and diverges as you make commits. Branches let multiple people work on different features simultaneously without interfering with each other.

**Analogy:** Think of a river that splits into channels. Each channel goes its own direction. Eventually some channels merge back into the main river, and some are abandoned. The `main` branch is the main channel; every feature branch is a tributary.

**Example:**
```bash
# Create a new branch and switch to it
git checkout -b feature/add-login-page
# You are now on branch feature/add-login-page
# Changes here do not affect the main branch
```

---

## Merge

**Definition:** Merging combines the changes from one branch into another. Git analyzes the two branches, finds the point where they diverged, and integrates the differences. When changes overlap in the same file and line, a **merge conflict** occurs and must be resolved manually.

**Analogy:** Imagine two authors each editing different chapters of the same book and then combining their manuscripts. Usually this works seamlessly. Occasionally they both edited the same paragraph — that conflict needs a human to decide which version to keep.

**Example:**
```bash
# Switch to main and merge the feature branch into it
git checkout main
git merge feature/add-login-page
# Fast-forward or a merge commit is created
```

---

## Pull Request (PR)

**Definition:** A pull request is a proposal to merge one branch into another, submitted through GitHub (or GitLab, Bitbucket, etc.). It is the primary mechanism for code review: teammates can read your changes, leave comments on specific lines, request changes, and ultimately approve the merge.

**Analogy:** A pull request is like submitting a document for peer review before it goes into the official record. You're saying "I'd like my work incorporated — here it is, please check it." The reviewer either approves it, asks for revisions, or rejects it with feedback.

**Example:**
Push your branch, then on GitHub click **Compare & pull request**. Fill in a title like `Add login page with email/password form` and a description explaining what changed and how to test it. Assign a reviewer and submit.

---

## Clone

**Definition:** Cloning creates a complete local copy of a remote repository — including all commits, branches, and history. It is how you download an existing project to your machine to start working on it.

**Analogy:** Cloning is like photocopying an entire filing cabinet, not just one drawer. You get everything: the current files and the complete history. From that point, your copy and the original are independent — you can make changes without affecting the original until you explicitly push.

**Example:**
```bash
# Clone the repository to a folder called "my-project"
git clone git@github.com:your-org/my-project.git
cd my-project
# You now have a full local copy — all commits, all branches
```

---

## Fork

**Definition:** A fork is your own copy of someone else's repository on GitHub. It exists under your GitHub account. Forking is the standard way to contribute to open source projects: you fork the project, make changes in your fork, then open a pull request to propose those changes back to the original.

**Analogy:** Forking is like taking a public recipe and writing it into your own recipe book. You own your copy and can modify it however you want. If your improvements are good, you can suggest them back to the original chef.

**Example:**
On GitHub, navigate to `github.com/some-org/their-project` and click **Fork**. GitHub creates `github.com/your-username/their-project`. Clone your fork:
```bash
git clone git@github.com:your-username/their-project.git
```

---

## Remote

**Definition:** A remote is a reference to a copy of the repository that lives somewhere other than your local machine — typically on GitHub. You can have multiple remotes. Each remote has a name and a URL. You push changes to remotes and pull changes from them.

**Analogy:** Your local repository is your personal notebook. A remote is the shared whiteboard at the office. You write things in your notebook, then periodically update the whiteboard. Your teammates update the whiteboard too, and you periodically refresh your notebook from it.

**Example:**
```bash
# List all remotes and their URLs
git remote -v
# origin  git@github.com:your-org/my-project.git (fetch)
# origin  git@github.com:your-org/my-project.git (push)

# Add a new remote (useful when working with a fork)
git remote add upstream git@github.com:original-org/their-project.git
```

---

## Origin

**Definition:** "Origin" is the default name Git gives to the remote repository you cloned from. It is just a name — you could rename it, and you can have other remotes with any names. But "origin" is universal convention and you will see it in almost every Git command example.

**Analogy:** If "remote" is a phone contact, "origin" is the contact named "Home." It's just the default, familiar one.

**Example:**
```bash
# When you clone, Git automatically sets up origin
git clone git@github.com:your-org/my-project.git
git remote -v
# origin  git@github.com:your-org/my-project.git (fetch)

# Push to origin (GitHub)
git push origin main
```

---

## Main / Master

**Definition:** The primary branch of a repository — the one that represents the official, production-ready state of the project. GitHub changed the default branch name from `master` to `main` in 2020. Both names refer to the same concept. Most new repositories use `main`.

**Analogy:** `main` is the published edition of a book. Feature branches are drafts. You only merge a draft into the published edition after it has been reviewed and approved.

**Example:**
```bash
# Switch to the main branch
git checkout main

# Pull the latest changes from GitHub
git pull origin main
```

---

## Staging Area

**Definition:** The staging area (also called the index) is a holding zone between your working directory and your commits. When you run `git add`, you move file changes into the staging area. When you run `git commit`, only the staged changes are included in the commit. This lets you commit a subset of your changes.

**Analogy:** The staging area is like a packing table. You have a pile of things you changed (your working directory). You pick up the specific items you want to ship and place them on the table (staging). Then you seal the box and label it (commit). Items still in the pile aren't shipped yet.

**Example:**
```bash
# You edited three files: auth.js, styles.css, README.md
# Only commit the auth changes right now

git add auth.js
git status
# Changes to be committed: auth.js
# Changes not staged: styles.css, README.md

git commit -m "Implement email/password authentication"
# styles.css and README.md are still in your working directory, unstaged
```

---

## .gitignore

**Definition:** A `.gitignore` file in the root of your repository lists files and patterns that Git should never track. Files matching these patterns will not appear in `git status` and cannot accidentally be committed. Common entries: `node_modules/`, `.env`, build output folders, OS files like `.DS_Store`.

**Analogy:** A `.gitignore` is like a list on the packing table that says "never ship these." Even if they're sitting right there, you always skip them.

**Example:**
```gitignore
# .gitignore

# Dependencies
node_modules/

# Environment variables — never commit secrets
.env
.env.local

# Build output
dist/
build/

# OS files
.DS_Store
Thumbs.db
```

```bash
# After adding .gitignore, these files no longer show up as untracked
git status
# nothing to commit, working tree clean
```

---

## HEAD

**Definition:** HEAD is a pointer to the commit you are currently "on." Usually it points to the tip (most recent commit) of your current branch. When you switch branches, HEAD moves. When you make a new commit, HEAD advances to point to it. In a "detached HEAD" state, HEAD points to a specific commit rather than a branch.

**Analogy:** HEAD is a "you are here" marker on a map. The map is your commit history. When you move to a different branch, the marker moves to the tip of that branch.

**Example:**
```bash
# See what HEAD points to
cat .git/HEAD
# ref: refs/heads/main

# See the commit HEAD is on
git log -1 HEAD
# commit a3f9b12c...
# Author: You <you@example.com>
# Date:   ...
# Add project overview to README
```

---

## Stash

**Definition:** Stash temporarily saves your uncommitted changes (both staged and unstaged) without making a commit. This is useful when you need to switch branches or pull updates but aren't ready to commit your current work.

**Analogy:** Stashing is like stuffing your work-in-progress into a desk drawer so you can clear your desk quickly. Later you open the drawer and pull it back out exactly as you left it.

**Example:**
```bash
# You're halfway through editing auth.js when you need to switch branches
git stash
# Saved working directory and index state WIP on main: a3f9b12 Add overview

# Switch branches, do other work, then come back
git checkout main
# ... do your other work ...
git checkout feature/add-login-page

# Restore your stashed changes
git stash pop
# Changes restored to your working directory
```

---

## Rebase

**Definition:** Rebase moves or replays your commits on top of a different base commit. Instead of creating a merge commit to join two branches, rebase rewrites your branch's history so it looks like it was always based on the latest state of the target branch. The result is a cleaner, linear history.

**Analogy:** Imagine you started writing a report based on the January draft. Meanwhile, your colleague updated the January draft into a February draft. Rebasing is like going back and rewriting your additions as if you had started from the February draft all along — the result looks seamless.

**Example:**
```bash
# You're on feature/add-login-page and main has moved ahead
git checkout feature/add-login-page

# Replay your commits on top of the current main
git rebase main
# First, rewinding head to replay your work on top of it...
# Applying: Add login form HTML
# Applying: Add login form CSS

# Your commits now sit directly on top of the latest main
git log --oneline
# b7c1234 Add login form CSS
# d4e5678 Add login form HTML
# a3f9b12 (main) Latest change on main
```

> **Note:** Do not rebase commits that have already been pushed to a shared branch. Rebase rewrites history and will conflict with others' local copies. See `docs/01-getting-started/BRANCH_PULL_MERGE.md` for safe rebase workflows.

---

## What to Read Next

- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — put these concepts into practice
- `docs/01-getting-started/BRANCH_PULL_MERGE.md` — branches, merges, and pull requests in depth
- `docs/01-getting-started/COMMON_MISTAKES.md` — what goes wrong and how to fix it
