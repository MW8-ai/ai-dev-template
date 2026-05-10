# MCP Server Review

Use this template before piloting or adopting a Model Context Protocol (MCP) server.

---

## Server Information

| Field | Notes |
|---|---|
| Server name |  |
| Source URL |  |
| Maintainer |  |
| License |  |
| Reviewer |  |
| Review date |  |
| Intended use |  |

---

## Access Review

- [ ] Filesystem read access
- [ ] Filesystem write access
- [ ] Network access
- [ ] Secret access
- [ ] Shell command execution
- [ ] External API access
- [ ] Database access
- [ ] GitHub access
- [ ] Ticketing system access
- [ ] Production system access

---

## Safety Review

- [ ] Runs in sandbox first
- [ ] Uses test credentials first
- [ ] Permissions are least-privilege
- [ ] Logs do not expose secrets
- [ ] Human approval required for writes
- [ ] Removal/rollback plan exists
- [ ] Owner assigned

---

## Risk Rating

- [ ] Low
- [ ] Medium
- [ ] High

Explain the rating.

---

## Decision

- [ ] Link only
- [ ] Pilot in sandbox
- [ ] Adopt with restrictions
- [ ] Reject
