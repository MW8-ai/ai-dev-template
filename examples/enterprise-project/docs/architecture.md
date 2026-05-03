# TeamTracker — Architecture

This document describes the system architecture of the TeamTracker API:
how components fit together, how data flows through the system, and how the infrastructure is organized.

For high-level technology choices and design decisions, see [DESIGN.md](../DESIGN.md).

---

## System Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              Internet                                      │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │ HTTPS (TLS 1.2+)
┌───────────────────────────────▼────────────────────────────────────────────┐
│                    AWS Application Load Balancer                           │
│  • TLS termination              • HTTP → HTTPS redirect                   │
│  • Target group health checks   • Path-based routing (future)             │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │ HTTP (internal VPC)
┌───────────────────────────────▼────────────────────────────────────────────┐
│              AWS ECS Fargate — teamtracker-api service                    │
│              (auto-scaled: 2–10 tasks based on CPU/memory)                │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    Express Application                               │ │
│  │                                                                      │ │
│  │  Request                                                             │ │
│  │    → Rate limiter middleware   (100/min unauthenticated)             │ │
│  │    → Request ID middleware     (x-request-id header)                 │ │
│  │    → Authentication middleware (JWT verify, attach req.user)         │ │
│  │    → Input validation          (Zod schema, 400 on failure)          │ │
│  │    → Route handler             (src/api/*.js)                        │ │
│  │    → Service layer             (src/services/*.js)                   │ │
│  │    → Database / External APIs                                        │ │
│  │    → Response formatter                                              │ │
│  │    → Error handler middleware  (last in chain, formats error body)   │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└──────────────┬──────────────────┬──────────────────┬───────────────────────┘
               │ TCP 5432         │ HTTPS            │ HTTPS
               │                 │                  │
┌──────────────▼──────┐  ┌───────▼──────────┐  ┌────▼──────────────────────┐
│  AWS RDS            │  │  AWS S3           │  │  SendGrid                 │
│  PostgreSQL 15      │  │  (attachments     │  │  (transactional email)    │
│  Multi-AZ           │  │   bucket)         │  │                           │
│  db.t3.medium       │  │                   │  │                           │
│  Encrypted at rest  │  │  SSE-S3 encrypted │  │                           │
│  Automated backups  │  │  Private bucket   │  │                           │
│  (5-min interval)   │  │  Pre-signed URLs  │  │                           │
└─────────────────────┘  └───────────────────┘  └───────────────────────────┘
```

---

## Component Descriptions

### API Layer (`src/api/`)

Express route handlers. Responsibilities:
- Parse and validate HTTP request inputs (query params, body, path params)
- Call one service function per request (no business logic here)
- Format the HTTP response (status code, JSON body)
- Handle known error codes from the service layer and return appropriate HTTP errors

Route files map 1:1 to resource types: `tasks.js`, `teams.js`, `users.js`, `auth.js`.

### Service Layer (`src/services/`)

Business logic and domain rules. Responsibilities:
- Enforce invariants (e.g., assignee must be a team member before creating a task)
- Orchestrate multiple database queries within a logical operation
- Throw named errors (with `.code` property) for known failure modes
- Keep the API layer ignorant of business rules

Service functions receive a `db` (Knex instance) as their first argument — this enables
unit testing by passing a mock database without starting a real PostgreSQL connection.

### Middleware (`src/middleware/`)

- **`auth.js`** — Verifies the `Authorization: Bearer <token>` header, decodes the JWT,
  and attaches `req.user` (id, email, teamId, teamRole) to the request object.
  Returns 401 if the token is missing, invalid, or expired.

- **`validate.js`** — Accepts a Zod schema and a target (`'body'` | `'query'`), validates
  the input, attaches the validated result to `req.validatedBody` or `req.validatedQuery`,
  and returns 400 with a structured error if validation fails.

- **`error-handler.js`** — Global Express error handler. Logs the error, then returns
  a structured JSON error body. Never exposes stack traces or internal details in production.

- **`rate-limit.js`** — Applies rate limits using `express-rate-limit`. Limits:
  100 req/min per IP (unauthenticated), 1,000 req/min per user (authenticated).

### Database Layer

Knex.js is used as a query builder. No full ORM — SQL is written explicitly with Knex's
chainable API. Migrations are in `database/migrations/` and are numbered sequentially.

Connection pool: min 2, max 10 connections per ECS task.
At peak (10 ECS tasks × 10 connections), max 100 connections to RDS.
RDS instance is configured for `max_connections = 200`.

---

## Data Flow — User Creates a Task

This traces a single `POST /tasks` request from the client to the database and back.

```
Client
  │  POST /tasks
  │  Authorization: Bearer eyJ...
  │  { "title": "Fix login bug", "assignee_user_id": "uuid-bob" }
  │
  ▼
Load Balancer
  │  Terminates TLS, passes HTTP to ECS task
  │
  ▼
Rate Limiter Middleware
  │  User is authenticated → applies 1,000/min limit → passes
  │
  ▼
Auth Middleware (src/middleware/auth.js)
  │  Verifies JWT signature and expiry
  │  Decodes payload → { id: "uuid-alice", teamId: "uuid-team-1", teamRole: "admin" }
  │  Attaches to req.user → passes
  │
  ▼
Validate Middleware (src/middleware/validate.js)
  │  Validates body against CreateTaskSchema (Zod)
  │  { title: "Fix login bug", assignee_user_id: "uuid-bob" } ✓
  │  Attaches to req.validatedBody → passes
  │
  ▼
Route Handler (src/api/tasks.js — POST /tasks)
  │  Calls taskService.createTask(req.db, { teamId, createdByUserId, title, assigneeUserId })
  │
  ▼
Service Layer (src/services/task-service.js — createTask)
  │  1. Queries team_members: is "uuid-bob" in "uuid-team-1"? → YES
  │  2. Inserts row into tasks table:
  │       { team_id, created_by_user_id, title, assignee_user_id, status: 'todo', ... }
  │  3. Returns the inserted row, formatted as API shape
  │
  ▼
Route Handler
  │  Receives task object from service
  │  res.status(201).json(task) → sends HTTP 201 with task JSON
  │
  ▼
Client receives:
  HTTP 201
  { "id": "uuid-task-new", "title": "Fix login bug", "status": "todo", ... }
```

---

## Infrastructure

### AWS Services Used

| Service | Role | Configuration |
|---------|------|--------------|
| ECS Fargate | Application hosting | 2–10 tasks, 0.5 vCPU / 1GB RAM each |
| ALB | Load balancing, TLS termination | Multi-AZ, HTTPS only |
| RDS PostgreSQL 15 | Primary database | db.t3.medium, Multi-AZ, 100GB GP3 |
| S3 | File attachment storage | Private bucket, SSE-S3, versioning enabled |
| ECR | Docker image registry | Image scanning enabled |
| Secrets Manager | Secrets storage | Auto-rotation for DB password |
| CloudWatch | Logs | 30-day retention |
| IAM | Access control | Task role with least-privilege permissions |

### Network Layout

```
VPC: 10.0.0.0/16
│
├── Public Subnets (10.0.1.0/24, 10.0.2.0/24) — Multi-AZ
│   └── Application Load Balancer
│
└── Private Subnets (10.0.10.0/24, 10.0.11.0/24) — Multi-AZ
    ├── ECS Fargate Tasks
    └── RDS PostgreSQL (Multi-AZ standby in second private subnet)

Security Groups:
  alb-sg:  inbound 443 from 0.0.0.0/0; outbound 3000 to ecs-sg
  ecs-sg:  inbound 3000 from alb-sg; outbound 5432 to rds-sg; outbound 443 to internet (S3, SendGrid)
  rds-sg:  inbound 5432 from ecs-sg only
```

### Deployment Pipeline

```
Developer pushes to main
         │
         ▼
  GitHub Actions CI
  ┌─────────────────────────────────────────────────────────┐
  │  1. Lint + Type Check (~30s)                            │
  │  2. Unit Tests (~45s)                                   │
  │  3. Integration Tests against PostgreSQL service (~90s) │
  │  4. Coverage check (≥75% required)                      │
  └────────────────────────┬────────────────────────────────┘
                           │ All pass
                           ▼
  GitHub Actions Deploy
  ┌─────────────────────────────────────────────────────────┐
  │  1. Build TypeScript                                    │
  │  2. Build Docker image                                  │
  │  3. Push to ECR (tagged with git SHA)                   │
  │  4. Run DB migrations against staging RDS               │
  │  5. aws ecs update-service (staging cluster)            │
  │  6. Wait for ECS service stable                         │
  │  7. Health check: GET /health → {"status":"ok"}         │
  │  8. Notify Slack                                        │
  └─────────────────────────────────────────────────────────┘
                           │ Staging healthy
                           ▼
  Manual promotion to production
  (follows DEPLOYMENT.md checklist)
```

---

## Key Architecture Decisions

See [DESIGN.md — Key Design Decisions](../DESIGN.md#key-design-decisions) for the full table.

**Why Express over NestJS or Fastify?**
The team values explicit, readable code over framework magic. Express middleware chains are
easy to reason about and debug. Fastify was considered for performance, but the difference
is negligible at our load targets (<200ms p95). NestJS introduces too much abstraction overhead.

**Why Knex over Prisma?**
Prisma's auto-migration system creates footguns at scale (large table migrations, column renaming).
Knex's query builder generates SQL we can read and optimize. The typed query builder pattern
(using JSDoc types or TypeScript with knex) gives us enough type safety without the ORM footguns.

**Why no Redis/cache layer?**
Not needed at current scale. The PostgreSQL query profile is efficient (indexed lookups),
and connection pooling handles concurrency well. If p95 latency degrades past 200ms as scale
grows, Redis query caching will be introduced starting with the task list endpoint.
