Draft a CHANGELOG.md entry for the changes on the current branch.

Steps:
1. Run `git log main..HEAD --oneline` to see commits on this branch
2. Run `git diff main...HEAD --stat` to see which files changed
3. Read CHANGELOG.md to match the existing format and style

Draft an entry under `## Unreleased` that:
- Lists each meaningful change as a bullet point
- Groups by type if there are many (Added, Changed, Fixed, Removed)
- Is written for a human reader, not a git log reader
- Does not repeat commit message text verbatim

Show the draft. Do not write it to the file until I confirm.
