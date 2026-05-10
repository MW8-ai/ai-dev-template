# AI-Enabled Team Workflow Example

This example shows how a team can use the repository's AI, tool intake, MCP, and GitHub workflow guidance together.

It is intentionally small and reviewable. The goal is to demonstrate the pattern, not to provide a production app.

---

## What This Example Demonstrates

- how a team defines AI agent boundaries
- how tools are evaluated before adoption
- how MCP servers are reviewed before use
- how LLM models are documented by use case
- how human approval is recorded
- how AI-assisted changes still flow through Pull Requests

---

## Files

| File | Purpose |
|---|---|
| `AGENTS.md` | Agent rules for this example project |
| `TOOL_DECISION_MATRIX.md` | How the team chooses tools by need and risk |
| `MCP_SECURITY_REVIEW.md` | Example MCP server security review |
| `LLM_MODEL_CARD.md` | Example model card for choosing an LLM |
| `EXTERNAL_REPO_REVIEW.md` | Example external repo review |
| `HUMAN_APPROVAL_NOTES.md` | Approval notes for AI-assisted work |

---

## Workflow

```text
Create issue
↓
Select tool or agent
↓
Check boundaries and templates
↓
Draft change on branch
↓
Run GitHub Actions
↓
Human review
↓
Merge
```

---

## Rule This Example Proves

> AI can speed up the work, but the workflow still owns the risk.

---

## Related Docs

- [`../../ai/README.md`](../../ai/README.md)
- [`../../docs/11-agents-and-skills/`](../../docs/11-agents-and-skills/)
- [`../../docs/12-tooling-ecosystem/`](../../docs/12-tooling-ecosystem/)
- [`../../templates/tools/`](../../templates/tools/)
- [`../../templates/mcp/`](../../templates/mcp/)
