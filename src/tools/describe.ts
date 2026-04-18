/**
 * Domain-scoped discovery tools using vault Domain files.
 * - openemis_list_domains: List available domains with summaries
 * - openemis_discover: Topic-scoped endpoint discovery
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { loadConfig } from "../config.js";

// Type for MCP tool content block
type ToolContentBlock = { type: "text"; text: string };

/**
 * Manifest row structure
 */
export interface ManifestRow {
  resource: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  kind: "LIST" | "GET" | "CREATE" | "UPDATE" | "DELETE" | "CUSTOM";
  source_file: string;
}

// Cache for domain file metadata
interface DomainMetadata {
  name: string; // e.g., "Attendance"
  description: string; // First paragraph under "What This Domain Does"
  filePath: string;
}

let cachedDomains: DomainMetadata[] | null = null;
let cachedManifestRows: ManifestRow[] | null = null;

const config = loadConfig();

/**
 * Extract domain name from file name (e.g., Domain-Attendance.md → Attendance)
 */
function extractDomainName(fileName: string): string {
  const match = fileName.match(/^Domain-(.+)\.md$/);
  return match ? match[1] : "";
}

/**
 * Load all Domain files from vaultPath and extract metadata.
 */
function loadDomainMetadata(): DomainMetadata[] {
  if (cachedDomains) {
    return cachedDomains;
  }

  const domains: DomainMetadata[] = [];
  try {
    const vaultPath = config.vaultPath;
    const files = readdirSync(vaultPath).filter((f) =>
      f.match(/^Domain-.*\.md$/)
    );

    for (const file of files) {
      const filePath = join(vaultPath, file);
      const content = readFileSync(filePath, "utf-8");
      const name = extractDomainName(file);

      // Extract first paragraph under "## What This Domain Does"
      const match = content.match(
        /##\s+What\s+This\s+Domain\s+Does\n(.+?)(?:\n\n|\n---|\n##)/s
      );
      const description = match
        ? match[1]
            .trim()
            .replace(/\n/g, " ")
            .slice(0, 200) // Cap at 200 chars
        : "";

      if (name) {
        domains.push({ name, description, filePath });
      }
    }

    cachedDomains = domains.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return cachedDomains;
  } catch (err) {
    console.error(
      "[openemis-mcp] Failed to load domain metadata:",
      err instanceof Error ? err.message : err
    );
    return [];
  }
}

/**
 * Load and cache manifest.jsonl
 */
function loadManifestRows(): ManifestRow[] {
  if (cachedManifestRows) {
    return cachedManifestRows;
  }

  const rows: ManifestRow[] = [];
  try {
    const content = readFileSync(config.manifestPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed) {
        try {
          rows.push(JSON.parse(trimmed) as ManifestRow);
        } catch {
          // Skip malformed lines
        }
      }
    }
    cachedManifestRows = rows;
    return rows;
  } catch {
    return [];
  }
}

/**
 * Extract table names from domain file (backtick-wrapped identifiers)
 */
function extractTableNames(domainContent: string): string[] {
  const matches = domainContent.match(/`([a-z_][a-z0-9_]*)`/g) || [];
  const tables = new Set<string>();
  for (const match of matches) {
    tables.add(match.slice(1, -1)); // Remove backticks
  }
  return Array.from(tables);
}

/**
 * Convert snake_case table name to kebab-case resource hint
 * e.g., institution_students → institution-students
 */
function tableToResourceHint(tableName: string): string {
  return tableName.replace(/_/g, "-");
}

/**
 * Tool 1: openemis_list_domains
 */
export const openemisListDomainsSpec = {
  name: "openemis_list_domains",
  description:
    "List all available domains with one-line descriptions. Helps identify which domain relates to your task.",
};

export const openemisListDomainsInputSchema = z.object({});

export async function openemisListDomainsHandler(): Promise<ToolContentBlock[]> {
  try {
    const domains = loadDomainMetadata();
    if (domains.length === 0) {
      return [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "No domain files found in vault",
              vaultPath: config.vaultPath,
            },
            null,
            2
          ),
        },
      ];
    }

    const result = {
      domains: domains.map((d) => ({
        name: d.name,
        description: d.description,
      })),
      total: domains.length,
    };

    return [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    return [
      {
        type: "text",
        text: JSON.stringify(
          {
            error: "Failed to list domains",
            details: message,
          },
          null,
          2
        ),
      },
    ];
  }
}

/**
 * Tool 2: openemis_discover
 */
export const openemisDiscoverSpec = {
  name: "openemis_discover",
  description:
    "Discover endpoints related to a specific topic. Searches domain files for table names and filters manifest endpoints. Returns up to 30 related endpoints.",
};

export const openemisDiscoverInputSchema = z.object({
  topic: z
    .string()
    .describe("Topic keyword (e.g., 'attendance', 'student', 'assessment')"),
});

export async function openemisDiscoverHandler(args: {
  topic: string;
}): Promise<ToolContentBlock[]> {
  try {
    const topic = args.topic.toLowerCase();
    const domains = loadDomainMetadata();

    // Find best-matching domain
    let bestDomain: DomainMetadata | null = null;
    for (const domain of domains) {
      const nameLower = domain.name.toLowerCase();
      if (
        nameLower === topic ||
        nameLower.includes(topic) ||
        topic.includes(nameLower)
      ) {
        bestDomain = domain;
        break;
      }
    }

    if (!bestDomain) {
      // Substring match on description
      for (const domain of domains) {
        if (domain.description.toLowerCase().includes(topic)) {
          bestDomain = domain;
          break;
        }
      }
    }

    if (!bestDomain) {
      return [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "No matching domain found",
              topic,
              available_domains: domains.map((d) => d.name),
            },
            null,
            2
          ),
        },
      ];
    }

    // Extract table names from domain file
    const domainContent = readFileSync(bestDomain.filePath, "utf-8");
    const tableNames = extractTableNames(domainContent);

    // Filter manifest endpoints by table name fragments
    const manifestRows = loadManifestRows();
    const resourceHints = new Set(
      tableNames.map((t) => tableToResourceHint(t))
    );

    const relatedEndpoints = manifestRows
      .filter((row) => {
        const resourceLower = row.resource.toLowerCase();
        for (const hint of resourceHints) {
          if (
            resourceLower.includes(hint.replace(/-/g, "")) ||
            resourceLower === hint.replace(/-/g, "")
          ) {
            return true;
          }
        }
        return false;
      })
      .slice(0, 30); // Cap at 30

    const result = {
      domain: bestDomain.name,
      summary: bestDomain.description,
      related_endpoints: relatedEndpoints,
      tables_extracted: tableNames,
      advice:
        "To act on this topic, call openemis_get with one of the resource names above (in kebab-case).",
    };

    return [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);
    return [
      {
        type: "text",
        text: JSON.stringify(
          {
            error: "Discovery failed",
            details: message,
            topic: args.topic,
          },
          null,
          2
        ),
      },
    ];
  }
}

