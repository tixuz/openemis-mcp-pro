import { readFileSync } from "fs";
import { resolve } from "path";

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

  /** Path to vault directory for storing cached data (default /Users/khindol/Documents/Vaults/Openemis/claude) */
  vaultPath: string;

  /** Path to manifest.jsonl describing available endpoints (default /Users/khindol/webstore/utils/mcp-openemis-gen/manifest.jsonl) */
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

  const vaultPath =
    process.env.OPENEMIS_VAULT_PATH ??
    resolve("/Users/khindol/Documents/Vaults/Openemis/claude");

  const manifestPath =
    process.env.OPENEMIS_MANIFEST_PATH ??
    resolve("/Users/khindol/webstore/utils/mcp-openemis-gen/manifest.jsonl");

  const groupedPath =
    process.env.OPENEMIS_GROUPED_PATH ??
    resolve(process.cwd(), "data/grouped-manifest.json");

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
