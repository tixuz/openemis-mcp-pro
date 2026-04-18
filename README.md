# openemis-mcp

A local MCP server that lets Claude, Codex, and other MCP-aware agents talk to an OpenEMIS instance in natural language. Ask *"how many teachers are at Avory Primary?"* — the agent plans the calls, this bridge delivers the data.

This is **v0.1 — getter-only**. Read queries work. Writes (create/update/delete) are deliberately out of scope for the 1-hour MVP and will land later.

## What this gives you

Four MCP tools that stay small on purpose:

| Tool | Purpose |
|---|---|
| `openemis_health` | Ping the configured instance; confirms reachability. |
| `openemis_list_domains` | Lists the curated OpenEMIS domains (Attendance, Assessment, Staff, Student, Institution, Schedule, Examination, Report, …) with a one-line summary each. The agent uses this to figure out where your question lives. |
| `openemis_discover` | Given a topic (e.g. `"attendance"`), returns **only** the resources and endpoints relevant to that topic — up to ~30 rows. This is the mechanism that keeps the agent from drowning in the 4,500-endpoint manifest. |
| `openemis_get` | Unified getter. `{ resource, id?, params? }` — if `id` is given, fetches the singleton; otherwise lists with optional `QueryParams` (`_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, plus any ad-hoc filter key). |

A typical natural-language question like *"how many teachers at Avory Primary, how many vacant positions?"* resolves to 3–4 `openemis_get` calls chained by the agent, each narrowed by `_conditions`. You never see the JSON — you see the answer.

## Install

Requires **Node 22**.

### From GitHub (private repo)

```bash
# Clone (needs read access to the private repo)
git clone https://github.com/tixuz/openemis-mcp.git
cd openemis-mcp

# Build
npm install
npm run build

# Configure credentials
cp .env.example .env
$EDITOR .env   # fill in OPENEMIS_USERNAME / PASSWORD / API_KEY at minimum
```

### Smoke-test after install

```bash
# Verify the login endpoint reaches your OpenEMIS instance
set -a && source .env && set +a
node scripts/smoke-login.mjs
# Expected: "Login successful; cached JWT (… chars)"
```

### Register with Claude Code

```bash
claude mcp add openemis \
  --env OPENEMIS_BASE_URL="https://your-openemis/core" \
  --env OPENEMIS_USERNAME="admin" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/absolute/path/to/vault" \
  -- node "$(pwd)/dist/server.js"

# Verify
claude mcp list | grep openemis
# Expected: openemis: node /…/dist/server.js - ✓ Connected
```

After that, any new Claude Code session in this project automatically sees four tools: `openemis_health`, `openemis_get`, `openemis_list_domains`, `openemis_discover`.

## Configure

Copy `.env.example` to `.env` and fill in:

```env
OPENEMIS_BASE_URL=https://demo.openemis.org/core
OPENEMIS_USERNAME=your-username
OPENEMIS_PASSWORD=your-password
OPENEMIS_API_KEY=your-api-key
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/your/Openemis/claude/vault
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

The server logs in lazily: the first time a tool needs auth, it POSTs to `/api/v5/login` with your three credentials, parses the JWT out of `data.token`, and caches it in memory. On a 401, it re-logs in and retries once.

`OPENEMIS_VAULT_PATH` points at the folder containing `Domain-*.md` notes — the curated per-domain overviews that power `openemis_discover`. These are optional; if missing, discovery degrades to keyword match against the manifest alone.

`OPENEMIS_MANIFEST_PATH` is the output of the companion batch builder in `../mcp-openemis-gen/`. If the file is absent, `openemis_discover` and `openemis_list_domains` still run — they just return a friendly "manifest not built yet" hint.

## Run

```bash
npm start          # stdio MCP server
npm run dev        # same, with tsx for fast iteration
```

### Manual smoke test

```bash
OPENEMIS_USERNAME=... OPENEMIS_PASSWORD=... OPENEMIS_API_KEY=... \
  node scripts/smoke-login.mjs
```

This calls `login()` once and prints a redacted confirmation (token length only).

## Wire into Claude Code

Add to your Claude `mcp.json`:

```json
{
  "mcpServers": {
    "openemis": {
      "command": "node",
      "args": ["/absolute/path/to/openemis-mcp/dist/server.js"],
      "env": {
        "OPENEMIS_BASE_URL": "https://demo.openemis.org/core",
        "OPENEMIS_USERNAME": "...",
        "OPENEMIS_PASSWORD": "...",
        "OPENEMIS_API_KEY": "..."
      }
    }
  }
}
```

## Design principles

1. **Domain-scoped, never firehose.** The manifest is large; the agent's context is not. `openemis_discover(topic)` is the funnel — agents only see the slice they need.
2. **Getter-only for v0.1.** Writes are powerful and risky; we'll add them behind an explicit opt-in flag later.
3. **Stateless between calls.** Only the JWT is cached in memory. No disk persistence, no analytics, nothing phones home.
4. **Thin over the real API.** This bridge doesn't invent new concepts — resource names are kebab-case v5 paths, query params are the native `_conditions`/`_fields` DSL.

## Roadmap

- [ ] Add `--all` to the manifest builder and regenerate against the full vault (~8 h overnight)
- [ ] Optional write tools (`openemis_create`, `openemis_update`, `openemis_delete`) behind `OPENEMIS_ALLOW_WRITES=1`
- [ ] Response-field filtering helpers (so agents can say "just names and IDs" without spelling `_fields=id,name`)
- [ ] Local embedding cache for `openemis_discover` so topic match is semantic, not just substring

## License

MIT
