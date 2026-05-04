# What Are Skills?

A **skill** is a reusable bundle of instructions, examples, templates, and rules that helps an agent perform a specific type of work consistently.

Think of a skill as a small playbook an agent can load when it needs domain-specific guidance.

---

## Quick Path for Experienced Developers

Use skills for reusable knowledge such as:

- Code review standards
- Incident response runbooks
- Documentation style
- Security review checklists
- Deployment rules
- Government or enterprise constraints
- Team-specific conventions

A good skill should include:

- Purpose
- When to use it
- When not to use it
- Inputs
- Steps
- Expected outputs
- Safety rules
- Examples

---

## Full Explanation for New Developers

An agent may know how to write code generally, but it may not know your team’s rules.

A skill teaches the agent:

```text
When reviewing code here, check for:
- tests
- logging
- error handling
- security
- documentation updates
```

Skills reduce guessing. They help agents produce work that matches your expectations.

---

## Skill vs Prompt

A **prompt** is usually one request.

A **skill** is reusable context and instructions that can support many requests.

Example prompt:

```text
Review this pull request.
```

Example skill:

```text
Here is how our team reviews pull requests, what risks to check, what format to use, and when to request human approval.
```

---

## Good Skill Design

A good skill is:

- Focused
- Reusable
- Versioned
- Easy to inspect
- Safe by default
- Written in plain language
- Specific about approval boundaries

---

## Skill Folder Pattern

```text
skills/
  code-review/
    SKILL.md
    examples/
    checklists/
```

---

## Next Step

Continue to:

[AGENT_VS_WORKFLOW_VS_SCRIPT.md](AGENT_VS_WORKFLOW_VS_SCRIPT.md)
