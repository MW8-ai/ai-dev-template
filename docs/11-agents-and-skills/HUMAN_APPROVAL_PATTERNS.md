# Human Approval Patterns

Human approval is the control point that keeps AI-assisted development safe.

Agents can move fast, but they should not silently make high-impact decisions.

---

## Quick Path for Experienced Developers

Require human approval before an agent:

- Merges code
- Deploys to production
- Changes infrastructure
- Modifies authentication or authorization
- Touches secrets
- Deletes data
- Changes billing or vendor settings
- Sends external communications
- Changes compliance-sensitive controls

---

## Full Explanation for New Developers

AI tools can be very helpful, but they can also be confidently wrong.

A human approval step means a person reviews the plan or output before the risky action happens.

This does not slow teams down as much as it seems. It prevents expensive mistakes.

---

## Approval Levels

### Low Risk

Agent can proceed after normal validation.

Examples:

- Drafting documentation
- Creating a checklist
- Suggesting branch names
- Summarizing public release notes

### Medium Risk

Agent can draft, but human should review before commit or pull request.

Examples:

- Updating code
- Refactoring files
- Creating tests
- Editing workflow files

### High Risk

Agent must stop and request explicit approval.

Examples:

- Production deployment
- Secret rotation
- Database migration
- Infrastructure changes
- Security policy changes

---

## Recommended Approval Language

Use clear approval prompts:

```text
This change affects authentication. Approval required before applying.
Approve, reject, or request changes?
```

Avoid vague prompts:

```text
Should I continue?
```

---

## Audit Trail

Every approval should be traceable.

Good places to record approvals:

- Pull request comments
- Issue comments
- Change request tickets
- Deployment logs
- Security review records

---

## Human Approval Checklist

Before approving, confirm:

- The goal is understood
- The change is scoped
- Risks are documented
- Tests or validation exist
- Rollback is possible
- Sensitive data is not exposed

---

## Next Step

Continue to:

[SECURITY_BOUNDARIES.md](SECURITY_BOUNDARIES.md)
