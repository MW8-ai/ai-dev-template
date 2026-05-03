# Impact Note: PR Reviewing

## Triggered By

- Update: GitHub — Improved Pull Request Files Changed Page (on by default)
- Source: https://github.blog/changelog/2026-01-22/improved-pull-request-files-changed-page-on-by-default/
- Date: 2026-01-22

## Previous Guidance

Review the highlighted diff lines. Approve if the change looks correct and tests pass.

## Updated Guidance

Reviews should consider full file context, not just the colored diff lines. The improved file tree and diff navigation make it straightforward to inspect surrounding code. Use it.

Specifically:

- Expand files to see what the changed function is doing in context
- Look at callers and call sites when a function signature or behavior changes
- Check related files in the same module — a change in one file often implies a needed change in another
- For AI-generated PRs, treat the diff as a starting point, not the full story

## Why

GitHub's improved Files Changed UI removes the excuse for shallow review. The context is now one click away. "I only reviewed the diff" is no longer a reasonable constraint — it's a choice.

AI coding tools (Copilot, Codex, Claude Code) generate broad changes that look reasonable at the diff level but can have subtle side effects in surrounding code. Shallow review catches the obvious; contextual review catches the rest.

## Final Rule

```text
Review context, not just colored lines.
```

## Affected Files

```text
docs/03-development-workflow/CODE_REVIEW.md
docs/06-standards/REVIEW.md
standards/review-standards.md
```

## Required Action

- [x] Documentation update — update CODE_REVIEW.md to reference contextual review
- [ ] No further action
