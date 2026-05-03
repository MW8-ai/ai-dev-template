# Living Updates System

## What This Is

A continuously adapting intelligence layer for your development system.

Not a news feed. Not a changelog mirror. A structured process for converting platform changes into updated team guidance — automatically detected, manually reviewed, deliberately applied.

```text
Automation watches.
Humans decide.
Docs evolve.
```

---

## Why This Exists

Tools evolve faster than documentation.

Without this system:
- Teams use outdated workflows because nobody noticed the platform changed
- AI guidance becomes stale as model capabilities and tool behaviors shift
- Best practices fall behind reality — and nobody knows it

With this system:
- A scheduled Action monitors curated platform feeds weekly
- New items land in `incoming/` as draft notes
- A human reviews: is this meaningful? what changes?
- Approved conclusions become impact notes in `impacts/`
- Docs update, AI guardrails update, CI/CD updates — as needed

---

## The Three-Layer Model

Most repos track "what changed." This system tracks what changed → why it matters → what to do differently.

```
incoming/     Raw auto-detected notes. Unreviewed. May or may not be relevant.
summaries/    Short human-written plain-language explanations.
impacts/      Approved guidance changes. These drive doc and workflow updates.
archive/      Reviewed, no action required.
```

### The Filter

Only include updates that:

- Change how Pull Requests are reviewed or merged
- Affect GitHub Actions, CI/CD behavior, or workflow triggers
- Shift AI tool behavior (Copilot, Codex, Claude Code, Gemini Code Assist)
- Affect security posture, branch protection, or repository permissions
- Change model availability, pricing, rate limits, or API behavior
- Introduce or deprecate a feature teams depend on

Exclude: marketing, minor UI polish, unrelated announcements.

---

## Sources Monitored

| Vendor | Source | Priority |
|---|---|---|
| GitHub | Blog changelog RSS | High |
| Anthropic | Claude Code changelog + GitHub releases | High |
| OpenAI | API changelog, Codex changelog | High |
| Google | Gemini API changelog, Gemini Code Assist releases | Medium |
| xAI | Grok API release notes | Medium |

Source configuration lives in `sources/update-sources.yml`. Approved update notes filed by vendor live in `sources/<vendor>/`.

---

## Structure

```
docs/06-living-updates/
├── README.md                          ← this file
├── SETUP.md                           ← how to enable the automation
├── sources/
│   ├── update-sources.yml             ← RSS + page source registry
│   ├── seen-updates.json              ← automation state (auto-maintained)
│   ├── github/                        ← filed notes from GitHub updates
│   ├── anthropic/                     ← filed notes from Anthropic updates
│   ├── openai/                        ← filed notes from OpenAI updates
│   ├── google/                        ← filed notes from Google updates
│   └── xai/                           ← filed notes from xAI updates
├── incoming/                          ← auto-generated draft notes (unreviewed)
├── summaries/                         ← plain-language summaries (human-written)
├── impacts/                           ← approved guidance changes
│   ├── README.md
│   ├── pr-reviewing.md                ← updated PR review standards
│   └── ai-dev-workflow.md             ← AI-assisted development guardrails
├── templates/
│   ├── update-note-template.md        ← template for filing a source update
│   └── impact-note-template.md        ← template for writing an impact note
├── examples/
│   └── github-files-changed-update-example.md
└── archive/                           ← reviewed, no action taken
```

---

## Weekly Automation

The `living-updates-watch.yml` workflow runs every Monday at 9:20 UTC.

It fetches each source in `update-sources.yml`, checks for new items not in `seen-updates.json`, and writes draft notes to `incoming/`. If new files are created, it opens a Pull Request titled "docs: review detected platform updates" for human review.

To trigger manually: **Actions → Living Updates Watch → Run workflow**

---

## Human Review Process

When the automation opens a PR:

1. Open each file in `incoming/`
2. Answer: is this meaningful for our workflow, AI tooling, security, or CI/CD?
3. If yes → write or update an impact note in `impacts/`, then move source note to `sources/<vendor>/`
4. If no → move to `archive/` with a one-line note explaining why no action
5. Merge the PR

The automation creates; the human judges; the docs reflect reality.

---

## Manual Updates

You don't need the automation to contribute. If you notice a platform change that matters:

1. Copy `templates/update-note-template.md`
2. Fill it in and save to `incoming/` or directly to `sources/<vendor>/`
3. Write an impact note if guidance should change
4. Open a PR

---

## Next Step

→ `docs/06-living-updates/SETUP.md` — enable the automation in your repository
