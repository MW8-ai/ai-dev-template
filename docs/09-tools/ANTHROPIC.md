# Anthropic and Claude

Anthropic is an AI safety company that builds and researches large language models. Their primary product family is Claude — a set of AI models optimized for helpfulness, accuracy, and safety. Claude is the model powering this repo's AI-native workflow.

---

## Claude Model Family

Each model is a tradeoff between capability, speed, and cost. Use the smallest model that can do the job correctly.

| Model | Best For | When to Upgrade |
|---|---|---|
| **Claude Haiku 4.5** | Docs cleanup, changelog entries, formatting, simple Q&A, summarization | The output quality is not good enough, or the task requires reasoning |
| **Claude Sonnet 4.6** | Feature implementation, bug fixes, test writing, refactoring, code review | The task involves architecture decisions, security analysis, or complex multi-file debugging |
| **Claude Opus 4.7** | Architecture design, security review, compliance analysis, cross-file debugging of hard problems | Almost never — Sonnet handles most code tasks. Opus when Sonnet gets stuck. |

See the model routing matrix in `docs/02_workflows/MODEL_ROUTING.md` for the full decision table.

**Rule of thumb:** If Sonnet gives you a wrong answer twice, escalate to Opus. If Haiku gives you a wrong answer once, escalate to Sonnet.

---

## Claude Code

Claude Code is Anthropic's AI coding agent. Unlike chat interfaces, Claude Code can:

- Read and write files in your repository
- Run shell commands (git, tests, linters, build tools)
- Search and navigate the codebase
- Orchestrate sub-agents to parallelize work
- Maintain context across a long working session

This is the primary AI tool for this repo template.

### Install

```bash
npm install -g @anthropic-ai/claude-code
```

Requires Node.js 18+. Verify:

```bash
claude --version
```

### API Key Setup

1. Create an account at console.anthropic.com
2. Go to API Keys → Create Key
3. Set the environment variable:

   ```bash
   export ANTHROPIC_API_KEY=sk-ant-...
   ```

   Add this to `.bashrc` or `.zshrc`. Never commit the actual key.

### Starting a Session

```bash
# In your repo directory:
claude

# Or with an initial prompt:
claude "read DESIGN.md and tell me what the authentication system does"
```

### How Claude Code Differs from Chat

| Chat (Claude.ai) | Claude Code |
|---|---|
| Browser-based | Terminal-based |
| No file access | Reads and writes your actual files |
| No code execution | Runs shell commands with your permission |
| Single conversation | Persistent across session, can maintain context |
| Manual copy/paste | Direct edits to your codebase |
| One model at a time | Can spawn sub-agents for parallel work |

---

## CLAUDE.md

`CLAUDE.md` is the configuration file that guides Claude Code's behavior in a repository. When Claude Code starts a session, it reads `CLAUDE.md` first.

Use `CLAUDE.md` to define:

- Project-specific rules and conventions
- Which files to always read first
- What is and is not allowed (no new frameworks without approval, etc.)
- Model selection policy
- Hook configurations
- End-of-session report format

The `CLAUDE.md` in this repository is at the root. Read it before starting any session in this repo.

---

## Slash Commands

Claude Code supports custom slash commands defined as Markdown files in `.claude/commands/`. Each file's name becomes the command, and its content becomes the prompt.

| Command | File | What It Does |
|---|---|---|
| `/review` | `.claude/commands/review.md` | Runs the full code review checklist on the current diff |
| `/security` | `.claude/commands/security.md` | Runs a security review on the current diff |
| `/audit` | `.claude/commands/audit.md` | Full repository audit against the playbook standards |
| `/changelog` | `.claude/commands/changelog.md` | Drafts a CHANGELOG entry for the current branch |
| `/snapshot` | `.claude/commands/snapshot.md` | Updates the docs/07_snapshots/ documentation |

Use slash commands from the Claude Code terminal prompt:

```text
claude> /review
claude> /security
```

---

## MCP (Model Context Protocol) Servers

MCP is an open protocol that lets you extend Claude Code with custom tools. An MCP server is a local process that Claude Code can call — like a plugin system for the agent.

**What MCP servers can do:**

- Connect Claude Code to your databases (query your PostgreSQL directly)
- Integrate with your internal APIs
- Add custom search over your documentation
- Connect to Slack, Jira, PagerDuty, or other tools
- Add specialized capabilities (run tests, query monitoring systems)

**Configuring MCP servers:** add them to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "my-database": {
      "command": "npx",
      "args": ["-y", "@myorg/claude-mcp-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

The Anthropic documentation at docs.anthropic.com/en/docs/claude-code/mcp covers available servers and how to build your own.

---

## Key Features for This Repo

### Prompt Caching

When you inject large stable documents (AGENTS.md, DESIGN.md, TECH_STACK.md) into every request, prompt caching avoids re-processing them on every call. This reduces latency and cost for long sessions.

See `docs/09_claude_native/PROMPT_CACHING.md` for implementation details and when to use `cache_control`.

### Extended Thinking

For hard problems — complex architecture decisions, multi-step debugging, security analysis — Claude Opus 4.7 supports extended thinking: the model spends more tokens working through the problem before responding.

Extended thinking produces better results for problems that require planning, exploration of multiple approaches, or deep reasoning. It costs more. Use it selectively.

See `docs/09_claude_native/EXTENDED_THINKING.md`.

### Sub-Agent Patterns

Claude Code can spawn sub-agents (via the Agent tool) to parallelize independent work:

```text
Main agent → reads the problem, breaks it into parts
  Sub-agent A → researches file A
  Sub-agent B → researches file B
  Sub-agent C → researches file C
Main agent → synthesizes findings, makes the change
```

This keeps the main context window clean and speeds up work that can be parallelized. Use it for large refactors, cross-repo research, or when building multiple independent components.

See `docs/09_claude_native/SUBAGENT_PATTERNS.md`.

### Batch API

The Batch API runs large numbers of requests asynchronously at a 50% cost discount. Use it for:

- Processing many files offline (generating summaries, extracting patterns)
- Running the same analysis across a large dataset
- Overnight jobs that do not need real-time results

See `docs/09_claude_native/BATCH_API.md`.

---

## Safety and Access Controls

Claude Code can make real changes to real files. The settings in `.claude/settings.json` control what it is allowed to do.

**Current deny rules in this repo:**

```json
{
  "permissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(rm -rf*)",
      "Bash(git reset --hard*)"
    ]
  }
}
```

These prevent the most destructive operations. Claude Code will ask for confirmation before running any operation not explicitly allowed.

**Human review is always required.** Claude Code is a tool that accelerates development — it does not replace judgment. Review every diff before accepting it. Run the tests. Read the commit before pushing.

See `CLAUDE.md` for the full permissions and hook configuration for this repo.

---

## Related Documents

- [OPENAI.md](./OPENAI.md) — OpenAI's tools, including the Codex CLI and GPT-4o API
- [GITHUB.md](./GITHUB.md) — GitHub Copilot (OpenAI-powered) and GitHub integration
- [VSCODE.md](./VSCODE.md) — VS Code, where Claude Code's edits land
- [docs/08-prompts/](../08-prompts/) — prompt templates designed for use with Claude Code
- [CLAUDE.md](../../CLAUDE.md) — this repo's Claude Code configuration
