Read docs/05_prompts/security/SECURITY_REVIEW_PROMPT.md and run a security review on the diff since the last commit.

Get the diff with: `git diff HEAD`

Also read: docs/01_governance/SAFETY_AND_PERMISSIONS.md

Check for:

- Secrets or credentials in code or comments
- SQL injection, command injection, XSS, path traversal
- Insecure deserialization or eval usage
- Missing input validation at system boundaries
- Auth bypass possibilities
- Overly permissive file or network access
- Dependency additions (check if they're well-maintained and not known-vulnerable)
- Hardcoded URLs, IPs, or environment-specific values

Report each finding with: file, line, severity (CRITICAL / HIGH / MEDIUM / LOW), and recommended fix.

If no issues found, say so explicitly. Do not skip the check.
