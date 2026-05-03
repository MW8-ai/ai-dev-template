# Deployment

## Environments
| Environment | Purpose | Data sensitivity | Approval required |
|---|---|---|---|
| local | development | fake/sample | no |
| dev | shared testing | fake/sample | light |
| staging | release validation | sanitized | yes |
| production | live use | real | yes |

## Release checklist
- CHANGELOG updated.
- Rollback plan documented.
- Secrets are stored in approved secret storage, not source control.
- Migrations are reversible or backed up.
- Monitoring/logging is active.
- Security/compliance notes reviewed for regulated environments.

## Rollback plan
Describe how to revert code, config, data migrations, and external integrations.
