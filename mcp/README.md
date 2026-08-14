# Local MCP servers for domain management

This folder contains two small [MCP](https://modelcontextprotocol.io) servers that
let an MCP client (Claude Code, Claude Desktop, …) manage this project's domains.
They are registered for Claude Code in the repo-root [`.mcp.json`](../.mcp.json).

| Server | Folder | Use it for | Env var |
|---|---|---|---|
| **`cloudflare`** | [`cloudflare/`](./cloudflare/server.js) | **DNS records** — point a domain at your site, email (MX/SPF/DKIM), any record. **This is the primary one.** | `CLOUDFLARE_API_TOKEN` |
| **`ionos`** | [`ionos/`](./ionos/server.js) | IONOS **registrar** view (list/read domains) and **SSL**; DNS only for domains that actually use IONOS nameservers. | `IONOS_API_KEY` |

## Why Cloudflare is the primary one

The domain `assistenzabat.it` is **registered at IONOS but delegated to Cloudflare**
(nameservers `*.ns.cloudflare.com`). For such a domain the authoritative DNS lives at
**Cloudflare**, so DNS records must be edited there — editing them at IONOS has no
effect. IONOS remains only the registrar (renewals, transfers, contacts, nameserver
settings), which are done in the my.ionos panel, not via API.

## One-time setup

### 1. Install dependencies (covers both servers)

```sh
cd mcp
npm install
```

Node.js **18+** is required (the servers use the built-in `fetch`). One `node_modules`
here is shared by both servers.

### 2. Create the API credentials

- **Cloudflare token** — https://dash.cloudflare.com/profile/api-tokens → *Create Token*.
  Give it **Zone → DNS → Edit** and **Zone → Zone → Read**, and (recommended) restrict it
  to the specific domain. Copy the token.
- **IONOS key** (optional, only for the IONOS server) — https://developer.hosting.ionos.com/keys.
  The key value is `"<publicprefix>.<secret>"`.

### 3. Provide the credentials as environment variables

The repo-root `.mcp.json` references `${CLOUDFLARE_API_TOKEN}` and `${IONOS_API_KEY}`,
so **no secret is ever written to a tracked file**. Export them before launching Claude
Code (add to your shell profile or a secrets manager):

```sh
export CLOUDFLARE_API_TOKEN="your-cloudflare-token"
export IONOS_API_KEY="your-ionos-prefix.your-ionos-secret"   # optional
```

If a variable is unset, Claude Code still starts — it just shows a missing-variable
warning for that server in `claude mcp list`.

### 4. Approve and verify (Claude Code)

Project-scoped servers need a one-time approval. Start Claude Code in the repo, approve
`cloudflare` (and `ionos`) when prompted, then:

```sh
claude mcp list
```

Then ask Claude, e.g. *“verifica il token Cloudflare e mostrami i record DNS di
assistenzabat.it”*.

## Tools

**cloudflare** — `cloudflare_verify_token`, `cloudflare_list_zones`,
`cloudflare_list_dns_records`, `cloudflare_create_dns_record`,
`cloudflare_update_dns_record`, `cloudflare_delete_dns_record`.

**ionos** — `ionos_list_dns_zones`, `ionos_get_dns_zone`, `ionos_add_dns_records`,
`ionos_update_dns_record`, `ionos_delete_dns_record`, `ionos_list_domains`,
`ionos_get_domain`, `ionos_list_ssl_certificates`, `ionos_get_ssl_certificate`,
`ionos_create_ssl_certificate`, `ionos_delete_ssl_certificate`.

## Safety

- Credentials are read from the environment at runtime and never committed.
- Delete operations require an explicit `confirm: true` argument.
- Set `CLOUDFLARE_MCP_READONLY=1` or `IONOS_MCP_READONLY=1` to expose only read-only
  (inspection) tools.
- Claude Code still prompts for permission on each tool call.
