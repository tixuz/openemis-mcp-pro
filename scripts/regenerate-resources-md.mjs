#!/usr/bin/env node
/**
 * Regenerate docs/resources.md from data/grouped-manifest.json.
 *
 * Output shape:
 *   - Header: total resources, total endpoints, version banner.
 *   - Legend: ✅ available · 🔒 workflow-only · — not available.
 *   - Table: one row per resource, grouped by family prefix, showing
 *     GET / POST / PUT / DELETE availability and a write-status column.
 *
 * Variants:
 *   --variant=free  : write column says "— not available (read-only distribution)"
 *                     when POST/PUT/DELETE would be exposed
 *   --variant=pro   : write column says "✅ v1.0.0 live" for any non-workflow row
 *
 * Usage:
 *   node scripts/regenerate-resources-md.mjs --variant=free [--write]
 *   node scripts/regenerate-resources-md.mjs --variant=pro  [--write]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..");

const args = process.argv.slice(2);
const variant = args.find((a) => a.startsWith("--variant="))?.split("=")[1] ?? "free";
if (!["free", "pro"].includes(variant)) {
  console.error(`ERROR: --variant must be 'free' or 'pro' (got '${variant}')`);
  process.exit(2);
}
const WRITE = args.includes("--write");

const groupedPath = resolve(PKG_ROOT, "data/grouped-manifest.json");
const outPath = resolve(PKG_ROOT, "docs/resources.md");
if (!existsSync(groupedPath)) {
  console.error(`ERROR: grouped manifest not found at ${groupedPath}`);
  process.exit(2);
}

const g = JSON.parse(readFileSync(groupedPath, "utf-8"));
const version = "v1.1.0";

// Workflow-controlled resources (writes blocked; reads safe).
const WORKFLOW_BLOCKED = new Set([
  "InstitutionStaffLeave",
  "InstitutionStudentAdmission",
  "InstitutionStudentEnrolment",
  "ScholarshipApplications",
  "InstitutionStaffTransferRequests",
  "InstitutionStudentTransferRequests",
  "StaffLeaveRequests",
  "StaffPositionTitles",
]);

function pascalToKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function writeStatusFor(name, hasWrites) {
  if (variant === "free") {
    if (!hasWrites) return "—";
    return "— (pro)";
  }
  // pro
  if (WORKFLOW_BLOCKED.has(name)) return "🔒 workflow";
  if (!hasWrites) return "— (read-only)";
  return "✅ v1.0.0 live";
}

function methodCell(present, isWorkflowWrite) {
  if (!present) return "—";
  if (isWorkflowWrite) return "🔒";
  return "✅";
}

function rowFor(r) {
  const kebab = pascalToKebab(r.name);
  const kinds = r.kinds || {};
  const hasList = !!kinds.LIST;
  const hasGet = !!kinds.GET;
  const hasCreate = !!kinds.CREATE;
  const hasUpdate = !!kinds.UPDATE;
  const hasDelete = !!kinds.DELETE;
  const isWorkflow = WORKFLOW_BLOCKED.has(r.name);
  const writeBlockedInFree = variant === "free";

  const get = (hasList || hasGet) ? "✅" : "—";
  const post = methodCell(hasCreate && !writeBlockedInFree, isWorkflow);
  const put = methodCell(hasUpdate && !writeBlockedInFree, isWorkflow);
  const del = methodCell(hasDelete && !writeBlockedInFree, isWorkflow);

  const status = writeStatusFor(r.name, hasCreate || hasUpdate || hasDelete);

  return `| \`${kebab}\` | ${getDomainOf(r.name)} | ${get} | ${post} | ${put} | ${del} | ${status} |`;
}

// Build a name → domain map. Families have a prefix like "Institution*"; we use that.
const nameToDomain = new Map();
for (const f of g.families) {
  for (const r of f.resources) nameToDomain.set(r.name, f.prefix);
}
for (const r of g.orphans) nameToDomain.set(r.name, "—");
function getDomainOf(name) { return nameToDomain.get(name) ?? "—"; }

// Header
const distroLabel = variant === "free"
  ? "the FREE distribution — read-only. Writes (POST/PUT/DELETE) live in [openemis-mcp-pro](https://github.com/tixuz/openemis-mcp-pro)."
  : "the PRO distribution — read + write. Workflow-controlled resources are blocked at the tool layer (🔒); use the appropriate playbook instead.";

const header = `# OpenEMIS MCP — Resource Reference

> **${g.total_resources} resources** · **${g.total_endpoints} endpoints** · ${version} · OpenEMIS Core 5.10.0
>
> This is ${distroLabel}
>
> The MCP does **not** load this table into AI context. It uses a compact
> \`grouped-manifest.json\` (~210 KB) with domain buckets + playbooks.
> The agent navigates by domain/playbook and pulls endpoint details on demand.

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Available |
| 🔒 | Workflow-only — use the appropriate playbook, not a direct write |
| — | Not available for this resource |

## Resources
`;

const rows = [];
rows.push(`| Resource | Domain | GET | POST | PUT | DELETE | Write Status |`);
rows.push(`|---|---|:---:|:---:|:---:|:---:|---|`);

// Emit families in order of size (existing convention from the previous file).
for (const f of g.families) {
  rows.push(`| **── ${f.prefix} ──** | | | | | | |`);
  for (const r of f.resources) rows.push(rowFor(r));
}
rows.push(`| **── singletons ──** | | | | | | |`);
for (const r of g.orphans) rows.push(rowFor(r));

const out = header + rows.join("\n") + "\n";

console.log(`Variant     : ${variant}`);
console.log(`Source      : ${groupedPath}`);
console.log(`Output      : ${outPath}`);
console.log(`Resources   : ${g.total_resources}`);
console.log(`Endpoints   : ${g.total_endpoints}`);
console.log(`Lines       : ${out.split("\n").length}`);

if (WRITE) {
  writeFileSync(outPath, out);
  console.log(`✅  wrote ${outPath}`);
} else {
  console.log("(dry run — pass --write to overwrite)");
}
