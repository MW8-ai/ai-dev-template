# NIST Overview

NIST (National Institute of Standards and Technology) is a U.S. federal agency that publishes technical standards. Its security frameworks are mandatory for federal agencies and federal contractors, and widely adopted by private companies that want a rigorous, auditable security baseline.

This document covers two frameworks: NIST SP 800-53 (the control catalog) and the NIST CSF (Cybersecurity Framework). If you work with federal data, a federal agency, or any system that requires an ATO (Authority to Operate), both apply to you.

---

## NIST SP 800-53

NIST SP 800-53 is the primary control catalog: a large, structured list of security and privacy controls that federal information systems must implement. The current version is Revision 5.

### Control Families

Controls are grouped into families. Each family has a two-letter identifier:

| ID | Family |
|---|---|
| AC | Access Control |
| AT | Awareness and Training |
| AU | Audit and Accountability |
| CA | Assessment, Authorization, and Monitoring |
| CM | Configuration Management |
| CP | Contingency Planning |
| IA | Identification and Authentication |
| IR | Incident Response |
| MA | Maintenance |
| MP | Media Protection |
| PE | Physical and Environmental Protection |
| PL | Planning |
| PM | Program Management |
| PS | Personnel Security |
| PT | PII Processing and Transparency |
| RA | Risk Assessment |
| SA | System and Services Acquisition |
| SC | System and Communications Protection |
| SI | System and Information Integrity |
| SR | Supply Chain Risk Management |

For most software development work, the families you interact with most often are AC, AU, CM, IA, SC, and SI.

---

## NIST CSF (Cybersecurity Framework)

The NIST CSF provides a risk-management structure organized into five functions. Unlike SP 800-53, which is a control list, the CSF is a strategy framework — it describes what you should be doing at each stage of a security program.

### Identify
Know what you have. Asset inventory, data classification, risk assessment, governance. You cannot protect what you cannot see.

Practical: Maintain an inventory of your systems, services, data stores, and third-party integrations. Know what data each component handles.

### Protect
Put controls in place to prevent incidents. Access control, training, data security, configuration management, maintenance, protective technology.

Practical: Enforce least privilege, encrypt sensitive data, manage secrets properly, patch dependencies, train your team on phishing and social engineering.

### Detect
Know when something is wrong. Continuous monitoring, anomaly detection, audit log review.

Practical: Set up log aggregation, enable alerts for failed logins and config changes, monitor for unusual data access patterns.

### Respond
Have a plan for when something goes wrong. Incident response plan, communication procedures, analysis, mitigation.

Practical: Write and test an incident response runbook before you need it. Know who to call, how to contain an incident, and how to communicate to stakeholders.

### Recover
Get back to normal. Recovery planning, improvements, communication during recovery.

Practical: Test your backups. After any incident, run a blameless postmortem and update your controls based on what you learn.

---

## Impact Levels

NIST categorizes systems by their impact level — the potential harm if the system's confidentiality, integrity, or availability is compromised.

| Level | Definition | Example |
|---|---|---|
| Low | Limited adverse effect. Minor disruption, minor financial loss. | Internal scheduling tool |
| Moderate | Serious adverse effect. Significant disruption, significant financial loss, harm to individuals. | System handling employee PII (Personally Identifiable Information) |
| High | Severe or catastrophic effect. Major harm, loss of life, national security implications. | Emergency response system, financial infrastructure |

Impact level determines which controls you must implement. Low impact systems follow a baseline set of controls. Moderate adds more controls. High adds even more, often with enhanced requirements.

---

## How NIST Affects Software Development

### Access Control (AC)
- Enforce least-privilege access for all accounts, human and machine
- Use RBAC (Role-Based Access Control) and review access quarterly
- Require MFA (Multi-Factor Authentication) for all privileged access

### Audit and Accountability (AU)
- Log authentication events, data access, admin actions, and system changes
- Retain logs per your impact level (see [AUDIT_LOGGING.md](./AUDIT_LOGGING.md))
- Protect logs from modification — write to a separate, append-only system

### Configuration Management (CM)
- Maintain a baseline configuration for each system
- Track all changes — code reviews, change management tickets, deployment logs
- Disable or remove unused services, ports, and accounts

### Identification and Authentication (IA)
- Every user and service must have a unique identifier — no shared accounts
- Enforce strong passwords and MFA
- Use short-lived credentials where possible (OIDC tokens, AWS IAM roles) instead of long-lived API keys

### System and Communications Protection (SC)
- Encrypt data in transit using TLS 1.2 minimum, TLS 1.3 preferred
- Encrypt sensitive data at rest using AES-256
- Segment networks — internal services should not be publicly reachable unless required

---

## Practical First Steps for a Dev Team

1. **Identify what data you handle.** Inventory every data type: what you collect, what you store, what you transmit. Classify each using the levels in [DATA_CLASSIFICATION.md](./DATA_CLASSIFICATION.md).

2. **Determine your impact level.** Use the Low/Moderate/High table above. When in doubt, go one level higher — it is easier to relax controls than to add them after an incident.

3. **Map your controls to 800-53 control families.** You do not need to implement all 1,000+ controls. Start with the families most relevant to software: AC, AU, CM, IA, SC, SI. Use the NIST SP 800-53B baselines to find which controls apply at your impact level.

4. **Document your control implementation.** For each control, write a short statement of how your system meets it. This documentation is called a System Security Plan (SSP). It does not need to be elaborate — one paragraph per control is enough to start.

5. **Get an assessor to validate.** For federal systems, a 3PAO (Third Party Assessment Organization) or agency assessor reviews your SSP and tests your controls. A successful assessment leads to an ATO (Authority to Operate) — the official authorization to run your system in a federal environment.

---

## Related Documents

- [DATA_CLASSIFICATION.md](./DATA_CLASSIFICATION.md) — classify your data before determining impact level
- [AUDIT_LOGGING.md](./AUDIT_LOGGING.md) — logging requirements for the AU control family
- [ACCESS_CONTROL.md](./ACCESS_CONTROL.md) — access control patterns for the AC and IA families
- [ENCRYPTION_AND_SECRETS.md](./ENCRYPTION_AND_SECRETS.md) — encryption standards for the SC family
- [FIPS_OVERVIEW.md](./FIPS_OVERVIEW.md) — cryptographic requirements that apply to federal systems
