# Tool Decision Matrix

Use this matrix to choose a starting tool without pretending there is one perfect answer.

Tools change quickly. Use this as a decision aid, then verify current capabilities and pricing before adoption.

---

## Quick Matrix

| Need | Best Starting Point | Notes |
|---|---|---|
| GitHub-native code suggestions | GitHub Copilot | Strong inside GitHub, VS Code, and PR workflows |
| Terminal coding agent | OpenAI Codex or Claude Code | Useful for repo-level tasks and branch-based work |
| Long-context planning | Claude Code | Strong for large docs and architecture review |
| API-first application integration | OpenAI or Anthropic SDKs | Good when building product features around LLMs |
| Tool/data access standardization | Model Context Protocol (MCP) | Requires security review before connecting systems |
| Local/private experimentation | Ollama, LM Studio, local models | Good for privacy and cost control; quality varies by model/hardware |
| Team workflow enforcement | GitHub Actions + branch protection | Deterministic guardrails beat memory and preference |
| Security scanning | CodeQL, secret scanning, dependency review, Scorecard | Tune to project type to avoid noisy failures |
| Beginner learning | GitHub web, VS Code, Codespaces | Prefer clear guided path over tool overload |

---

## Decision Questions

Before choosing a tool, ask:

- What task are we trying to improve?
- Is this for one person or a team?
- Does it need repo write access?
- Does it need access to secrets?
- Does it need network access?
- Does it need to run commands?
- Can it operate through Pull Requests?
- Can we audit what it did?
- What happens if it is wrong?
- How do we remove it later?

---

## Risk Levels

### Low Risk

Examples:

- documentation summarization
- local code explanation
- prompt drafting
- checklist creation
- link-only external references

### Medium Risk

Examples:

- code generation
- test generation
- workflow edits
- dependency recommendations
- MCP server pilot in a sandbox

### High Risk

Examples:

- production deployment
- secret handling
- infrastructure changes
- authentication or authorization changes
- write access to external systems
- automated merges

---

## Recommended Adoption Pattern

```text
Learn → Pilot → Review → Standardize → Automate → Maintain
```

Do not jump from discovery to production.

---

## Next Step

Continue to:

[MCP_OVERVIEW.md](MCP_OVERVIEW.md)
