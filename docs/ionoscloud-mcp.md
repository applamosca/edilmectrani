# IONOS Cloud MCP — not used by this project

> **Looking to manage this project's domains/DNS?** See
> [`mcp/README.md`](../mcp/README.md). The active setup uses a **Cloudflare** MCP
> (primary, for DNS) and an **IONOS hosting** MCP (registrar/SSL).

There are two different "IONOS" products, with different APIs:

- **IONOS Cloud** (cloud.ionos.com / DCD) — the enterprise platform (Compute,
  Kubernetes, Object Storage, Cloud DNS). Its official MCP server is
  [`ionos-cloud/ionoscloud-mcp`](https://github.com/ionos-cloud/ionoscloud-mcp).
- **IONOS hosting** (my.ionos.it) — domains, hosting, email. Managed via the
  [IONOS Developer API](https://developer.hosting.ionos.com) — this is what the
  `ionos` server in [`mcp/`](../mcp/README.md) wraps.

This project's domains are **not** on IONOS Cloud, so the `ionoscloud-mcp` server
is not configured here. If you ever do use IONOS Cloud, you can add it to
[`.mcp.json`](../.mcp.json) with:

```json
{
  "mcpServers": {
    "ionoscloud": {
      "command": "/usr/local/bin/ionoscloud-mcp",
      "env": { "IONOS_TOKEN": "${IONOS_TOKEN}" }
    }
  }
}
```

(Note: Claude Code uses `${VAR}` expansion, **not** the `${env:VAR}` shown on some
IONOS docs pages.)
