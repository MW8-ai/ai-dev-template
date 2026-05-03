# Debug Prompt Template

<!-- HOW TO USE THIS TEMPLATE:
     1. Copy the prompt block below.
     2. Fill in every section — the more detail you provide, the faster the AI finds the root cause.
     3. The "What was already tried" section is critical: it prevents the AI from
        suggesting things you've already ruled out.
     4. Paste into your AI tool. Attach relevant files if the tool supports it.

     TIPS:
     - Never truncate the stack trace. Paste the full output.
     - If the bug is intermittent, say so and describe the frequency.
     - If you changed something recently that may have caused it, mention it. -->

---

```
I need help debugging an error. Please identify the root cause, propose the minimal fix,
and explain why the fix works.

## Environment

- Language: [e.g., TypeScript 5.4 / Python 3.12 / Ruby 3.3]
- Framework: [e.g., Express 4.18 / FastAPI 0.111 / Rails 7.1]
- Runtime: [e.g., Node.js 20.14 / CPython / MRI]
- OS: [e.g., Ubuntu 22.04 / macOS 14 / Windows 11]
- Running in: [e.g., local dev / Docker / CI / production]

## Error Message

[Paste the exact error message. Do not paraphrase.]

Example:
TypeError: Cannot read properties of undefined (reading 'id')
    at getTeamTasks (/app/src/services/task-service.js:42:30)

## Stack Trace

[Paste the full stack trace. Do not truncate it. If it is very long, include at minimum
the first 30 lines and the section that points to your code.]

```
[stack trace here]
```

## Expected Behavior

[Describe what should happen when the code runs correctly.
Be specific: what value should be returned? What state should the system be in?]

## Actual Behavior

[Describe exactly what happens instead. Include:
- The error message (if not already in the stack trace)
- Any unexpected output
- How frequently this occurs (always / intermittently / only under certain conditions)]

## What Was Already Tried

[This is important. List everything you have already attempted so the AI does not
repeat suggestions you have already ruled out.]

1. [e.g., Added null check on line 42 — error moved to line 57]
2. [e.g., Checked the database — the record exists in the DB]
3. [e.g., Verified the request payload — it includes the expected fields]
4. [e.g., Checked environment variables — DATABASE_URL is set correctly]

## Relevant Code

[Paste the smallest amount of code that reproduces the problem.
Include the function or method where the error occurs, plus any callers if relevant.
Add a comment pointing to the line where the error occurs.]

```[language]
// File: src/services/task-service.js

async function getTeamTasks(teamId) {
  const team = await db('teams').where({ id: teamId }).first();
  return await db('tasks').where({ team_id: team.id }); // ERROR OCCURS HERE
}
```

## Additional Context

[Include anything else that might be relevant:
- Recent changes to the codebase (what changed before this started happening?)
- Whether this worked before and when it stopped
- Environment differences (works in dev, fails in prod?)
- Related issues or PRs
- Any relevant configuration (database version, environment variables, feature flags)]
```

---

## Instructions for the AI

When responding to this debug prompt:

1. **Identify the root cause** — explain the specific reason this error occurs, not just what the
   error message says. Trace the failure back to its origin.

2. **Propose the minimal fix** — show only the code that needs to change. Do not refactor
   unrelated code. Keep the diff small and reviewable.

3. **Explain why** — describe why the proposed fix resolves the root cause. The developer should
   understand the fix, not just copy-paste it.

4. **Flag risks** — if the fix has edge cases, performance implications, or security considerations,
   call them out explicitly.

5. **Suggest a regression test** — propose a test case that would have caught this bug before it
   reached production.

---

## Example (filled in)

```
I need help debugging an error. Please identify the root cause, propose the minimal fix,
and explain why the fix works.

## Environment

- Language: TypeScript 5.4
- Framework: Express 4.18
- Runtime: Node.js 20.14
- OS: Ubuntu 22.04 (Docker container)
- Running in: Production (happens intermittently, ~1% of requests)

## Error Message

TypeError: Cannot read properties of undefined (reading 'id')

## Stack Trace

TypeError: Cannot read properties of undefined (reading 'id')
    at getTeamTasks (/app/src/services/task-service.js:42:30)
    at TasksController.list (/app/src/api/tasks.js:18:24)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)

## Expected Behavior

GET /tasks should return the list of tasks for the authenticated user's team.

## Actual Behavior

About 1% of requests fail with this error. The team record should always exist
for an authenticated user — every user belongs to a team.

## What Was Already Tried

1. Added logging before line 42 — team is sometimes undefined
2. Verified DB — team records exist for all affected users
3. Checked auth middleware — user.teamId is set correctly in 99% of requests

## Relevant Code

async function getTeamTasks(teamId) {
  const team = await db('teams').where({ id: teamId }).first(); // sometimes returns undefined
  return await db('tasks').where({ team_id: team.id }); // ERROR HERE
}

## Additional Context

This started happening after we added a soft-delete feature for teams last week.
The soft delete sets deleted_at but does not remove the row.
```
