# Design Document — TeamTracker API

TeamTracker is a REST API for team task management that enables organizations to create teams,
assign tasks to members, and collaborate through comments and file attachments.
It serves engineering teams of 5–500 members and is the backend for the TeamTracker web and mobile clients.

---

## Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────┐
│                         Clients                                  │
│           Web App (React)    Mobile App (React Native)           │
└───────────────────────┬──────────────────────────────────────────┘
                        │ HTTPS / JSON
┌───────────────────────▼──────────────────────────────────────────┐
│                  AWS Application Load Balancer                   │
│              (TLS termination, health checks, routing)           │
└───────────────────────┬──────────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────────┐
│               TeamTracker API (Express / Node.js 20)             │
│               Running on AWS ECS Fargate (auto-scaled)           │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐ │
│  │  API Layer  │  │  Services   │  │     Middleware            │ │
│  │  (routes)   │→ │  (business  │  │  auth, validation,        │ │
│  │             │  │   logic)    │  │  rate limiting, logging   │ │
│  └─────────────┘  └──────┬──────┘  └──────────────────────────┘ │
└─────────────────────────-│───────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
┌──────────▼───────┐  ┌────▼──────┐  ┌────▼───────────┐
│  PostgreSQL 15   │  │ AWS S3    │  │  SendGrid      │
│  (AWS RDS Multi- │  │ (file     │  │  (email        │
│  AZ)             │  │  storage) │  │   delivery)    │
└──────────────────┘  └───────────┘  └────────────────┘
```

---

## Technology Choices

| Layer | Technology | Why |
|-------|-----------|-----|
| Language | TypeScript 5.4 | Type safety catches bugs at compile time; excellent IDE support; team consensus |
| Runtime | Node.js 20 (LTS) | Event loop handles concurrent I/O well; large npm ecosystem; team familiarity |
| API Framework | Express 4.18 | Minimal and flexible; well-understood; no magic; easy to add middleware |
| Database | PostgreSQL 15 | Relational data model fits tasks/teams/users; ACID compliance; strong ecosystem |
| Query Builder | Knex.js 3 | SQL-first without full ORM magic; composable queries; migrations built in |
| Auth | JWT (jsonwebtoken) | Stateless; scales across multiple instances without shared session store |
| Password hashing | bcrypt (cost 12) | Industry standard; intentionally slow to resist brute force |
| Input validation | Zod | TypeScript-native; schemas double as type definitions |
| Email | SendGrid | Reliable delivery; good free tier; simple REST API; team already licensed |
| File storage | AWS S3 | Durable, cheap, scales automatically; already on AWS |
| Hosting | AWS ECS Fargate | Serverless containers; no EC2 instance management; right-sizes automatically |
| Database hosting | AWS RDS PostgreSQL | Managed backups, Multi-AZ failover, point-in-time recovery |
| CI/CD | GitHub Actions | Free for our usage; tight GitHub integration; team already knows it |
| Observability | Datadog | Already org-licensed; APM + logs + alerting in one place |

---

## Key Design Decisions

| Decision | Alternatives Considered | Reason Chosen | Date |
|----------|------------------------|---------------|------|
| REST over GraphQL | GraphQL, gRPC | Clients have simple, predictable data needs; REST is easier to cache and document; team has REST expertise | 2026-01-15 |
| PostgreSQL over MongoDB | MongoDB, DynamoDB | Data is relational (users → teams → tasks → comments); ACID compliance required for task assignment; better query flexibility | 2026-01-15 |
| Knex over Prisma ORM | Prisma, TypeORM, raw SQL | SQL-first approach; no auto-migration footguns; composable query building; easier to debug generated SQL | 2026-01-20 |
| Soft deletes over hard deletes | Hard deletes, archive table | Audit trail is required; users expect "undo" capability; simplifies foreign key constraints | 2026-01-22 |
| JWT over sessions | Cookie sessions, database sessions | Stateless auth scales without Redis dependency; works across mobile and web | 2026-01-22 |
| Monorepo (single service) | Microservices | Team of 8; premature microservices add operational overhead without benefit at this scale | 2026-02-01 |
| ECS Fargate over Lambda | Lambda, EC2, EKS | Persistent connections needed for DB pooling; Lambda cold starts unacceptable; Fargate simpler than EKS | 2026-02-01 |

---

## Data Model

**Main entities:**

- **Users** — `id`, `email`, `password_hash`, `name`, `created_at`, `deleted_at`
- **Teams** — `id`, `name`, `created_by_user_id`, `created_at`, `deleted_at`
- **Team Members** — `team_id`, `user_id`, `role` (owner|admin|member), `joined_at`
- **Tasks** — `id`, `team_id`, `title`, `description`, `status` (todo|in_progress|done), `assignee_user_id`, `due_date`, `created_by_user_id`, `created_at`, `updated_at`, `deleted_at`
- **Comments** — `id`, `task_id`, `user_id`, `body`, `created_at`, `deleted_at`
- **Attachments** — `id`, `task_id`, `user_id`, `filename`, `s3_key`, `file_size`, `mime_type`, `created_at`

**Key relationships:**

- A User belongs to many Teams (via Team Members); a Team has many Users
- A Team has many Tasks; a Task belongs to one Team
- A Task has one optional assignee (User); a User can have many assigned Tasks
- A Task has many Comments; a Comment belongs to one Task and one User
- A Task has many Attachments; an Attachment belongs to one Task

**Schema overview:**

```sql
users           (id, email UNIQUE, password_hash, name, created_at, deleted_at)
teams           (id, name, created_by_user_id FK users, created_at, deleted_at)
team_members    (team_id FK teams, user_id FK users, role, joined_at) PK(team_id, user_id)
tasks           (id, team_id FK teams, title, description, status, assignee_user_id FK users,
                 due_date, created_by_user_id FK users, created_at, updated_at, deleted_at)
comments        (id, task_id FK tasks, user_id FK users, body, created_at, deleted_at)
attachments     (id, task_id FK tasks, user_id FK users, filename, s3_key, file_size,
                 mime_type, created_at)
```

---

## External Dependencies

| Service | Purpose | Failure Mode | Documentation |
|---------|---------|--------------|---------------|
| AWS RDS PostgreSQL | Primary database | App returns 503; circuit breaker activates | [AWS RDS Docs](https://docs.aws.amazon.com/rds/) |
| AWS S3 | File attachment storage | File upload/download endpoints return 503; task read/write unaffected | [AWS S3 Docs](https://docs.aws.amazon.com/s3/) |
| SendGrid | Transactional email (invitations, notifications) | Email silently queued; alert triggers after 10 failures; no user data lost | [SendGrid Docs](https://docs.sendgrid.com/) |
| AWS ECS | Container orchestration | App auto-restarts; multi-AZ prevents full outage | [AWS ECS Docs](https://docs.aws.amazon.com/ecs/) |
| Datadog | Metrics, logs, alerting | Observability blind; does not affect serving requests | [Datadog Docs](https://docs.datadoghq.com/) |

---

## Non-Functional Requirements

| Requirement | Target | Notes |
|-------------|--------|-------|
| Availability | 99.9% uptime | ~8.7 hours downtime/year; measured over rolling 30 days |
| API latency (p95) | < 200ms | Measured at load balancer; excludes file upload/download |
| API latency (p99) | < 500ms | |
| Throughput | 10,000 concurrent users | Validated via load test before each major release |
| Task list response | < 100ms p95 at 500 RPS | Primary user-facing operation |
| Data retention | 7 years (audit logs) | Compliance requirement for enterprise customers |
| RTO (recovery time) | < 1 hour | Time to restore service from any failure mode |
| RPO (recovery point) | < 5 minutes data loss | RDS automated backups every 5 minutes |
| Max file size | 10 MB per attachment | Enforced at API layer before S3 upload |

---

## Security Considerations

- **Authentication:** JWT tokens, 1-hour expiry, refresh token rotation on every use. Tokens are invalidated on password change.
- **Authorization:** RBAC enforced at the service layer. Roles per team: `owner`, `admin`, `member`. Owners can delete teams; admins can manage members; members can create and edit tasks.
- **Data in transit:** TLS 1.2+ required. ALB enforces HTTPS redirect. HSTS header set.
- **Data at rest:** RDS volume encrypted with AES-256 (AWS KMS-managed key). S3 buckets encrypted with SSE-S3. No sensitive fields stored in application logs.
- **Secrets management:** All secrets in AWS Secrets Manager. Application reads secrets at startup. No secrets in environment variable files or code.
- **Input validation:** All API inputs validated with Zod schemas before reaching service layer. SQL injection prevented by Knex.js parameterized queries. File uploads restricted to allowed MIME types and size.
- **Rate limiting:** 100 requests/minute per IP (unauthenticated); 1,000 requests/minute per authenticated user. Rate limit headers returned on every response.
- **Audit logging:** All write operations (create, update, delete) logged with user ID, timestamp, resource type, and resource ID.

---

## Open Questions

| Question | Owner | Target Resolution Date |
|----------|-------|----------------------|
| Should we support real-time task updates via WebSockets or SSE? Needed for v2. | @alice | 2026-06-01 |
| Do we need multi-region for the EU customer tier? GDPR data residency implications. | @bob | 2026-06-15 |
| What is the strategy for database schema migrations in zero-downtime deploys once table sizes exceed 10M rows? | @carol | 2026-07-01 |
