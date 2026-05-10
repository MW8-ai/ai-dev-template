# MCP Server Review Checklist

Use this checklist before piloting or adopting a Model Context Protocol (MCP) server.

---

## Basic Information

| Field | Notes |
|---|---|
| Server name |  |
| Source URL |  |
| Maintainer |  |
| License |  |
| Last reviewed |  |
| Reviewer |  |
| Intended use |  |

---

## Review Checklist

- [ ] Source repository reviewed
- [ ] License reviewed
- [ ] Maintainer identified
- [ ] Recent activity checked
- [ ] Security issues reviewed
- [ ] Required permissions documented
- [ ] Filesystem access documented
- [ ] Network access documented
- [ ] Secret handling documented
- [ ] Command execution reviewed
- [ ] Logging behavior reviewed
- [ ] Sandbox test completed
- [ ] Human approval points identified
- [ ] Rollback/removal plan documented

---

## Risk Rating

Choose one:

- Low — read-only, no secrets, no writes, sandboxed
- Medium — limited writes or limited API access
- High — secrets, production access, shell execution, infrastructure changes, or broad permissions

---

## Approval Decision

| Decision | Meaning |
|---|---|
| Link only | Reference but do not use |
| Pilot | Test in sandbox only |
| Adopt with restrictions | Approved with documented limits |
| Reject | Do not use |

---

## Notes

Document assumptions, concerns, and follow-up work here.

---

## Next Step

Continue to:

[LLM_MODEL_REGISTRY.md](LLM_MODEL_REGISTRY.md)
