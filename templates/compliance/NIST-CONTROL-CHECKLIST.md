# NIST SP 800-53 Compliance Checklist — Development Teams

<!-- INSTRUCTIONS:
     This checklist covers the most development-relevant controls from NIST SP 800-53 Rev 5.
     It is not exhaustive — full compliance requires working with your ISSO and security team.
     Use this as a working document: track implementation status, assign owners, and link evidence.

     STATUS KEY:
     [ ] Not Started   [~] In Progress   [x] Implemented   [N/A] Not Applicable

     HOW TO USE:
     1. Walk through each control with your team.
     2. Check the box that reflects current implementation status.
     3. Fill in the Evidence field with links to documentation, screenshots, or audit logs.
     4. Review quarterly or after any significant architecture change. -->

**Project:** [PROJECT_NAME]
**System Classification:** [Low / Moderate / High]
**Last Reviewed:** [YYYY-MM-DD]
**Reviewed By:** [Name / Team]

---

## AC — Access Control

### **AC-2 Account Management**

- **Requirement:** The organization manages user accounts including establishing, activating, modifying, disabling, and removing accounts. Accounts are reviewed at regular intervals.
- **Implementation:** Maintain an authoritative list of user accounts. Use an identity provider (e.g., Okta, Azure AD) where possible. Disable accounts within 24 hours of termination. Review active accounts quarterly.
- **Evidence:** Export of active accounts from IdP; termination checklist records; quarterly access review meeting notes.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:** [Any implementation notes or links to evidence]

---

### **AC-3 Access Enforcement**

- **Requirement:** The system enforces approved authorizations for logical access to information and system resources, based on applicable access control policies.
- **Implementation:** Implement role-based access control (RBAC). Enforce authorization checks on every API endpoint and database query — never on the client side only. Deny by default; allow explicitly.
- **Evidence:** Code review showing authorization middleware on all routes; RBAC role definitions; test cases verifying unauthorized access returns 403.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AC-6 Least Privilege**

- **Requirement:** Users and processes are granted only the minimum permissions necessary to perform their function.
- **Implementation:** Service accounts have only the permissions they need. Database users cannot drop tables. Application roles cannot access admin functions. Reviewed when roles change.
- **Evidence:** IAM policy JSON files showing limited permissions; database role grants (`\du` output); service account permission audit.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AC-7 Unsuccessful Logon Attempts**

- **Requirement:** The system enforces a limit on consecutive invalid login attempts and locks accounts or introduces delays after the limit is exceeded.
- **Implementation:** Lock account or introduce exponential delay after [5] consecutive failed login attempts. Log all failed attempts. Alert security team on unusual patterns.
- **Evidence:** Authentication code showing rate limiting logic; login failure logs; test case demonstrating lockout.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AC-11 Session Lock**

- **Requirement:** The system prevents further access by initiating a session lock after a defined period of inactivity, requiring re-authentication to resume.
- **Implementation:** Sessions expire after [30 minutes] of inactivity. JWT tokens have a short expiry ([1 hour]) with refresh token rotation. Logout invalidates the session server-side.
- **Evidence:** Session configuration code; JWT expiry settings; test showing expired token returns 401.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AC-17 Remote Access**

- **Requirement:** Remote access to the system is authorized, monitored, and controlled.
- **Implementation:** All remote access is over TLS 1.2+. VPN required for administrative access to production infrastructure. Remote sessions are logged.
- **Evidence:** TLS configuration; VPN policy documentation; access logs showing only authorized IPs reach admin endpoints.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AC-22 Publicly Accessible Content**

- **Requirement:** The organization ensures that publicly accessible information does not contain non-public information and is reviewed before posting.
- **Implementation:** Public API endpoints return only data the user is authorized to see. Error messages do not leak internal paths, stack traces, or database details. Public documentation is reviewed before publishing.
- **Evidence:** Error handling code showing sanitized responses; API response review; public docs review process.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AC-2(1) Automated System Account Management**

- **Requirement:** Automated mechanisms are used to support the management of accounts (provisioning, deprovisioning, review).
- **Implementation:** Account provisioning and deprovisioning is automated through the IdP. Offboarding triggers automatic account suspension. Access reviews are scheduled and tracked automatically.
- **Evidence:** IdP automation configuration; offboarding workflow documentation; access review reports.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

## AU — Audit and Accountability

### **AU-2 Event Logging**

- **Requirement:** The organization identifies events that the system must log, sufficient to support after-the-fact investigation of security incidents.
- **Implementation:** Log: authentication events (success and failure), authorization failures, admin actions, data export/bulk operations, configuration changes, and all write operations. Include: timestamp, user ID, action, resource, IP address, result.
- **Evidence:** Logging configuration; sample log entries; list of logged event types.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AU-3 Content of Audit Records**

- **Requirement:** Audit records contain sufficient information to establish: what event occurred, when, where, the source, the outcome, and the identity of the individuals involved.
- **Implementation:** Structured logging (JSON) includes: `timestamp`, `event_type`, `user_id`, `resource_type`, `resource_id`, `action`, `outcome`, `ip_address`, `request_id`.
- **Evidence:** Log schema definition; sample audit log entries; log aggregation configuration.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AU-6 Audit Record Review, Analysis, and Reporting**

- **Requirement:** The organization reviews and analyzes audit records regularly for signs of unusual or inappropriate activity, and reports findings to appropriate personnel.
- **Implementation:** Automated alerts for: multiple failed logins, bulk data export, off-hours admin access, privilege escalation. Security team reviews alerts weekly. Critical alerts are reviewed immediately.
- **Evidence:** Alert configuration (e.g., Datadog monitors, CloudWatch alarms); weekly review records; incident reports generated from log analysis.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AU-9 Protection of Audit Information**

- **Requirement:** The system protects audit information and audit tools from unauthorized access, modification, and deletion.
- **Implementation:** Audit logs are write-once (append-only). Only the logging service can write logs; application cannot modify them. Logs are stored separately from the application database. Retention policy: [90 days hot, 1 year cold].
- **Evidence:** Log storage configuration (S3 Object Lock, CloudWatch log group settings); access controls on log storage; retention policy document.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AU-11 Audit Record Retention**

- **Requirement:** Audit records are retained for a defined period to provide support for after-the-fact investigations.
- **Implementation:** Logs retained for [1 year] minimum. Compliance-sensitive logs (authentication, data access) retained for [3 years]. Automated lifecycle policy moves logs to cold storage after [90 days].
- **Evidence:** Log retention policy document; storage lifecycle configuration; compliance requirement citation.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **AU-12 Audit Record Generation**

- **Requirement:** The system generates audit records for auditable events defined in AU-2 and makes them available to appropriate personnel.
- **Implementation:** All application components write structured logs to a centralized log aggregator (e.g., CloudWatch, Datadog, ELK). Logs are queryable by authorized security personnel. All services use the same log schema.
- **Evidence:** Log aggregation configuration; log query examples; access controls showing who can query logs.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

## CM — Configuration Management

### **CM-2 Baseline Configuration**

- **Requirement:** A current baseline configuration of the system is documented, maintained, and reviewed as part of change control.
- **Implementation:** Infrastructure is defined as code (Terraform, CloudFormation, etc.) and stored in version control. Application configuration is captured in environment variable definitions. Changes go through code review.
- **Evidence:** Infrastructure-as-code repository; environment variable documentation; configuration change history in git log.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **CM-6 Configuration Settings**

- **Requirement:** The organization establishes and documents configuration settings for IT products that reflect the most restrictive settings consistent with operational requirements.
- **Implementation:** Security hardening checklists applied to servers, containers, and services. CIS Benchmarks used as baseline. Production configuration does not enable debug logging, verbose errors, or development tools.
- **Evidence:** Hardening checklist; production vs. development configuration comparison; CIS benchmark scan results.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **CM-7 Least Functionality**

- **Requirement:** The system is configured to provide only essential capabilities, prohibiting or restricting the use of functions, ports, protocols, and services that are not required.
- **Implementation:** Only required ports are open (443, 80). Unused services are disabled. Production containers run as non-root. Unnecessary software is not installed in production images.
- **Evidence:** Security group rules; Dockerfile showing non-root user; port scan results.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **CM-8 System Component Inventory**

- **Requirement:** An inventory of system components is developed, documented, and maintained, reflecting the current state of the system.
- **Implementation:** Infrastructure inventory is generated from Terraform state. Application dependencies are tracked via package.json / requirements.txt. Component inventory is updated on every deployment.
- **Evidence:** Terraform state file; SBOM (software bill of materials); dependency manifest files.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **CM-11 User-Installed Software**

- **Requirement:** The organization governs the installation of software by users, enforcing usage restrictions and monitoring for unapproved installation.
- **Implementation:** Production environments do not allow user-installed software (containers are immutable). Development environments have an approved software list. Dependency additions require PR review and security approval.
- **Evidence:** Container image policy; PR review records for dependency changes; approved software list.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

## IA — Identification and Authentication

### **IA-2 Identification and Authentication (Organizational Users)**

- **Requirement:** The system uniquely identifies and authenticates organizational users.
- **Implementation:** Every user has a unique account — shared accounts are prohibited. Authentication uses [IdP name]. Password-based auth uses bcrypt/Argon2 hashing. OAuth/OIDC used where possible.
- **Evidence:** User account schema showing unique constraint; authentication code; prohibition of shared accounts in policy.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **IA-2(1) Multi-Factor Authentication — Privileged Accounts**

- **Requirement:** Multi-factor authentication is implemented for privileged accounts.
- **Implementation:** MFA required for: all admin accounts, all accounts with database access, all CI/CD service accounts with deploy permissions. MFA is enforced by the IdP — cannot be bypassed.
- **Evidence:** IdP MFA policy configuration; admin account list showing MFA enrolled; test showing login fails without MFA.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **IA-5 Authenticator Management**

- **Requirement:** The organization manages system authenticators including establishing, distributing, storing, revoking, and destroying authenticators.
- **Implementation:** Passwords meet complexity requirements (min 12 chars, mix of character types). Passwords are never stored in plaintext. API keys are rotated every [90 days]. Revoked tokens are invalidated immediately.
- **Evidence:** Password policy configuration; hashing algorithm in code; API key rotation policy and records.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **IA-5(1) Password-Based Authentication**

- **Requirement:** For password-based authentication: enforce minimum password complexity and change requirements, prohibit password reuse, and store passwords using an approved salted key derivation function.
- **Implementation:** Passwords: min 12 characters, at least one number and one special character. Last 5 passwords cannot be reused. Passwords hashed with bcrypt (cost factor 12) or Argon2id.
- **Evidence:** Password validation code; bcrypt/Argon2 configuration; password history implementation.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **IA-8 Identification and Authentication (Non-Organizational Users)**

- **Requirement:** The system uniquely identifies and authenticates non-organizational users (e.g., public users, partner systems).
- **Implementation:** External users authenticate via [OAuth 2.0 / API keys / JWT]. Each external system has a unique API key. External user accounts are subject to the same account management controls as internal users.
- **Evidence:** External authentication implementation; API key issuance and rotation records; external user account management policy.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **IA-11 Re-Authentication**

- **Requirement:** Users are required to re-authenticate when defined circumstances or situations occur (e.g., after inactivity, for sensitive operations).
- **Implementation:** Sessions require re-authentication after [30 minutes] of inactivity. Sensitive operations (password change, account deletion, large data exports) require immediate re-authentication.
- **Evidence:** Session timeout configuration; re-auth flow for sensitive operations; test case showing re-auth prompt.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

## SA — System and Services Acquisition

### **SA-8 Security and Privacy Engineering Principles**

- **Requirement:** Security and privacy engineering principles are applied in the specification, design, development, implementation, and modification of the system.
- **Implementation:** Security review is part of the design phase (threat modeling). Secure coding standards are documented and enforced in code review. Privacy-by-design: collect minimum necessary data.
- **Evidence:** Threat model documents; secure coding standards document; design review records with security sign-off.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SA-10 Developer Configuration Management**

- **Requirement:** The organization requires that developers manage and control changes to the system during development, implementation, and operation.
- **Implementation:** All code changes go through version control (git). Changes require PR approval before merging. Branch protection rules enforce review requirements. Changes are traceable to requirements.
- **Evidence:** GitHub branch protection settings; PR review records; git log showing all changes are reviewed.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SA-11 Developer Testing and Evaluation**

- **Requirement:** The organization requires developers to implement a security assessment plan and conduct testing at various levels of specificity.
- **Implementation:** Security testing is part of the CI pipeline (SAST with [tool], dependency scanning, secret scanning). Penetration testing is conducted [annually / before major releases]. Security findings are tracked to resolution.
- **Evidence:** CI security scan configuration; SAST scan results; penetration test reports; vulnerability tracking records.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SA-15 Development Process, Standards, and Tools**

- **Requirement:** The organization requires developers to follow a documented development process that addresses security requirements and promotes the use of approved tools.
- **Implementation:** SDLC process is documented (AGENTS.md, CONTRIBUTING.md). Approved toolchain is defined (TECH_STACK.md). AI-assisted development is subject to human review policy. Code must pass automated checks before merge.
- **Evidence:** SDLC documentation; approved tool list; CI enforcement of checks; AI code review policy.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

## SC — System and Communications Protection

### **SC-5 Denial of Service Protection**

- **Requirement:** The system protects against or limits the effects of denial-of-service attacks.
- **Implementation:** Rate limiting on all API endpoints. WAF (Web Application Firewall) in front of production. Auto-scaling to absorb traffic spikes. CDN for static content.
- **Evidence:** Rate limiting code/configuration; WAF rules; auto-scaling configuration; load testing results.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SC-8 Transmission Confidentiality and Integrity**

- **Requirement:** The system implements cryptographic mechanisms to prevent unauthorized disclosure or modification of information during transmission.
- **Implementation:** TLS 1.2+ required on all connections. TLS 1.0/1.1 disabled. Weak cipher suites disabled. Certificate pinning for mobile clients (if applicable).
- **Evidence:** TLS configuration; SSL Labs scan showing A+ rating; cipher suite configuration.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SC-12 Cryptographic Key Establishment and Management**

- **Requirement:** The organization establishes and manages cryptographic keys used to protect organizational information.
- **Implementation:** Cryptographic keys are generated by a FIPS-validated source. Keys are stored in a dedicated key management service (AWS KMS, HashiCorp Vault). Key rotation policy: [every 1 year or on suspected compromise].
- **Evidence:** KMS configuration; key rotation policy; key inventory (no actual key material).
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SC-28 Protection of Information at Rest**

- **Requirement:** The system implements cryptographic mechanisms to prevent unauthorized disclosure and modification of information at rest.
- **Implementation:** Database volume encrypted with AES-256. S3 buckets encrypted with SSE-S3 or SSE-KMS. Sensitive fields (PII, tokens) encrypted at the column level. Encryption verified on all storage resources.
- **Evidence:** AWS storage encryption settings; database encryption configuration; column-level encryption code; encryption verification scan results.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SC-39 Process Isolation**

- **Requirement:** The system maintains a separate execution domain for each executing process.
- **Implementation:** Services run in separate containers. Network segmentation isolates service-to-service communication. Each service has its own database credentials. Services cannot access each other's filesystems.
- **Evidence:** Container configuration; network security group rules; separate database credential evidence.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

## SI — System and Information Integrity

### **SI-2 Flaw Remediation**

- **Requirement:** The organization identifies, reports, and corrects system flaws; tests software updates; and installs security-relevant software updates within defined time periods.
- **Implementation:** Automated dependency scanning on every PR. Critical CVEs (CVSS 9.0+) patched within 24 hours. High CVEs patched within 7 days. Patch history is tracked in CHANGELOG.md.
- **Evidence:** Dependency scanning CI configuration; CVE remediation records; patch SLA policy.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SI-3 Malware Protection**

- **Requirement:** The organization implements malware protection mechanisms at appropriate locations.
- **Implementation:** Container images scanned for malware and CVEs in CI (Trivy, Snyk). File uploads scanned with antivirus before storage. Developers use endpoint protection on their workstations.
- **Evidence:** Container scan CI step; file upload scanning code; endpoint protection policy.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SI-4 System Monitoring**

- **Requirement:** The organization monitors the system to detect attacks and indicators of potential attacks, and unusual or unauthorized activities.
- **Implementation:** Application metrics and logs stream to centralized monitoring (Datadog / CloudWatch). Alerts configured for: error rate spikes, unusual traffic, authentication failures, privilege escalation. On-call rotation responds to alerts.
- **Evidence:** Monitoring configuration; alert definitions; on-call schedule; incident records.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SI-10 Information Input Validation**

- **Requirement:** The system checks the validity of information inputs.
- **Implementation:** All API inputs validated against a strict schema before processing. Validation covers: data type, length, format, range, and allowed values. Invalid inputs return 400 with a clear error (not 500). SQL injection prevented by parameterized queries.
- **Evidence:** Input validation code/schema definitions; API error handling tests; SQL injection test results.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

### **SI-12 Information Management and Retention**

- **Requirement:** The organization manages and retains information within the system in accordance with applicable laws, directives, and policies.
- **Implementation:** Data retention policy is documented and enforced. PII is deleted or anonymized after [retention period]. Audit logs retained per AU-11 requirements. Right-to-deletion requests handled within [30 days] (GDPR requirement).
- **Evidence:** Data retention policy document; automated purge jobs; right-to-deletion request handling procedure and records.
- **Status:** [ ] Not Started / [ ] In Progress / [ ] Implemented / [ ] N/A
- **Owner:** [Name]
- **Notes:**

---

## Checklist Summary

| Control Family | Controls Reviewed | Implemented | In Progress | Not Started | N/A |
|---------------|------------------|-------------|-------------|-------------|-----|
| AC (Access Control) | 8 | | | | |
| AU (Audit) | 6 | | | | |
| CM (Config Management) | 5 | | | | |
| IA (Identity and Auth) | 6 | | | | |
| SA (System Acquisition) | 4 | | | | |
| SC (Communications) | 5 | | | | |
| SI (System Integrity) | 5 | | | | |
| **Total** | **39** | | | | |

**Next review date:** [YYYY-MM-DD]
**Compliance contact:** [Name / Email]
