# GOV_NIST_FIPS_LEVELS.md

## Purpose

A practical government/NIST/FIPS-aware tier for AI-assisted development.

This is not a certification. It is a planning checklist for projects that may need public-sector controls.

## Core References

- NIST AI Risk Management Framework (AI RMF)
- NIST SP 800-53 Rev. 5 security and privacy controls
- NIST SP 800-218 Secure Software Development Framework (SSDF)
- FIPS 140-3 cryptographic module requirements
- NIST Cryptographic Module Validation Program (CMVP)

## Level G0 — Public Prototype

Use for:

- public demo
- no sensitive data
- no auth
- no production integration

Controls:

- no secrets in repo
- dependency hygiene
- clear README
- no claims of compliance

## Level G1 — Internal Low-Risk Tool

Use for:

- internal helper tools
- no regulated data
- limited users

Controls:

- private repo
- branch protection
- basic logging
- access control
- documented data classification
- no production secrets in dev

## Level G2 — Sensitive Internal Tool

Use for:

- internal production workflows
- sensitive operational data
- agency/business process support

Controls:

- SSO
- role-based access
- audit logging
- environment separation
- required PR reviews
- change control
- rollback process
- documented system boundary
- AI agent access limited to dev/stage

## Level G3 — Regulated / Government Production

Use for:

- regulated data
- government production
- FIPS expectations
- formal audit posture

Controls:

- NIST 800-53 mapping
- SSDF practices
- formal change management
- access reviews
- incident response
- logging/monitoring
- validated crypto modules where required
- vendor review
- data retention policy
- backup and restore testing
- human approval for production deployments
- no AI agent unrestricted production access

## Level G4 — High Assurance / Mission Critical

Use for:

- critical systems
- law enforcement/public safety
- high confidentiality/integrity needs
- strict audit requirements

Controls:

- full security plan
- independent review
- formal authorization process
- strict least privilege
- privileged access management
- hardened CI/CD
- signed artifacts where required
- tested disaster recovery
- continuous monitoring
- documented compensating controls

## Important FIPS Note

A product is not FIPS-compliant merely because it uses approved algorithms.

For FIPS 140-3 expectations, verify the exact cryptographic module and version against the NIST CMVP validated module list.
