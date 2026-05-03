# WORKFLOW_TIERS.md

## Tier 0 — Free / Nearly Free

Use for:

- learning
- static prototypes
- personal experiments

Tools:

- GitHub free
- VS Code
- free chat tools
- Cloudflare Pages free tier
- local terminal

Docs:

- README.md
- AGENTS.md
- TESTING.md
- CHANGELOG.md

## Tier 1 — Hobby / Weekend Paid

Use for:

- indie tools
- browser games
- small apps
- small automations

Tools:

- paid chat plan
- Claude Code or Codex CLI as needed
- private GitHub repo
- optional Codespaces
- Cloudflare Pages
- light GitHub Actions

Docs:

- Tier 0 docs
- TECH_STACK.md
- DEPLOYMENT.md
- MODEL_ROUTING.md
- SAFETY_AND_PERMISSIONS.md

## Tier 2 — Serious Builder / Small Team

Use for:

- MVPs
- internal tools
- products with users

Tools:

- GitHub org/private repos
- branch protection
- pull requests
- preview deploys
- staged environments
- CI checks
- model routing

Docs:

- Tier 1 docs
- ENVIRONMENTS.md
- ROLLBACK.md
- RUNBOOK.md
- RISK_REGISTER.md
- ACCESS_REVIEW.md

## Tier 3 — Enterprise

Use for:

- production systems
- sensitive data
- team development
- regulated environments

Tools:

- GitHub Enterprise / Azure DevOps / GitLab Enterprise
- SSO
- required reviews
- audit logs
- secret scanning
- dependency scanning
- environment approvals
- formal change control

Docs:

- Tier 2 docs
- SECURITY.md
- DATA_SAFETY.md
- CHANGE_CONTROL.md
- AUDIT_LOGGING.md
- INCIDENT_RESPONSE.md
- DECISIONS/ADRs

## Tier 4 — Government / NIST / FIPS-Aware

Use for:

- government
- public sector
- CJIS/HIPAA/FERPA/FISMA adjacent systems
- systems requiring FIPS-validated crypto
- controlled production environments

Tools:

- enterprise repo platform
- formal access reviews
- approved cloud environment
- validated crypto modules where required
- documented system boundaries
- audit logging
- change management
- records retention where applicable

Docs:

- Tier 3 docs
- `docs/04_compliance/government_nist_fips/GOV_NIST_FIPS_LEVELS.md`
- `NIST_CONTROL_MAP.md`
- `FIPS_CRYPTO_CHECKLIST.md`
- `AI_RMF_CHECKLIST.md`
- `SSDF_SECURE_DEV.md`

## Rule

Do not use Tier 4 friction for a weekend prototype.

Do not use Tier 0 controls for regulated production data.
