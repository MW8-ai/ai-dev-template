# Agents and Skills

How to build, compose, and deploy AI agents using Claude — from simple tool-use to multi-agent systems.

Related docs: [CLAUDE_CODE.md](./CLAUDE_CODE.md) | [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md) | [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md)

---

## What Is an Agent?

A chatbot answers questions. An agent takes actions.

An agent has:
- A model that reasons and decides
- Tools it can call (search, run code, write files, call APIs)
- A loop — it keeps going until the task is done or it needs input

```text
User request
    ↓
Agent reasons → picks a tool → runs it → sees result → reasons again
    ↓ (repeat until done)
Final answer or action
```

Claude agents are built on the Messages API. Each loop iteration is a messages call — the model's output includes either a final answer or a tool call to run next.

---

## Three Ways to Build Claude Agents

### 1. Tool use (you manage the loop)

You define tools, call the API, run tools when Claude requests them, and feed results back.

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "search_logs",
        "description": "Search application logs for a pattern",
        "input_schema": {
            "type": "object",
            "properties": {
                "pattern": {"type": "string"},
                "time_range": {"type": "string"}
            },
            "required": ["pattern"]
        }
    }
]

messages = [{"role": "user", "content": "Find errors in the last hour"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=4096,
        tools=tools,
        messages=messages
    )

    if response.stop_reason == "end_turn":
        print(response.content[0].text)
        break

    # Claude wants to use a tool
    tool_use = next(b for b in response.content if b.type == "tool_use")
    result = run_tool(tool_use.name, tool_use.input)

    messages.append({"role": "assistant", "content": response.content})
    messages.append({"role": "user", "content": [
        {"type": "tool_result", "tool_use_id": tool_use.id, "content": result}
    ]})
```

Best for: custom tools, full control, integrating into existing systems.

### 2. Tool Runner (SDK handles the loop)

The Anthropic SDK's `tool_runner` manages the loop for you.

```python
client = anthropic.Anthropic()

with client.beta.messages.tool_runner(
    model="claude-sonnet-5",
    max_tokens=4096,
    tools=tools,
    messages=[{"role": "user", "content": "Find errors in the last hour"}]
) as runner:
    result = runner.run()
    print(result.content[0].text)
```

Best for: standard tool loops where you don't need custom loop logic.

### 3. Managed Agents (server-hosted, sandboxed)

Anthropic hosts the agent runtime. The agent runs in a managed sandbox with persistent state, memory, and built-in tool execution. You define skills (what the agent can do) and the platform handles the rest.

```python
# Invoke a managed agent
response = client.beta.agents.invoke(
    agent_id="your-agent-id",
    input={"message": "Check service health for payments-api"}
)
```

Best for: production deployments, long-running tasks, agents that need to persist context across sessions.

→ See the Anthropic cookbook: [SRE Incident Responder](https://platform.claude.com/cookbook/managed-agents-sre-incident-responder)

---

## Agent Skills

A skill is a reusable capability you give an agent — a tool with a well-defined contract.

Good skill design:
- One clear responsibility
- Structured input and output (JSON schema)
- Deterministic where possible (same input → same output)
- Handles its own errors and returns them as data, not exceptions

```python
# Skill definition
skill = {
    "name": "check_service_health",
    "description": "Check the health of a named service and return status + recent errors",
    "input_schema": {
        "type": "object",
        "properties": {
            "service_name": {"type": "string", "description": "Service identifier"},
            "lookback_minutes": {"type": "integer", "default": 30}
        },
        "required": ["service_name"]
    }
}
```

Skills compose. An SRE agent might have: `check_service_health`, `search_logs`, `page_on_call`, `create_incident`, `rollback_deployment`. The agent decides which to call and in what order.

---

## Multi-Agent Patterns

Single agents hit limits: context window, specialization, parallelism. Multi-agent systems split work.

### Orchestrator + Workers

One agent breaks down a task and dispatches to specialists.

```text
Orchestrator
├── Research Agent   → gathers context
├── Analysis Agent   → identifies root cause
└── Action Agent     → executes fix, posts update
```

### Pipeline

Agents in sequence, each building on the last output.

```text
Triage → Diagnose → Fix → Verify → Notify
```

### Parallel Fan-Out

One agent spawns N workers for independent subtasks, then synthesizes.

```text
              ┌── Check DB lag
Orchestrator ─┼── Check API errors     → Synthesize → Incident report
              └── Check network latency
```

### Human-in-the-Loop Gate

Agent pauses at decision points that require human approval.

```text
Agent analyzes → proposes action → human approves → agent executes
```

→ See [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md) for enforcement patterns.

---

## Real Example: SRE Incident Responder

The Anthropic cookbook demonstrates a managed agent for SRE incident response. The pattern:

1. **Trigger**: alert fires (PagerDuty, CloudWatch, etc.)
2. **Triage agent**: checks service health, pulls recent logs, checks recent deploys
3. **Diagnosis**: correlates signals, identifies likely root cause
4. **Action**: either auto-remediates (rollback, scale up) or pages on-call with a full incident summary
5. **Handoff**: posts structured summary to incident channel with evidence

What makes this work:
- Tools are narrow and reliable (each does one thing)
- The agent is given explicit boundaries (what it can and can't do autonomously)
- Human approval required for destructive actions
- Full audit trail of every tool call

→ Full example: [platform.claude.com/cookbook/managed-agents-sre-incident-responder](https://platform.claude.com/cookbook/managed-agents-sre-incident-responder)

---

## Building Your First Agent — Checklist

```text
[ ] Define the task boundary — what does the agent own?
[ ] List the tools it needs — start with 3-5 max
[ ] Write a system prompt that states: role, tools available, what NOT to do
[ ] Decide the human-in-the-loop gates — which actions require approval?
[ ] Add logging — every tool call should be logged with inputs/outputs
[ ] Test failure cases — what happens when a tool returns an error?
[ ] Set max_tokens and a turn limit to prevent runaway loops
[ ] Add a fallback: if stuck, agent should say so rather than loop forever
```

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Too many tools at once | Start with 3-5; add more only when needed |
| Vague tool descriptions | Be specific — describe exactly what the tool does and when to use it |
| No error handling in tools | Return errors as structured data, not exceptions |
| Agent can do anything | Explicit allow-list of autonomous actions; gate the rest |
| No turn limit | Set `max_iterations` or equivalent; agents can loop on bad input |
| Skipping evals | Test against a set of known inputs before deploying |

---

## Prompt Caching for Agents

Long-running agents repeat the same system prompt on every turn. Cache it.

```python
response = client.messages.create(
    model="claude-sonnet-5",
    system=[
        {
            "type": "text",
            "text": system_prompt,
            "cache_control": {"type": "ephemeral"}  # cache this block
        }
    ],
    messages=messages,
    max_tokens=4096
)
```

For agents with long context (tool schemas, memory dumps), caching the stable prefix cuts cost by 80-90% on repeated turns.

→ See [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md) for more caching patterns.

---

## Further Reading

- [CLAUDE_API_CHANGELOG.md](./CLAUDE_API_CHANGELOG.md) — current models, extended thinking, Files API, Citations, Batch API, MCP
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook) — working examples
- [Managed Agents SRE Example](https://platform.claude.com/cookbook/managed-agents-sre-incident-responder)
- [Claude API Tool Use Docs](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Claude API Agents Docs](https://docs.anthropic.com/en/docs/build-with-claude/agents)
- [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md) — when and how to gate agent actions

---

## Next Step

→ [LOCAL_LLMS.md](./LOCAL_LLMS.md) — run models locally for private, offline agent workloads
