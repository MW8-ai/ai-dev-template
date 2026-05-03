# Design Document — [PROJECT_NAME]

<!-- INSTRUCTION: Fill in the project name above. This document captures architecture decisions,
     technology choices, and design rationale. Keep it up to date as the system evolves.
     Review and update on every major release or architectural change. -->

## Project Overview

<!-- INSTRUCTION: Write 1-2 sentences describing what this system does and who uses it.
     Be specific: mention the domain, primary users, and core value delivered. -->

[PROJECT_NAME] is a [type of system] that enables [primary users] to [core capability].
It is used by [audience size/type] and is responsible for [key business function].

---

## Architecture Diagram

<!-- INSTRUCTION: Replace this ASCII placeholder with a diagram of your actual system.
     Show major components, how they communicate, and where data flows.
     Tools: draw.io, Mermaid, Lucidchart. Export to PNG and link it, or keep ASCII for simplicity. -->

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                              │
│              (Browser / Mobile / CLI / API)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────────┐
│                    API Gateway / Load Balancer               │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │      Application        │
          │      Service(s)         │
          └────┬──────────────┬─────┘
               │              │
    ┌──────────▼───┐   ┌──────▼──────────┐
    │   Database   │   │  External APIs   │
    │  (Primary)   │   │  / Services      │
    └──────────────┘   └─────────────────┘
```

> Replace this diagram with your actual architecture before sharing with stakeholders.

---

## Technology Choices

<!-- INSTRUCTION: List every major technology decision. "Why" is the most important column —
     explain the reasoning, not just the name. Include version numbers where relevant. -->

| Layer              | Technology              | Why                                                      |
|--------------------|-------------------------|----------------------------------------------------------|
| API Framework      | [e.g., Express, FastAPI] | [e.g., lightweight, team familiarity, strong ecosystem] |
| Language           | [e.g., TypeScript]      | [e.g., type safety, catches errors at compile time]     |
| Database           | [e.g., PostgreSQL 15]   | [e.g., ACID compliance, relational data model, free]    |
| Cache              | [e.g., Redis]           | [e.g., session storage, pub/sub, sub-millisecond reads] |
| Auth               | [e.g., JWT + bcrypt]    | [e.g., stateless, works across multiple services]       |
| Hosting            | [e.g., AWS ECS]         | [e.g., container-native, team knows AWS, cost profile]  |
| CI/CD              | [e.g., GitHub Actions]  | [e.g., free for open source, tight GitHub integration]  |
| Observability      | [e.g., Datadog]         | [e.g., already licensed org-wide, alerting built in]    |

---

## Key Design Decisions

<!-- INSTRUCTION: Record every significant architectural or design decision with its rationale.
     This table is the most valuable part of this document — it prevents relitigating past decisions.
     Add a row whenever a non-obvious choice is made. -->

| Decision | Alternatives Considered | Reason Chosen | Date |
|----------|------------------------|---------------|------|
| [e.g., REST API over GraphQL] | GraphQL, gRPC | [e.g., simpler client needs; no nested query requirements] | YYYY-MM-DD |
| [e.g., Monorepo] | Polyrepo | [e.g., shared types, single CI pipeline, easier refactoring] | YYYY-MM-DD |
| [e.g., JWT for auth] | Sessions, OAuth-only | [e.g., stateless; scales without sticky sessions] | YYYY-MM-DD |
| [e.g., Soft deletes] | Hard deletes | [e.g., audit trail required; supports undelete feature] | YYYY-MM-DD |

---

## Data Model

<!-- INSTRUCTION: Describe the main entities in the system and their relationships.
     Add an ERD diagram (draw.io, dbdiagram.io, or schema export) or paste the DB schema below.
     At minimum, list each table/collection and its key fields. -->

**Main entities:**

- **[Entity A]** — [what it represents, key fields]
- **[Entity B]** — [what it represents, key fields]
- **[Entity C]** — [what it represents, key fields]

**Relationships:**
- A [Entity A] has many [Entity B] records (one-to-many)
- A [Entity B] belongs to exactly one [Entity A]

> Add ERD or schema here. Recommended: paste output of `pg_dump --schema-only` or a dbdiagram.io link.

---

## External Dependencies

<!-- INSTRUCTION: List every external system this project depends on: APIs, data stores,
     message queues, third-party services, etc. Include what happens if each one is unavailable. -->

| Service | Purpose | Failure Mode | Documentation |
|---------|---------|--------------|---------------|
| [e.g., SendGrid] | Transactional email | Queue emails; retry; alert on-call | [link] |
| [e.g., AWS S3] | File storage | Return error; block uploads | [link] |
| [e.g., Stripe] | Payment processing | Disable checkout flow | [link] |
| [e.g., Auth0] | Identity provider | Block all logins | [link] |

---

## Non-Functional Requirements

<!-- INSTRUCTION: Define measurable targets. Vague goals ("be fast") are not actionable.
     These targets drive infrastructure decisions, load testing, and SLA commitments. -->

| Requirement | Target | Notes |
|-------------|--------|-------|
| Availability | [e.g., 99.9% uptime] | [~8.7 hours downtime/year; excludes planned maintenance] |
| Latency (p95) | [e.g., <200ms API response] | [measured at load balancer; excludes file uploads] |
| Throughput | [e.g., 10,000 concurrent users] | [peak load estimate; validate with load test] |
| Data retention | [e.g., 7 years] | [compliance requirement] |
| Recovery time (RTO) | [e.g., <1 hour] | [time to restore from backup] |
| Recovery point (RPO) | [e.g., <5 minutes data loss] | [backup frequency requirement] |

---

## Security Considerations

<!-- INSTRUCTION: Describe the security controls this system implements.
     Reference SECURITY.md for the full policy. This section covers design-level choices. -->

- **Authentication:** [e.g., JWT tokens, 1-hour expiry, refresh token rotation]
- **Authorization:** [e.g., role-based access control (RBAC); roles: admin, member, viewer]
- **Data in transit:** [e.g., TLS 1.2+ required on all connections]
- **Data at rest:** [e.g., AES-256 encryption on database volume; S3 SSE-S3]
- **Secrets management:** [e.g., stored in AWS Secrets Manager; never in code or environment files]
- **Input validation:** [e.g., schema validation on all API inputs using Zod/Joi/Pydantic]
- **Rate limiting:** [e.g., 100 req/min per IP; 1000 req/min per authenticated user]
- **Audit logging:** [e.g., all write operations logged with user ID and timestamp]

---

## Open Questions

<!-- INSTRUCTION: Track architectural questions that haven't been resolved yet.
     Remove items as they're decided (add them to Key Design Decisions above).
     This prevents questions from being forgotten or silently answered without team input. -->

| Question | Owner | Target Resolution Date |
|----------|-------|----------------------|
| [e.g., Should we use event sourcing for the audit trail?] | [Name] | YYYY-MM-DD |
| [e.g., Do we need multi-region failover in v1?] | [Name] | YYYY-MM-DD |
| [e.g., What is our strategy for database migrations in zero-downtime deploys?] | [Name] | YYYY-MM-DD |
