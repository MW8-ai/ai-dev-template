# CLAUDE.md

Read `AGENTS.md` first.

Use this file for Claude-specific behavior only.

## Claude Code Rules

- Keep changes scoped.
- Preserve architecture.
- Update `CHANGELOG.md` after meaningful changes.
- Run checks from `TESTING.md`.
- Do not introduce new frameworks without approval.
- If stuck, stop and summarize what failed rather than rewriting broadly.

## Model Selection

| Task | Model |
|---|---|
| Docs cleanup, changelog, formatting | Haiku 4.5 |
| Features, bug fixes, tests, refactors | Sonnet 4.6 |
| Architecture, security, compliance, cross-file debugging | Opus 4.7 |

Use the smallest model that can complete the task correctly. See `docs/02_workflows/MODEL_ROUTING.md` for the full matrix.

## Hooks

Hooks run shell commands in response to Claude Code lifecycle events. Configure in `.claude/settings.json`.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/check_required_docs.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session ended. Review CHANGELOG.md if files were changed.'"
          }
        ]
      }
    ]
  }
}
```

Common hook uses:
- `PreToolUse` on `Bash` — block dangerous shell patterns (e.g. `rm -rf`, `git push --force`)
- `PostToolUse` on `Edit|Write` — run doc freshness checks or linters
- `Stop` — remind agent to write end report, trigger CI dry-run
- `Notification` — surface blockers to the user immediately

## Slash Commands

Custom slash commands live in `.claude/commands/`. Each is a `.md` file whose content becomes the prompt.

```
.claude/
  commands/
    review.md         # /review  — runs REVIEW_PROMPTS checklist
    security.md       # /security — runs SECURITY_REVIEW_PROMPT
    snapshot.md       # /snapshot — updates docs/07_snapshots/
    changelog.md      # /changelog — drafts CHANGELOG entry for current branch diff
    audit.md          # /audit — runs REPO_AUDIT_PROMPT
```

Example `.claude/commands/review.md`:

```markdown
Read docs/05_prompts/review/REVIEW_PROMPTS.md and apply every checklist item
to the diff since the last commit. Report findings grouped by: correctness,
safety, maintainability, test coverage, doc drift.
```

## Settings

`.claude/settings.json` controls permissions, hooks, and model defaults.

```json
{
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git add*)",
      "Bash(git commit*)",
      "Bash(find . *)",
      "Bash(grep *)",
      "Read(*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(rm -rf*)",
      "Bash(git reset --hard*)"
    ]
  }
}
```

Keep destructive operations in `deny`. Add read-only operations to `allow` to reduce permission prompts.

## Sub-Agents

Use the Agent tool to parallelize independent work or protect the main context window.

```
Agent(Research) ──→ findings
Agent(Build A)  ──→ diff A   } run in parallel
Agent(Build B)  ──→ diff B   }
Main            ──→ review + commit
```

See `docs/09_claude_native/SUBAGENT_PATTERNS.md` for full patterns.

## Context Management

- Pin `AGENTS.md`, `TECH_STACK.md`, and `DESIGN.md` at the top of long sessions.
- Use `cache_control` on stable docs injected repeatedly (see `docs/09_claude_native/PROMPT_CACHING.md`).
- If the same error appears 3 times, stop and summarize — don't expand context.
- Start a fresh session rather than compressing a broken one.

## End Report

```text
Files changed:
Checks run:
Docs updated:
Risks:
Next step:
```
