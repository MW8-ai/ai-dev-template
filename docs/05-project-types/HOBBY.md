## Hobby and Personal Projects

Minimal governance, maximum speed. You're building for yourself or a small audience. You still want good habits — but you don't need enterprise overhead.

### What "Hobby" Means Here
- 1–2 developers max
- No sensitive data (no user PII, no payment info)
- Not running critical infrastructure
- Failure means inconvenience, not breach or financial loss

### Minimum Required Files
At minimum, have these:
- README.md (what the project is, how to run it)
- .gitignore (don't commit node_modules, .env, build artifacts)
- .env.example (document what env vars exist)
- CHANGELOG.md (optional but helpful)

### Git Workflow
Simple workflow:
- Work on main for solo projects (acceptable for personal)
- Use feature branches if you have even one collaborator
- Commit often, push at end of each session
- Write commit messages you'll understand in 6 months

### AI Tools for Hobby Projects
All AI tools are appropriate. Copilot for in-editor suggestions, Claude Code or Codex CLI for larger tasks. The review bar is lower (you're the only reviewer) but still: read what the AI produces before running it.

### CI/CD for Hobby Projects
Optional. Consider:
- GitHub Actions to run tests on push (free on public repos)
- Auto-deploy to Netlify, Vercel, or Cloudflare Pages on push to main

### Security Basics (even for hobby)
- Never commit API keys to the repo
- Use .env files and .gitignore them
- Use .env.example to document what keys exist
- If the project has user accounts, use an auth library — don't write your own

### Suggested Stack
- Frontend: plain HTML/CSS/JS, or Vite with React/Vue
- Backend: none, or Cloudflare Workers, or a simple Node/Python API
- Hosting: Netlify, Vercel, GitHub Pages, Cloudflare Pages
- Database: localStorage, SQLite, Supabase free tier, Firebase

### When to Graduate to Enterprise
- You're adding a second or third serious collaborator
- Real users with accounts
- Any payment processing
- Uptime matters to someone other than you
