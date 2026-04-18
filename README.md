# openemis-mcp

**A natural-language bridge between MCP-aware agents (Claude, Codex, Cursor, etc.) and any OpenEMIS instance.**

Built on top of the published **OpenEMIS Core API** (reference docs at [api.openemis.org/core](https://api.openemis.org/core)) and **verified end-to-end against the public demo at [demo.openemis.org/core](https://demo.openemis.org/core)** with real credentials, real data, real round-trips.

Ask in English:

> *"How many current students are at Avory Primary?"*

The agent plans the calls, this MCP delivers the data, and you get the answer:

> *"Avory Primary School (code P1002) has 553 currently enrolled students."*

You never write a line of code. You never see JSON. You just ask.

> **Status:** v0.1 — **getter-only** MVP. Read queries work against every OpenEMIS v5 resource. Write tools (create/update/delete) are deliberately out of scope for the first release and will land behind an explicit opt-in flag.

---

## Why this exists

The OpenEMIS Core REST API is large — the v5 surface alone exposes around **1,350 endpoints across ~670 resources**. No AI agent can hold that in context, and raw Swagger-style introspection floods a conversation with noise that has nothing to do with the user's actual question.

This MCP solves that in two ways:

1. **Domain-scoped discovery.** Instead of dumping the whole API into the agent's context, the `openemis_discover(topic)` tool narrows to the ~20–30 endpoints relevant to what the user is actually asking about ("attendance", "students", "assessment") — powered by a small curated knowledge pack of `Domain-*.md` notes.
2. **A single, composable getter.** One `openemis_get` tool covers list + singleton + filtered search across every resource. The agent supplies `resource` + optional `id` + optional `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`) and the rest of the OpenEMIS CakePHP-style query DSL maps straight through.

The net effect: agents answer natural-language questions in 2–4 tool calls, not 30.

---

## The four tools

| Tool | What it does |
|---|---|
| `openemis_health` | Pings the configured instance and reports reachability. Safe to call anytime. |
| `openemis_list_domains` | Lists the curated OpenEMIS domains — Attendance, Assessment, Staff, Student, Institution, Schedule, Examination, Report — each with a one-line summary. The agent uses this to figure out *where* a question lives. |
| `openemis_discover` | Input: a topic string. Output: up to 30 endpoints relevant to that topic, drawn from the domain knowledge pack and the per-instance manifest. Keeps conversations small regardless of how large the underlying API is. |
| `openemis_get` | Unified read tool. `{ resource, id?, params? }` — if `id` is present, fetches the singleton; otherwise lists with any combination of `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, plus any ad-hoc filter key. |

A representative natural-language question like *"how many teachers at Avory Primary, how many vacant positions?"* resolves to three `openemis_get` calls — chained by the agent, narrowed by `_conditions`, delivered back as a single English answer.

---

## Verified against demo.openemis.org

Every claim in this README was proven against the public demo instance before being written:

- `POST /api/v5/login` with `{ username, password, api_key }` → JWT cached, 331 chars
- `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 institutions incl. `"Avory Primary School" (id=6, code P1002)`
- `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → pagination reports `last_page: 553` → **553 currently enrolled students**
- `GET /api/v5/academic-periods` → 7 pages of real academic-year data
- `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE`, etc.

The sample `scripts/smoke-login.mjs` shipped with this repo performs the login test step-by-step so you can confirm reachability against your own instance before wiring it into Claude Code.

---

## Install

Requires **Node 22** (or later, for built-in `fetch` and `AbortController`).

### From GitHub

```bash
git clone https://github.com/tixuz/openemis-mcp.git
cd openemis-mcp

npm install
npm run build

cp .env.example .env
$EDITOR .env
```

### Configure

`.env.example` documents every variable. At minimum you need the three credentials your OpenEMIS admin issues:

```env
OPENEMIS_BASE_URL=https://demo.openemis.org/core   # or your own instance
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

# Optional
OPENEMIS_TIMEOUT_MS=30000
OPENEMIS_VAULT_PATH=/absolute/path/to/domain-notes
OPENEMIS_MANIFEST_PATH=/absolute/path/to/manifest.jsonl
```

The server logs in lazily on the first authenticated tool call, POSTing to `/api/v5/login`, parsing the JWT out of `data.token`, and caching it in memory. On a 401 it re-logs in and retries once.

`OPENEMIS_VAULT_PATH` points at the folder containing the curated `Domain-*.md` notes used by `openemis_discover`. If missing, discovery degrades gracefully to keyword matching against the manifest alone.

`OPENEMIS_MANIFEST_PATH` points at the JSONL output of the companion builder in `../mcp-openemis-gen/`. If absent, the discovery tools return a friendly "manifest not built yet" hint — they don't crash.

### Smoke-test reachability

```bash
set -a && source .env && set +a
node scripts/smoke-login.mjs
```

Expected:

```
[Test] Loading config...
[OK] Config loaded: baseUrl=https://demo.openemis.org/core
[Test] Creating client...
[OK] Client created
[Test] Attempting login...
[OpenEMIS] Login successful; cached JWT (331 chars)
[OK] Login successful
```

### Register with Claude Code

```bash
claude mcp add openemis \
  --env OPENEMIS_BASE_URL="https://your-openemis/core" \
  --env OPENEMIS_USERNAME="…" \
  --env OPENEMIS_PASSWORD="…" \
  --env OPENEMIS_API_KEY="…" \
  --env OPENEMIS_VAULT_PATH="/absolute/path/to/vault" \
  -- node "$(pwd)/dist/server.js"

# Verify
claude mcp list | grep openemis
# Expected: openemis: node /…/dist/server.js - ✓ Connected
```

Any new Claude Code session in this project will see all four tools automatically.

---

## Architecture

```
┌────────────────────────┐
│  Agent (Claude / …)    │     "How many current students at Avory?"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← four typed tools, ZodRawShape schemas
│  • openemis_health     │
│  • openemis_list_dom…  │  ← reads Domain-*.md from vault
│  • openemis_discover   │  ← topic → ≤30 scoped endpoints
│  • openemis_get        │  ← unified list / singleton / filter
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (cached, auto-refresh on 401)
┌───────────▼────────────┐
│  OpenEMIS Core API     │  api.openemis.org/core  (reference)
│  /api/v5/{resource}    │  demo.openemis.org/core (tested)
└────────────────────────┘
```

Design principles, from the first line of code:

1. **Domain-scoped, never firehose.** The manifest can grow to thousands of endpoints; the agent's context is not going to. `openemis_discover(topic)` is the funnel — every conversation only ever sees the slice it needs.
2. **Getter-only for v0.1.** Writes are powerful and risky. We'll add them behind an explicit `OPENEMIS_ALLOW_WRITES=1` flag so nobody mutates a production instance by accident.
3. **Stateless between calls.** Only the JWT is cached in memory. No disk persistence, no analytics, nothing phones home.
4. **Thin over the real API.** This bridge doesn't invent new concepts — `resource` names are kebab-case v5 paths, query params are the native `_conditions` / `_fields` DSL. What you'd write in curl translates 1:1.

---

## Roadmap

- [ ] Full-vault manifest (`build_manifest.py --all`) so `openemis_discover` covers every v5 resource rather than the initial 50-endpoint sample
- [ ] Optional write tools (`openemis_create`, `openemis_update`, `openemis_delete`) behind `OPENEMIS_ALLOW_WRITES=1`
- [ ] Response-field filtering helpers (agents say *"just names and ids"* instead of spelling out `_fields=id,name`)
- [ ] Local embedding cache (via `text-embedding-nomic-embed-text-v1.5` on LM Studio) for semantic topic matching in `openemis_discover`
- [ ] Example `codex.mcp.json` so the same bridge works from Codex-side too
- [ ] Published `claude.mcp.json` template

## License

MIT

---

*Not affiliated with OpenEMIS or its maintainers. This is a third-party bridge that speaks the public Core API. Credentials and data stay on your machine.*
