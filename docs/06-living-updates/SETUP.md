# Living Updates Watch Setup

## What This Adds

A scheduled GitHub Action monitors curated platform update sources every Monday and opens a Pull Request when new items are detected.

## Required Repository Setting

**This must be done before the workflow can open PRs.**

1. Go to your repository on GitHub
2. **Settings → Actions → General**
3. Scroll to **Workflow permissions**
4. Enable: **"Allow GitHub Actions to create and approve pull requests"**
5. Save

Without this, the workflow will detect updates but fail with:
> GitHub Actions is not permitted to create or approve pull requests

The workflow itself already has `pull-requests: write` in its permissions block — the repo-level setting is the additional unlock.

---

## Files

```text
.github/workflows/living-updates-watch.yml   ← weekly schedule + PR creation
scripts/living_updates_watch.py              ← RSS/web watcher + dedup logic
docs/06-living-updates/sources/update-sources.yml  ← source registry
docs/06-living-updates/sources/seen-updates.json   ← dedup state (auto-maintained)
```

---

## First Run

After enabling the repository setting above:

```
Actions → Living Updates Watch → Run workflow
```

The first run will populate `docs/06-living-updates/sources/seen-updates.json` with all currently-seen items so future runs only surface genuinely new updates.

---

## What Happens Each Run

1. The script fetches each source in `update-sources.yml`
2. New items not in `seen-updates.json` are written as draft notes to `incoming/`
3. `seen-updates.json` is updated to record what was seen
4. If any new files were created, a PR is opened titled "docs: review detected platform updates"
5. A human reviews each file in `incoming/` and decides: impact note, summary, archive, or no action

---

## Labels

The PR automation applies three labels: `type: documentation`, `automation`, `needs review`.

These labels must exist in the repository. Create them manually or let the labeler workflow create them on first use. If the labels don't exist, the PR is still created — GitHub silently ignores missing labels.

---

## Adjusting Sources

Edit `docs/06-living-updates/sources/update-sources.yml` to:
- Add a new vendor source (RSS or web page)
- Change `include_keywords` to tighten or broaden filtering
- Change `priority` to indicate importance level
- Disable a source by removing it from the file

---

## Important

This is intentionally human-in-the-loop.

```text
Detect automatically. Interpret manually. Merge only after review.
```

The automation should never rewrite best-practice docs directly. It surfaces candidates. Humans decide what to do with them.
