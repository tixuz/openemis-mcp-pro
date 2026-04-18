#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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
  "Check whether the configured OpenEMIS API endpoint is reachable.",
  {},
  async () => {
    try {
      const response = await client.get("/");
      return {
        content: [
          {
            type: "text",
            text: `OpenEMIS is reachable at ${config.baseUrl}`,
          },
        ],
        structuredContent: {
          ok: true,
          baseUrl: config.baseUrl,
          response,
        },
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      return {
        content: [
          {
            type: "text",
            text: `OpenEMIS is not reachable at ${config.baseUrl}: ${message}`,
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
