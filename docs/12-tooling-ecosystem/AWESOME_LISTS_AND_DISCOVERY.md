# Awesome Lists and Discovery

Awesome lists and community indexes are useful for discovery, but they are not security reviews.

Use them to learn what exists. Do not treat them as approval to install, copy, or run anything.

---

## Recommended Use

Use awesome lists to:

- discover tools
- compare ecosystem activity
- identify common patterns
- find official sources
- find project names to evaluate later

Do not use awesome lists to:

- approve dependencies
- install MCP servers without review
- copy prompts or skills directly
- assume safety from popularity
- skip license review

---

## Sources Worth Tracking

| Source | Why Track It | Safe Use |
|---|---|---|
| GitHub `awesome-copilot` | Copilot instructions, agents, skills, workflows, and MCP-related resources | Discovery only |
| Awesome Copilot site | Searchable Copilot instructions and learning material | Terminology and examples |
| Awesome MCP lists | Community MCP server discovery | Discovery only |
| Vendor cookbooks | Official examples and common patterns | Learning only until reviewed |
| GitHub Trending | New and popular tools | Awareness only |

---

## Discovery Workflow

```text
Find interesting source
↓
Record link and reason
↓
Identify maintainer and license
↓
Review permissions and dependencies
↓
Decide: ignore, link, pilot, adapt, or adopt
```

---

## Red Flags

Be cautious when a tool or repo:

- has no license
- requires broad permissions
- requires secrets in config files
- executes shell commands
- writes to many filesystem locations
- is rarely updated
- has many unresolved security issues
- is maintained by an unknown source
- asks for production credentials
- has no tests or examples

---

## Next Step

Continue to:

[TOOL_DECISION_MATRIX.md](TOOL_DECISION_MATRIX.md)
