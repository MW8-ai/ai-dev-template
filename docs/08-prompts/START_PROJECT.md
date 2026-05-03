# Start Project Prompt

Use this prompt when starting a new project from scratch with an AI coding agent. Copy the block below, fill in the bracketed fields, and paste it as your first message.

---

## How to Customize

Before sending, replace:
- `[PROJECT NAME]` — the name of the project (e.g., "Invoice Tracker API")
- `[SHORT DESCRIPTION]` — one sentence describing what it does (e.g., "A REST API for tracking invoice status and payment history")
- `[PRIMARY LANGUAGE]` — the main language (e.g., Python 3.12, TypeScript, Go 1.22)
- `[FRAMEWORK]` — framework if already decided (e.g., FastAPI, Next.js, Gin) or "no framework selected yet"
- `[DATA STORE]` — primary data store (e.g., PostgreSQL, SQLite, DynamoDB) or "not yet determined"
- `[TARGET ENVIRONMENT]` — where it will run (e.g., AWS Lambda, Docker on EC2, Vercel, local CLI tool)

If you have an existing file layout or design in mind, describe it briefly after the prompt or attach a rough sketch.

---

## The Prompt

```
You are a senior software architect helping start a new project.

Read these files before doing anything:
- AGENTS.md
- TECH_STACK.md
- DESIGN.md (if it exists)

Project: [PROJECT NAME]
Description: [SHORT DESCRIPTION]
Language: [PRIMARY LANGUAGE]
Framework: [FRAMEWORK]
Data store: [DATA STORE]
Target environment: [TARGET ENVIRONMENT]

Tasks:

1. Scaffold the project structure. Create directories and placeholder files
   appropriate for the language and framework. Follow conventions for the
   chosen stack — don't invent a novel layout.

2. Create the following required documents (use the templates in templates/project/
   if they exist, otherwise create from scratch):
   - README.md: project name, description, how to run locally, how to run tests,
     environment variables required, links to DESIGN.md and DEPLOYMENT.md
   - DESIGN.md: purpose, architecture overview, key components, data model sketch,
     external dependencies, open questions
   - TESTING.md: how to run tests, testing strategy, what is and is not covered
   - DEPLOYMENT.md: how to deploy, environment requirements, rollback procedure
   - CHANGELOG.md: single entry — "Initial project scaffold"

3. Set up:
   - .gitignore appropriate for the language and framework
   - .env.example with all required environment variables and placeholder values
     (no real secrets — use fake example values like "your-api-key-here")

4. Constraints:
   - Do not put any real secrets, passwords, or API keys in any file
   - Use the template conventions from templates/project/ if that directory exists
   - Preserve any existing architecture and file structure already present
   - Do not introduce dependencies not discussed unless you flag them explicitly

5. Output when done:
   - List every file created, with a one-line description of its purpose
   - State what the next development task should be
   - Flag any decisions that were left open and need a human to decide
```

---

## After the Scaffold

Once the agent finishes, review:

1. **DESIGN.md** — does the architecture match your intent? Fix it before writing code.
2. **.env.example** — does it list every variable the code will need?
3. **TESTING.md** — is the test strategy realistic for this project?

Then make your first real commit:
```bash
git add .
git commit -m "Initial project scaffold"
```

From here, use the [BUILD_FEATURE.md](./BUILD_FEATURE.md) prompt for each feature.
