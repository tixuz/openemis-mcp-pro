#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { loadConfig, loadManifest } from "./config.js";
import { OpenemisClientImpl } from "./openemis.js";
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

  // Connect stdio transport for MCP communication
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[openemis-mcp] Fatal error:", err);
  process.exit(1);
});
