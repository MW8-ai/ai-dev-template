# BATCH_API.md

## What It Is

The Anthropic Batch API processes large numbers of requests asynchronously. You submit a batch of up to 10,000 requests, Anthropic processes them within 24 hours, and you retrieve results when ready. Batch requests cost 50% less than synchronous requests.

Use it for tasks where latency doesn't matter but volume or cost does.

## When to Use It

Good batch use cases:
- Nightly doc freshness review across all files in the repo
- Bulk code review of every file in a module
- Generating changelogs or summaries for a set of PRs or commits
- Running the same security checklist against many files
- Embedding or classifying large sets of documents
- Pre-generating prompt variations for the prompt library

Bad batch use cases:
- Interactive tasks where the user is waiting
- Tasks where result B depends on result A (batches are independent)
- Time-sensitive CI checks

## How to Submit a Batch

```python
import anthropic

client = anthropic.Anthropic()

# Build one request per file/task
requests = []
for file_path in files_to_review:
    with open(file_path) as f:
        content = f.read()

    requests.append({
        "custom_id": file_path,  # your key for matching results later
        "params": {
            "model": "claude-sonnet-4-6",
            "max_tokens": 1024,
            "system": "You are a documentation reviewer. Check for drift from the codebase.",
            "messages": [
                {"role": "user", "content": f"Review {file_path}:\n\n{content}"}
            ],
        },
    })

# Submit the batch
batch = client.messages.batches.create(requests=requests)
print(f"Batch ID: {batch.id}")
print(f"Status: {batch.processing_status}")
```

## Polling for Results

```python
import time

batch_id = batch.id

while True:
    batch = client.messages.batches.retrieve(batch_id)
    if batch.processing_status == "ended":
        break
    print(f"Still processing... {batch.request_counts}")
    time.sleep(60)  # check every minute

# Stream results
for result in client.messages.batches.results(batch_id):
    if result.result.type == "succeeded":
        print(f"{result.custom_id}: {result.result.message.content[0].text}")
    elif result.result.type == "errored":
        print(f"{result.custom_id}: ERROR {result.result.error}")
```

## Combine with Prompt Caching

Batch requests support prompt caching. If all requests share a large stable system prompt, mark it cacheable. You pay reduced input cost for the cached prefix on every request in the batch.

```python
shared_system = [
    {"type": "text", "text": agents_md},
    {"type": "text", "text": coding_standards, "cache_control": {"type": "ephemeral"}},
]

requests = [
    {
        "custom_id": fp,
        "params": {
            "model": "claude-sonnet-4-6",
            "max_tokens": 1024,
            "system": shared_system,
            "messages": [{"role": "user", "content": f"Review {fp}:\n\n{read(fp)}"}],
        },
    }
    for fp in files
]
```

## This Repo's Batch Workflows

### Nightly Doc Freshness Check

Run every night on a schedule. For each `.md` file in `docs/`:
1. Pass the file + the corresponding source files it describes
2. Ask: "Does this doc accurately reflect the current code? List any drift."
3. Collect results → open a GitHub issue if drift is found

### Bulk Security Pass

On release branches, batch-run the `SECURITY_REVIEW_PROMPT` against every changed file. Collect findings → add to PR description.

### Prompt Library Evaluation

When updating `docs/05_prompts/`, run each prompt variation against a fixed set of test inputs. Compare outputs to pick the best variation. Batching makes this cheap enough to do routinely.

## Cost Model

- Synchronous: $X per MTok input, $Y per MTok output
- Batch: $X/2 per MTok input, $Y/2 per MTok output
- With prompt caching on batch: ~$X/20 per MTok for the cached prefix

For large nightly jobs (e.g., reviewing 200 files at ~2K tokens each = 400K tokens), batch + caching can reduce cost by 80–90% compared to synchronous calls without caching.

## Limits

| Limit | Value |
|---|---|
| Max requests per batch | 10,000 |
| Max processing time | 24 hours |
| Result retention | 29 days |
| Concurrent batches | No documented limit; use sensibly |
