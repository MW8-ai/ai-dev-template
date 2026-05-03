## Enterprise and Team Projects

Standard professional controls. Multiple developers, real users, production systems.

### What "Enterprise" Means Here
- 2+ developers on the team
- Real users or paying customers
- Production environment with uptime expectations
- May handle sensitive but not regulated data
- Not subject to government/NIST/FIPS requirements (see GOVERNMENT.md for that)

### Required Files (Non-Negotiable)
- README.md
- DESIGN.md (architecture and decisions — use template from templates/project/DESIGN.md)
- TESTING.md (how to run tests, test coverage expectations)
- DEPLOYMENT.md (how to deploy to each environment)
- SECURITY.md (security policies and incident response basics)
- CONTRIBUTING.md (how to contribute, code style, PR process)
- CHANGELOG.md
- .env.example
- .gitignore

### Git Workflow
- Branch protection on main: require PR + 1 approval before merge
- No direct commits to main
- Feature branches: feature/, fix/, docs/, chore/ naming
- Delete branches after merge
- Squash merge or merge commit (decide as a team, be consistent)
- Tag releases with SemVer (v1.2.3)

### Code Review Requirements
- Every PR reviewed by at least one other developer
- Author cannot approve their own PR
- Review within 24 hours for normal PRs, 4 hours for hotfixes
- See docs/03-development-workflow/CODE_REVIEW.md

### CI/CD Requirements
- Automated tests on every PR
- Linting on every PR
- Required status checks before merge
- Deployment to staging automatically, production manually or with approval
- Secret scanning (trufflehog or GitHub secret scanning)

### AI Tools for Enterprise
All AI tools are usable. Additional requirements:
- AI-generated code must be reviewed by a human (same review process as hand-written code)
- Do not paste proprietary code or business logic into public AI services without legal approval
- Configure CLAUDE.md or equivalent with deny rules for force push, rm -rf, direct main commits
- Document which AI tools are approved for use in CONTRIBUTING.md

### Environments
- Local development
- Staging/preview (mirrors production)
- Production

### Security Baseline
- No secrets in code — use environment variables and a secrets manager
- Dependency scanning (Dependabot, Snyk, or equivalent)
- Branch protection rules enforced
- Audit log for production deployments
- Incident response plan (who to call when something breaks)
