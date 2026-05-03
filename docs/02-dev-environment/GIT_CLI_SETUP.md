# Git CLI Command Reference

A practical reference for the Git CLI (Command Line Interface), organized by workflow stage. Every command includes syntax, what it does, and a real example.

---

## Setup

These commands configure Git and create or copy repositories. Most setup commands are one-time tasks per machine or per project.

### git config

Configure Git settings. `--global` applies to all repos on your machine. Without `--global`, it applies only to the current repo.

```bash
# Set your name and email (required before your first commit)
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"

# Set VS Code as the default editor for commit messages
git config --global core.editor "code --wait"

# Set the default branch name to "main" for new repos
git config --global init.defaultBranch main

# View all settings
git config --list

# View a single setting
git config user.email

# Open the global config file in your editor
git config --global --edit
```

The global config lives at `~/.gitconfig`.

### git init

Create a new Git repository in the current directory. This creates a `.git/` folder — everything Git needs to track history lives there.

```bash
# Initialize a new repo in the current folder
git init

# Initialize a new repo in a named subfolder (creates the folder)
git init my-project
cd my-project
```

### git clone

Download a complete copy of a remote repository — all commits, all branches, all history.

```bash
# Clone via SSH (recommended — requires SSH keys set up)
git clone git@github.com:your-org/your-repo.git

# Clone via HTTPS (no SSH keys needed, but requires password/token)
git clone https://github.com/your-org/your-repo.git

# Clone into a specific folder name
git clone git@github.com:your-org/your-repo.git my-local-name

# Clone only the latest commit (shallow clone — faster for large repos)
git clone --depth=1 git@github.com:your-org/large-repo.git
```

---

## Daily Use

Commands you'll run dozens of times per day.

### git status

Show the current state of your working directory and staging area. Run this constantly — it tells you what's changed, what's staged, and what branch you're on.

```bash
git status

# Short format (one line per file)
git status -s
# M  auth.js     (staged modification)
#  M styles.css  (unstaged modification)
# ?? newfile.js  (?? = untracked)
```

### git add

Stage changes for the next commit. Only staged changes are included when you run `git commit`.

```bash
# Stage a specific file
git add src/auth.js

# Stage a directory and everything inside it
git add src/

# Stage all changes in the current directory (tracked and new files)
git add .

# Stage parts of a file interactively (choose which hunks to include)
git add -p src/auth.js

# Stage only already-tracked files (skips new untracked files)
git add -u
```

Use `git add -p` when you want to commit only some of the changes in a file — it walks you through each change one at a time.

### git commit

Create a commit from everything in the staging area.

```bash
# Commit with a short message
git commit -m "Add email validation to signup form"

# Open the configured editor for a longer message (subject + body)
git commit

# Stage all tracked modified files and commit in one step (skips untracked files)
git commit -am "Fix null check in profile loader"

# Amend the most recent commit (before pushing — rewrites history)
git commit --amend -m "Better message for previous commit"

# Add more staged changes to the previous commit without changing the message
git commit --amend --no-edit
```

### git push

Send local commits to a remote repository.

```bash
# Push the current branch to origin
git push

# Push a specific branch (first time — sets the upstream tracking branch)
git push -u origin feature/my-feature

# Push all local branches to origin
git push --all origin

# Push tags to origin
git push --tags
```

### git pull

Fetch remote changes and merge them into your current branch.

```bash
# Pull (fetch + merge) from origin
git pull

# Pull from a specific remote and branch
git pull origin main

# Pull and rebase instead of merge (keeps history linear)
git pull --rebase origin main
```

---

## Branches

### git branch

Create, list, and delete branches.

```bash
# List all local branches (* marks the current one)
git branch

# List all branches including remote-tracking branches
git branch -a

# Create a new branch (but don't switch to it)
git branch feature/new-ui

# Delete a branch (safe — fails if branch has unmerged commits)
git branch -d feature/merged-branch

# Force delete a branch (use when you're sure you don't need it)
git branch -D feature/abandoned-branch

# Rename the current branch
git branch -m new-name
```

### git checkout / git switch

Switch branches or restore files. `git switch` (Git 2.23+) is cleaner for branch operations.

```bash
# Switch to an existing branch
git checkout main
git switch main          # modern equivalent

# Create a new branch and switch to it
git checkout -b feature/login-page
git switch -c feature/login-page   # modern equivalent

# Restore a file to its last committed state (discard working dir changes)
git checkout -- src/auth.js
git restore src/auth.js            # modern equivalent

# Check out a specific commit (enters detached HEAD state)
git checkout a3f9b12
```

### git merge

Combine another branch into the current branch.

```bash
# Merge a branch into your current branch
git checkout main
git merge feature/login-page

# Merge without fast-forward (always creates a merge commit)
git merge --no-ff feature/login-page

# Abort a merge that has conflicts
git merge --abort
```

---

## Inspection

Commands for understanding what happened and why.

### git log

Browse commit history.

```bash
# Full log
git log

# One line per commit
git log --oneline

# Visual branch graph
git log --oneline --graph --all

# Commits by a specific author
git log --author="Ada Lovelace"

# Commits that changed a specific file
git log --oneline -- src/auth.js

# Commits from the last 7 days
git log --since="7 days ago"

# Search commit messages
git log --grep="login"
```

### git diff

Show changes between commits, branches, or the working directory and staging area.

```bash
# Changes in working directory (not yet staged)
git diff

# Changes staged for the next commit
git diff --cached
git diff --staged    # same thing

# Diff between two branches
git diff main feature/login-page

# Diff between two commits
git diff a3f9b12 d4e5678

# Diff for a specific file only
git diff -- src/auth.js
```

### git show

Display a specific commit — its message, author, date, and the diff of what changed.

```bash
# Show the most recent commit
git show

# Show a specific commit by hash
git show a3f9b12

# Show a specific file at a specific commit
git show a3f9b12:src/auth.js
```

### git blame

Show who last modified each line of a file and in which commit.

```bash
# Annotate every line of a file with author and commit
git blame src/auth.js

# Blame with abbreviated commit hashes and timestamps
git blame --date=short -s src/auth.js

# Blame a specific range of lines
git blame -L 20,40 src/auth.js
```

---

## Fixing Mistakes

### git restore

Discard changes in your working directory or unstage files.

```bash
# Discard working directory changes to a file (restore to last commit)
git restore src/auth.js

# Unstage a file (remove from staging area, keep changes in working dir)
git restore --staged src/auth.js

# Restore all files in the working directory
git restore .
```

### git reset

Move the current branch pointer to a different commit. The `--soft`, `--mixed`, and `--hard` flags control what happens to your working directory and staging area.

```bash
# Undo the last commit — keep changes staged (--soft)
git reset --soft HEAD~1

# Undo the last commit — keep changes in working dir, unstaged (--mixed, the default)
git reset HEAD~1

# Undo the last commit — DISCARD changes entirely (--hard, destructive)
git reset --hard HEAD~1

# Unstage a file (equivalent to git restore --staged)
git reset HEAD src/auth.js
```

> **Warning:** `git reset --hard` permanently discards uncommitted changes. There is no undo.

### git revert

Create a new commit that undoes a previous commit. Unlike `git reset`, this is safe on shared branches because it adds to history rather than rewriting it.

```bash
# Create a revert commit for the most recent commit
git revert HEAD

# Revert a specific commit by hash
git revert a3f9b12

# Revert without automatically committing (so you can edit the message)
git revert --no-commit a3f9b12
git commit -m "Revert accidental removal of user validation"
```

### git stash

Temporarily save uncommitted changes so you can switch context.

```bash
# Stash all uncommitted changes (tracked files)
git stash

# Stash including new untracked files
git stash -u

# Stash with a description
git stash push -m "WIP: auth refactor, halfway done"

# List all stashes
git stash list
# stash@{0}: WIP: auth refactor, halfway done
# stash@{1}: WIP on main: a3f9b12 Previous commit

# Apply the most recent stash and remove it from the stash list
git stash pop

# Apply a specific stash (without removing it)
git stash apply stash@{1}

# Delete a stash
git stash drop stash@{0}

# Delete all stashes
git stash clear
```

---

## Remote

### git remote

Manage connections to remote repositories.

```bash
# List remotes and their URLs
git remote -v

# Add a remote
git remote add origin git@github.com:your-org/your-repo.git

# Add a second remote (useful when working with a fork)
git remote add upstream git@github.com:original-org/their-repo.git

# Change a remote's URL
git remote set-url origin git@github.com:your-org/new-name.git

# Remove a remote
git remote remove upstream

# Rename a remote
git remote rename old-name new-name
```

### git fetch

Download commits and branch information from a remote without changing your local branches.

```bash
# Fetch all branches from origin
git fetch origin

# Fetch a specific branch
git fetch origin main

# Fetch from all remotes
git fetch --all

# After fetching, inspect what came in
git log HEAD..origin/main --oneline
```

---

## Git Aliases

Aliases let you define short shortcuts for long commands. Add them to your `~/.gitconfig`:

```bash
# Set aliases from the command line
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.unstage "restore --staged"
git config --global alias.last "log -1 HEAD"
git config --global alias.undo "reset HEAD~1 --mixed"
```

Or edit `~/.gitconfig` directly:

```ini
[alias]
    st = status
    co = checkout
    br = branch
    lg = log --oneline --graph --all --decorate
    unstage = restore --staged
    last = log -1 HEAD
    undo = reset HEAD~1 --mixed
    aliases = config --get-regexp ^alias
```

Usage:

```bash
git st       # git status
git lg       # git log --oneline --graph --all --decorate
git undo     # undo last commit, keep changes
```

## Useful .gitconfig Settings

```ini
[core]
    editor = code --wait          # VS Code as default editor
    autocrlf = input              # LF on commit (use "true" on Windows)
    excludesfile = ~/.gitignore_global

[pull]
    rebase = false                # merge (not rebase) on git pull

[push]
    autoSetupRemote = true        # auto set upstream on first push (Git 2.37+)
    default = current             # push current branch to same-named remote branch

[merge]
    conflictstyle = diff3         # show base version in conflict markers

[diff]
    colorMoved = zebra            # highlight moved code differently

[init]
    defaultBranch = main

[color]
    ui = auto
```

---

## What to Read Next

- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — put these commands into practice
- `docs/01-getting-started/BRANCH_PULL_MERGE.md` — branching and merging in depth
- `docs/01-getting-started/COMMON_MISTAKES.md` — what goes wrong and how to use these commands to fix it
- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — authenticate with GitHub

---

## Next Step

→ [docs/02-dev-environment/SSH_KEYS_AND_AUTH.md](docs/02-dev-environment/SSH_KEYS_AND_AUTH.md) — set up SSH key authentication so Git can communicate securely with GitHub
