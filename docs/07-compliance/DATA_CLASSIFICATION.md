# Data Classification

Data classification determines how you protect information. Different data types require different controls. Getting this wrong in either direction is costly: under-protecting sensitive data causes breaches; over-protecting public data wastes resources and slows your team down.

Classify your data before you build. Changing controls after the fact is expensive.

---

## Data Classification Levels

### Public

**Definition:** Intentionally released for public consumption. Disclosure causes no harm.

**Examples:**
- Press releases and public announcements
- Public documentation and help articles
- Marketing materials and product brochures
- Open source code in public repositories
- Published APIs and their documentation

**Controls:**
- Standard integrity controls: prevent unauthorized modification (someone defacing your public docs is still an incident)
- No confidentiality requirements — disclosure is the point
- Monitor for tampering (unexpected changes to public content)

---

### Internal / General

**Definition:** Not public, but not subject to regulatory requirements. General business information whose unauthorized disclosure would be inconvenient but not damaging.

**Examples:**
- Meeting notes and internal agendas
- Internal wikis and runbooks
- Non-sensitive source code and configuration files
- General employee communications (team announcements, non-HR emails)
- Vendor lists and non-sensitive contracts

**Controls:**
- Authentication required to access
- Standard access controls (employees only, or specific teams)
- Standard encryption in transit (TLS)
- No special encryption at rest required, but disk encryption is recommended

---

### Sensitive / Confidential

**Definition:** Unauthorized disclosure would cause measurable harm — business impact, reputational damage, or violation of individual privacy.

**Examples:**
- Employee records (salary, performance reviews, HR files)
- Unreleased product plans and roadmaps
- Financial projections and M&A activity
- Customer PII (Personally Identifiable Information — see below)
- Security vulnerabilities before they are patched
- Legal privileged communications
- Authentication credentials and API keys

**Controls:**
- Need-to-know access: only people who need it for their job can access it
- Encrypted at rest (AES-256 minimum) and in transit (TLS 1.2+)
- Audit logging on all access and modifications (see [AUDIT_LOGGING.md](./AUDIT_LOGGING.md))
- Incident response plan that covers this data category
- Access reviews at least quarterly

---

### PII (Personally Identifiable Information)

**Definition:** Data that can identify a specific individual, either directly or in combination with other data.

**Examples:**
- Full name combined with address, phone number, or email address
- Social Security Number (SSN)
- Date of birth
- Government-issued ID numbers (driver's license, passport)
- Biometric data (fingerprints, face recognition data)
- Financial account numbers
- IP address in many contexts (especially in the EU)
- Health or medical information
- Location data that tracks an individual's movements

**Special Regulatory Rules:**

| Regulation | Scope | Key Requirements |
|---|---|---|
| GDPR (General Data Protection Regulation) | Any EU user's data, regardless of where you are based | Lawful basis for processing, data subject rights (access, deletion, portability), 72-hour breach notification, DPA (Data Protection Agreement) with processors |
| CCPA (California Consumer Privacy Act) | California residents' data, companies above certain revenue/data thresholds | Right to know, right to delete, right to opt out of sale, no discrimination for exercising rights |
| HIPAA (Health Insurance Portability and Accountability Act) | Protected Health Information (PHI) in the U.S. | BAA (Business Associate Agreement) with vendors, strict access controls, encryption required, 60-day breach notification |
| COPPA (Children's Online Privacy Protection Act) | Data of children under 13 in the U.S. | Parental consent required before collecting any data |

**Controls (in addition to Sensitive/Confidential controls):**
- **Data minimization:** collect only what you actually need. If you don't need a birth date, don't collect it.
- **Retention limits:** define how long you keep data and delete it when the retention period ends. Automate deletion where possible.
- **Breach notification:** have a documented process. Most regulations require notification within 72 hours (GDPR) or 60 days (HIPAA) of discovering a breach.
- **Consent management:** record when and how users consented to data collection
- **Data subject requests:** have a process to handle requests for access, correction, or deletion of personal data

---

### CUI (Controlled Unclassified Information) — Federal

**Definition:** Government information that requires protection but is not classified. CUI is defined by the CUI Registry maintained by the National Archives.

**Examples:**
- Law enforcement sensitive information
- Privacy Act data (records about U.S. persons held by federal agencies)
- Export controlled technical data (EAR — Export Administration Regulations, ITAR — International Traffic in Arms Regulations)
- Court-sensitive information
- Tax return information
- Critical infrastructure information

**Controls:**
- NIST SP 800-171 compliance is required for all contractors handling CUI — 110 security requirements across 14 families
- Documents must be marked with the appropriate CUI designation
- Access control: limited to authorized users with a need to know
- Encryption: AES-256 at rest and TLS 1.2+ in transit, using FIPS-validated modules
- Incident reporting: report CUI incidents to the federal agency within the timeframe specified in your contract (often 72 hours)
- Disposal: destroy CUI using approved methods (NIST SP 800-88 for media sanitization)

---

### Classified — Federal Only

Not covered in this document or template. Classified information (Confidential, Secret, Top Secret, and Sensitive Compartmented Information) requires separate facility accreditation, personnel clearances, and system authorization that is outside the scope of this template. Do not process classified information in systems built from this template without appropriate accreditation.

---

## Practical Steps

1. **Inventory your data.** List every type of data your system collects, processes, or stores. Include data in databases, file storage, logs, caches, backups, and third-party integrations.

2. **Classify each data type** using the levels above. When a data element could fit two levels, use the higher one.

3. **Apply the highest classification's controls to each component.** If a database holds both Internal and PII data, the entire database gets PII controls.

4. **Document the classification in DESIGN.md.** Add a section: "This system handles the following data classifications: [list]. PII data includes: [list]. Applicable regulations: [list]."

5. **Review classification when the system changes.** Adding a new feature that collects email addresses upgrades your classification. Adding a new integration that receives customer data from a partner does the same. Build classification review into your change management process.

---

## Related Documents

- [NIST_OVERVIEW.md](./NIST_OVERVIEW.md) — impact levels map to classification levels
- [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) — what logging is required for sensitive and PII data
- [ACCESS_CONTROL.md](./ACCESS_CONTROL.md) — need-to-know access controls
- [ENCRYPTION_AND_SECRETS.md](./ENCRYPTION_AND_SECRETS.md) — encryption requirements by classification level
- [FIPS_OVERVIEW.md](./FIPS_OVERVIEW.md) — FIPS-validated crypto for government CUI
