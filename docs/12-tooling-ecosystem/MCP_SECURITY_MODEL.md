# MCP Security Model

Model Context Protocol (MCP) integrations should be treated as tool integrations, not just documentation.

If an MCP server can read files, call APIs, run commands, or write data, it expands the trust boundary of the AI client.

---

## Core Security Principle

> Give MCP servers the least access needed for the specific job.

---

## Permission Areas To Review

| Area | Questions To Ask |
|---|---|
| Filesystem | What paths can it read or write? |
| Network | What hosts or APIs can it call? |
| Secrets | Does it need tokens, keys, or credentials? |
| Commands | Can it execute shell commands? |
| External systems | Can it create tickets, PRs, deployments, or records? |
| Data exposure | Can it send sensitive data to a model or external service? |
| Logging | Does it log prompts, responses, secrets, or file contents? |

---

## Recommended Controls

Use these controls when piloting MCP servers:

- run in a sandbox first
- use test credentials
- restrict filesystem paths
- restrict network access where possible
- avoid production secrets
- document permissions
- require human approval for writes
- monitor logs
- remove unused servers

---

## Approval Required

Human approval is required before an MCP server can:

- access production systems
- read sensitive data
- write to external systems
- execute shell commands
- use secrets
- change infrastructure
- create or merge pull requests
- deploy code

---

## Public Repo Safety

Do not publish:

- real MCP config with secrets
- internal hostnames
- private server URLs
- customer data examples
- production token names that reveal systems
- screenshots containing environment details

Use placeholders:

```text
your_api_key_here
example.internal.invalid
example-token-value
```

---

## Next Step

Continue to:

[MCP_SERVER_REVIEW_CHECKLIST.md](MCP_SERVER_REVIEW_CHECKLIST.md)
