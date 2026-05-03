# GitHub Codespaces Setup

GitHub Codespaces is a full development environment running in the cloud. You get VS Code (Visual Studio Code), a terminal, and all your project's dependencies — in a browser tab, on any machine, with no local installation.

## Quick Path

1. Go to your repository on GitHub.com
2. Click the green **Code** button
3. Click the **Codespaces** tab
4. Click **Create codespace on main**
5. Wait 30–60 seconds for the environment to start
6. VS Code opens in your browser — the terminal is ready

```bash
# You're now inside the Codespace. Try:
git status
node --version
# Your project is already cloned and ready to work on
```

---

## Full Explanation

### What GitHub Codespaces Is

A Codespace is a Linux-based virtual machine (VM) running in Microsoft Azure's cloud infrastructure. GitHub configures it, connects a VS Code interface to it (either in your browser or via VS Code Desktop), and mounts your repository into it.

From your perspective: it looks and feels exactly like VS Code on your laptop, but it is running on a server somewhere in a data center. Your code, terminal, and any running servers live on that VM.

### When to Use Codespaces

**New machine or no machine:** If you're on a borrowed computer, a tablet with a keyboard, or someone else's machine and need to contribute to a project — open a Codespace. No installation. No configuration. Done in under a minute.

**Quick contributions to open source:** Fork a repo, open a Codespace, make your change, push, open a PR. You never install anything locally.

**Teaching and onboarding:** Share a link to a Codespace configuration and every student/new hire gets an identical, working environment without spending half a day on setup troubleshooting.

**Windows users who need Linux:** If your project requires Linux-specific tooling, Codespaces gives you a Linux environment without WSL2 setup.

**Isolation:** If you want to test something without affecting your local setup, run it in a Codespace.

### How Billing Works

**GitHub personal accounts:** 60 hours of free Codespace usage per month, plus 15 GB of free storage. A 2-core machine running for 60 hours costs 60 hours * 0.18 USD/hour = about $10.80 if you go over the free tier.

**GitHub Team/Enterprise:** Organizations pay per usage. Talk to your admin about whether Codespaces is enabled and what your budget is.

**Stop vs. delete:**
- **Stopping** a Codespace (closing the browser tab or clicking "Stop codespace") pauses the VM. Storage is still used, but compute charges stop.
- **Deleting** a Codespace removes it entirely — all unsaved work is lost. Committed and pushed work is safe in GitHub.
- Codespaces automatically stop after 30 minutes of inactivity by default (configurable).

Manage your Codespaces at [github.com/codespaces](https://github.com/codespaces).

### Customizing the Environment: devcontainer.json

By default, a Codespace uses a generic Linux environment with common tools. You can define exactly what tools, extensions, and startup commands your team's Codespace should have by adding a `.devcontainer/devcontainer.json` file to your repository.

When someone creates a Codespace for your repo, GitHub reads this file and builds the environment from it.

**Example `.devcontainer/devcontainer.json`:**

```json
{
  "name": "My Project",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",

  "features": {
    "ghcr.io/devcontainers/features/git:1": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "eamodio.gitlens",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
    }
  },

  "postCreateCommand": "npm install",

  "forwardPorts": [3000],
  "portsAttributes": {
    "3000": {
      "label": "App server",
      "onAutoForward": "notify"
    }
  }
}
```

What each section does:
- `image`: the base Docker image. `javascript-node:20` gives you Node.js 20 on Debian. Browse images at [mcr.microsoft.com/devcontainers](https://mcr.microsoft.com/devcontainers)
- `features`: optional add-ons to layer on top of the image
- `customizations.vscode.extensions`: these extensions are installed automatically in every Codespace
- `postCreateCommand`: runs once after the Codespace is built — typically to install dependencies
- `forwardPorts`: ports to forward from the VM to your browser (see Port Forwarding below)

Commit `.devcontainer/devcontainer.json` to your repository and everyone who opens a Codespace gets the same environment.

### Port Forwarding

When a web server runs inside your Codespace (on port 3000, for example), it is running on a VM — not your local machine. Port forwarding creates a secure HTTPS URL that tunnels traffic from your browser to that port.

**How it works:**
1. Start your dev server inside the Codespace terminal:
   ```bash
   npm run dev
   # Server running on http://localhost:3000
   ```
2. VS Code detects that port 3000 is in use and shows a notification: "Your app is running on port 3000."
3. Click "Open in Browser" — a URL like `https://your-codespace-name-3000.preview.app.github.dev` opens your running app.
4. The URL is private by default (only you can access it). You can make it public temporarily via the Ports panel (right-click the port → "Port Visibility" → "Public").

The Ports panel is in the bottom bar of VS Code — click the "Ports" tab to see all forwarded ports, their public/private status, and open links.

### Limitations

**Requires internet:** A Codespace is a remote VM. If your connection is slow or unreliable, the experience degrades. Local development is better for low-connectivity situations.

**Slower for large builds:** Compilation-heavy projects (large C++ codebases, full Gradle/Maven builds) may be slower than a high-end local machine. The free tier uses 2-core VMs; you can upgrade to 4-, 8-, or 32-core machines in the Codespace configuration.

**Storage is not permanent:** If you delete a Codespace, uncommitted changes are gone. Commit and push frequently. Codespaces are ephemeral by design.

**Custom hardware:** If your workflow requires a GPU, a specific peripheral, or a physical device (Bluetooth, USB), a Codespace cannot provide that.

### Pre-built Codespaces

By default, a Codespace is built fresh each time from the `devcontainer.json` configuration. For a complex environment, this can take 5–10 minutes.

Pre-builds cache the built environment so new Codespaces start in seconds.

**To set up pre-builds:**
1. Go to your repository → **Settings** → **Codespaces**
2. Under "Codespace pre-builds," click **Set up prebuild**
3. Choose the branch and region
4. Save — GitHub Actions runs to build and cache the environment

Pre-builds consume GitHub Actions minutes. Check your usage under **Settings → Billing**.

---

## What to Read Next

- `docs/02-dev-environment/VS_CODE_SETUP.md` — extensions and settings that apply inside Codespaces too
- `docs/02-dev-environment/SSH_KEYS_AND_AUTH.md` — Codespaces handles GitHub auth automatically, but you may need SSH keys for other services
- `docs/01-getting-started/FIRST_COMMIT_PUSH.md` — commit and push from inside a Codespace

---

## Next Step

→ [docs/03-development-workflow/ISSUE_TO_BRANCH_TO_PR.md](docs/03-development-workflow/ISSUE_TO_BRANCH_TO_PR.md) — walk through the full development workflow from opening an issue to merging a PR
