# Agent vs Workflow vs Script

Agents, workflows, and scripts are related, but they are not the same thing.

Choosing the right tool matters.

---

## Quick Path for Experienced Developers

Use this rule:

```text
Need judgment? Use an agent.
Need repeatability? Use a workflow.
Need one exact action? Use a script.
```

---

## Comparison Table

| Tool | Best For | Avoid When |
|---|---|---|
| Agent | Ambiguous, multi-step, context-heavy tasks | Production changes without approval |
| Workflow | Repeatable team process | The process requires frequent judgment |
| Script | Deterministic automation | Requirements are unclear or changing |

---

## Script

A script performs specific instructions.

Example:

```bash
./scripts/validate-repo.sh
```

Scripts are best when the steps are known and repeatable.

---

## Workflow

A workflow organizes a process.

Example:

```text
Create issue → branch → commit → pull request → review → merge
```

GitHub Actions workflows automate parts of that process.

---

## Agent

An agent can reason through a task.

Example:

```text
Review this incident log, compare it to the runbook, propose likely causes, and draft a follow-up issue.
```

Agents are useful when the path is not fully known in advance.

---

## Recommended Pattern

Use all three together:

```text
Agent plans or drafts
Workflow controls review
Script validates repeatable checks
Human approves important decisions
```

---

## Example

For a pull request:

- Agent drafts code
- Script runs tests
- GitHub Actions workflow enforces checks
- Human reviews and approves
- Maintainer merges

---

## Next Step

Continue to:

[HUMAN_APPROVAL_PATTERNS.md](HUMAN_APPROVAL_PATTERNS.md)
