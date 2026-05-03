# Changelog

## Unreleased

### Added

- `docs/09_claude_native/` — new section for Claude/Anthropic-specific design patterns:
  - `PROMPT_CACHING.md` — `cache_control` placement, cache hit verification, cost model
  - `SUBAGENT_PATTERNS.md` — parallel tasks, research/build separation, worktree isolation, role-based orchestration
  - `EXTENDED_THINKING.md` — when to enable, budget guidance by task type, multi-turn usage
  - `BATCH_API.md` — nightly doc review, bulk security pass, cost model, polling pattern
  - `MCP_SERVERS.md` — server config, well-known servers, custom server template, security rules
  - `CONTEXT_MANAGEMENT.md` — context budget strategies, fresh session handoff template
- `.claude/commands/` — custom slash commands wired to the prompt library:
  - `/review` — runs review checklist against current diff
  - `/security` — runs security review prompt against current diff
  - `/changelog` — drafts CHANGELOG entry from branch diff
  - `/snapshot` — creates a dated tool capability snapshot
  - `/audit` — full repo audit against required docs and standards
- `.github/workflows/claude-code.yml` — opt-in Claude Code PR review via GitHub Actions
- Expanded `CLAUDE.md` with hooks, slash commands, settings, sub-agent guidance, and context management rules
- Updated `docs/02_workflows/MODEL_ROUTING.md` with Claude model/feature matrix (Haiku 4.5, Sonnet 4.6, Opus 4.7), feature availability table, and cost optimization rules

### Previously Added

- Expanded root-level project templates.
- Added GitHub issue templates.
- Added compliance, testing, release, and documentation standards.

## 0.1.0

- Initial AI-native development repo scaffold.
