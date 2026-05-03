# Mac Developer Environment Setup

Setting up a developer environment on macOS takes about 20–40 minutes. Macs have a significant advantage: the terminal is a full Unix shell, so most developer tools work out of the box or install cleanly.

## Quick Path

```bash
# 1. Open Terminal (press Cmd+Space, type "Terminal", press Enter)

# 2. Install Homebrew (the standard Mac package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Follow the prompts — it will ask for your Mac password

# 3. Install Git via Homebrew
brew install git

# 4. Verify Git installed correctly
git --version
# git version 2.44.0

# 5. Download VS Code from code.visualstudio.com and drag it to Applications
# Then install the shell command so you can open VS Code from the terminal:
# In VS Code: Cmd+Shift+P → "Shell Command: Install 'code' command in PATH"

# 6. Configure Git with your identity
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

7. Next: `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — set up SSH (Secure Shell) keys to authenticate with GitHub

---

## Full Explanation

### Homebrew: The Mac Package Manager

Homebrew is the most widely used package manager for macOS. A package manager is a command-line tool that installs, updates, and removes software — the equivalent of an app store for developer tools.

Without Homebrew, installing developer tools means visiting websites, downloading `.dmg` files, running installers, and manually keeping everything updated. With Homebrew:

```bash
brew install git        # install
brew upgrade git        # update to latest
brew uninstall git      # remove
brew list               # see what's installed
brew update             # refresh Homebrew's catalog
brew upgrade            # update everything
```

Everything Homebrew installs goes into `/opt/homebrew/` (Apple Silicon) or `/usr/local/` (Intel), which avoids conflicts with macOS system files.

**Install Homebrew:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

This command downloads and runs the official Homebrew install script. The script:
1. Installs Xcode Command Line Tools if missing (see below)
2. Creates the Homebrew directory
3. Downloads Homebrew
4. Adds Homebrew to your PATH (shell search path)

On Apple Silicon Macs, the installer will print instructions to add Homebrew to your PATH. Run those commands exactly — they look like:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Xcode Command Line Tools

The Xcode Command Line Tools are a package of developer utilities Apple provides — compilers, build tools, `make`, `git`, `ssh`, and others. Many tools require them.

Homebrew installs them automatically. If you ever need to install them manually:

```bash
xcode-select --install
```

A dialog box appears asking you to install. Click Install. This takes a few minutes.

You do not need the full Xcode application (which is 15 GB+) unless you're developing iOS or macOS apps.

### zsh vs bash

Since macOS Catalina (10.15, released 2019), the default shell is **zsh** (Z Shell). Before that, it was **bash** (Bourne Again Shell). Both are shells — programs that interpret your terminal commands — but they have different configuration files and some syntax differences.

**How to check your shell:**
```bash
echo $SHELL
# /bin/zsh
```

**Configuration files:**
- zsh reads `~/.zshrc` on every new terminal session
- bash reads `~/.bashrc` (or `~/.bash_profile` on Mac)

When you add something to your PATH, set an environment variable, or define an alias, you add it to the right config file:

```bash
# For zsh (default on modern Mac):
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc   # apply changes to current session

# For bash (older Mac or if you switched back):
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Apple Silicon (M1/M2/M3/M4) vs Intel

Apple Silicon Macs (any Mac from late 2020 onward with "M1", "M2", "M3", or "M4" in the name) use ARM-based processors instead of Intel x86. Most developer tools now have native Apple Silicon builds and work correctly without any special handling.

**Check your chip:**
```bash
uname -m
# arm64    (Apple Silicon)
# x86_64   (Intel)
```

**Homebrew path difference:**
- Apple Silicon: `/opt/homebrew/`
- Intel: `/usr/local/`

The Homebrew install script handles this automatically. If you're running an Intel binary on Apple Silicon via Rosetta 2 (Apple's compatibility layer), you may occasionally see warnings about architecture mismatches, but most tools run fine.

### VS Code Setup on Mac

After dragging VS Code to `/Applications`, install the shell command so you can open projects from the terminal:

1. Open VS Code
2. Press `Cmd+Shift+P`
3. Type "shell command"
4. Click "Shell Command: Install 'code' command in PATH"

Now from any terminal:
```bash
code .                        # open current folder in VS Code
code /path/to/project        # open a specific folder
code src/auth.js             # open a specific file
```

### iTerm2 (Optional Terminal Upgrade)

iTerm2 is a terminal emulator that replaces the built-in Terminal app. It is popular among Mac developers for features the built-in terminal lacks:

- Split panes (multiple terminals in one window)
- Better search
- Mouse support
- Configurable color schemes
- Shell integration (shows exit codes, marks command output)

Download from [iterm2.com](https://iterm2.com). Installation is a standard macOS drag-to-Applications install.

### Common Mac Gotchas

**Permission issues in /usr/local**

Older Macs or incorrectly configured systems sometimes have permission problems with `/usr/local`. Homebrew should handle this, but if you see "Permission denied" errors:

```bash
sudo chown -R $(whoami) /usr/local/lib /usr/local/sbin
```

**Gatekeeper blocking apps**

macOS Gatekeeper blocks applications from unidentified developers. If you download a tool and it says "cannot be opened because it is from an unidentified developer":

1. Open System Settings → Privacy & Security
2. Scroll down and find the blocked app
3. Click "Open Anyway"

Alternatively, right-click (or Control+click) the app and choose Open — this bypasses Gatekeeper for that specific launch.

**System Python vs your Python**

macOS ships with a system Python at `/usr/bin/python3`. Do not use it for development — install Python via Homebrew or `pyenv` to avoid conflicts with system tools:

```bash
brew install python@3.12
# or, for managing multiple Python versions:
brew install pyenv
```

**Git version**

macOS ships with an old version of Git. Even if `git --version` works before you install anything, install a fresh one via Homebrew:

```bash
brew install git
# Ensure Homebrew's git takes priority over the system git
which git
# /opt/homebrew/bin/git   (correct — Homebrew version)
# /usr/bin/git            (system version — means Homebrew isn't first in PATH)
```

---

## What to Read Next

- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — set up SSH keys for GitHub authentication
- `docs/02-dev-environment/VS_CODE_SETUP.md` — recommended extensions and settings
- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — make your first commit

---

## Next Step

→ [docs/02-dev-environment/VS_CODE_SETUP.md](docs/02-dev-environment/VS_CODE_SETUP.md) — install essential extensions and configure VS Code for development
