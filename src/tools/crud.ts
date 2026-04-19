/**
 * Simplified CRUD tool: getter-only MVP.
 * Single unified tool: openemis_get
 */

import { z } from "zod";
import type { OpenemisClient, QueryParams } from "../types.js";
import { normalizeResponse } from "../utils.js";

// Tool name and description for server registration
export const OPENEMIS_GET_TOOL = {
  name: "openemis_get",
  description:
    "Fetch data from an OpenEMIS v5 resource. If `id` is provided, fetches that single record. Otherwise lists records, optionally filtered via `params`. `resource` is kebab-case like 'absence-types' or 'institution-students'. IMPORTANT: Never use direct field params (e.g. name='Avory') for filtering unless the exact param key is known from code or docs — use `_conditions` instead. `_conditions` is a semicolon-separated string: exact match '_conditions=name:Avory', wildcard '_conditions=name:*avory*' (uses SQL LIKE), comparison '_conditions=age:>=10', multiple '_conditions=name:*avory*;status:1'. Direct params are for pagination only (page, limit, orderby, order, fields). Use _scope when the model has a named scope. _contain is rarely supported.",
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
    .describe(
      "Query parameters. Use `_conditions` for all field filtering — never bare field names. " +
      "`_conditions` is a semicolon-separated string of key:value pairs. " +
      "Exact match: '_conditions=name:Avory Primary School'. " +
      "LIKE/wildcard search: '_conditions=name:*avory*' (asterisk * becomes SQL %, e.g. WHERE name LIKE '%avory%'). " +
      "Comparison: '_conditions=age:>=10' or '_conditions=age:<=18'. " +
      "Multiple conditions: '_conditions=name:*avory*;status:1'. " +
      "Other keys: page, limit, orderby, order, fields. _scope applies a named model scope when the model supports it (e.g. '_scope=active'). _contain is rarely supported."
    ),
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
      // OpenEMIS v5 routes are kebab-case; pass the resource name through as-is.
      const basePath = `/api/v5/${args.resource}`;
      const path = args.id ? `${basePath}/${args.id}` : basePath;

      // Call API and normalize the envelope shape
      const raw = await client.get(path, args.params);
      const response = normalizeResponse(raw);

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

