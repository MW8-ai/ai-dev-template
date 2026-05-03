## Summary

<!-- One sentence: what does this PR do and why? -->

## Changes

<!-- Bulleted list of what changed -->

## Tests / Checks Run

- [ ] Unit tests pass locally
- [ ] Linting passes
- [ ] No new warnings introduced

## Docs Updated

- [ ] Relevant documentation updated (or N/A)
- [ ] CHANGELOG.md updated if this is a meaningful change

## Risk Level

- [ ] Low — isolated change, easy to revert
- [ ] Medium — touches shared logic or config
- [ ] High — changes behavior visible to users or callers
- [ ] Government/NIST/FIPS-impacting

## Rollback Plan

<!-- How do we undo this if it causes problems? -->

## AI Assistance Used

- Tool/model:
- Prompt/task:
- Human review completed: Yes / No

---

## Required Checks

This repository enforces the following automated checks on every PR. If your PR is blocked, open the GitHub Actions tab and read the failing step.

| Check | Workflow | What It Validates |
|---|---|---|
| Repo health | `00-repo-health.yml` | Required files exist and are non-empty |
| PR standards | `01-pr-standards.yml` | Branch name format, PR title format |
| Docs quality | `02-docs-quality.yml` | Markdown formatting, link validity |
| Security scan | `03-security-supply-chain.yml` | Secrets, dependency review |
| CodeQL | `04-codeql.yml` | Static code analysis |
| Workflow lint | `05-actions-lint.yml` | GitHub Actions YAML validity |
| Branch naming | `07-branch-naming.yml` | Branch must use `feature/`, `fix/`, `docs/`, `chore/`, `hotfix/`, or `release/` prefix |
| Commit messages | `08-commit-lint.yml` | Commits must follow Conventional Commits format |

If a check fails: read the log, fix the root cause, push again. Do not use `--no-verify` or ask for a bypass without a documented reason.
