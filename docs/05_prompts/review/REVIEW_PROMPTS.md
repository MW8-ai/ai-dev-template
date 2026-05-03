# REVIEW_PROMPTS.md

## Scope Creep Review

```text
Review the git diff only.
Identify unrelated changes, risky changes, and missing tests.
Do not modify files.
Return: approve, request changes, or needs human decision.
```

## Security Review

```text
Read SAFETY_AND_PERMISSIONS.md and SECURITY.md.
Review the proposed changes for secrets, auth, permissions, data deletion, and deployment risk.
Do not modify files.
Return specific findings and severity.
```

## Project Health Review

```text
Read PROJECT_HEALTH_REVIEW.md.
Check whether docs are repeating, stale, contradictory, or too large.
Suggest consolidation without deleting useful history.
```
