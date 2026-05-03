# Impact Note: AI Dev Workflow Adjustments

## Triggered By

- Update: AI coding tools (Copilot, Codex, Claude Code, Gemini Code Assist) now generate larger, broader changes at higher velocity
- Source: Ongoing — tracked via `anthropic-claude-code-changelog`, `openai-codex-changelog`, `google-gemini-code-assist-release-notes`
- Date: Living document — updated as AI tooling evolves

## Previous Guidance

AI tools assist with suggestions. Developers write the majority of code. Review is a sanity check.

## Updated Guidance

AI tools now routinely generate entire feature implementations, refactors, test suites, and documentation in a single step. The human role is now primarily review and approval, not generation.

This is a capability shift, not just a speed improvement. It requires updated guardrails.

### Rules

**AI can propose. Humans approve.**

No AI-generated code reaches `main` without a PR and human review. This is non-negotiable regardless of how confident the AI appears.

**PR-only AI workflow.**

AI agents must not push directly to `main` or any shared branch. All AI-generated changes go through a branch + PR. This applies to Claude Code, Codex, Copilot Workspace, Gemini Code Assist, and any agent with write access.

**No direct push to main.**

Enforced by branch protection. If an AI agent needs to push, it pushes to a feature branch and opens a PR. The `no-direct-main-warning.yml` workflow fires on any direct push to `main` to flag it immediately.

**Strict CI enforcement.**

AI-generated code passes the same checks as human-written code. No exceptions, no bypass flags. If the AI's code doesn't pass CI, the AI (or its operator) fixes it.

**Code owner review on sensitive files.**

Files in `.github/workflows/`, `scripts/`, `src/auth/`, `src/api/`, and any file touching secrets or credentials require human approval from a named code owner. See `.github/CODEOWNERS`.

**Treat AI confidence as a signal, not a guarantee.**

AI tools present generated code without uncertainty markers. "Here is the implementation" does not mean the implementation is correct. Review skeptically.

## Risks Without These Controls

| Risk | Consequence |
|---|---|
| AI pushes directly to main | Untested code reaches production |
| Shallow review of AI PRs | Hidden side effects slip through |
| Over-trusting generated code | Security vulnerabilities introduced |
| Over-automation without gates | Entire workflows run without human understanding |
| AI changes CI/CD config | Pipeline behavior changes without review |

## Trigger Sources

This impact note should be revisited when any of these sources detect a meaningful update:

- `anthropic-claude-code-changelog` — Claude Code capability or permissions changes
- `openai-codex-changelog` — Codex CLI agent capability changes
- `google-gemini-code-assist-release-notes` — Gemini Code Assist GitHub integration changes
- `github-changelog` — Copilot Workspace or GitHub AI feature changes

## Affected Files

```text
AGENTS.md
.github/CODEOWNERS
.github/workflows/no-direct-main-warning.yml
docs/04-ai-workflows/HUMAN_IN_LOOP.md
docs/04-ai-workflows/AI_OVERVIEW.md
docs/06-standards/SECURITY.md
```

## Required Action

- [x] Guardrails enforced in AGENTS.md
- [x] no-direct-main-warning.yml workflow active
- [x] CODEOWNERS configured for sensitive paths
- [ ] Revisit when AI tool capabilities expand significantly
