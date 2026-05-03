# Prompt Strategies

How to write effective AI prompts for coding tasks — the patterns that produce useful output and the mistakes that produce garbage.

Related docs: [AI_OVERVIEW.md](./AI_OVERVIEW.md) | [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md) | [CLAUDE_CODE.md](./CLAUDE_CODE.md)

---

## The Anatomy of a Good Prompt

A good coding prompt has five parts:

1. **Role** — establishes the expertise level and frame of reference
   > "You are a senior Python developer..."

2. **Context** — describes the project, tech stack, and relevant background
   > "...working in a Django REST Framework API that serves a mobile app..."

3. **Task** — states specifically what you want done
   > "...write a view that accepts a POST request with an email and password..."

4. **Constraints** — limits the solution space to avoid unwanted choices
   > "...use only Django's built-in authentication — do not add any new packages..."

5. **Output format** — tells the AI exactly what to return
   > "...return only the Python code with no explanation."

You do not need all five parts for every prompt. A simple syntax question does not need a role. But for any task involving real code going into your project, using all five produces dramatically better results than a vague one-line request.

---

## Prompt Patterns

### The Scoped Task

Narrow the problem to a specific, bounded change. Give the relevant context directly in the prompt rather than assuming the AI knows your system.

**Vague (produces poor results):**
```
Fix the login
```

**Scoped (produces actionable results):**
```
The login endpoint at /api/auth/login/ returns a 500 error when the email
address contains uppercase letters. The relevant code is in auth/views.py,
specifically the authenticate_user() function at line 34.

Fix the email comparison to be case-insensitive before passing it to
authenticate(). Do not change any other behavior.
```

### The Explain and Fix

Ask the AI to understand the code first, then identify problems. This produces better results than asking it to fix blindly because explaining forces it to reason through the logic.

```
Explain what this function does step by step, then identify any bugs or
edge cases it does not handle:

[paste function here]
```

### The Test Writer

Generate tests for an existing function. Specify which cases you want covered to avoid getting only the happy path.

```
Write pytest tests for the following function. Cover:
- Happy path (valid input, expected output)
- Empty input (empty string, empty list)
- Invalid type (pass an int where a string is expected)
- Boundary values (minimum and maximum valid inputs)
- Error conditions (what should raise an exception)

[paste function here]
```

### The Review Checklist

Use the AI as a first-pass reviewer for specific concerns. A structured checklist produces structured output.

```
Review this code for the following:
1. Security vulnerabilities (injection, authentication bypass, data exposure)
2. Error handling gaps (uncaught exceptions, missing null checks)
3. Readability (confusing names, complex logic without comments)

Return findings as a bulleted list grouped by category. Include the line
number for each finding.

[paste code here]
```

### The Refactor with Constraints

Ask for a refactor but constrain what can change. Without constraints, the AI may rewrite everything.

```
Refactor the following function to improve readability. Constraints:
- Do not change the function signature
- Do not change the behavior — only the internal implementation
- Do not add new dependencies
- Add a docstring if one is missing

[paste function here]
```

### The Language Translation

Convert code between languages while preserving behavior. Specify both languages and flag any idioms to handle.

```
Convert this Python 3 function to TypeScript. Use TypeScript's strict type
annotations throughout. Preserve all error handling behavior. If any Python
idioms do not translate directly to TypeScript, comment on the difference.

[paste Python code here]
```

---

## What to Include in Every Coding Prompt

| What | Why |
|---|---|
| Programming language and version | Avoids output that uses syntax from the wrong version |
| Framework and version (if relevant) | "Django view" vs "Flask route" vs "FastAPI endpoint" produce very different code |
| Relevant existing code (pasted in) | The AI cannot guess what already exists in your project |
| What you have already tried | Prevents re-suggesting things you know do not work |
| The specific outcome you want | "return only the code" vs "explain then code" vs "list options" |

### Example with All Elements

```
Language: Python 3.11
Framework: FastAPI 0.110

I have an endpoint that accepts a file upload and saves it to a local
directory. The relevant code is below. The problem is that filenames with
spaces cause a 422 error on the client side.

What I have tried: URL-encoding the filename before saving — this did not
fix the client error.

Sanitize the filename before saving it to disk. Replace spaces with
underscores and strip any characters that are not alphanumeric, hyphens,
underscores, or dots. Return only the updated save_file() function.

[paste current code]
```

---

## What to Never Include in a Prompt

| What | Why |
|---|---|
| API keys, tokens, or passwords | Data leaves your machine and may appear in logs or training sets |
| PII (Personally Identifiable Information — names, emails, phone numbers of real users) | Privacy risk; unnecessary for a coding task |
| Production database connection strings | Exposes your infrastructure |
| Internal IP addresses or hostnames | Exposes your network topology |
| Proprietary business logic that must stay confidential | Know your organization's data handling policy before pasting code |

If you need the AI to work with code that processes sensitive data, paste a redacted version with placeholders instead of real values:

```python
# Original (do not paste):
DB_HOST = "prod-db.internal.company.com"
API_KEY = "sk-live-abc123..."

# Safe to paste:
DB_HOST = "DB_HOST_PLACEHOLDER"
API_KEY = "API_KEY_PLACEHOLDER"
```

---

## Iterating on Prompts

If the first response is not what you needed, refine the prompt rather than asking the same question again:

- **Too long**: "Shorten the response — I only need the function body, not the explanation."
- **Wrong approach**: "I cannot use that library. Rewrite using only the standard library."
- **Missing a case**: "The solution does not handle the case where the list is empty. Add that handling."
- **Wrong language version**: "Rewrite using Python 3.11 features — you can use `match` statements and `tomllib`."

One iteration with a refined prompt is more efficient than multiple rounds of "that's not quite right."
