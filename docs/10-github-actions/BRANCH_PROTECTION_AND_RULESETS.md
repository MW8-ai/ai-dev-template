# Branch Protection and Rulesets

Branch protection and rulesets are GitHub controls that define what must happen before code can be merged into important branches like `main`.

## Quick Path (Experienced Developers)

For `main`, require:

- Pull request before merge.
- At least one approval.
- Dismiss stale approvals when new commits are pushed.
- Require conversation resolution.
- Require status checks:
  - `Validate required structure and guide files`
  - `Detect empty or placeholder documentation`
  - `Validate PR description, title, branch, and safety notes`
  - `Validate changed-file expectations`
  - `Markdown lint`
  - `Local markdown link check`
  - `Secret scan with Gitleaks`
  - `Dependency review on pull requests`
  - `CodeQL analyze`
  - `actionlint`
- Restrict direct pushes to `main`.
- Require CODEOWNERS review for `.github/workflows`, `scripts`, and compliance docs.

## Full Explanation (New Developers)

A branch is a separate line of work. The `main` branch is usually the stable branch. You should not work directly on `main` because mistakes are harder to review and undo.

A ruleset is a GitHub feature that lets repository administrators define rules for branches or tags. A branch protection rule is a similar older GitHub feature. Either can be used. Rulesets are usually better for modern repositories because they can be layered and managed more consistently.

## Recommended setup steps

1. Open the GitHub repository.
2. Go to **Settings**.
3. Go to **Rules** or **Branches**, depending on your GitHub plan and interface.
4. Create a rule for `main`.
5. Require pull requests before merging.
6. Require status checks to pass before merging.
7. Select the workflow checks from this repo.
8. Require review from CODEOWNERS for sensitive paths.
9. Save the rule.

## Suggested branch naming

Use one of these patterns:

- `feature/add-login-page`
- `bugfix/fix-export-error`
- `fix/readme-link-check`
- `docs/update-start-here`
- `chore/update-actions`
- `security/rotate-api-token`
- `hotfix/production-login-fix`
- `release/v1.0.0`
- `experiment/test-new-agent-flow`

## Suggested merge strategy

For most teams, squash merge is the cleanest default. A squash merge combines all commits from a branch into one commit on `main`. This keeps history readable.

Use merge commits when you need to preserve detailed branch history. Use rebase only when the team understands it well.

## Next Step

Read `docs/10-github-actions/CHECKS_EXPLAINED_FOR_BEGINNERS.md` if you want a plain-English explanation of each check.
