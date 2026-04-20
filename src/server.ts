#!/usr/bin/env node

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

import { loadConfig, loadManifest } from "./config.js";
import { OpenemisClientImpl } from "./openemis.js";
import { handleRestRequest } from "./rest.js";
import { record } from "./logger.js";
import { AuthStore } from "./auth/store.js";
import { getCurrentUser } from "./auth/session.js";
import { wrapHandler } from "./auth/wrap.js";
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
import {
  OPENEMIS_LOGIN_TOOL,
  openemisLoginInputSchema,
  createOpenemisLoginHandler,
  OPENEMIS_LOGOUT_TOOL,
  openemisLogoutInputSchema,
  createOpenemisLogoutHandler,
  OPENEMIS_WHOAMI_TOOL,
  openemisWhoamiInputSchema,
  createOpenemisWhoamiHandler,
} from "./tools/auth.js";

const config = loadConfig();

// Per-user auth store + session are stdio-only. In HTTP mode the server
// stays stateless (multi-tenant semantics don't match a single-user SQLite).
const authStore: AuthStore | null =
  config.transport === "stdio" ? new AuthStore({ dbPath: config.authDbPath }) : null;

const client = new OpenemisClientImpl(config, {
  store: authStore,
  getCurrentUser,
});

const server = new McpServer({
  name: "openemis-mcp",
  version: "0.3.0",
});

/**
 * Health check tool: verify OpenEMIS API reachability.
 * Wrapped below after the full manifest + tools are registered, so the
 * audit logger captures it too.
 */
const healthHandler = async () => {
  try {
    // Real signal: can we log in? If yes, the server is up AND creds are correct.
    await client.getToken();
    return {
      content: [
        {
          type: "text" as const,
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
          type: "text" as const,
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
};

server.tool(
  "openemis_health",
  "Check whether the configured OpenEMIS API endpoint is reachable and credentials are valid. Does a real login round-trip — if this passes, CRUD will work.",
  {},
  wrapHandler("openemis_health", healthHandler, authStore, getCurrentUser)
);

/**
 * Initialize server: register all tools and connect stdio transport.
 */
async function main(): Promise<void> {
  // Rotate yesterday's audit rows to JSONL before we start serving. Zero
  // work when there's nothing old to flush.
  if (authStore) {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const flushed = authStore.rotateOlderThan(today, config.authLogDir);
      if (flushed > 0) {
        console.error(
          `[openemis-mcp-pro] Rotated ${flushed} tool-call rows to ${config.authLogDir}`
        );
      }
    } catch (err) {
      console.error(
        `[openemis-mcp-pro] Log rotation failed (continuing):`,
        err instanceof Error ? err.message : err
      );
    }
  }

  // Load manifest for write-tool validation
  const manifest = loadManifest(config.manifestPath) as unknown as ManifestRow[];
  // MCP SDK expects a ZodRawShape (plain object of zod types), not a wrapped z.object().
  // The ZodObject `.shape` getter gives us the raw shape.
  //
  // Every tool handler is wrapped with `wrapHandler` so calls land in the
  // SQLite audit log with ts / username / tool / args / ok / duration_ms.
  // In HTTP mode `authStore` is null and the wrapper is a pass-through.
  server.tool(
    OPENEMIS_GET_TOOL.name,
    OPENEMIS_GET_TOOL.description,
    openemisGetInputSchema.shape,
    wrapHandler(
      OPENEMIS_GET_TOOL.name,
      createOpenemisGetHandler(client),
      authStore,
      getCurrentUser
    )
  );

  server.tool(
    OPENEMIS_CREATE_TOOL.name,
    OPENEMIS_CREATE_TOOL.description,
    openemisCreateInputSchema.shape,
    wrapHandler(
      OPENEMIS_CREATE_TOOL.name,
      createOpenemisCreateHandler(client, manifest, config.baseUrl),
      authStore,
      getCurrentUser
    )
  );

  server.tool(
    OPENEMIS_UPDATE_TOOL.name,
    OPENEMIS_UPDATE_TOOL.description,
    openemisUpdateInputSchema.shape,
    wrapHandler(
      OPENEMIS_UPDATE_TOOL.name,
      createOpenemisUpdateHandler(client, manifest, config.baseUrl),
      authStore,
      getCurrentUser
    )
  );

  server.tool(
    OPENEMIS_DELETE_TOOL.name,
    OPENEMIS_DELETE_TOOL.description,
    openemisDeleteInputSchema.shape,
    wrapHandler(
      OPENEMIS_DELETE_TOOL.name,
      createOpenemisDeleteHandler(client, manifest, config.baseUrl),
      authStore,
      getCurrentUser
    )
  );

  server.tool(
    openemisListDomainsSpec.name,
    openemisListDomainsSpec.description,
    openemisListDomainsInputSchema.shape,
    wrapHandler(
      openemisListDomainsSpec.name,
      async () => ({ content: await openemisListDomainsHandler() }),
      authStore,
      getCurrentUser
    )
  );

  server.tool(
    openemisDiscoverSpec.name,
    openemisDiscoverSpec.description,
    openemisDiscoverInputSchema.shape,
    wrapHandler(
      openemisDiscoverSpec.name,
      async (args: { topic: string }) => ({
        content: await openemisDiscoverHandler(args),
      }),
      authStore,
      getCurrentUser
    )
  );

  server.tool(
    openemisListPlaybooksSpec.name,
    openemisListPlaybooksSpec.description,
    openemisListPlaybooksInputSchema.shape,
    wrapHandler(
      openemisListPlaybooksSpec.name,
      async () => ({ content: await openemisListPlaybooksHandler() }),
      authStore,
      getCurrentUser
    )
  );

  server.tool(
    openemisGetPlaybookSpec.name,
    openemisGetPlaybookSpec.description,
    openemisGetPlaybookInputSchema.shape,
    wrapHandler(
      openemisGetPlaybookSpec.name,
      async (args: { id: string }) => ({
        content: await openemisGetPlaybookHandler(args),
      }),
      authStore,
      getCurrentUser
    )
  );

  // ── Per-user auth tools (stdio only) ─────────────────────────────────────
  // In HTTP mode the server is stateless, so these would be meaningless —
  // skip registration entirely rather than return confusing errors.
  if (authStore) {
    server.tool(
      OPENEMIS_LOGIN_TOOL.name,
      OPENEMIS_LOGIN_TOOL.description,
      openemisLoginInputSchema.shape,
      wrapHandler(
        OPENEMIS_LOGIN_TOOL.name,
        createOpenemisLoginHandler(client),
        authStore,
        getCurrentUser
      )
    );

    server.tool(
      OPENEMIS_LOGOUT_TOOL.name,
      OPENEMIS_LOGOUT_TOOL.description,
      openemisLogoutInputSchema.shape,
      wrapHandler(
        OPENEMIS_LOGOUT_TOOL.name,
        createOpenemisLogoutHandler(),
        authStore,
        getCurrentUser
      )
    );

    server.tool(
      OPENEMIS_WHOAMI_TOOL.name,
      OPENEMIS_WHOAMI_TOOL.description,
      openemisWhoamiInputSchema.shape,
      wrapHandler(
        OPENEMIS_WHOAMI_TOOL.name,
        createOpenemisWhoamiHandler(config, authStore),
        authStore,
        getCurrentUser
      )
    );
  }

  // ── Transport selection ──────────────────────────────────────────────────
  if (config.transport === "http") {
    await startHttpTransport();
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(
      `[openemis-mcp-pro] stdio transport ready. Auth DB: ${authStore?.path ?? "(disabled)"}`
    );
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
    // ── Request timing + logging ──────────────────────────────────────────────
    const t0 = Date.now();
    let capturedStatus = 200;
    const origWriteHead = res.writeHead.bind(res) as typeof res.writeHead;
    (res as unknown as Record<string, unknown>).writeHead = (code: number, ...args: unknown[]) => {
      capturedStatus = code;
      return (origWriteHead as (...a: unknown[]) => ServerResponse)(code, ...args);
    };
    res.on("finish", () => {
      const rawIp = (req.headers["x-forwarded-for"] as string | undefined)
        ?.split(",")[0].trim() ?? req.socket.remoteAddress ?? "unknown";
      const url = new URL(req.url ?? "/", "http://localhost");
      record({
        ts:     new Date().toISOString(),
        ip:     rawIp,
        method: req.method ?? "?",
        path:   url.pathname,
        status: capturedStatus,
        ms:     Date.now() - t0,
      });
    });

    try {
      // ── Bearer token auth ─────────────────────────────────────────────────
      // Applied to every route EXCEPT the OpenAPI schema (so ChatGPT can import it
      // without credentials — the schema itself contains no sensitive data).
      // /dashboard is also public but does its own key check via ?key= query param.
      const isPublicRoute = req.url === "/openapi.json" || req.url === "/" || req.url === "/health"
        || req.url === "/privacy" || (req.url?.startsWith("/dashboard") ?? false);
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
