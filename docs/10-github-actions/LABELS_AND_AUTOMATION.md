# Labels and Automation

## Purpose

Labels make issues, PRs, releases, dashboards, and automation easier to manage.

## Recommended Label Groups

### Type Labels

- type: bug
- type: feature
- type: documentation
- type: task
- type: ci-cd
- type: security
- type: chore

### Priority Labels

- priority: low
- priority: medium
- priority: high
- priority: critical

### Status Labels

- needs triage
- needs review
- blocked
- in progress
- ready to merge

### Release Labels

- release: major
- release: minor
- release: patch
- skip-changelog

### Area Labels

- area: frontend
- area: backend
- area: infrastructure
- area: docs
- area: security
- area: devops

## WHY Labels Matter

Without labels:
- Issues become a junk drawer.
- Release notes are harder.
- Work is harder to prioritize.
- Automation has nothing reliable to act on.

With labels:
- PRs can generate cleaner release notes.
- Teams can filter work quickly.
- Metrics become easier.
- CI/CD and governance rules become easier.

## Automation Ideas

| Automation | Why |
|---|---|
| Auto-label PRs by changed files | Reduces manual cleanup |
| Add `needs triage` to new issues | Makes intake visible |
| Add docs label to Markdown changes | Helps docs owners review |
| Add CI/CD label to workflow changes | Protects automation |
| Exclude `skip-changelog` from releases | Keeps release notes clean |

## Suggested Setup Order

1. Create label taxonomy.
2. Add issue templates with default labels.
3. Add PR labeler workflow.
4. Add release note categories.
5. Add branch protection requiring CI.

## Golden Rule

> Labels are not decoration. They are lightweight workflow data.
