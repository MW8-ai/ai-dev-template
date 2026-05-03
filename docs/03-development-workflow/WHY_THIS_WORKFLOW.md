# Why This Workflow

Most teams find Git confusing until they understand that the workflow is not arbitrary — every step exists to prevent a specific class of problem that has caused real damage on real projects.

---

## The Core Problem: Code Needs Checkpoints

Without a structured workflow, code changes go directly from one person's mind to production. This creates:

- **No review** — logic errors, security gaps, and broken assumptions ship unchecked
- **No history** — when something breaks at 2am, nobody knows what changed or why
- **No rollback** — undoing a bad change is difficult or impossible
- **No coordination** — two developers working on the same file create conflicts with no clear resolution

This workflow solves each problem with a specific mechanism.

---

## Why Branches

**Branches isolate work.**

Without branches, every developer writes directly to the same codebase simultaneously. One person's half-finished feature breaks everyone else's environment.

With branches:

- Each change lives in its own isolated space
- `main` stays stable and deployable at all times
- Multiple features can be developed in parallel without interference
- If an experiment fails, deleting the branch leaves no trace

The cost of creating a branch is nearly zero. The cost of *not* branching — a broken `main` at 9am on a Monday — is not.

---

## Why Pull Requests

**Pull Requests create a checkpoint before code reaches the shared codebase.**

A PR is not bureaucracy. It is a structured moment where:

1. The author explains what they changed and why
2. At least one other developer reads the code before it merges
3. Automated checks run: tests, linting, security scanning, doc freshness
4. Anyone on the team can comment, question, or block the merge

The single most common source of production incidents is code that nobody reviewed. Pull Requests are the gate that prevents this.

**The review also improves the code.** A developer who knows someone else will read their work writes more clearly. Reviewers catch edge cases the author missed. Knowledge spreads across the team.

---

## Why Commit Messages Matter

**Commits are the audit trail.**

When a bug is discovered in production, the first question is always: "What changed?" A commit history full of "fix", "update", and "wip" is useless for this. A commit history that reads:

```text
feat(auth): add rate limiting to login endpoint
fix(api): return 400 instead of 500 for malformed JSON
chore(deps): upgrade express from 4.18.2 to 4.19.2
```

— tells you exactly what happened, when, and why. You can find the change that introduced a bug in seconds instead of hours.

This is why this repo enforces [Conventional Commits](../06-standards/COMMIT_CONVENTION.md) on every PR.

---

## Why CI/CD Enforcement

**Automated checks are the safety net for things humans miss.**

No developer can manually check every file, every link, every security pattern, every time. CI/CD automates the checks that are:

- Too tedious to do by hand (linting 200 files)
- Too easy to forget under deadline pressure (updating docs)
- Too subtle for casual review (checking for committed secrets)

When a CI check fails, it is not the workflow being obstructive — it is the safety net working correctly. The correct response is to fix the underlying issue, not to bypass the check.

---

## Why Documentation Standards

**Documentation is memory.**

Decisions, constraints, architecture choices, and deployment steps that live only in someone's head leave the organization when that person leaves — or go on vacation at the worst possible time.

Documentation in the repo:

- Persists across team changes
- Is versioned alongside the code it describes
- Is searchable, reviewable, and updatable like any other file
- Makes onboarding a predictable experience instead of an oral tradition

The documentation standards in this repo exist so that any developer can pick up any part of the project and understand it within minutes.

---

## Why This Specific Set of Defaults

There are many valid Git workflows. This repo chose a specific set of defaults — squash merge, Conventional Commits, branch naming prefixes, required PR reviews — not because they are the only valid choices, but because:

1. **Consistency beats preference.** Any reasonable default, applied consistently, produces better outcomes than each developer doing whatever feels natural.

2. **These defaults are industry-standard.** A developer who learns this workflow can contribute to most professional open-source and enterprise projects without relearning from scratch.

3. **They are automation-friendly.** Structured commit messages enable automated changelogs. Branch prefixes enable automated labeling. PR conventions enable automated version bumping. The defaults were chosen to work together.

See [docs/06-standards/OPINIONATED_DEFAULTS.md](../06-standards/OPINIONATED_DEFAULTS.md) for the full list of defaults and the rationale behind each one.

---

## The Short Version

```text
Branch        → work without breaking things
Pull Request  → review before it matters
Commit message → audit trail when things break
CI/CD         → catch what humans miss
Documentation → memory that survives personnel changes
```

None of these steps exist to slow you down. They exist because every team that skipped them eventually paid a much higher cost.

---

## Next Step

→ [ISSUE_TO_BRANCH_TO_PR.md](ISSUE_TO_BRANCH_TO_PR.md) — put this into practice: create an issue, branch, PR, and merge
