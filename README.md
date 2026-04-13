# Vistoya MCP

Semantic search and recommendations across fashion stores, exposed as a Model Context Protocol server. Connect any MCP-compatible AI agent (Claude, Cursor, VS Code, ChatGPT, etc.) and let it discover products, find visually similar items, and explore stores in the Vistoya marketplace.

- **Registry name:** `io.github.vistoya/market`
- **Endpoint:** `https://api.vistoya.com/mcp`
- **Transport:** Streamable HTTP
- **Website:** https://vistoya.com

## Quick setup

```sh
npx @vistoya/mcp
```

Automatically detects and configures Claude Desktop, Claude Code, Cursor, Windsurf, and VS Code. Restart your AI client after running.

## What it does

Vistoya indexes fashion products from many stores and embeds them with a vision-language model. The MCP server lets agents query that index in natural language and reason over the results.

## Tools

| Tool | Description |
| --- | --- |
| `discover_products` | Semantic search across all indexed stores. Accepts a natural-language query plus optional filters (category, color, gender, price, etc.) and returns ranked products. |
| `find_similar` | Given a product ID, return visually and semantically similar products. |
| `get_product` | Fetch full details for a single product by ID. |
| `get_filters` | List available filter values (categories, colors, materials, brands, …) so the agent knows what's filterable. |
| `list_stores` | List all indexed stores with their metadata. |

## Manual install

### Claude Desktop / Claude Code

Add to `claude_desktop_config.json` (or your Claude Code MCP config):

```json
{
  "mcpServers": {
    "vistoya": {
      "url": "https://api.vistoya.com/mcp"
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "vistoya": {
      "url": "https://api.vistoya.com/mcp"
    }
  }
}
```

### VS Code (MCP extension)

Add to your `mcp.json`:

```json
{
  "servers": {
    "vistoya": {
      "type": "http",
      "url": "https://api.vistoya.com/mcp"
    }
  }
}
```

### Generic stdio fallback (clients that don't support remote yet)

Use [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) as a bridge:

```json
{
  "mcpServers": {
    "vistoya": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://api.vistoya.com/mcp"]
    }
  }
}
```

## Example prompts

Once connected, try:

- "Find me black leather jackets under $300"
- "Show me dresses similar to product `abc123`"
- "What stores does Vistoya index right now?"
- "Recommend a minimalist outfit for spring"

## Discoverability

This server is published on the official MCP Registry. You can find it at:

```
https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.vistoya/market
```

## Status

Public preview. The endpoint is publicly reachable and does not currently require authentication.

## License

MIT — see [LICENSE](./LICENSE).

## Contact

Issues and feature requests: open an issue on this repo.
