/**
 * Workflow policy guards for OpenEMIS write tools.
 *
 * Certain resources in OpenEMIS are "workflow-controlled": writes to them
 * must flow through the application's approval chain (e.g. supervisor sign-off,
 * audit trail). Direct API writes bypass those chains and can corrupt attendance
 * or absence records silently.
 *
 * Any resource listed here will be blocked by the write tools and redirected
 * to the appropriate playbook.
 */

export const WORKFLOW_BLOCKED_RESOURCES = new Set<string>([
  "student-attendance-marked-records",
  "student-attendance-per-day-periods",
  "institution-student-absence-details",
  "staff-attendances",
]);

/**
 * Return true when the given kebab-case resource is workflow-controlled
 * and must not be written to directly via the API.
 */
export function isWorkflowBlocked(resource: string): boolean {
  return WORKFLOW_BLOCKED_RESOURCES.has(resource);
}

/**
 * Build the human-readable refusal message shown to the agent when it
 * attempts a direct write to a workflow-controlled resource.
 *
 * The application UI URL is derived by stripping the /api/v5 suffix from
 * the configured base URL so it points at the browser-accessible root.
 */
export function buildWorkflowBlockMessage(
  resource: string,
  method: string,
  baseUrl: string
): string {
  const appUrl = baseUrl.replace(/\/api\/v5\/?$/, "");
  return (
    `OpenEMIS MCP: ${method.toUpperCase()} /${resource} is workflow-controlled.\n\n` +
    `Use the mark-student-attendance or mark-staff-attendance playbook instead.\n` +
    `Direct writes bypass approval chains and audit logs.\n\n` +
    `Application UI: ${appUrl}`
  );
}
