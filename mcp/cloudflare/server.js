#!/usr/bin/env node
/**
 * Cloudflare DNS MCP server
 * -------------------------
 * Wraps the Cloudflare API v4 (https://api.cloudflare.com/client/v4) so an MCP
 * client (Claude Code, Claude Desktop, ...) can read and edit DNS records for
 * domains whose nameservers point to Cloudflare — e.g. a domain registered at
 * IONOS but delegated to *.ns.cloudflare.com. This is where the *real* DNS
 * lives for such domains, so this is the right place to point a site, add
 * email records, etc.
 *
 * Auth: export CLOUDFLARE_API_TOKEN="<token>"
 *   Create a scoped token at https://dash.cloudflare.com/profile/api-tokens
 *   with permissions: Zone → DNS → Edit, and Zone → Zone → Read
 *   (limit it to the specific zone/domain you want to manage).
 *   The token is sent as a Bearer header and read from the environment at
 *   runtime — never hard-code it or commit it.
 *
 * Optional env:
 *   CLOUDFLARE_MCP_READONLY=1     hide every write tool (inspection-only)
 *   CLOUDFLARE_MCP_TIMEOUT_MS     per-request timeout in ms (default 20000)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_ROOT = "https://api.cloudflare.com/client/v4";
const READONLY = /^(1|true|yes|on)$/i.test(process.env.CLOUDFLARE_MCP_READONLY ?? "");
const TIMEOUT_MS = Number(process.env.CLOUDFLARE_MCP_TIMEOUT_MS ?? 20000);

/** An error whose message is safe and useful to surface to the agent/user. */
class UserError extends Error {}

/** Turn a Cloudflare error envelope / HTTP status into an actionable message. */
function explainError(status, body, method, path) {
  const cfErrors = Array.isArray(body?.errors) && body.errors.length
    ? body.errors.map((e) => `${e.code ?? "?"}: ${e.message ?? JSON.stringify(e)}`).join("; ")
    : typeof body === "string"
      ? body
      : JSON.stringify(body);
  const hints = {
    400: "Bad request — check the record fields (type, name, content; priority is required for MX).",
    401: "Unauthorized — check CLOUDFLARE_API_TOKEN is correct and not expired.",
    403: "Forbidden — the token likely lacks permission. Needs Zone:Read + DNS:Edit for this zone.",
    404: "Not found — check the zoneId / recordId.",
    429: "Rate limited — Cloudflare allows ~1200 requests / 5 minutes per token.",
  };
  const hint = hints[status] ? ` ${hints[status]}` : "";
  return `Cloudflare API error ${status} on ${method} ${path}.${hint}\nDetails: ${cfErrors}`;
}

/** Perform an authenticated request; returns the unwrapped `result`. */
async function cfRequest(method, path, { query, body } = {}) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) {
    throw new UserError(
      "CLOUDFLARE_API_TOKEN is not set. Create a scoped token at " +
        "https://dash.cloudflare.com/profile/api-tokens (Zone:Read + DNS:Edit) and " +
        'export it as CLOUDFLARE_API_TOKEN="<token>".',
    );
  }

  const url = new URL(API_ROOT + path);
  for (const [k, v] of Object.entries(query ?? {})) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new UserError(`Request to Cloudflare timed out after ${TIMEOUT_MS} ms (${method} ${path}).`);
    }
    throw new UserError(`Network error calling Cloudflare (${method} ${path}): ${err?.message ?? err}`);
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let body_ = null;
  if (text) {
    try {
      body_ = JSON.parse(text);
    } catch {
      body_ = text;
    }
  }
  if (!res.ok || body_?.success === false) {
    throw new UserError(explainError(res.status, body_, method, path));
  }
  // Cloudflare wraps payloads as { success, result, result_info, ... }.
  if (body_ && typeof body_ === "object" && "result" in body_) {
    return body_.result_info
      ? { result: body_.result, result_info: body_.result_info }
      : body_.result;
  }
  return body_ ?? { ok: true };
}

/** Tool registry. */
const tools = [
  {
    name: "cloudflare_verify_token",
    description:
      "Verify the configured Cloudflare API token is valid and active. Good first check before other calls.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      title: "Verify token",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: () => cfRequest("GET", "/user/tokens/verify"),
  },
  {
    name: "cloudflare_list_zones",
    description:
      "List Cloudflare zones (domains) the token can see. Optionally filter by exact domain name. Returns each zone's id, name and status. Use the zone id with the DNS record tools.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Optional exact domain name filter, e.g. 'assistenzabat.it'." },
      },
      additionalProperties: false,
    },
    annotations: {
      title: "List zones",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: (a) => cfRequest("GET", "/zones", { query: { name: a.name, per_page: 50 } }),
  },
  {
    name: "cloudflare_list_dns_records",
    description:
      "List DNS records in a zone. Optionally filter by type and/or name. Each record includes id, type, name, content, ttl, proxied and priority.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string", description: "Zone id from cloudflare_list_zones." },
        type: { type: "string", description: "Optional filter, e.g. 'A', 'CNAME', 'MX', 'TXT'." },
        name: { type: "string", description: "Optional exact record name filter, e.g. 'www.assistenzabat.it'." },
      },
      required: ["zoneId"],
      additionalProperties: false,
    },
    annotations: {
      title: "List DNS records",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: (a) =>
      cfRequest("GET", `/zones/${encodeURIComponent(a.zoneId)}/dns_records`, {
        query: { type: a.type, name: a.name, per_page: 100 },
      }),
  },
  {
    name: "cloudflare_create_dns_record",
    description:
      "Create a DNS record. type/name/content are required. Use proxied=true to route A/AAAA/CNAME through Cloudflare (orange cloud, gives free HTTPS); proxied=false for a plain DNS record (e.g. mail, verification). priority is required for MX. ttl in seconds, or 1 for automatic.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string", description: "Zone id from cloudflare_list_zones." },
        type: { type: "string", description: "A, AAAA, CNAME, MX, TXT, NS, SRV, CAA, ..." },
        name: {
          type: "string",
          description: "Record name. Use the domain itself for the root (e.g. 'assistenzabat.it') or a subdomain (e.g. 'www').",
        },
        content: { type: "string", description: "Record value: IP for A/AAAA, hostname for CNAME/MX, text for TXT." },
        ttl: { type: "integer", description: "TTL in seconds; 1 = automatic (default)." },
        proxied: { type: "boolean", description: "Route through Cloudflare (A/AAAA/CNAME only). Default false." },
        priority: { type: "integer", description: "Priority (required for MX/SRV, e.g. 10)." },
      },
      required: ["zoneId", "type", "name", "content"],
      additionalProperties: false,
    },
    annotations: {
      title: "Create DNS record",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    readOnly: false,
    handler: (a) => {
      const body = { type: a.type, name: a.name, content: a.content, ttl: a.ttl ?? 1 };
      if (a.proxied !== undefined) body.proxied = a.proxied;
      if (a.priority !== undefined) body.priority = a.priority;
      return cfRequest("POST", `/zones/${encodeURIComponent(a.zoneId)}/dns_records`, { body });
    },
  },
  {
    name: "cloudflare_update_dns_record",
    description:
      "Update an existing DNS record (by zoneId + recordId). Provide only the fields to change: type, name, content, ttl, proxied, priority. Get recordId from cloudflare_list_dns_records.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string" },
        recordId: { type: "string" },
        type: { type: "string" },
        name: { type: "string" },
        content: { type: "string" },
        ttl: { type: "integer" },
        proxied: { type: "boolean" },
        priority: { type: "integer" },
      },
      required: ["zoneId", "recordId"],
      additionalProperties: false,
    },
    annotations: {
      title: "Update DNS record",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: false,
    handler: (a) => {
      const body = {};
      for (const k of ["type", "name", "content", "ttl", "proxied", "priority"]) {
        if (a[k] !== undefined) body[k] = a[k];
      }
      if (Object.keys(body).length === 0) {
        throw new UserError("Nothing to update: provide at least one field to change.");
      }
      return cfRequest(
        "PATCH",
        `/zones/${encodeURIComponent(a.zoneId)}/dns_records/${encodeURIComponent(a.recordId)}`,
        { body },
      );
    },
  },
  {
    name: "cloudflare_delete_dns_record",
    description:
      "Delete a DNS record (by zoneId + recordId). Irreversible — you MUST pass confirm=true. Get recordId from cloudflare_list_dns_records.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string" },
        recordId: { type: "string" },
        confirm: { type: "boolean", description: "Must be true to actually delete." },
      },
      required: ["zoneId", "recordId", "confirm"],
      additionalProperties: false,
    },
    annotations: {
      title: "Delete DNS record",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: false,
    handler: (a) => {
      if (a.confirm !== true) throw new UserError("Refusing to delete: pass confirm=true to proceed.");
      return cfRequest(
        "DELETE",
        `/zones/${encodeURIComponent(a.zoneId)}/dns_records/${encodeURIComponent(a.recordId)}`,
      );
    },
  },
];

const availableTools = tools.filter((t) => !READONLY || t.readOnly);
const toolsByName = new Map(availableTools.map((t) => [t.name, t]));

const server = new Server(
  { name: "cloudflare-dns", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: availableTools.map(({ name, description, inputSchema, annotations }) => ({
    name,
    description,
    inputSchema,
    annotations,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = toolsByName.get(req.params.name);
  if (!tool) {
    return { isError: true, content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }] };
  }
  try {
    const result = await tool.handler(req.params.arguments ?? {});
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    const message =
      err instanceof UserError ? err.message : `Unexpected error: ${err?.message ?? err}`;
    return { isError: true, content: [{ type: "text", text: message }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
// Logs MUST go to stderr; stdout is the MCP protocol channel.
console.error(
  `cloudflare-dns MCP server running (stdio) — ${availableTools.length} tools${READONLY ? " [read-only]" : ""}`,
);
