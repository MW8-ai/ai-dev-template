# Code Review

How to give and receive code reviews — the expectations, the process, and the standards.

Related docs: [ISSUE_TO_BRANCH_TO_PR.md](./ISSUE_TO_BRANCH_TO_PR.md) | [MERGE_STRATEGIES.md](./MERGE_STRATEGIES.md) | [../04-ai-workflows/HUMAN_IN_LOOP.md](../04-ai-workflows/HUMAN_IN_LOOP.md)

---

## As a Reviewer — Quick Path

1. Read the PR (Pull Request) description before looking at any code
2. Check out the branch locally or use GitHub's diff view
3. Review for: correctness, security, readability, test coverage
4. Comment on specific lines, not on the person
5. Choose one: **Approve** / **Request Changes** / **Comment** (no verdict)
6. After the author pushes changes, re-review the updated diff

---

## As an Author — Quick Path

1. Write a clear PR description: what changed, why, how to test it
2. Keep PRs under 400 lines changed when possible
3. Respond to every comment — even just "done" or "I disagree because X"
4. Do not merge without at least one approval from another developer
5. Re-request review after pushing changes

---

## Full Explanation

### What Reviewers Should Check

**Logic correctness**
- Does the code do what the PR description says it does?
- Are there edge cases that are not handled? (empty input, null values, off-by-one errors)
- Does it handle errors gracefully or does it fail silently?

**Security**
- Are any inputs validated before being used?
- Are there hardcoded credentials, tokens, or sensitive values?
- Does the code expose data that should be private?
- Are external inputs ever passed to shell commands, SQL queries, or file paths without sanitization?

**Readability**
- Can a developer unfamiliar with this code understand it in a few minutes?
- Are variable and function names descriptive?
- Is there complex logic that should have a comment explaining *why* (not just *what*)?

**Test coverage**
- Are there tests for the changed code?
- Do the tests cover the happy path, error cases, and edge cases?
- Would the tests catch a regression if this code were accidentally broken?

### What Reviewers Should NOT Do

- **Nitpick style issues that a linter handles.** If the team has ESLint, Prettier, or Black configured, do not comment on indentation, quote style, or trailing commas — the linter enforces those automatically. Reserve your attention for things the linter cannot catch.
- **Rewrite the entire PR.** If the implementation approach is fundamentally wrong, raise that as one blocking comment early and discuss it. Do not rewrite the code in comments line by line.
- **Make demands without explanations.** "Change this" is not useful. "Change this because X" is.

### Good Comment Format

Unhelpful: `"This is wrong."`

Helpful: `"This function will throw if \`user\` is null when the session has expired. Consider adding a null check before line 14, or returning early if the session is invalid."`

The best review comments:
1. Identify the specific problem
2. Explain why it is a problem
3. Suggest one or more ways to fix it

### Nit Comments

Prefix minor or optional feedback with `nit:` to signal that it is low priority and the author can use their judgment.

```
nit: You could use Array.from() here instead of the spread operator —
same result but slightly more explicit about intent. Up to you.
```

Authors should not block a PR over unresolved nits. Reviewers should not re-request changes for unresolved nits.

### Blocking vs Non-Blocking Comments

**Blocking** — the PR should not merge until this is addressed:
- Logic errors that would cause bugs or data loss
- Security vulnerabilities
- Missing tests for critical paths
- API contract violations

**Non-blocking** — useful feedback that can be addressed in a follow-up:
- Minor refactors that improve readability but do not affect behavior
- Nit-level style suggestions
- "Nice to have" improvements

Use GitHub's "Request changes" verdict only when there are blocking issues. Use "Comment" (no verdict) for non-blocking observations. Use "Approve" when the code is safe to merge even if minor suggestions remain.

### PR Size

400 lines changed is a soft limit. Research on code review consistently shows that reviewers begin missing issues as PR size grows. Above roughly 400 lines, review quality drops.

**How to split large PRs:**
- Separate refactoring from feature work. Refactor in one PR, add the feature in the next.
- Separate backend changes from frontend changes.
- Add infrastructure (new tables, new API endpoints) in one PR, add the business logic that uses them in the next.
- If the work is truly inseparable, consider a "stacked PR" approach: PR A contains foundational changes, PR B is opened against PR A.

### Review Latency

For async teams: acknowledge a review request within one business day, complete it within two. If you cannot review within that window, say so and suggest another reviewer.

Do not let PRs sit for days without a response — it blocks the author and stalls the project.

### Self-Review

Before marking a PR "ready for review," always review your own diff:

```bash
git diff main...HEAD
```

Or open the PR in draft mode and use GitHub's diff view. Read every line as if you were the reviewer. Catch your own mistakes before someone else has to.

Common self-review catches:
- Debug `console.log` or `print` statements left in
- Commented-out code that should be deleted
- TODO comments that you actually need to address before merging
- Files that should not have changed (accidental edits)

---

## Next Step

→ [docs/03-development-workflow/MERGE_STRATEGIES.md](docs/03-development-workflow/MERGE_STRATEGIES.md) — merge commit vs. squash vs. rebase: trade-offs, diagrams, and when to use each strategy
