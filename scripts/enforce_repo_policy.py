#!/usr/bin/env python3
"""Repository policy checks used by GitHub Actions.

This script keeps repo-specific checks readable and reusable. GitHub Actions
should call this script instead of embedding long bash blocks in workflow YAML.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_ROOT_FILES = [
    "README.md",
    "START_HERE.md",
    "REPO_MAP.md",
    "AGENTS.md",
    "CLAUDE.md",
    "CHANGELOG.md",
    "LICENSE",
    ".gitignore",
    ".env.example",
]

REQUIRED_DIRECTORIES = [
    ".github/workflows",
    ".github/ISSUE_TEMPLATE",
    "docs/01-getting-started",
    "docs/02-dev-environment",
    "docs/03-development-workflow",
    "docs/04-ai-workflows",
    "docs/05-project-types",
    "docs/06-standards",
    "docs/07-compliance",
    "docs/08-prompts",
    "docs/09-tools",
    "templates/project",
    "templates/workflows",
    "examples",
    "scripts",
]

REQUIRED_TEMPLATE_FILES = [
    "templates/project/DESIGN.md",
    "templates/project/TESTING.md",
    "templates/project/DEPLOYMENT.md",
    "templates/project/SECURITY.md",
    "templates/project/CONTRIBUTING.md",
]

REQUIRED_WORKFLOWS = [
    ".github/workflows/00-repo-health.yml",
    ".github/workflows/01-pr-standards.yml",
    ".github/workflows/02-docs-quality.yml",
    ".github/workflows/03-security-supply-chain.yml",
    ".github/workflows/04-codeql.yml",
    ".github/workflows/05-actions-lint.yml",
]

BRANCH_PATTERN = re.compile(r"^(feature|bugfix|fix|hotfix|docs|chore|release|security|experiment)/[a-z0-9._-]+$")

PLACEHOLDER_PATTERNS = [
    re.compile(r"^\s*(todo|tbd|placeholder|coming soon)\s*$", re.IGNORECASE),
    re.compile(r"lorem ipsum", re.IGNORECASE),
]


def fail(message: str) -> None:
    print(f"::error::{message}")
    print(f"FAILED: {message}")
    sys.exit(1)


def warn(message: str) -> None:
    print(f"::warning::{message}")
    print(f"WARNING: {message}")


def check_paths(paths: list[str], path_type: str) -> None:
    missing = []
    for item in paths:
        target = ROOT / item
        if path_type == "file" and not target.is_file():
            missing.append(item)
        elif path_type == "directory" and not target.is_dir():
            missing.append(item)
    if missing:
        fail("Missing required {}(s): {}".format(path_type, ", ".join(missing)))
    for item in paths:
        print(f"✓ {item}")


def repo_health() -> None:
    print("Checking required root files...")
    check_paths(REQUIRED_ROOT_FILES, "file")
    print("\nChecking required directories...")
    check_paths(REQUIRED_DIRECTORIES, "directory")
    print("\nChecking required project templates...")
    check_paths(REQUIRED_TEMPLATE_FILES, "file")
    print("\nChecking required workflows...")
    check_paths(REQUIRED_WORKFLOWS, "file")
    print("\nRepo health passed.")


def docs_content() -> None:
    bad_files: list[str] = []
    for md_file in ROOT.rglob("*.md"):
        if any(part in {".git", "node_modules"} for part in md_file.parts):
            continue
        rel = md_file.relative_to(ROOT)
        text = md_file.read_text(encoding="utf-8", errors="replace").strip()
        if len(text) < 80:
            bad_files.append(f"{rel} is very short ({len(text)} chars)")
            continue
        non_heading_lines = [line.strip() for line in text.splitlines() if line.strip() and not line.strip().startswith("#")]
        if not non_heading_lines:
            bad_files.append(f"{rel} has headings but no usable body content")
            continue
        if all(any(pattern.search(line) for pattern in PLACEHOLDER_PATTERNS) for line in non_heading_lines[:3]):
            bad_files.append(f"{rel} appears to be placeholder-only content")

    if bad_files:
        for item in bad_files:
            print(f"::error::{item}")
        fail("One or more markdown files are empty, too short, or placeholder-only.")
    print("Documentation content check passed.")


def pr_metadata() -> None:
    title = os.getenv("PR_TITLE", "").strip()
    body = os.getenv("PR_BODY", "").strip()
    head_ref = os.getenv("PR_HEAD_REF", "").strip()
    base_ref = os.getenv("PR_BASE_REF", "").strip()
    is_draft = os.getenv("PR_DRAFT", "false").lower() == "true"

    print(f"Title: {title}")
    print(f"Branch: {head_ref} -> {base_ref}")
    print(f"Draft: {is_draft}")

    if len(title) < 8:
        fail("PR title is too short. Use a clear summary of the change.")

    if not is_draft and len(re.sub(r"\s+", " ", body)) < 80:
        fail("Ready-for-review PRs need a meaningful description of at least 80 characters.")

    if head_ref in {"main", "master", "production", "prod"}:
        fail("Do not open PRs directly from main/master/production branches. Use a feature branch.")

    if head_ref and not BRANCH_PATTERN.match(head_ref):
        fail(
            "Branch name should follow: feature/name, bugfix/name, fix/name, hotfix/name, "
            "docs/name, chore/name, release/name, security/name, or experiment/name."
        )

    if base_ref not in {"main", "develop", "dev", "release"} and not base_ref.startswith("release/"):
        warn(f"Base branch '{base_ref}' is unusual. Confirm this is intentional.")

    print("PR metadata check passed.")


def changed_files() -> None:
    base = os.getenv("BASE_SHA")
    head = os.getenv("HEAD_SHA")
    if not base or not head:
        fail("BASE_SHA and HEAD_SHA are required for changed-files mode.")

    result = subprocess.run(
        ["git", "diff", "--name-only", f"{base}...{head}"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    changed = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    print("Changed files:")
    for item in changed:
        print(f"- {item}")

    workflow_changed = any(path.startswith(".github/workflows/") for path in changed)
    docs_for_workflows = any(path.startswith("docs/") or path.startswith("templates/workflows/") for path in changed)
    if workflow_changed and not docs_for_workflows:
        fail("Workflow changes must include related docs or template updates.")

    compliance_changed = any(path.startswith("docs/07-compliance/") or path.startswith("docs/04_compliance/") for path in changed)
    security_review_touched = any(path in {"SECURITY.md", "templates/project/SECURITY.md"} for path in changed)
    if compliance_changed and not security_review_touched:
        warn("Compliance docs changed without touching SECURITY.md or templates/project/SECURITY.md. Confirm this is intentional.")

    print("Changed-file expectations passed.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", required=True, choices=["repo-health", "docs-content", "pr-metadata", "changed-files"])
    args = parser.parse_args()

    if args.mode == "repo-health":
        repo_health()
    elif args.mode == "docs-content":
        docs_content()
    elif args.mode == "pr-metadata":
        pr_metadata()
    elif args.mode == "changed-files":
        changed_files()


if __name__ == "__main__":
    main()
