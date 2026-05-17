# MCP Security Review Example

This example reviews a hypothetical MCP server that exposes read-only access to local project documentation.

---

## Review Scope

| Field | Notes |
|---|---|
| MCP server | local-docs-mcp-example |
| Environment | sandbox |
| Data classification | public / internal docs only |
| Reviewer | example reviewer |
| Review date | example date |

---

## Access Review

| Area | Decision |
|---|---|
| Filesystem read | Allowed only for `docs/`, `templates/`, and `examples/` |
| Filesystem write | Not allowed |
| Network access | Not allowed |
| Secrets | Not allowed |
| Shell execution | Not allowed |
| Production access | Not allowed |

---

## Required Controls

- [x] Sandbox only
- [x] No secrets
- [x] Read-only access
- [x] Limited paths
- [x] Human approval required before any write-capable server is considered
- [x] Removal plan documented

---

## Decision

Approved for sandbox reference use only.

---

## Notes

This is an example. Do not treat it as approval for any real MCP server.
