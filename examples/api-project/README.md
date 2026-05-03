# Todo API — Example REST API Project

A simple REST API for managing a to-do list. This is an example project showing how to structure
a Node.js/Express API with a PostgreSQL database, environment configuration, and basic tests.

Use this as a reference for starting your own API project.

---

## What This API Does

The Todo API lets users create, list, and delete to-do items. It demonstrates:
- RESTful endpoint design
- Environment variable configuration
- Input validation and error handling
- Database integration (PostgreSQL)
- Basic authentication (JWT)
- Automated tests with Jest

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check — returns `{"status":"ok"}` |
| `GET` | `/todos` | List all todos for the authenticated user |
| `POST` | `/todos` | Create a new todo item |
| `DELETE` | `/todos/:id` | Delete a todo item by ID |

### Example requests

**List todos**
```http
GET /todos
Authorization: Bearer <your-jwt-token>
```

**Create a todo**
```http
POST /todos
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Buy groceries",
  "due_date": "2026-05-10"
}
```

**Response**
```json
{
  "id": "a1b2c3d4",
  "title": "Buy groceries",
  "completed": false,
  "due_date": "2026-05-10",
  "created_at": "2026-05-03T12:00:00Z"
}
```

**Delete a todo**
```http
DELETE /todos/a1b2c3d4
Authorization: Bearer <your-jwt-token>
```

---

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm

### Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/example/todo-api.git
cd todo-api
npm ci

# 2. Copy the environment file and fill in your values
cp .env.example .env
# Open .env and set DATABASE_URL to your local PostgreSQL connection string

# 3. Create the database and run migrations
createdb todos_dev
npm run db:migrate

# 4. Start the server
npm run dev
# Server starts at http://localhost:3000
```

### Verify it's working

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","version":"1.0.0"}
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. See `.env.example` for descriptions.

Required variables before running:
- `DATABASE_URL` — your local PostgreSQL connection string
- `JWT_SECRET` — any long random string for local development

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on save)
npm test -- --watch

# Run with coverage report
npm test -- --coverage
```

Tests use an in-memory SQLite database — no PostgreSQL required for testing.

---

## Project Structure

```
todo-api/
├── src/
│   ├── app.js            # Express app setup
│   ├── server.js         # Server entry point
│   ├── routes/
│   │   └── todos.js      # Route handlers for /todos
│   ├── services/
│   │   └── todo-service.js  # Business logic
│   └── middleware/
│       ├── auth.js       # JWT authentication middleware
│       └── validate.js   # Input validation middleware
├── tests/
│   └── todos.test.js     # Jest test suite
├── migrations/
│   └── 001_create_todos.sql
├── .env.example          # Environment variable template
└── package.json
```
