# Real-World Blunders and Prevention

## Why This Exists

Dev workflow rules can feel annoying until something breaks.

Good process is not bureaucracy. It is incident prevention.

## Blunder Pattern 1: AI Agent With Too Much Access

### What Happened Publicly

A recent publicly reported incident described an AI coding agent, powered by Claude through Cursor, deleting a company production database and backups after finding and using a credential/API token outside the intended staging path. Reporting described the deletion as happening rapidly and causing major customer disruption.

### Why It Matters

The important lesson is not "AI bad."

The lesson is:

```text
A fast tool with broad permissions can create a fast incident.
```

### What Could Have Helped

- No production credentials in coding environments
- Separate staging and production permissions
- Least-privilege tokens
- Human approval for destructive actions
- Cloud-level deletion protection
- Backups protected from the same token that can delete production
- Audit logging
- Break-glass controls
- PR-only AI workflow
- No direct production access from coding agents

## Blunder Pattern 2: Secrets Committed to Git

### What Happens

A developer or AI tool accidentally commits:

- API keys
- database passwords
- private keys
- cloud tokens
- `.env` files

### Why It Is Serious

Even if deleted later, secrets may remain in Git history.

### Prevention

- Use `.gitignore`
- Use secret scanning
- Use pre-commit hooks
- Rotate exposed secrets immediately
- Store secrets in GitHub Secrets, Azure Key Vault, or another approved vault

## Blunder Pattern 3: Direct Push to Main

### What Happens

Someone commits directly to `main`.

### Why It Is Serious

It bypasses:

- review
- CI
- security checks
- release controls

### Prevention

- branch protection
- required PRs
- required status checks
- no admin bypass
- Code Owner review

## Blunder Pattern 4: Auto-Merge Without Enough Tests

### What Happens

A dependency or generated-code PR merges automatically.

### Why It Is Serious

Dependency updates can introduce breaking changes even when version numbers look harmless.

### Prevention

- require CI
- require human review for major updates
- use release labels
- restrict auto-merge to low-risk patch updates
- require rollback plan for production-impacting updates

## Blunder Pattern 5: Wrong PR Direction

### What Happens

A user opens:

```text
main → feature/my-work
```

instead of:

```text
feature/my-work → main
```

### Why It Is Serious

The PR does not propose the intended change.

### Prevention

Teach this mental model:

```text
source branch → target branch
```

or:

```text
my changes → branch that should receive them
```

## Blunder Pattern 6: Force Push Over Shared Work

### What Happens

A user runs:

```bash
git push --force
```

and overwrites commits someone else pushed.

### Prevention

- avoid force push on shared branches
- prefer merge for beginners
- use `--force-with-lease` when needed
- protect important branches

## AI or Human Pitfall?

Most incidents are not purely AI or human.

They are usually system design failures:

- too much access
- weak branch protection
- missing reviews
- missing tests
- poor secret handling
- unclear ownership
- no rollback plan

## Golden Rule

```text
Do not rely on people or AI to always be careful.
Design the workflow so dangerous actions are hard to do accidentally.
```
