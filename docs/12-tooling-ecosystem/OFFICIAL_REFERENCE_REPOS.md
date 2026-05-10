# Official Reference Repositories

This file tracks official or vendor-backed repositories and documentation sources that are useful for understanding the current AI-assisted development ecosystem.

These are references, not automatically approved dependencies.

---

## Intake Rule

> Link first. Review second. Adapt third. Import last.

Do not copy code, workflows, skills, prompts, or MCP servers from these sources until they have been reviewed under [REFERENCE_INTAKE_POLICY.md](REFERENCE_INTAKE_POLICY.md).

---

## Reference Sources

| Source | Maintainer | Why Track It | Intake Status |
|---|---|---|---|
| `github/awesome-copilot` | GitHub | Copilot instructions, agents, skills, workflows, MCP references, learning resources | Link only |
| GitHub Copilot docs | GitHub | Official guidance for Copilot, coding agents, instructions, and repository setup | Link only |
| `openai/codex` | OpenAI | Official Codex CLI / coding agent reference | Link only |
| `openai/openai-cookbook` | OpenAI | API examples, tool usage, structured outputs, retrieval patterns | Link only |
| OpenAI docs | OpenAI | Official API, model, and product behavior documentation | Link only |
| `anthropics/claude-code` | Anthropic | Claude Code terminal and IDE workflow reference | Link only |
| `anthropics/skills` | Anthropic | Official skill format and examples using `SKILL.md` | Link only |
| `anthropics/anthropic-cookbook` | Anthropic | Claude API examples, tool use, structured workflows | Link only |
| Model Context Protocol docs | Anthropic / MCP project | Protocol reference for MCP clients and servers | Link only |
| `modelcontextprotocol/servers` | MCP project | Reference MCP servers and community server pointers | Link only |
| GitHub Actions docs | GitHub | Official workflow syntax, permissions, caching, artifacts, and security guidance | Link only |
| GitHub Advanced Security docs | GitHub | CodeQL, secret scanning, dependency review, and supply-chain controls | Link only |

---

## Why Official Does Not Mean Production-Ready

Official examples often optimize for teaching a concept, not for your exact production environment.

Before adoption, ask:

- Is this example intended for production?
- Does it assume broad permissions?
- Does it execute commands?
- Does it read or write files?
- Does it need secrets?
- Does it change infrastructure?
- Does it fit this repo's safety model?

---

## Tracking Notes

When adding a new official reference, include:

- name
- maintainer
- link
- purpose
- risk notes
- last reviewed date
- whether it is link-only, reviewed, adapted, or imported

---

## Next Step

Continue to:

[AWESOME_LISTS_AND_DISCOVERY.md](AWESOME_LISTS_AND_DISCOVERY.md)
