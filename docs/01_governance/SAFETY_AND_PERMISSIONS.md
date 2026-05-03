# SAFETY_AND_PERMISSIONS.md

## Core Rule

Never give an AI agent credentials that can do something you would not want done automatically.

## Default Access

Agents should use:

- read-only access first
- dev credentials before staging
- staging before production
- scoped tokens
- branch-based work
- no direct production admin

## Human Approval Required

- deleting data
- dropping/truncating/resetting databases
- changing production configuration
- changing auth/IAM
- rotating/removing secrets
- changing billing
- force pushing
- deploying to production
- using discovered credentials

## Database Safety

Agents must not run automatically:

```sql
DROP
TRUNCATE
DELETE without WHERE
GRANT
REVOKE
ALTER ROLE
schema reset
```

## If a Secret Is Found

1. Stop.
2. Do not use it.
3. Report where it was found.
4. Recommend rotation.
5. Remove from repo/history using approved process.
