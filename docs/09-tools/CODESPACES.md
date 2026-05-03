# GitHub Codespaces

GitHub Codespaces is a cloud-hosted development environment. It runs VS Code in the browser (or connects to your local VS Code or JetBrains IDE), with your code cloned inside a Linux container on GitHub's infrastructure.

You can be writing and running code on any machine — a Chromebook, an iPad, a borrowed laptop — within 30–60 seconds of opening a repo.

---

## Architecture

When you create a Codespace:

1. GitHub provisions a VM (Virtual Machine) on GitHub's infrastructure (Azure)
2. Your repository is cloned into `/workspaces/[repo-name]`
3. A Docker container is started using the image defined in your `devcontainer.json` (or a default Ubuntu image if none is configured)
4. VS Code in the browser connects to that container
5. Port forwarding makes any service running in the container accessible in your browser

The container is fully Linux. You have a terminal, can install packages, run servers, and connect to databases exactly as you would locally. The difference is the machine is in the cloud.

---

## devcontainer.json

The `devcontainer.json` file controls everything about your Codespace environment. Place it at:
- `.devcontainer/devcontainer.json` (preferred), or
- `.devcontainer.json` at the repo root

If this file does not exist, Codespaces uses a generic Ubuntu image with common tools. For a reproducible environment shared across the team, always create this file.

### Full Example

```json
{
  "name": "My Project Dev Environment",

  "image": "mcr.microsoft.com/devcontainers/python:3.12",

  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "20" },
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },

  "customizations": {
    "vscode": {
      "extensions": [
        "eamodio.gitlens",
        "esbenp.prettier-vscode",
        "charliermarsh.ruff",
        "github.copilot"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "python.defaultInterpreterPath": "/usr/local/bin/python"
      }
    }
  },

  "postCreateCommand": "pip install -r requirements.txt && pre-commit install",

  "forwardPorts": [8000, 5432, 6379],

  "portsAttributes": {
    "8000": {
      "label": "App server",
      "onAutoForward": "openBrowser"
    },
    "5432": {
      "label": "PostgreSQL"
    }
  },

  "remoteEnv": {
    "DATABASE_URL": "${localEnv:DATABASE_URL}"
  },

  "secrets": ["OPENAI_API_KEY", "DATABASE_URL"]
}
```

### Key Fields Explained

**`image`:** The Docker image to use as the base. The `mcr.microsoft.com/devcontainers/` images are maintained by Microsoft and include common dev tools. Available images: python, node, go, rust, java, dotnet, ruby, php, universal (all of the above).

**`features`:** Add capabilities to the image without writing a custom Dockerfile. Features are modular, composable packages: add Node.js to a Python image, add Docker-in-Docker for container builds, add the AWS CLI, etc. Browse at containers.dev/features.

**`customizations.vscode.extensions`:** VS Code extensions to install automatically when the Codespace starts. Every developer on the team gets the same extensions.

**`postCreateCommand`:** Runs once after the container is created. Use it to install dependencies (`npm install`, `pip install -r requirements.txt`), set up pre-commit hooks, or run any first-run setup.

**`forwardPorts`:** Ports inside the container that should be accessible from the browser. When your app server runs on port 8000, Codespaces creates a URL like `https://[name]-8000.app.github.dev` that you can open in a tab.

**`secrets`:** GitHub repository secrets that should be injected as environment variables into the Codespace. The developer must have access to these secrets in their GitHub account or organization. This keeps credentials out of the `devcontainer.json` file itself.

---

## Costs

Codespaces is billed by compute time (hours used) and storage.

| Resource | Free Tier (personal accounts) | Paid |
|---|---|---|
| 2-core compute | 120 core-hours/month | ~$0.18/hour |
| 4-core compute | 60 hours/month (120 core-hours / 2) | ~$0.36/hour |
| 8-core compute | 30 hours/month | ~$0.72/hour |
| Storage | 15 GB/month | ~$0.07/GB-month |

**Practical note:** 120 core-hours on a 2-core machine = 60 hours of actual time per month. That is roughly 3 hours per workday, which is enough for light use but not for full-time development.

**Control costs:**
- Idle Codespaces auto-suspend after 30 minutes (configurable: 5, 30, 60, or 240 minutes)
- Suspended Codespaces still consume storage. Delete Codespaces you are done with.
- Set a spending limit in your GitHub billing settings to prevent unexpected charges.

---

## Prebuilds

Prebuilds pre-run the `postCreateCommand` and cache the result so new Codespaces start in seconds instead of minutes.

**Setup:** Settings → Codespaces → Prebuild configuration → add a prebuild trigger (e.g., on every push to main).

**When to use:** If `postCreateCommand` takes more than 60 seconds (installing many dependencies, compiling code), prebuilds are worth setting up. Without prebuilds, every new Codespace waits for that setup.

Prebuilds consume Actions minutes to build and storage to store. The savings in developer time usually outweigh the cost for active teams.

---

## Use Cases

**Onboarding new developers:** A new team member opens a Codespace instead of following a 30-step local setup guide. The environment is ready in under a minute. They are writing code the same day they join.

**Working from any machine:** Emergency fix from a machine that does not have the dev environment set up. Open the repo, create a Codespace, fix the bug, push. No local state needed.

**Contributing to open source:** Fork a repo, create a Codespace in the fork. Run the tests, make the change, open a PR. No risk of polluting your local environment.

**Reviewing PRs in a live environment:** Instead of checking out a PR branch locally, create a Codespace from the PR branch. Run the code and actually test the change, not just read the diff.

**Isolated experiments:** Want to try an approach without affecting your local setup? Create a Codespace, experiment, and delete it when done.

---

## Limitations

- **Internet required.** Codespaces runs in the cloud. Without internet access, you cannot use it.
- **Idle timeout.** Codespaces suspend after the configured idle time (default: 30 minutes). Long-running processes will be interrupted. If you need a persistent background process, keep the Codespace awake or use a separate cloud service.
- **Latency.** The round-trip to GitHub's servers adds latency compared to local development. For keystroke-sensitive work (live coding demos, latency-sensitive performance testing), local development is faster.
- **Storage limit.** The free tier includes 15 GB. Large repositories with node_modules, virtual environments, or build artifacts can fill this quickly.
- **One active Codespace per repo (standard tier).** You can have multiple Codespaces across repos, but heavy use requires a paid plan.

---

## Connecting Local VS Code to a Codespace

You do not have to use the browser. Connect your local VS Code to a Codespace:

1. Install the GitHub Codespaces extension in local VS Code
2. Cmd+Shift+P → "Codespaces: Connect to Codespace"
3. Select your Codespace

Now you get local VS Code performance with remote compute. Useful when you want your local extensions, keybindings, and themes but want the Codespace environment.

The same connection works for JetBrains IDEs (IntelliJ, PyCharm, etc.) via the JetBrains Gateway app.

---

## Related Documents

- [VSCODE.md](./VSCODE.md) — VS Code features, extensions, and settings
- [GITHUB.md](./GITHUB.md) — GitHub platform overview, including Codespaces from the GitHub side
- [ANTHROPIC.md](./ANTHROPIC.md) — Claude Code can also run inside a Codespace
