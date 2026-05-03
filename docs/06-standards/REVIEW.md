## Code Review Standards

### Purpose of Code Review
Code review is not quality control — it's knowledge sharing, risk reduction, and collective ownership. The goal is better code AND a better team.

### Reviewer Responsibilities
1. Read the PR description first — understand what it's trying to do
2. Review the diff, not just glance at it
3. Check: correctness, security, maintainability, test coverage, docs
4. Respond within 24 hours on business days
5. Be specific: point to lines, explain the concern, suggest an alternative
6. Distinguish blocking from non-blocking: prefix optional feedback with "nit:"

### What Reviewers Check

| Area | What to Look For |
|---|---|
| Correctness | Does it do what the PR says? Edge cases handled? |
| Security | Input validation, auth checks, no secrets, no injections |
| Maintainability | Can another developer understand this in 6 months? |
| Tests | Do new tests actually test the new behavior? |
| Documentation | Are affected docs updated? Changelog updated? |
| Scope | Does this PR do more than it says? |

### Author Responsibilities
1. Write a clear PR description: what, why, how to test
2. Keep PRs small (target under 400 lines changed)
3. Review your own diff before marking ready
4. Respond to every comment — even "done" is sufficient
5. Don't merge without approval
6. Don't take review feedback personally

### Review Language
- Preferred: "This could cause a SQL injection if the input isn't sanitized. Consider using parameterized queries instead."
- Avoid: "This is wrong." / "Why would you do this?"
- Praise good work: "Nice approach here — cleaner than what we had before."

### Approval Thresholds
- Hobby projects: 1 approval (or self-merge if solo)
- Enterprise: 1 approval minimum, 2 for security/infra changes
- Government: 2 approvals minimum, signed commits required

---

## Next Step

→ [Testing standards and coverage requirements](docs/06-standards/TESTING.md)
