# Security Review Prompt

Use this prompt for a focused security review of new code, a changed component, or a full subsystem. This goes deeper than the general code review in [REVIEW_CODE.md](./REVIEW_CODE.md) — it focuses specifically on vulnerabilities, not correctness or style.

Run this before shipping any feature that touches authentication, authorization, user input, external services, payments, or sensitive data.

---

## How to Customize

Before sending, specify:

- `[DIFF OR FILES]` — the code to review. For a full component, list the files. For a PR, paste the diff.
- `[CONTEXT]` — what the component does, what data it handles, what trust boundaries it crosses
- `[DATA CLASSIFICATIONS]` — what data classifications are in scope (Public, Internal, Sensitive, PII, CUI — see [DATA_CLASSIFICATION.md](../07-compliance/DATA_CLASSIFICATION.md))
- `[THREAT ACTORS]` — who might attack this? External internet users? Authenticated users trying to escalate? Internal employees? Automated bots?

---

## The Prompt

```text
You are a security engineer reviewing code for vulnerabilities. You are looking
for real, exploitable issues — not theoretical risks. You know the OWASP Top 10
and common vulnerability patterns.

Context: [CONTEXT]
Data in scope: [DATA CLASSIFICATIONS]
Threat actors: [THREAT ACTORS]

Reference these docs for standards:
- docs/06-standards/SECURITY.md (if it exists)
- docs/07-compliance/ENCRYPTION_AND_SECRETS.md
- docs/07-compliance/ACCESS_CONTROL.md
- docs/07-compliance/DATA_CLASSIFICATION.md

Review the following code:
[DIFF OR FILES]

Check each of the following:

1. Injection risks
   - SQL injection: are all database queries parameterized? No string interpolation
     in SQL.
   - Command injection: are shell commands constructed from user input?
   - XSS (Cross-Site Scripting): is user input escaped before rendering in HTML?
   - SSRF (Server-Side Request Forgery): can user input cause the server to make
     HTTP requests to internal services?
   - Template injection: is user input passed into template engines?

2. Authentication and authorization
   - Are all endpoints that should require authentication protected?
   - Are authorization checks performed server-side for every request?
   - Is there any possibility of IDOR (Insecure Direct Object Reference) —
     accessing another user's data by changing an ID in the request?
   - Are session tokens and JWTs (JSON Web Tokens) validated correctly (signature,
     expiry, audience)?
   - Is there protection against CSRF (Cross-Site Request Forgery) on
     state-changing endpoints?

3. Secrets and credentials
   - Are there any hardcoded API keys, passwords, or tokens?
   - Are secrets accessed from environment variables or a secrets manager?
   - Are secrets included in log output?
   - Are secrets included in error messages returned to the client?

4. Dependency and supply chain risks
   - Are any new dependencies introduced? Check their:
     - Maintenance status (last commit, open issues)
     - Known CVEs (Common Vulnerabilities and Exposures) — run `npm audit`,
       `pip-audit`, `go vuln`, or `trivy` as appropriate
     - Source: is it a well-known, widely-used package or an obscure one?

5. Cryptography
   - Is encryption used where the data classification requires it?
   - Are approved algorithms used? (AES-256, SHA-256+, TLS 1.2+)
   - No MD5, SHA-1, DES, RC4, or custom/home-grown crypto
   - Are keys and secrets stored appropriately, not in code?

6. Input validation
   - Is all input from external sources (HTTP requests, files, environment
     variables, third-party API responses) validated before use?
   - Are file uploads restricted by type and size?
   - Are there any path traversal risks (user-controlled file paths)?

7. Error handling and information disclosure
   - Do error responses reveal stack traces, internal paths, database schema,
     or other internal information?
   - Are errors logged server-side and a generic message returned to the client?
   - Do debug modes or verbose logging get disabled in production?

8. Data handling
   - Is sensitive data minimized — collected only when needed?
   - Is PII logged where it should not be?
   - Is sensitive data returned in API responses where it is not needed?
   - Are there retention or deletion controls for sensitive data?

---

Output format:

For each finding:
  Severity: CRITICAL | HIGH | MEDIUM | LOW
  Category: [from the list above]
  File: path/to/file.py (line N, or line range N–M)
  Vulnerability: Name of the vulnerability class
  Issue: What the specific problem is and why it is exploitable
  Impact: What an attacker could achieve if they exploited this
  Remediation: Specific steps to fix it

Severity guide:
  CRITICAL — exploitable now, leads to data breach, account takeover, or
             remote code execution. Do not ship.
  HIGH — likely exploitable, significant impact. Do not ship without fixing.
  MEDIUM — exploitable under specific conditions, moderate impact. Fix before
           the next release.
  LOW — defense-in-depth improvement, low probability or low impact. Note it.

Final verdict:
  PASS   — no CRITICAL or HIGH findings
  BLOCK  — one or more CRITICAL or HIGH findings — do not merge until resolved
```

---

## After the Security Review

For BLOCK findings: create a separate issue for each finding. Do not merge. Fix findings in a targeted PR.

For MEDIUM and LOW findings: create issues to track them. Prioritize in the next sprint.

Document completed security reviews. If your team requires sign-off, have a human security reviewer validate the findings before merging into main.

For regulated systems (FedRAMP, HIPAA, SOC 2): keep the review output as an artifact. Auditors may ask for evidence of security reviews.

See also:

- [REVIEW_CODE.md](./REVIEW_CODE.md) — general code quality review
- [docs/07-compliance/ACCESS_CONTROL.md](../07-compliance/ACCESS_CONTROL.md) — access control standards
- [docs/07-compliance/ENCRYPTION_AND_SECRETS.md](../07-compliance/ENCRYPTION_AND_SECRETS.md) — encryption standards
