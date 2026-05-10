# MCP Overview

MCP stands for **Model Context Protocol**.

It is a protocol for connecting AI clients to external tools, data, and systems through MCP servers.

---

## Plain-English Explanation

An AI tool often needs context or capabilities outside the chat window.

MCP provides a structured way for an AI client to ask an MCP server for tools or data.

```text
AI client
↓
MCP server
↓
Tool, data source, API, filesystem, database, or service
```

---

## Common Terms

| Term | Meaning |
|---|---|
| MCP | Model Context Protocol |
| MCP client | The AI application that connects to MCP servers |
| MCP server | A program that exposes tools or data through MCP |
| Tool | A callable capability exposed to the AI client |
| Resource | Data exposed to the AI client |
| Prompt | A reusable instruction pattern exposed through MCP |

---

## Why MCP Matters

MCP can make AI tools more useful by connecting them to:

- files
- documentation
- GitHub
- databases
- ticket systems
- cloud services
- local tools
- internal APIs

But that usefulness creates risk. If an MCP server can read files, call APIs, or modify systems, it must be reviewed before use.

---

## Safe Use Pattern

```text
Discover MCP server
↓
Review source and license
↓
Review permissions
↓
Test in sandbox
↓
Approve limited use
↓
Document owner and update plan
```

---

## What Not To Do

Do not:

- install random MCP servers directly into a work environment
- give MCP servers production secrets by default
- connect MCP servers to sensitive systems without approval
- assume a reference server is production-ready
- run MCP servers with broad filesystem or network access unless required

---

## Next Step

Continue to:

[MCP_SECURITY_MODEL.md](MCP_SECURITY_MODEL.md)
