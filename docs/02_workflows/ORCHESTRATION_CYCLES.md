# ORCHESTRATION_CYCLES.md

## Basic Agent Cycle

```text
Human priority
→ Planner
→ Builder
→ Tester
→ Reviewer
→ Documenter
→ Human approval
```

## Role Split

Planner:
- defines scope, files, risk, acceptance criteria

Builder:
- implements smallest safe change

Tester:
- runs checks and reproduces issues

Reviewer:
- checks risk, scope creep, maintainability

Documenter:
- updates docs and changelog

Health Reviewer:
- periodically checks drift, repetition, stale docs

## Stop Conditions

Stop when:

- same error appears 3 times
- scope keeps expanding
- agent changes too many unrelated files
- tests get worse
- agent proposes deletion/reset
- docs conflict with code
