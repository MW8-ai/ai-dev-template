# Fetch, Pull, Push, Remote Branches, and Ownership

## Why This Exists

Many Git problems come from mixing up these ideas:

- local branch
- remote branch
- branch owner
- repository owner
- fork
- pull
- fetch
- push
- Pull Request

## Local vs Remote

Your laptop or Codespace has a local copy.

GitHub has the remote copy.

```text
Local machine / Codespace
        ↕
GitHub remote repository
```

## Fetch

```bash
git fetch origin
```

Fetch means:

```text
Show me what changed on GitHub, but do not change my current working branch.
```

Use it when you want awareness without risk.

## Pull

```bash
git pull origin main
```

Pull means:

```text
Fetch the latest changes, then integrate them into my current branch.
```

Pull can create conflicts because it changes your working branch.

## Push

```bash
git push origin feature/my-work
```

Push means:

```text
Upload my commits to GitHub.
```

Pushing to your feature branch is normal.

Pushing directly to `main` should usually be blocked.

## Can Fetch Be Done by Branch?

Yes.

```bash
git fetch origin main
```

That downloads information about `main` from the `origin` remote.

You can also fetch all branches:

```bash
git fetch --all
```

## What Is `origin`?

`origin` is the default nickname for the remote repository you cloned from.

Check it:

```bash
git remote -v
```

Example:

```text
origin  https://github.com/my-org/my-repo.git (fetch)
origin  https://github.com/my-org/my-repo.git (push)
```

## What Is `upstream`?

When working from a fork, `origin` is often your fork and `upstream` is the original repository.

```text
origin   = your fork
upstream = original repo
```

Example:

```bash
git remote add upstream https://github.com/original-org/original-repo.git
git fetch upstream
```

## Same Repo, Same Team

Most internal teams work like this:

```text
same GitHub repo
different branches
same team permissions
```

Example:

```text
feature/login-fix → main
```

This is simpler than forks.

## Different Repos

Different repos can be involved when using forks.

Example:

```text
your-user/my-repo-fork:feature/login-fix → company/my-repo:main
```

This is common in open source or when contributors do not have direct write access.

## Do Different Repos Require a Fork?

Usually, yes, for Pull Requests into the original repo.

A fork is a GitHub-supported copy that keeps a relationship to the original repository.

## Why Forks Exist

Forks let people propose changes without giving them write access to the main repository.

## Fork Ownership and Permissions

If you fork a repo:

- You own your fork.
- The original owner owns the upstream repo.
- Your fork may be public or private depending on repo and organization rules.
- Maintainers may or may not be allowed to edit your PR branch, depending on settings.

## Common Beginner Confusion

```text
"I opened a PR, so why can’t I merge it?"
```

Because opening a PR and having permission to merge are different.

## Common Team Confusion

```text
"I can push to the branch, so why can’t I merge to main?"
```

Because branch protection can allow branch work but block main updates until rules pass.

## Rule of Thumb

```text
Fetch to look.
Pull to update yourself.
Push to publish your branch.
PR to propose.
Merge to accept.
```
