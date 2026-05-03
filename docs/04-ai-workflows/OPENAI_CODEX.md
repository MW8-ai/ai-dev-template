# OpenAI Codex CLI

A terminal-based AI coding assistant for quick tasks, script generation, and command-line workflows.

Related docs: [AI_OVERVIEW.md](./AI_OVERVIEW.md) | [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md) | [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md)

---

## What It Is

OpenAI Codex CLI is a command-line tool that sends your prompts to OpenAI's models and returns code, explanations, or shell commands — directly in your terminal. Unlike GitHub Copilot (which integrates into your editor) or Claude Code (which operates as a persistent agent that reads and edits files), Codex CLI is designed for fast, one-shot interactions from the command line.

---

## When to Use It

- You need a quick script and do not want to open an editor
- You want to understand what a shell command does before running it
- You are working entirely in the terminal and want an assistant nearby
- You need to generate boilerplate in a language you do not know well
- You want a fast answer to a syntax or API question without switching context

---

## Strengths

- **Fast**: Returns output in seconds for most tasks
- **Terminal-native**: Stays in your workflow without requiring a browser or editor switch
- **Web search included**: Can search the web to supplement its training knowledge (useful for APIs that changed recently)
- **Broad language support**: Works across Python, JavaScript, TypeScript, Go, Rust, Bash, SQL, and more
- **Good code generation**: Strong at producing working boilerplate from short prompts

---

## Limitations

- **No persistent memory**: Each invocation starts fresh — it does not remember previous conversations
- **Context window limits**: Cannot reason across a large codebase the way Claude Code can; works best on small, self-contained tasks
- **Can hallucinate APIs**: May generate code that calls functions or options that do not exist, especially for niche libraries or recent API changes
- **No file awareness by default**: Unless you explicitly paste code into the prompt, it cannot read your project files
- **Not a replacement for a full agent**: For multi-step tasks that require editing multiple files, use Claude Code instead

---

## When NOT to Use It

- **Multi-file refactors** — Use Claude Code, which reads and edits files across the codebase
- **Anything you cannot verify** — If you cannot read and understand the output, do not run it
- **Production scripts without review** — Generated shell commands can delete data; always review before executing
- **Security-sensitive code** — Cryptography, authentication, and authorization logic require human expertise to validate
- **Replacing understanding** — Using Codex to generate code you do not understand creates hidden technical debt

---

## Common Failure Modes

| Failure | What Happens | Prevention |
|---|---|---|
| API hallucination | Calls a function or flag that does not exist | Run the code; check against official docs |
| Outdated patterns | Suggests deprecated syntax or removed APIs | Specify the library version in your prompt |
| Scope creep | Adds features not requested | Be specific: "only do X, nothing else" |
| Silent wrong output | Returns plausible but incorrect logic | Test with known inputs and expected outputs |

---

## Required Human Validation

Before running or committing Codex output:

- [ ] Read the generated code — do not run blind
- [ ] Test the output with a concrete input/output pair
- [ ] Verify any APIs used actually exist at the version you are running
- [ ] If it is a shell command, understand what it does before executing

---

## Setup

**Install:**
```bash
npm install -g @openai/codex
```

**Set your API key:**
```bash
export OPENAI_API_KEY="sk-..."
```

Add the export to your `~/.bashrc` or `~/.zshrc` so it persists across sessions:
```bash
echo 'export OPENAI_API_KEY="sk-..."' >> ~/.zshrc
source ~/.zshrc
```

**Verify installation:**
```bash
codex --version
```

---

## Basic Usage

The primary interface is a natural language prompt passed directly on the command line:

```bash
codex "write a Python script that reads a CSV file and outputs JSON"
```

```bash
codex "write a bash script that finds all .log files older than 7 days and deletes them"
```

```bash
codex "explain what this command does: find . -name '*.pyc' -exec rm -f {} +"
```

```bash
codex "write a SQL query to find all users who have not logged in for 90 days"
```

Codex prints the generated code to stdout. You can pipe it to a file:
```bash
codex "write a Python script that reads a CSV and outputs JSON" > convert.py
```

---

## Workflow Integration

Codex CLI fits into the development cycle at specific moments — it is not a replacement for your editor or a full agent:

| Moment | Use Codex CLI For |
|---|---|
| Starting a new script | Generate the initial structure from a description |
| Unfamiliar syntax | "How do I do X in Rust / Go / Bash?" |
| One-off data processing | CSV transformations, log parsing, file renaming |
| Understanding a command | "Explain this grep pattern" |
| Quick test data | "Generate 10 sample JSON records for a user profile" |

For tasks that require editing existing project files or coordinating changes across multiple files, use Claude Code instead.

---

## Safety Rules

- **Always read output before running it.** Generated scripts may include destructive commands (`rm`, `DROP TABLE`, `git reset --hard`). Never pipe Codex output directly to `bash` without reviewing it first.
  ```bash
  # Unsafe — runs whatever the AI generates without review:
  codex "delete all temp files" | bash

  # Safe — read first, then decide:
  codex "delete all temp files" > cleanup.sh
  cat cleanup.sh   # review it
  bash cleanup.sh  # run it only after reading
  ```
- **Do not include secrets in prompts.** Do not paste connection strings, API keys, or passwords into a Codex prompt to ask it to generate code around them.
- **Verify library and API references.** Check that function names, parameters, and library versions mentioned in the output actually exist before shipping the code.
- **Treat output as a first draft.** Codex output is a starting point. Read it, test it, and take ownership of it before committing.

---

## Prompt Tips for Codex

Codex works best with specific, structured prompts. Vague prompts return vague code.

**Include the language and version:**
```bash
# Vague:
codex "parse a config file"

# Specific:
codex "write a Python 3.11 script that reads a TOML config file using the tomllib module and prints each key-value pair"
```

**Include the framework when relevant:**
```bash
codex "write a FastAPI endpoint that accepts a JSON body with fields 'name' (string) and 'age' (integer) and returns a greeting"
```

**Include constraints:**
```bash
codex "write a bash function that backs up a directory to a timestamped tar.gz file — use only built-in commands, no third-party tools"
```

**Give context about what already exists:**
```bash
codex "I have a PostgreSQL table named 'orders' with columns: id (int), user_id (int), total (decimal), created_at (timestamp). Write a query to find the top 10 users by total spend in the last 30 days."
```

**State the output format:**
```bash
codex "explain each line of this Dockerfile — respond as a numbered list with one sentence per line"
```

---

## Next Step

→ [docs/04-ai-workflows/CLAUDE_CODE.md](docs/04-ai-workflows/CLAUDE_CODE.md) — setup and usage guide for Claude Code: multi-file tasks, CLAUDE.md configuration, hooks, and slash commands
