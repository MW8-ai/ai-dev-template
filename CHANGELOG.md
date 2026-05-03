# Changelog

## [1.0.0] — 2026-05-03

### Added

**Developer playbook (human-readable layer):**

- `docs/01-getting-started/MISCONCEPTIONS.md` — common Git/GitHub misconceptions corrected
- `docs/03-development-workflow/WHY_THIS_WORKFLOW.md` — explains the reasoning behind every workflow step
- `docs/03-development-workflow/RELEASE_VERSIONING.md` — SemVer guide for projects
- `docs/04-ai-workflows/LOCAL_LLMS.md` — local inference guide with hardware requirements, Apple Silicon benchmarks, and model recommendations by task
- `docs/04-ai-workflows/AI_CERTIFICATIONS.md` — vendor cert tracker (Microsoft, AWS, Google, NVIDIA, CompTIA) with costs and living-updates tracking
- `docs/00-start-here/VISUAL_GUIDE.md` — six Mermaid workflow diagrams for visual learners
- `docs/05-confusion-troubleshooting/` — seven docs covering the questions that send developers to Stack Overflow
- `docs/10-maintenance/KEEPING_THIS_REPO_UPDATED.md` — weekly/monthly/quarterly review schedule
- `docs/10-maintenance/RELEASE_CADENCE.md` — versioning policy and release process for this template
- `docs/06-standards/COMMIT_CONVENTION.md` — full Conventional Commits guide with automation payoff
- `docs/06-standards/OPINIONATED_DEFAULTS.md` — all defaults with rationale
- `docs/06-standards/TEAM_RULES.md` — team norms, review SLAs, escalation paths
- `docs/10-github-actions/` — eight new docs covering enforcement pack, branch protection, CODEOWNERS, labels, changelog automation, best practices, branching strategy

**GitHub Actions enforcement pack:**

- `07-branch-naming.yml` — validates branch prefix (`feature/`, `fix/`, `docs/`, `claude/`, etc.) on every PR
- `08-commit-lint.yml` — validates all commits and PR title against Conventional Commits format
- `living-updates-watch.yml` — weekly automated watcher across 24 sources (GitHub, Anthropic, OpenAI, Google, xAI, Meta, Mistral, HuggingFace, Ollama, cert providers); falls back to GitHub Issue when PR creation is org-blocked
- `init.yml` — push-to-main trigger to activate status badges immediately

**Living Updates system (`docs/06-living-updates/`):**

- Three-layer model: incoming → summaries → impacts → archive
- 24 monitored sources across 10 vendors
- 10 auto-detected incoming notes included on first run
- Two seed impact notes (PR reviewing, AI dev workflow guardrails)

**README and entry-point improvements:**

- Badge block (PR checks, branch naming, markdown lint, link check, CodeQL, license, last commit)
- Visual Guide section, Automated Enforcement table, Latest AI & GitHub Updates snapshot
- AI Certifications at a Glance quick-reference table
- `START_HERE.md`: "Prefer pictures first?" section, "What You Will Learn" outcomes with time estimates
- PR template: Required Checks table mapping workflows 00–08 to plain-English descriptions

**AI tool docs (`docs/04-ai-workflows/`):**

- Added "When NOT to Use", "Common Failure Modes", and "Required Human Validation" sections to CLAUDE_CODE, OPENAI_CODEX, and GITHUB_COPILOT
- Next Step chains across all 25 docs in docs/01–04

**Claude-native layer (AI agent context):**

- `docs/09_claude_native/` — PROMPT_CACHING, SUBAGENT_PATTERNS, EXTENDED_THINKING, BATCH_API, MCP_SERVERS, CONTEXT_MANAGEMENT
- `.claude/commands/` — `/review`, `/security`, `/changelog`, `/snapshot`, `/audit` slash commands
- `CLAUDE.md` — hooks, slash commands, settings, sub-agent patterns, context management rules
- `docs/02_workflows/MODEL_ROUTING.md` — Claude model/feature matrix with cost optimization rules

### Changed

- `README.md` — complete rewrite with three-path entry flow (new users / experienced / use in project)
- `START_HERE.md` — restructured with guided learning path and outcomes
- `REPO_MAP.md` — updated to reflect new folder structure and two-layer doc system
- `.markdownlint-cli2.jsonc` — disabled MD034/MD036/MD060 (intentional doc patterns); 0 lint errors across 197 files

### Fixed

- Markdown lint: 1,941 errors resolved (spacing, unlabeled code fences, table style)
- Living updates workflow: fallback to GitHub Issue when PR creation is blocked by org settings

## [0.2.0] — 2026-04-01

### Added

- `docs/09_claude_native/` — Claude/Anthropic-specific design patterns
- `.claude/commands/` — custom slash commands wired to the prompt library
- `.github/workflows/claude-code.yml` — opt-in Claude Code PR review via GitHub Actions
- Expanded `CLAUDE.md` with hooks, slash commands, settings, sub-agent guidance
- GitHub issue templates, compliance docs, testing and release standards

## [0.1.0] — 2026-01-01

- Initial AI-native development repo scaffold.
