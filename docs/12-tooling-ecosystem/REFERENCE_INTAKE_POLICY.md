# Reference Intake Policy

This repository may reference external repositories, official docs, examples, awesome lists, vendor resources, and community projects.

Referencing does not mean adopting.

---

## Core Rule

> Link first. Review second. Adapt third. Import last.

This keeps the repository aware of what others are doing without becoming a copy of unreviewed code, prompts, skills, agents, workflows, or MCP servers.

---

## Why This Policy Exists

External resources can be useful, but they can also introduce risk:

- unclear licensing
- stale maintenance
- insecure defaults
- hidden dependencies
- excessive permissions
- unsafe command execution
- incompatible assumptions
- vendor-specific lock-in
- examples that are educational but not production-ready

This repository should remain a practical operating guide, not an unreviewed dependency dump.

---

## Intake Levels

### Level 1 — Link Only

Use this for awareness.

Allowed:

- link to official docs
- link to official repos
- link to awesome lists
- summarize why the source matters

Not allowed:

- copying code
- copying workflows
- copying prompts verbatim
- installing tools directly from the source

### Level 2 — Reviewed Reference

Use this after a human review.

Required checks:

- license reviewed
- maintainer identified
- update activity checked
- security concerns noted
- permissions understood
- fit for this repo documented

### Level 3 — Adapted Pattern

Use this when a pattern is useful but should be rewritten for this repo.

Rules:

- write an original implementation
- cite the source as inspiration where appropriate
- remove assumptions that do not fit this repo
- apply this repo's safety and documentation standards

### Level 4 — Imported Dependency

Use this only when adoption is intentional.

Required:

- license approval
- security review
- dependency review
- version pinning
- update plan
- rollback plan
- owner assigned

---

## External Source Review Checklist

Before copying, adapting, or installing anything, review:

- [ ] License
- [ ] Maintainer / owner
- [ ] Last meaningful update
- [ ] Open issues and security advisories
- [ ] Required permissions
- [ ] Network access
- [ ] File system access
- [ ] Secret handling
- [ ] Command execution
- [ ] Dependencies
- [ ] Fit with this repo's standards
- [ ] Whether a safer internal version should be created instead

---

## Default Stance

Default to linking.

Only move toward adoption when the value is clear and the risk is understood.

---

## What Not To Do

Do not:

- bulk copy skills from another repo
- blindly install MCP servers
- treat star count as a security review
- assume official examples are production-ready
- add tools because they are popular
- hide vendor lock-in behind generic language
- include private or internal examples in public docs

---

## Next Step

Continue to:

[OFFICIAL_REFERENCE_REPOS.md](OFFICIAL_REFERENCE_REPOS.md)
