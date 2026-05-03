## Summary

<!-- What changed and why? 2-3 sentences. Describe the problem being solved and the approach taken.
     Do not just restate the title. Link to the issue for full context. -->

This PR ...

---

## Type of Change

- [ ] Bug fix — non-breaking change that fixes an issue
- [ ] New feature — non-breaking change that adds functionality
- [ ] Breaking change — existing behavior changes (API contract, DB schema, env vars)
- [ ] Documentation update
- [ ] Refactor — no behavior change, code quality improvement
- [ ] Test — adding or updating tests only
- [ ] Dependency update
- [ ] CI/infrastructure change

---

## Testing Done

- [ ] Unit tests added or updated (`npm test` passes)
- [ ] Integration tests added or updated (`npm run test:integration` passes)
- [ ] Manually tested against local Docker stack
- [ ] Tested against staging environment
- [ ] No tests needed — explain why:

**Manual test steps (if applicable):**

```
# Example:
# 1. POST /tasks with missing title
# 2. Expected: 400 {"error":{"code":"VALIDATION_ERROR","message":"title is required"}}
# 3. Actual: ✓
```

---

## Database Changes

- [ ] No database changes
- [ ] Migration included in `database/migrations/`
- [ ] Migration is backward-compatible (old app version can run against new schema)
- [ ] Migration has been tested with rollback (`npm run db:migrate:rollback`)
- [ ] Large table migration — reviewed for lock duration with DB admin

---

## API Contract Changes

- [ ] No API changes
- [ ] New endpoint added (non-breaking)
- [ ] Request/response shape changed — **breaking change, see details below**
- [ ] New required field added to request — **breaking change, coordinate with clients**

**Breaking change details (if applicable):**

---

## Checklist

- [ ] Code follows the TypeScript/ESLint style guide (`npm run lint` passes)
- [ ] `npm run typecheck` passes with no errors
- [ ] Self-review completed — I have read through my own diff
- [ ] Tests added or updated for all new behavior
- [ ] All existing tests pass (`npm run test:all`)
- [ ] `CHANGELOG.md` updated under `## Unreleased`
- [ ] No secrets, API keys, or credentials in this diff
- [ ] Environment variables table in `DEPLOYMENT.md` updated if new vars added
- [ ] AI-generated code reviewed and understood by me (if applicable)

---

## Screenshots / Example Output

<!-- For API changes: paste a sample request and response.
     For bug fixes: paste the error before and after.
     Delete this section if not applicable. -->

**Before:**
```
```

**After:**
```
```

---

## Related Issues

Closes #

<!-- Additional context: -->
<!-- Depends on # -->
<!-- Related to # -->
