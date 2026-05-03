# AI Tools for Development — Overview

A comparison of the major AI coding tools, when to use each, and the safety rules that apply to all of them.

Related docs: [CLAUDE_CODE.md](./CLAUDE_CODE.md) | [GITHUB_COPILOT.md](./GITHUB_COPILOT.md) | [OPENAI_CODEX.md](./OPENAI_CODEX.md) | [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md) | [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md)

---

## Tool Comparison

| Tool | Made By | Best For | Cost |
|---|---|---|---|
| GitHub Copilot | GitHub / Microsoft | In-editor code completion while typing | $10–$19/month |
| Claude Code | Anthropic | Multi-file tasks, architecture, CLI agent | Usage-based |
| OpenAI Codex CLI | OpenAI | Terminal-based coding assistant, quick scripts | Usage-based |
| Gemini CLI | Google | Terminal assistant, Google Cloud integration | Free tier + usage |

---

## How to Choose

**Use GitHub Copilot when** you want suggestions as you type — inline in your editor (VS Code, JetBrains, Neovim). Copilot sees your current file and offers completions. It works best for boilerplate, function bodies, and test stubs that follow patterns visible in the same file.

**Use Claude Code when** you want to delegate a complete task: "implement this feature", "review this PR for security issues", "refactor this module to use the new API". Claude Code reads multiple files, reasons across them, and can make changes, run commands, and report back. It is not real-time like Copilot — you invoke it for specific tasks.

**Use OpenAI Codex CLI when** you work mostly in the terminal and need a quick assistant for generating scripts, explaining commands, or running one-shot coding tasks without opening an editor.

**Use multiple tools together** — they complement each other rather than compete. A common pattern: Copilot for in-editor typing, Claude Code for delegated feature work, Codex CLI for quick terminal questions.

---

## What AI Tools Can Do

- Generate boilerplate code (CRUD endpoints, config files, test stubs)
- Explain existing code in plain English
- Find and describe bugs given a failing test or error message
- Write unit and integration tests for existing functions
- Draft documentation (docstrings, README sections, API docs)
- Suggest refactors for readability, performance, or consistency
- Translate code between languages or frameworks

---

## What AI Tools Cannot Do

These are areas where AI-generated output requires careful human review or should not be trusted without it:

- **Make architectural decisions without review.** AI can suggest architectures, but it does not know your team's constraints, existing systems, or long-term roadmap.
- **Handle secrets or credentials.** Never paste API keys, passwords, or tokens into an AI prompt. The AI cannot store them safely and the data leaves your machine.
- **Deploy to production unsupervised.** AI can write deployment scripts, but a human must review and approve every production deployment.
- **Write security-critical code without human audit.** Authentication, authorization, cryptography, and input validation must be reviewed by a developer who understands the security model.
- **Know your specific business rules.** The AI knows general programming patterns. It does not know that your system treats a zero-dollar invoice differently from a missing invoice, unless you tell it.

---

## Safety Rules (Apply to All AI Tools)

These rules apply regardless of which tool you use:

1. **Review all AI-generated code before committing.** Read every line. Do not commit output you have not read.
2. **Never paste secrets into an AI prompt.** This includes API keys, passwords, database connection strings, and session tokens.
3. **Never commit AI output without reading it.** "The AI generated it" is not a review.
4. **Do not let AI push to main directly.** All AI-generated changes go through a branch and a pull request (PR) like any other change.
5. **AI suggestions are proposals, not finished work.** Treat them the way you would treat code written by a junior developer: read it, test it, and take responsibility for it before it ships.

---

## Next Steps

- [CLAUDE_CODE.md](./CLAUDE_CODE.md) — Full guide to Claude Code setup and workflows
- [GITHUB_COPILOT.md](./GITHUB_COPILOT.md) — Copilot setup and editor integration
- [OPENAI_CODEX.md](./OPENAI_CODEX.md) — Codex CLI setup and terminal workflow
- [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md) — How to write effective prompts for any AI tool
- [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md) — When and how to keep humans in the review loop

---

## Next Step

→ [docs/04-ai-workflows/OPENAI_CODEX.md](docs/04-ai-workflows/OPENAI_CODEX.md) — setup and usage guide for OpenAI Codex CLI: terminal-based coding assistance and prompt tips
