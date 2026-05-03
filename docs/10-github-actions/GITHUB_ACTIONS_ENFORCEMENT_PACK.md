# GitHub Actions Enforcement Pack

This folder explains the repository automation layer. GitHub Actions are automated checks that run inside GitHub when code is pushed, a pull request is opened, or a schedule runs.

## Quick Path (Experienced Developers)

Use these workflows as the default starter set:

- `.github/workflows/00-repo-health.yml` checks required files, folders, and documentation quality.
- `.github/workflows/01-pr-standards.yml` checks pull request metadata, branch names, and changed-file expectations.
- `.github/workflows/02-docs-quality.yml` runs markdown linting and link validation.
- `.github/workflows/03-security-supply-chain.yml` runs secret scanning, dependency review, and OpenSSF Scorecard.
- `.github/workflows/04-codeql.yml` runs CodeQL static security analysis.
- `.github/workflows/05-actions-lint.yml` validates GitHub Actions workflow syntax.
- `.github/workflows/06-build-provenance-example.yml` demonstrates artifact provenance attestations.

Recommended branch protection or ruleset requirements:

- Require pull requests before merging.
- Require at least one approving review.
- Require status checks from workflows `00` through `05` before merge.
- Require conversations to be resolved.
- Require linear history or squash merges if your team prefers a clean history.
- Restrict direct pushes to `main`.

## Full Explanation (New Developers)

Continuous Integration and Continuous Deployment, usually shortened to CI/CD, means automated checks and release steps run the same way every time. CI usually checks whether a change is safe to merge. CD usually delivers a validated change to an environment.

This repository uses GitHub Actions for CI/CD enforcement. The goal is not to make GitHub feel harder. The goal is to make the safest path the easiest path.

## What each workflow does

### 00 Repo Health

This check confirms that the repository still has the files and folders that make it usable as a playbook. It prevents accidental deletion of important files like `START_HERE.md`, `REPO_MAP.md`, templates, and scripts.

### 01 Pull Request Standards

A Pull Request, shortened to PR, is a proposed change that should be reviewed before it is merged. This workflow checks that the PR has a useful description, uses a professional branch name, and updates documentation when workflow files change.

### 02 Documentation Quality

This workflow checks markdown formatting and links. It includes a local link checker that catches broken links between files in the repo and an external link checker for web links.

### 03 Security and Supply Chain

This workflow looks for secrets, vulnerable dependencies, and supply-chain risks. It includes:

- Gitleaks for secret scanning.
- GitHub Dependency Review for pull requests that change dependencies.
- OpenSSF Scorecard for supply-chain posture.

### 04 CodeQL Security Analysis

CodeQL is GitHub's semantic code analysis engine. It looks for security and quality issues in supported languages and uploads results to GitHub code scanning.

### 05 GitHub Actions Lint

This runs actionlint against workflow files. It catches common YAML and GitHub Actions expression mistakes before they break your pipeline.

### 06 Build Provenance Example

Artifact provenance is a signed statement showing where and how an artifact was built. This example packages the documentation and creates an attestation using GitHub's artifact attestation support.

## How strict should this be?

For a hobby repo, you can start with repo health, PR standards, and documentation quality.

For an enterprise repo, use all workflows and require them through branch protection or rulesets.

For a government-aware or regulated repo, also require dependency review, CodeQL, secret scanning, CODEOWNERS review, and documented release approval.

## Next Step

Read `docs/10-github-actions/BRANCH_PROTECTION_AND_RULESETS.md` to make the checks actually block unsafe merges.
