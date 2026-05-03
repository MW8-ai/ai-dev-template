# Common Pitfalls and Troubleshooting

## PR Says "No Conflicts" But Checks Fail

Meaning:

Git can merge the files mechanically, but your quality gates failed.

Examples:

- tests failed
- markdown lint failed
- link check failed
- branch naming failed
- PR title failed
- security scan failed

Fix:

- Open failed check logs
- Fix issue locally or in Codespaces
- Commit and push to the same branch
- Let checks rerun

## PR Cannot Merge Because Branch Is Behind

Meaning:

`main` changed after your branch was created.

Fix:

```bash
git checkout feature/my-work
git fetch origin
git merge origin/main
git push
```

Or, if your team uses rebase:

```bash
git checkout feature/my-work
git fetch origin
git rebase origin/main
git push --force-with-lease
```

Use `--force-with-lease`, not plain `--force`, and only if your team allows rebasing shared PR branches.

## I Pushed But GitHub Does Not Show My Changes

Check:

```bash
git status
git branch
git remote -v
git log --oneline -5
```

Common causes:

- pushed wrong branch
- forgot to commit
- pushed to fork instead of upstream
- PR is targeting wrong branch
- browser page needs refresh

## I Opened PR in the Wrong Direction

Wrong:

```text
main → feature/my-work
```

Right:

```text
feature/my-work → main
```

Close the wrong PR and open a new one.

## I Committed to Main Locally By Accident

If not pushed yet:

```bash
git checkout -b feature/recover-work
git push origin feature/recover-work
```

Then reset local main:

```bash
git checkout main
git fetch origin
git reset --hard origin/main
```

Be careful: `reset --hard` discards local uncommitted changes.

## I Accidentally Committed a Secret

Do not just delete it in a new commit.

Steps:

1. Revoke or rotate the secret immediately.
2. Notify the right owner/security contact.
3. Remove it from history using approved tooling.
4. Review logs for misuse.
5. Add secret scanning and prevention.

## I Have Merge Conflicts

Conflict means Git cannot safely decide which change wins.

Fix:

1. Open the conflicting files.
2. Look for conflict markers.
3. Choose the correct final content.
4. Run tests.
5. Commit the conflict resolution.
6. Push.

Conflict markers:

```text
<<<<<<< HEAD
your version
=======
incoming version
>>>>>>> branch-name
```

## I Do Not Know Which Merge Button to Use

Default recommendation:

```text
Squash and merge
```

Use merge commit when preserving the branch history matters.

Use rebase and merge only when your team agrees and understands it.

## I Am in Codespaces and Local VS Code Is Behind

From local:

```bash
git fetch origin
git pull
```

If you have uncommitted local work:

```bash
git status
git stash
git pull
git stash pop
```

## I Am Local and Codespaces Is Behind

From Codespaces:

```bash
git fetch origin
git pull
```

## Golden Rule

```text
When confused, stop and inspect:
git status
git branch
git remote -v
git log --oneline -5
```
