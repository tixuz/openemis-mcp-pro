/**
 * Write tools for OpenEMIS MCP: openemis_create, openemis_update, openemis_delete.
 *
 * Workflow-controlled resources (attendance, absence) are blocked here and
 * redirected to playbooks. All other resources supported by the v5 manifest
 * can be mutated through these tools.
 */

import { z } from "zod";
import type { ManifestRow, OpenemisClient } from "../types.js";
import { isWorkflowBlocked, buildWorkflowBlockMessage } from "../policies.js";
import { normalizeResponse } from "../utils.js";
import { stringifyUntrusted } from "../auth/envelope.js";
import { scrubSecrets } from "../auth/redact.js";
import { CRUD_UNTRUSTED_OUTPUT_NOTE } from "./crud.js";

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
    "Only resources that appear with method POST in the OpenEMIS v5 manifest are accepted." +
    CRUD_UNTRUSTED_OUTPUT_NOTE,
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

      // Step e: return, wrapping the upstream record in the untrusted-data
      // envelope so a hostile record field can't pose as a system instruction.
      return {
        content: [
          {
            type: "text" as const,
            text: stringifyUntrusted(normalized),
          },
        ],
      };
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      // Scrub upstream error body — may echo Authorization header.
      const message = scrubSecrets(rawMessage);
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
    "Only resources that appear with method PUT in the OpenEMIS v5 manifest are accepted." +
    CRUD_UNTRUSTED_OUTPUT_NOTE,
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

      // Step e: return, wrapping the upstream record in the untrusted-data
      // envelope so a hostile record field can't pose as a system instruction.
      return {
        content: [
          {
            type: "text" as const,
            text: stringifyUntrusted(normalized),
          },
        ],
      };
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      // Scrub upstream error body — may echo Authorization header.
      const message = scrubSecrets(rawMessage);
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
    "Only resources that appear with method DELETE in the OpenEMIS v5 manifest are accepted." +
    CRUD_UNTRUSTED_OUTPUT_NOTE,
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

      // Step e: return, wrapping the upstream record in the untrusted-data
      // envelope so a hostile record field can't pose as a system instruction.
      return {
        content: [
          {
            type: "text" as const,
            text: stringifyUntrusted(normalized),
          },
        ],
      };
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error);
      // Scrub upstream error body — may echo Authorization header.
      const message = scrubSecrets(rawMessage);
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
