# Runbook Skill Template

Use this skill to help an agent follow an operational runbook safely.

---

## Purpose

Guide an agent through reading, summarizing, and applying a runbook without bypassing human approval.

---

## When to Use

Use this skill when:

- an alert references a known runbook
- an incident needs structured triage
- a support process has documented steps
- a human wants a runbook summary

---

## When Not to Use

Do not use this skill when:

- the runbook requires production changes without approval
- the agent lacks access to required context
- the runbook contains sensitive internal details that should not be shared

---

## Inputs

- runbook path or link
- alert or issue summary
- service name
- environment
- timestamp
- sanitized evidence

---

## Steps

1. Read the runbook.
2. Summarize the purpose.
3. Identify the matching symptoms.
4. List recommended checks.
5. Separate safe checks from approval-required actions.
6. Produce a concise response.

---

## Output Format

```md
## Runbook Summary

## Matching Symptoms

## Safe Checks

## Approval-Required Actions

## Recommended Next Step
```

---

## Safety Rules

- Do not execute destructive actions.
- Do not expose secrets.
- Do not claim certainty without evidence.
- Escalate when production action is required.
