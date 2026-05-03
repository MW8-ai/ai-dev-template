# Testing

## Required checks before merge

- Unit tests pass.
- Integration or smoke tests pass where applicable.
- Lint/type checks pass.
- Security-sensitive changes receive human review.
- Documentation is updated when behavior changes.

## Test tiers

| Tier | Purpose | Examples |
|---|---|---|
| Smoke | Prove app starts and critical path works | load home page, health endpoint |
| Unit | Prove individual functions/components | parser, validator, formatter |
| Integration | Prove connected parts work | API + database, auth + route |
| Regression | Prove fixed bugs stay fixed | bug-specific tests |
| Manual | Prove UX and edge cases | mobile, accessibility, permissions |

## Manual test notes

Record what was tested, by whom, and what evidence was captured.
