# What Are Agents?

An **agent** is a software-controlled assistant that uses an AI model to reason about a goal, inspect context, choose steps, and produce outputs.

Agents may read files, search documentation, run commands, write code, open pull requests, summarize incidents, or propose fixes depending on the tools they are granted.

---

## Quick Path for Experienced Developers

Use agents when the task involves:

- Multiple steps
- Ambiguous requirements
- Research or context gathering
- Planning before execution
- Drafting code or documentation
- Reviewing changes against standards

Do not use agents for:

- Unreviewed production changes
- Secret handling
- Financial or legal decisions without approval
- Security-sensitive changes without human review
- Anything where a deterministic script is safer

---

## Full Explanation for New Developers

A simple script follows exact instructions.

An agent can make decisions within limits.

For example:

A script can run:

```bash
npm test
```

An agent can:

1. Read the failing test output
2. Search the related source files
3. Suggest the likely cause
4. Draft a fix
5. Explain what changed
6. Ask for approval before opening a pull request

That makes agents useful, but also risky. Because agents can make assumptions, they need clear boundaries.

---

## Common Agent Capabilities

Agents may be allowed to:

- Read project files
- Search documentation
- Generate code
- Create tests
- Update Markdown documentation
- Run local commands in a sandbox
- Open issues or pull requests
- Summarize changes

Agents should usually not be allowed to:

- Read production secrets
- Deploy directly to production
- Delete data
- Change billing settings
- Disable security controls
- Merge their own pull requests

---

## Recommended Agent Rule

> Agents may propose and prepare changes. Humans approve risk.

---

## Safe Agent Lifecycle

```text
Goal
↓
Context gathering
↓
Plan
↓
Human review if risky
↓
Draft changes
↓
Automated validation
↓
Pull request
↓
Human review
↓
Merge
```

---

## Next Step

Continue to:

[WHAT_ARE_SKILLS.md](WHAT_ARE_SKILLS.md)
