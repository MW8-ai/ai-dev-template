# CHANGE_CONTROL.md

## Low Risk

Examples:

- docs
- copy changes
- CSS polish
- non-production examples

Approval:

- self-review or peer review

## Medium Risk

Examples:

- feature work
- new dependency
- API integration
- deployment config for non-prod

Approval:

- PR review
- checks pass

## High Risk

Examples:

- auth
- production deployment
- database migration
- permission change
- billing
- deletion

Approval:

- human approval
- rollback plan
- backup verified if data involved
- change window if required

## Change Request Template

```text
Change:
Reason:
Risk level:
Systems affected:
Test plan:
Rollback plan:
Approver:
```
