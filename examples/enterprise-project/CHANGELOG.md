# Changelog

All notable changes to the TeamTracker API are documented here.
This project follows [Semantic Versioning](https://semver.org/) and
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions.

---

## Unreleased

### Added
- Export tasks to CSV format via `GET /tasks/export`

---

## 1.2.0 — 2026-04-01

### Added
- Team invitation emails via SendGrid — invitees receive a link to join the team directly
- File attachments on tasks (up to 10MB per file, stored in S3, served via pre-signed URLs)
- `GET /tasks/:id/attachments` endpoint to list files attached to a task
- `POST /tasks/:id/attachments` endpoint to upload a new file attachment
- `DELETE /tasks/:id/attachments/:attachmentId` endpoint to remove an attachment

### Changed
- Task list endpoint (`GET /tasks`) now supports pagination via `page` and `per_page` query parameters (default: page 1, 25 per page); response now includes `meta.total`, `meta.page`, and `meta.per_page`
- `/health` endpoint now includes `"db":"connected"` field to confirm database connectivity

### Fixed
- Fixed race condition in task assignment when two users assign the same task simultaneously — last-write-wins replaced with optimistic locking (task `version` field added)
- Fixed `500` error when creating a comment on a deleted task; now returns `404`

### Security
- Updated `jsonwebtoken` from 9.0.0 to 9.0.2 to resolve [CVE-2024-xxxxx] (token verification bypass in specific configurations)

---

## 1.1.0 — 2026-03-01

### Added
- Comment threads on tasks via `GET /tasks/:id/comments` and `POST /tasks/:id/comments`
- `@mention` support in comments — mentioned users receive an in-app notification
- `GET /users/me/notifications` endpoint to retrieve unread notifications
- `PATCH /users/me/notifications/:id` to mark a notification as read

### Changed
- Task `status` field now accepts `todo`, `in_progress`, and `done` (previously only `open` and `closed`); migration handles the rename
- Error responses now consistently return `{ "error": { "code": "...", "message": "..." } }` shape across all endpoints

### Fixed
- Fixed `GET /teams` returning teams the user had been removed from if the removal happened in the same second as the query
- Fixed password reset tokens not being invalidated after use (security fix backported from main)

---

## 1.0.0 — 2026-02-01

Initial release of the TeamTracker API.

### Included in initial release
- User registration and authentication (JWT with refresh tokens)
- Team creation and member management (owner, admin, member roles)
- Task CRUD: create, list, update status, soft delete
- Task assignment to team members
- Due dates on tasks
- Role-based access control — members can only access their own team's tasks
- `GET /health` endpoint
- Structured JSON logging (Pino)
- Rate limiting: 1,000 req/min per authenticated user; 100 req/min per IP (unauthenticated)
- PostgreSQL 15 with Knex.js migrations
- Docker Compose for local development
- GitHub Actions CI with lint, typecheck, unit tests, integration tests, and coverage check
