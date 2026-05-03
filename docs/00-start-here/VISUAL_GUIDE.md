# Visual Guide

This page shows the main workflows in this repository as diagrams.

> **Viewing tip:** These render automatically on GitHub. If you see raw text instead of diagrams, open this file on github.com (not raw view).

---

## Learning and Setup Flow

```mermaid
flowchart TD
    A[START_HERE] --> B[GitHub Basics]
    B --> C[Development Environment Setup]
    C --> C1[Windows]
    C --> C2[Mac]
    C --> C3[VS Code]
    C --> C4[GitHub Codespaces]
    C1 --> D
    C2 --> D
    C3 --> D
    C4 --> D
    D[Branch → Commit → Push → Pull Request → Merge] --> E[AI Tools Optional]
    E --> E1[OpenAI Codex]
    E --> E2[Claude Code]
    E --> E3[GitHub Copilot]
    E1 --> F
    E2 --> F
    E3 --> F
    F[Choose Project Type] --> F1[Hobby]
    F --> F2[Enterprise]
    F --> F3[Government]
    F1 --> G[Use Templates]
    F2 --> G
    F3 --> G
    G --> H[Build Project]
```

---

## Daily Developer Workflow

```mermaid
flowchart TD
    A[Create Issue] --> B[Create Branch]
    B --> C[feature/name or fix/name]
    C --> D[Write Code]
    D --> E[Commit Changes]
    E --> F[Push to GitHub]
    F --> G[Open Pull Request]
    G --> H[GitHub Actions Run]
    H --> I[Code Review]
    I --> J[Merge to main]
```

---

## GitHub Actions Enforcement Flow

```mermaid
flowchart TD
    A[Pull Request Opened] --> B[GitHub Actions Run]

    B --> C[PR Checks]
    B --> D[Lint Checks]
    B --> E[Security Checks]

    C --> C1[Required docs exist]
    C --> C2[Branch naming]
    C --> C3[PR checklist]

    D --> D1[Markdown lint]
    D --> D2[Link validation]

    E --> E1[Secret scanning]
    E --> E2[CodeQL]
    E --> E3[Dependency review]
    E --> E4[OpenSSF Scorecard]

    C1 --> F[All Checks Pass?]
    C2 --> F
    C3 --> F
    D1 --> F
    D2 --> F
    E1 --> F
    E2 --> F
    E3 --> F
    E4 --> F

    F -->|Yes| G[Ready to Merge]
    F -->|No| H[Fix Issues and Re-run]
```

---

## AI-Assisted Development Flow

```mermaid
flowchart TD
    A[Developer Task] --> B[Use AI Tool]
    B --> B1[OpenAI Codex]
    B --> B2[Claude Code]
    B --> B3[GitHub Copilot]

    B1 --> C[Generate Code or Plan]
    B2 --> C
    B3 --> C

    C --> D[Human Review]
    D --> E[Validate Logic]
    E --> F[Validate Security]
    F --> G[Commit and Pull Request]
    G --> H[GitHub Actions Validate]
```

---

## Repository Structure Mental Model

```mermaid
flowchart TD
    A[README and START_HERE] --> B[docs]
    B --> B1[Learning and Reference]

    A --> C[templates]
    C --> C1[Copy into new projects]

    A --> D[examples]
    D --> D1[Real-world usage]

    A --> E[.github]
    E --> E1[Automation and CI/CD Enforcement]

    A --> F[scripts]
    F --> F1[Local validation helpers]
```

---

## Simple System Summary

```mermaid
flowchart LR
    A[Learn] --> B[Set Up]
    B --> C[Build]
    C --> D[Review]
    D --> E[Enforce]
    E --> F[Release]
    F --> G[Maintain]
```
