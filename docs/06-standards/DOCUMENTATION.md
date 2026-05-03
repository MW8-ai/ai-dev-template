## Documentation Standards

### What Needs Documentation

- Public APIs and their parameters
- Architecture decisions (use DESIGN.md)
- Non-obvious implementation choices (inline comments)
- Setup, testing, and deployment procedures (README, TESTING.md, DEPLOYMENT.md)
- Changes (CHANGELOG.md)

### What Does Not Need Documentation

- Self-explanatory code (a function named `validateEmail` doesn't need a comment saying "validates email")
- Obvious configuration
- Generated code

### File Structure

- README.md: project overview, quick start, links to other docs
- DESIGN.md: architecture, decisions, diagrams
- TESTING.md: how to run tests, what CI checks exist
- DEPLOYMENT.md: how to deploy to each environment
- CHANGELOG.md: meaningful changes, dated, human-readable
- API docs: close to the code (inline docstrings or auto-generated)

### Writing Style

- Active voice: "Run the tests" not "The tests should be run"
- Short sentences: one idea per sentence
- Second person: "You can configure..." not "One can configure..."
- Define terms: every acronym expanded on first use
- Link related docs: don't duplicate, reference

### Changelog Format

```markdown
## Unreleased
### Added
- New export feature for CSV format

## 1.3.0 — 2026-03-15
### Changed
- Login flow now uses OAuth 2.0 instead of session cookies

### Fixed
- Fixed crash when email contains special characters
```

### Keeping Docs Fresh

- Update docs in the same PR that changes the behavior
- Stale docs are worse than no docs — they mislead
- Use CI checks (docs-check.yml, required-files.yml) to catch gaps

---

## Next Step

→ [Security baseline standards](docs/06-standards/SECURITY.md)
