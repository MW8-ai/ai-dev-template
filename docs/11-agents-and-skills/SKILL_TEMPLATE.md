# Skill Template

Use this format when creating a reusable skill for an AI agent.

A skill should be specific enough to guide behavior and safe enough to reuse.

---

## Template

```md
# Skill Name

## Purpose

What this skill helps the agent do.

## When to Use

Use this skill when:

- condition 1
- condition 2

## When Not to Use

Do not use this skill when:

- condition 1
- condition 2

## Inputs

The agent needs:

- input 1
- input 2

## Steps

1. Step one
2. Step two
3. Step three

## Output Format

The agent should return:

- summary
- findings
- recommendations
- risks
- next steps

## Safety Rules

- rule 1
- rule 2
- rule 3

## Human Approval Required For

- high-risk action 1
- high-risk action 2

## Examples

Example request:

```text
Review this pull request for security and maintainability.
```

Example response structure:

```md
## Summary
## Findings
## Risks
## Recommended Changes
## Approval Required
```
```

---

## Practical Skill Checklist

Before adding a skill, confirm:

- It has a narrow purpose
- It states when not to use it
- It includes safety rules
- It defines expected output
- It does not contain real secrets
- It can be reviewed by a human
- It is version controlled

---

## Next Step

Use the copy-ready templates:

- [templates/agents/AGENT_SPEC.md](../../templates/agents/AGENT_SPEC.md)
- [templates/skills/SKILL.md](../../templates/skills/SKILL.md)
