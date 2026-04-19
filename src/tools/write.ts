/**
 * Write tools for OpenEMIS MCP: openemis_create, openemis_update, openemis_delete.
 *
 * Workflow-controlled resources (attendance, absence) are blocked here and
 * redirected to playbooks. All other resources supported by the v5 manifest
 * can be mutated through these tools.
 *
 * normalizeResponse is copied verbatim from crud.ts to avoid a circular
 * import between write.ts and crud.ts.
 */

import { z } from "zod";
import type { ManifestRow, OpenemisClient } from "../types.js";
import { isWorkflowBlocked, buildWorkflowBlockMessage } from "../policies.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a kebab-case resource name to PascalCase so it can be matched
 * against the ManifestRow.resource field which is PascalCase.
 *
 * Examples:
 *   "student-attendance-marked-records" → "StudentAttendanceMarkedRecords"
 *   "absence-types"                     → "AbsenceTypes"
 */
export function kebabToPascal(kebab: string): string {
  return kebab
    .split("-")
    .map((segment) =>
      segment.length === 0
        ? ""
        : segment[0].toUpperCase() + segment.slice(1)
    )
    .join("");
}

/**
 * Check whether the given resource + HTTP method pair is present in the
 * loaded manifest. Resource is provided in kebab-case and converted to
 * PascalCase before the comparison.
 */
export function manifestHasMethod(
  manifest: ManifestRow[],
  resource: string,
  method: string
): boolean {
  const pascal = kebabToPascal(resource);
  const upperMethod = method.toUpperCase();
  return manifest.some(
    (row) =>
      row.resource === pascal &&
      row.method.toUpperCase() === upperMethod
  );
}

/**
 * Normalize the raw OpenEMIS API response into a consistent shape.
 * Copied verbatim from crud.ts to avoid a circular import.
 *
 * The v5 API returns two different envelope shapes:
 *   - Paginated list: { message, data: { current_page, data: [...], total, ... } }
 *   - Single record:  { message, data: { id, ... } }
 *   - Flat list:      { message, data: [...] }
 */
function normalizeResponse(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;

  const obj = raw as Record<string, unknown>;

  // Paginated envelope: data is an object containing a nested data array
  if (
    obj.data !== null &&
    typeof obj.data === "object" &&
    !Array.isArray(obj.data)
  ) {
    const inner = obj.data as Record<string, unknown>;
    if (Array.isArray(inner.data)) {
      return {
        message: obj.message,
        data: inner.data,
        total: inner.total,
        current_page: inner.current_page,
        last_page: inner.last_page,
      };
    }
  }

  // Flat array or single record — return as-is
  return raw;
}

// ---------------------------------------------------------------------------
// openemis_create
// ---------------------------------------------------------------------------

export const openemisCreateInputSchema = z.object({
  resource: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, "resource must be kebab-case")
    .describe(
      "Resource name in kebab-case (e.g., 'institution-students', 'student-behaviours')"
    ),
  body: z
    .record(z.unknown())
    .describe("JSON fields to POST — the new record payload"),
});

export const OPENEMIS_CREATE_TOOL = {
  name: "openemis_create",
  description:
    "Create a record via POST /api/v5/{resource}. " +
    "Workflow-controlled resources (attendance etc.) are blocked — use playbooks for those. " +
    "Only resources that appear with method POST in the OpenEMIS v5 manifest are accepted.",
};

/**
 * Handler factory for openemis_create.
 * @param client   - Authenticated OpenemisClient instance
 * @param manifest - Parsed manifest rows (from loadManifest)
 * @param baseUrl  - Base URL for the refusal message (e.g. https://demo.openemis.org/core)
 */
export function createOpenemisCreateHandler(
  client: OpenemisClient,
  manifest: ManifestRow[],
  baseUrl: string
) {
  return async (args: { resource: string; body: Record<string, unknown> }) => {
    const { resource, body } = args;

    try {
      // Step a: workflow-blocked resources are never written directly
      if (isWorkflowBlocked(resource)) {
        return {
          content: [
            {
              type: "text" as const,
              text: buildWorkflowBlockMessage(resource, "POST", baseUrl),
            },
          ],
          isError: true,
        };
      }

      // Step b: manifest check — resource must support POST
      if (!manifestHasMethod(manifest, resource, "POST")) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Resource '${resource}' does not support POST per the OpenEMIS v5 manifest.`,
            },
          ],
          isError: true,
        };
      }

      // Step c: perform the POST
      const raw = await client.post(`/api/v5/${resource}`, body);

      // Step d: normalise envelope
      const normalized = normalizeResponse(raw);

      // Step e: return
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(normalized, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: "Failed to write to OpenEMIS",
                details: message,
                resource,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  };
}

// ---------------------------------------------------------------------------
// openemis_update
// ---------------------------------------------------------------------------

export const openemisUpdateInputSchema = z.object({
  resource: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, "resource must be kebab-case")
    .describe("Resource name in kebab-case (e.g., 'institution-students')"),
  id: z
    .union([z.string(), z.number()])
    .describe("ID of the record to update"),
  body: z
    .record(z.unknown())
    .describe("JSON fields to PUT — the updated record payload"),
});

export const OPENEMIS_UPDATE_TOOL = {
  name: "openemis_update",
  description:
    "Update a record via PUT /api/v5/{resource}/{id}. " +
    "Workflow-controlled resources (attendance etc.) are blocked — use playbooks for those. " +
    "Only resources that appear with method PUT in the OpenEMIS v5 manifest are accepted.",
};

/**
 * Handler factory for openemis_update.
 */
export function createOpenemisUpdateHandler(
  client: OpenemisClient,
  manifest: ManifestRow[],
  baseUrl: string
) {
  return async (args: {
    resource: string;
    id: string | number;
    body: Record<string, unknown>;
  }) => {
    const { resource, id, body } = args;

    try {
      // Step a: workflow block
      if (isWorkflowBlocked(resource)) {
        return {
          content: [
            {
              type: "text" as const,
              text: buildWorkflowBlockMessage(resource, "PUT", baseUrl),
            },
          ],
          isError: true,
        };
      }

      // Step b: manifest check
      if (!manifestHasMethod(manifest, resource, "PUT")) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Resource '${resource}' does not support PUT per the OpenEMIS v5 manifest.`,
            },
          ],
          isError: true,
        };
      }

      // Step c: perform PUT
      const raw = await client.put(`/api/v5/${resource}/${id}`, body);

      // Step d: normalise
      const normalized = normalizeResponse(raw);

      // Step e: return
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(normalized, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: "Failed to write to OpenEMIS",
                details: message,
                resource,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  };
}

// ---------------------------------------------------------------------------
// openemis_delete
// ---------------------------------------------------------------------------

export const openemisDeleteInputSchema = z.object({
  resource: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, "resource must be kebab-case")
    .describe("Resource name in kebab-case (e.g., 'institution-students')"),
  id: z
    .union([z.string(), z.number()])
    .describe("ID of the record to delete"),
});

export const OPENEMIS_DELETE_TOOL = {
  name: "openemis_delete",
  description:
    "Delete a record via DELETE /api/v5/{resource}/{id}. " +
    "Permanent. Cannot be undone. " +
    "Workflow-controlled resources (attendance etc.) are blocked — use playbooks for those. " +
    "Only resources that appear with method DELETE in the OpenEMIS v5 manifest are accepted.",
};

/**
 * Handler factory for openemis_delete.
 */
export function createOpenemisDeleteHandler(
  client: OpenemisClient,
  manifest: ManifestRow[],
  baseUrl: string
) {
  return async (args: { resource: string; id: string | number }) => {
    const { resource, id } = args;

    try {
      // Step a: workflow block
      if (isWorkflowBlocked(resource)) {
        return {
          content: [
            {
              type: "text" as const,
              text: buildWorkflowBlockMessage(resource, "DELETE", baseUrl),
            },
          ],
          isError: true,
        };
      }

      // Step b: manifest check
      if (!manifestHasMethod(manifest, resource, "DELETE")) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Resource '${resource}' does not support DELETE per the OpenEMIS v5 manifest.`,
            },
          ],
          isError: true,
        };
      }

      // Step c: perform DELETE (no body)
      const raw = await client.delete(`/api/v5/${resource}/${id}`);

      // Step d: normalise
      const normalized = normalizeResponse(raw);

      // Step e: return
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(normalized, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: "Failed to write to OpenEMIS",
                details: message,
                resource,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  };
}
