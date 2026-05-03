## Security Standards

### The Baseline
These rules apply to all projects regardless of type. More advanced requirements are in docs/07-compliance/.

### Secrets Management
**Never commit secrets to git.** Not even temporarily. If you do: rotate the secret immediately, then remove it from history.

- Use environment variables for all credentials
- Use .env files locally, gitignored
- Document required variables in .env.example (values as examples, never real)
- In production: use your platform's secret management (GitHub Secrets, AWS Secrets Manager, Vault, etc.)

### Dependencies
- Review new dependencies before adding them
- Keep dependencies updated (Dependabot or equivalent)
- Check for known vulnerabilities: `npm audit`, `pip-audit`, `trivy`
- Pin exact versions in production builds

### Input Validation
- Validate all user-supplied input at the boundary (HTTP request, CLI argument, file upload)
- Sanitize before use in SQL, shell commands, HTML output, file paths
- Never use user input directly in SQL (use parameterized queries)
- Never use user input directly in shell commands (use subprocess with arg lists, not strings)

### Authentication and Authorization (AuthN/AuthZ)
- Use an established auth library — don't write your own
- Hash passwords with bcrypt, argon2, or scrypt — not MD5 or SHA1
- Short session tokens, expire them, invalidate on logout
- Check authorization on every request — don't trust client-side state
- Rate limit login attempts

### HTTPS (Hypertext Transfer Protocol Secure)
- All production traffic over HTTPS — no exceptions
- Redirect HTTP → HTTPS
- Use HSTS (HTTP Strict Transport Security) headers

### Incident Response Basics
- Know how to rotate compromised credentials
- Know who to notify (internal: team lead; external: follow your platform's breach notification process)
- Have logs that let you answer: what happened, when, to what data, by whom
