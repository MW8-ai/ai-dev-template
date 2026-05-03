# Claude Code

An AI coding agent that runs in your terminal, reads and edits your files, runs commands, and uses git — delegated to complete full tasks, not just answer questions.

Related docs: [AI_OVERVIEW.md](./AI_OVERVIEW.md) | [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md) | [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md) | [../../docs/09_claude_native/](../../docs/09_claude_native/)

---

## What It Is

Claude Code is Anthropic's CLI (Command-Line Interface) coding agent. Unlike a chatbot or inline completion tool, Claude Code has direct access to your filesystem, can run shell commands, make git commits, read multiple files simultaneously, and chain together multi-step tasks. You delegate a task and it works through it — reporting back when done or when it needs input.

---

## When to Use It

- Implementing a feature that touches multiple files
- Refactoring a module across a codebase
- Reviewing a PR (Pull Request) or diff for security issues or bugs
- Writing tests for existing code
- Debugging a complex issue that requires reading many files to understand
- Generating documentation from source code
- Architecture questions that require understanding the whole project

Claude Code is not a real-time typing assistant. Use GitHub Copilot for that. Claude Code is for delegated, task-level work.

---

## Strengths

- **Long context window**: Can read and reason across dozens of files simultaneously
- **Excellent reasoning**: Handles complex, multi-step problems that require understanding relationships between parts of a codebase
- **File-aware**: Reads your actual code, not a generic approximation of it
- **Can orchestrate sub-agents**: For large tasks, Claude Code can spawn parallel sub-agents to work on independent parts simultaneously
- **Configurable via CLAUDE.md**: A project-level configuration file guides Claude's behavior, conventions, and restrictions for your specific repo
- **Hooks and slash commands**: Automate post-edit checks, custom review workflows, and more

---

## Limitations

- **Usage cost**: Billed per token (input + output). Large context tasks cost more than small ones.
- **Not real-time**: Does not offer keystroke-level suggestions; you invoke it for a task
- **Works best with CLAUDE.md configured**: Without a `CLAUDE.md` file, Claude Code has no knowledge of your project's conventions, tech stack, or restrictions
- **Requires review**: Like all AI tools, its output must be read and approved before merging

---

## Models

Claude Code routes tasks to different models based on complexity:

| Model | Speed | Cost | Best For |
|---|---|---|---|
| **Haiku 4.5** | Fastest | Lowest | Docs cleanup, changelog updates, formatting, simple searches |
| **Sonnet 4.6** | Balanced | Moderate | Features, bug fixes, tests, refactors — most daily work |
| **Opus 4.7** | Slowest | Highest | Architecture decisions, security review, cross-file debugging, compliance |

The model routing matrix is documented in `docs/02_workflows/MODEL_ROUTING.md`. Use the smallest model that can complete the task correctly — Opus is not needed for a changelog entry.

---

## Setup

**Install:**
```bash
npm install -g @anthropic-ai/claude-code
```

**Set your API key:**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Add to your shell profile for persistence:
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.zshrc
source ~/.zshrc
```

**Verify:**
```bash
claude --version
```

**Start a session in your project directory:**
```bash
cd /path/to/your-project
claude
```

---

## CLAUDE.md

`CLAUDE.md` is a Markdown file at the root of your repository that tells Claude Code how to behave in your specific project. It is read at the start of every session.

What to include in `CLAUDE.md`:
- The tech stack (language, framework, runtime versions)
- Coding conventions (naming, file structure, test patterns)
- What commands to run to build, test, and lint
- Which files or directories to avoid modifying
- Model routing guidance (which task types use which model)
- Any project-specific rules ("never use `console.log` in production code")

Example snippet:
```markdown
## Tech Stack
- Python 3.11, Django 4.2, PostgreSQL 15
- Tests: pytest with pytest-django
- Linting: ruff, mypy

## Run Tests
pytest tests/ -v

## Conventions
- All new views must have a corresponding test in tests/views/
- Never modify migration files after they have been deployed
```

See this project's [CLAUDE.md](../../CLAUDE.md) for a complete example.

---

## Key Features

### Slash Commands

Custom slash commands live in `.claude/commands/` as `.md` files. Each file's content becomes the prompt when you type the command name.

```
/review     — runs the full code review checklist on the current diff
/security   — runs a security-focused review
/audit      — runs a full repo audit
/snapshot   — updates the docs snapshot register
/changelog  — drafts a CHANGELOG.md entry for the current branch
```

Run a command:
```
claude> /review
```

### Hooks

Hooks run shell commands in response to Claude Code lifecycle events, configured in `.claude/settings.json`. Common uses:

- **PostToolUse on Edit/Write**: Run a linter or doc freshness check after every file edit
- **PreToolUse on Bash**: Block dangerous shell patterns before they execute
- **Stop**: Remind Claude to update the changelog or run CI after a session ends

### MCP Servers

MCP (Model Context Protocol) servers extend Claude Code's capabilities with external integrations — GitHub, databases, Slack, and more. They are configured in `.claude/settings.json` under the `mcpServers` key.

---

## Typical Workflow

Claude Code is most effective when used for complete, delegated tasks on a feature branch:

```bash
# 1. Create a branch for the task
git checkout -b feature/issue-42-user-login

# 2. Start Claude Code
claude

# 3. Delegate the task
claude> Implement the user login endpoint described in issue #42.
        The relevant files are auth/views.py and auth/serializers.py.
        Write the view, update the URL config, and add tests.
        Follow the patterns used in the existing register endpoint.

# 4. Review what Claude produced
git diff

# 5. Run the tests
pytest tests/

# 6. Commit if satisfied
git add -p
git commit -m "add user login endpoint (#42)"
```

Claude Code works on your actual files and uses your actual git history. It will tell you what it changed and why.

---

## Safety Configuration

The `.claude/settings.json` file controls what Claude Code is and is not allowed to do:

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

Critical deny rules for any project:
- `git push --force` — prevents rewriting shared history
- `rm -rf` — prevents bulk file deletion
- `git reset --hard` — prevents discarding uncommitted work

Claude Code will ask for permission before running any command not in the allow list. The deny list blocks commands entirely, even if you try to approve them.

---

## Advanced Patterns

For complex tasks, Claude Code can use sub-agents to work in parallel:

```
Agent(Research) ──→ reads files, gathers findings
Agent(Build A)  ──→ implements the backend change     } parallel
Agent(Build B)  ──→ implements the frontend change    }
Main agent      ──→ reviews both diffs, commits
```

See `docs/09_claude_native/SUBAGENT_PATTERNS.md` for full patterns including context management, prompt caching, and agent coordination.

---

## Next Step

→ [Learn how to write effective AI prompts](docs/04-ai-workflows/PROMPT_STRATEGIES.md)
