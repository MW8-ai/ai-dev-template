#!/usr/bin/env bash
# validate-repo.sh
#
# Usage: bash scripts/validate-repo.sh
#
# Validates the repository structure against the expected layout defined in
# the AI-native developer playbook. Checks for required root files, doc
# folders, GitHub files, scripts, content integrity, and basic git hygiene.
#
# Exit codes:
#   0 — all checks passed (or only warnings)
#   1 — one or more hard failures

set -uo pipefail

# ---------------------------------------------------------------------------
# Color helpers (ANSI fallback if tput is unavailable)
# ---------------------------------------------------------------------------
if command -v tput &>/dev/null && tput setaf 1 &>/dev/null; then
  GREEN="$(tput setaf 2)"
  YELLOW="$(tput setaf 3)"
  RED="$(tput setaf 1)"
  BOLD="$(tput bold)"
  RESET="$(tput sgr0)"
else
  GREEN="\033[0;32m"
  YELLOW="\033[0;33m"
  RED="\033[0;31m"
  BOLD="\033[1m"
  RESET="\033[0m"
fi

# ---------------------------------------------------------------------------
# Counters
# ---------------------------------------------------------------------------
PASS=0
WARN=0
FAIL=0

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
pass() {
  printf "${GREEN}  [✓ PASS]${RESET} %s\n" "$1"
  (( PASS++ )) || true
}

warn() {
  printf "${YELLOW}  [! WARN]${RESET} %s\n" "$1"
  (( WARN++ )) || true
}

fail() {
  printf "${RED}  [✗ FAIL]${RESET} %s\n" "$1"
  (( FAIL++ )) || true
}

section() {
  printf "\n${BOLD}%s${RESET}\n" "$1"
}

# Resolve the repo root as the directory containing this script's parent.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

# ---------------------------------------------------------------------------
printf "\n${BOLD}=== Repository Validation ===${RESET}\n"
printf "Root: %s\n" "${REPO_ROOT}"
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
section "Required root files"
# ---------------------------------------------------------------------------
required_files=(
  README.md
  START_HERE.md
  AGENTS.md
  CHANGELOG.md
  DESIGN.md
  TESTING.md
  DEPLOYMENT.md
  SECURITY.md
  CONTRIBUTING.md
  LICENSE
  .env.example
  .gitignore
)

for f in "${required_files[@]}"; do
  if [[ -f "${f}" ]]; then
    pass "${f} exists"
  else
    fail "${f} is missing"
  fi
done

# ---------------------------------------------------------------------------
section "Required doc folders"
# ---------------------------------------------------------------------------
required_doc_dirs=(
  docs/01-getting-started
  docs/02-dev-environment
  docs/03-development-workflow
  docs/04-ai-workflows
  docs/05-project-types
  docs/06-standards
  docs/07-compliance
  docs/08-prompts
  docs/09-tools
)

for d in "${required_doc_dirs[@]}"; do
  if [[ -d "${d}" ]]; then
    pass "${d}/ exists"
  else
    fail "${d}/ is missing"
  fi
done

# ---------------------------------------------------------------------------
section "Required GitHub files"
# ---------------------------------------------------------------------------

# .github/workflows/ must exist and contain at least one .yml file
if [[ -d ".github/workflows" ]]; then
  yml_count=$(find .github/workflows -maxdepth 1 -name "*.yml" | wc -l)
  if (( yml_count >= 1 )); then
    pass ".github/workflows/ exists with ${yml_count} .yml file(s)"
  else
    fail ".github/workflows/ exists but contains no .yml files"
  fi
else
  fail ".github/workflows/ directory is missing"
fi

if [[ -f ".github/PULL_REQUEST_TEMPLATE.md" ]]; then
  pass ".github/PULL_REQUEST_TEMPLATE.md exists"
else
  fail ".github/PULL_REQUEST_TEMPLATE.md is missing"
fi

# ---------------------------------------------------------------------------
section "Required scripts"
# ---------------------------------------------------------------------------

if [[ -f "scripts/check_required_docs.sh" ]]; then
  if [[ -x "scripts/check_required_docs.sh" ]]; then
    pass "scripts/check_required_docs.sh exists and is executable"
  else
    fail "scripts/check_required_docs.sh exists but is NOT executable"
  fi
else
  fail "scripts/check_required_docs.sh is missing"
fi

# ---------------------------------------------------------------------------
section "Content checks"
# ---------------------------------------------------------------------------

# README.md is not empty and is over 100 bytes
if [[ -f "README.md" ]]; then
  readme_size=$(wc -c < "README.md")
  if (( readme_size > 100 )); then
    pass "README.md is non-empty (${readme_size} bytes)"
  else
    fail "README.md is too small (${readme_size} bytes — expected > 100)"
  fi
else
  fail "README.md missing — cannot check content"
fi

# CHANGELOG.md contains at least one version entry (grep for "##")
if [[ -f "CHANGELOG.md" ]]; then
  if grep -q "^##" "CHANGELOG.md"; then
    pass "CHANGELOG.md contains at least one version entry (##)"
  else
    fail "CHANGELOG.md has no version entries (no lines starting with ##)"
  fi
else
  fail "CHANGELOG.md missing — cannot check content"
fi

# .gitignore ignores .env
if [[ -f ".gitignore" ]]; then
  if grep -q "\.env" ".gitignore"; then
    pass ".gitignore includes a .env rule"
  else
    fail ".gitignore does not include a .env rule"
  fi
else
  fail ".gitignore missing — cannot check content"
fi

# .env.example exists and contains at least one variable (has an = sign)
if [[ -f ".env.example" ]]; then
  if grep -q "=" ".env.example"; then
    pass ".env.example contains at least one variable (has '=')"
  else
    fail ".env.example exists but contains no variable assignments (no '=')"
  fi
else
  fail ".env.example missing — cannot check content"
fi

# ---------------------------------------------------------------------------
section "Git checks"
# ---------------------------------------------------------------------------

# Repo is a git repository
if [[ -d ".git" ]]; then
  pass ".git/ directory found — this is a git repository"
else
  fail ".git/ directory not found — not a git repository"
fi

# Current branch is not main (warn if it is)
if command -v git &>/dev/null && [[ -d ".git" ]]; then
  current_branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")"
  if [[ "${current_branch}" == "main" || "${current_branch}" == "master" ]]; then
    warn "Current branch is '${current_branch}' — consider working on a feature branch"
  else
    pass "Current branch is '${current_branch}' (not main/master)"
  fi
else
  warn "Cannot determine current branch (git not available or not a repo)"
fi

# No .env file committed in repo root (warn if present)
if [[ -f ".env" ]]; then
  warn ".env file exists in the repo root — ensure it is not committed to version control"
else
  pass "No .env file found in repo root"
fi

# ---------------------------------------------------------------------------
section "=== Validation Summary ==="
# ---------------------------------------------------------------------------
printf "\n"
printf "  Passed:   ${GREEN}%d${RESET}\n" "${PASS}"
printf "  Warnings: ${YELLOW}%d${RESET}\n" "${WARN}"
printf "  Failed:   ${RED}%d${RESET}\n" "${FAIL}"
printf "\n"

if (( FAIL > 0 )); then
  printf "${RED}${BOLD}  [FAIL]${RESET} ${FAIL} check(s) failed. Fix the issues above before merging.\n\n"
  exit 1
elif (( WARN > 0 )); then
  printf "${YELLOW}${BOLD}  [WARN]${RESET} All required checks passed, but ${WARN} warning(s) need attention.\n\n"
  exit 0
else
  printf "${GREEN}${BOLD}  [PASS]${RESET} All checks passed.\n\n"
  exit 0
fi
