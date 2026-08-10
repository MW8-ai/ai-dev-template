# Claude API — What's New

A running summary of meaningful Claude API and tooling changes, newest first. Full details at the official changelog.

> **Source:** https://docs.anthropic.com/en/docs/about-claude/models/overview
> **Last reviewed:** 2026-08-10

---

## Current Models (2026)

Use the smallest model that can complete the task correctly.

| Model | ID | Best For | Cost |
|---|---|---|---|
| Claude Opus 5 | `claude-opus-5` | Architecture, security review, complex cross-file debugging | Highest |
| Claude Sonnet 5 | `claude-sonnet-5` | Features, bug fixes, tests, refactors — daily coding | Mid |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Docs cleanup, changelog, formatting, summarization | Lowest |
| Claude Fable 5 | `claude-fable-5` | Narrative, long-form content generation | Mid |

Previous generation still available: Opus 4.8 (`claude-opus-4-8`), Sonnet 4.6 (`claude-sonnet-4-6`), Haiku 4.x.

---

## API Features — Current GA

### Extended Thinking

The model reasons step-by-step before giving a final answer. Useful for hard problems, multi-step plans, and security analysis.

```python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000  # how much the model can spend on reasoning
    },
    messages=[{"role": "user", "content": "Analyze the security implications of this architecture..."}]
)

# Thinking blocks come before the final text block
for block in response.content:
    if block.type == "thinking":
        print("Reasoning:", block.thinking)
    elif block.type == "text":
        print("Answer:", block.text)
```

**Interleaved thinking:** thinking blocks can appear between tool calls, not just at the start. The model can reason, call a tool, see the result, reason again.

---

### Tool Runner

The SDK manages the tool-use loop automatically.

```python
with client.beta.messages.tool_runner(
    model="claude-sonnet-5",
    max_tokens=4096,
    tools=tools,
    messages=[{"role": "user", "content": task}]
) as runner:
    result = runner.run()
```

No manual loop, no appending tool results — the runner handles the back-and-forth until `end_turn`.

---

### Managed Agents

Server-hosted agents with sandboxed execution, persistent memory, and skill composition. You define what the agent can do (skills); Anthropic runs the runtime.

```python
# Invoke a managed agent
response = client.beta.agents.invoke(
    agent_id="your-agent-id",
    input={"message": "Check the health of payments-api and page if down"}
)
```

Best for: production deployments, agents that need state across sessions, long-running tasks.

→ See [AGENTS_AND_SKILLS.md](./AGENTS_AND_SKILLS.md) for full pattern guide.

---

### Files API

Upload a file once, reference it by ID across many requests. Avoids re-sending large documents on every call.

```python
# Upload once
with open("architecture.pdf", "rb") as f:
    file = client.beta.files.upload(
        file=("architecture.pdf", f, "application/pdf")
    )

# Use in any request by ID
response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "document", "source": {"type": "file", "file_id": file.id}},
            {"type": "text", "text": "Summarize the key architectural decisions."}
        ]
    }]
)
```

Supported types: PDF, plain text, images, code files.

---

### Citations

When you provide documents as context, Claude can return source references alongside its answers — which document, which section.

```python
response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {"type": "text", "media_type": "text/plain", "data": document_text},
                "title": "Security Policy v2"
            },
            {"type": "text", "text": "What are the password requirements?"}
        ]
    }]
)
# Response includes citations pointing to source sections
```

Useful for: RAG pipelines, document Q&A, compliance evidence.

---

### Prompt Caching

Cache stable prompt prefixes (system prompts, long documents, tool schemas) to cut cost by up to 90% on repeated calls.

```python
response = client.messages.create(
    model="claude-sonnet-5",
    system=[
        {
            "type": "text",
            "text": long_system_prompt,
            "cache_control": {"type": "ephemeral"}  # cache this block
        }
    ],
    messages=messages,
    max_tokens=4096
)
```

TTL: 5 minutes (refreshes on each cache hit). Supported on Claude 4+ models.

---

### Batch API

Submit thousands of requests asynchronously at 50% cost. Results arrive within 24 hours.

```python
batch = client.messages.batches.create(
    requests=[
        {"custom_id": f"item-{i}", "params": {"model": "claude-haiku-4-5-20251001", ...}}
        for i, item in enumerate(items)
    ]
)

# Poll until done
while batch.processing_status != "ended":
    batch = client.messages.batches.retrieve(batch.id)

# Stream results
for result in client.messages.batches.results(batch.id):
    print(result.custom_id, result.result.message.content)
```

Best for: bulk document processing, eval runs, data enrichment pipelines.

---

## Model Context Protocol (MCP)

MCP is an open protocol for connecting AI models to external tools and data sources. Any application can expose tools to Claude without custom integration code.

- **Spec:** https://modelcontextprotocol.io
- **Supported by:** Claude Code, Claude Desktop, third-party agents
- **Ecosystem:** GitHub, Supabase, Figma, Slack, databases, observability tools

MCP servers expose three primitives:
- **Tools** — functions the model can call (search, write, query)
- **Resources** — files or data the model can read
- **Prompts** — reusable prompt templates

```json
// .claude/settings.json — register an MCP server
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_TOKEN": "..."}
    }
  }
}
```

---

## Claude Code — Current Features

| Feature | How to Use |
|---|---|
| Custom slash commands | Add `.md` files to `.claude/commands/` |
| Hooks | Configure in `.claude/settings.json` — PreToolUse, PostToolUse, Stop, Notification |
| MCP servers | Register in `.claude/settings.json` under `mcpServers` |
| Subagents | Use the `Agent` tool in any response to spawn parallel workers |
| Remote sessions | Run in cloud-hosted sandboxes from claude.ai/code |
| Permission control | `allow` / `deny` lists in `.claude/settings.json` |

→ Full guide: [CLAUDE_CODE.md](./CLAUDE_CODE.md)

---

## Keeping This Current

This doc is manually updated when significant API changes ship. For automated detection of new changelog entries:

→ [docs/06-living-updates/sources/update-sources.yml](../06-living-updates/sources/update-sources.yml)

Official changelog: https://docs.anthropic.com/en/docs/about-claude/models/overview
