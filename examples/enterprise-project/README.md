# TeamTracker API

TeamTracker is a team task management API that enables organizations to create teams,
assign tasks to members, track progress, and collaborate through comments. It is a
production-grade example project demonstrating enterprise Node.js/TypeScript API patterns.

---

## Architecture Overview

TeamTracker follows a 3-tier architecture:

```
┌─────────────────────────────────────────┐
│            API Layer                    │
│  Express routes, auth middleware,       │
│  input validation, HTTP response        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│            Service Layer                │
│  Business logic, domain rules,          │
│  orchestration of data operations       │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│            Data Layer                   │
│  PostgreSQL via Knex.js, migrations,    │
│  query builders, DB connection pool     │
└─────────────────────────────────────────┘
```

**External services:**
- SendGrid — transactional email (invitations, notifications)
- AWS S3 — file attachments on tasks

---

## Quick Start for Developers

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker (for local database)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/example/teamtracker.git
cd teamtracker

# 2. Install dependencies
npm ci

# 3. Start the local database
docker-compose up -d db

# 4. Copy environment config
cp .env.example .env
# Edit .env — the defaults work for local development with Docker

# 5. Run database migrations
npm run db:migrate

# 6. Seed with sample data (optional)
npm run db:seed

# 7. Start the development server
npm run dev
# API available at http://localhost:3000
```

### Verify setup

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","version":"1.2.0","db":"connected"}
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [DESIGN.md](DESIGN.md) | Architecture, technology choices, key decisions |
| [TESTING.md](TESTING.md) | Test strategy, how to run tests, coverage requirements |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Environments, deploy steps, rollback procedure |
| [CHANGELOG.md](CHANGELOG.md) | Version history and release notes |
| [CONTRIBUTING.md](../../templates/project/CONTRIBUTING.md) | How to contribute |
| [docs/architecture.md](docs/architecture.md) | Detailed system architecture |
| [SECURITY.md](../../templates/project/SECURITY.md) | Security policy and controls |

---

## Running Tests

```bash
npm test                    # Unit tests
npm run test:integration    # Integration tests (requires running DB)
npm run test:all            # All tests with coverage
npm run lint                # ESLint
npm run typecheck           # TypeScript type checking
```

---

## API Overview

All endpoints require authentication (`Authorization: Bearer <token>`) except where noted.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Log in, receive JWT |
| `GET` | `/health` | Health check (no auth required) |
| `GET` | `/teams` | List teams for current user |
| `POST` | `/teams` | Create a new team |
| `GET` | `/tasks` | List tasks for user's team |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task (soft delete) |
| `GET` | `/tasks/export` | Export tasks as CSV |
| `GET` | `/tasks/:id/comments` | List comments on a task |
| `POST` | `/tasks/:id/comments` | Add a comment |
