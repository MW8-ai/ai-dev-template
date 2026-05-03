# GitHub Copilot

An AI pair programmer built into your editor — real-time code suggestions as you type.

Related docs: [AI_OVERVIEW.md](./AI_OVERVIEW.md) | [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md) | [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md)

---

## What It Is

GitHub Copilot is an AI code completion tool that integrates directly into VS Code, JetBrains IDEs, Neovim, and other editors. As you type, Copilot reads your current file (and open tabs) and offers inline suggestions — completing the current line, filling in a function body, or generating a block of code from a comment. You accept suggestions with Tab and dismiss them with Escape.

Copilot also includes a chat interface (Copilot Chat) for asking questions, explaining code, and running commands like `/fix` and `/tests` without leaving the editor.

---

## When to Use It

- Writing repetitive or boilerplate code (CRUD operations, getters/setters, imports)
- Completing function bodies when the function signature makes the intent clear
- Generating test stubs for existing functions
- Filling in common patterns (error handling, logging, type annotations)
- Getting a quick explanation of code you are reading without switching to a browser
- Asking for a fix when you see an error message — paste the error in Copilot Chat

Copilot is always-on during your editing session. You do not invoke it manually — it offers suggestions automatically and you decide whether to accept them.

---

## Strengths

- **Seamless IDE integration**: No context switch — suggestions appear inline as you write
- **Context-aware completions**: Copilot sees your current file, open tabs, and repository structure to generate relevant suggestions
- **Chat mode**: Copilot Chat lets you ask questions, request explanations, and run slash commands without leaving VS Code
- **Multi-language support**: Works across Python, JavaScript, TypeScript, Java, Go, Rust, C#, SQL, and many others
- **Test generation**: `/tests` generates test stubs for a selected function
- **Explain code**: `/explain` produces a plain-English explanation of selected code

---

## Limitations

- **Suggestions need review**: Copilot generates plausible code — not necessarily correct code. It can produce code that looks right but has logic errors, uses deprecated APIs, or misses edge cases.
- **Context window is file-local**: Copilot sees your current file and open tabs, not your entire codebase. For cross-file reasoning, use Claude Code.
- **Cannot replace understanding**: Accepting a Copilot suggestion you do not understand is the same as checking in code you have not reviewed.
- **May suggest outdated patterns**: Copilot's training has a cutoff date. For rapidly evolving frameworks, verify that suggested APIs still exist and are current.

---

## When NOT to Use It

- **Accepting suggestions without reading them** — The Tab key is not an approval that you understand the code
- **Security-critical logic** — Copilot can generate authentication and cryptography code that looks correct but has subtle vulnerabilities; these require expert review
- **Cross-file reasoning** — Copilot does not see the full codebase; use Claude Code for changes that need to stay consistent across many files
- **As a substitute for knowing a language** — Using Copilot to write code in a language you cannot read means you cannot catch its mistakes

---

## Common Failure Modes

| Failure | What Happens | Prevention |
|---|---|---|
| Autocomplete blindness | You Tab-accept without reading | Pause, read, then accept |
| Outdated API | Suggests a function signature that changed | Check official docs for the exact version |
| Logic error in suggestion | Code runs but produces wrong results | Test with expected inputs and outputs |
| Hallucinated test | Generates a test that always passes | Verify the test actually catches the failure it claims to test for |

---

## Required Human Validation

Before committing Copilot-assisted code:

- [ ] You read every suggestion before accepting it
- [ ] You understand what the accepted code does
- [ ] You ran the relevant tests and they pass
- [ ] You did not accept a test that only passes trivially (always-true assertions)

---

## Setup

1. **Install the extension in VS Code:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "GitHub Copilot"
   - Install the extension published by GitHub
   - Also install "GitHub Copilot Chat" for the chat interface

2. **Sign in with your GitHub account:**
   - After installation, a prompt appears to sign in with GitHub
   - Complete the OAuth flow in the browser
   - Return to VS Code — Copilot activates automatically

3. **Verify it is working:**
   - Open any code file
   - Start typing a function — you should see a grey suggestion appear
   - Press Tab to accept it

---

## Key Features

### Inline Suggestions

As you type, Copilot shows a grey ghost-text suggestion. Controls:

| Key | Action |
|---|---|
| `Tab` | Accept the full suggestion |
| `Escape` | Dismiss the suggestion |
| `Alt+]` / `Option+]` | See the next suggestion |
| `Alt+[` / `Option+[` | See the previous suggestion |
| `Ctrl+Enter` | Open the suggestion panel with up to 10 alternatives |

### Copilot Chat

Open Copilot Chat: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac)

You can ask free-form questions or use built-in slash commands:

| Command | What It Does |
|---|---|
| `/explain` | Explains the selected code in plain English |
| `/fix` | Suggests a fix for the selected code or an error message |
| `/tests` | Generates unit tests for the selected function |
| `/doc` | Generates a docstring or documentation comment |
| `/simplify` | Suggests a simpler version of the selected code |

Example: Select a function, open Copilot Chat, type `/tests` — Copilot generates a test file you can copy into your test suite.

### Inline Chat

Press `Ctrl+I` (Windows/Linux) or `Cmd+I` (Mac) to open an inline chat at your cursor. Type a prompt and Copilot edits the current code directly, showing you a diff before you accept it. Useful for targeted edits: "add error handling to this function" or "rename this variable to be more descriptive".

---

## Workflow

Use Copilot as a typing accelerator, not as a source of truth:

1. **Write a comment describing what you want**, then let Copilot fill it in:
   ```python
   # Read a CSV file and return a list of dicts, one per row
   def read_csv(filepath: str) -> list[dict]:
       # Copilot will suggest the body here
   ```

2. **Let Copilot complete repetitive patterns** — if you write five similar test cases, start the sixth and Copilot will usually complete it correctly.

3. **Review before accepting** — read the suggestion before pressing Tab. For short suggestions (one line), a quick read is enough. For longer suggestions (an entire function body), read every line.

4. **Use `/explain` when reading unfamiliar code** — select a block, open Copilot Chat, type `/explain`. Use the explanation as a starting point, not as a guaranteed accurate description.

5. **Use `/tests` to generate a test scaffold** — then add your own assertions for edge cases and business-specific behavior.

---

## Safety Rules

- **Do not accept completions that include hardcoded values you did not write.** If Copilot suggests a function with a hardcoded URL, IP address, email address, or API key, review it carefully — those values may come from public code in Copilot's training set and may be wrong for your context.
- **Do not accept completions that make network calls or file operations you did not ask for.** If you asked Copilot to parse a string and it also opens a socket, that is unexpected behavior worth investigating.
- **Do not accept completions in security-critical code without careful manual review.** Auth checks, permission gates, input validation, and cryptography warrant extra scrutiny.
- **Run the tests.** A completion may look right but behave incorrectly on edge cases. Your test suite is the check.

---

## Cost

| Plan | Price | Who It Is For |
|---|---|---|
| Individual | $10/month | Individual developers |
| Business | $19/month per seat | Teams — adds organization-level policy controls |
| Enterprise | $39/month per seat | Large organizations — adds fine-tuning, IP indemnity |
| Free | $0 | Verified students and maintainers of popular open source projects |

Apply for the free plan at: https://education.github.com/pack (students) or through GitHub's open source program.

---

## Next Step

→ [docs/04-ai-workflows/PROMPT_STRATEGIES.md](docs/04-ai-workflows/PROMPT_STRATEGIES.md) — how to write effective AI prompts: patterns, anatomy of a good prompt, and what to never include
