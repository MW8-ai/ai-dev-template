Read docs/05_prompts/review/REVIEW_PROMPTS.md and apply every checklist item to the diff since the last commit.

Get the diff with: `git diff HEAD`

Report findings grouped by:

1. Correctness — logic errors, edge cases, wrong assumptions
2. Safety — secrets, injection risks, unsafe operations, permission escalation
3. Maintainability — naming, complexity, hidden state, premature abstraction
4. Test coverage — missing tests, untested edge cases, tests that don't actually verify behavior
5. Doc drift — docs that no longer match the code, missing changelog entry

For each finding, include: file path, line number or range, and a one-sentence description of the issue.

End with: PASS (no blocking issues), WARN (issues worth fixing but not blocking), or BLOCK (must fix before merge).
