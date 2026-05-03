# Human in the Loop

When and how to keep humans in the review loop for AI-generated code.

Related docs: [AI_OVERVIEW.md](./AI_OVERVIEW.md) | [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md) | [../03-development-workflow/CODE_REVIEW.md](../03-development-workflow/CODE_REVIEW.md)

---

## The Rule

**AI writes. Humans decide.**

AI tools can generate code faster than a human can type. That speed does not mean the code is correct, secure, or appropriate for your system. Every piece of AI-generated code needs a human to read, understand, and approve it before it goes into production.

This is not a limitation that will be engineered away soon. AI models generate plausible output — they do not verify it against your specific business rules, your existing system's behavior, or the security model of your application. You are the check.

---

## What to Always Review Carefully

| AI Output | Review For |
|---|---|
| New functions | Correct logic, edge cases, error handling |
| Security-related code | Vulnerabilities, input validation, auth and authorization logic |
| Database queries | SQL injection, correct joins, indexes, performance |
| External API calls | Error handling, timeouts, secrets not hardcoded, retry logic |
| File operations | Path traversal, correct permissions, cleanup on failure |
| Tests | Actually test what they claim to test — not just assert `True` |
| Configuration changes | Side effects on other parts of the system |
| Dependency additions | License compatibility, maintenance status, supply chain risk |

---

## What Can Have Lighter Review

Some output is lower-risk and does not require line-by-line scrutiny:

- **Boilerplate code** (standard config files, scaffolding) — still read it, but the risk of a subtle bug is lower
- **Simple string formatting** — unlikely to introduce a security issue
- **CSS and style changes** — visual regression is the main concern, not logic errors
- **Documentation drafts** — read for accuracy, not for security; AI often writes plausible but incorrect technical details
- **Commit messages and changelogs** — edit for accuracy before committing

Even in lower-risk categories: read it before you keep it.

---

## The Review Process

1. **Read the entire diff** — do not just scan for your original request. AI output sometimes includes changes beyond what was asked for.
2. **Run the code locally** if the task involves logic, data processing, or any state change.
3. **Check: does it do what was asked?** Re-read the original prompt and compare it against the output.
4. **Check: does it do anything extra?** Look for additional function calls, network requests, or file writes that were not in the spec.
5. **Check: are there obvious security issues?** Hardcoded values, missing input validation, unchecked return values.
6. **Check: are tests updated?** If the AI added or changed a function, tests should accompany it.
7. **Approve or request changes** — treat this the same as a human code review.

---

## Red Flags in AI Output

These patterns in AI-generated code warrant extra scrutiny:

**Code more complex than the task requires.** If you asked for a function to parse a date string and the AI returned 80 lines with three helper classes, something is off. Simpler is almost always better. Ask it to simplify.

**Network calls or file operations not in the spec.** If you asked the AI to validate an email address and it also makes an HTTP request to a third-party verification service, that is unexpected behavior. It may be benign, or it may be a mistake — either way, it needs to be understood before it ships.

**Hardcoded values.** URLs, email addresses, phone numbers, IP addresses, or anything that looks like it was lifted from a training example:
```python
# Red flag — where did "admin@example.com" come from?
DEFAULT_ADMIN = "admin@example.com"
```

**TODO comments the AI left in.** If the code contains `# TODO: implement error handling` or `# TODO: add validation`, the task is not done. Do not commit unfinished work with the intention of coming back to it — finish it or remove it.

**Deprecated API usage.** AI models have a training cutoff and may suggest APIs, methods, or configuration options that have since been removed or replaced. Always verify against current documentation for libraries you do not know well.

**Tests that do not test.** A common AI failure: generating tests that pass trivially because they do not actually assert the right thing:
```python
# This test always passes — it does not verify the function's output
def test_process_order():
    result = process_order(order_id=42)
    assert result is not None  # this tells you nothing useful
```

---

## Governance

This repository's CI (Continuous Integration) pipeline includes `ai-review-check.yml`, a check that posts a reminder on every PR that contains AI-generated code. The reminder links to this document.

That check is **advisory** — it does not block merges. It is a prompt, not a gate. The responsibility for reviewing and approving AI-generated code rests with the human who merges the PR.

Team leads are responsible for ensuring their team members understand and follow this process. If AI-generated code ships with a bug or security issue that would have been caught by a thorough review, the responsibility is with the reviewer who approved it — not the AI tool that generated it.

---

## Practical Checklist

Before merging any PR that contains AI-generated code:

- [ ] I read the entire diff, not just the parts I asked the AI to change
- [ ] I ran the code locally and confirmed it behaves as expected
- [ ] I checked for hardcoded values (URLs, emails, credentials) in the output
- [ ] I checked that tests exist and that they actually test what they claim to
- [ ] I checked for any unexpected network calls, file writes, or external dependencies
- [ ] I confirmed the AI did not use any deprecated APIs for the libraries in this project
- [ ] At least one other developer reviewed and approved the PR

---

## Next Step

→ [Choose your project type and governance level](docs/05-project-types/HOBBY.md)
