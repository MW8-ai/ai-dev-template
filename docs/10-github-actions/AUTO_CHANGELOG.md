# Auto Changelog Generator

## Goal

Automatically produce useful release notes from merged Pull Requests.

## Recommended Approach

Use two layers:

1. GitHub native generated release notes using `.github/release.yml`
2. Optional Release Drafter workflow for always-ready draft releases

## WHY

Manual changelogs get skipped when teams are busy.

Automated changelogs:

- Reduce release prep time
- Improve visibility
- Encourage better PR titles
- Create better audit history

## Required Habits

For changelogs to be useful:

- PR titles must be clear.
- PRs must be labeled.
- Breaking changes must be marked.
- Noise must be excluded with `skip-changelog`.

## Good PR Titles

```text
feat: add user invite workflow
fix: prevent crash on missing profile image
docs: update Codespaces setup guide
ci: enforce PR title format
security: rotate exposed test credential
```

## Bad PR Titles

```text
updates
stuff
fixes
misc changes
final version
```

## Release Notes Categories

Recommended:

- Features
- Fixes
- Security
- Documentation
- CI/CD
- Maintenance

## Release Drafter

Release Drafter keeps a draft release updated as PRs merge.

Recommended files:

```text
.github/workflows/release-drafter.yml
.github/release-drafter.yml
```

## GitHub Native Release Notes

GitHub can generate release notes when drafting a release.

Recommended file:

```text
.github/release.yml
```

## Golden Rule

> The changelog is only as good as the PR titles and labels feeding it.
