# Tool Decision Matrix Example

This example shows how a team might choose tools by need and risk.

---

## Decisions

| Need | Selected Tool | Risk | Notes |
|---|---|---|---|
| Code suggestions in editor | GitHub Copilot | Low | Human reviews all generated changes |
| Repo-level planning | Claude Code or Codex | Medium | Must work through branch and PR |
| External repo awareness | Reference links only | Low | No copying until reviewed |
| MCP access to local docs | Sandbox MCP server | Medium | No production secrets or broad filesystem access |
| CI/CD enforcement | GitHub Actions | Medium | Required checks before merge |

---

## Decision Rule

Choose the least powerful tool that solves the job.

---

## Escalation Rule

If a tool needs secrets, production access, shell execution, or write access to external systems, it requires human approval before pilot use.
