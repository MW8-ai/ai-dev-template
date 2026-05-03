# START_HERE.md

## Purpose

This repository is a reusable AI-native development operating system.

It is not tied to a specific app, game, agency, or company.

## Recommended Repo Layout

```text
/
  README.md
  AGENTS.md
  TECH_STACK.md
  DESIGN.md
  TESTING.md
  DEPLOYMENT.md
  CHANGELOG.md
  docs/
    project/
      ROADMAP.md
    00_start_here/
    01_governance/
    02_workflows/
    03_tools/
    04_compliance/
    05_prompts/
    06_roles/
    07_snapshots/
    08_examples/
```

## Workflow

1. Define the task.
2. Pick the workflow tier.
3. Pick the model/tool.
4. Scope the task.
5. Build on a branch.
6. Run checks.
7. Review diff.
8. Update docs.
9. Commit.
10. Push and open PR if applicable.

## Avoid Overload

Do not make every agent read every doc.

Use:

- core docs for normal tasks
- compliance docs for regulated tasks
- safety docs for destructive/risky tasks
- tool docs only when using that tool
- snapshots only when checking current tool state
