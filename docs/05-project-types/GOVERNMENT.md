## Government and Regulated Projects

Full compliance posture. Government agencies, contractors, or anyone handling regulated data.

### What "Government" Means Here

- Federal or state government agency or contractor
- Subject to NIST (National Institute of Standards and Technology) 800-53 controls
- May require FIPS (Federal Information Processing Standards) 140-2/140-3 validated cryptography
- Handling CUI (Controlled Unclassified Information) or higher
- FedRAMP or FISMA (Federal Information Security Modernization Act) compliance requirements

### Required Docs (All Enterprise docs + these)

All ENTERPRISE.md requirements, plus:

- docs/07-compliance/NIST_OVERVIEW.md (read this first)
- docs/07-compliance/FIPS_OVERVIEW.md (if handling cryptographic operations)
- docs/07-compliance/DATA_CLASSIFICATION.md
- docs/07-compliance/AUDIT_LOGGING.md
- docs/07-compliance/ACCESS_CONTROL.md
- docs/07-compliance/ENCRYPTION_AND_SECRETS.md
- An Authority to Operate (ATO) package (agency-specific, not templated here)

### Git Workflow Additions

- Signed commits (git commit -S with GPG or SSH signing)
- Branch protection: require signed commits, 2 approvals minimum
- Audit trail: every PR must reference an issue or change ticket
- No force pushes (ever)
- Retention policy: commits must be retained per agency policy (often 7+ years)

### AI Tool Restrictions

Government projects have special considerations:

- Verify your agency's AI use policy before using any AI coding tool
- Classified or CUI data must NEVER be sent to external AI APIs
- Some agencies prohibit commercial AI tools on government systems
- If AI tools are approved: configure strict deny rules, log all AI-assisted changes
- Document AI tool usage in the project's System Security Plan (SSP)

### Cryptography Requirements

- Use only FIPS 140-2 or 140-3 validated cryptographic modules
- TLS (Transport Layer Security) 1.2 minimum, prefer 1.3
- AES-256 (Advanced Encryption Standard) for data at rest
- Do not implement custom cryptography
- Key rotation policy required (annually at minimum)
- See docs/07-compliance/FIPS_OVERVIEW.md for full details

### Access Control

- Least privilege: every account has only the permissions needed
- MFA (Multi-Factor Authentication) required for all human accounts
- Service accounts have no console access
- Access reviews quarterly minimum
- See docs/07-compliance/ACCESS_CONTROL.md

### Audit Requirements

- All access to sensitive data logged
- Logs tamper-evident and retained per policy
- Log format: timestamp, user, action, resource, outcome
- See docs/07-compliance/AUDIT_LOGGING.md

### Incident Response

- Documented incident response plan required
- Breach notification timeline defined (often 72 hours)
- Contact: CISA (Cybersecurity and Infrastructure Security Agency) for federal incidents

---

## Next Step

→ [Read the compliance documentation](docs/07-compliance/NIST_OVERVIEW.md)
