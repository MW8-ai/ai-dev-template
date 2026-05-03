# Access Control

Access control determines who can do what to which resources. Getting it right is foundational: most breaches involve an account with more access than it should have had.

---

## Core Principles

### Least Privilege

Every account — human or service — should have only the permissions needed to do its job. Nothing more.

**Wrong:** "Give everyone admin because it's easier to not deal with permissions."
**Wrong:** "The developer needs to debug production, so they get production DB access forever."
**Right:** Developer gets read/write access to code repositories and no direct production database access. When debugging requires DB access, it is granted temporarily, logged, and revoked after the incident.

Least privilege is not about making life harder. It is about limiting the blast radius when credentials are compromised. An attacker who steals a read-only token can read data. An attacker who steals an admin token can delete everything.

### Zero Trust

Zero Trust means: do not assume that a request is trustworthy because it came from inside your network.

Traditional security assumed a hard perimeter: inside = trusted, outside = untrusted. Cloud-native systems have no perimeter. A service on your internal network might be compromised. A VPN-connected machine might be infected.

Zero Trust requires: **Verify always, assume breach, limit blast radius.**

- Every request must be authenticated — no implicit trust for being on the same network
- Every request must be authorized for the specific resource being accessed
- Minimize the impact if one component is compromised

### Separation of Duties

No single person should have unilateral end-to-end control over critical operations.

**Example:** The developer who writes the code should not be the only one who approves the PR, merges it, and deploys it to production. At minimum, require a second person to approve PRs and a separate deployment process with its own audit trail.

**Why:** Separation of duties prevents both accidental mistakes (a second person catches the error) and intentional abuse (one person cannot complete a malicious action without involving another person who would notice).

---

## Access Control Models

### RBAC (Role-Based Access Control)

Users are assigned roles. Roles have permissions. This is the most common model and is easy to audit.

```
Role: Developer
  Permissions:
    → read: all code repositories
    → write: feature branches (not main, not release branches)
    → read: staging environment logs
    → no access: production database
    → no access: secrets manager
    → no access: admin panel

Role: Operations
  Permissions:
    → read: logs, metrics, dashboards, deployment configs
    → execute: deployments to staging and production
    → read: production database (read-only, for debugging)
    → no access: source code commits (they deploy, they don't write code)
    → no access: user data outside of operational need

Role: Security
  Permissions:
    → read: all logs, including audit logs
    → read: all systems (for assessment and monitoring)
    → no write access unless remediating an incident (time-limited, logged)

Role: Admin
  Permissions:
    → all of the above + user management, role assignments
    → requires a separate admin account (not their day-to-day developer account)
    → requires MFA (Multi-Factor Authentication) on every session
    → all actions logged at the AUDIT level
```

When to use RBAC: most systems. It is simple, auditable, and scales well.

### ABAC (Attribute-Based Access Control)

ABAC grants access based on attributes of the user, the resource, and the environment. It is more granular than RBAC and better suited to complex authorization logic.

**Example ABAC rules:**
- A user with attribute `department=legal` can access documents with attribute `classification=legal-privileged`
- A user with attribute `clearance=secret` can access resources with attribute `required_clearance=secret` but not `required_clearance=top-secret`
- Access to `environment=production` is only allowed from IP ranges in `approved-corporate-ranges` during `business-hours`

When to use ABAC: when RBAC roles become unwieldy due to fine-grained access requirements, when access depends on context (time, location, device posture), or when handling regulated data where access rules are defined by policy documents.

---

## GitHub Access Levels

GitHub's built-in access levels map well to RBAC:

| Level | What They Can Do | Use For |
|---|---|---|
| Read | View code, issues, PRs, wiki | External contributors, stakeholders, auditors |
| Triage | Manage issues and PRs without writing code | PMs, QA leads, non-technical stakeholders |
| Write | Push to branches, create PRs, manage issues and labels | Developers, technical writers |
| Maintain | Manage repo settings (branch protection, webhooks), cannot delete | Senior developers, tech leads |
| Admin | Full control: settings, collaborators, can delete repo | Repo owners, platform admins |

**Guidelines:**
- Reviewers who only review code get **Write** (required to approve PRs on most GitHub configurations)
- External contributors (open source): start them with **Triage** until trust is established
- Non-technical stakeholders: **Read** or **Triage**
- Never give **Admin** to service accounts

---

## Service Accounts

A service account is a machine identity — credentials used by a service or automation, not a human.

**Rules for service accounts:**
1. **One account per service.** Never share credentials between services. If one service is compromised, its credentials can be revoked without affecting others.
2. **No interactive login.** Service accounts should not be able to log in to a console or SSH to a server. Machine use only.
3. **Minimum permissions.** Apply least privilege strictly. A service that reads data gets a read-only credential. A service that writes to one table gets write access to that table, not the whole database.
4. **Rotate credentials on a schedule.** Quarterly for standard service accounts. Monthly for accounts with privileged access. Immediately if there is any suspicion of compromise.
5. **Revoke immediately on decommission.** When a service is retired, its credentials must be revoked within 24 hours. Orphaned service account credentials are a common attack vector.

---

## Access Reviews

Access reviews are periodic audits of who has access to what. They are required for most compliance frameworks and are good practice regardless.

**Cadence:**
- Standard access: quarterly
- Privileged access (admin, production): monthly
- After organizational changes (team restructuring, layoffs, role changes): immediately

**What to review:**
- List of users with access to each system and their permission level
- Service accounts and their current usage (revoke if unused)
- Third-party integrations with OAuth grants
- SSH keys and their last-used date
- API keys and when they were last rotated

**What to do:**
- Remove access for anyone who changed roles or left the team
- Downgrade overly permissive access
- Revoke unused service accounts and API keys
- Document the review: who reviewed it, when, what was changed — compliance requires evidence of reviews

---

## MFA (Multi-Factor Authentication) Requirements

MFA requires a second factor beyond a password — typically a TOTP (Time-Based One-Time Password) app, a hardware key (YubiKey), or a push notification.

| Risk Level | MFA Requirement |
|---|---|
| Hobby / Personal | Recommended for admin accounts |
| Small business | Required for admin and privileged accounts; recommended for all |
| Enterprise | Required for all human accounts; enforce via SSO (Single Sign-On) provider |
| Government (NIST Moderate) | Required for all human accounts |
| Government (NIST High) | Phishing-resistant MFA required — FIDO2/WebAuthn hardware keys (YubiKey, Passkey) |

**Phishing-resistant MFA:** Standard TOTP codes can be phished (a fake login page captures both the password and the OTP code before relaying them). FIDO2/WebAuthn keys are bound to the specific domain, so they cannot be used on fake sites. For high-security environments, phishing-resistant MFA is the only acceptable option.

---

## Implementation Checklist

- [ ] Every user and service has a unique identity — no shared accounts
- [ ] RBAC roles defined and documented
- [ ] Least privilege applied to all roles (verify by listing what each role cannot do)
- [ ] MFA enabled per the requirements for your risk level
- [ ] Service accounts: one per service, credentials rotated, no interactive login
- [ ] Access review process documented and scheduled
- [ ] Admin access requires a separate admin account, not a dual-purpose developer account
- [ ] Separation of duties enforced for code changes and deployments

---

## Related Documents

- [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) — all access decisions should be logged
- [DATA_CLASSIFICATION.md](./DATA_CLASSIFICATION.md) — access controls scale with data sensitivity
- [NIST_OVERVIEW.md](./NIST_OVERVIEW.md) — AC and IA control families
- [ENCRYPTION_AND_SECRETS.md](./ENCRYPTION_AND_SECRETS.md) — credentials and secrets management
