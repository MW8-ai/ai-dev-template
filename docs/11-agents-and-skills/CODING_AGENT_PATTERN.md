# Coding Agent Pattern

A coding agent helps plan, implement, test, and document code changes.

The safest coding agent does not bypass the team workflow. It works inside it.

---

## Quick Path for Experienced Developers

Recommended coding agent flow:

```text
Issue
↓
Agent reads context
↓
Agent proposes plan
↓
Human approves plan if needed
↓
Agent drafts changes on branch
↓
Tests and checks run
↓
Pull request opens
↓
Human review
↓
Merge
```

---

## When to Use a Coding Agent

Use a coding agent for:

- Writing boilerplate
- Creating tests
- Refactoring low-risk code
- Updating documentation
- Explaining unfamiliar code
- Drafting implementation plans
- Finding likely causes of bugs

---

## When Not to Use a Coding Agent

Do not let a coding agent independently:

- merge pull requests
- deploy production
- rewrite security-critical code without review
- change authentication flows without approval
- modify infrastructure without approval
- handle secrets without safeguards

---

## Inputs

A coding agent should receive:

- issue or task description
- relevant files
- acceptance criteria
- test requirements
- coding standards
- security constraints
- expected output format

---

## Required Output

A good coding agent output should include:

- summary of changes
- files changed
- tests run
- risks or assumptions
- follow-up work
- human review notes

---

## Suggested Agent Instructions

```md
You are a coding agent working in this repository.

Rules:
- Do not push directly to main.
- Work on a feature branch.
- Prefer small, reviewable changes.
- Update tests when behavior changes.
- Update documentation when workflow changes.
- Do not use real secrets.
- Ask for approval before high-risk changes.
- Explain assumptions clearly.
```

---

## Review Checklist

Before accepting coding-agent output:

- Does the code meet the issue requirements?
- Are edge cases handled?
- Are tests present or updated?
- Is documentation updated?
- Are secrets avoided?
- Did the agent make unsupported assumptions?
- Are security-sensitive changes reviewed by a human?

---

## Next Step

Continue to:

[SRE_INCIDENT_RESPONDER_PATTERN.md](SRE_INCIDENT_RESPONDER_PATTERN.md)
