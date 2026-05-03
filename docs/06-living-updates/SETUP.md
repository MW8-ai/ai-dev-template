# Living Updates Watch Setup

## What This Adds

A scheduled GitHub Action watches curated platform update sources and opens a Pull Request when new items are detected.

## Files

```text
.github/workflows/living-updates-watch.yml
scripts/living_updates_watch.py
docs/06-living-updates/
```

## First Run

```text
Actions → Living Updates Watch → Run workflow
```

## Important

This is intentionally human-in-the-loop. It should not automatically rewrite your best-practice docs.

```text
Detect automatically. Interpret manually. Merge only after review.
```
