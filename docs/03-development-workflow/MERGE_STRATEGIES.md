# Merge Strategies

Three ways to merge a feature branch into main — with visual diagrams, trade-offs, and recommendations.

Related docs: [ISSUE_TO_BRANCH_TO_PR.md](./ISSUE_TO_BRANCH_TO_PR.md) | [RELEASE_PROCESS.md](./RELEASE_PROCESS.md)

---

## Quick Reference

| Strategy | History Shape | Commit Count | Use When |
|---|---|---|---|
| Merge Commit | Non-linear (branchy) | Preserves all + adds one merge commit | Full audit trail is required |
| Squash and Merge | Linear | Feature becomes one commit | Branch has noisy WIP commits |
| Rebase and Merge | Linear | Preserves all, replayed on main | Commits are clean and meaningful |

---

## Merge Commit (`git merge`)

```
main:    A---B-----------M
              \         /
feature:       C---D---E
```

A merge commit `M` is added that ties the two branch histories together. Every commit from the feature branch (`C`, `D`, `E`) appears in `git log`, along with the merge commit itself.

**What you get:**
- The full record of when every commit was made and on which branch
- A clear visual indication that these commits came from a branch
- The ability to trace exactly what was in each release

**The trade-off:**
- `git log` on main becomes non-linear and harder to read at a glance
- Long-lived projects accumulate many merge commits

**Use when:**
- Full traceability is required (enterprise, regulated industries, audit logs)
- You want to preserve the exact branch structure for future reference
- Multiple developers collaborated on the same feature branch

**GitHub option:** "Create a merge commit"

```bash
# Local equivalent
git checkout main
git merge --no-ff feature/issue-42-user-login
```

---

## Squash and Merge

```
main:    A---B---S
                 ^
feature:     C---D---E  (all squashed into S)
```

All commits from the feature branch (`C`, `D`, `E`) are collapsed into a single new commit `S` on main. The individual commits are not preserved in `main`'s history.

**What you get:**
- A perfectly clean linear history on main
- One commit per feature or fix, making `git log` readable
- Easy to revert an entire feature with one `git revert`

**The trade-off:**
- The intermediate commits are gone from main — if a commit introduced a subtle bug, you cannot use `git bisect` to find it within the feature
- The feature branch must be deleted after merge, since it now diverges from main in a way that cannot be cleanly merged again

**Use when:**
- Feature branches contain many "WIP", "fix typo", or "address review comment" commits that add noise
- You want one commit per issue/ticket on main for readability
- You do not expect to need the intermediate commit history

**GitHub option:** "Squash and merge"

```bash
# Local equivalent
git checkout main
git merge --squash feature/issue-42-user-login
git commit -m "add user login feature (#42)"
```

---

## Rebase and Merge

```
main:    A---B---C'---D'---E'
                 ^    ^    ^
feature:     C---D---E  (replayed on top of B, new SHAs)
```

Each commit from the feature branch is replayed one by one on top of the latest `main`. The commits keep their messages and logical content, but receive new SHA hashes because their parent commits are different.

**What you get:**
- A perfectly linear history on main
- Individual commits preserved with their original messages
- `git bisect` still works across all commits

**The trade-off:**
- Commit SHAs are rewritten, which is why this should only be done by the person who opened the PR and only on branches not shared with others
- Merge conflicts must be resolved once per commit being replayed, not just once overall
- The original timestamps are preserved but the branch context is lost

**Use when:**
- Commits are clean, meaningful, and individually shippable
- The team uses a strict linear history policy
- You want the benefits of individual commits without merge commit noise

**GitHub option:** "Rebase and merge"

```bash
# Local equivalent — rebase your branch first
git checkout feature/issue-42-user-login
git rebase main
# resolve any conflicts per-commit, then:
git checkout main
git merge --ff-only feature/issue-42-user-login
```

---

## Recommendations by Context

**Hobby or solo projects:**
Use squash and merge. One commit per feature keeps the history clean and readable without any ceremony.

**Small-to-medium teams (5–50 developers):**
Either squash and merge (if branch commits are noisy) or rebase and merge (if commits are disciplined). Pick one and stick to it — mixed strategies make history hard to read.

**Enterprise teams:**
Use merge commits. The non-linear history is worth it for the traceability. Pair with signed commits (`git commit -S`) so every merge is attributable.

**Government and regulated industries:**
Merge commits plus signed commits. The audit trail must show who merged what and when, and signed commits provide cryptographic proof of authorship. Squash and rebase both obscure or rewrite that history.

---

## Branch Protection Settings

On GitHub, you can restrict which merge strategies are allowed for a repository.

Go to: **Settings → Branches → Branch protection rules → Add rule → (select your branch)**

Options to configure:

| Setting | What It Controls |
|---|---|
| "Allow merge commits" | Enables "Create a merge commit" button |
| "Allow squash merging" | Enables "Squash and merge" button |
| "Allow rebase merging" | Enables "Rebase and merge" button |
| "Require linear history" | Disables merge commits entirely (forces squash or rebase) |

To enforce a single strategy, enable only that option. For example, to require squash-only:
- Uncheck "Allow merge commits"
- Check "Allow squash merging"
- Uncheck "Allow rebase merging"

This prevents developers from accidentally using the wrong strategy even if they know all three options.
