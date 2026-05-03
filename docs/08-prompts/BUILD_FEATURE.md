# Build Feature Prompt

Use this prompt when implementing a scoped feature with an AI coding agent. One prompt per feature. If a feature is large, break it into smaller pieces first.

---

## How to Customize

Before sending, replace:

- `[FEATURE NAME]` — short name of the feature (e.g., "User email verification")
- `[ISSUE NUMBER]` — GitHub issue number where the feature is specified (e.g., #42)
- `[FEATURE DESCRIPTION]` — 2–4 sentences describing exactly what to build
- `[RELEVANT FILES]` — list the source files most relevant to this feature (e.g., `src/auth/users.py`, `src/routes/auth.py`)
- `[MAX FILES]` — the maximum number of files this change should touch (keeps scope tight)
- `[NEW DEPENDENCIES]` — any libraries the feature might need, or "none anticipated"
- `[BRANCH NAME]` — the git branch to work on (e.g., `feature/email-verification`)

---

## The Prompt

```text
You are a senior developer implementing a scoped feature.

Read these files before writing any code:
- DESIGN.md
- TECH_STACK.md
- AGENTS.md
- [RELEVANT FILES]

Feature: [FEATURE NAME]
Issue: #[ISSUE NUMBER]
Branch: [BRANCH NAME]

Description:
[FEATURE DESCRIPTION]

Tasks:

1. Implement the feature as described. Follow the patterns and conventions
   already established in the codebase — do not introduce new patterns
   without flagging them.

2. Write or update tests for the new behavior:
   - Unit tests for any new functions or methods
   - Integration tests if the feature touches an API endpoint, database, or
     external service
   - At minimum, test the happy path and the most likely failure mode

3. Update CHANGELOG.md with a brief entry under the current date describing
   what was added or changed.

4. Constraints:
   - Work on the [BRANCH NAME] branch, not main
   - Change no more than [MAX FILES] files total
   - If you need a new dependency not already in the project, note it explicitly
     and explain why — do not add it silently
   - Do not refactor unrelated code in the same PR — separate concerns
   - Do not change existing test behavior unless the feature requires it, and
     explain any such changes

5. Output when done:
   - List every file changed, with a one-line description of the change
   - List every test added or modified
   - List any new dependencies introduced and why
   - Describe what a human reviewer should focus on when reviewing this PR
   - Flag any edge cases that were left unhandled and why
```

---

## After the Feature

Before opening a PR:

1. Run the test suite: confirm all tests pass, including pre-existing ones.
2. Run the linter: no new lint errors.
3. Re-read DESIGN.md: does the implementation match the documented design? If not, update DESIGN.md.
4. Use the [REVIEW_CODE.md](./REVIEW_CODE.md) prompt to self-review the diff.

Then open the PR with a description that includes:

- What the feature does
- How to test it manually
- Any decisions made that reviewers should know about

See also: [DEBUG.md](./DEBUG.md) if the implementation runs into an unexpected problem.
