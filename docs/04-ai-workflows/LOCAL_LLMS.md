# Local LLMs

Running large language models on your own hardware. No API costs, no data leaving your machine, no rate limits, works offline.

Related docs: [AI_OVERVIEW.md](./AI_OVERVIEW.md) | [HUMAN_IN_LOOP.md](./HUMAN_IN_LOOP.md) | [PROMPT_STRATEGIES.md](./PROMPT_STRATEGIES.md)

---

## Why Run Locally

| Reason | Detail |
|---|---|
| **Privacy** | Code, prompts, and outputs never leave your machine |
| **Cost** | No per-token billing after hardware — useful for high-volume tasks |
| **Offline** | Works on a plane, in a secure facility, without internet |
| **Speed** | No network latency; Apple Silicon especially fast for inference |
| **Control** | Pin a specific model version; no surprise behavior changes from provider updates |
| **Experimentation** | Swap models in seconds; test different sizes and quantizations |

Local models trade capability ceiling for control and cost. A well-chosen local 34B model handles most everyday coding and documentation tasks without touching the API.

---

## Tools

### Ollama (recommended — start here)

The simplest way to run local models. Manages downloads, GPU/CPU routing, and an OpenAI-compatible API automatically.

```bash
# Install (Mac/Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Pull and run a model
ollama pull llama3.3
ollama run llama3.3

# List what's installed
ollama list

# Start as a background server (exposes port 11434)
ollama serve
```

OpenAI-compatible endpoint for tool integration:
```
http://localhost:11434/v1
```

→ Full model library: **https://ollama.com/library**

---

### LM Studio (GUI — good for beginners)

Desktop app for browsing, downloading, and running GGUF models. Includes a chat interface and a local server mode that mimics the OpenAI API.

→ **https://lmstudio.ai**

Best for: exploring models visually, no command line required.

---

### llama.cpp (low-level, maximum control)

The underlying engine most tools use. Supports every quantization format, fine-grained GPU layer offloading, and minimal dependencies.

→ **https://github.com/ggerganov/llama.cpp**

Best for: production local deployments, custom quantization, embedding generation.

---

### Jan.ai

Open-source, privacy-first desktop app. Supports local models and remote API connections in one interface.

→ **https://jan.ai**

---

### AnythingLLM

Adds a RAG (Retrieval-Augmented Generation) layer on top of local models. Connect your documents, codebase, or knowledge base.

→ **https://anythingllm.com**

Best for: asking questions against your own docs without sending them to an external API.

---

## Hardware Requirements

### Apple Silicon (Unified Memory)

Apple Silicon's key advantage: GPU and CPU share the same memory pool. There is no separate VRAM limit — the model fits in RAM and runs at GPU speeds.

| Chip | Typical RAM | Recommended Models | Notes |
|---|---|---|---|
| M1 / M2 (8GB) | 8GB | 3B–7B Q4 | Tight — use quantized models only |
| M1 / M2 (16GB) | 16GB | 7B–13B comfortably | Good daily driver setup |
| M3 / M4 (16GB) | 16GB | 7B–14B comfortably | Faster inference than M1/M2 equiv |
| M3 / M4 (32GB) | 32GB | 34B comfortably, 70B Q4 tight | Good balance of size + speed |
| M4 Pro (48GB) | 48GB | 70B comfortably | Sweet spot for full 70B |
| M4 Pro / M4 Max (64GB) | 64GB | 70B full precision, some 120B+ | Most models run without compromise |
| M4 Max (128GB) | 128GB | 120B+, multiple models loaded | Near-datacenter capability |
| M4 Ultra (192GB) | 192GB | 400B+ with quantization | Frontier local capability |

**Tokens/second reference (M4 Pro, 48GB, Q4_K_M quantization):**
- Llama 3.3 70B: ~25–35 tok/s
- Qwen 2.5 32B: ~50–70 tok/s
- Phi-4 14B: ~80–100 tok/s
- Gemma 3 12B: ~80–110 tok/s

### Windows / Linux (Discrete GPU)

| VRAM | Recommended Models |
|---|---|
| 6GB | 7B Q4 only (tight) |
| 8GB | 7B Q4–Q8 comfortably |
| 12GB | 13B Q4, 7B full |
| 16GB | 34B Q4, 13B comfortably |
| 24GB | 70B Q4 squeezed, 34B comfortably |
| 2× 24GB | 70B comfortably |
| 48GB+ (H100/A100) | 70B full precision, 120B+ |

**CPU-only** is possible but slow — expect 3–8 tok/s on modern hardware. Fine for offline access; not ideal for interactive use.

---

## Model Recommendations by Task

### Coding

| Model | Size | Strengths | Ollama Pull |
|---|---|---|---|
| **Qwen2.5-Coder 32B** | 32B | Best overall local coding model; strong across languages | `ollama pull qwen2.5-coder:32b` |
| **Qwen2.5-Coder 7B** | 7B | Fast, surprisingly capable for size | `ollama pull qwen2.5-coder:7b` |
| **DeepSeek-Coder-V2** | 16B | Strong code completion and explanation | `ollama pull deepseek-coder-v2` |
| **Phi-4** | 14B | Microsoft; punches above weight on code | `ollama pull phi4` |
| **CodeLlama 34B** | 34B | Meta; fill-in-middle, code infill | `ollama pull codellama:34b` |

### General Purpose / Chat

| Model | Size | Strengths | Ollama Pull |
|---|---|---|---|
| **Llama 3.3 70B** | 70B | Best overall local model; strong reasoning and instruction following | `ollama pull llama3.3:70b` |
| **Qwen 2.5 72B** | 72B | Competitive with Llama 3.3; excellent multilingual | `ollama pull qwen2.5:72b` |
| **Llama 3.1 8B** | 8B | Best 8B-class model; fast, good quality | `ollama pull llama3.1:8b` |
| **Gemma 3 27B** | 27B | Google; strong at structured outputs and following instructions | `ollama pull gemma3:27b` |
| **Command R+** | 104B | Cohere; optimized for RAG and document reasoning | `ollama pull command-r-plus` |

### Reasoning / Problem Solving

| Model | Size | Strengths | Ollama Pull |
|---|---|---|---|
| **DeepSeek R1 32B** | 32B | Chain-of-thought reasoning; strong math and logic | `ollama pull deepseek-r1:32b` |
| **DeepSeek R1 70B** | 70B | Better reasoning at cost of speed | `ollama pull deepseek-r1:70b` |
| **QwQ 32B** | 32B | Alibaba reasoning model; competitive with R1 | `ollama pull qwq:32b` |
| **Phi-4 Reasoning** | 14B | Fast reasoning for smaller hardware | `ollama pull phi4-reasoning` |

### Small / Edge / Low-RAM

| Model | Size | RAM Required | Strengths |
|---|---|---|---|
| **Phi-4 Mini** | 3.8B | 4GB | Microsoft; best-in-class for 4B — surprisingly capable |
| **Gemma 3 4B** | 4B | 4–5GB | Google; good instruction following at tiny size |
| **Llama 3.2 3B** | 3B | 4GB | Meta; fast edge deployment |
| **Qwen 2.5 3B** | 3B | 4GB | Strong multilingual for size |
| **Qwen 2.5 1.5B** | 1.5B | 2–3GB | Extremely fast; simple task automation |
| **SmolLM2** | 1.7B | 2GB | HuggingFace; fastest usable model |

### Embeddings (for RAG / semantic search)

| Model | Dimensions | Use Case | Ollama Pull |
|---|---|---|---|
| **nomic-embed-text** | 768 | Best general-purpose local embedding | `ollama pull nomic-embed-text` |
| **mxbai-embed-large** | 1024 | Higher quality; larger index | `ollama pull mxbai-embed-large` |
| **all-minilm** | 384 | Fast, small, good for large corpora | `ollama pull all-minilm` |

### Vision / Multimodal

| Model | Size | Strengths | Ollama Pull |
|---|---|---|---|
| **Llama 3.2 Vision 11B** | 11B | Meta; image + text reasoning | `ollama pull llama3.2-vision:11b` |
| **Llama 3.2 Vision 90B** | 90B | Best local vision model; needs 64GB+ RAM | `ollama pull llama3.2-vision:90b` |
| **Gemma 3 12B** | 12B | Multimodal; efficient for size | `ollama pull gemma3:12b` |
| **LLaVA 13B** | 13B | Image description, OCR assistance | `ollama pull llava:13b` |

---

## Quantization Quick Reference

Models are distributed in quantized formats to reduce size. The format affects quality and RAM requirements.

| Format | Quality | RAM vs Full | Best For |
|---|---|---|---|
| `Q2_K` | Noticeably degraded | ~25% | Absolute minimum RAM |
| `Q4_K_M` | Good — default recommendation | ~40% | Daily use; best quality/size tradeoff |
| `Q5_K_M` | Very good | ~50% | When you have the RAM |
| `Q6_K` | Excellent | ~60% | Near-full quality |
| `Q8_0` | Near-identical to full | ~75% | When RAM is not a concern |
| `F16` | Full precision | 100% | Maximum quality, benchmarking |

For most users: **Q4_K_M** is the sweet spot.

Ollama handles this automatically — it picks the best quantization for your available RAM. To specify explicitly:

```bash
ollama pull llama3.3:70b-instruct-q4_K_M
```

---

## Quick Recipes

### Use a local model in a script (OpenAI-compatible API)

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",  # required by the client but ignored
)

response = client.chat.completions.create(
    model="llama3.3:70b",
    messages=[{"role": "user", "content": "Explain this function:"}]
)
print(response.choices[0].message.content)
```

### Route tasks between local and cloud

```python
def get_client(task_type: str):
    if task_type in ("draft", "summarize", "classify"):
        # Local — private, cheap, fast enough
        return OpenAI(base_url="http://localhost:11434/v1", api_key="ollama"), "qwen2.5-coder:32b"
    else:
        # Cloud — complex reasoning, frontier capability
        import anthropic
        return anthropic.Anthropic(), "claude-opus-4-7"
```

### Check what's running

```bash
ollama ps           # models currently loaded in memory
ollama list         # all downloaded models
ollama show llama3.3 --modelfile   # inspect model config
```

---

## Offloading Strategy for This Repo

Which tasks to run locally vs send to a cloud API:

| Task | Recommended | Why |
|---|---|---|
| Changelog entry draft | Local (Qwen2.5-Coder 32B or Llama 3.3) | Repetitive, structured, private |
| Doc formatting / cleanup | Local (Phi-4 or Gemma 3 12B) | Simple pattern following |
| Summarize a diff | Local (Qwen2.5-Coder) | Code context, privacy |
| Search / find in codebase | Local embedding + vector search | No data leaves machine |
| Architecture decision | Cloud (Claude Opus or GPT-4o) | High-stakes reasoning |
| Security review | Cloud + human | Never trust this to a local model alone |
| Write new feature (complex) | Cloud (Claude Sonnet/Opus) | Context window + quality |
| Generate test stubs | Local (Qwen2.5-Coder 7B) | Fast, deterministic, cheap |
| Explain existing code | Local (Llama 3.3 70B) | No IP leaves machine |

---

## Keeping This Current

The local LLM space moves fast — new models drop weekly. This doc is tracked by the Living Updates system via:

- `huggingface-blog` source — major model releases
- `meta-ai-blog` source — Llama family updates
- `mistral-news` source — Mistral model releases
- `ollama-releases` source — new model availability in Ollama

When a significant new model releases, a draft note lands in `docs/06-living-updates/incoming/`. A human reviews it and updates this doc if the model warrants a spot.

→ See current source tracking: [docs/06-living-updates/sources/update-sources.yml](../06-living-updates/sources/update-sources.yml)

---

## Next Step

→ [docs/04-ai-workflows/HUMAN_IN_LOOP.md](HUMAN_IN_LOOP.md) — when to use local models vs cloud APIs, and the human review rules that apply to both
