# Merge Methods Explained: Merge Commit vs Squash vs Rebase

## Why This Exists

GitHub gives you merge options that sound simple but can be confusing:

- Create a merge commit
- Squash and merge
- Rebase and merge

The confusion usually comes from the word **merge**. In GitHub, all three choices put Pull Request changes into the target branch. They just do it with different history styles.

## Key Terms

| Term | Meaning |
|---|---|
| Source branch / head branch | The branch containing the proposed changes |
| Target branch / base branch | The branch receiving the changes, often `main` |
| Merge | Combine changes from one branch into another |
| Fetch | Download remote information without changing your current branch |
| Pull | Fetch plus integrate changes into your current branch |
| Push | Upload your commits to a remote repository |

## Pull Request Direction

A Pull Request usually means:

```text
feature/my-change → main
```

Plain English:

```text
Please let main pull in the changes from feature/my-change.
```

It does **not** mean:

```text
Pull main into my local machine.
```

## Create a Merge Commit

### What It Does

Keeps all commits from the source branch and adds one extra merge commit on the target branch.

```text
A---B---C main
     \ 
      D---E feature
           \
            M main after merge
```

### Best For

- Team projects where you want complete history
- Larger feature branches
- Situations where preserving context matters

### Why Use It

It shows exactly when a branch was merged and preserves the branch story.

### Downside

History can get noisy if every tiny PR creates a merge commit.

## Squash and Merge

### What It Does

Combines all commits from the source branch into one clean commit on the target branch.

```text
feature commits:
D: try fix
E: typo
F: final fix

main receives:
G: fix login timeout
```

### Best For

- Small feature branches
- Messy local commit history
- Teams that want a clean `main` history

### Why Use It

Most people do not need every tiny "oops", "fix typo", or "try again" commit preserved forever.

### Downside

You lose the detailed commit-by-commit story from the branch.

## Rebase and Merge

### What It Does

Replays each source branch commit onto the target branch without creating a merge commit.

```text
Before:
A---B---C main
     \
      D---E feature

After:
A---B---C---D'---E' main
```

### Best For

- Teams that want a linear history
- Smaller, clean commit sets
- Developers comfortable with Git history

### Why Use It

It keeps history straight and avoids merge commits.

### Downside

It rewrites commit identity during the rebase process. That can confuse beginners and can be risky if used carelessly on shared branches.

## Recommended Default

For most beginner-to-expert mixed teams:

```text
Squash and merge
```

## Recommended Exceptions

| Situation | Recommended Method |
|---|---|
| Small feature or bug fix | Squash and merge |
| Large feature where commit story matters | Create a merge commit |
| Expert team with clean commits and linear history preference | Rebase and merge |
| Hotfix | Squash or merge commit, depending on audit needs |

## What Senior Developers Care About

Senior developers usually do not care which method is used as much as they care that the team has a standard.

Pick one default. Document exceptions. Enforce it where possible.

## Common Mistake

Changing the merge method randomly from PR to PR.

Why this is bad:

- History becomes inconsistent
- Rollbacks are harder
- Changelogs become messier
- New developers cannot learn the pattern

## Rule of Thumb

```text
Squash by default.
Merge commit when history matters.
Rebase only when the team understands it.
```
