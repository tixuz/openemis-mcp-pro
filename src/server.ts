#!/usr/bin/env node

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

import { loadConfig, loadManifest } from "./config.js";
import { OpenemisClientImpl } from "./openemis.js";
import { handleRestRequest } from "./rest.js";
import type { ManifestRow } from "./types.js";
import {
  OPENEMIS_GET_TOOL,
  openemisGetInputSchema,
  createOpenemisGetHandler,
} from "./tools/crud.js";
import {
  OPENEMIS_CREATE_TOOL,
  openemisCreateInputSchema,
  createOpenemisCreateHandler,
  OPENEMIS_UPDATE_TOOL,
  openemisUpdateInputSchema,
  createOpenemisUpdateHandler,
  OPENEMIS_DELETE_TOOL,
  openemisDeleteInputSchema,
  createOpenemisDeleteHandler,
} from "./tools/write.js";
import {
  openemisListDomainsSpec,
  openemisListDomainsInputSchema,
  openemisListDomainsHandler,
  openemisDiscoverSpec,
  openemisDiscoverInputSchema,
  openemisDiscoverHandler,
  openemisListPlaybooksSpec,
  openemisListPlaybooksInputSchema,
  openemisListPlaybooksHandler,
  openemisGetPlaybookSpec,
  openemisGetPlaybookInputSchema,
  openemisGetPlaybookHandler,
} from "./tools/describe.js";

const config = loadConfig();
const client = new OpenemisClientImpl(config);

const server = new McpServer({
  name: "openemis-mcp",
  version: "0.3.0",
});

/**
 * Health check tool: verify OpenEMIS API reachability.
 */
server.tool(
  "openemis_health",
  "Check whether the configured OpenEMIS API endpoint is reachable and credentials are valid. Does a real login round-trip — if this passes, CRUD will work.",
  {},
  async () => {
    try {
      // Real signal: can we log in? If yes, the server is up AND creds are correct.
      await client.getToken();
      return {
        content: [
          {
            type: "text",
            text: `OpenEMIS is reachable at ${config.baseUrl} — login succeeded.`,
          },
        ],
        structuredContent: {
          ok: true,
          baseUrl: config.baseUrl,
          login: "ok",
        },
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      return {
        content: [
          {
            type: "text",
            text: `OpenEMIS health check failed at ${config.baseUrl}: ${message}. NOTE: health does a real login. If the error is 'Missing credentials', set OPENEMIS_USERNAME / OPENEMIS_PASSWORD / OPENEMIS_API_KEY. If the error is network/cert, check NODE_TLS_REJECT_UNAUTHORIZED=0 for self-signed localhost certs.`,
          },
        ],
        structuredContent: {
          ok: false,
          baseUrl: config.baseUrl,
          error: message,
        },
      };
    }
  }
);

/**
 * Initialize server: register all tools and connect stdio transport.
 */
async function main(): Promise<void> {
  // Load manifest for write-tool validation
  const manifest = loadManifest(config.manifestPath) as unknown as ManifestRow[];
  // MCP SDK expects a ZodRawShape (plain object of zod types), not a wrapped z.object().
  // The ZodObject `.shape` getter gives us the raw shape.
  server.tool(
    OPENEMIS_GET_TOOL.name,
    OPENEMIS_GET_TOOL.description,
    openemisGetInputSchema.shape,
    createOpenemisGetHandler(client)
  );

  server.tool(
    OPENEMIS_CREATE_TOOL.name,
    OPENEMIS_CREATE_TOOL.description,
    openemisCreateInputSchema.shape,
    createOpenemisCreateHandler(client, manifest, config.baseUrl)
  );

  server.tool(
    OPENEMIS_UPDATE_TOOL.name,
    OPENEMIS_UPDATE_TOOL.description,
    openemisUpdateInputSchema.shape,
    createOpenemisUpdateHandler(client, manifest, config.baseUrl)
  );

  server.tool(
    OPENEMIS_DELETE_TOOL.name,
    OPENEMIS_DELETE_TOOL.description,
    openemisDeleteInputSchema.shape,
    createOpenemisDeleteHandler(client, manifest, config.baseUrl)
  );

  server.tool(
    openemisListDomainsSpec.name,
    openemisListDomainsSpec.description,
    openemisListDomainsInputSchema.shape,
    async () => {
      return {
        content: await openemisListDomainsHandler(),
      };
    }
  );

  server.tool(
    openemisDiscoverSpec.name,
    openemisDiscoverSpec.description,
    openemisDiscoverInputSchema.shape,
    async (args: { topic: string }) => {
      return {
        content: await openemisDiscoverHandler(args),
      };
    }
  );

  server.tool(
    openemisListPlaybooksSpec.name,
    openemisListPlaybooksSpec.description,
    openemisListPlaybooksInputSchema.shape,
    async () => {
      return {
        content: await openemisListPlaybooksHandler(),
      };
    }
  );

  server.tool(
    openemisGetPlaybookSpec.name,
    openemisGetPlaybookSpec.description,
    openemisGetPlaybookInputSchema.shape,
    async (args: { id: string }) => {
      return {
        content: await openemisGetPlaybookHandler(args),
      };
    }
  );

  // ── Transport selection ──────────────────────────────────────────────────
  if (config.transport === "http") {
    await startHttpTransport();
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

// ─── HTTP Transport (Oracle / remote hosting) ─────────────────────────────────
//
// Set OPENEMIS_TRANSPORT=http to run as a persistent HTTP server instead of a
// local stdio subprocess. Any MCP client that supports remote servers can then
// connect by URL:  http://<host>:<port>/mcp
//
// Security: set OPENEMIS_AUTH_TOKEN to require  Authorization: Bearer <token>
// on every request. Without it the endpoint is open — fine for localhost tests,
// not for a public Oracle IP.

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end",  () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

async function startHttpTransport(): Promise<void> {
  // Stateless mode — no in-memory session state; safe for multi-client Oracle hosting.
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // ── Bearer token auth ─────────────────────────────────────────────────
      // Applied to every route EXCEPT the OpenAPI schema (so ChatGPT can import it
      // without credentials — the schema itself contains no sensitive data).
      const isPublicRoute = req.url === "/openapi.json" || req.url === "/" || req.url === "/health";
      if (config.authToken && !isPublicRoute) {
        const authHeader = (req.headers["authorization"] ?? "") as string;
        if (authHeader !== `Bearer ${config.authToken}`) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Unauthorized — set Authorization: Bearer <OPENEMIS_AUTH_TOKEN>" }));
          return;
        }
      }

      // ── Root health probe (unauthenticated — for Oracle / uptime monitors) ─
      if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, transport: "http", baseUrl: config.baseUrl }));
        return;
      }

      // ── REST API + OpenAPI schema ─────────────────────────────────────────
      const handled = await handleRestRequest(req, res, client, config);
      if (handled) return;

      // ── MCP endpoint ─────────────────────────────────────────────────────
      if (req.url === "/mcp") {
        let parsedBody: unknown;
        if (req.method === "POST") {
          const raw = await readBody(req);
          try { parsedBody = raw ? JSON.parse(raw) : undefined; } catch { parsedBody = undefined; }
        }
        await transport.handleRequest(req, res, parsedBody);
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found. MCP endpoint: /mcp  REST API: /api/*  Schema: /openapi.json" }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[openemis-mcp-pro] HTTP handler error:", msg);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
  });

  await new Promise<void>((resolve) => httpServer.listen(config.port, resolve));

  const base = `http://0.0.0.0:${config.port}`;
  console.error(`[openemis-mcp-pro] HTTP server listening on port ${config.port}`);
  console.error(`[openemis-mcp-pro] MCP endpoint  : ${base}/mcp        ← Claude Code / Cursor / Cline`);
  console.error(`[openemis-mcp-pro] REST API       : ${base}/api/*      ← ChatGPT / any HTTP client`);
  console.error(`[openemis-mcp-pro] OpenAPI schema : ${base}/openapi.json`);
  console.error(`[openemis-mcp-pro] Health probe   : ${base}/health`);
  if (config.authToken) {
    console.error(`[openemis-mcp-pro] Auth           : Bearer token required on all routes except /openapi.json and /health`);
  } else {
    console.error(`[openemis-mcp-pro] ⚠️  No OPENEMIS_AUTH_TOKEN set — all routes are open`);
  }
}

main().catch((err) => {
  console.error("[openemis-mcp-pro] Fatal error:", err);
  process.exit(1);
});
