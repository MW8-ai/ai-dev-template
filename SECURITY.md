# Security

## Reporting
Do not open public issues for sensitive vulnerabilities. Use the approved private reporting channel for the project or organization.

## Baseline rules
- No secrets in source control.
- Use least-privilege tokens and service accounts.
- Prefer short-lived credentials.
- Log security-relevant events without logging sensitive values.
- Review dependency, auth, crypto, and data handling changes carefully.

## Regulated environments
For government or regulated work, review `docs/04_compliance/government_nist_fips/` before implementation.
