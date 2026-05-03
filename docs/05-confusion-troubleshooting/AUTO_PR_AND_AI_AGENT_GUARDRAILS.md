# Automatic Pull Requests and AI Agent Guardrails

## Why This Exists

Automation can create Pull Requests.

That is useful.

Automation should not silently merge risky changes.

## Can GitHub Create Automatic PRs?

Yes, depending on tooling.

Examples:

- Dependabot dependency update PRs
- Renovate dependency update PRs
- GitHub Actions that create PRs
- AI coding agents that push branches and open PRs
- Code generation tools
- Security update automation

## Is an Automatic PR Bad?

No.

An automatic PR is a notification and review object.

The risk is not the PR existing.

The risk is automatically merging it without enough review.

## Recommended Rule

```text
Automation may open PRs.
Automation should not merge to main unless the repo is intentionally configured for low-risk changes.
```

## Safer Automation Pattern

1. Bot creates branch.
2. Bot opens PR.
3. CI runs.
4. Labels are applied.
5. Code owners are requested.
6. Human reviews.
7. Merge happens only after rules pass.

## Dependabot Example

Safe:

```text
Dependabot opens dependency PR → CI passes → human reviews → merge
```

Risky:

```text
Dependabot opens dependency PR → auto-merge without tests
```

## AI Agent Example

Safe:

```text
AI creates branch → opens PR → explains change → CI runs → human review → merge
```

Risky:

```text
AI has write access to main → AI commits directly → no human review
```

## Guardrails for AI Coding Tools

Use these rules:

- No direct push to `main`
- No production credentials in AI-accessible environments
- No secret files in repo
- Branch-only access when possible
- PR-only delivery
- Required CI
- Required human approval
- Require Code Owner review for workflows, infrastructure, auth, security, and data access
- Disable or restrict force push
- Require signed commits if appropriate
- Use least-privilege tokens
- Separate dev, test, and production credentials
- Keep destructive cloud permissions out of coding agents

## Preventing Accidental Auto-Merge

Check:

- Repository auto-merge settings
- Dependabot auto-merge workflows
- GitHub Actions with `gh pr merge`
- Personal access tokens with broad write permissions
- Branch protection bypass permissions
- Rulesets that allow admins to bypass
- Third-party app permissions
- AI tool GitHub integration permissions

## Red Flag Workflow Example

```yaml
- name: Merge PR
  run: gh pr merge --auto --squash
```

This might be acceptable for low-risk dependency patches with strong tests, but should not be used casually.

## Safer Workflow Principle

```text
Let automation prepare.
Let humans approve.
Let branch protection enforce.
```
