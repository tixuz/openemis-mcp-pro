import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

/**
 * Resolve a path relative to the package root (the directory that contains
 * package.json / data/). Works regardless of where the user launches the server from.
 * config.ts compiles to dist/config.js, so __dirname = <pkg>/dist, and <pkg> = ..
 */
const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Configuration for OpenEMIS MCP server.
 * Loaded from environment variables with sensible defaults.
 * Credentials are lazy-checked: server boots without them for introspection tools.
 */
export interface AppConfig {
  /** Base URL of OpenEMIS API (e.g., https://demo.openemis.org/core) */
  baseUrl: string;

  /** OpenEMIS username (required at API call time) */
  username: string;

  /** OpenEMIS password (required) */
  password: string;

  /** OpenEMIS API key (required) */
  apiKey: string;

  /** Request timeout in milliseconds (default 30000) */
  timeoutMs: number;

  /** Path to vault directory containing Domain-*.md notes used by openemis_discover.
   *  Set via OPENEMIS_VAULT_PATH. If absent, discovery degrades to keyword matching only. */
  vaultPath: string;

  /** Path to manifest.jsonl describing available endpoints.
   *  Defaults to the bundled data/manifest.jsonl inside the package. */
  manifestPath: string;

  /** Path to grouped-manifest.json with pre-computed hierarchical index (default data/grouped-manifest.json) */
  groupedPath: string;
}

/**
 * Parse timeout from environment variable string.
 * Returns 30 seconds if invalid or unset.
 */
function readTimeoutMs(rawValue: string | undefined): number {
  if (!rawValue) {
    return 30_000;
  }

  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30_000;
}

/**
 * Load configuration from environment variables.
 * Does NOT validate credentials at load time—only when API calls are made.
 * This allows the server to boot for introspection tools without credentials.
 */
export function loadConfig(): AppConfig {
  const baseUrl = (
    process.env.OPENEMIS_BASE_URL ?? "https://demo.openemis.org/core"
  ).replace(/\/+$/, "");

  const username = process.env.OPENEMIS_USERNAME ?? "";
  const password = process.env.OPENEMIS_PASSWORD ?? "";
  const apiKey = process.env.OPENEMIS_API_KEY ?? "";

  const timeoutMs = readTimeoutMs(process.env.OPENEMIS_TIMEOUT_MS);

  // No hardcoded personal default — vault is optional; if absent, discovery
  // degrades gracefully to keyword matching against the manifest alone.
  const vaultPath = process.env.OPENEMIS_VAULT_PATH ?? "";

  // Default to package-bundled data files (resolved from dist/config.js location),
  // NOT process.cwd() — the server may be launched from anywhere.
  const manifestPath =
    process.env.OPENEMIS_MANIFEST_PATH ??
    resolve(PKG_ROOT, "data/manifest.jsonl");

  const groupedPath =
    process.env.OPENEMIS_GROUPED_PATH ??
    resolve(PKG_ROOT, "data/grouped-manifest.json");

  return {
    baseUrl,
    username,
    password,
    apiKey,
    timeoutMs,
    vaultPath,
    manifestPath,
    groupedPath,
  };
}

/**
 * Load and parse the manifest.jsonl file.
 * Each line is a JSON manifest row describing one endpoint.
 * Returns an array of parsed rows, skipping blank lines.
 */
export function loadManifest(filePath: string): Record<string, unknown>[] {
  try {
    const content = readFileSync(filePath, "utf-8");
    return content
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => JSON.parse(line));
  } catch {
    return [];
  }
}
