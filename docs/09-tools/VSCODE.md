# VS Code

VS Code (Visual Studio Code) is a free, open-source code editor built by Microsoft. It is the most widely used development editor as of 2025, across nearly every language and platform. It is what GitHub.dev and GitHub Codespaces run in the browser.

---

## Why VS Code

- Free and open source (MIT license)
- Runs on Windows, macOS, and Linux
- Massive extension ecosystem: almost any tool, language, or service has an extension
- Built-in git integration
- Remote development: SSH, containers, and cloud via extensions
- Active development: monthly release cycle

---

## Essential Extensions for This Workflow

Install extensions from the Extensions panel (Cmd+Shift+X or Ctrl+Shift+X) or from the command line:

```bash
code --install-extension [extension-id]
```

### GitLens (`eamodio.gitlens`)

Enhances VS Code's built-in git support. Shows inline blame annotations (who changed this line and when), file history, commit comparison, and detailed repository exploration. Essential for understanding why code is the way it is.

Key features:

- Inline blame: hover over any line to see the commit that last changed it
- File history: see every change to a file over time
- Branch comparison: see what changed between two branches

### GitHub Copilot (`github.copilot`) and GitHub Copilot Chat (`github.copilot-chat`)

AI code completion and chat powered by OpenAI Codex. Copilot suggests code as you type. Copilot Chat answers questions about your code, explains functions, suggests fixes, and generates tests.

Requires a GitHub Copilot subscription (free for students and open source maintainers, $10/month otherwise).

### Prettier (`esbenp.prettier-vscode`)

Auto-formatter for JavaScript, TypeScript, JSON, YAML, Markdown, CSS, and more. Run on save (see Settings.json below) to keep formatting consistent across the team without arguments about style.

Configure with a `.prettierrc` file in the repo root to share settings across the team.

### ESLint (`dbaeumer.vscode-eslint`)

JavaScript and TypeScript linter. Catches errors and style issues as you type. Configure with `.eslintrc.json` or `eslint.config.js` in the repo root.

### Pylint or Ruff for Python

- **Pylint** (`ms-python.pylint`): classic Python linter
- **Ruff** (`charliermarsh.ruff`): faster, modern Python linter that also formats code. Recommended for new projects.

### markdownlint (`davidanson.vscode-markdownlint`)

Enforces Markdown formatting rules. Catches inconsistent heading levels, missing blank lines, and other issues that break Markdown rendering on GitHub.

### GitHub Actions (`github.vscode-github-actions`)

View the status of GitHub Actions workflows in the editor. See which checks passed or failed on the current commit without leaving VS Code.

### Remote – SSH (`ms-vscode-remote.remote-ssh`)

Connect VS Code to a remote server over SSH. Your local editor talks to a remote filesystem and terminal. Useful for developing on a remote Linux server without a slow file sync.

Usage: Cmd+Shift+P → "Remote-SSH: Connect to Host" → enter `user@hostname`.

### Dev Containers (`ms-vscode-remote.remote-containers`)

Run your full development environment inside a Docker container. Defined by a `.devcontainer/devcontainer.json` file in the repo. The same config powers GitHub Codespaces.

Benefit: every developer on the team has an identical environment. "Works on my machine" problems disappear.

---

## Keyboard Shortcuts That Save Time

| Shortcut (Mac) | Shortcut (Windows/Linux) | Action |
|---|---|---|
| Cmd+Shift+P | Ctrl+Shift+P | Command Palette — find any command |
| Cmd+P | Ctrl+P | Go to file by name |
| Cmd+Shift+F | Ctrl+Shift+F | Search across all files |
| Cmd+H | Ctrl+H | Find and replace in current file |
| Cmd+Shift+H | Ctrl+Shift+H | Find and replace across all files |
| Alt+Click | Alt+Click | Place multiple cursors |
| Cmd+D | Ctrl+D | Select next occurrence of current selection (adds cursor) |
| Cmd+Shift+L | Ctrl+Shift+L | Select all occurrences of current selection |
| Cmd+/ | Ctrl+/ | Toggle line comment |
| Option+Up/Down | Alt+Up/Down | Move line up or down |
| Cmd+K Z | Ctrl+K Z | Zen Mode — fullscreen, no UI distractions |
| Cmd+B | Ctrl+B | Toggle sidebar |
| F12 | F12 | Go to definition |
| Shift+F12 | Shift+F12 | Find all references |
| F2 | F2 | Rename symbol across files |

---

## Settings.json

VS Code settings live in `settings.json`. Open it with Cmd+Shift+P → "Preferences: Open User Settings (JSON)".

**Recommended settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.rulers": [80, 120],
  "editor.trimAutoWhitespace": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.tabSize": 2,
  "editor.detectIndentation": true,
  "editor.wordWrap": "off",
  "editor.minimap.enabled": false,
  "git.autofetch": true,
  "git.confirmSync": false,
  "terminal.integrated.scrollback": 10000
}
```

**Per-language settings:**

```json
{
  "[python]": {
    "editor.tabSize": 4,
    "editor.defaultFormatter": "charliermarsh.ruff"
  },
  "[markdown]": {
    "editor.wordWrap": "on"
  }
}
```

**Workspace settings:** Create a `.vscode/settings.json` file in the repo to share settings with the team. This overrides user settings for anyone who opens the repo. Use it to set the formatter, linter, and tab size for the project language.

---

## Workspaces

A VS Code workspace saves:

- Which folders are open
- Window layout
- Extension recommendations for the project
- Project-specific settings

**Create a workspace:** File → Save Workspace As → save as `project.code-workspace` in the repo root.

**Extension recommendations:** Add a `.vscode/extensions.json` file to recommend extensions to team members when they open the repo:

```json
{
  "recommendations": [
    "eamodio.gitlens",
    "esbenp.prettier-vscode",
    "github.copilot",
    "dbaeumer.vscode-eslint"
  ]
}
```

When a new developer opens the repo, VS Code shows a prompt: "This workspace has extension recommendations. Install all?" This solves the "everyone has different extensions" problem.

---

## Integrated Git

VS Code has a full git UI in the Source Control panel (Cmd+Shift+G or the branch icon in the sidebar).

What you can do without opening a terminal:

- See which files are changed
- Stage individual files or individual lines (click the line number gutter in the diff view)
- Write a commit message and commit
- Push and pull
- Switch branches
- View incoming and outgoing commits

GitLens extends this with the full commit history, file blame, and branch comparison.

**When to use the terminal instead:** rebasing, cherry-picking, resolving complex merge conflicts (though VS Code has a merge editor — press "Resolve in Merge Editor" when conflicts appear).

---

## Related Documents

- [CODESPACES.md](./CODESPACES.md) — VS Code in the browser, in a cloud environment
- [GITHUB.md](./GITHUB.md) — GitHub.dev (press `.` in any repo to open VS Code in the browser)
- [ANTHROPIC.md](./ANTHROPIC.md) — Claude Code, an alternative AI coding agent
