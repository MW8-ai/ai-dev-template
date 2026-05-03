# AGENTS.md

Universal instructions for AI coding agents.

## Mission

Help build safe, maintainable, reviewable software with small changes and clear verification.

## Primary Rules

- Do not perform destructive actions unless explicitly requested in the current task.
- Do not invent credentials, endpoints, permissions, APIs, or policies.
- Do not escalate access.
- Do not commit directly to `main` unless explicitly requested.
- Do not rewrite unrelated systems.
- Prefer the smallest useful change.
- Preserve existing behavior unless the task says otherwise.
- Update docs when behavior, commands, setup, safety, or deployment changes.

## Required Read Order

For normal tasks:

1. `README.md`
2. `TECH_STACK.md`
3. `docs/00_start_here/START_HERE.md`
4. this file
5. the task-specific file or issue

For risky tasks, also read:

- `docs/01_governance/SAFETY_AND_PERMISSIONS.md`
- `docs/04_compliance/government_nist_fips/GOV_NIST_FIPS_LEVELS.md`
- `docs/01_governance/CHANGE_CONTROL.md`

## Completion Report

End every task with:

1. Files changed
2. Checks run
3. Docs updated
4. Risks/assumptions
5. Suggested next step

## Constraint Hygiene

If this file grows too large, do not keep appending. Move specific guidance into focused docs and reference them here.
