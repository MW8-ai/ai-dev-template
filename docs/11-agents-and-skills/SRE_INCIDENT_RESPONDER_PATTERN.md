# SRE Incident Responder Pattern

Site Reliability Engineering (SRE) focuses on keeping systems reliable, observable, and recoverable.

An SRE incident responder agent can help triage incidents, read logs, compare symptoms to runbooks, and draft response artifacts.

It should not silently change production systems.

---

## Quick Path for Experienced Developers

Use an incident responder agent to:

- summarize alerts
- inspect non-sensitive logs
- compare symptoms to runbooks
- suggest likely causes
- draft incident timelines
- propose remediation steps
- open follow-up issues or pull requests

Require human approval before:

- changing production configuration
- restarting services
- disabling alerts
- deploying fixes
- changing firewall or network rules
- deleting or modifying data

---

## Full Explanation for New Developers

During an incident, people are under pressure.

An agent can help organize information quickly, but it should not become the decision-maker.

The best pattern is:

```text
Agent gathers and summarizes
Human decides and approves
Automation records the action
```

---

## Example Incident Flow

```text
Alert received
↓
Agent collects context
↓
Agent checks runbook
↓
Agent summarizes likely issue
↓
Human approves next step
↓
Agent drafts fix or follow-up
↓
Pull request or incident ticket created
↓
Post-incident review completed
```

---

## Useful Inputs

An incident responder agent may use:

- alert name
- timestamp
- service name
- environment
- recent deployments
- runbook links
- sanitized logs
- dashboard snapshots
- known dependencies

---

## Required Output

The agent should produce:

- incident summary
- affected service
- timeline
- suspected cause
- confidence level
- recommended next actions
- risks
- approval required section
- follow-up tasks

---

## Incident Response Output Template

```md
# Incident Summary

## What Happened

## Impact

## Timeline

## Evidence Reviewed

## Suspected Cause

## Recommended Action

## Approval Required

## Follow-up Tasks
```

---

## Safety Notes

Do not give an incident responder agent unrestricted access to:

- production secrets
- customer data
- private keys
- privileged cloud actions
- destructive commands

---

## Next Step

Continue to:

[SKILL_TEMPLATE.md](SKILL_TEMPLATE.md)
