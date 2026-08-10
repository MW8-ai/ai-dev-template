# Incoming Update: Anthropic — Claude model family and API updates (2025–2026)

## Status

Needs human review.

## Source

- Source ID: `anthropic-changelog`
- Vendor: Anthropic
- Category: ai-model
- Priority: high
- URL: https://docs.anthropic.com/en/docs/about-claude/models/overview
- Detected: 2026-08-10
- Tags: anthropic, claude, api, models, agents, mcp, tool-use

## Summary of Changes

### Models

| Model | ID | Notes |
|---|---|---|
| Claude Opus 5 | `claude-opus-5` | Most capable; architecture, security, complex reasoning |
| Claude Sonnet 5 | `claude-sonnet-5` | Best balance of capability and speed; default for most coding tasks |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | Fastest, cheapest; docs cleanup, changelog, formatting |
| Claude Fable 5 | `claude-fable-5` | Narrative and long-form generation |

Previous generation (still available): Opus 4.8, Sonnet 4.6, Haiku 4.x

### API Features Added or Promoted to GA

| Feature | Status | What It Is |
|---|---|---|
| Extended thinking | GA | Model shows step-by-step reasoning before final answer; set `thinking: {type: "enabled", budget_tokens: N}` |
| Interleaved thinking | GA | Thinking blocks appear between tool calls, not just at the start |
| Tool Runner | GA | SDK method that manages the tool-use loop automatically — no manual loop needed |
| Managed Agents | GA | Server-hosted agents with sandboxed execution, persistent memory, and skill composition |
| Files API | GA | Upload documents/images once, reference by file_id across multiple requests |
| Citations | GA | Model returns source references alongside answers when given document context |
| Prompt caching | GA (expanded) | Cache stable prompt prefixes; supported on all Claude 4+ models |
| Batch API | GA | Submit thousands of requests asynchronously at 50% cost |

### Model Context Protocol (MCP)

MCP is an open protocol (Anthropic-originated, now community-maintained) for connecting AI models to external tools and data sources. Claude Code, Claude Desktop, and third-party agents all support it.

- Spec: https://modelcontextprotocol.io
- Allows any application to expose tools to Claude without custom integration code
- Growing ecosystem of MCP servers: GitHub, Supabase, Figma, Slack, etc.

### Claude Code (Agent CLI)

- GA — available as `npm install -g @anthropic-ai/claude-code`
- Supports hooks (PreToolUse, PostToolUse, Stop, Notification)
- Custom slash commands via `.claude/commands/`
- MCP server configuration in `.claude/settings.json`
- Multi-agent subagents via the `Agent` tool
- Web-hosted sessions (remote execution environments)

## Human Review Questions

1. Does MODEL_ROUTING.md need to be updated with new model IDs?
2. Should AGENTS_AND_SKILLS.md reference the new API features (Files API, Citations, Batch)?
3. Should CLAUDE_CODE.md be updated with current GA features?
4. Are there cert or compliance implications (FIPS, data residency for Files API)?

## Suggested Disposition

- [x] Update AGENTS_AND_SKILLS.md with API features
- [ ] Update MODEL_ROUTING.md with current model IDs
- [ ] Update CLAUDE_CODE.md hooks and MCP section
- [ ] No action / archive
