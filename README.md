# AI Dev Template

![PR Checks](https://github.com/MW8-ai/ai-dev-template/actions/workflows/pr-checks.yml/badge.svg)
![Branch Name Check](https://github.com/MW8-ai/ai-dev-template/actions/workflows/07-branch-naming.yml/badge.svg)
![Markdown Lint](https://github.com/MW8-ai/ai-dev-template/actions/workflows/markdown-lint.yml/badge.svg)
![Link Check](https://github.com/MW8-ai/ai-dev-template/actions/workflows/link-check.yml/badge.svg)
![CodeQL](https://github.com/MW8-ai/ai-dev-template/actions/workflows/04-codeql.yml/badge.svg)
![License](https://img.shields.io/github/license/MW8-ai/ai-dev-template)
![Last Commit](https://img.shields.io/github/last-commit/MW8-ai/ai-dev-template)

A modern developer playbook for GitHub, AI-assisted development, and production-ready workflows.

---

## Visual Guide

See all workflows as diagrams: **[docs/00-start-here/VISUAL_GUIDE.md](docs/00-start-here/VISUAL_GUIDE.md)**

---

## New Users — Start Here

→ **[START_HERE.md](START_HERE.md)**

Follow the numbered steps. By the end you will be working like a professional developer.

---

## Experienced Developers

Skip the basics:

| Goal | Go To |
|---|---|
| Daily workflow + PR process | [docs/03-development-workflow/](docs/03-development-workflow/) |
| AI tool integration | [docs/04-ai-workflows/](docs/04-ai-workflows/) |
| Team standards and enforcement | [docs/06-standards/](docs/06-standards/) |
| GitHub Actions enforcement pack | [docs/10-github-actions/GITHUB_ACTIONS_ENFORCEMENT_PACK.md](docs/10-github-actions/GITHUB_ACTIONS_ENFORCEMENT_PACK.md) |
| Compliance (NIST/FIPS) | [docs/07-compliance/](docs/07-compliance/) |

---

## Use This in a Project

Copy templates into your repository:

```text
templates/project/    ← core project docs (DESIGN, TESTING, DEPLOYMENT, SECURITY)
templates/workflows/  ← GitHub Actions starters
templates/prompts/    ← AI prompt templates
```

See a complete working example: [examples/enterprise-project/](examples/enterprise-project/)

---

## What This Repo Teaches

- GitHub from beginner to professional workflows
- Branch → Commit → Push → Pull Request → Merge — with real examples
- Development environment setup (Windows, Mac, VS Code, Codespaces)
- AI-assisted development with human-in-the-loop guardrails
- CI/CD enforcement via GitHub Actions
- Enterprise and government-ready practices (NIST/FIPS)

## What Makes This Different

Most repos give you code. This gives you:

- **Structured workflows** — the professional development cycle documented end to end
- **Reusable templates** — copy-paste starting points that work immediately
- **AI-safe practices** — AI generates, humans review and decide — enforced, not just suggested
- **Automated enforcement** — GitHub Actions checks that catch problems before merge
- **Living updates** — a system that adapts as GitHub, Anthropic, OpenAI, and Google ship changes

---

## Automated Enforcement

This repository uses GitHub Actions to enforce standards automatically on every pull request:

| Workflow | What It Enforces |
|---|---|
| `00-repo-health.yml` | Required files present (SECURITY.md, AGENTS.md, CODEOWNERS) |
| `01-pr-standards.yml` | PR description filled out; no WIP merges |
| `02-docs-quality.yml` | No broken links; markdown lint passes |
| `03-security-supply-chain.yml` | No secrets committed; dependency audit |
| `04-codeql.yml` | Static code analysis for security vulnerabilities |
| `07-branch-naming.yml` | Branch name follows `type/description` convention |
| `08-commit-lint.yml` | All commits follow Conventional Commits format |

**Bypass is not the answer.** When a check fails, fix the underlying issue — do not use `--no-verify` or skip the workflow.

→ Full details: [docs/10-github-actions/GITHUB_ACTIONS_ENFORCEMENT_PACK.md](docs/10-github-actions/GITHUB_ACTIONS_ENFORCEMENT_PACK.md)

---

## Repository Overview

→ Full directory listing: **[REPO_MAP.md](REPO_MAP.md)**

```text
docs/         Documentation: getting started, workflows, AI tools, compliance
templates/    Copy-paste starting points for projects, workflows, and prompts
examples/     Working examples showing templates in real project structures
scripts/      Repo validation and maintenance scripts
.github/      GitHub Actions workflows, issue templates, PR template
standards/    Detailed coding, review, testing, and documentation standards
```

Key root files:

| File | Purpose |
|---|---|
| `AGENTS.md` | Rules and boundaries for AI coding agents |
| `TECH_STACK.md` | Technology choices and rationale |
| `DESIGN.md` | Architecture and design decisions |
| `SECURITY.md` | Security policies and responsible disclosure |

---

## Goal

A developer who works through this repository will be able to:

- Set up a full development environment from scratch
- Work confidently with Git and GitHub
- Build and manage real projects using professional workflows
- Use AI tools responsibly and effectively
- Apply enterprise-grade standards without rewriting them from scratch
