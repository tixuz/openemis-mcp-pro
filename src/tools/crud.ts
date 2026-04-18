/**
 * Simplified CRUD tool: getter-only MVP.
 * Single unified tool: openemis_get
 */

import { z } from "zod";
import type { OpenemisClient, QueryParams } from "../types.js";

// Tool name and description for server registration
export const OPENEMIS_GET_TOOL = {
  name: "openemis_get",
  description:
    "Fetch data from an OpenEMIS v5 resource. If `id` is provided, fetches that single record. Otherwise lists records, optionally filtered via `params`. `resource` is kebab-case like 'absence-types' or 'institution-students'.",
};

// Tool input schema
export const openemisGetInputSchema = z.object({
  resource: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, "resource must be kebab-case")
    .describe("Resource name in kebab-case (e.g., 'absence-types', 'institution-students')"),
  id: z
    .union([z.string(), z.number()])
    .optional()
    .describe("Resource ID to fetch a single record. Omit to list."),
  params: z
    .record(z.unknown())
    .optional()
    .describe("Query parameters for filtering, pagination, sorting (fields, conditions, scope, orderby, order, page, limit, etc.)"),
});

/**
 * Handler factory for the openemis_get tool.
 * @param client - OpenemisClient instance for making API calls
 * @returns AsyncFunction that handles tool invocation
 */
export function createOpenemisGetHandler(client: OpenemisClient) {
  return async (args: {
    resource: string;
    id?: string | number;
    params?: QueryParams;
  }) => {
    try {
      // Convert kebab-case resource to path (e.g., 'absence-types' → 'AbsenceTypes')
      const resourcePath = args.resource
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

      // Build API path
      const basePath = `/api/v5/${resourcePath}`;
      const path = args.id ? `${basePath}/${args.id}` : basePath;

      // Call API
      const response = await client.get(path, args.params);

      // Return as MCP text content
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: "Failed to fetch from OpenEMIS",
                details: message,
                resource: args.resource,
                id: args.id || null,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  };
}

