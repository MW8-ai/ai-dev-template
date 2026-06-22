# Incoming Update: GitHub — Safer pull_request_target defaults for GitHub Actions checkout

## Status
Needs human review.

## Source
- Source ID: `github-changelog`
- Vendor: GitHub
- Category: dev-platform
- Priority: high
- URL: https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout
- Source date: Thu, 18 Jun 2026 14:06:55 +0000
- Detected: 2026-06-22T15:01:43Z
- Tracking ID: `a57a8f7b3bbeab54`
- Tags: github, pull-requests, actions, codespaces, copilot, security

## Auto-Detected Summary
The pull_request_target event is one of the most commonly misused triggers in GitHub Actions, leading to vulnerabilities in workflows. Workflows triggered by pull_request_target run with the base repository&#8217;s GITHUB_TOKEN, secrets,&#8230; The post Safer pull_request_target defaults for GitHub Actions checkout appeared first on The GitHub Blog .

## Human Review Questions
1. Is this meaningful for our repo, team, AI workflow, CI/CD, or security posture?
2. Does this change any existing guidance?
3. Should this become an impact note?
4. Should related docs be updated?
5. Should this be archived with no action?

## Suggested Disposition
- [ ] Convert to impact note
- [ ] Update existing docs
- [ ] Add to AI guardrails
- [ ] No action / archive
- [ ] Security review
