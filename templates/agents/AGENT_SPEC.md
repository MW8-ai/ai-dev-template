# Agent Specification Template

Use this template to define an AI agent before allowing it to operate in a repository or workflow.

---

## Agent Name

`example-agent-name`

---

## Purpose

Describe what this agent is responsible for.

Example:

```text
This agent reviews pull requests for documentation, tests, security risks, and repository standards.
```

---

## Allowed Tasks

The agent may:

- read repository files
- summarize issues
- draft documentation
- propose code changes
- create pull request summaries
- suggest tests

---

## Disallowed Tasks

The agent may not:

- merge pull requests
- deploy to production
- access real secrets
- delete data
- modify billing
- disable security controls

---

## Required Inputs

- task description
- relevant files or links
- acceptance criteria
- standards to apply

---

## Expected Outputs

- summary
- proposed changes
- risks
- validation steps
- human approval items

---

## Tools Allowed

- repository read
- branch creation
- file edit
- test execution in sandbox
- pull request creation

---

## Human Approval Required For

- production changes
- security-sensitive changes
- authentication or authorization changes
- infrastructure changes
- dependency upgrades with security impact

---

## Audit Requirements

Record important actions in:

- issue comments
- pull request comments
- commit messages
- change records where applicable

---

## Version

`v0.1`
