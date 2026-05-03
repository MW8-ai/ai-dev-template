# Security Policy — [PROJECT_NAME]

<!-- INSTRUCTION: Fill in all placeholders. This document is public-facing by convention —
     it tells users and researchers how to report security issues responsibly.
     Do not include internal-only details (specific IP ranges, internal tool names, etc.).
     Keep the security contacts up to date; outdated contacts delay critical disclosures. -->

## Security Contacts

<!-- INSTRUCTION: List who receives security disclosures. Prefer a role alias (security@)
     over an individual name so reports are never silently dropped due to staff changes. -->

| Role | Contact | Response SLA |
|------|---------|-------------|
| Security team | security@[your-domain].com | Acknowledge within 48 hours |
| Engineering lead | [lead@your-domain.com] | Escalation within 24 hours |
| Bug bounty program | [HackerOne / Bugcrowd profile URL, if applicable] | Per program terms |

---

## Reporting a Vulnerability

<!-- INSTRUCTION: Make this process as simple as possible. Researchers who find issues
     should not need to jump through hoops. Clearly state that you will not pursue legal action
     against good-faith reporters (if that is your policy). -->

If you discover a security vulnerability in [PROJECT_NAME], please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email **security@[your-domain].com** with:
   - A description of the vulnerability
   - Steps to reproduce (include proof-of-concept if possible)
   - The potential impact you believe this has
   - Your preferred contact method for follow-up
3. We will acknowledge your report within **48 hours**.
4. We will provide an initial assessment within **5 business days**.
5. We will notify you when the fix is released.

We follow responsible disclosure and will credit reporters in our release notes
(unless you prefer anonymity).

We do not pursue legal action against researchers acting in good faith.

---

## Supported Versions

<!-- INSTRUCTION: List which versions still receive security patches.
     Users on unsupported versions should be told to upgrade, not to expect patches. -->

| Version | Supported | End of Support |
|---------|-----------|---------------|
| [2.x]   | Yes       | [Date or TBD] |
| [1.x]   | No        | [Date]        |
| [< 1.0] | No        | End of life   |

We support the current major version and one prior major version with security patches.

---

## Data Classification

<!-- INSTRUCTION: Describe what categories of data this system handles.
     This determines which regulations apply and what controls are required.
     Be specific — "user data" is too vague. List actual data types. -->

This system handles the following data:

| Data Type | Classification | Examples | Regulatory Scope |
|-----------|---------------|----------|-----------------|
| [User account info] | Sensitive | Email, name, password hash | GDPR, CCPA |
| [Financial data] | Highly Sensitive | Payment info, billing history | PCI DSS |
| [Health data] | Highly Sensitive | Medical records | HIPAA |
| [Public content] | Public | Published posts, public profiles | None |
| [Application logs] | Internal | Request logs, error traces | Internal policy |

> Remove rows that do not apply. Add rows for any data type this system handles.

---

## Security Controls

<!-- INSTRUCTION: Check off controls that are implemented. This section gives developers
     and auditors a quick view of the security posture. Update whenever a control is added or removed. -->

### Authentication and Authorization

- [ ] Passwords are hashed with bcrypt / Argon2 (not MD5 or SHA-1)
- [ ] Multi-factor authentication (MFA) is available
- [ ] Sessions expire after [N] minutes of inactivity
- [ ] JWT tokens have short expiry ([1 hour]) with refresh token rotation
- [ ] Role-based access control (RBAC) is enforced on all endpoints
- [ ] Privilege escalation is logged and alerted

### Input Validation and Output Encoding

- [ ] All user inputs are validated against a strict schema
- [ ] SQL queries use parameterized queries / ORM (no string concatenation)
- [ ] Output is HTML-encoded to prevent XSS
- [ ] File uploads are restricted by type, size, and scanned for malware

### Transport Security

- [ ] TLS 1.2+ is required on all connections
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header is set with a long max-age
- [ ] Certificates are monitored for expiry

### Data Protection

- [ ] Data at rest is encrypted (AES-256)
- [ ] Sensitive fields (e.g., SSNs, payment data) are encrypted at the column level
- [ ] Backups are encrypted
- [ ] PII is not written to logs

### Infrastructure

- [ ] Production secrets are stored in a secrets manager (not in code or `.env` files)
- [ ] Principle of least privilege applied to all service accounts
- [ ] Security groups / firewall rules restrict traffic to required ports only
- [ ] Container images are scanned for CVEs before deployment

### Monitoring and Response

- [ ] Failed authentication attempts are logged and rate-limited
- [ ] Anomalous activity triggers alerts (e.g., mass data export, unusual login location)
- [ ] All admin actions are audit-logged
- [ ] SIEM or centralized log aggregation is configured

---

## Dependency Management

<!-- INSTRUCTION: Describe how you keep dependencies up to date and how you handle CVEs.
     Automated tools (Dependabot, Snyk, npm audit) should run on every PR. -->

- Dependencies are audited on every CI run: `[npm audit | pip-audit | bundle audit]`
- Automated dependency update PRs are created by [Dependabot / Renovate]
- Critical CVEs (CVSS 9.0+) must be patched within **24 hours** of disclosure
- High CVEs (CVSS 7.0–8.9) must be patched within **7 days**
- Medium/Low CVEs are addressed in the next regular sprint

To manually check for vulnerabilities:

```bash
[npm audit | pip-audit | bundle audit]
```

---

## Incident Response

<!-- INSTRUCTION: These steps apply if a security breach is confirmed.
     Keep this section short and actionable — a panicked engineer needs clear steps, not prose.
     Link to a full runbook if you have one. -->

If a security breach is suspected or confirmed:

1. **Contain immediately** — revoke affected credentials, block the attack vector if known
2. **Alert the team** — notify security@[your-domain].com and the engineering lead immediately
3. **Do not delete evidence** — preserve logs, memory dumps, and disk snapshots
4. **Open an incident** in [PagerDuty / Slack #security-incidents]
5. **Assess impact** — identify what data was accessed or exfiltrated
6. **Notify affected users** — legal requirement in most jurisdictions within [72 hours / your SLA]
7. **Post-mortem** — write a blameless incident report within 5 business days

Full incident response runbook: [LINK TO INTERNAL RUNBOOK]

> For breaches involving PII under GDPR, you must notify your DPA within 72 hours.
> Contact Legal immediately if personal data may have been exposed.
