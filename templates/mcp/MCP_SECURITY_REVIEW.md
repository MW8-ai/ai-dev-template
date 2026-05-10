# MCP Security Review

Use this template for higher-risk Model Context Protocol (MCP) servers or MCP servers intended for team use.

---

## Review Scope

| Field | Notes |
|---|---|
| MCP server |  |
| Environment | local / sandbox / staging / production |
| Data classification | public / internal / confidential / regulated |
| Reviewer |  |
| Review date |  |

---

## Threat Questions

- What can the server read?
- What can the server write?
- What commands can it execute?
- What network calls can it make?
- What secrets does it require?
- What logs does it create?
- What data may be sent to an LLM?
- What happens if the model asks it to do the wrong thing?

---

## Required Controls

- [ ] Least privilege configured
- [ ] No production secrets in local config
- [ ] Sandbox test completed
- [ ] Human approval required for writes
- [ ] Logging reviewed
- [ ] Sensitive data handling reviewed
- [ ] Rollback/removal steps documented
- [ ] Owner assigned
- [ ] Review cadence defined

---

## Approval

- [ ] Approved for link/reference only
- [ ] Approved for sandbox pilot
- [ ] Approved for team use with restrictions
- [ ] Not approved

---

## Conditions / Restrictions

Document required restrictions here.
