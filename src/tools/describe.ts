/**
 * Domain-scoped discovery tools using grouped-manifest.json.
 * - openemis_list_domains: List available domains with summaries
 * - openemis_discover: Topic-scoped discovery across domains, families, and playbooks
 * - openemis_list_playbooks: List all available playbooks
 * - openemis_get_playbook: Get full playbook details by id
 */

import { readFileSync, statSync } from "fs";
import { z } from "zod";
import { loadConfig } from "../config.js";

// Type for MCP tool content block
type ToolContentBlock = { type: "text"; text: string };

/**
 * Grouped manifest structure
 */
export interface GroupedManifest {
  version: number;
  total_endpoints: number;
  total_resources: number;
  domains: Domain[];
  families: Family[];
  orphans: Orphan[];
  playbooks: Playbook[];
  summary: SummaryStats;
}

interface Domain {
  name: string;
  summary: string;
  resources: Resource[];
  endpoint_count: number;
}

interface Family {
  prefix: string;
  resources: Resource[];
  endpoint_count: number;
}

interface Resource {
  name: string;
  endpoints: number;
  kinds: Record<string, number>;
}

interface Orphan {
  name: string;
  endpoints: number;
  kinds: Record<string, number>;
}

interface Playbook {
  id: string;
  title: string;
  audience: string[];
  domain: string;
  description: string;
  resources: string[];
  steps: string[];
  coverage: {
    present: string[];
    missing: string[];
    pct: number;
  };
}

interface SummaryStats {
  domain_endpoint_total: number;
  family_endpoint_total: number;
  orphan_endpoint_total: number;
  playbook_count: number;
}

// Cache for grouped manifest with mtime tracking
interface CacheEntry {
  data: GroupedManifest;
  mtime: number;
}

let cachedGrouped: CacheEntry | null = null;
const config = loadConfig();

/**
 * Load grouped manifest once and re-read only if file mtime changes.
 */
function loadGroupedManifest(): GroupedManifest | null {
  try {
    const stat = statSync(config.groupedPath);
    const mtime = stat.mtimeMs;

    // Return cached data if mtime hasn't changed
    if (cachedGrouped && cachedGrouped.mtime === mtime) {
      return cachedGrouped.data;
    }

    // Re-read if mtime changed or not cached
    const content = readFileSync(config.groupedPath, "utf-8");
    const data = JSON.parse(content) as GroupedManifest;

    cachedGrouped = { data, mtime };
    return data;
  } catch (err) {
    console.error(
      "[openemis-mcp] Failed to load grouped manifest:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

/**
 * Tool 1: openemis_list_domains
 * Returns compact domain index with stats and hints.
 */
export const openemisListDomainsSpec = {
  name: "openemis_list_domains",
  description:
    "List all available domains with summaries, endpoint counts, and a hint to explore via openemis_discover.",
};

export const openemisListDomainsInputSchema = z.object({});

export async function openemisListDomainsHandler(): Promise<ToolContentBlock[]> {
  try {
    const grouped = loadGroupedManifest();
    if (!grouped) {
      return [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "Failed to load grouped manifest",
              path: config.groupedPath,
            },
            null,
            2
          ),
        },
      ];
    }

    const result = {
      domains: grouped.domains.map((d) => ({
        name: d.name,
        summary: d.summary,
        resources_count: d.resources.length,
        endpoint_count: d.endpoint_count,
      })),
      families_count: grouped.families.length,
      orphans_count: grouped.orphans.length,
      playbook_count: grouped.playbooks.length,
      hint: "Call openemis_discover('<topic>') to scope into a domain, family, or playbook.",
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
 * Match topic against domains, families, and playbooks.
 * Prefer playbooks > domains > families.
 */
export const openemisDiscoverSpec = {
  name: "openemis_discover",
  description:
    "Discover endpoints and playbooks related to a topic. Searches domains, families, and playbooks by name, summary, and description.",
};

export const openemisDiscoverInputSchema = z.object({
  topic: z
    .string()
    .describe("Topic keyword (e.g., 'attendance', 'assessment', 'playbook-id')"),
});

export async function openemisDiscoverHandler(args: {
  topic: string;
}): Promise<ToolContentBlock[]> {
  try {
    const grouped = loadGroupedManifest();
    if (!grouped) {
      return [
        {
          type: "text",
          text: JSON.stringify(
            { error: "Failed to load grouped manifest" },
            null,
            2
          ),
        },
      ];
    }

    const topic = args.topic.toLowerCase();
    const domainMatches: Array<{
      name: string;
      summary: string;
      resources: Resource[];
    }> = [];
    const familyMatches: Array<{ prefix: string; resources: Resource[] }> = [];
    const playbookMatches: Playbook[] = [];

    // Match against domains
    for (const domain of grouped.domains) {
      if (
        domain.name.toLowerCase().includes(topic) ||
        domain.summary.toLowerCase().includes(topic)
      ) {
        domainMatches.push({
          name: domain.name,
          summary: domain.summary,
          resources: domain.resources.slice(0, 30),
        });
      }
    }

    // Match against families
    for (const family of grouped.families) {
      if (family.prefix.toLowerCase().includes(topic)) {
        familyMatches.push({
          prefix: family.prefix,
          resources: family.resources.slice(0, 30),
        });
      }
    }

    // Match against playbooks
    for (const playbook of grouped.playbooks) {
      if (
        playbook.id.toLowerCase().includes(topic) ||
        playbook.title.toLowerCase().includes(topic) ||
        playbook.description.toLowerCase().includes(topic) ||
        playbook.resources.some((r) => r.toLowerCase().includes(topic))
      ) {
        playbookMatches.push(playbook);
      }
    }

    const result = {
      topic,
      domain_matches: domainMatches,
      family_matches: familyMatches,
      playbook_matches: playbookMatches,
      advice:
        playbookMatches.length > 0
          ? "Use openemis_get_playbook to get the full recipe, or call openemis_get with any listed resource."
          : "Call openemis_get with a listed resource name, or try openemis_list_domains to explore all domains.",
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

/**
 * Tool 3: openemis_list_playbooks
 * Returns compact list of all playbooks.
 */
export const openemisListPlaybooksSpec = {
  name: "openemis_list_playbooks",
  description:
    "List all available playbooks with their id, title, audience, and domain.",
};

export const openemisListPlaybooksInputSchema = z.object({});

export async function openemisListPlaybooksHandler(): Promise<
  ToolContentBlock[]
> {
  try {
    const grouped = loadGroupedManifest();
    if (!grouped) {
      return [
        {
          type: "text",
          text: JSON.stringify(
            { error: "Failed to load grouped manifest" },
            null,
            2
          ),
        },
      ];
    }

    const result = {
      playbooks: grouped.playbooks.map((p) => ({
        id: p.id,
        title: p.title,
        audience: p.audience,
        domain: p.domain,
        coverage_pct: p.coverage.pct,
      })),
      total: grouped.playbooks.length,
      hint: "Call openemis_discover('<playbook id or topic>') to get the full steps.",
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
            error: "Failed to list playbooks",
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
 * Tool 4: openemis_get_playbook
 * Returns full playbook by id.
 */
export const openemisGetPlaybookSpec = {
  name: "openemis_get_playbook",
  description:
    "Get the full playbook details including steps and coverage by playbook id.",
};

export const openemisGetPlaybookInputSchema = z.object({
  id: z.string().describe("Playbook id (e.g., 'mark-student-attendance')"),
});

export async function openemisGetPlaybookHandler(args: {
  id: string;
}): Promise<ToolContentBlock[]> {
  try {
    const grouped = loadGroupedManifest();
    if (!grouped) {
      return [
        {
          type: "text",
          text: JSON.stringify(
            { error: "Failed to load grouped manifest" },
            null,
            2
          ),
        },
      ];
    }

    const playbook = grouped.playbooks.find((p) => p.id === args.id);
    if (!playbook) {
      return [
        {
          type: "text",
          text: JSON.stringify(
            {
              error: "Playbook not found",
              requested_id: args.id,
              available: grouped.playbooks.map((p) => p.id),
            },
            null,
            2
          ),
        },
      ];
    }

    return [
      {
        type: "text",
        text: JSON.stringify(playbook, null, 2),
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
            error: "Failed to get playbook",
            details: message,
            id: args.id,
          },
          null,
          2
        ),
      },
    ];
  }
}
