# LLM Model Registry

LLM stands for **Large Language Model**.

This registry is a lightweight way to track model options without turning this repository into a stale leaderboard.

Models change quickly. Always verify current capabilities, pricing, context limits, rate limits, and availability before adoption.

---

## Registry Rule

Do not rank models as universally best.

Track them by use case:

- coding agent
- planning and reasoning
- fast summarization
- long-context review
- local/private experimentation
- multimodal work
- enterprise or government-friendly usage

---

## Model Card Template

```md
## Model Name

Vendor:
Best for:
Avoid for:
Context / input notes:
Tool use:
Local or cloud:
Cost notes:
Privacy notes:
Known failure modes:
Last reviewed:
Source:
```

---

## Example Categories

| Category | What To Look For |
|---|---|
| Coding agent | repo editing, tool use, test feedback, PR workflow support |
| Planning / reasoning | multi-step decomposition, architecture review, trade-off analysis |
| Fast summarization | low cost, low latency, good enough accuracy |
| Long-context review | can handle large docs, specs, logs, or codebases |
| Local/private | runs on local hardware or private infrastructure |
| Multimodal | image, screenshot, diagram, or UI understanding |
| Enterprise/government | admin controls, audit logs, data handling, compliance posture |

---

## Model Review Checklist

Before adding a model to a project standard, review:

- [ ] vendor documentation
- [ ] current model name and version
- [ ] pricing
- [ ] context limits
- [ ] rate limits
- [ ] data retention and training policy
- [ ] tool/function calling support
- [ ] structured output support
- [ ] code-generation quality
- [ ] security and compliance fit
- [ ] known failure modes
- [ ] fallback model

---

## Governance Notes

For team use, document:

- approved models
- disallowed models
- default model by task
- cost thresholds
- human approval requirements
- data classes allowed for each model

---

## Next Step

Continue to:

[TOOL_ADOPTION_PLAYBOOK.md](TOOL_ADOPTION_PLAYBOOK.md)
