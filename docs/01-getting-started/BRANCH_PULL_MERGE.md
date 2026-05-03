# Branches, Pull Requests, and Merging

## Quick Path

```bash
# 1. Create a new branch and switch to it
git checkout -b feature/my-feature

# 2. Make your changes (edit files, create files, etc.)
# ... write code ...

# 3. Stage and commit
git add .
git commit -m "Add my feature"

# 4. Push the branch to GitHub
git push origin feature/my-feature

# 5. Open a pull request
# Go to github.com/your-org/your-repo
# Click "Compare & pull request" (GitHub shows this automatically after a push)
# Write a title and description, then click "Create pull request"

# 6. After review and approval, merge on GitHub
# Click "Merge pull request" → "Confirm merge"
# Delete the branch when prompted
```

---

## Full Explanation

### Why Branches Exist

The `main` branch is your project's source of truth. It should always be in a working, deployable state. If multiple people commit directly to `main`, you get a chaotic stream of half-finished work, broken builds, and conflicts.

Branches solve this by giving each piece of work its own isolated space. You can make 50 messy commits on a branch, get it reviewed, clean it up, and only then merge a clean, tested result into `main`. Meanwhile, your teammates are working on their own branches without touching yours.

Branches are cheap in Git. Creating or deleting a branch is instant — Git is just moving a pointer to a commit. It costs almost nothing, so use branches freely.

### Branch Naming Conventions

Good branch names communicate intent at a glance. Use a prefix to signal the type of work:

| Prefix | When to use | Example |
|---|---|---|
| `feature/` | New functionality | `feature/user-profile-page` |
| `fix/` | Bug fix | `fix/login-redirect-loop` |
| `docs/` | Documentation only | `docs/update-api-reference` |
| `chore/` | Maintenance (deps, config) | `chore/upgrade-node-18` |
| `release/` | Preparing a release | `release/v2.4.0` |
| `hotfix/` | Urgent fix for production | `hotfix/payment-null-error` |

Use lowercase and hyphens. Avoid spaces and special characters. Keep names under 50 characters.

### What "checkout" Does

When you run `git checkout -b feature/my-feature`, two things happen:

1. Git creates a new branch called `feature/my-feature` pointing to the same commit you're currently on
2. Git switches your **working directory** to that branch

"Switching" means Git updates all the tracked files in your folder to match the state of that branch. If `feature/my-feature` has a file that `main` doesn't, that file appears. If it's missing a file that `main` has, that file disappears (don't worry — it's still in `main`'s history).

`HEAD` now points to `feature/my-feature`. Any commits you make advance this branch, not `main`.

```bash
# Modern equivalent — clearer syntax (Git 2.23+)
git switch -c feature/my-feature   # create and switch
git switch main                     # switch without creating
```

Both `checkout` and `switch` do the same thing; `switch` is newer and more explicit.

### The Difference Between git pull and git fetch

**`git fetch`** downloads new commits and branches from the remote but does not change any of your local files or branches. It updates your knowledge of what's on GitHub without touching your work.

**`git pull`** is `git fetch` followed by `git merge` (or `git rebase` depending on config). It downloads and immediately integrates the remote changes into your current branch.

```bash
# Fetch — see what's new without changing anything
git fetch origin
git log origin/main --oneline  # inspect what came in

# Pull — fetch and merge in one step
git pull origin main
```

Use `git fetch` when you want to inspect changes before integrating them. Use `git pull` when you trust the incoming changes and want to integrate immediately.

### Keeping Your Branch Up to Date

While you're working on `feature/my-feature`, other people merge their branches into `main`. Your branch diverges. Before opening a pull request, bring your branch up to date to minimize conflicts during review.

```bash
# Option 1: Merge main into your feature branch (creates a merge commit)
git checkout feature/my-feature
git pull origin main
# If there are conflicts, resolve them, then: git commit

# Option 2: Rebase your branch on top of main (linear history, no merge commit)
git checkout feature/my-feature
git rebase origin/main
# If there are conflicts during rebase, resolve each one, then: git rebase --continue
```

Merging is simpler and safer when in doubt. Rebasing produces cleaner history but rewrites commits — do not rebase a branch that other people are also working on.

### Merge Conflicts: What They Are and How to Resolve Them

A merge conflict happens when two branches both modified the same lines in the same file. Git cannot decide which version to keep — it marks the conflict and asks you to resolve it.

**How a conflict looks in a file:**

```text
<<<<<<< HEAD
const timeout = 5000;  // your version on feature/my-feature
=======
const timeout = 3000;  // the version on main
>>>>>>> main
```

The `<<<<<<< HEAD` through `=======` section is your version. The `=======` through `>>>>>>> main` section is the incoming version.

**Resolving it step by step:**

```bash
# 1. Git tells you which files have conflicts
git status
# both modified: src/config.js

# 2. Open the file in your editor
# Find all conflict markers (search for "<<<<<<<")
# Edit the file to the correct final state
# Delete the conflict markers entirely

# The resolved file should look like:
const timeout = 5000;  // or 3000, or some combined value — you decide

# 3. Stage the resolved file
git add src/config.js

# 4. Complete the merge
git commit
# Git opens your editor with a default merge commit message — save and close it
```

If a conflict feels overwhelming, you can abort:

```bash
# Abort a merge and return to the state before you started
git merge --abort

# Abort a rebase
git rebase --abort
```

Modern editors like VS Code show conflicts with Accept Current / Accept Incoming / Accept Both buttons. Use those — they prevent typos in the markers.

---

## What to Read Next

- `docs/01-getting-started/PULL_REQUESTS.md` — writing good PRs and navigating review
- `docs/01-getting-started/COMMON_MISTAKES.md` — common pitfalls with branches and conflicts
- `docs/02-dev-environment/GIT_CLI_SETUP.md` — full command reference

---

## Next Step

→ [docs/01-getting-started/PULL_REQUESTS.md](docs/01-getting-started/PULL_REQUESTS.md) — open your first pull request and navigate the code review process
