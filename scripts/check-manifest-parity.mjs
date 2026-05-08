#!/usr/bin/env node
/**
 * Manifest parity check.
 *
 * Compares the kebab-case resource keys declared in OpenEMIS Core's
 * CrudApiController::$allowedResources against the unique resource paths
 * present in this MCP's data/manifest.jsonl. Reports any drift.
 *
 * Usage:
 *   node scripts/check-manifest-parity.mjs [--core <path-to-core-checkout>]
 *
 * Defaults:
 *   --core ~/PhpstormProjects/emis/emis/core
 *
 * Exit codes:
 *   0 — perfect parity (every kebab key in $allowedResources has at least one
 *       row in manifest.jsonl, and vice versa).
 *   1 — drift detected (lists adds/deletes).
 *   2 — could not read inputs.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..");

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

const corePath = resolve(
  arg("--core", resolve(homedir(), "PhpstormProjects/emis/emis/core")),
);
const controllerPath = resolve(
  corePath,
  "api/app/Http/Controllers/BaseApi/CrudApiController.php",
);
const manifestPath = resolve(PKG_ROOT, "data/manifest.jsonl");

if (!existsSync(controllerPath)) {
  console.error(`ERROR: CrudApiController not found at ${controllerPath}`);
  console.error(`Pass --core <path> to point at a different checkout.`);
  process.exit(2);
}
if (!existsSync(manifestPath)) {
  console.error(`ERROR: manifest not found at ${manifestPath}`);
  process.exit(2);
}

// Parse $allowedResources keys via regex. Format is consistent:
//   'kebab-case' => \App\Models\Api5\ModelName::class,
const phpSrc = readFileSync(controllerPath, "utf-8");
const blockMatch = phpSrc.match(
  /protected\s+\$allowedResources\s*=\s*\[([\s\S]*?)\];/,
);
if (!blockMatch) {
  console.error("ERROR: could not locate $allowedResources block in controller");
  process.exit(2);
}
const block = blockMatch[1];
const keyRe = /'([a-z][a-z0-9-]*)'\s*=>/g;
const sourceResources = new Set();
let m;
while ((m = keyRe.exec(block)) !== null) sourceResources.add(m[1]);

// Manifest: collect kebab segment between /api/v5/ and the next slash or end.
const manifestSrc = readFileSync(manifestPath, "utf-8");
const manifestResources = new Set();
for (const line of manifestSrc.split("\n")) {
  if (!line.trim()) continue;
  let row;
  try { row = JSON.parse(line); } catch { continue; }
  const path = String(row.path ?? "");
  const match = path.match(/^\/api\/v5\/([a-z][a-z0-9-]*)/);
  if (match) manifestResources.add(match[1]);
}

const missingFromManifest = [...sourceResources].filter((r) => !manifestResources.has(r));
const orphanInManifest    = [...manifestResources].filter((r) => !sourceResources.has(r));

console.log(`Core checkout       : ${corePath}`);
console.log(`Resources in source : ${sourceResources.size}`);
console.log(`Resources in manifest: ${manifestResources.size}`);
console.log("");

if (missingFromManifest.length === 0 && orphanInManifest.length === 0) {
  console.log("✅  Parity OK — every $allowedResources key is covered, and every manifest resource is declared in source.");
  process.exit(0);
}

if (missingFromManifest.length > 0) {
  console.log(`❌  ${missingFromManifest.length} resource(s) in $allowedResources but missing from manifest.jsonl:`);
  for (const r of missingFromManifest.sort()) console.log(`     + ${r}`);
  console.log("");
}
if (orphanInManifest.length > 0) {
  console.log(`⚠️   ${orphanInManifest.length} resource(s) in manifest.jsonl but not declared in $allowedResources (deleted upstream?):`);
  for (const r of orphanInManifest.sort()) console.log(`     - ${r}`);
  console.log("");
}
process.exit(1);
