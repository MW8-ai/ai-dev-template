# Release and Versioning System

## Recommended Standard: Semantic Versioning

Use this format:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
v1.4.2
```

## Meaning

| Part | Example | Use When |
|---|---:|---|
| MAJOR | v2.0.0 | Breaking changes |
| MINOR | v1.5.0 | New backward-compatible features |
| PATCH | v1.4.3 | Bug fixes, docs, small improvements |

## WHY

Versioning gives users, developers, operations teams, and leadership a shared language for risk.

- Patch means low risk.
- Minor means new capability.
- Major means plan carefully.

## Recommended Release Flow

```text
branch → PR → CI → review → merge to main → draft release → tag → deploy
```

## Tag Format

Use:

```text
v1.0.0
v1.1.0
v1.1.1
```

## Release Labels

Use labels to control release notes:

| Label | Meaning |
|---|---|
| release: major | Breaking change |
| release: minor | New feature |
| release: patch | Fix or small update |
| skip-changelog | Do not include in changelog |

## When to Release

For small teams:

- Patch releases: as needed
- Minor releases: after meaningful feature additions
- Major releases: rare and planned

For enterprise teams:

- Patch releases: weekly or emergency
- Minor releases: sprint or monthly
- Major releases: quarterly or program-level

## Rollback Notes

Every production release should answer:

- What changed?
- How was it tested?
- What could break?
- How do we roll back?
- Who owns the release?

## Golden Rule

> A release is not just code shipped. It is risk accepted.

---

## Next Step

→ [docs/04-ai-workflows/AI_OVERVIEW.md](docs/04-ai-workflows/AI_OVERVIEW.md) — an overview of AI coding tools (Copilot, Claude Code, Codex), when to use each, and the safety rules that apply to all of them
