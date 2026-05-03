# CODEOWNERS Guide

## What CODEOWNERS Does

`CODEOWNERS` tells GitHub who should review changes to specific files or folders.

## WHY

Some files carry more risk than others.

Examples:
- CI/CD workflows can change deployment behavior.
- Security files can weaken protection.
- Infrastructure files can alter real environments.
- Production source code can impact users.

CODEOWNERS helps route reviews to people who understand the risk.

## Recommended Location

Use one of these supported locations:

```text
.github/CODEOWNERS
CODEOWNERS
docs/CODEOWNERS
```

This pack places it at the repository root for visibility.

## Example

```text
* @your-org/core-team
.github/workflows/ @your-org/devops-team
SECURITY.md @your-org/security-team
```

## Important Notes

- CODEOWNERS must exist on the base branch of the PR.
- Team names must be valid GitHub teams.
- Users or teams must have repository access.
- Branch protection should require code owner review if you want enforcement.

## Golden Rule

> CODEOWNERS routes review. Branch protection enforces review.
