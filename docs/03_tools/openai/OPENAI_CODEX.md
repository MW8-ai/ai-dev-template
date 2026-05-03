# OPENAI_CODEX.md

## Purpose

OpenAI Codex guidance for repo-based development.

## Official Docs To Check

- Codex overview
- AGENTS.md custom instructions
- Codex best practices
- Codex changelog
- Skills
- Subagents
- MCP server support

## Recommended Repo Files

- `AGENTS.md`
- focused docs for planning/review/security if `AGENTS.md` gets large
- `TESTING.md`
- `TASK_TEMPLATE.md`

## Usage Notes

Codex reads `AGENTS.md` before work. Keep root instructions concise and link to task-specific docs.

## Good Tasks

- bug fixes
- feature implementation
- tests
- codebase exploration
- PR preparation
- documentation updates

## Risk Controls

- prefer branches
- review diffs
- block production secrets
- avoid unrestricted write credentials
