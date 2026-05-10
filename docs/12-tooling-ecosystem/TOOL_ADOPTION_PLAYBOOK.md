# Tool Adoption Playbook

Use this playbook when deciding whether to adopt a new developer tool, AI coding assistant, MCP server, LLM, GitHub Action, plugin, extension, or workflow automation.

---

## Adoption Flow

```text
Discover
↓
Reference
↓
Review
↓
Pilot
↓
Standardize
↓
Maintain
```

---

## 1. Discover

Find the tool through:

- official vendor docs
- official repositories
- community awesome lists
- trusted recommendations
- team experiments
- release notes

Record the source. Do not install it yet.

---

## 2. Reference

Add a link and a short note explaining why it matters.

Reference entries should include:

- name
- maintainer
- link
- category
- why it is worth tracking
- intake status

---

## 3. Review

Use the relevant template:

- `templates/tools/EXTERNAL_REPO_REVIEW.md`
- `templates/tools/TOOL_EVALUATION.md`
- `templates/mcp/MCP_SERVER_REVIEW.md`
- `templates/mcp/MCP_SECURITY_REVIEW.md`

---

## 4. Pilot

Pilot safely:

- use test data
- use sandbox credentials
- limit permissions
- document setup steps
- capture failures
- measure usefulness
- assign an owner

---

## 5. Standardize

If the pilot succeeds, document:

- approved use cases
- disallowed use cases
- required settings
- security rules
- cost limits
- update schedule
- rollback plan

---

## 6. Maintain

Review adopted tools regularly.

Suggested cadence:

| Review | Frequency |
|---|---|
| Critical security tooling | Monthly |
| AI coding tools | Monthly or quarterly |
| MCP servers | Monthly while active |
| GitHub Actions | Quarterly |
| LLM model registry | Monthly or after major releases |
| External reference lists | Quarterly |

---

## Adoption Decision Outcomes

| Outcome | Meaning |
|---|---|
| Track | Keep as reference only |
| Pilot | Test in sandbox |
| Adopt | Use with approved controls |
| Replace | Supersede an older tool |
| Reject | Do not use |
| Archive | No longer relevant |

---

## Next Step

Use the review templates in:

- `templates/tools/`
- `templates/mcp/`
