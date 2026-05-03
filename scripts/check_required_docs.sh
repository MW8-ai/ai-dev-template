#!/usr/bin/env bash
set -euo pipefail

required=(
  "README.md"
  "AGENTS.md"
  "TECH_STACK.md"
  "docs/00_start_here/START_HERE.md"
  "docs/01_governance/FRICTION_CONTROL.md"
  "docs/02_workflows/WORKFLOW_TIERS.md"
  "docs/04_compliance/government_nist_fips/GOV_NIST_FIPS_LEVELS.md"
)

for f in "${required[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Missing: $f"
    exit 1
  fi
done

echo "Required docs present."
