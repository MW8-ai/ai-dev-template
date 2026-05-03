# MODEL_ROUTING.md

## Goal

Use the smallest capable model. Bigger models cost more and are slower — save them for tasks that need judgment, not tasks that need execution.

## Claude Model Matrix

| Model | ID | Best For | Extended Thinking | Tool Use | Computer Use |
|---|---|---|---|---|---|
| Haiku 4.5 | `claude-haiku-4-5-20251001` | Docs, formatting, changelog, catalog, prompt variations | No | Yes | No |
| Sonnet 4.6 | `claude-sonnet-4-6` | Features, bug fixes, tests, refactors, standard review | Yes | Yes | No |
| Opus 4.7 | `claude-opus-4-7` | Architecture, security, compliance, cross-file debugging, novel patterns | Yes | Yes | Yes |

## Task Routing Guide

### Haiku 4.5 — Cheap and Fast

Use when the task is mechanical and the pattern is already established:

- Docs cleanup and reformatting
- Changelog entry drafting
- Adding entries to indexes or catalogs
- Simple prompt variations
- CSS / style tweaks
- Renaming variables or files
- Summarizing diffs

### Sonnet 4.6 — Default Workhorse

Use for the majority of coding tasks:

- New features within an existing module
- Bug fixes with a clear root cause
- Adding or updating tests
- Refactors within one or two files
- Integration with documented external APIs
- PR reviews of moderate complexity
- Generating or updating standard docs

Enable extended thinking on Sonnet when:

- Requirements are ambiguous
- Multiple valid approaches exist and you want the model to reason before committing

### Opus 4.7 — High Judgment

Reserve for tasks where the cost of a wrong decision is high:

- System architecture decisions
- Security review and threat modeling
- Auth, permissions, secrets handling
- Database schema design and migrations
- Cross-file or cross-service debugging
- Compliance interpretation (NIST, FIPS, HIPAA)
- Unclear or conflicting requirements
- Production deployment decisions
- Tasks creating new patterns (not copying existing ones)

Use extended thinking on Opus for:

- Architecture trade-offs with multiple stakeholders
- Security analysis where missing a vector has real consequences
- Compliance mapping where the answer affects audit posture

## Feature Availability

| Feature | Haiku 4.5 | Sonnet 4.6 | Opus 4.7 |
|---|---|---|---|
| Tool use / function calling | Yes | Yes | Yes |
| Extended thinking | No | Yes | Yes |
| Computer use | No | No | Yes |
| Prompt caching | Yes | Yes | Yes |
| Batch API | Yes | Yes | Yes |
| Files API | Yes | Yes | Yes |
| Streaming | Yes | Yes | Yes |

## Cost Optimization Rules

1. **Default to Sonnet 4.6.** Upgrade to Opus only when judgment matters. Downgrade to Haiku only when the task is purely mechanical.
2. **Use prompt caching** when injecting large stable docs (AGENTS.md, TECH_STACK.md, DESIGN.md) repeatedly. See `docs/09_claude_native/PROMPT_CACHING.md`.
3. **Use Batch API** for parallelizable, non-urgent tasks (overnight doc generation, bulk review). See `docs/09_claude_native/BATCH_API.md`.
4. **Enable extended thinking selectively.** It adds latency and cost. Enable it when the model needs to reason through ambiguity, not for routine implementation.

## Rule

If the task copies a known pattern, use Haiku or Sonnet.

If the task creates a new pattern, touches safety/security, or has unclear requirements, use Opus with human review.
