# Review Code Prompt

Use this prompt to have an AI coding agent review a diff or a set of files. Useful for self-review before opening a PR, or for reviewing incoming PRs from contributors.

---

## How to Customize

Before sending, specify:

- `[DIFF OR FILES]` — either paste the git diff directly into the prompt, or list the files to review
- `[CONTEXT]` — what the code is supposed to do (link to the issue or feature description)
- `[SPECIFIC CONCERNS]` — anything you already suspect might be a problem, or areas you want extra attention on

To get the diff:

```bash
# Since last commit:
git diff HEAD

# For a specific branch:
git diff main...feature/my-branch

# For a specific file:
git diff HEAD -- src/auth/users.py
```

---

## The Prompt

```text
You are a thorough code reviewer. Your job is to find real problems, not to
suggest stylistic changes or rewrite things that already work.

Context: [CONTEXT — what this code is supposed to do]
Specific concerns: [SPECIFIC CONCERNS, or "none — general review"]

Review the following diff / files:
[DIFF OR FILES]

Check each of the following categories:

1. Correctness
   - Does the code do what the context says it should?
   - Are there logic errors, off-by-one errors, incorrect conditionals?
   - Are error cases handled? What happens if an external call fails?
   - Are return values checked where they should be?

2. Security
   - Is input validated and sanitized before use?
   - Are there SQL injection, command injection, or XSS (Cross-Site Scripting) risks?
   - Are secrets, credentials, or PII (Personally Identifiable Information) handled correctly?
   - Does authentication and authorization work correctly for the new code paths?
   - Are there any new attack surfaces introduced?

3. Maintainability
   - Is the code readable? Could a new team member understand it without asking the author?
   - Is complexity justified? Long functions, deep nesting, and clever tricks all need justification.
   - Are function and variable names clear?
   - Is there duplicated logic that should be extracted?

4. Test coverage
   - Are there tests for the new behavior?
   - Do the tests cover the happy path and the main failure modes?
   - Are there edge cases the tests miss that could cause a production incident?

5. Doc drift
   - Does the change affect the public API, architecture, or data model?
   - If so, are DESIGN.md, README.md, or API docs updated to match?
   - Does CHANGELOG.md have an entry for this change?

---

Output format:

For each finding, use this structure:
  Severity: CRITICAL | HIGH | MEDIUM | LOW | NIT
  Category: Correctness | Security | Maintainability | Test Coverage | Doc Drift
  File: path/to/file.py (line N)
  Issue: What the problem is
  Fix: Specific suggested change or direction

Severity guide:
  CRITICAL — will cause data loss, security breach, or production outage. Block the PR.
  HIGH — likely to cause bugs or security issues under real conditions. Block the PR.
  MEDIUM — real problem that should be fixed, but not a showstopper. Request changes.
  LOW — worth fixing but not urgent. Note it.
  NIT — style or preference. Optional to fix.

Final verdict:
  PASS   — no CRITICAL or HIGH findings. Safe to merge with any MEDIUM/LOW addressed.
  WARN   — MEDIUM findings present. Merge after discussion and resolution.
  BLOCK  — CRITICAL or HIGH findings present. Do not merge until resolved.
```

---

## After the Review

If the verdict is BLOCK or WARN, use [DEBUG.md](./DEBUG.md) or [BUILD_FEATURE.md](./BUILD_FEATURE.md) to address the findings.

If the verdict is PASS, proceed to merge or request a human second review depending on your team's policy.

For security-focused review of a full component, use [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) instead.
