# Repository Map

This file explains every folder and file in this repository. Use it to find what you need or to understand how the pieces fit together.

---

## Root Files

These files live at the top level of the repository. Most of them are required by convention — GitHub, CI/CD tools, and contributors all look for them here.

| File | Purpose |
|---|---|
| README.md | One-page overview of the repo — what it is and where to start |
| START_HERE.md | Step-by-step onboarding path for new and experienced users |
| REPO_MAP.md | This file — the full directory and file guide |
| CHANGELOG.md | Chronological record of meaningful changes to this repo |
| AGENTS.md | Rules and boundaries for AI coding agents (what they may and may not do) |
| CLAUDE.md | Claude Code-specific configuration and behavior rules |
| TECH_STACK.md | Technology choices with rationale for each decision |
| DESIGN.md | Architecture and design decisions — the "why" behind the structure |
| TESTING.md | How to run tests and what must pass before merging |
| DEPLOYMENT.md | How to deploy — environments, steps, and rollback procedures |
| SECURITY.md | Security policies and responsible disclosure process |
| CONTRIBUTING.md | How to contribute code, docs, or bug reports |
| LICENSE | The legal terms under which this repo may be used |
| .env.example | Template listing all required environment variables (no real secrets) |
| .gitignore | Files and folders that Git should not track (logs, secrets, build artifacts) |

### docs/project/

Project-level planning docs that don't belong in a specific feature folder.

| File | Purpose |
|---|---|
| docs/project/ROADMAP.md | Planned features and future directions for this template |

---

## .github/

GitHub reads this folder automatically. It controls repository behavior on GitHub: automated workflows, issue forms, and PR checklists.

| Path | Purpose |
|---|---|
| .github/workflows/ | GitHub Actions (CI/CD) — automated checks that run on every push or PR |
| .github/ISSUE_TEMPLATE/ | Pre-filled forms shown when someone opens a bug report, feature request, or task |
| .github/PULL_REQUEST_TEMPLATE.md | Checklist shown automatically when someone opens a Pull Request (PR) |

### Workflows

GitHub Actions (GA) are scripts that run automatically in response to repository events such as a push or a PR being opened. Each `.yml` file defines one workflow.

| File | What It Does |
|---|---|
| claude-code.yml | Optional: runs Claude Code review on Pull Requests |
| docs-check.yml | Checks that documentation is up to date after file edits |

Note: Additional workflow starters (repo health checks, markdown linting, link checking, required-files validation, AI-review reminders, PR checks) are available in [templates/workflows/](templates/workflows/).

### Issue Templates

| File | When It Is Used |
|---|---|
| ISSUE_TEMPLATE/bug_report.yml | Someone reports a bug or unexpected behavior |
| ISSUE_TEMPLATE/feature_request.yml | Someone proposes a new feature |
| ISSUE_TEMPLATE/documentation_update.yml | Someone requests a doc change |
| ISSUE_TEMPLATE/security_review.yml | Someone flags a security concern |
| ISSUE_TEMPLATE/task.yml | A general task or work item |

---

## docs/

All documentation, organized by topic. Each subfolder covers one area of knowledge.

### docs/01-getting-started/

For anyone new to Git and GitHub. Explains concepts from the ground up with real examples.

| File | Topic |
|---|---|
| WHAT_IS_GITHUB.md | GitHub overview: accounts, repositories, forks, and why it matters |
| GIT_TERMS_EXPLAINED.md | Glossary of Git terms with plain-English definitions and examples |
| FIRST_COMMIT_PUSH.md | Make your first commit and push it to GitHub |
| BRANCH_PULL_MERGE.md | How branches work, how to pull changes, and how to merge |
| PULL_REQUESTS.md | What a Pull Request (PR) is and how the review and merge process works |
| COMMON_MISTAKES.md | The most common Git mistakes and exactly how to fix them |
| MISCONCEPTIONS.md | The most common Git/GitHub misconceptions corrected — start here if confused |

### docs/02-dev-environment/

How to set up your development environment on any operating system.

| File | Topic |
|---|---|
| WINDOWS_SETUP.md | Full step-by-step setup guide for Windows |
| MAC_SETUP.md | Full step-by-step setup guide for Mac |
| VS_CODE_SETUP.md | VS Code (Visual Studio Code) install, extensions, and configuration |
| CODESPACES_SETUP.md | GitHub Codespaces — a full dev environment that runs in your browser |
| GIT_CLI_SETUP.md | Git command-line interface setup and configuration |
| SSH_KEYS_AND_AUTH.md | SSH (Secure Shell) key generation and GitHub authentication setup |

### docs/03-development-workflow/

The professional development workflow used by real software teams.

| File | Topic |
|---|---|
| ISSUE_TO_BRANCH_TO_PR.md | The full cycle: open an issue, create a branch, submit a PR, and merge |
| DAILY_WORKFLOW.md | Day-to-day Git commands and habits — what to run every morning and evening |
| CODE_REVIEW.md | How to give useful feedback and how to receive it constructively |
| MERGE_STRATEGIES.md | Merge, squash, and rebase — what each does and when to use it |
| RELEASE_PROCESS.md | How to tag a version, write release notes, and publish a release |

### docs/04-ai-workflows/

Using AI tools safely and effectively in your development workflow.

| File | Topic |
|---|---|
| AI_OVERVIEW.md | Side-by-side comparison of AI coding tools and when to use each |
| OPENAI_CODEX.md | OpenAI Codex and the Codex CLI — setup and usage |
| CLAUDE_CODE.md | Claude Code — setup, slash commands, hooks, and safe usage patterns |
| GITHUB_COPILOT.md | GitHub Copilot — install, configure, and use inside VS Code |
| PROMPT_STRATEGIES.md | How to write prompts that get accurate, useful results |
| HUMAN_IN_LOOP.md | When and how to review AI output before it enters your codebase |

### docs/05-project-types/

Choose the governance level that matches your project's audience and risk.

| File | Topic |
|---|---|
| HOBBY.md | Personal and hobby projects — minimal process, maximum speed |
| ENTERPRISE.md | Team and company projects — standard controls, code review, CI/CD |
| GOVERNMENT.md | Regulated and government projects — full compliance, audit trails, access controls |

### docs/06-standards/

Standards that apply across all project types. These define the quality bar.

| File | Topic |
|---|---|
| CODING.md | Coding style, naming conventions, and quality rules |
| REVIEW.md | Code review standards — what reviewers look for and how long reviews take |
| TESTING.md | Testing requirements — unit, integration, and coverage thresholds |
| DOCUMENTATION.md | Documentation formatting and freshness standards |
| SECURITY.md | Security baseline — what every project must do regardless of type |
| COMMIT_CONVENTION.md | Conventional Commits format — how to write commits that drive automated changelogs |
| OPINIONATED_DEFAULTS.md | The opinionated defaults enforced in this template (branching, merging, SemVer) |
| TEAM_RULES.md | Team norms: review SLAs, on-call, communication, and escalation paths |

### docs/07-compliance/

Compliance guidance for regulated environments, including government and enterprise.

| File | Topic |
|---|---|
| NIST_OVERVIEW.md | NIST (National Institute of Standards and Technology) framework overview |
| FIPS_OVERVIEW.md | FIPS (Federal Information Processing Standards) cryptographic requirements |
| DATA_CLASSIFICATION.md | How to classify data: PII (Personally Identifiable Information), internal, and public |
| AUDIT_LOGGING.md | Logging requirements to support audit trails and incident investigation |
| ACCESS_CONTROL.md | Access control patterns: least privilege, role-based access, and approval flows |
| ENCRYPTION_AND_SECRETS.md | Encryption standards and secrets management — how to store and rotate credentials |

### docs/08-prompts/

Ready-to-use AI prompts for common development tasks. Copy, adapt, and send to any AI tool.

| File | Purpose |
|---|---|
| START_PROJECT.md | Prompt to kick off a new project: generate structure, decisions, and initial docs |
| BUILD_FEATURE.md | Prompt to implement a feature with tests and documentation |
| DEBUG.md | Prompt to diagnose and fix a problem, with context format |
| REVIEW_CODE.md | Prompt to get a structured code review from an AI |
| SECURITY_REVIEW.md | Prompt to review code specifically for security issues |

### docs/09-tools/

Deep-dive reference guides for each tool used in this playbook.

| File | Tool |
|---|---|
| GITHUB.md | GitHub features, settings, and best practices |
| VSCODE.md | VS Code extensions, keybindings, and workspace configuration |
| CODESPACES.md | GitHub Codespaces setup, resource sizing, and tips |
| OPENAI.md | OpenAI API and Codex CLI — authentication, usage, and rate limits |
| ANTHROPIC.md | Claude and Claude Code — models, API access, and agent configuration |

---

## templates/

Ready-to-copy templates for new projects. Each template is a starting point — copy the file, rename it, and fill in the sections that apply to your project.

| Folder | Contents |
|---|---|
| templates/project/ | Core project docs: DESIGN.md, TESTING.md, DEPLOYMENT.md, SECURITY.md, CONTRIBUTING.md |
| templates/github/ | Issue templates and PR template for new repositories |
| templates/workflows/ | GitHub Actions workflow starters for common CI/CD patterns |
| templates/prompts/ | Reusable AI prompt templates organized by task type |
| templates/compliance/ | Compliance document templates for NIST, FIPS, and data classification |

---

## examples/

Working examples that show the templates in use inside realistic project structures. Use these to understand how the pieces connect before starting your own project.

| Folder | What It Shows |
|---|---|
| examples/beginner-app/ | A minimal project setup — the fewest files needed to be functional |
| examples/api-project/ | A REST API (Application Programming Interface) project with routes and tests |
| examples/enterprise-project/ | Full enterprise setup: CI/CD, code review gates, security scanning |
| examples/gov-project/ | Government-compliant project: audit logging, access control, FIPS crypto |

---

## scripts/

Shell scripts for repo maintenance and validation. Run these locally or from CI/CD.

| File | Purpose |
|---|---|
| scripts/validate-repo.sh | Checks that all required files exist and are non-empty |
| scripts/check_required_docs.sh | Checks whether documentation is fresh relative to recent code changes |
| scripts/living_updates_watch.py | Fetches platform update sources, detects new items, writes draft notes to incoming/ |

---

## standards/

Detailed standards documents that define specific rules. These go deeper than the summaries in docs/06-standards/.

| File | Topic |
|---|---|
| standards/coding-standards.md | Line length, naming conventions, comment requirements, language-specific rules |
| standards/review-standards.md | What must be checked in every PR review, approval requirements, turnaround time |
| standards/testing-standards.md | Required test types, minimum coverage percentage, test naming conventions |
| standards/documentation-standards.md | Header format, file naming, cross-reference rules, how to keep docs current |
| standards/release-standards.md | Versioning scheme, release checklist, who can approve a release |

### docs/06-living-updates/

A living intelligence layer that tracks meaningful platform changes from GitHub, Anthropic, OpenAI, Google, and xAI. A scheduled Action detects updates automatically; humans review and decide whether to update team guidance.

| Path | Purpose |
|---|---|
| README.md | System overview, the three-layer model, and the human review process |
| SETUP.md | How to enable the automation in your repository |
| sources/update-sources.yml | Registry of RSS feeds and web pages to monitor |
| sources/\<vendor\>/ | Approved filed update notes organized by platform |
| incoming/ | Auto-generated draft notes awaiting human review |
| summaries/ | Plain-language summaries for broader team communication |
| impacts/ | Approved guidance changes that drive doc and workflow updates |
| templates/ | Templates for writing update notes and impact notes |
| examples/ | Example update note showing the full format |
| archive/ | Reviewed items with no action required |

**Key impact notes:**

| File | What It Captures |
|---|---|
| impacts/pr-reviewing.md | Updated PR review standards from GitHub's improved Files Changed UI |
| impacts/ai-dev-workflow.md | AI-assisted development guardrails and human-approval requirements |

---

### docs/05-confusion-troubleshooting/

Answers the questions that send developers to Stack Overflow. Covers common pitfalls, real-world blunders, and the concepts that trip everyone up.

| File | Topic |
|---|---|
| README.md | Index and reading guide for this section |
| PULL_REQUEST_SAFETY_AND_REJECTION.md | Why PRs get rejected and how to handle it professionally |
| AUTO_PR_AND_AI_AGENT_GUARDRAILS.md | Guardrails for AI agents that open PRs automatically |
| COMMON_PITFALLS_AND_TROUBLESHOOTING.md | The most common Git/GitHub pitfalls and how to recover |
| REAL_WORLD_BLUNDERS_AND_PREVENTION.md | Actual incidents teams have had and the prevention patterns that follow |
| FETCH_PULL_PUSH_AND_REMOTE_BRANCHES.md | Deep dive on fetch, pull, push, and remote branch tracking |
| MERGE_METHODS_EXPLAINED.md | Merge, squash, and rebase compared with clear guidance on when to use each |

---

## docs/10-github-actions

Explains the automation and enforcement layer: repository health checks, Pull Request standards, documentation checks, security scanning, CodeQL, branch protection, and rulesets.

| File | Topic |
|---|---|
| GITHUB_ACTIONS_ENFORCEMENT_PACK.md | Overview of the numbered enforcement workflow pack (00–06) |
| BRANCH_PROTECTION_AND_RULESETS.md | Branch protection rules and GitHub rulesets — what to require and why |
| BRANCH_PROTECTION_EXPANDED.md | In-depth branch protection: bypass actors, rule types, and enterprise settings |
| CHECKS_EXPLAINED_FOR_BEGINNERS.md | What CI checks are, why they're red, and how to fix them |
| CODEOWNERS_GUIDE.md | CODEOWNERS syntax, team ownership patterns, and review routing |
| AUTO_CHANGELOG.md | Automated changelog generation via release-drafter |
| LABELS_AND_AUTOMATION.md | GitHub labels: manual setup, labeler automation, and label-driven workflows |
| WORKFLOW_BEST_PRACTICES.md | Patterns for reliable, fast, maintainable GitHub Actions workflows |
| BRANCHING_STRATEGY.md | Trunk-based vs GitFlow vs GitHub Flow — how to choose and what to enforce |


