# Security Boundaries for Agents and Skills

Agents should operate inside clear security boundaries.

A powerful agent without boundaries can become a risk to code quality, data protection, infrastructure stability, and compliance.

---

## Quick Path for Experienced Developers

Default stance:

```text
Read broadly.
Write narrowly.
Execute carefully.
Approve explicitly.
Audit everything important.
```

---

## Boundary Types

### Repository Boundaries

Define which repositories an agent can access.

Recommended:

- Allow access only to required repositories
- Use least privilege
- Avoid all-org access unless necessary
- Review access quarterly

### File Boundaries

Define which paths an agent can edit.

Recommended safe paths:

```text
docs/
templates/
examples/
tests/
```

Use extra caution for:

```text
.github/workflows/
infra/
security/
auth/
database/
```

### Tool Boundaries

Define which tools an agent may use.

Common tools:

- file read
- file write
- command execution
- GitHub issue creation
- GitHub pull request creation

Riskier tools:

- deployment
- cloud console actions
- secret manager access
- production database access

---

## Secrets

Agents should not receive real secrets unless absolutely required.

Use placeholders in docs:

```text
your_api_key_here
example-token-value
```

Do not use:

```text
sk-live-real-token
real hostnames
real usernames
real production URLs
```

---

## Sandbox First

Agents should run code in a sandbox or development environment before production.

Examples:

- Codespaces
- local development container
- test branch
- staging environment

---

## Approval Required

Require explicit approval before:

- merging
- deploying
- deleting
- changing auth
- changing security policies
- changing workflow permissions

---

## Public Repository Reminder

Before making agent or skill docs public, verify:

- no internal hostnames
- no real incident details
- no customer names
- no private runbooks
- no credentials
- no screenshots with sensitive data

---

## Next Step

Continue to:

[CODING_AGENT_PATTERN.md](CODING_AGENT_PATTERN.md)
