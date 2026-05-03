# CONTEXT_MANAGEMENT.md

## The Problem

Claude's context window is large but finite. In a long coding session, context fills with file contents, tool outputs, conversation history, and intermediate reasoning. When it gets full:

- The model starts losing earlier context
- Automatic compaction kicks in (Claude Code summarizes old turns)
- Quality degrades on tasks that need both early and late context

Managing context deliberately is cheaper and more reliable than letting it fill and hoping compaction preserves what matters.

## What Goes Into Context

In a Claude Code session, context accumulates from:

1. **System prompt** — CLAUDE.md, injected docs, session instructions
2. **Tool results** — Read outputs, Bash outputs, search results
3. **Conversation turns** — every user message and assistant response
4. **Thinking blocks** — if extended thinking is enabled
5. **Sub-agent prompts** — if agents are spawned inline (they have their own context windows, so this is just the prompt + result, not the child's full context)

The largest consumers are typically large file reads and verbose Bash output.

## Strategies

### 1. Pin What Matters at the Start

Open every session by reading only the files you'll need throughout. Don't read speculatively. Once something is in context, it stays until compaction.

Minimum pin set for this repo:

- `AGENTS.md`
- `TECH_STACK.md`
- The specific file(s) being modified

Do not read the entire `docs/` tree unless you need all of it.

### 2. Use Sub-Agents for Large Searches

When a task requires scanning many files to find something, delegate it to a sub-agent. The agent reads everything, extracts what you need, and returns a short summary. The main context window only receives the summary — not all the intermediate file contents.

```text
Bad:  Main reads 40 files looking for all usages of a function
Good: Sub-agent reads 40 files, returns "found in auth.ts:42, api.ts:88"
Main context: 2 lines instead of 40 files
```

### 3. Summarize Before Compaction Happens

When you notice context growing large, proactively ask Claude to summarize the session state before it hits the compaction threshold:

```text
"Before we continue, summarize: what files have been changed, what's working,
what's still broken, and what the next step is. Keep it under 200 words."
```

Save this summary externally (a scratch note, a TODO comment in the code) so it survives a fresh session.

### 4. Start Fresh for New Tasks

If you finish a task and start a new unrelated one, start a new session. Don't carry stale context from task A into task B. The cost of re-reading a few files is much lower than the cost of context pollution.

### 5. Use Prompt Caching for Stable Injections

If you're building a tool that injects the same docs into every call (AGENTS.md, TECH_STACK.md, coding standards), use `cache_control` so those tokens are cheap to include. See `PROMPT_CACHING.md`.

This doesn't reduce context window usage, but it reduces the cost of repeatedly including large stable docs.

### 6. Trim Bash Output

Long Bash outputs (test runs, build logs, find results) consume large amounts of context. Pipe to `head`, `tail`, `grep`, or `wc -l` to keep outputs small:

```bash
# Instead of:
find . -name "*.ts"           # might return hundreds of lines

# Use:
find . -name "*.ts" | wc -l  # just the count
find . -name "*.ts" | grep "auth"  # only relevant results
npm test 2>&1 | tail -30     # only the end of test output
```

### 7. Don't Re-Read Files You've Already Read

If a file is already in context, don't read it again. Ask Claude to reference what it already knows. Re-reading adds tokens without adding information.

## Signs Context Is Getting Problematic

- Claude starts forgetting earlier decisions or constraints
- Responses become less specific, more generic
- Claude re-asks for information it was already given
- Compaction notices appear in the session
- The same mistake recurs after being corrected

When these appear, stop and either: summarize + continue, or start fresh.

## Context Budget by Session Type

| Session Type | Suggested Approach |
|---|---|
| Single-file bug fix | Read target file + test file only |
| Multi-file feature | Read design doc + affected files; delegate discovery to sub-agent |
| Architecture review | Read top-level docs; delegate per-module reading to sub-agents |
| Long refactor | Break into per-module sessions; hand off with a written summary |
| Security review | One sub-agent per attack surface; aggregate findings in main |

## Fresh Session Handoff Template

When ending a session that will continue in a new one, write a handoff note:

```markdown
## Session Handoff — [date]

### What changed
- [file]: [what was done]

### Current state
- [working / broken / partial]

### Next step
- [exact next action with file path if known]

### Context needed in next session
- Read: [list of files]
- Key constraint: [any non-obvious constraint to remember]
```

Paste this at the start of the next session instead of replaying the entire prior conversation.
