# PROMPT_CACHING.md

## What It Is

Prompt caching lets you mark portions of a prompt as cacheable. Anthropic stores the cached prefix server-side for 5 minutes (extendable to 1 hour with `ephemeral` TTL). Repeated requests hitting the same cached prefix pay ~10% of the normal input token cost for those tokens.

For repos that inject large stable docs into every agent request, this is the single highest-leverage cost optimization available.

## When to Use It

Use caching when you are repeatedly sending the same large content across multiple API calls in a session:

- System prompts containing AGENTS.md, TECH_STACK.md, DESIGN.md
- Full file contents passed as context to a multi-step agent
- Large reference docs (compliance checklists, API specs, coding standards)
- Few-shot examples that don't change between calls

Do not cache content that changes frequently per-request (user messages, current diff output, dynamic file contents).

## How It Works

Add `"cache_control": {"type": "ephemeral"}` to the last block of the content you want cached. Everything up to and including that block is stored as the cache key.

```python
import anthropic

client = anthropic.Anthropic()

# Read your stable docs once
with open("AGENTS.md") as f:
    agents_md = f.read()
with open("TECH_STACK.md") as f:
    tech_stack = f.read()

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    system=[
        {
            "type": "text",
            "text": "You are a code review agent. Follow the rules in the docs below.",
        },
        {
            "type": "text",
            "text": agents_md,
        },
        {
            "type": "text",
            "text": tech_stack,
            "cache_control": {"type": "ephemeral"},  # cache everything up to here
        },
    ],
    messages=[
        {"role": "user", "content": "Review the following diff:\n\n" + current_diff}
    ],
)
```

On the first call: full input token cost.
On subsequent calls within the cache TTL: ~10% cost for the cached prefix, full cost only for the dynamic suffix.

## Cache Placement Rules

1. **Put `cache_control` on the last stable block**, not on every block. The cache key is the entire prefix up to that point.
2. **Stable content first, dynamic content last.** System prompt → large docs → (cache boundary) → current task/diff/user message.
3. **Minimum cacheable size is 1024 tokens** (Sonnet/Opus) or 2048 tokens (Haiku). Don't bother caching small injections.
4. **Cache TTL is 5 minutes** by default. For long-running agent sessions, structure your code to make calls within that window or accept a cache miss.

## Multi-Turn Agent Pattern

For an agent that processes many files in sequence, cache the shared context once:

```python
shared_system = [
    {"type": "text", "text": agents_md},
    {"type": "text", "text": design_md},
    {
        "type": "text",
        "text": coding_standards,
        "cache_control": {"type": "ephemeral"},
    },
]

for file_path in files_to_review:
    with open(file_path) as f:
        content = f.read()

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=shared_system,          # cache hit after first call
        messages=[
            {"role": "user", "content": f"Review {file_path}:\n\n{content}"}
        ],
    )
    process(response)
```

Without caching: each call pays full input cost for the shared context.
With caching: first call pays full cost; subsequent calls pay ~10% for the shared context.

## Checking Cache Hit Rate

The API response includes usage stats:

```python
print(response.usage)
# Usage(
#   input_tokens=245,
#   cache_creation_input_tokens=8192,  # tokens written to cache (first call)
#   cache_read_input_tokens=8192,      # tokens read from cache (subsequent calls)
#   output_tokens=512
# )
```

If `cache_read_input_tokens` is 0 on calls you expect to hit the cache, check:
- Are you sending the exact same prefix? Any change invalidates the cache.
- Did more than 5 minutes pass between calls?
- Is your cached block under the minimum token threshold?

## This Repo's Recommended Cache Anchors

| Content | Typical Size | Cache? |
|---|---|---|
| AGENTS.md | ~300 tokens | Yes (if injected every call) |
| TECH_STACK.md | ~200 tokens | Yes |
| DESIGN.md | ~400 tokens | Yes |
| coding-standards.md | ~500 tokens | Yes |
| Full file being reviewed | varies | Only if reviewed multiple times |
| Current git diff | varies | No — changes per call |
| User message | small | No |
