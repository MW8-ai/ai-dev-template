# Pull Request Safety, Rejection, and When Not to Merge

## Why This Exists

A Pull Request is not just a button to move code.

It is a decision point.

The goal is not to merge everything. The goal is to safely improve the codebase.

## Can a Pull Request Be Rejected?

Yes.

Better words than "rejected":

- closed
- declined
- not accepted
- needs rework
- superseded
- unsafe to merge

## When to Close a PR Without Merging

Close a PR when:

- It solves the wrong problem
- It duplicates another PR
- It introduces unnecessary risk
- It fails CI
- It lacks context
- It includes secrets or sensitive data
- It is too large to review safely
- It changes unrelated files
- It bypasses team standards
- The feature is no longer wanted

## How to Close Professionally

Good comment:

```text
Closing this PR because the approach overlaps with #123 and changes files outside the intended scope. Please open a smaller PR focused only on the login timeout behavior.
```

Bad comment:

```text
No.
```

## What If the PR Is Close But Not Ready?

Request changes instead of closing.

Use:

```text
Request changes
```

when the idea is valid but the implementation needs work.

## What If the PR Is Risky?

Ask for:

- smaller PR
- rollback plan
- test evidence
- screenshots
- logs
- architecture note
- security review
- Code Owner review

## What If an AI Agent Opened the PR?

Treat it like a junior developer with speed.

Require:

- human review
- CI pass
- limited file scope
- no secrets
- no production credential access
- clear summary of what changed
- command log or implementation notes when available

## Safety Checklist Before Merge

- [ ] Do I understand why this change exists?
- [ ] Is the PR small enough to review?
- [ ] Did CI pass?
- [ ] Did the right owner review it?
- [ ] Are secrets absent?
- [ ] Are unrelated changes absent?
- [ ] Is there a rollback path?
- [ ] Would I be comfortable explaining this in an incident review?

## Golden Rule

```text
A closed PR is not a failure.
A bad merge can become an incident.
```
