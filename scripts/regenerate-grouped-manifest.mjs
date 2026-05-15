#!/usr/bin/env node
/**
 * Rebuild data/grouped-manifest.json from data/manifest.jsonl.
 *
 * Strategy
 * --------
 *  - manifest.jsonl is the source of truth for endpoints. We re-derive
 *    families[], orphans[] and totals from it.
 *  - domains[] are HAND-CURATED (summaries, coverage notes). We preserve
 *    them verbatim; if a domain's listed resource no longer appears in the
 *    manifest, we drop it from the domain's resources[] but keep the rest.
 *  - playbooks[] is preserved verbatim from the existing grouped manifest;
 *    playbook_count is recomputed.
 *
 *  Family rule: PascalCase resource name → take the leading [A-Z][a-z0-9]*
 *  token as the prefix. Resources sharing a prefix with ≥2 members form a
 *  family. Singleton-prefixed resources go to orphans[].
 *
 * Usage:
 *   node scripts/regenerate-grouped-manifest.mjs
 *     [--manifest <path>] [--grouped <path>] [--playbooks <path>] [--write]
 *
 * Without --write, it prints a diff summary and exits 0.
 * With --write, it overwrites the grouped manifest in place.
 *
 * If --playbooks is supplied (or data/playbooks.json exists at the default
 * location), the embedded playbooks[] block is rebuilt from that source of
 * truth instead of being preserved verbatim.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..");

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
const WRITE = args.includes("--write");
const manifestPath  = resolve(arg("--manifest",  resolve(PKG_ROOT, "data/manifest.jsonl")));
const groupedPath   = resolve(arg("--grouped",   resolve(PKG_ROOT, "data/grouped-manifest.json")));
const playbooksPath = resolve(arg("--playbooks", resolve(PKG_ROOT, "data/playbooks.json")));

if (!existsSync(manifestPath)) {
  console.error(`ERROR: manifest not found at ${manifestPath}`);
  process.exit(2);
}
if (!existsSync(groupedPath)) {
  console.error(`ERROR: grouped manifest not found at ${groupedPath}`);
  process.exit(2);
}

// --- Index manifest by resource ---
const manifestSrc = readFileSync(manifestPath, "utf-8");
const resources = new Map(); // resourceName -> { endpoints: int, kinds: {LIST,GET,CREATE,UPDATE,DELETE} }
let totalEndpoints = 0;
for (const line of manifestSrc.split("\n")) {
  if (!line.trim()) continue;
  let row;
  try { row = JSON.parse(line); } catch { continue; }
  totalEndpoints++;
  const name = String(row.resource ?? "");
  if (!name) continue;
  const kind = String(row.kind ?? "");
  if (!resources.has(name)) {
    resources.set(name, { endpoints: 0, kinds: {} });
  }
  const r = resources.get(name);
  r.endpoints++;
  r.kinds[kind] = (r.kinds[kind] ?? 0) + 1;
}

// --- Group by leading PascalCase prefix ---
function prefixOf(name) {
  const m = name.match(/^([A-Z][a-z0-9]*)/);
  return m ? m[1] : name;
}
const byPrefix = new Map();
for (const [name, info] of resources) {
  const p = prefixOf(name);
  if (!byPrefix.has(p)) byPrefix.set(p, []);
  byPrefix.get(p).push({ name, ...info });
}

// Sort resources within each family alphabetically for stability
for (const arr of byPrefix.values()) arr.sort((a, b) => a.name.localeCompare(b.name));

// Split into families (>=2) and orphans (singletons)
const families = [];
const orphans = [];
const prefixesSorted = [...byPrefix.entries()].sort((a, b) => b[1].length - a[1].length);
for (const [prefix, list] of prefixesSorted) {
  if (list.length >= 2) {
    families.push({
      prefix: `${prefix}*`,
      resources: list,
      endpoint_count: list.reduce((s, r) => s + r.endpoints, 0),
    });
  } else {
    orphans.push(list[0]);
  }
}
orphans.sort((a, b) => a.name.localeCompare(b.name));

// --- Preserve domains (hand-curated) and playbooks ---
const existing = JSON.parse(readFileSync(groupedPath, "utf-8"));
const preservedDomains = (existing.domains ?? []).map((d) => {
  const filteredResources = (d.resources ?? []).filter((r) => resources.has(r.name));
  // Refresh per-resource endpoint counts in case kinds shifted
  const refreshed = filteredResources.map((r) => ({
    name: r.name,
    endpoints: resources.get(r.name).endpoints,
    kinds: resources.get(r.name).kinds,
  }));
  return {
    ...d,
    resources: refreshed,
    endpoint_count: refreshed.reduce((s, r) => s + r.endpoints, 0),
  };
});
let preservedPlaybooks = existing.playbooks ?? [];
if (existsSync(playbooksPath)) {
  try {
    const pb = JSON.parse(readFileSync(playbooksPath, "utf-8"));
    if (Array.isArray(pb.playbooks)) preservedPlaybooks = pb.playbooks;
  } catch (e) {
    console.warn(`WARN: could not parse playbooks.json (${e.message}); keeping embedded copy`);
  }
}

// --- Assemble new grouped manifest ---
const out = {
  version: existing.version ?? 1,
  total_endpoints: totalEndpoints,
  total_resources: resources.size,
  domains: preservedDomains,
  families,
  orphans,
  summary: {
    domain_endpoint_total: preservedDomains.reduce((s, d) => s + (d.endpoint_count ?? 0), 0),
    family_endpoint_total: families.reduce((s, f) => s + (f.endpoint_count ?? 0), 0),
    orphan_endpoint_total: orphans.reduce((s, r) => s + r.endpoints, 0),
    playbook_count: preservedPlaybooks.length,
  },
  playbooks: preservedPlaybooks,
  playbook_count: preservedPlaybooks.length,
};

// --- Report ---
console.log(`Manifest         : ${manifestPath}`);
console.log(`Grouped manifest : ${groupedPath}`);
console.log(`Total endpoints  : ${out.total_endpoints} (was ${existing.total_endpoints})`);
console.log(`Total resources  : ${out.total_resources} (was ${existing.total_resources})`);
console.log(`Families         : ${families.length}`);
console.log(`Orphans          : ${orphans.length}`);
console.log(`Domains          : ${preservedDomains.length} (preserved verbatim)`);
console.log(`Playbooks        : ${out.playbook_count}`);
console.log("");

if (WRITE) {
  writeFileSync(groupedPath, JSON.stringify(out, null, 2) + "\n");
  console.log(`✅  wrote ${groupedPath}`);
} else {
  console.log(`(dry run — pass --write to overwrite ${groupedPath})`);
}
