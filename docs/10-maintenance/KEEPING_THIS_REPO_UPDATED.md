# Keeping This Repo Updated

A living playbook that never gets updated becomes misinformation. This doc defines what to review, how often, and who is responsible.

---

## Maintenance Philosophy

This repository is not a static document — it is a system that reflects how professional AI-assisted development is actually done. That means it needs to evolve when:

- GitHub ships a feature that changes how PRs or Actions work
- An AI tool (Claude Code, Codex, Copilot) changes its behavior or capabilities
- A certification retires or a new one launches
- A new local model significantly changes the local LLM recommendations
- A security best practice is superseded by a better approach

The [Living Updates system](../06-living-updates/) automates detection. This doc defines the human response.

---

## What to Review and When

### Weekly (automated — no action usually required)

The `living-updates-watch.yml` workflow runs every Monday. It checks 24+ sources across GitHub, Microsoft, OpenAI, Anthropic, Google, xAI, Meta, Mistral, Hugging Face, Ollama, and certification providers.

**Your only job:** check the `automation/living-updates-*` branch or the issue that gets created. If a new item is relevant, convert it to an impact note or update the affected doc. Most weeks: no action needed.

---

### Monthly

| Area | What to Check | Where |
|---|---|---|
| GitHub Actions workflows | Any deprecated actions or new runner OS versions | `.github/workflows/` |
| AI model table | New local models worth recommending; outdated entries | `docs/04-ai-workflows/LOCAL_LLMS.md` |
| Certifications | Retired exams, pricing changes, new Applied Skills | `docs/04-ai-workflows/AI_CERTIFICATIONS.md` |
| Dependency versions | `actions/checkout`, `actions/setup-*`, `peter-evans/*` | `.github/workflows/` |
| Link rot | Broken links in docs (run lychee or the 02-docs-quality workflow) | `docs/` |

**Time required:** 15–30 minutes if nothing major changed.

---

### Quarterly

| Area | What to Check | Where |
|---|---|---|
| AI tool sections | Major capability changes in Claude Code, Copilot, Codex | `docs/04-ai-workflows/` |
| Security section | New OWASP guidance, secret scanning improvements | `docs/06-standards/SECURITY.md` |
| Compliance docs | NIST/FIPS updates, new executive orders or frameworks | `docs/07-compliance/` |
| Branch protection rules | GitHub new ruleset features worth adopting | `docs/10-github-actions/BRANCH_PROTECTION_EXPANDED.md` |
| Example project | Outdated dependencies, deprecated patterns | `examples/enterprise-project/` |
| OPINIONATED_DEFAULTS | Any defaults worth revisiting based on new tooling | `docs/06-standards/OPINIONATED_DEFAULTS.md` |

**Time required:** 1–2 hours. Run `bash scripts/validate-repo.sh` to catch structural issues.

---

### On Every Major AI Model Release

When a frontier model releases (Claude 4, GPT-5, Gemini 2.0, Llama 4, etc.) check:

- [ ] Model routing table in `CLAUDE.md` still reflects current best choices
- [ ] `AI_OVERVIEW.md` tool comparison is still accurate
- [ ] `LOCAL_LLMS.md` recommendations are still current
- [ ] Any hardcoded model names in templates or prompts should be updated

---

### On Every Major GitHub Feature Release

When GitHub ships something significant (e.g., new ruleset type, Copilot Workspace changes, Actions runner OS changes):

- [ ] Check if any enforcement workflows need updating
- [ ] Check if BRANCH_PROTECTION docs need a new entry
- [ ] Check if PR template or CODEOWNERS guidance needs updating

---

## How to Update

1. **File a draft note** in `docs/06-living-updates/incoming/` (use the template at `docs/06-living-updates/templates/update-note-template.md`)
2. **Write an impact note** in `docs/06-living-updates/impacts/` if the update changes team guidance
3. **Update the affected doc** — edit in place, keep the "Next Step" chain intact
4. **Update CHANGELOG.md** with a `docs:` entry
5. **Open a PR** — even doc-only changes go through review

---

## Repo Health Check

Run this before any major update cycle:

```bash
bash scripts/validate-repo.sh
```

Expected output: all checks green. If anything fails, fix it before adding new content.

---

## Signs This Repo Needs Attention

- A living-updates incoming note references a doc that no longer has the same structure
- A certification listed as "Active" is actually retired
- A local model listed as recommended has been superseded
- A GitHub Action in a workflow uses a deprecated `@v2` or `@v3` tag
- The `examples/enterprise-project/` dependencies are more than 6 months old
- The Node.js version in workflows is behind the current LTS

---

## Next Step

→ [RELEASE_CADENCE.md](RELEASE_CADENCE.md) — versioning and release process for this template itself
