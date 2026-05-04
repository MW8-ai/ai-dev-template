# Agents and Skills

This section explains how to design, review, and safely operate AI agents and reusable skills in a modern development workflow.

Agents and skills are powerful, but they should not be treated as magic. They need the same engineering discipline as code: clear purpose, boundaries, version control, testing, human approval, and auditability.

---

## What This Section Covers

- What agents are
- What skills are
- How agents, workflows, and scripts differ
- When human approval is required
- How to design safe coding agents
- How to design incident response agents
- How to set security boundaries
- How to create reusable skill templates

---

## Recommended Reading Order

1. [What Are Agents?](WHAT_ARE_AGENTS.md)
2. [What Are Skills?](WHAT_ARE_SKILLS.md)
3. [Agent vs Workflow vs Script](AGENT_VS_WORKFLOW_VS_SCRIPT.md)
4. [Human Approval Patterns](HUMAN_APPROVAL_PATTERNS.md)
5. [Security Boundaries](SECURITY_BOUNDARIES.md)
6. [Coding Agent Pattern](CODING_AGENT_PATTERN.md)
7. [SRE Incident Responder Pattern](SRE_INCIDENT_RESPONDER_PATTERN.md)
8. [Skill Template](SKILL_TEMPLATE.md)

---

## Beginner Summary

An **agent** is an AI-powered helper that can reason through a goal and take steps toward it.

A **skill** is a reusable package of instructions, examples, and conventions that helps an agent do a specific job better.

A **workflow** is a defined process.

A **script** is code that performs a specific action.

The safest model is:

```text
Human gives goal
Agent proposes plan
Human approves risky steps
Agent creates output
Automation checks output
Human reviews before merge/release
```

---

## Expert Summary

Use agents for tasks that require judgment, context gathering, and iterative decision-making.

Use skills for reusable domain knowledge: runbook conventions, code review standards, incident response playbooks, security review rules, and team-specific style.

Use workflows and scripts for deterministic repeatable automation.

Do not give agents broad, unreviewed authority over production systems, secrets, billing, infrastructure, or protected data.

---

## Next Step

Continue to:

[WHAT_ARE_AGENTS.md](WHAT_ARE_AGENTS.md)
