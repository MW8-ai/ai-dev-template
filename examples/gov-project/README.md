# CivicTrack — Public Records Request Tracker

CivicTrack is a government-grade web application for managing public records requests
(FOIA/state open-records requests). It enables citizens to submit requests, tracks agency
processing workflows, and maintains a tamper-evident audit trail for compliance.

This project is operated by [Agency Name] and is subject to federal information security
requirements. All development and operations must comply with the controls listed in this document.

---

## Compliance Posture

| Framework | Level | Status |
|-----------|-------|--------|
| NIST SP 800-53 Rev 5 | Moderate | In progress — see [docs/compliance/](docs/compliance/) |
| FISMA | Moderate | ATO in progress |
| Section 508 | — | Compliant (accessibility) |
| State Open Records Law | — | Applicable |

**System authorization:** This system is operating under an interim Authority to Operate (ATO)
issued by the Agency ISSO on [DATE]. Full ATO target date: [DATE].

**ISSO contact:** [Name, email, phone]

---

## Data Classification

CivicTrack handles the following data categories:

| Data Type | Classification | Regulatory Scope | Notes |
|-----------|---------------|-----------------|-------|
| Requester name and contact info | PII | Privacy Act | Stored encrypted at rest |
| Request content and documents | CUI — Law Enforcement | NIST 800-171 | May contain exempt records |
| Agency staff names and roles | PII | Privacy Act | Internal user directory |
| Audit log entries | Internal | NIST 800-53 AU | 7-year retention required |
| Released public records | Public | — | Published to public portal |

**Data handling:** All CUI must be handled per the agency's CUI policy and NIST SP 800-171.
PII must be handled per the System of Records Notice (SORN) on file with the Privacy Office.

---

## Quick Start (for authorized developers only)

Development access requires:
- [ ] SF-85 or equivalent background investigation on file
- [ ] System access agreement signed
- [ ] PIV/CAC card configured for git signing
- [ ] Development environment approved by the ISSO

```bash
# 1. Clone the repository (requires agency GitHub org membership)
git clone https://github.com/[agency-org]/civictrack.git
cd civictrack

# 2. Set up development environment
cp .env.example .env
# Fill in .env with values from the agency secrets vault (see DEPLOYMENT.md)

# 3. Start local services
docker-compose up -d

# 4. Run database migrations
npm run db:migrate

# 5. Load development seed data (no real PII — synthetic data only)
npm run db:seed:dev

# 6. Start the application
npm run dev
# Application available at https://localhost:3000 (HTTPS required even locally)
```

> Do not use real PII, real requester data, or copies of production records in development.
> All development seed data must be synthetic. See the data handling policy in `docs/data-handling.md`.

---

## Project Documentation

| Document | Description |
|----------|-------------|
| [DESIGN.md](DESIGN.md) | System architecture and design decisions |
| [TESTING.md](TESTING.md) | Test strategy and how to run tests |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Environment setup, deploy steps, rollback |
| [SECURITY.md](SECURITY.md) | Security policy, vulnerability reporting |
| [docs/compliance/NIST-controls.md](docs/compliance/NIST-controls.md) | NIST 800-53 control implementation status |
| [docs/compliance/privacy-impact-assessment.md](docs/compliance/privacy-impact-assessment.md) | Privacy Impact Assessment (PIA) |
| [docs/compliance/system-security-plan.md](docs/compliance/system-security-plan.md) | System Security Plan (SSP) |
| [docs/data-handling.md](docs/data-handling.md) | CUI and PII handling procedures |
| [docs/incident-response.md](docs/incident-response.md) | Incident response plan |
| [CHANGELOG.md](CHANGELOG.md) | Version history |

---

## Architecture Overview

CivicTrack is a 3-tier web application:

```
┌──────────────────────────────────────────────────────────┐
│                  Citizen / Staff Browser                 │
│          (TLS 1.2+ required; HTTPS enforced)             │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│               Web Application (Node.js)                  │
│  • Citizen-facing request portal                         │
│  • Staff workflow management interface                   │
│  • PIV/CAC authentication for staff                     │
│  • CAPTCHA + rate limiting for citizens                  │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                   PostgreSQL Database                    │
│  • All records encrypted at rest (AES-256)               │
│  • Tamper-evident audit log table                        │
│  • Point-in-time recovery, daily backups                 │
│  • Deployed in FedRAMP-authorized environment            │
└──────────────────────────────────────────────────────────┘
```

**Infrastructure:** Deployed on [FedRAMP-authorized cloud provider] in a dedicated government
cloud environment. All data remains within the continental United States.

---

## Key Security Controls

The following controls are implemented. See `docs/compliance/NIST-controls.md` for full details.

- **Authentication:** PIV/CAC required for all agency staff. Citizens use username/password with CAPTCHA.
- **Authorization:** RBAC — roles: citizen, intake-staff, processing-staff, supervisor, admin.
- **Encryption:** TLS 1.2+ in transit; AES-256 at rest; column-level encryption for PII fields.
- **Audit logging:** Every action on a record is logged with user, timestamp, and action type.
  Logs are append-only and retained for 7 years.
- **Incident response:** See `docs/incident-response.md`. Report security issues to [security@agency.gov].

---

## Reporting Security Issues

Security vulnerabilities must be reported to the Agency ISSO immediately:

- **Email:** security@[agency].gov
- **Phone:** [ISSO phone number] (for critical issues)
- **Do not** create a public GitHub issue for any security finding

Response SLA: Critical issues acknowledged within 4 hours; remediated within 24 hours.
