# GITHUB_COPILOT_CODESPACES.md

## Purpose

Guidance for GitHub Copilot, custom instructions, and Codespaces.

## Official Docs To Check

- GitHub Copilot custom instructions
- GitHub Copilot coding agent
- Codespaces organization settings
- GitHub Actions
- branch protection
- secret scanning

## Codespaces Safe Start

```bash
git status
git fetch origin
git pull --ff-only origin main
```

## Branch Workflow

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feature/example-change
```

After work:

```bash
git status
git add .
git commit -m "Describe change"
git push -u origin feature/example-change
```

## Copilot Instruction Locations

Common patterns include:

- root `AGENTS.md`
- repository custom instructions
- `.github/copilot-instructions.md`
- prompt files / reusable instructions where supported

## Enterprise Notes

Repo visibility and Codespaces access depend on org/enterprise policy.

Do not assume private means invisible to org admins.
