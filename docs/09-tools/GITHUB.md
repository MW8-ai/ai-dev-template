# GitHub

GitHub is where code lives, where teams collaborate, and where software ships. Most developers use only a fraction of what GitHub offers. This document covers the full surface area relevant to this workflow.

---

## Beyond Code Hosting

GitHub's core is a git repository host, but the platform extends well past that:

| Feature | What It Does |
|---|---|
| Issues | Bug reports, feature requests, tasks — linked to code and PRs |
| Projects | Kanban boards and table views built from issues and PRs |
| Actions | CI/CD (Continuous Integration / Continuous Deployment) automation |
| Packages | Container registry (ghcr.io) and npm/Maven/NuGet/RubyGems package registry |
| Releases | Versioned snapshots with release notes and attached binaries |
| Pages | Free static site hosting from a repository branch or folder |
| Codespaces | Cloud-hosted dev environments (see [CODESPACES.md](./CODESPACES.md)) |
| Copilot | AI code completion and chat in the editor (see [VSCODE.md](./VSCODE.md)) |
| Security | Dependabot alerts, secret scanning, code scanning (SAST — Static Application Security Testing) |

---

## Branch Protection Rules

Branch protection prevents accidental or unauthorized changes to important branches. Set these up before the first contributor joins.

**Where to configure:** Repository → Settings → Branches → Add rule

**Recommended settings for `main`:**

| Setting | Recommended Value | Why |
|---|---|---|
| Require a pull request before merging | On | No direct pushes to main |
| Required approvals | 1 (small teams) or 2 (larger teams) | Second set of eyes |
| Dismiss stale reviews when new commits are pushed | On | Prevents approving code then sneaking in changes |
| Require review from Code Owners | On (if CODEOWNERS file exists) | Ensures domain experts review relevant files |
| Require status checks to pass before merging | On | CI must pass |
| Require branches to be up to date before merging | On | Prevents "works on my branch" merges |
| Require signed commits | Optional (required for some government systems) | Cryptographic proof of authorship |
| Do not allow bypassing the above settings | On | Admins should follow the same rules |
| Restrict who can push to matching branches | Optional | Limit to a release team for `release/` branches |

**CODEOWNERS file:** Place at `.github/CODEOWNERS`. Maps file paths to required reviewers:
```
# Syntax: [path pattern] [GitHub username or team]
/docs/        @tech-writer-team
/src/auth/    @security-team
*.yml         @devops-team
```

---

## GitHub Actions (CI/CD)

GitHub Actions runs automated workflows in response to repository events. Use it for running tests, building containers, deploying applications, and enforcing code quality.

### How Workflows Work

Workflows are YAML files stored in `.github/workflows/`. Each file defines:
- **Triggers (`on`):** what event starts the workflow (push, pull_request, schedule, workflow_dispatch)
- **Jobs:** groups of steps that run together, optionally in parallel
- **Steps:** individual commands or actions that make up a job
- **Runners:** the machines that run the jobs (GitHub-hosted Ubuntu/Windows/macOS, or self-hosted)

### Reading a Workflow File

```yaml
name: CI                              # Display name in GitHub UI

on:                                   # Triggers
  push:
    branches: [main]                  # Runs on push to main
  pull_request:                       # Runs on any PR

jobs:
  test:                               # Job name
    runs-on: ubuntu-latest            # Runner image
    steps:
      - uses: actions/checkout@v4     # Check out the repo
      - uses: actions/setup-python@v5 # Set up Python
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt   # Shell command
      - run: pytest --tb=short                 # Run tests
```

### Useful Triggers

| Trigger | When It Fires |
|---|---|
| `push` | Any push to specified branches |
| `pull_request` | PR opened, synchronized, or reopened |
| `schedule` | Cron schedule (e.g., nightly dependency audit) |
| `workflow_dispatch` | Manual trigger from GitHub UI or CLI |
| `release` | When a GitHub Release is published |
| `repository_dispatch` | External webhook call |

### Marketplace Actions

The Actions Marketplace (github.com/marketplace/actions) has thousands of pre-built actions. Common ones:

| Action | What It Does |
|---|---|
| `actions/checkout` | Check out the repository |
| `actions/setup-node` / `setup-python` / `setup-go` | Install language runtimes |
| `actions/cache` | Cache dependencies between runs |
| `docker/build-push-action` | Build and push Docker images |
| `aws-actions/configure-aws-credentials` | Authenticate to AWS |
| `github/codeql-action` | Run CodeQL security analysis |

---

## GitHub Secrets

Secrets are encrypted values stored in GitHub and exposed to workflows as environment variables. Never put secrets directly in workflow YAML files.

**Where to add secrets:**
- Repository secrets: Settings → Secrets and variables → Actions → New repository secret
- Organization secrets: Available to multiple repos in an organization
- Environment secrets: Scoped to a specific deployment environment (e.g., production)

**Using secrets in a workflow:**
```yaml
steps:
  - run: aws s3 sync dist/ s3://my-bucket
    env:
      AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_REGION: us-east-1
```

**Rules:**
- Secrets are masked in logs: if the value appears in output, GitHub replaces it with `***`
- Secrets are not passed to workflows triggered by PRs from forks (security measure)
- Do not print secrets with `echo` — even masked, this is bad practice

---

## GitHub Pages

GitHub Pages hosts static sites directly from a repository for free.

**Setup:**
1. Repository → Settings → Pages
2. Source: choose a branch (usually `gh-pages`) and folder (`/` or `/docs`)
3. Your site is live at `https://[username].github.io/[repo]` within minutes

**Common uses:**
- Project documentation (using MkDocs, Docusaurus, or Jekyll)
- API documentation (Swagger UI pointing at your OpenAPI spec)
- Simple landing pages for open source projects

**Custom domains:** add a `CNAME` file to the repository root with your domain name, then configure the DNS record.

---

## GitHub Projects

Projects is GitHub's built-in project management. It links issues and PRs into boards and tables.

**Views:**
- **Board:** Kanban-style columns (To Do, In Progress, Done)
- **Table:** Spreadsheet-style view with custom fields
- **Roadmap:** Timeline view

**Automation:** Projects can automatically move cards when a PR is merged, an issue is closed, etc.

**Practical use:** Create a project per milestone or release. Add all issues for that milestone. During standup, anyone can see what is in progress and what is blocked.

---

## GitHub Releases

Releases are versioned snapshots of the repository, associated with a git tag.

**Creating a release:**
1. Go to Releases → Draft a new release
2. Choose a tag (create a new one, e.g., `v1.2.0`, or use an existing one)
3. Write release notes (use the "Generate release notes" button to auto-fill from merged PRs)
4. Attach binaries if applicable (compiled executables, zip archives)
5. Publish

**Convention:** Use semantic versioning — `v[MAJOR].[MINOR].[PATCH]`. See CHANGELOG.md for what drove each version.

**Automate:** Use the `softprops/action-gh-release` Action to create releases automatically when a tag is pushed.

---

## Tips and Shortcuts

**In the browser:**

| Shortcut | Action |
|---|---|
| `?` | Show all keyboard shortcuts for the current page |
| `t` | Open file finder in a repository |
| `l` | Jump to a line number in a file |
| `b` | Open blame view for the current file |
| `y` | Convert URL to permanent link (freezes the commit SHA) |

**GitHub.dev (VS Code in the browser):** Press `.` (period) on any repository or PR to open VS Code in the browser with the code loaded. No setup, no clone. Useful for quick edits, reading code, or reviewing a PR with editor features.

**GitHub CLI (`gh`):** The `gh` command gives you terminal access to everything GitHub. Install from cli.github.com.

```bash
# Common commands:
gh pr create                      # Create a PR from the current branch
gh pr checkout 42                 # Check out PR #42 locally
gh pr view 42 --web               # Open PR #42 in the browser
gh issue create                   # Create a new issue
gh issue list --assignee @me      # Issues assigned to you
gh run list                       # List recent workflow runs
gh run view --log                 # View logs for the latest run
gh secret set MY_SECRET           # Set a repository secret from the terminal
gh release create v1.2.0          # Create a release
```

---

## Related Documents

- [CODESPACES.md](./CODESPACES.md) — cloud dev environments hosted on GitHub
- [VSCODE.md](./VSCODE.md) — VS Code editor, which GitHub.dev and Codespaces are based on
- [docs/07-compliance/ACCESS_CONTROL.md](../07-compliance/ACCESS_CONTROL.md) — GitHub access levels and branch protection
- [docs/07-compliance/ENCRYPTION_AND_SECRETS.md](../07-compliance/ENCRYPTION_AND_SECRETS.md) — secrets management including GitHub Secrets
