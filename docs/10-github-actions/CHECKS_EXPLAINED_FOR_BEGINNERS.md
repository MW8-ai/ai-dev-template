# Checks Explained for Beginners

This guide explains the automated checks in plain English.

## Pull Request

A Pull Request, often called a PR, is a request to merge your changes into another branch. It gives other people and automated tools a chance to review your work before it becomes part of the main project.

## Status Check

A status check is an automated pass or fail result. Examples include tests, security scans, documentation checks, and link checks.

## Why checks matter

Checks protect the team from avoidable mistakes:

- Broken documentation.
- Deleted required files.
- Secrets accidentally committed to GitHub.
- Vulnerable dependencies.
- Poorly described Pull Requests.
- Broken GitHub Actions workflows.

## What to do when a check fails

1. Open the failed check.
2. Read the error message.
3. Fix the specific issue.
4. Commit and push the fix.
5. Wait for the check to run again.

Do not ignore failing checks unless a maintainer confirms the check itself is wrong.

## Common examples

### Missing required file

The repo health check may say `Missing START_HERE.md`. Add the file back or restore it from the template.

### Bad branch name

The PR standards check may reject a branch like `mychanges`. Rename it to something clear, like `feature/add-start-here-guide`.

### Broken link

The documentation check may report a link to a file that does not exist. Fix the path or remove the link.

### Secret detected

The security check may detect a token or password. Remove the secret, rotate it, and avoid committing secrets again.

## Next Step

Read `docs/03-development-workflow/ISSUE_TO_BRANCH_TO_PR.md` to understand how checks fit into the daily workflow.
