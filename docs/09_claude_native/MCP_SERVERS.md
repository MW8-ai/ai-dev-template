# MCP_SERVERS.md

## What MCP Is

Model Context Protocol (MCP) is an open standard for connecting AI models to external tools and data sources. An MCP server exposes tools, resources, or prompts that Claude Code can call during a session — the same way built-in tools like Read, Edit, and Bash work, but defined by you or a third party.

This lets you extend Claude Code with custom capabilities without modifying the model or writing complex prompt wrappers.

## How Claude Code Loads MCP Servers

Configure servers in `.claude/settings.json` under `"mcpServers"`. Claude Code starts the server processes when a session begins.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/project"]
    }
  }
}
```

Servers can also be configured globally in `~/.claude/settings.json` to be available across all projects.

## Well-Known MCP Servers

| Server | Package | What It Adds |
|---|---|---|
| GitHub | `@modelcontextprotocol/server-github` | Read/write issues, PRs, commits, files via GitHub API |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | Read-only SQL queries against a Postgres DB |
| Filesystem | `@modelcontextprotocol/server-filesystem` | Extended file operations beyond the built-in Read/Write |
| Brave Search | `@modelcontextprotocol/server-brave-search` | Web search via Brave API |
| Slack | `@modelcontextprotocol/server-slack` | Read channels, post messages |
| Memory | `@modelcontextprotocol/server-memory` | Persistent key-value store across sessions |
| Fetch | `@modelcontextprotocol/server-fetch` | HTTP GET requests to arbitrary URLs |

Check the MCP server registry for the current list: https://github.com/modelcontextprotocol/servers

## Building a Custom MCP Server

When an existing server doesn't cover your use case, build a minimal one. The TypeScript SDK is the reference implementation.

```typescript
// server.ts — minimal MCP server exposing one tool
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "my-repo-tools", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Declare available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_open_issues",
      description: "Returns open GitHub issues for this repo filtered by label",
      inputSchema: {
        type: "object",
        properties: {
          label: { type: "string", description: "Issue label to filter by" },
        },
        required: ["label"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_open_issues") {
    const { label } = request.params.arguments as { label: string };
    const issues = await fetchIssues(label); // your implementation
    return {
      content: [{ type: "text", text: JSON.stringify(issues, null, 2) }],
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

```json
// .claude/settings.json
{
  "mcpServers": {
    "repo-tools": {
      "command": "node",
      "args": ["./tools/mcp-server/dist/server.js"]
    }
  }
}
```

## MCP for This Repo

Useful custom servers for an AI dev template workflow:

### CI Status Server

Expose GitHub Actions run results as a tool. Claude Code can check CI status without you copying output into the chat.

```text
tool: get_ci_status(branch) → latest workflow run + failed steps
tool: get_pr_checks(pr_number) → all check results for a PR
```

### Doc Freshness Server

Expose a tool that compares doc mtimes against the source files they describe.

```text
tool: check_doc_freshness(doc_path) → last modified, related source files, drift score
```

### Secrets Scanner

Wrap `trufflehog` or `gitleaks` as a tool Claude can call before committing.

```text
tool: scan_for_secrets(file_path) → list of potential secrets found
```

## Permissions for MCP Tools

MCP tool calls go through the same permission system as built-in tools. Add MCP tool patterns to `.claude/settings.json` to auto-allow or auto-deny:

```json
{
  "permissions": {
    "allow": [
      "mcp__github__list_issues",
      "mcp__github__get_file_contents",
      "mcp__repo-tools__get_ci_status"
    ],
    "deny": [
      "mcp__github__delete_file",
      "mcp__github__merge_pull_request"
    ]
  }
}
```

Pattern: `mcp__<server-name>__<tool-name>`

## Security Considerations

- MCP servers run as local processes with the same OS permissions as Claude Code.
- Never give an MCP server access to production secrets unless you've reviewed its source.
- Prefer read-only tools by default; require explicit allow for write operations.
- For third-party servers installed via `npx`, pin the version to avoid supply-chain drift: `npx -y @modelcontextprotocol/server-github@1.2.3`.
- Treat an MCP server that calls external APIs as a data exfiltration surface — review what it sends and where.
