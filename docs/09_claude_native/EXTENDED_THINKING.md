# EXTENDED_THINKING.md

## What It Is

Extended thinking gives Claude a scratchpad to reason through a problem before producing its final response. The model emits `thinking` blocks (visible or hidden depending on your config) followed by the answer. This improves accuracy on tasks that require multi-step reasoning, trade-off analysis, or ambiguity resolution.

Extended thinking is available on **Sonnet 4.6** and **Opus 4.7**. Not available on Haiku 4.5.

## When to Enable It

Enable extended thinking when:

- Requirements are ambiguous and multiple valid interpretations exist
- The task involves genuine trade-offs with no obvious right answer
- You need the model to reason about security or compliance implications before answering
- Architecture decisions where the wrong choice is hard to reverse
- Debugging a non-obvious failure where the root cause is unclear
- The model has given shallow or incorrect answers on a task without thinking

Do not enable it for:

- Routine implementation of a known pattern (adds cost and latency with no benefit)
- Simple docs or formatting tasks
- Tasks where speed matters more than depth

## How to Enable It

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000,  # max tokens the model can use for thinking
    },
    messages=[
        {
            "role": "user",
            "content": "We need to decide between a monorepo and separate repos for our three services. "
                       "Read TECH_STACK.md and DESIGN.md context below and recommend an approach with trade-offs.\n\n"
                       + tech_stack_content + "\n\n" + design_content,
        }
    ],
)

# Response contains thinking blocks + answer blocks
for block in response.content:
    if block.type == "thinking":
        print("REASONING:", block.thinking)
    elif block.type == "text":
        print("ANSWER:", block.text)
```

## Budget Guidance

`budget_tokens` controls how much the model can spend on internal reasoning. More budget = deeper reasoning but higher cost and latency.

| Task Type | Suggested Budget |
|---|---|
| Quick ambiguity resolution | 2,000–4,000 |
| Feature design trade-off | 5,000–8,000 |
| Architecture decision | 8,000–16,000 |
| Security threat model | 10,000–20,000 |
| Complex compliance interpretation | 15,000–32,000 |

Start conservative. If the answer feels shallow, increase the budget.

`max_tokens` must be greater than `budget_tokens`. A common mistake is setting them equal.

## Streaming with Thinking

Streaming works with extended thinking. Thinking blocks stream as `content_block_start` / `content_block_delta` events with `type: "thinking"`.

```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=8000,
    thinking={"type": "enabled", "budget_tokens": 5000},
    messages=[{"role": "user", "content": your_prompt}],
) as stream:
    for event in stream:
        # handle thinking and text blocks as they arrive
        pass
```

## Multi-Turn Conversations

When doing multi-turn conversations with extended thinking enabled, you must pass thinking blocks back in the conversation history. Stripping them breaks the model's reasoning continuity.

```python
messages = []

# Turn 1
messages.append({"role": "user", "content": "What's the best DB schema for this use case?"})
response = client.messages.create(model="claude-opus-4-7", thinking=..., messages=messages)

# Preserve the full response (thinking + text) in history
messages.append({"role": "assistant", "content": response.content})

# Turn 2
messages.append({"role": "user", "content": "Now show me the migration script."})
response = client.messages.create(model="claude-opus-4-7", thinking=..., messages=messages)
```

## Task Routing with Thinking

Updated routing rule for this repo:

| Condition | Model | Thinking |
|---|---|---|
| Routine task, known pattern | Haiku 4.5 or Sonnet 4.6 | Off |
| Standard feature/fix, clear requirements | Sonnet 4.6 | Off |
| Ambiguous requirements, design choice | Sonnet 4.6 | On (4,000–8,000 tokens) |
| Architecture, security, compliance | Opus 4.7 | On (8,000–20,000 tokens) |
| Novel pattern, high-stakes decision | Opus 4.7 | On (max budget) |

## Cost Note

Thinking tokens are billed at the same rate as output tokens. A task with `budget_tokens: 10000` that uses all of the budget adds 10,000 output tokens to the bill. Use thinking selectively — it is not free reasoning.
