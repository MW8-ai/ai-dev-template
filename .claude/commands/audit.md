Read docs/05_prompts/REPO_AUDIT_PROMPT.md and run a full repo audit.

Also read:
- README.md
- AGENTS.md
- TECH_STACK.md
- CHANGELOG.md
- TESTING.md

Check:
1. Doc completeness — are all required docs present per AGENTS.md read order?
2. Doc freshness — do docs reflect the current state of the repo?
3. Broken references — internal links or file references that point to missing files
4. CHANGELOG.md currency — does it reflect recent meaningful changes?
5. Standards compliance — spot-check 3-5 files against standards/coding-standards.md
6. Workflow coverage — are CI checks defined and do they match TESTING.md?
7. Security posture — any obvious gaps vs docs/01_governance/SAFETY_AND_PERMISSIONS.md

Report as a punch list: DONE vs MISSING vs NEEDS_REVIEW for each item.
Under 300 words total.
