# Branch Protection Rules Expanded

## Protected Branch

Protect:

```text
main
```

## Recommended Rules

Enable:

- Require a pull request before merging
- Require approvals
- Require review from Code Owners
- Dismiss stale approvals when new commits are pushed
- Require status checks to pass
- Require branches to be up to date before merging
- Require conversation resolution before merging
- Block force pushes
- Block branch deletion
- Restrict who can push to matching branches if needed

## WHY Each Rule Matters

### Require PRs

Prevents direct commits to production-ready code.

### Require Approvals

Makes code review part of the delivery system.

### Require Code Owner Review

Ensures risky areas get reviewed by the right people.

### Dismiss Stale Approvals

Prevents someone from approving one version of code and merging a later, changed version.

### Require Status Checks

Prevents broken builds, failed tests, or lint errors from entering main.

### Require Branch Up To Date

Ensures CI tested the code against current main, not yesterday's main.

### Require Conversation Resolution

Prevents unresolved review questions from being ignored.

### Block Force Pushes

Protects commit history and prevents accidental overwrites.

### Block Deletion

Protects the official branch from accidental removal.

## Suggested Minimum

For a small team:

- Require PR
- Require 1 approval
- Require CI checks
- Block force push

For a production team:

- Require PR
- Require 2 approvals
- Require Code Owner review
- Require CI checks
- Dismiss stale approvals
- Require resolved conversations
- Block force push
- Block deletion

## Golden Rule

> Branch protection turns team agreements into enforced guardrails.
