# Your First Commit and Push

## Quick Path

Run these commands in order. Replace the values in quotes with your own.

```bash
# 1. Tell Git who you are (one-time setup per machine)
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"

# 2a. Clone an existing repo (if you already have one on GitHub)
git clone git@github.com:your-org/your-repo.git
cd your-repo

# 2b. Or create a new local repo from scratch
git init my-project
cd my-project

# 3. Create or edit a file
echo "# My Project" > README.md

# 4. Stage the file
git add README.md

# 5. Commit with a message
git commit -m "Add README with project title"

# 6. Push to GitHub (first time: set the upstream branch)
git push -u origin main
# Subsequent pushes on the same branch:
git push
```

---

## Full Explanation

### Step 1: Configure Git

Before you can commit, Git needs to know who you are. This information is attached to every commit you make.

```bash
git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"
```

The `--global` flag writes these settings to `~/.gitconfig` (your home directory on Mac/Linux, or `C:\Users\YourName\.gitconfig` on Windows). They apply to every Git repository on your machine. To use different settings for a specific project, run the same commands without `--global` from inside that project folder.

Verify your config:

```bash
git config --list
# user.name=Ada Lovelace
# user.email=ada@example.com
```

### Step 2: Get a Repository

**Option A — Clone an existing repo from GitHub:**
```bash
git clone git@github.com:your-org/your-repo.git
cd your-repo
```

Cloning downloads the complete repository — all commits, all branches — and automatically configures `origin` to point back to GitHub. See `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` if you get a "Permission denied" error here.

**Option B — Initialize a new project locally:**
```bash
git init my-project
cd my-project
```

This creates a `.git/` folder inside `my-project/`. Nothing is tracked yet. You will need to create the repo on GitHub separately and then connect it:

```bash
# After creating the repo on github.com:
git remote add origin git@github.com:your-username/my-project.git
git push -u origin main
```

### Step 3: Create or Edit a File

Make any change to the project. For a brand new repo, creating a README is the conventional first step:

```bash
echo "# My Project" > README.md
```

After making changes, run `git status` to see what Git knows about:

```bash
git status
# On branch main
# Untracked files:
#   (use "git add <file>..." to include in what will be committed)
#         README.md
```

### Step 4: Stage the File

The **staging area** is where you prepare exactly what goes into your next commit. You can stage individual files or all changes at once.

```bash
# Stage one file
git add README.md

# Stage all changed files in the current directory (use carefully)
git add .

# See what is staged
git status
# Changes to be committed:
#   new file: README.md
```

The distinction matters: you might have changed five files but only want to commit changes to three of them. Stage only those three.

### Step 5: Commit

A commit creates a permanent snapshot of everything in the staging area.

```bash
git commit -m "Add README with project title"
# [main (root-commit) a3f9b12] Add README with project title
# 1 file changed, 1 insertion(+)
# create mode 100644 README.md
```

The output tells you:
- Which branch you committed to (`main`)
- The short SHA-1 hash of this commit (`a3f9b12`)
- Your commit message
- What changed (files, insertions, deletions)

### Step 6: Push

Pushing sends your local commits to GitHub.

```bash
# First push on a new branch — set the upstream tracking branch
git push -u origin main

# Every push after that on the same branch
git push
```

After pushing, go to your GitHub repository URL — your commit appears at the top of the commit history.

---

## What Makes a Good Commit Message

Commit messages are permanent. They are the narrative of your project's history. Future you (and your teammates) will read them to understand what changed and why.

### The rules:

1. **Use the imperative mood.** Write "Add feature" not "Added feature" or "Adding feature." Read it as completing the sentence: "If applied, this commit will: `[your message]`."
2. **Keep the first line under 72 characters.** It shows in `git log --oneline` and in GitHub's commit list.
3. **Describe what changed and why — not how.** The code itself shows how. The message should explain the intent.
4. **Capitalize the first word. No period at the end.**

### Bad vs. good examples:

| Bad | Good |
|---|---|
| `fix` | `Fix null pointer crash when user has no profile photo` |
| `WIP` | `Add draft implementation of payment webhook handler` |
| `updated stuff` | `Update homepage hero copy per marketing review` |
| `asdfgh` | (never acceptable) |
| `Fixed the bug that Sarah mentioned` | `Fix race condition in session token refresh` |
| `Added the thing` | `Add CSV export to the reports dashboard` |

For commits with a subject and a body (for more context):

```
Fix token expiry not refreshing on API calls

The refresh logic checked expiry only on page load, not before
each API request. This caused silent auth failures for sessions
longer than 1 hour. Now expiry is checked before every request
and refreshed if within 5 minutes of expiry.
```

The blank line between subject and body is required — it is how Git separates them.

---

## What Happens Inside Git When You Commit

This is optional context — skip it if you just want to get things working.

When you run `git commit`, Git creates three types of objects in the `.git/objects/` folder:

**Blob:** A compressed copy of each file's contents at commit time. Two identical files share one blob.

**Tree:** A snapshot of your directory structure — it maps filenames to blob hashes and records file permissions.

**Commit:** Contains a pointer to the root tree, the author, the committer, the timestamp, the commit message, and a pointer to the parent commit (the previous snapshot in the chain).

Every object is identified by its SHA-1 (Secure Hash Algorithm 1) hash — a 40-character hex string computed from the content. If any bit of content changes, the hash changes completely. This is why Git history is tamper-evident: you cannot alter a past commit without changing its hash and the hash of every commit after it.

```bash
# See the raw object for your last commit
git cat-file -p HEAD
# tree 5f3b...
# parent a3f9...
# author Ada Lovelace <ada@example.com> 1714780800 +0000
# committer Ada Lovelace <ada@example.com> 1714780800 +0000
#
# Add README with project title
```

---

## Common Errors and Fixes

**"nothing to commit, working tree clean"**

You ran `git commit` but didn't stage anything first.

```bash
# Check what's changed
git status

# Stage your changes
git add filename.txt

# Now commit
git commit -m "Your message"
```

**"rejected push — updates were rejected because the remote contains work that you do not have locally"**

Someone else pushed to the same branch since you last pulled. You need to bring their changes in first.

```bash
git pull origin main
# Resolve any conflicts, then:
git push origin main
```

**Authentication errors: "Permission denied (publickey)" or credential prompts**

You are trying to use SSH but your SSH key is not set up, or you are trying to use HTTPS but your credentials are not stored.

- For SSH setup: `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md`
- Quick HTTPS fix: use GitHub CLI (`gh auth login`) or GitHub's credential manager

**"Your branch is ahead of 'origin/main' by N commits"**

You have committed locally but not pushed. Run:

```bash
git push origin main
```

**"fatal: not a git repository"**

You ran a `git` command outside of a Git repository folder. Either `cd` into your project, or run `git init` to create one.

---

## What to Read Next

- `docs/01-getting-started/BRANCH_PULL_MERGE.md` — work with branches and pull requests
- `docs/01-getting-started/COMMON_MISTAKES.md` — what goes wrong and how to fix it
- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — secure authentication with GitHub

---

## Next Step

→ [docs/01-getting-started/BRANCH_PULL_MERGE.md](docs/01-getting-started/BRANCH_PULL_MERGE.md) — learn how branches work and how to merge changes safely
