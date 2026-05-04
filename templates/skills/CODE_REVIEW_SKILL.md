# Code Review Skill Template

Use this skill to help an agent review code changes consistently.

---

## Purpose

Guide an agent through a structured code review focused on correctness, maintainability, testing, documentation, and security.

---

## When to Use

Use this skill when:

- reviewing a pull request
- reviewing AI-generated code
- checking a refactor
- validating a bug fix

---

## When Not to Use

Do not use this skill as the only approval for:

- security-sensitive changes
- authentication changes
- production infrastructure changes
- compliance-sensitive systems

---

## Inputs

- pull request description
- changed files
- relevant issue or acceptance criteria
- project standards
- test results

---

## Review Checklist

Check for:

- clear purpose
- small, reviewable scope
- tests added or updated
- error handling
- logging where appropriate
- no secrets committed
- documentation updates
- no unnecessary complexity
- security-sensitive changes flagged

---

## Output Format

```md
## Summary

## Strengths

## Concerns

## Required Changes

## Suggested Improvements

## Approval Recommendation
```

---

## Safety Rules

- Do not approve your own changes.
- Do not ignore failing tests.
- Flag assumptions.
- Require human approval for high-risk changes.
