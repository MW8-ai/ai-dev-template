# Debug Prompt

Use this prompt when you have an error you need to diagnose with an AI coding agent. The prompt is structured to prevent the agent from guessing and to force systematic diagnosis.

---

## How to Customize

Fill in the template below with real information. Incomplete input produces low-quality diagnosis. Be specific — "it doesn't work" is not a useful error description.

Required fields:
- `[ERROR MESSAGE]` — the exact error text, copied verbatim
- `[STACK TRACE]` — the full stack trace (don't truncate it)
- `[EXPECTED BEHAVIOR]` — what you expected to happen
- `[ACTUAL BEHAVIOR]` — what actually happened, including any unexpected output
- `[WHAT WAS TRIED]` — what you already attempted and what happened when you tried it
- `[RELEVANT FILES]` — the files most likely involved (narrow this down before asking)
- `[ENVIRONMENT]` — language version, OS, relevant package versions

---

## The Prompt

```
You are a systematic debugger. You do not guess. You reason from evidence to
root cause before proposing a fix.

Read these files before anything else:
- [RELEVANT FILES]
- TECH_STACK.md (for version and dependency context)

---

Error message:
[ERROR MESSAGE]

Stack trace:
[STACK TRACE]

Expected behavior:
[EXPECTED BEHAVIOR]

Actual behavior:
[ACTUAL BEHAVIOR]

What was already tried:
[WHAT WAS TRIED]

Environment:
[ENVIRONMENT]

---

Tasks:

1. Reproduce the issue in words. Walk through the code path that leads to
   this error. Identify the exact line where the failure occurs and why it
   occurs at that point.

2. Identify the root cause. Not the symptom — the underlying reason. If the
   error is a NullPointerException, the root cause is why the value is null,
   not that it is null.

3. Propose a fix. Show the exact code change: what to remove, what to add.
   Explain why this fix addresses the root cause rather than the symptom.

4. Explain why the fix works. A one-paragraph explanation that would allow
   a reviewer to verify the reasoning independently.

5. Constraints:
   - Do not change any code unrelated to this bug
   - Do not add error suppression (try/catch that swallows errors, empty
     except blocks, null coalescing that hides the problem)
   - Do not add workarounds that paper over the root cause — fix it at the
     source
   - If you are not confident in the diagnosis, say so explicitly and describe
     what additional information would resolve the uncertainty (specific log
     output, a test case, a config value)

6. Output:
   - Root cause: one sentence
   - Fix: code diff or file changes
   - Explanation: why the fix is correct
   - Test: what test would catch this bug in the future
   - If the fix is uncertain: what to try next and what output to look for
```

---

## Tips for Better Debugging Sessions

**Before sending the prompt:**
- Reproduce the error consistently. An intermittent error you cannot reproduce is much harder to diagnose. Find the minimum steps to trigger it.
- Check the obvious first: did the environment change? Did a dependency update? Is a service down?
- Read the stack trace from top to bottom. The first line is the error. The frames below it show the call path. Find where your code appears in the stack.

**If the agent's fix doesn't work:**
- Feed back the new error or behavior verbatim. Do not paraphrase.
- If the same wrong diagnosis appears a second time, stop and summarize what has failed before continuing. Do not let the session expand indefinitely.

**If the problem is environmental (config, network, secrets):**
- Confirm the config is loaded correctly with a print or log statement before diving into code logic.
- Confirm environment variables are set in the environment where the code actually runs (not just in your shell).

See also: [BUILD_FEATURE.md](./BUILD_FEATURE.md) for the next step after fixing the bug.
