# Feature Build Prompt Template

<!-- HOW TO USE THIS TEMPLATE:
     1. Copy the prompt block below (everything inside the triple backticks).
     2. Replace all [BRACKETED] placeholders with real values.
     3. Paste into your AI tool (Claude Code, Cursor, ChatGPT, etc.).
     4. Attach or reference the relevant source files if your tool supports it.

     TIPS:
     - The more specific your requirements, the better the output.
     - Always read AGENTS.md and DESIGN.md yourself before running this prompt
       so you can verify the AI followed the project conventions.
     - After the AI produces output, review it against CONTRIBUTING.md and run tests. -->

---

```
Role: You are a [LANGUAGE] developer implementing a feature in a [FRAMEWORK] project.

Context:
- Project: [PROJECT_NAME]
- Repo docs to read first: AGENTS.md, DESIGN.md, TECH_STACK.md
- Current task: Implement [FEATURE_NAME] as described in issue #[ISSUE_NUMBER]
- Working branch: feature/[BRANCH_NAME]

Requirements:
[PASTE THE FULL ISSUE DESCRIPTION OR ACCEPTANCE CRITERIA HERE.
Be specific. Include:
- What the feature does (user-facing behavior)
- What it does NOT do (scope limits)
- Edge cases to handle
- Performance requirements if any
- API contract if this is a backend feature (endpoints, request/response shape)]

Constraints:
- Work only on branch: feature/[BRANCH_NAME]
- Do not modify these files: [LIST FILES TO NOT TOUCH, e.g., "src/auth/middleware.js, database/schema.sql"]
- Do not add new npm/pip/gem dependencies without flagging them for human review
- Write or update tests for all new behavior — no untested code
- Update CHANGELOG.md under the "## Unreleased" section
- Follow the code style and patterns already used in this codebase — don't introduce new patterns

Technical context:
- Language/runtime: [e.g., TypeScript, Node.js 20]
- Framework: [e.g., Express 4, FastAPI, Rails 7]
- Database: [e.g., PostgreSQL 15 via Prisma ORM]
- Test framework: [e.g., Jest, pytest, RSpec]
- Key existing files relevant to this feature:
  - [e.g., src/services/task-service.js — business logic layer]
  - [e.g., src/api/tasks.js — route handlers for tasks]
  - [e.g., tests/task-service.test.js — existing tests to build on]

Definition of done:
- [ ] All acceptance criteria from the issue are implemented
- [ ] Unit tests cover the new logic
- [ ] Integration test covers the main success path
- [ ] No linter errors (npm run lint / flake8 / rubocop)
- [ ] All existing tests still pass
- [ ] CHANGELOG.md updated

Output format — respond with:
1. A list of files created or modified (with a one-line description of each change)
2. The full content of each changed file
3. Test cases added (list them)
4. Any decisions you made that a human should review before merging
5. Any flags: dependencies added, security implications, breaking changes
```

---

## Example (filled in)

```
Role: You are a TypeScript developer implementing a feature in an Express/Node.js project.

Context:
- Project: TeamTracker API
- Repo docs to read first: AGENTS.md, DESIGN.md, TECH_STACK.md
- Current task: Implement CSV export for task lists as described in issue #142
- Working branch: feature/csv-export

Requirements:
Users need to export their team's task list as a CSV file.

Acceptance criteria:
- GET /tasks/export returns a CSV file download
- CSV includes columns: id, title, status, assignee_name, due_date, created_at
- Endpoint requires authentication (same as GET /tasks)
- Only returns tasks for the authenticated user's team
- Returns 200 with Content-Type: text/csv and Content-Disposition: attachment; filename="tasks.csv"
- If team has no tasks, returns empty CSV with header row only
- Handles up to 10,000 tasks without timeout

Out of scope:
- Custom column selection (future feature)
- Excel format (CSV only for now)

Constraints:
- Do not modify: src/auth/middleware.js, database/schema.sql
- Do not add new dependencies without flagging them
- Write tests for: empty team, normal export, auth required
- Update CHANGELOG.md

Technical context:
- TypeScript, Node.js 20, Express 4
- PostgreSQL 15 via Knex.js
- Test framework: Jest + Supertest
- Key files: src/api/tasks.js (add route here), src/services/task-service.js (add getTeamTasksForExport())
```
