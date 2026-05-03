# FRICTION_CONTROL.md

## Principle

More docs do not automatically mean more safety.

Safety comes from:

1. limited permissions
2. branch protection
3. CI/CD checks
4. backups
5. rollback plans
6. human approval for risky actions

Docs guide behavior. Controls enforce behavior.

## When Not to Add More Rules

Do not add a new permanent rule when:

- it repeats another rule
- it applies only once
- it is vague
- it belongs in a test or permission boundary
- it makes safe tasks harder without reducing risk

## When to Add a Rule

Add a rule when it:

- prevents repeated failure
- protects data, secrets, money, users, or production
- improves consistency across many tasks
- can be written clearly

## Preferred Escalation

```text
One-off issue → task note
Repeated issue → AGENTS.md rule or focused doc
Safety issue → permission/CI/control
Compliance issue → governance doc + approval gate
```
