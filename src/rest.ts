/**
 * OpenAPI REST adapter for openemis-mcp-pro HTTP mode.
 *
 * Exposes the same capabilities as the MCP tools as plain HTTP endpoints so
 * ChatGPT Custom Actions (and any other REST client) can call them.
 *
 * Endpoints:
 *   GET  /openapi.json                 — OpenAPI 3.1 schema (ChatGPT imports this)
 *   GET  /api/health                   — readiness probe
 *   GET  /api/discover?topic=          — find resource names for a topic
 *   GET  /api/playbooks                — list workflow guides
 *   GET  /api/playbooks/{id}           — load a workflow guide
 *   GET  /api/resources/{resource}     — list / filter records
 *   POST /api/resources/{resource}     — create a record
 *   PUT  /api/resources/{resource}/{id} — update a record (full payload)
 *   DELETE /api/resources/{resource}/{id} — delete a record
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import type { OpenemisClient } from "./types.js";
import type { AppConfig } from "./config.js";
import {
  openemisDiscoverHandler,
  openemisListPlaybooksHandler,
  openemisGetPlaybookHandler,
} from "./tools/describe.js";
import { isWorkflowBlocked, buildWorkflowBlockMessage } from "./policies.js";
import { snapshot } from "./logger.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MAX_BODY_BYTES = 1_048_576; // 1 MB — reject oversized payloads before they hit memory

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    req.on("data", (c: Buffer) => {
      totalBytes += c.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        req.destroy();
        reject(new Error("PAYLOAD_TOO_LARGE"));
        return;
      }
      chunks.push(c);
    });
    req.on("end",  () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options":        "DENY",
  "Content-Security-Policy": "default-src 'none'",
};

function jsonResponse(res: ServerResponse, status: number, data: unknown): void {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "Content-Type":                "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Length":              String(Buffer.byteLength(body)),
    ...SECURITY_HEADERS,
  });
  res.end(body);
}

// ─── Simple in-memory rate limiter (per IP, token bucket) ─────────────────────
// Allows RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW_MS window per client IP.
// Resets the bucket when the window expires. Keeps no external dependencies.

const RATE_LIMIT_MAX        = 60;
const RATE_LIMIT_WINDOW_MS  = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

// ─── Input validation ─────────────────────────────────────────────────────────

/** Kebab-case resource slug — must be lowercase, start with a letter, ≤80 chars. */
const VALID_RESOURCE = /^[a-z][a-z0-9-]{0,79}$/;

// ─── OpenAPI schema ────────────────────────────────────────────────────────────

function buildOpenApiSchema(serverUrl: string): object {
  return {
    openapi: "3.1.0",
    info: {
      title: "OpenEMIS School Management API",
      description:
        "Read and write school data: students, attendance, staff, exam marks, " +
        "infrastructure, meals, behaviour incidents, and more. " +
        "Start with GET /api/discover?topic=<keyword> to find the right resource names, " +
        "or GET /api/playbooks/{id} for step-by-step workflow instructions.",
      version: "1.0.0",
    },
    servers: [{ url: serverUrl }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" },
      },
      schemas: {},
    },
    paths: {

      "/api/health": {
        get: {
          operationId: "checkHealth",
          summary: "Check that the server is up and connected to OpenEMIS",
          responses: { "200": { description: "Server is healthy" } },
        },
      },

      "/api/discover": {
        get: {
          operationId: "discoverResources",
          summary:
            "Discover available resource names for a topic. " +
            "Call this whenever you are unsure which resource slug to use.",
          parameters: [{
            name: "topic", in: "query", required: true,
            schema: { type: "string" },
            description:
              "Topic keyword — e.g. 'attendance', 'student enrolment', " +
              "'exam marks', 'infrastructure', 'meals', 'staff leave'.",
          }],
          responses: { "200": { description: "Matching endpoint descriptions" } },
        },
      },

      "/api/playbooks": {
        get: {
          operationId: "listPlaybooks",
          summary: "List all available step-by-step workflow guides",
          responses: { "200": { description: "Playbook index" } },
        },
      },

      "/api/playbooks/{id}": {
        get: {
          operationId: "getPlaybook",
          summary:
            "Load a workflow guide. Contains required fields, gotchas, and " +
            "exact POST body examples for common school tasks.",
          parameters: [{
            name: "id", in: "path", required: true,
            schema: { type: "string" },
            description:
              "Playbook ID — e.g. 'mark-student-attendance', " +
              "'enroll-new-student', 'submit-exam-marks', " +
              "'record-behavior-incident', 'add-institution-asset'.",
          }],
          responses: { "200": { description: "Playbook content" } },
        },
      },

      "/api/resources/{resource}": {
        get: {
          operationId: "getRecords",
          summary:
            "Fetch records from any OpenEMIS resource. " +
            "Pass filter params as query strings (institution_id, academic_period_id, etc.).",
          parameters: [
            {
              name: "resource", in: "path", required: true,
              schema: { type: "string" },
              description:
                "Resource slug — e.g. 'institution-students', " +
                "'student-attendance-marked-records', 'institution-classes', " +
                "'academic-periods'. Use discoverResources to find the right name.",
            },
            { name: "institution_id",       in: "query", schema: { type: "integer" } },
            { name: "academic_period_id",   in: "query", schema: { type: "integer" } },
            { name: "institution_class_id", in: "query", schema: { type: "integer" } },
            { name: "student_id",           in: "query", schema: { type: "integer" } },
            { name: "education_grade_id",   in: "query", schema: { type: "integer" } },
            {
              name: "id", in: "query", schema: { type: "integer" },
              description: "Fetch a single record by its primary key",
            },
            { name: "limit", in: "query", schema: { type: "integer" }, description: "Max records (default 20)" },
            { name: "page",  in: "query", schema: { type: "integer" } },
          ],
          responses: { "200": { description: "Records array or single record object" } },
        },

        post: {
          operationId: "createRecord",
          summary:
            "Create a new record. " +
            "Call getPlaybook first to learn all required fields and avoid 422 errors.",
          parameters: [{
            name: "resource", in: "path", required: true,
            schema: { type: "string" },
          }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
          },
          responses: {
            "200": { description: "Created record" },
            "422": { description: "Validation error — missing or invalid fields" },
          },
        },
      },

      "/api/resources/{resource}/{id}": {
        put: {
          operationId: "updateRecord",
          summary:
            "Update an existing record. " +
            "Always fetch the current record first, merge your changes, then PUT the complete object — " +
            "omitting any field sets it to null.",
          parameters: [
            { name: "resource", in: "path", required: true, schema: { type: "string" } },
            { name: "id",       in: "path", required: true, schema: { type: "integer" } },
          ],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", additionalProperties: true } } },
          },
          responses: { "200": { description: "Updated record" } },
        },

        delete: {
          operationId: "deleteRecord",
          summary: "Delete a record by its id",
          parameters: [
            { name: "resource", in: "path", required: true, schema: { type: "string" } },
            { name: "id",       in: "path", required: true, schema: { type: "integer" } },
          ],
          responses: { "200": { description: "Deletion confirmed" } },
        },
      },
    },
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

/**
 * Handle a REST API request.
 * Returns true if the request was handled (caller should not process further).
 * Returns false if the path is not a REST route (caller may pass to MCP handler).
 */
export async function handleRestRequest(
  req:    IncomingMessage,
  res:    ServerResponse,
  client: OpenemisClient,
  config: AppConfig,
): Promise<boolean> {
  const rawUrl = req.url ?? "/";
  const hostHeader = (req.headers["host"] ?? `localhost:${config.port}`) as string;
  const proto      = (req.headers["x-forwarded-proto"] as string | undefined) ?? "http";
  const serverUrl  = `${proto}://${hostHeader}`;
  const url    = new URL(rawUrl, serverUrl);
  const path   = url.pathname;
  const method = (req.method ?? "GET").toUpperCase();

  // ── Rate limiting (per client IP) ─────────────────────────────────────────
  const clientIp = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim()
    ?? req.socket.remoteAddress
    ?? "unknown";
  if (isRateLimited(clientIp)) {
    jsonResponse(res, 429, { error: "Too many requests — slow down." });
    return true;
  }

  // ── CORS preflight ────────────────────────────────────────────────────────
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...SECURITY_HEADERS,
    });
    res.end();
    return true;
  }

  // ── OpenAPI schema ────────────────────────────────────────────────────────
  if (method === "GET" && path === "/openapi.json") {
    jsonResponse(res, 200, buildOpenApiSchema(serverUrl));
    return true;
  }

  // ── Health ────────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/api/health") {
    jsonResponse(res, 200, { ok: true, transport: "http", baseUrl: config.baseUrl });
    return true;
  }

  // ── Privacy policy ────────────────────────────────────────────────────────
  if (method === "GET" && path === "/privacy") {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy — OpenEMIS MCP</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 48px auto;
           padding: 0 24px; color: #222; line-height: 1.7; }
    h1 { font-size: 1.6rem; } h2 { font-size: 1.1rem; margin-top: 2rem; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p><strong>Service:</strong> OpenEMIS MCP — AI bridge for the OpenEMIS school management platform.<br>
     <strong>Last updated:</strong> ${new Date().toISOString().slice(0, 10)}</p>

  <h2>What this service does</h2>
  <p>OpenEMIS MCP provides an API bridge that allows AI assistants (such as ChatGPT Custom Actions)
     to read and write data in an OpenEMIS instance on behalf of an authorised user.
     All requests are authenticated with a bearer token supplied by the operator.</p>

  <h2>Data we process</h2>
  <p>This service acts as a pass-through proxy. It does not store, log persistently, or share any
     personal data. Requests are forwarded to the configured OpenEMIS instance and responses are
     returned directly to the caller. Transient request logs (method, path, HTTP status) are written
     to stderr for operational diagnostics only and are not retained beyond container lifetime.</p>

  <h2>Data stored</h2>
  <p>No personal data is stored by this service. The underlying OpenEMIS platform stores school
     records according to its own data retention and privacy policies, which are the responsibility
     of the institution operating that platform.</p>

  <h2>Third parties</h2>
  <p>This service does not send data to any third party. It connects only to the OpenEMIS instance
     configured by the operator.</p>

  <h2>Security</h2>
  <p>All traffic is encrypted in transit via TLS (HTTPS). Access requires a bearer token.
     Rate limiting and request size caps are enforced to protect the service.</p>

  <h2>Contact</h2>
  <p>For questions about this deployment, contact the operator at
     <a href="mailto:khindol.madraimov@gmail.com">khindol.madraimov@gmail.com</a>.</p>
</body>
</html>`;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", ...SECURITY_HEADERS });
    res.end(html);
    return true;
  }

  // ── Dashboard (browser-facing, key via ?key= query param) ───────────────
  if (method === "GET" && (path === "/dashboard" || path === "/dashboard/data")) {
    const key = url.searchParams.get("key") ?? "";
    if (config.authToken && key !== config.authToken) {
      res.writeHead(401, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`<!DOCTYPE html><html><body style="font:1rem system-ui;padding:2rem;background:#111;color:#f55">
        <h2>🔒 Unauthorized</h2>
        <p>Add <code>?key=YOUR_AUTH_TOKEN</code> to the URL.</p></body></html>`);
      return true;
    }

    const data = snapshot(500);

    if (path === "/dashboard/data") {
      jsonResponse(res, 200, data);
      return true;
    }

    const badge = (status: number) => {
      const c = status >= 500 ? "#ef4444" : status >= 400 ? "#f97316" : status >= 300 ? "#a78bfa" : "#22c55e";
      return `<span style="background:${c};color:#fff;padding:1px 6px;border-radius:4px;font-size:.75rem">${status}</span>`;
    };
    const mBadge = (m: string) => {
      const c: Record<string, string> = { GET:"#3b82f6", POST:"#22c55e", PUT:"#f59e0b", DELETE:"#ef4444" };
      return `<span style="background:${c[m] ?? "#6b7280"};color:#fff;padding:1px 6px;border-radius:4px;font-size:.75rem">${m}</span>`;
    };
    const rows = data.entries.map(e =>
      `<tr>
        <td style="color:#9ca3af;white-space:nowrap">${e.ts.replace("T"," ").slice(0,19)}</td>
        <td style="font-family:monospace">${e.ip}</td>
        <td>${mBadge(e.method)}</td>
        <td style="font-family:monospace;color:#e2e8f0">${e.path}</td>
        <td>${badge(e.status)}</td>
        <td style="text-align:right;color:#9ca3af">${e.ms}ms</td>
      </tr>`
    ).join("");

    const topPathRows = data.topPaths.map(p =>
      `<tr><td style="font-family:monospace">${p.path}</td><td style="text-align:right;color:#60a5fa">${p.count}</td></tr>`
    ).join("");
    const topIPRows = data.topIPs.map(p =>
      `<tr><td style="font-family:monospace">${p.ip}</td><td style="text-align:right;color:#60a5fa">${p.count}</td></tr>`
    ).join("");

    const keyParam = config.authToken ? `?key=${encodeURIComponent(config.authToken)}` : "";
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>OpenEMIS MCP — Dashboard</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0f172a;color:#e2e8f0;font-family:system-ui,sans-serif;padding:24px}
    h1{font-size:1.25rem;margin-bottom:4px;color:#f8fafc}
    .sub{color:#64748b;font-size:.85rem;margin-bottom:24px}
    .cards{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:28px}
    .card{background:#1e293b;border-radius:10px;padding:20px 28px;flex:1;min-width:140px}
    .card-val{font-size:2rem;font-weight:700;color:#f8fafc;line-height:1}
    .card-label{font-size:.78rem;color:#64748b;margin-top:6px;text-transform:uppercase;letter-spacing:.05em}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px}
    @media(max-width:640px){.grid{grid-template-columns:1fr}}
    .panel{background:#1e293b;border-radius:10px;padding:16px}
    .panel h2{font-size:.85rem;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px}
    table{width:100%;border-collapse:collapse;font-size:.82rem}
    td,th{padding:6px 10px;border-bottom:1px solid #1e293b;text-align:left}
    .main-table td,th{border-bottom:1px solid #1e293b}
    .main-table{background:#1e293b;border-radius:10px;overflow:hidden}
    .main-table th{background:#0f172a;color:#64748b;font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;padding:10px}
    .main-table tr:hover td{background:#162032}
    .refresh{color:#64748b;font-size:.78rem;margin-bottom:16px}
    a{color:#60a5fa;text-decoration:none}
  </style>
</head>
<body>
  <h1>⚡ OpenEMIS MCP — Request Dashboard</h1>
  <div class="sub">Live usage · resets on container restart · <a href="/dashboard${keyParam}">refresh</a></div>

  <div class="cards">
    <div class="card"><div class="card-val">${data.total}</div><div class="card-label">Total Requests</div></div>
    <div class="card"><div class="card-val">${data.uniqueIPs}</div><div class="card-label">Unique IPs</div></div>
    <div class="card"><div class="card-val">${data.avgMs}ms</div><div class="card-label">Avg Response</div></div>
    <div class="card"><div class="card-val" style="color:${data.errorRate > 10 ? "#ef4444" : "#22c55e"}">${data.errorRate}%</div><div class="card-label">Error Rate</div></div>
  </div>

  <div class="grid">
    <div class="panel">
      <h2>Top Paths</h2>
      <table><tbody>${topPathRows}</tbody></table>
    </div>
    <div class="panel">
      <h2>Top IPs</h2>
      <table><tbody>${topIPRows}</tbody></table>
    </div>
  </div>

  <div class="main-table">
    <table>
      <thead><tr>
        <th>Time</th><th>IP</th><th>Method</th><th>Path</th><th>Status</th><th style="text-align:right">Time</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <script>
    // Auto-refresh every 30s with countdown
    let t = 30;
    const sub = document.querySelector('.sub');
    const orig = sub.innerHTML;
    setInterval(() => {
      t--;
      if (t <= 0) location.reload();
      else sub.innerHTML = orig.replace('resets on container restart', 'resets on container restart') + ' · refreshing in ' + t + 's';
    }, 1000);
  </script>
</body>
</html>`;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", ...SECURITY_HEADERS });
    res.end(html);
    return true;
  }

  // ── Discover ──────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/api/discover") {
    const topic  = (url.searchParams.get("topic") ?? "").slice(0, 200);
    const blocks = await openemisDiscoverHandler({ topic });
    const text   = blocks.map((b) => b.text).join("\n");
    jsonResponse(res, 200, { topic, content: text });
    return true;
  }

  // ── Playbooks ─────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/api/playbooks") {
    const blocks = await openemisListPlaybooksHandler();
    const text   = blocks.map((b) => b.text).join("\n");
    jsonResponse(res, 200, { content: text });
    return true;
  }

  const pbMatch = path.match(/^\/api\/playbooks\/([^/]+)$/);
  if (method === "GET" && pbMatch) {
    const id     = decodeURIComponent(pbMatch[1]);
    const blocks = await openemisGetPlaybookHandler({ id });
    const text   = blocks.map((b) => b.text).join("\n");
    jsonResponse(res, 200, { id, content: text });
    return true;
  }

  // ── Resource CRUD ─────────────────────────────────────────────────────────
  const resMatch = path.match(/^\/api\/resources\/([^/]+?)(?:\/(\d+))?$/);
  if (!resMatch) return false;   // not a REST route — let caller handle it

  const resource = decodeURIComponent(resMatch[1]);
  const recordId = resMatch[2];  // undefined for collection endpoints

  // Validate resource slug — kebab-case only; reject anything suspicious.
  if (!VALID_RESOURCE.test(resource)) {
    jsonResponse(res, 400, { error: `Invalid resource name: "${resource}"` });
    return true;
  }

  // ── Request log (stderr — safe in both stdio and HTTP mode) ──────────────
  const ts = new Date().toISOString();

  try {
    // ── Workflow-policy guard ─────────────────────────────────────────────────
    // Mirrors the guard in write.ts. REST callers (ChatGPT Custom Actions etc.)
    // must not bypass the same policy that MCP tools enforce.
    if (method !== "GET" && isWorkflowBlocked(resource)) {
      const msg = buildWorkflowBlockMessage(resource, method, config.baseUrl);
      console.error(ts, method, path, 422, "workflow-blocked");
      jsonResponse(res, 422, { error: msg });
      return true;
    }

    if (method === "GET") {
      const query: Record<string, unknown> = {};
      for (const [k, v] of url.searchParams.entries()) {
        const num = Number(v);
        query[k] = v !== "" && Number.isFinite(num) ? num : v;
      }
      const result = await client.get(resource, query);
      console.error(ts, method, path, 200);
      jsonResponse(res, 200, result);
      return true;
    }

    if (method === "POST" && !recordId) {
      const raw = await readBody(req);
      let body: unknown;
      try { body = JSON.parse(raw); }
      catch { jsonResponse(res, 400, { error: "Invalid JSON body" }); return true; }
      const result = await client.post(resource, body);
      console.error(ts, method, path, 200);
      jsonResponse(res, 200, result);
      return true;
    }

    if (method === "PUT" && recordId) {
      const raw = await readBody(req);
      let body: unknown;
      try { body = JSON.parse(raw); }
      catch { jsonResponse(res, 400, { error: "Invalid JSON body" }); return true; }
      const result = await client.put(`${resource}/${recordId}`, body);
      console.error(ts, method, path, 200);
      jsonResponse(res, 200, result);
      return true;
    }

    if (method === "DELETE" && recordId) {
      const result = await client.delete(`${resource}/${recordId}`);
      console.error(ts, method, path, 200);
      jsonResponse(res, 200, result);
      return true;
    }

    return false;

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Parse status from "[422] ..." style error messages produced by openemis.ts
    if (msg === "PAYLOAD_TOO_LARGE") {
      jsonResponse(res, 413, { error: "Request body exceeds 1 MB limit" });
      return true;
    }
    const statusMatch = msg.match(/\[(\d{3})\]/);
    const status = statusMatch ? Number(statusMatch[1]) : 500;
    console.error(ts, method, path, status, msg.slice(0, 120));
    jsonResponse(res, status, { error: msg });
    return true;
  }
}
