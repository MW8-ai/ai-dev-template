# LLM Model Card Example

This example shows how a team might document a Large Language Model (LLM) before using it in a workflow.

---

## Model Information

| Field | Notes |
|---|---|
| Model name | Example coding model |
| Vendor | Example vendor |
| Version / date | Example version |
| Cloud or local | Cloud |
| Reviewer | example reviewer |
| Review date | example date |

---

## Best For

- drafting documentation
- summarizing Pull Requests
- proposing tests
- explaining unfamiliar code

---

## Avoid For

- final approval decisions
- production deployment decisions
- secret handling
- legal, financial, or compliance conclusions without review

---

## Known Failure Modes

- may hallucinate APIs
- may miss edge cases
- may assume missing requirements
- may produce incomplete tests

---

## Decision

Approved for assisted drafting only.

Human review remains required before merge.
