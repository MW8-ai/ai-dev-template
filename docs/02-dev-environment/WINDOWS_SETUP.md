# Windows Developer Environment Setup

Setting up a developer environment on Windows takes about 30–60 minutes the first time. This guide gets you from a fresh Windows machine to a working Git and coding setup.

## Quick Path

1. Download Git for Windows from [git-scm.com/download/win](https://git-scm.com/download/win) and run the installer. Accept the defaults — the only choice that matters is selecting **"Git Bash Here"** context menu option (it's checked by default).

2. Download VS Code (Visual Studio Code) from [code.visualstudio.com](https://code.visualstudio.com) and install it. Accept all defaults.

3. Download Node.js LTS (Long Term Support) from [nodejs.org](https://nodejs.org) — click the **LTS** button (not "Current"). Install with defaults.

4. Open **Git Bash** (search "Git Bash" in the Start menu) and verify:
   ```bash
   git --version
   # git version 2.44.0.windows.1
   node --version
   # v20.11.0
   ```

5. Configure Git with your identity:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```

6. Next: `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — set up SSH keys to authenticate with GitHub

---

## Full Explanation

### Git for Windows

Git was built for Linux. Git for Windows is a port that adds two important things:

**Git Bash:** A terminal emulator that runs a minimal Linux-like shell (based on MinGW/MSYS2) on Windows. This means the same `bash` commands you see in every Git tutorial — `ls`, `cat`, `ssh-keygen` — work exactly the same on Windows when you use Git Bash instead of Command Prompt (cmd.exe) or PowerShell.

**Git GUI:** A basic graphical interface for Git. You'll probably prefer VS Code's built-in Git panel or the terminal, but it's there.

**Installation choices that matter:**
- **Default editor:** Change from Vim to "Use Visual Studio Code as Git's default editor" if you aren't comfortable with Vim
- **Line endings:** Choose "Checkout Windows-style, commit Unix-style line endings" (the default) — this is important; see Line Endings below
- **Terminal emulator:** Choose "Use MinTTY" — it's a better terminal than the Windows default console

After installation, right-clicking in any folder shows **"Git Bash Here"** — this opens Git Bash already navigated to that folder, which is very convenient.

### VS Code (Visual Studio Code)

VS Code is a free, open-source code editor made by Microsoft. Despite being a Microsoft product, it runs identically on Windows, Mac, and Linux, which means tutorials and team setups are portable.

Why VS Code over alternatives:
- Built-in Git integration (stage, commit, push without typing commands)
- Extension marketplace with hundreds of thousands of extensions
- Integrated terminal — you can run Git Bash commands without leaving the editor
- Free, actively maintained, industry standard

See `docs/02-dev-environment/VS_CODE_SETUP.md` for extensions and configuration.

**Set Git Bash as VS Code's default terminal:**
1. Open VS Code
2. Press `Ctrl+Shift+P` to open the Command Palette
3. Type "Terminal: Select Default Profile"
4. Choose "Git Bash"

Now `Ctrl+`` ` `` opens Git Bash inside VS Code.

### Node.js

Node.js is a JavaScript runtime — it lets you run JavaScript outside of a browser. You need it if you're working on any JavaScript or TypeScript project. Many command-line developer tools (like `npm` and `npx`) also run on Node.js even if your project isn't JavaScript.

Install the **LTS** version, not the "Current" version. LTS (Long Term Support) versions are stable and receive security patches for 3+ years. "Current" is the newest features but may have rough edges.

After installation, both `node` and `npm` are available in Git Bash:
```bash
node --version   # v20.11.0
npm --version    # 10.2.4
```

### Windows Terminal

Windows Terminal is Microsoft's modern terminal application — a significant upgrade over the ancient `cmd.exe`. Install it from the Microsoft Store (search "Windows Terminal") or from [github.com/microsoft/terminal](https://github.com/microsoft/terminal).

With Windows Terminal, you can have multiple tabs, each running a different shell (Git Bash, PowerShell, WSL, etc.) in the same window. Configure it to open Git Bash by default:

1. Open Windows Terminal Settings (`Ctrl+,`)
2. Under "Startup", set Default profile to "Git Bash"

### WSL2 (Windows Subsystem for Linux)

WSL2 (Windows Subsystem for Linux version 2) runs a real Linux kernel inside Windows. With WSL2 you can install Ubuntu (or another Linux distribution) and work in a full Linux environment without a virtual machine or dual-boot.

**When to use WSL2:**
- Your project requires Linux-specific tools that don't work on Windows
- You need to closely match a Linux production server environment
- You're working with Docker containers (Docker Desktop integrates with WSL2)

**How to enable WSL2:**

Open PowerShell as Administrator and run:
```powershell
wsl --install
```

This installs WSL2 and Ubuntu by default. Restart your computer when prompted. After restart, Ubuntu sets up and asks for a username and password. Then:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git -y
git --version
```

VS Code integrates with WSL2 via the **WSL** extension: open VS Code from inside WSL with `code .` and it connects automatically.

### Your Git Config File

Git's global settings live at `C:\Users\YourName\.gitconfig`. You can open it directly:

```bash
# From Git Bash
cat ~/.gitconfig
# [user]
#     name = Your Name
#     email = you@example.com
```

You can also edit it directly:
```bash
notepad ~/.gitconfig
# or, if VS Code is set as Git's editor:
git config --global --edit
```

### Common Windows Gotchas

**Line endings (CRLF vs LF)**

Windows ends lines with `\r\n` (CRLF — Carriage Return + Line Feed). Mac and Linux use `\n` (LF — Line Feed). This causes files edited on Windows to appear as entirely changed when viewed in Git diffs on Linux.

The Git for Windows default setting "Checkout Windows-style, commit Unix-style" handles this automatically: Git converts to LF when you commit, and to CRLF when you checkout. This is the right setting for most projects.

For projects with a `.gitattributes` file in the repo root, that file overrides your local setting and enforces consistent line endings for everyone.

**File paths with spaces**

Git Bash handles spaces fine if you quote paths:
```bash
cd "My Projects/my-repo"
git add "src/my component.js"
```

But some older tools break on spaces. Prefer paths without spaces for project folders: `C:\dev\my-project` rather than `C:\Users\Your Name\Documents\My Projects\my-project`.

**Case sensitivity**

Windows file paths are case-insensitive. Linux (and GitHub's servers) are case-sensitive. A file named `readme.md` and `README.md` are the same on Windows but different files on Linux. This can cause confusing issues if you rename a file only by changing case. Fix:

```bash
# Rename with git mv to force Git to notice the case change
git mv readme.md README.md
git commit -m "Fix README filename capitalization"
```

---

## What to Read Next

- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — set up SSH keys for GitHub authentication
- `docs/02-dev-environment/VS_CODE_SETUP.md` — recommended extensions and settings
- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — make your first commit
