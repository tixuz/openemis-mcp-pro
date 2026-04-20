#!/usr/bin/env node

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

import { loadConfig, loadManifest } from "./config.js";
import { OpenemisClientImpl } from "./openemis.js";
import { handleRestRequest } from "./rest.js";
import { record } from "./logger.js";
import { AuthStore } from "./auth/store.js";
import { getCurrentUser, runAs } from "./auth/session.js";
import { wrapHandler } from "./auth/wrap.js";
import { getHttpSession } from "./auth/http-sessions.js";
import {
  clearMcpSessionUser,
  getMcpSessionUser,
} from "./auth/mcp-sessions.js";
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

// Per-user auth store is enabled in BOTH transports:
//   - stdio: one process per client, module-global tracks the active user
//     (session.ts setCurrentUser / clearCurrentUser).
//   - http:  multi-client, each request is pinned to a user via AsyncLocalStorage
//     (session.ts runAs). The same AuthStore SQLite caches JWTs in both modes.
const authStore: AuthStore = new AuthStore({ dbPath: config.authDbPath });

const client = new OpenemisClientImpl(config, {
  store: authStore,
  getCurrentUser,
});

// Manifest is shared across every McpServer we build — write tools need
// it to validate the resource + HTTP-method combination. Loaded once at
// startup; read-only afterwards.
const manifest = loadManifest(config.manifestPath) as unknown as ManifestRow[];

/**
 * Build a fresh McpServer with every tool registered.
 *
 * A new instance is created:
 *   - once for stdio (one process per client), and
 *   - once per HTTP session (MCP SDK's `Protocol.connect` errors if a
 *     single Server instance is reused across transports).
 *
 * Tool handlers close over the shared `client`, `authStore`, and
 * `manifest` at module scope, so the per-instance cost is just a few
 * hundred bytes for registration metadata.
 */
function buildMcpServer(): McpServer {
  const server = new McpServer({
    name: "openemis-mcp",
    version: "0.3.0",
  });

  /**
   * Health check tool: verify OpenEMIS API reachability.
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
    wrapHandler("openemis_health", healthHandler, authStore, getCurrentUser),
  );

  // MCP SDK expects a ZodRawShape (plain object of zod types), not a wrapped z.object().
  // The ZodObject `.shape` getter gives us the raw shape.
  //
  // Every tool handler is wrapped with `wrapHandler` so calls land in the
  // SQLite audit log with ts / username / tool / args / ok / duration_ms.
  server.tool(
    OPENEMIS_GET_TOOL.name,
    OPENEMIS_GET_TOOL.description,
    openemisGetInputSchema.shape,
    wrapHandler(
      OPENEMIS_GET_TOOL.name,
      createOpenemisGetHandler(client),
      authStore,
      getCurrentUser,
    ),
  );

  server.tool(
    OPENEMIS_CREATE_TOOL.name,
    OPENEMIS_CREATE_TOOL.description,
    openemisCreateInputSchema.shape,
    wrapHandler(
      OPENEMIS_CREATE_TOOL.name,
      createOpenemisCreateHandler(client, manifest, config.baseUrl),
      authStore,
      getCurrentUser,
    ),
  );

  server.tool(
    OPENEMIS_UPDATE_TOOL.name,
    OPENEMIS_UPDATE_TOOL.description,
    openemisUpdateInputSchema.shape,
    wrapHandler(
      OPENEMIS_UPDATE_TOOL.name,
      createOpenemisUpdateHandler(client, manifest, config.baseUrl),
      authStore,
      getCurrentUser,
    ),
  );

  server.tool(
    OPENEMIS_DELETE_TOOL.name,
    OPENEMIS_DELETE_TOOL.description,
    openemisDeleteInputSchema.shape,
    wrapHandler(
      OPENEMIS_DELETE_TOOL.name,
      createOpenemisDeleteHandler(client, manifest, config.baseUrl),
      authStore,
      getCurrentUser,
    ),
  );

  server.tool(
    openemisListDomainsSpec.name,
    openemisListDomainsSpec.description,
    openemisListDomainsInputSchema.shape,
    wrapHandler(
      openemisListDomainsSpec.name,
      async () => ({ content: await openemisListDomainsHandler() }),
      authStore,
      getCurrentUser,
    ),
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
      getCurrentUser,
    ),
  );

  server.tool(
    openemisListPlaybooksSpec.name,
    openemisListPlaybooksSpec.description,
    openemisListPlaybooksInputSchema.shape,
    wrapHandler(
      openemisListPlaybooksSpec.name,
      async () => ({ content: await openemisListPlaybooksHandler() }),
      authStore,
      getCurrentUser,
    ),
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
      getCurrentUser,
    ),
  );

  // ── Per-user MCP auth tools ─────────────────────────────────────────────
  // Registered in BOTH transports. The handlers detect the mode from the
  // SDK's `extra.sessionId`:
  //   - stdio: absent → module-global setCurrentUser / clearCurrentUser
  //   - HTTP:  present → mcp-sessions map keyed on MCP session ID, so two
  //     clients on the same process can't see each other's identities.
  server.tool(
    OPENEMIS_LOGIN_TOOL.name,
    OPENEMIS_LOGIN_TOOL.description,
    openemisLoginInputSchema.shape,
    wrapHandler(
      OPENEMIS_LOGIN_TOOL.name,
      createOpenemisLoginHandler(client),
      authStore,
      getCurrentUser,
    ),
  );

  server.tool(
    OPENEMIS_LOGOUT_TOOL.name,
    OPENEMIS_LOGOUT_TOOL.description,
    openemisLogoutInputSchema.shape,
    wrapHandler(
      OPENEMIS_LOGOUT_TOOL.name,
      createOpenemisLogoutHandler(),
      authStore,
      getCurrentUser,
    ),
  );

  server.tool(
    OPENEMIS_WHOAMI_TOOL.name,
    OPENEMIS_WHOAMI_TOOL.description,
    openemisWhoamiInputSchema.shape,
    wrapHandler(
      OPENEMIS_WHOAMI_TOOL.name,
      createOpenemisWhoamiHandler(config, authStore),
      authStore,
      getCurrentUser,
    ),
  );

  return server;
}

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
          `[openemis-mcp-pro] Rotated ${flushed} tool-call rows to ${config.authLogDir}`,
        );
      }
    } catch (err) {
      console.error(
        `[openemis-mcp-pro] Log rotation failed (continuing):`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  // ── Transport selection ──────────────────────────────────────────────────
  if (config.transport === "http") {
    await startHttpTransport();
  } else {
    const stdioServer = buildMcpServer();
    const transport = new StdioServerTransport();
    await stdioServer.connect(transport);
    console.error(
      `[openemis-mcp-pro] stdio transport ready. Auth DB: ${authStore?.path ?? "(disabled)"}`,
    );
  }
}

// ─── HTTP Transport (Oracle / remote hosting) ─────────────────────────────────
//
// Set OPENEMIS_TRANSPORT=http to run as a persistent HTTP server instead of a
// local stdio subprocess. Any MCP client that supports remote servers can then
// connect by URL:  http://<host>:<port>/mcp
//
// Per-session stateful mode: each MCP client gets its own transport +
// McpServer pair, indexed by the `mcp-session-id` header. The SDK handles
// the session-ID plumbing; we just wire up a map so subsequent requests
// find the right transport.
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
  // Per-session transport map. Key = MCP session ID the SDK minted on
  // `initialize`. Cleaned up by `transport.onclose` (DELETE request,
  // client disconnect, or idle timeout from the SDK).
  const transports = new Map<string, StreamableHTTPServerTransport>();

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
      // Two kinds of Bearer token are accepted:
      //
      //   (a) the *gateway* token (OPENEMIS_AUTH_TOKEN) — proves the caller
      //       can reach this deployment. Requests using it act as the
      //       .env-default admin user (classic behaviour).
      //
      //   (b) a *session* token minted by POST /api/auth/login — proves which
      //       OpenEMIS user the caller logged in as. Requests using it act
      //       as that user, via AsyncLocalStorage `runAs`.
      //
      // The login endpoint itself MUST be reachable via (a), so this check
      // runs BEFORE the /api/auth/login dispatch but accepts either flavour.
      // Every route except the OpenAPI schema + health + privacy + dashboard
      // requires auth.
      const isPublicRoute = req.url === "/openapi.json" || req.url === "/" || req.url === "/health"
        || req.url === "/privacy" || (req.url?.startsWith("/dashboard") ?? false);

      let httpSessionUser: string | null = null;
      if (config.authToken && !isPublicRoute) {
        const authHeader = (req.headers["authorization"] ?? "") as string;
        const prefix = "Bearer ";
        const bearer = authHeader.startsWith(prefix) ? authHeader.slice(prefix.length) : "";
        const isGateway = bearer === config.authToken;
        // Session tokens are 64 hex chars. Only look them up in the store
        // when REST per-user login is enabled — with the default gated
        // posture, no session tokens can exist, so the lookup is pure cost.
        const session =
          config.restLoginEnabled && !isGateway && bearer.length === 64
            ? getHttpSession(bearer)
            : null;
        if (!isGateway && !session) {
          const perUserHint = config.restLoginEnabled
            ? "or a session token from POST /api/auth/login"
            : "(per-user identity is only available via the MCP channel at /mcp + openemis_login)";
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            error: `Unauthorized — send Authorization: Bearer <OPENEMIS_AUTH_TOKEN> ${perUserHint}`,
          }));
          return;
        }
        if (session) httpSessionUser = session.username;
      }

      // ── Root health probe (unauthenticated — for Oracle / uptime monitors) ─
      if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, transport: "http", baseUrl: config.baseUrl }));
        return;
      }

      // ── Request dispatch (wrapped in per-user context when a user is resolved) ─
      const handle = async () => {
        // REST API + OpenAPI schema
        const handled = await handleRestRequest(req, res, client, config);
        if (handled) return;

        // MCP endpoint — stateful per-session transport
        if (req.url === "/mcp") {
          await handleMcpRequest(req, res, transports);
          return;
        }

        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found. MCP endpoint: /mcp  REST API: /api/*  Schema: /openapi.json" }));
      };

      // Resolve the effective user for this request — REST session token
      // wins (explicit per-request identity), then MCP session mapping
      // (per-client identity pinned by a prior openemis_login tool call),
      // then env-default (no wrapping).
      const mcpSessionId = (req.headers["mcp-session-id"] as string | undefined) ?? null;
      const mcpUser = mcpSessionId ? getMcpSessionUser(mcpSessionId) : null;
      const effectiveUser = httpSessionUser ?? mcpUser;

      if (effectiveUser) {
        await runAs(effectiveUser, handle);
      } else {
        await handle();
      }
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
  console.error(`[openemis-mcp-pro] MCP endpoint  : ${base}/mcp        ← Claude Code / Cursor / Cline (stateful sessions)`);
  console.error(`[openemis-mcp-pro] REST API       : ${base}/api/*      ← ChatGPT / any HTTP client`);
  console.error(`[openemis-mcp-pro] OpenAPI schema : ${base}/openapi.json`);
  console.error(`[openemis-mcp-pro] Health probe   : ${base}/health`);
  if (config.authToken) {
    console.error(`[openemis-mcp-pro] Auth           : Bearer token required on all routes except /openapi.json and /health`);
  } else {
    console.error(`[openemis-mcp-pro] ⚠️  No OPENEMIS_AUTH_TOKEN set — all routes are open`);
  }
}

/**
 * Route a single /mcp request to the right StreamableHTTPServerTransport.
 *
 *   POST /mcp
 *     - With `mcp-session-id` header + existing transport → forward
 *       the JSON-RPC message to that transport.
 *     - Without `mcp-session-id` + body is an `initialize` request →
 *       create a new transport + McpServer, register it in the map
 *       once the SDK mints its session ID.
 *     - Otherwise → 400 (invalid MCP framing).
 *
 *   GET /mcp  (SSE stream for server-initiated messages)
 *   DELETE /mcp  (session termination)
 *     - Both require a valid `mcp-session-id` header.
 */
async function handleMcpRequest(
  req: IncomingMessage,
  res: ServerResponse,
  transports: Map<string, StreamableHTTPServerTransport>,
): Promise<void> {
  const sessionId = (req.headers["mcp-session-id"] as string | undefined) ?? null;

  if (req.method === "POST") {
    // Parse body once — both the initialize detector and transport.handleRequest
    // need it, and the raw stream can only be consumed once.
    const raw = await readBody(req);
    let parsedBody: unknown;
    try {
      parsedBody = raw ? JSON.parse(raw) : undefined;
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON body" }));
      return;
    }

    // (1) Existing session — look up transport and forward.
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res, parsedBody);
      return;
    }

    // (2) New session — body must be an `initialize` request. Create a
    // fresh McpServer + transport pair and wire the map around it.
    if (!sessionId && isInitializeRequest(parsedBody)) {
      const newServer = buildMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id: string) => {
          transports.set(id, transport);
        },
      });

      // Clean up when the session ends (DELETE, client disconnect, or
      // SDK idle timeout). Drop both the transport map entry AND any
      // `mcp-session-id → username` mapping so stale sessions don't
      // leak identities.
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid) {
          transports.delete(sid);
          clearMcpSessionUser(sid);
        }
      };

      await newServer.connect(transport);
      // The transport will emit `onsessioninitialized` synchronously
      // during handleRequest for an initialize call, so the map is
      // populated before we return.
      await transport.handleRequest(req, res, parsedBody);
      return;
    }

    // (3) Anything else is bad framing — either missing session ID on a
    // non-initialize call, or an unknown session ID. Mirror the SDK
    // example error shape so clients get a clear hint.
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: sessionId
          ? "Bad Request: unknown or expired MCP session ID"
          : "Bad Request: No valid session ID provided (the first request must be `initialize`)",
      },
      id: null,
    }));
    return;
  }

  if (req.method === "GET" || req.method === "DELETE") {
    if (!sessionId || !transports.has(sessionId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Bad Request: missing or unknown MCP session ID" }));
      return;
    }
    const transport = transports.get(sessionId)!;
    await transport.handleRequest(req, res);
    return;
  }

  res.writeHead(405, { "Content-Type": "application/json", "Allow": "GET, POST, DELETE" });
  res.end(JSON.stringify({ error: "Method Not Allowed on /mcp" }));
}

main().catch((err) => {
  console.error("[openemis-mcp-pro] Fatal error:", err);
  process.exit(1);
});
