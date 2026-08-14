#!/usr/bin/env node
/**
 * IONOS Hosting MCP server
 * -------------------------
 * Wraps the IONOS Developer API (https://developer.hosting.ionos.com) so an
 * MCP client (Claude Code, Claude Desktop, ...) can manage IONOS *hosting*
 * domains — the my.ionos product, NOT IONOS Cloud / DCD.
 *
 * Covered APIs (base https://api.hosting.ionos.com):
 *   - DNS     /dns/v1      list zones, read a zone, add/update/delete records
 *   - Domains /domains/v1  list / read domains (read-only; renewals & transfers
 *                          are not exposed by the API — use the my.ionos panel)
 *   - SSL     /ssl/v1      list / read / create / delete certificates
 *
 * Auth: export IONOS_API_KEY="<publicprefix>.<secret>"
 *       (create the key at https://developer.hosting.ionos.com/keys).
 *       It is sent as the X-API-Key header and is read from the environment at
 *       runtime — never hard-code it or commit it.
 *
 * Optional env:
 *   IONOS_MCP_READONLY=1     hide every write tool (safe, inspection-only)
 *   IONOS_MCP_TIMEOUT_MS     per-request timeout in ms (default 20000)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_ROOT = "https://api.hosting.ionos.com";
const READONLY = /^(1|true|yes|on)$/i.test(process.env.IONOS_MCP_READONLY ?? "");
const TIMEOUT_MS = Number(process.env.IONOS_MCP_TIMEOUT_MS ?? 20000);

/** An error whose message is safe and useful to surface to the agent/user. */
class UserError extends Error {}

/** Map an HTTP failure to an actionable message. */
function explainHttpError(status, data, method, path) {
  const detail =
    typeof data === "string"
      ? data
      : data && (data.message || data.messages || data.error)
        ? JSON.stringify(data.message ?? data.messages ?? data.error)
        : JSON.stringify(data);
  const hints = {
    400: "Bad request — check the record/body fields (name, type, content, ttl).",
    401: 'Unauthorized — check IONOS_API_KEY is "<publicprefix>.<secret>" and still active.',
    403: "Forbidden — this API key may not be authorised for this API (DNS/Domains/SSL).",
    404: "Not found — check the id (zoneId / recordId / domainId / certificateId).",
    422: "Unprocessable — a field value was rejected; check types and formats.",
    429: "Rate limit exceeded — the IONOS API allows ~1200 requests/hour per key.",
  };
  const hint = hints[status] ? ` ${hints[status]}` : "";
  return `IONOS API error ${status} on ${method} ${path}.${hint}\nResponse: ${detail}`;
}

/** Perform an authenticated request against the IONOS Developer API. */
async function ionosRequest(method, path, { query, body } = {}) {
  const apiKey = process.env.IONOS_API_KEY;
  if (!apiKey) {
    throw new UserError(
      "IONOS_API_KEY is not set. Create an API key at " +
        "https://developer.hosting.ionos.com/keys and export it as " +
        'IONOS_API_KEY="<publicprefix>.<secret>".',
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
        "X-API-Key": apiKey,
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new UserError(`Request to IONOS timed out after ${TIMEOUT_MS} ms (${method} ${path}).`);
    }
    throw new UserError(`Network error calling IONOS (${method} ${path}): ${err?.message ?? err}`);
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) throw new UserError(explainHttpError(res.status, data, method, path));
  return data ?? { ok: true };
}

const dnsRecordItemSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Fully-qualified record name, e.g. 'www.example.com' or 'example.com'.",
    },
    type: {
      type: "string",
      description: "Record type: A, AAAA, CNAME, MX, TXT, NS, SRV, CAA, ...",
    },
    content: {
      type: "string",
      description: "Record value, e.g. an IPv4 for A, a hostname for CNAME, text for TXT.",
    },
    ttl: { type: "integer", description: "Time-to-live in seconds (optional, e.g. 3600)." },
    prio: { type: "integer", description: "Priority for MX/SRV records (optional)." },
    disabled: { type: "boolean", description: "Create the record disabled (optional)." },
  },
  required: ["name", "type", "content"],
  additionalProperties: false,
};

/** Tool registry: each entry declares its schema, annotations and handler. */
const tools = [
  // ---- DNS -----------------------------------------------------------------
  {
    name: "ionos_list_dns_zones",
    description:
      "List all DNS zones (domains) in the IONOS account. Returns each zone's id, name and type. Use a zone id with ionos_get_dns_zone to read its records.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      title: "List DNS zones",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: () => ionosRequest("GET", "/dns/v1/zones"),
  },
  {
    name: "ionos_get_dns_zone",
    description:
      "Get one DNS zone by id, including its records. Optionally filter by record name and/or type. Each record includes id, name, type, content, ttl, prio and disabled.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string", description: "Zone id from ionos_list_dns_zones." },
        recordName: { type: "string", description: "Optional filter, e.g. 'www.example.com'." },
        recordType: { type: "string", description: "Optional filter, e.g. 'A', 'CNAME', 'MX', 'TXT'." },
      },
      required: ["zoneId"],
      additionalProperties: false,
    },
    annotations: {
      title: "Get DNS zone",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: (a) =>
      ionosRequest("GET", `/dns/v1/zones/${encodeURIComponent(a.zoneId)}`, {
        query: { recordName: a.recordName, recordType: a.recordType },
      }),
  },
  {
    name: "ionos_add_dns_records",
    description:
      "Add one or more DNS records to a zone. Records are ADDED (existing records are left in place); to change an existing record use ionos_update_dns_record. Each record needs name, type and content; ttl/prio/disabled are optional.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string", description: "Zone id from ionos_list_dns_zones." },
        records: {
          type: "array",
          minItems: 1,
          description: "Records to add.",
          items: dnsRecordItemSchema,
        },
      },
      required: ["zoneId", "records"],
      additionalProperties: false,
    },
    annotations: {
      title: "Add DNS records",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    readOnly: false,
    handler: (a) =>
      ionosRequest("PATCH", `/dns/v1/zones/${encodeURIComponent(a.zoneId)}`, { body: a.records }),
  },
  {
    name: "ionos_update_dns_record",
    description:
      "Update a single existing DNS record (by zoneId + recordId). Provide only the fields to change: content, ttl, prio, disabled. Get recordId from ionos_get_dns_zone.",
    inputSchema: {
      type: "object",
      properties: {
        zoneId: { type: "string" },
        recordId: { type: "string" },
        content: { type: "string" },
        ttl: { type: "integer" },
        prio: { type: "integer" },
        disabled: { type: "boolean" },
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
      for (const k of ["content", "ttl", "prio", "disabled"]) {
        if (a[k] !== undefined) body[k] = a[k];
      }
      if (Object.keys(body).length === 0) {
        throw new UserError("Nothing to update: provide at least one of content, ttl, prio, disabled.");
      }
      return ionosRequest(
        "PUT",
        `/dns/v1/zones/${encodeURIComponent(a.zoneId)}/records/${encodeURIComponent(a.recordId)}`,
        { body },
      );
    },
  },
  {
    name: "ionos_delete_dns_record",
    description:
      "Delete a single DNS record (by zoneId + recordId). Irreversible — you MUST pass confirm=true. Get recordId from ionos_get_dns_zone.",
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
      return ionosRequest(
        "DELETE",
        `/dns/v1/zones/${encodeURIComponent(a.zoneId)}/records/${encodeURIComponent(a.recordId)}`,
      );
    },
  },

  // ---- Domains (read-only) -------------------------------------------------
  {
    name: "ionos_list_domains",
    description:
      "List the domains in the IONOS account (names, ids, status, expiry where provided). Read-only: renewals, transfers and contact changes are NOT available via the API — do those in the my.ionos panel.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      title: "List domains",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: () => ionosRequest("GET", "/domains/v1/domainitems"),
  },
  {
    name: "ionos_get_domain",
    description: "Get details for one domain by its id (from ionos_list_domains). Read-only.",
    inputSchema: {
      type: "object",
      properties: { domainId: { type: "string" } },
      required: ["domainId"],
      additionalProperties: false,
    },
    annotations: {
      title: "Get domain",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: (a) => ionosRequest("GET", `/domains/v1/domainitems/${encodeURIComponent(a.domainId)}`),
  },

  // ---- SSL -----------------------------------------------------------------
  {
    name: "ionos_list_ssl_certificates",
    description: "List SSL certificates in the IONOS account (id, common name, status).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      title: "List SSL certificates",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: () => ionosRequest("GET", "/ssl/v1/certificates"),
  },
  {
    name: "ionos_get_ssl_certificate",
    description: "Get details for one SSL certificate by id (from ionos_list_ssl_certificates).",
    inputSchema: {
      type: "object",
      properties: { certificateId: { type: "string" } },
      required: ["certificateId"],
      additionalProperties: false,
    },
    annotations: {
      title: "Get SSL certificate",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: true,
    handler: (a) =>
      ionosRequest("GET", `/ssl/v1/certificates/${encodeURIComponent(a.certificateId)}`),
  },
  {
    name: "ionos_create_ssl_certificate",
    description:
      "Order/create an SSL certificate for a domain, optionally with Subject Alternative Names (SANs).",
    inputSchema: {
      type: "object",
      properties: {
        domainName: { type: "string", description: "Primary domain, e.g. 'example.com'." },
        subjectAlternativeNames: {
          type: "array",
          items: { type: "string" },
          description: "Optional additional names (SANs), e.g. ['www.example.com'].",
        },
      },
      required: ["domainName"],
      additionalProperties: false,
    },
    annotations: {
      title: "Create SSL certificate",
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    },
    readOnly: false,
    handler: (a) =>
      ionosRequest("POST", "/ssl/v1/certificates", {
        body: {
          domainName: a.domainName,
          ...(a.subjectAlternativeNames ? { subjectAlternativeNames: a.subjectAlternativeNames } : {}),
        },
      }),
  },
  {
    name: "ionos_delete_ssl_certificate",
    description: "Delete an SSL certificate by id. Irreversible — you MUST pass confirm=true.",
    inputSchema: {
      type: "object",
      properties: {
        certificateId: { type: "string" },
        confirm: { type: "boolean", description: "Must be true to actually delete." },
      },
      required: ["certificateId", "confirm"],
      additionalProperties: false,
    },
    annotations: {
      title: "Delete SSL certificate",
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
    readOnly: false,
    handler: (a) => {
      if (a.confirm !== true) throw new UserError("Refusing to delete: pass confirm=true to proceed.");
      return ionosRequest("DELETE", `/ssl/v1/certificates/${encodeURIComponent(a.certificateId)}`);
    },
  },
];

const availableTools = tools.filter((t) => !READONLY || t.readOnly);
const toolsByName = new Map(availableTools.map((t) => [t.name, t]));

const server = new Server(
  { name: "ionos-hosting", version: "0.1.0" },
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
  `ionos-hosting MCP server running (stdio) — ${availableTools.length} tools${READONLY ? " [read-only]" : ""}`,
);
