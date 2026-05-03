# VS Code Setup

VS Code (Visual Studio Code) is a free, open-source code editor made by Microsoft. It is the most widely used editor in software development, works identically on Windows, Mac, and Linux, and has deep Git integration built in.

## Quick Path

1. Download VS Code from [code.visualstudio.com](https://code.visualstudio.com) and install it
2. Install these extensions (click the Extensions icon in the left sidebar, search each name):
   - **GitLens** — supercharged Git history and blame
   - **Prettier - Code formatter** — automatic code formatting
   - **ESLint** — JavaScript/TypeScript linting
   - **markdownlint** — Markdown style checking
3. Sign in with your GitHub account for settings sync: click the person icon at the bottom-left → "Turn on Settings Sync" → "Sign in with GitHub"
4. Open your project: **File → Open Folder** and select your project directory

---

## Full Explanation

### Essential Extensions

Extensions add language support, tools, and integrations. Install them via the Extensions panel (`Ctrl/Cmd+Shift+X`).

**GitLens**
GitLens overlays Git history information directly in the editor. Hover over any line of code and see who last changed it, when, and in what commit. Navigate through a file's full history. Compare branches. Far more powerful than the built-in Git blame.

```
Extension ID: eamodio.gitlens
```

**Prettier - Code formatter**
Prettier automatically reformats your code to a consistent style when you save. It handles JavaScript, TypeScript, CSS, HTML, JSON, Markdown, and more. Eliminate "style debates" in code review — just let Prettier decide.

```
Extension ID: esbenp.prettier-vscode
```

**ESLint**
ESLint analyzes your JavaScript and TypeScript code for errors and style violations as you type, highlighting problems with red or yellow underlines before you ever run the code.

```
Extension ID: dbaeumer.vscode-eslint
```

**markdownlint**
Enforces consistent Markdown style — heading hierarchy, blank lines, code block formatting. Essential for documentation-heavy projects.

```
Extension ID: DavidAnson.vscode-markdownlint
```

**GitHub Copilot** (optional, requires subscription)
AI pair programmer that suggests code completions as you type. Useful for boilerplate, tests, and unfamiliar APIs.

```
Extension ID: GitHub.copilot
```

### The Source Control Panel

VS Code has Git built in. You do not need to type `git add`, `git commit`, or `git push` in the terminal — the Source Control panel handles it.

**Open it:** `Ctrl/Cmd+Shift+G` or click the branching icon in the left sidebar.

**Workflow in the panel:**
1. Changed files appear under "Changes"
2. Click the `+` next to a file to stage it (equivalent to `git add filename`)
3. Type a commit message in the input box at the top
4. Click the checkmark icon or press `Ctrl/Cmd+Enter` to commit
5. Click the `...` menu → "Push" to push to GitHub

**Viewing diffs:** Click any changed file in the Source Control panel to see a side-by-side diff of what changed.

**Resolving conflicts:** When a merge conflict occurs, VS Code highlights conflict markers and shows "Accept Current Change / Accept Incoming Change / Accept Both Changes / Compare Changes" buttons directly in the editor.

### The Integrated Terminal

VS Code has a built-in terminal. Open it with:

```
Ctrl+`  (backtick)        Windows/Linux
Cmd+`   (backtick)        Mac
```

Or: **View → Terminal** from the menu.

You can have multiple terminal tabs. Open a new one with the `+` icon in the terminal panel. Each runs independently.

**Change the default shell:**
1. Press `Ctrl/Cmd+Shift+P`
2. Type "Terminal: Select Default Profile"
3. Choose your preferred shell (Git Bash on Windows, zsh or bash on Mac)

### Settings Sync

VS Code can sync your extensions, settings, keybindings, and snippets across machines via your GitHub account.

To enable:
1. Click the person icon at the bottom-left of the VS Code window
2. Click "Turn on Settings Sync..."
3. Select what to sync (check all)
4. Click "Sign in & Turn on" → choose "Sign in with GitHub"
5. Authorize in the browser

After that, any new VS Code installation you sign into will automatically receive your extensions and settings.

### Key Keyboard Shortcuts

Learn these — they pay off immediately.

| Shortcut (Win/Linux) | Shortcut (Mac) | Action |
|---|---|---|
| `Ctrl+Shift+P` | `Cmd+Shift+P` | Command Palette — search for any command |
| `Ctrl+`` ` `` ` | `Cmd+`` ` `` ` | Open / close integrated terminal |
| `Ctrl+Shift+G` | `Cmd+Shift+G` | Source Control panel |
| `F12` | `F12` | Go to definition |
| `Alt+F12` | `Option+F12` | Peek definition (inline, without navigating away) |
| `Ctrl+Shift+F` | `Cmd+Shift+F` | Search across all files in the project |
| `Ctrl+P` | `Cmd+P` | Quick open a file by name |
| `Ctrl+B` | `Cmd+B` | Toggle the sidebar |
| `Ctrl+/` | `Cmd+/` | Toggle line comment |
| `Alt+Up/Down` | `Option+Up/Down` | Move a line up or down |
| `Ctrl+D` | `Cmd+D` | Select next occurrence of current word |
| `Ctrl+Shift+L` | `Cmd+Shift+L` | Select all occurrences of current word |
| `F2` | `F2` | Rename symbol (renames everywhere in the project) |

### .vscode/settings.json

You can put project-specific VS Code settings in a `.vscode/settings.json` file at the root of your repository. This file is committed to Git and applies to everyone who opens the project in VS Code.

Common useful settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "[markdown]": {
    "editor.defaultFormatter": "DavidAnson.vscode-markdownlint",
    "editor.wordWrap": "on"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.tabSize": 4
  }
}
```

What these do:
- `formatOnSave`: runs Prettier automatically every time you save a file
- `defaultFormatter`: specifies Prettier as the formatter (required when multiple formatters are installed)
- `tabSize` / `insertSpaces`: 2-space indentation with spaces, not tabs
- `trimTrailingWhitespace`: removes trailing spaces on save
- `insertFinalNewline`: ensures every file ends with a newline (Unix convention)

The `[markdown]` and `[python]` blocks override settings for specific file types.

### .vscode/extensions.json

This file tells VS Code which extensions are recommended for the project. When a new team member opens the project, VS Code prompts them to install the recommended extensions.

```json
{
  "recommendations": [
    "eamodio.gitlens",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "DavidAnson.vscode-markdownlint"
  ]
}
```

Create this file at `.vscode/extensions.json` in your project root and commit it. Team members who open the project see a notification: "This workspace has extension recommendations. Would you like to install them?"

---

## What to Read Next

- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — authenticate with GitHub
- `docs/02-dev-environment/GIT_CLI_SETUP.md` — the full Git command reference
- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — make your first commit
