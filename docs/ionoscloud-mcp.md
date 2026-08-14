# IONOS Cloud MCP server

This repository ships a project-scoped [Model Context Protocol](https://modelcontextprotocol.io)
configuration for the [IONOS Cloud MCP server](https://github.com/ionos-cloud/ionoscloud-mcp),
defined in [`.mcp.json`](../.mcp.json). It lets MCP-aware clients (Claude Code, Cursor,
Cline, …) inspect and manage IONOS Cloud resources — Compute, DNS, Billing, Certificate
Manager and Object Storage.

The config references credentials through environment variables
(`${IONOS_TOKEN}`, `${IONOS_S3_ACCESS_KEY}`, `${IONOS_S3_SECRET_KEY}`) so that **no secrets
are committed to the repository**. You supply the values from your own environment.

## 1. Install the server binary

Download the `ionoscloud-mcp` binary for your platform from the
[releases page](https://github.com/ionos-cloud/ionoscloud-mcp/releases) and place it at the
path referenced in `.mcp.json`:

```sh
# Example (adjust the download URL for your OS/arch and the release version):
sudo install -m 0755 ./ionoscloud-mcp /usr/local/bin/ionoscloud-mcp
```

If you install it elsewhere, update the `command` field in `.mcp.json` to match.

## 2. Create the credentials

- **`IONOS_TOKEN`** (required) — generate in the IONOS Cloud DCD under
  **Management → Token Management**. Used for all control-plane APIs.
- **`IONOS_S3_ACCESS_KEY` / `IONOS_S3_SECRET_KEY`** (optional) — create under
  **Storage & Backup → IONOS Cloud Object Storage → Key management**. Only required for the
  Object Storage data-plane tools.

## 3. Export the environment variables

Claude Code expands `${VAR}` in `.mcp.json` from the environment it is launched with, so
export the variables before starting your client (add them to your shell profile, a secrets
manager, or an untracked local env file you `source`):

```sh
export IONOS_TOKEN="your-api-token"
export IONOS_S3_ACCESS_KEY="your-access-key"
export IONOS_S3_SECRET_KEY="your-secret-key"
```

> Never hard-code these values into `.mcp.json` or any other tracked file. If a variable is
> unset, the config still loads — Claude Code just reports a missing-variable warning for the
> `ionoscloud` server in `claude mcp list`.

## 4. Approve and verify (Claude Code)

Project-scoped MCP servers require a one-time approval. Start Claude Code in the repo, approve
the `ionoscloud` server when prompted, then confirm it is connected:

```sh
claude mcp list
```

## Notes

- All tools default to **read-only inspection**; write operations require an explicit
  two-phase confirmation, so the server is safe to connect for exploration.
- The server exposes a large tool set. To load tools on demand, add
  `"IONOS_MCP_LOAD_MODE": "lazy"` to the `env` block in `.mcp.json`.
- Reference: [Connect Claude Code to IONOS Cloud MCP](https://docs.ionos.com/cloud/ai/mcp-server/connect-to-an-ai-client/claude-code).
