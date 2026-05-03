#!/usr/bin/env bash
# check_required_docs.sh
#
# Usage: bash scripts/check_required_docs.sh
#        (also invoked automatically as a PostToolUse hook after Edit/Write)
#
# Checks that all required documentation files and directories are present.
# Reports a pass/fail summary with color output.
#
# Exit codes:
#   0 — all checks passed
#   1 — one or more required files/directories are missing

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
FAIL=0

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
pass() {
  printf "${GREEN}  [✓ PASS]${RESET} %s\n" "$1"
  (( PASS++ )) || true
}

fail() {
  printf "${RED}  [✗ FAIL]${RESET} %s\n" "$1"
  (( FAIL++ )) || true
}

section() {
  printf "\n${BOLD}%s${RESET}\n" "$1"
}

# Resolve repo root as the parent of the directory containing this script.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

printf "\n${BOLD}=== Required Docs Check ===${RESET}\n"
printf "Root: %s\n" "${REPO_ROOT}"

# ---------------------------------------------------------------------------
section "Required root files"
# ---------------------------------------------------------------------------
required_files=(
  "README.md"
  "AGENTS.md"
  "TECH_STACK.md"
  "CHANGELOG.md"
  "DESIGN.md"
  "TESTING.md"
)

for f in "${required_files[@]}"; do
  if [[ -f "${f}" ]]; then
    pass "${f}"
  else
    fail "${f} is missing"
  fi
done

# ---------------------------------------------------------------------------
section "Required legacy doc files"
# ---------------------------------------------------------------------------
legacy_files=(
  "docs/00_start_here/START_HERE.md"
  "docs/01_governance/FRICTION_CONTROL.md"
  "docs/02_workflows/WORKFLOW_TIERS.md"
  "docs/04_compliance/government_nist_fips/GOV_NIST_FIPS_LEVELS.md"
)

for f in "${legacy_files[@]}"; do
  if [[ -f "${f}" ]]; then
    pass "${f}"
  else
    fail "${f} is missing"
  fi
done

# ---------------------------------------------------------------------------
section "docs/01-getting-started/ — must exist with at least 3 .md files"
# ---------------------------------------------------------------------------
dir="docs/01-getting-started"
if [[ -d "${dir}" ]]; then
  md_count=$(find "${dir}" -maxdepth 2 -name "*.md" | wc -l)
  if (( md_count >= 3 )); then
    pass "${dir}/ exists with ${md_count} .md file(s)"
  else
    fail "${dir}/ exists but has only ${md_count} .md file(s) — need at least 3"
  fi
else
  fail "${dir}/ directory is missing"
fi

# ---------------------------------------------------------------------------
section "docs/02-dev-environment/ — must exist"
# ---------------------------------------------------------------------------
dir="docs/02-dev-environment"
if [[ -d "${dir}" ]]; then
  pass "${dir}/ exists"
else
  fail "${dir}/ directory is missing"
fi

# ---------------------------------------------------------------------------
section ".github/workflows/ — must have at least 2 .yml files"
# ---------------------------------------------------------------------------
if [[ -d ".github/workflows" ]]; then
  yml_count=$(find .github/workflows -maxdepth 1 -name "*.yml" | wc -l)
  if (( yml_count >= 2 )); then
    pass ".github/workflows/ has ${yml_count} .yml file(s)"
  else
    fail ".github/workflows/ has only ${yml_count} .yml file(s) — need at least 2"
  fi
else
  fail ".github/workflows/ directory is missing"
fi

# ---------------------------------------------------------------------------
section "=== Check Summary ==="
# ---------------------------------------------------------------------------
printf "\n"
printf "  Passed: ${GREEN}%d${RESET}\n" "${PASS}"
printf "  Failed: ${RED}%d${RESET}\n" "${FAIL}"
printf "\n"

if (( FAIL > 0 )); then
  printf "${RED}${BOLD}  [FAIL]${RESET} ${FAIL} check(s) failed.\n\n"
  exit 1
else
  printf "${GREEN}${BOLD}  [PASS]${RESET} All required docs present.\n\n"
  exit 0
fi
