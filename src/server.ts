#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { loadConfig } from "./config.js";
import { OpenemisClientImpl } from "./openemis.js";
import {
  OPENEMIS_GET_TOOL,
  openemisGetInputSchema,
  createOpenemisGetHandler,
} from "./tools/crud.js";
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
  version: "0.1.0",
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
      const token = await client.getToken();
      const tokenPreview = token.slice(0, 20) + "..." + token.slice(-6);
      return {
        content: [
          {
            type: "text",
            text: `OpenEMIS is reachable at ${config.baseUrl} and login succeeded (JWT ${tokenPreview}).`,
          },
        ],
        structuredContent: {
          ok: true,
          baseUrl: config.baseUrl,
          login: "ok",
          tokenPreview,
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
 * Write-gate stubs: openemis_create / openemis_update / openemis_delete.
 *
 * These exist in v0.2.x so the agent calls the tool and receives a clear
 * read-only refusal — instead of digging through config files for credentials
 * and falling back to raw curl against legacy v4 endpoints.
 *
 * Full write support ships in v0.3.0 (non-workflow resources only).
 */
const WRITE_POLICY = (resource: string, method: string) =>
  `OpenEMIS MCP is READ-ONLY in v0.2.x. ` +
  `${method.toUpperCase()} /api/v5/${resource} is not available yet.\n\n` +
  `DO NOT attempt a raw curl/HTTP fallback — that risks hitting legacy v4 ` +
  `endpoints or bypassing workflow approval chains.\n\n` +
  `Please perform this action in the official OpenEMIS application at ` +
  `${config.baseUrl.replace("/api/v5", "")}. ` +
  `Write tools (openemis_create, openemis_update, openemis_delete) arrive in v0.3.0.`;

server.tool(
  "openemis_create",
  "Create a new record via POST /api/v5/{resource}. READ-ONLY in v0.2.x — returns a policy message instead of writing.",
  { resource: z.string().describe("Resource name, e.g. student-attendance-marked-records"), body: z.unknown().optional().describe("Request body (ignored in v0.2.x)") },
  async ({ resource }: { resource: string }) => ({
    content: [{ type: "text" as const, text: WRITE_POLICY(resource, "POST") }],
    isError: true,
  })
);

server.tool(
  "openemis_update",
  "Update a record via PUT/PATCH /api/v5/{resource}/{id}. READ-ONLY in v0.2.x — returns a policy message instead of writing.",
  { resource: z.string().describe("Resource name"), id: z.union([z.string(), z.number()]).optional().describe("Record id"), body: z.unknown().optional().describe("Request body (ignored in v0.2.x)") },
  async ({ resource }: { resource: string }) => ({
    content: [{ type: "text" as const, text: WRITE_POLICY(resource, "PUT") }],
    isError: true,
  })
);

server.tool(
  "openemis_delete",
  "Delete a record via DELETE /api/v5/{resource}/{id}. READ-ONLY in v0.2.x — returns a policy message instead of writing.",
  { resource: z.string().describe("Resource name"), id: z.union([z.string(), z.number()]).describe("Record id") },
  async ({ resource }: { resource: string }) => ({
    content: [{ type: "text" as const, text: WRITE_POLICY(resource, "DELETE") }],
    isError: true,
  })
);

/**
 * Initialize server: register all tools and connect stdio transport.
 */
async function main(): Promise<void> {
  // MCP SDK expects a ZodRawShape (plain object of zod types), not a wrapped z.object().
  // The ZodObject `.shape` getter gives us the raw shape.
  server.tool(
    OPENEMIS_GET_TOOL.name,
    OPENEMIS_GET_TOOL.description,
    openemisGetInputSchema.shape,
    createOpenemisGetHandler(client)
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

  // Connect stdio transport for MCP communication
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[openemis-mcp] Fatal error:", err);
  process.exit(1);
});
