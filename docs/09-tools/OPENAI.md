# OpenAI Tools for Development

OpenAI builds the GPT model family and provides APIs and CLI tools for using those models in development workflows. This document covers the tools most useful for software development.

---

## OpenAI Codex CLI

The OpenAI Codex CLI is a terminal-based AI coding agent. It can read your files, run commands, and make changes based on natural language instructions.

### Install

```bash
npm install -g @openai/codex
```

Requires Node.js 18+. Verify the install:
```bash
codex --version
```

### API Key Setup

1. Create an account at platform.openai.com
2. Go to API Keys → Create new secret key
3. Set the environment variable:
   ```bash
   export OPENAI_API_KEY=sk-...
   ```
   Add this to your `.bashrc` or `.zshrc` to persist across sessions. Never put the actual key in a `.env` file that gets committed.

### Modes

| Mode | Command | What It Does |
|---|---|---|
| Ask | `codex ask "explain this function"` | Explains code or answers questions. Does not modify files. |
| Code | `codex code "add input validation to the login function"` | Generates or modifies code. Shows you the diff and asks for confirmation. |
| Shell | `codex shell "find all TODO comments in Python files"` | Suggests shell commands to run. Confirms before execution. |

### Usage Examples

```bash
# Explain a file
codex ask "what does src/auth/jwt.py do?"

# Generate code
codex code "write a pytest fixture that creates a test database"

# Fix an error
codex code "fix the TypeError in src/api/users.py line 42"

# Suggest a shell command
codex shell "list all Docker containers that have been running for more than 24 hours"
```

---

## Prompt Tips for Better Results

The quality of the output depends heavily on the quality of the input.

**Be specific about what you want:**

Vague: "make the code better"
Specific: "add type annotations to all function signatures in src/api/users.py using Python 3.12 syntax"

**Include language and version:**

Bad: "write a function to parse dates"
Good: "write a Python 3.12 function using the `datetime` module to parse ISO 8601 date strings and return a `datetime.date` object. Handle invalid input by raising a `ValueError` with a descriptive message."

**Reference the file you want changed:**

"In `src/models/user.py`, add a method `to_dict()` that returns a dictionary with the user's public fields: id, email, created_at. Exclude password_hash."

**Ask for tests explicitly:**

"Write pytest tests for the `parse_date` function in `src/utils/dates.py`. Cover: valid ISO 8601 input, invalid string, empty string, None input."

---

## OpenAI API

For custom tooling — scripts, applications, or integrations — use the OpenAI API directly.

### Install the SDK

```bash
# Python
pip install openai

# Node.js
npm install openai
```

### Basic Usage (Python)

```python
from openai import OpenAI

client = OpenAI()  # Uses OPENAI_API_KEY from environment

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python function that validates an email address."}
    ]
)

print(response.choices[0].message.content)
```

### Basic Usage (Node.js / TypeScript)

```typescript
import OpenAI from "openai";

const client = new OpenAI(); // Uses OPENAI_API_KEY from environment

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "You are a helpful coding assistant." },
    { role: "user", content: "Write a TypeScript function that validates an email address." }
  ]
});

console.log(response.choices[0].message.content);
```

---

## GPT-4o for Code Tasks

GPT-4o (GPT-4 omni) is OpenAI's current best model for code tasks. It handles complex reasoning, multi-file context, and nuanced instructions.

**What it is good at:**
- Code generation in any common language
- Explaining code and architecture
- Debugging with a detailed error and stack trace
- Writing tests given a function signature and description
- Code review with specific criteria

**What it is less good at:**
- Very large codebases (context window limits apply)
- Understanding undocumented, proprietary frameworks
- Tasks that require running code to verify (it predicts, it does not execute)

---

## Model Selection

| Task | Model | Why |
|---|---|---|
| Complex code generation, architecture, debugging | `gpt-4o` | Best reasoning, handles nuance |
| Simple code completion, quick questions, scripts | `gpt-4o-mini` | Much cheaper (~15x), fast, adequate for simple tasks |
| Batch processing, offline analysis | `gpt-4o-mini` with the Batch API | Async, 50% discount on already cheap pricing |

**Cost estimate:** Check current pricing at platform.openai.com/pricing. Prices change frequently. As a rough guide:
- `gpt-4o`: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens (2025 pricing)
- `gpt-4o-mini`: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

1M tokens ≈ 750,000 words ≈ 1,500 pages of text. A typical code review request is 2,000–10,000 tokens.

Before a heavy automated use case, estimate the token count and multiply by the per-token price.

---

## Safety Rules

1. **Read all output before running it.** AI-generated code can look correct and be subtly wrong — wrong algorithm, off-by-one error, or a security flaw. Always review.

2. **Never run scripts blindly.** If the Codex CLI or GPT suggests a shell command, understand what it does before confirming.

3. **No secrets in prompts.** Your API requests go to OpenAI's servers. Do not paste API keys, passwords, database credentials, or PII into prompts. Replace real values with placeholders: `DATABASE_URL=your-database-url-here`.

4. **No confidential or regulated data in prompts.** Source code that contains proprietary algorithms, customer data, or CUI (Controlled Unclassified Information) should not go to OpenAI's API without a data processing agreement in place and approval from your security team.

5. **Verify dependencies suggested by the model.** AI models occasionally suggest packages that do not exist or have been abandoned. Run `npm audit` or `pip-audit` after any dependency suggestion.

---

## Related Documents

- [ANTHROPIC.md](./ANTHROPIC.md) — Claude and Claude Code, an alternative to the OpenAI toolchain
- [VSCODE.md](./VSCODE.md) — GitHub Copilot (OpenAI-powered) in VS Code
- [docs/08-prompts/](../08-prompts/) — prompt templates that work with any AI coding tool
- [docs/07-compliance/ENCRYPTION_AND_SECRETS.md](../07-compliance/ENCRYPTION_AND_SECRETS.md) — secrets management (keep keys out of prompts)
