## Coding Standards

These standards apply to all code in this repo and any project using this template.

### Core Principle
Write code that a new team member can read and understand without asking you. Prefer clarity over cleverness.

### Naming
- Variables and functions: descriptive, not abbreviated. `userEmailAddress` not `ue` or `email`.
- Booleans: name as questions. `isLoggedIn`, `hasPermission`, `shouldRedirect`.
- Functions: verb + noun. `getUser()`, `validateEmail()`, `sendNotification()`.
- Constants: SCREAMING_SNAKE_CASE for true constants. `MAX_RETRY_COUNT`, `API_BASE_URL`.
- Files: lowercase-with-hyphens for web projects. `user-service.js`, `auth-middleware.py`.

### Functions
- Do one thing. If you need "and" in the name, it should be two functions.
- Under 30 lines is a guideline, not a rule. Complex logic can be longer if it's clear.
- Parameters: under 4 arguments. More than 4 → pass an object/dict.
- Return early: validate inputs and return/throw at the top, not nested deep.

### Comments
- Comment the WHY, not the WHAT. The code shows what; comments explain why.
- Don't comment obvious code: `// increment counter` above `count++` is noise.
- Do comment non-obvious decisions: `// Using 429 not 503 because load balancer strips 503`
- Remove commented-out code before merging — use git history instead.

### Error Handling
- Handle errors explicitly at every external boundary: API calls, file reads, user input.
- Don't swallow errors silently (`catch(e) {}`). Log or re-throw.
- User-facing errors: clear message, no stack traces, no internal details.
- Internal errors: full context in logs.

### Security
- Validate all inputs at system boundaries.
- Never trust user input — sanitize before using in queries, commands, or HTML.
- No hardcoded credentials, URLs, or environment-specific values.
- Keep dependencies minimal and reviewed.

### Dependencies
- Before adding a dependency: does it solve a real problem? Is there a simpler built-in alternative?
- Check: maintained? Downloads per week? Open CVEs (Common Vulnerabilities and Exposures)?
- Lock dependency versions (package-lock.json, requirements.txt with pinned versions).

### Testing
- Write tests as you write code — not after.
- Test behavior, not implementation.
- See docs/06-standards/TESTING.md for coverage requirements.

---

## Next Step

→ [Code review standards](docs/06-standards/REVIEW.md)
