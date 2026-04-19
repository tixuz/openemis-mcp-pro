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

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end",  () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

function jsonResponse(res: ServerResponse, status: number, data: unknown): void {
  const body = JSON.stringify(data, null, 2);
  res.writeHead(status, {
    "Content-Type":                "application/json",
    "Access-Control-Allow-Origin": "*",
    "Content-Length":              String(Buffer.byteLength(body)),
  });
  res.end(body);
}

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
            content: { "application/json": { schema: { type: "object" } } },
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
            content: { "application/json": { schema: { type: "object" } } },
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
  const serverUrl  = `http://${hostHeader}`;           // use X-Forwarded-Proto in nginx setups
  const url    = new URL(rawUrl, serverUrl);
  const path   = url.pathname;
  const method = (req.method ?? "GET").toUpperCase();

  // ── CORS preflight ────────────────────────────────────────────────────────
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

  // ── Discover ──────────────────────────────────────────────────────────────
  if (method === "GET" && path === "/api/discover") {
    const topic  = url.searchParams.get("topic") ?? "";
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

  try {
    if (method === "GET") {
      const query: Record<string, unknown> = {};
      for (const [k, v] of url.searchParams.entries()) {
        const num = Number(v);
        query[k] = v !== "" && Number.isFinite(num) ? num : v;
      }
      jsonResponse(res, 200, await client.get(resource, query));
      return true;
    }

    if (method === "POST" && !recordId) {
      const raw  = await readBody(req);
      const body = JSON.parse(raw) as unknown;
      jsonResponse(res, 200, await client.post(resource, body));
      return true;
    }

    if (method === "PUT" && recordId) {
      const raw  = await readBody(req);
      const body = JSON.parse(raw) as unknown;
      jsonResponse(res, 200, await client.put(`${resource}/${recordId}`, body));
      return true;
    }

    if (method === "DELETE" && recordId) {
      jsonResponse(res, 200, await client.delete(`${resource}/${recordId}`));
      return true;
    }

    return false;

  } catch (err) {
    const msg    = err instanceof Error ? err.message : String(err);
    const status = /422/.test(msg) ? 422 : /404/.test(msg) ? 404 : /401/.test(msg) ? 401 : 500;
    jsonResponse(res, status, { error: msg });
    return true;
  }
}
