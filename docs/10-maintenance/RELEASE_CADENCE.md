# Release Cadence

How this template itself is versioned, released, and announced.

---

## Versioning

This repo follows [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes, typo corrections, broken link repairs
  │     └──────── New docs, new workflows, expanded coverage
  └────────────── Breaking structural changes (renames, major reorganizations)
```

Examples:
- `1.0.0` — initial stable release
- `1.1.0` — new doc added (e.g., `BRANCHING_STRATEGY.md`)
- `1.1.1` — typo fix or broken link repair
- `2.0.0` — directory structure reorganized; anyone with hardcoded paths would need to update

---

## When to Cut a Release

| Trigger | Version bump |
|---|---|
| One or more new guides added | `MINOR` |
| New workflow added to enforcement pack | `MINOR` |
| Living-updates source list significantly expanded | `MINOR` |
| Existing doc substantially rewritten | `MINOR` |
| Typo / broken link fix | `PATCH` |
| Spelling, grammar, formatting pass | `PATCH` |
| Directory restructured, files renamed | `MAJOR` |
| Enforcement pack breaking change | `MAJOR` |

**Rule of thumb:** anything a downstream user would need to update their own fork for is `MAJOR`. Anything additive is `MINOR`. Anything invisible to readers is `PATCH`.

---

## Release Process

1. **Ensure main is green** — all CI checks pass on `main`
2. **Update `CHANGELOG.md`** — move `[Unreleased]` entries under the new version heading with today's date
3. **Bump version** — update the version badge in `README.md` if one exists
4. **Tag the release**
   ```bash
   git tag -a v1.2.0 -m "v1.2.0 — add LOCAL_LLMS, AI_CERTIFICATIONS, maintenance layer"
   git push origin v1.2.0
   ```
5. **Create a GitHub Release** — the `release-drafter.yml` workflow pre-fills the draft from PR labels; review and publish
6. **Announce in the issue** — if a milestone issue was tracking this release, close it with a comment linking the release

---

## Release Cadence

There is no fixed release schedule. Releases are cut:

- After a meaningful batch of changes lands (3–5 new docs, a new workflow, a living-updates expansion)
- After a significant fix (broken workflow, misleading guidance corrected)
- When a dependent team asks for a tagged stable version to pin to

**Do not over-release.** A patch for every typo fix clutters the release feed. Batch small fixes and release them together.

---

## CHANGELOG Format

Entries follow [Keep a Changelog](https://keepachangelog.com/) conventions:

```markdown
## [1.2.0] — 2025-05-15

### Added
- `docs/04-ai-workflows/LOCAL_LLMS.md` — local inference guide with hardware requirements
- `docs/04-ai-workflows/AI_CERTIFICATIONS.md` — vendor cert tracker with costs
- `docs/10-maintenance/` — maintenance layer with update and release cadence docs
- `docs/03-development-workflow/WHY_THIS_WORKFLOW.md` — explains the reasoning behind every step

### Changed
- `docs/06-living-updates/sources/update-sources.yml` — expanded from 8 to 24 sources
- `README.md` — cleaner three-path entry flow; Automated Enforcement callout

### Fixed
- Living-updates workflow: fallback to GitHub Issue when PR creation is org-blocked

## [1.1.0] — 2025-04-01
...
```

---

## Who Owns Releases

The person who merges the batch of changes to `main` is responsible for:
- Confirming `CHANGELOG.md` is updated
- Tagging the release
- Publishing the GitHub Release draft

There is no separate release manager. Keep the process lightweight.

---

## Next Step

→ [KEEPING_THIS_REPO_UPDATED.md](KEEPING_THIS_REPO_UPDATED.md) — the other side of maintenance: what to review and when
