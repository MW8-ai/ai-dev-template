# SUBAGENT_PATTERNS.md

## What Sub-Agents Are

In Claude Code, the `Agent` tool spawns a child agent with its own context window. The parent delegates a task, the child runs to completion, and returns a single result. The child has no memory of prior sessions or the parent's conversation.

Use sub-agents to:

- Parallelize independent work (run multiple agents simultaneously)
- Protect the main context window from large search or read results
- Get an independent second opinion (the child starts fresh, no anchoring bias)
- Isolate risky file operations to a throwaway worktree

## Core Patterns

### 1. Parallel Independent Tasks

When two tasks don't depend on each other, spawn both in one message. They run concurrently.

```text
User: implement feature X and update the docs for feature Y

Main agent:
  → Agent(Build feature X)   ┐ sent in one message,
  → Agent(Update Y docs)     ┘ run in parallel

Main agent: review both diffs, commit
```

**Rule:** If task B needs the output of task A, run sequentially. If they're independent, parallelize.

### 2. Research + Build Separation

Delegate research to a sub-agent to avoid polluting the main context with large search results.

```text
Main: "I need to know the current Claude API pricing before I write the cost estimate."
  → Agent(Research): search docs, return summary under 200 words
Main: uses summary to write estimate — never saw the raw search output
```

The main agent's context stays clean. The research agent's large intermediate results are discarded.

### 3. Isolated File Changes (Worktree)

Use `isolation: "worktree"` when an agent will make file changes you want to review before merging. The agent works on a temporary git worktree (separate branch). If it makes no changes, the worktree is cleaned up automatically.

```text
Agent(
  description: "Refactor auth module",
  isolation: "worktree",
  prompt: "Refactor src/auth/ to use the new token interface. Run tests after."
)
→ returns: branch name + changed files
Main: review diff, merge if acceptable
```

This prevents a runaway agent from dirtying your working tree.

### 4. Independent Review (Second Opinion)

Spawn a reviewer agent after a build agent finishes. The reviewer starts with no knowledge of how the implementation was decided — clean perspective.

```text
Build agent → produces diff
Review agent(
  prompt: "Review this diff for correctness, safety, and maintainability.
           Context: [paste diff]. Check against standards/review-standards.md."
)
→ returns: findings
Main: decide whether to accept, request changes, or escalate
```

### 5. Specialization by Role

Map the orchestration cycle to sub-agents explicitly:

```text
Main (orchestrator)
  → Planner agent    — scopes task, lists files, identifies risks
  → Builder agent    — implements scoped change
  → Tester agent     — runs checks, reproduces issues
  → Reviewer agent   — checks scope, safety, quality, doc drift
  → Documenter agent — updates CHANGELOG, README, affected docs
Main: human approval gate before commit
```

Each agent gets only the context it needs. The main agent synthesizes results and controls the commit.

## Writing Good Sub-Agent Prompts

Sub-agents don't see the conversation. Brief them like a colleague who just walked in.

**Include:**

- What you're trying to accomplish and why
- What you've already tried or ruled out
- Specific file paths, line numbers, or symbols relevant to the task
- What format the result should take ("under 200 words", "return a diff", "list changed files")
- Whether they should write code or just research

**Avoid:**

- "Based on your findings, fix it" — synthesize first, delegate a concrete task
- Vague directives ("improve the code") — give a specific, bounded scope
- Asking the agent to figure out context you already know — give it the context

## Foreground vs Background

**Foreground (default):** Parent waits for result before continuing. Use when you need the output to decide next steps.

**Background:** Parent continues working; notified when done. Use for genuinely independent tasks that take a while (large doc generation, slow test runs).

```text
Agent(description: "Generate API docs", run_in_background: true, prompt: "...")
# parent continues with other work
# gets notified when docs agent finishes
```

Do not poll or sleep waiting for a background agent. The notification is automatic.

## Stop Conditions for Sub-Agents

Instruct sub-agents to stop and report rather than expand scope:

```text
If you cannot complete the task without:
- modifying files outside the specified scope
- installing new dependencies
- making irreversible changes (drops, deletes, force pushes)
- encountering the same error 3 times

Stop. Return a summary of what you tried and what blocked you.
Do not proceed.
```

## Context Budget

Sub-agents have their own full context window. However:

- Each spawned agent costs input tokens for its full prompt
- Large prompts with many injected files add up fast
- Use prompt caching if the same stable docs are injected into many agents (see `PROMPT_CACHING.md`)
- Keep agent prompts focused — don't inject the entire repo into every child
