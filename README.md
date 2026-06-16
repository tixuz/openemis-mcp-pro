---
title: openemis-mcp-pro — Read + Write MCP Server for OpenEMIS School Management
description: openemis-mcp-pro is the read and write MCP server that bridges AI assistants to the OpenEMIS school management information system — 678 resources, 3361 endpoints, 40 playbooks.
keywords:
  - OpenEMIS
  - school management system
  - education management
  - student attendance
  - student risks
  - MCP server
  - write tools
---

<p align="center">
  <img src="assets/logo.png" alt="openemis-mcp-pro logo — read and write AI bridge for OpenEMIS school management" width="320">
</p>

# openemis-mcp-pro — Read + Write AI Bridge for OpenEMIS School Management

**A natural-language bridge between MCP-aware agents (Claude, Codex, Cursor, etc.) and any OpenEMIS school — with full read + write access.**

[**OpenEMIS**](https://www.openemis.org) is a free, open-source **school management information system** developed by UNESCO and KORDIT. It runs the day-to-day administration of every kind of educational institution — kindergartens, primary schools, secondary schools, secondary vocational institutions, technical colleges, and universities — managing students, staff, attendance, assessment, infrastructure, meals, scholarships, examinations, training, and ministry-level reporting. This MCP-pro server adds full read + write access plus per-user authentication on top of any OpenEMIS school.

**Translations:** [Русский](docs/translations/README.ru.md) · [Español](docs/translations/README.es.md) · [हिन्दी](docs/translations/README.hi.md) · [العربية](docs/translations/README.ar.md)

Built on top of the published **OpenEMIS Core API** (reference docs at [api.openemis.org/core](https://api.openemis.org/core)) and **verified end-to-end against the public demo at [demo.openemis.org/core](https://demo.openemis.org/core)** with real credentials, real data, real round-trips.

Ask in English:

> *"How many current students are at Avory Primary?"*

The agent plans the calls, this MCP delivers the data, and you get the answer:

> *"Avory Primary School (code P1002) has 553 currently enrolled students."*

You never write a line of code. You never see JSON. You just ask.

> **Status:** v1.0.0 — **full CRUD** for non-workflow resources. Read queries work against every OpenEMIS v5 resource. Write tools (create/update/delete) are live for all resources that do not flow through the CakePHP Workflow plugin. Workflow-controlled resources (attendance, staff leave) are blocked at the tool level and redirect to the appropriate playbook.

---

## What this is

openemis-mcp-pro is the read + write MCP server that connects AI assistants to the OpenEMIS school management system. It exposes 678 resources (students, attendance, risks, staff, exams, infrastructure) across 40 curated playbooks — 26 read and 14 write/auth. The pro distribution adds direct write tools (`openemis_create`, `openemis_update`, `openemis_delete`), HTTP server mode for ChatGPT Custom GPT, and per-user authentication on top of the free read-only distribution.

---

## Why this exists

The OpenEMIS Core REST API is large — the v5 surface alone exposes **3,361 endpoints across 678 resources** (Core 5.13.0). No AI agent can hold that in context, and raw Swagger-style introspection floods a conversation with noise that has nothing to do with the user's actual question.

This MCP solves that in two ways:

1. **Domain-scoped discovery.** Instead of dumping the whole API into the agent's context, the `openemis_discover(topic)` tool narrows to the ~20–30 endpoints relevant to what the user is actually asking about ("attendance", "students", "assessment") — powered by a small curated knowledge pack of `Domain-*.md` notes.
2. **A single, composable getter.** One `openemis_get` tool covers list + singleton + filtered search across every resource. The agent supplies `resource` + optional `id` + optional `params` (`_fields`, `_conditions`, `orderby`, `page`, `limit`) and the rest of the OpenEMIS CakePHP-style query DSL maps straight through.

The net effect: agents answer natural-language questions in 2–4 tool calls, not 30.

---

## Tools

| Tool | Since | What it does |
|---|---|---|
| `openemis_health` | v0.1 | Pings the configured instance and reports reachability. Performs a real login round-trip — if this passes, CRUD will work. |
| `openemis_list_domains` | v0.1 | Lists the curated OpenEMIS domains — Attendance, Assessment, Staff, Student, Institution, Schedule, Examination, Report — each with a one-line summary. The agent uses this to figure out *where* a question lives. |
| `openemis_discover` | v0.1 | Input: a topic string. Output: up to 30 endpoints relevant to that topic, drawn from the domain knowledge pack and the per-instance manifest. Keeps conversations small regardless of how large the underlying API is. |
| `openemis_list_playbooks` | v0.2 | Lists all 40 curated workflow playbooks with id, title, domain, and audience. The agent uses this to find the right step-by-step guide for a user-level task. |
| `openemis_get_playbook` | v0.2 | Input: a playbook id. Output: the full playbook — resources, ordered steps, guidance notes, and example queries. |
| `openemis_get` | v0.1 | Unified read tool. `{ resource, id?, params? }` — if `id` is present, fetches the singleton; otherwise lists with any combination of `_fields`, `_conditions`, `orderby`, `order`, `page`, `limit`, plus any ad-hoc filter key. |
| `openemis_create` | v0.3.0 | Create a new record. `{ resource, body }` — non-workflow resources only. Workflow-controlled resources (e.g. institution-staff-leave) are blocked and will redirect to the appropriate playbook. |
| `openemis_update` | v0.3.0 | Update an existing record by id. `{ resource, id, body }` — non-workflow resources only. |
| `openemis_delete` | v0.3.0 | Delete a record by id. `{ resource, id }` — non-workflow resources only. |

A representative natural-language question like *"how many teachers at Avory Primary, how many vacant positions?"* resolves to three `openemis_get` calls — chained by the agent, narrowed by `_conditions`, delivered back as a single English answer. A write request like *"enrol a new student"* uses `openemis_get_playbook` to load the step-by-step guide, then `openemis_create` for each write step.

---

## Core compatibility

Tested against **OpenEMIS Core 5.13.0** (master, June 2026). Earlier 5.7 – 5.12 deployments are also supported — the API surface is backwards-compatible.

### Capability flag — POCOR-9660 multi-id GET

`openemis_get` accepts `params.ids = "1,2,3"` for batch lookups. Core 5.10+ carries POCOR-9660 (`?id=1,2,3` and `_conditions=<field>:IN(...)` support in `CrudApiController`), so the handler collapses the batch into a single round-trip **by default**. Pointing at an older Core (5.7 – 5.9) without the native operator? Force the legacy parallel fan-out:

```bash
OPENEMIS_CORE_IN_OPERATOR=off
```

For composite-PK or view resources — where `ids` does not apply — use `_conditions=<field>:IN(1,2,3)` instead; it filters any field by a value list and works regardless of this flag. Filtering on a field that does not exist on a resource now returns HTTP 400 (Core 5.10+, POCOR-9697), so use exact field names.

## Verified against demo.openemis.org

Every claim in this README was proven against the public demo instance before being written:

- `POST /api/v5/login` with `{ username, password, api_key }` → JWT cached, 331 chars
- `GET /api/v5/institutions?limit=200&_fields=id,name,code` → 24 institutions incl. `"Avory Primary School" (id=6, code P1002)`
- `GET /api/v5/institution-students?institution_id=6&student_status_id=1&limit=1` → pagination reports `last_page: 553` → **553 currently enrolled students**
- `GET /api/v5/academic-periods` → 7 pages of real academic-year data
- `GET /api/v5/absence-types` → `EXCUSED`, `UNEXCUSED`, `LATE`, etc.

The sample `scripts/smoke-login.mjs` shipped with this repo performs the login test step-by-step so you can confirm reachability against your own instance before wiring it into Claude Code.

---

## Compatible agents

openemis-mcp speaks the **Model Context Protocol** over stdio — any MCP-compatible client works:

**Stdio mode (local machine)** — connects as a subprocess:

| Agent | How to connect |
|---|---|
| **Claude Code** (`claude` CLI) | `claude mcp add` — primary tested client, all 9 tools available |
| **Cursor** | Add to `.cursor/mcp.json` — full tool access |
| **Cline / Continue** (VS Code) | Add server in MCP settings |
| **Codex** | Via [gemmy-and-qwenny](https://github.com/tixuz/gemmy-and-qwenny) bridge |
| **Any MCP client** | Point at `node dist/server.js` with env vars set |

**HTTP server mode** (`OPENEMIS_TRANSPORT=http`, install once on Oracle/VPS) — connects by URL:

| Client | How to connect |
|---|---|
| **Claude Code** (remote) | `claude mcp add --transport http --url http://your-server:3000/mcp --header "Authorization: Bearer <token>"` |
| **Cursor / Cline** | Add remote MCP URL in settings |
| **ChatGPT** (Custom GPT) | Import schema from `http://your-server:3000/openapi.json` → Actions → Bearer token |
| **Any HTTP client** | REST API at `/api/*` — see [Teacher Guide](docs/CHATGPT-TEACHER-GUIDE.md) |

---

## Install

Requires **Node 22+** (for built-in `fetch` and `AbortController`) and **Python 3.10+** (for the manifest builder and playbook generator scripts in `mcp-openemis-gen/`). The MCP server itself is Node-only; Python is only needed if you rebuild the manifest from source.

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

Any new Claude Code session in this project will see all nine tools automatically.

---

### Server mode (Oracle Always Free / any VPS)

Set `OPENEMIS_TRANSPORT=http` to run as a persistent HTTP server instead of a local subprocess. Install once on your server; every MCP-compatible client (Claude Code, Cursor, Cline, Windsurf) connects by URL.

**On your server:**

```bash
git clone https://github.com/tixuz/openemis-mcp-pro.git
cd openemis-mcp-pro
npm install && npm run build
cp .env.example .env
$EDITOR .env          # set credentials + OPENEMIS_TRANSPORT=http + OPENEMIS_AUTH_TOKEN
node dist/server.js
```

**.env for server mode:**

```env
OPENEMIS_BASE_URL=https://your-openemis/core
OPENEMIS_USERNAME=admin
OPENEMIS_PASSWORD=your_password
OPENEMIS_API_KEY=your_api_key

OPENEMIS_TRANSPORT=http
OPENEMIS_PORT=3000

# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
OPENEMIS_AUTH_TOKEN=your-secret-token-here
```

**Connect from Claude Code (remote):**

```bash
claude mcp add openemis-remote \
  --transport http \
  --url "http://your-server:3000/mcp" \
  --header "Authorization: Bearer your-secret-token-here"
```

**Health probe** (monitoring / uptime checks):

```bash
curl http://your-server:3000/health
# {"ok":true,"transport":"http","baseUrl":"https://your-openemis/core"}
```

> ⚠️ **Always set `OPENEMIS_AUTH_TOKEN`** before exposing the port publicly. Without it the endpoint is open to anyone who can reach your IP.

---

## Architecture

```
┌────────────────────────┐
│  Agent (Claude / …)    │     "How many current students at Avory?"
└───────────┬────────────┘
            │ MCP stdio (JSON-RPC)
┌───────────▼────────────┐
│  openemis-mcp          │  ← nine typed tools, ZodRawShape schemas
│  • openemis_health     │
│  • openemis_list_dom…  │  ← reads Domain-*.md from vault
│  • openemis_discover   │  ← topic → ≤30 scoped endpoints
│  • openemis_list_play… │  ← list all 40 workflow playbooks
│  • openemis_get_playbk │  ← load a playbook by id
│  • openemis_get / _create / _update / _delete   │
└───────────┬────────────┘
            │ HTTPS + Bearer JWT (cached, auto-refresh on 401)
┌───────────▼────────────┐
│  OpenEMIS Core API     │  api.openemis.org/core  (reference)
│  /api/v5/{resource}    │  demo.openemis.org/core (tested)
└────────────────────────┘
```

Design principles, from the first line of code:

1. **Domain-scoped, never firehose.** The manifest can grow to thousands of endpoints; the agent's context is not going to. `openemis_discover(topic)` is the funnel — every conversation only ever sees the slice it needs.
2. **Write tools in v0.3.0.** `openemis_create` / `openemis_update` / `openemis_delete` are live for all non-workflow resources. Workflow-controlled resources (attendance, staff-attendance) are blocked at the tool level and redirect to the appropriate playbook.
3. **Stateless between calls.** Only the JWT is cached in memory. No disk persistence, no analytics, nothing phones home.
4. **Thin over the real API.** This bridge doesn't invent new concepts — `resource` names are kebab-case v5 paths, query params are the native `_conditions` / `_fields` DSL. What you'd write in curl translates 1:1.

---

## Documentation

- [Resource Reference](docs/resources.md) — all 678 resources with HTTP method availability and write status (Core 5.13.0)
- [Playbooks](docs/playbooks/) — 40 curated workflow guides (26 read · 14 write/auth)
- [ChatGPT Teacher Guide](docs/CHATGPT-TEACHER-GUIDE.md) — how to let teachers mark attendance via ChatGPT Custom GPT
- [Playbook Authoring Routine](docs/PLAYBOOK-ROUTINE.md) — 4-step process for adding new playbooks
- [Glossary](docs/GLOSSARY.md) — definitions of key OpenEMIS and education management terms
- [FAQ](docs/FAQ.md) — frequently asked questions about OpenEMIS and this MCP server

### Playbooks

| # | Playbook | Domain | Audience | Translations |
|---|---|---|---|---|
| 1 | [Count Vacant Positions](docs/playbooks/count-vacant-positions.md) | Staff | admin, hr | [RU](docs/playbooks/count-vacant-positions.ru.md) · [ES](docs/playbooks/count-vacant-positions.es.md) · [HI](docs/playbooks/count-vacant-positions.hi.md) · [AR](docs/playbooks/count-vacant-positions.ar.md) |
| 2 | [Mark Student Attendance](docs/playbooks/mark-student-attendance.md) | Attendance | teacher, admin | [RU](docs/playbooks/mark-student-attendance.ru.md) · [ES](docs/playbooks/mark-student-attendance.es.md) · [HI](docs/playbooks/mark-student-attendance.hi.md) · [AR](docs/playbooks/mark-student-attendance.ar.md) |
| 3 | [Mark Staff Attendance](docs/playbooks/mark-staff-attendance.md) | Staff | admin, hr, teacher | [RU](docs/playbooks/mark-staff-attendance.ru.md) · [ES](docs/playbooks/mark-staff-attendance.es.md) · [HI](docs/playbooks/mark-staff-attendance.hi.md) · [AR](docs/playbooks/mark-staff-attendance.ar.md) |
| 4 | [View Student Timetable](docs/playbooks/view-student-timetable.md) | Schedule | parent, student | [RU](docs/playbooks/view-student-timetable.ru.md) · [ES](docs/playbooks/view-student-timetable.es.md) · [HI](docs/playbooks/view-student-timetable.hi.md) · [AR](docs/playbooks/view-student-timetable.ar.md) |
| 5 | [Student Dashboard](docs/playbooks/student-dashboard.md) | Student | parent, student | [RU](docs/playbooks/student-dashboard.ru.md) · [ES](docs/playbooks/student-dashboard.es.md) · [HI](docs/playbooks/student-dashboard.hi.md) · [AR](docs/playbooks/student-dashboard.ar.md) |
| 6 | [Generate Student Report Card PDF](docs/playbooks/generate-student-report-card-pdf.md) | Report | teacher, admin | [RU](docs/playbooks/generate-student-report-card-pdf.ru.md) · [ES](docs/playbooks/generate-student-report-card-pdf.es.md) · [HI](docs/playbooks/generate-student-report-card-pdf.hi.md) · [AR](docs/playbooks/generate-student-report-card-pdf.ar.md) |
| 7 | [Enrol a New Student](docs/playbooks/enroll-new-student.md) | Student | admin, registrar | [RU](docs/playbooks/enroll-new-student.ru.md) · [ES](docs/playbooks/enroll-new-student.es.md) · [HI](docs/playbooks/enroll-new-student.hi.md) · [AR](docs/playbooks/enroll-new-student.ar.md) |
| 8 | [Record a Behaviour Incident](docs/playbooks/record-behavior-incident.md) | Student | teacher, admin | [RU](docs/playbooks/record-behavior-incident.ru.md) · [ES](docs/playbooks/record-behavior-incident.es.md) · [HI](docs/playbooks/record-behavior-incident.hi.md) · [AR](docs/playbooks/record-behavior-incident.ar.md) |
| 9 | [Submit Exam Marks](docs/playbooks/submit-exam-marks.md) | Assessment | teacher | [RU](docs/playbooks/submit-exam-marks.ru.md) · [ES](docs/playbooks/submit-exam-marks.es.md) · [HI](docs/playbooks/submit-exam-marks.hi.md) · [AR](docs/playbooks/submit-exam-marks.ar.md) |
| 10 | [Institution Summary](docs/playbooks/institution-summary.md) | Institution | admin, parent | [RU](docs/playbooks/institution-summary.ru.md) · [ES](docs/playbooks/institution-summary.es.md) · [HI](docs/playbooks/institution-summary.hi.md) · [AR](docs/playbooks/institution-summary.ar.md) |
| 11 | [Generate Institution Statistics PDF](docs/playbooks/generate-institution-statistics-pdf.md) | Report | admin | [RU](docs/playbooks/generate-institution-statistics-pdf.ru.md) · [ES](docs/playbooks/generate-institution-statistics-pdf.es.md) · [HI](docs/playbooks/generate-institution-statistics-pdf.hi.md) · [AR](docs/playbooks/generate-institution-statistics-pdf.ar.md) |
| 12 | [View Latest Attendance](docs/playbooks/view-latest-attendance.md) | Attendance | teacher, admin, parent | [RU](docs/playbooks/view-latest-attendance.ru.md) · [ES](docs/playbooks/view-latest-attendance.es.md) · [HI](docs/playbooks/view-latest-attendance.hi.md) · [AR](docs/playbooks/view-latest-attendance.ar.md) |
| 13 | [View Student Profile](docs/playbooks/view-student-profile.md) | Student | teacher, admin | [RU](docs/playbooks/view-student-profile.ru.md) · [ES](docs/playbooks/view-student-profile.es.md) · [HI](docs/playbooks/view-student-profile.hi.md) · [AR](docs/playbooks/view-student-profile.ar.md) |
| 14 | [View Student Marks](docs/playbooks/view-student-marks.md) | Assessment | teacher, admin, parent | [RU](docs/playbooks/view-student-marks.ru.md) · [ES](docs/playbooks/view-student-marks.es.md) · [HI](docs/playbooks/view-student-marks.hi.md) · [AR](docs/playbooks/view-student-marks.ar.md) |
| 15 | [View Class Report](docs/playbooks/view-class-report.md) | Report | teacher, admin | [RU](docs/playbooks/view-class-report.ru.md) · [ES](docs/playbooks/view-class-report.es.md) · [HI](docs/playbooks/view-class-report.hi.md) · [AR](docs/playbooks/view-class-report.ar.md) |
| 16 | [View Timetable](docs/playbooks/view-timetable.md) | Schedule | teacher, admin, student | [RU](docs/playbooks/view-timetable.ru.md) · [ES](docs/playbooks/view-timetable.es.md) · [HI](docs/playbooks/view-timetable.hi.md) · [AR](docs/playbooks/view-timetable.ar.md) |
| 17 | [View Full Institution Profile](docs/playbooks/view-institution-profile.md) | Institution | admin, parent, public | [RU](docs/playbooks/view-institution-profile.ru.md) · [ES](docs/playbooks/view-institution-profile.es.md) · [HI](docs/playbooks/view-institution-profile.hi.md) · [AR](docs/playbooks/view-institution-profile.ar.md) |
| 18 | [View Full Class Profile](docs/playbooks/view-class-profile.md) | Student | teacher, admin | [RU](docs/playbooks/view-class-profile.ru.md) · [ES](docs/playbooks/view-class-profile.es.md) · [HI](docs/playbooks/view-class-profile.hi.md) · [AR](docs/playbooks/view-class-profile.ar.md) |
| 19 | [View a Staff Member's Full Profile](docs/playbooks/view-staff-profile.md) | Staff | admin, hr | [RU](docs/playbooks/view-staff-profile.ru.md) · [ES](docs/playbooks/view-staff-profile.es.md) · [HI](docs/playbooks/view-staff-profile.hi.md) · [AR](docs/playbooks/view-staff-profile.ar.md) |
| 20 | [Enhance Student Profile](docs/playbooks/enhance-student-profile.md) | Student | teacher, admin, counsellor | [RU](docs/playbooks/enhance-student-profile.ru.md) · [ES](docs/playbooks/enhance-student-profile.es.md) · [HI](docs/playbooks/enhance-student-profile.hi.md) · [AR](docs/playbooks/enhance-student-profile.ar.md) |
| 21 | [View Institution Infrastructure](docs/playbooks/view-institution-infrastructure.md) | Institution | admin, facilities | [RU](docs/playbooks/view-institution-infrastructure.ru.md) · [ES](docs/playbooks/view-institution-infrastructure.es.md) · [HI](docs/playbooks/view-institution-infrastructure.hi.md) · [AR](docs/playbooks/view-institution-infrastructure.ar.md) |
| 22 | [View Institution Meals](docs/playbooks/view-institution-meals.md) | Institution | admin, nutritionist, parent | [RU](docs/playbooks/view-institution-meals.ru.md) · [ES](docs/playbooks/view-institution-meals.es.md) · [HI](docs/playbooks/view-institution-meals.hi.md) · [AR](docs/playbooks/view-institution-meals.ar.md) |
| 23 | [View Student Risk Profile](docs/playbooks/view-student-risks.md) | Student | admin, counsellor, teacher | [RU](docs/playbooks/view-student-risks.ru.md) · [ES](docs/playbooks/view-student-risks.es.md) · [HI](docs/playbooks/view-student-risks.hi.md) · [AR](docs/playbooks/view-student-risks.ar.md) |
| 24 | [View Institution Risk Summary](docs/playbooks/view-institution-risks.md) | Institution | admin, ministry | [RU](docs/playbooks/view-institution-risks.ru.md) · [ES](docs/playbooks/view-institution-risks.es.md) · [HI](docs/playbooks/view-institution-risks.hi.md) · [AR](docs/playbooks/view-institution-risks.ar.md) |
| 25 | [Add Equipment or Assets ✏️](docs/playbooks/add-institution-asset.md) | Infrastructure | admin, accountant, facilities | [RU](docs/playbooks/add-institution-asset.ru.md) · [ES](docs/playbooks/add-institution-asset.es.md) · [HI](docs/playbooks/add-institution-asset.hi.md) · [AR](docs/playbooks/add-institution-asset.ar.md) |
| 26 | [Record an Infrastructure Repair ✏️](docs/playbooks/record-infrastructure-repair.md) | Infrastructure | admin, accountant, facilities | [RU](docs/playbooks/record-infrastructure-repair.ru.md) · [ES](docs/playbooks/record-infrastructure-repair.es.md) · [HI](docs/playbooks/record-infrastructure-repair.hi.md) · [AR](docs/playbooks/record-infrastructure-repair.ar.md) |
| 27 | [Add a New Meal Programme ✏️](docs/playbooks/add-meal-programme.md) | Meals | admin, accountant, nutritionist | [RU](docs/playbooks/add-meal-programme.ru.md) · [ES](docs/playbooks/add-meal-programme.es.md) · [HI](docs/playbooks/add-meal-programme.hi.md) · [AR](docs/playbooks/add-meal-programme.ar.md) |
| 28 | [Resolve My Identity (per-user auth) 🔐](docs/playbooks/resolve-my-identity.md) | Auth | teacher, admin, staff | [RU](docs/playbooks/resolve-my-identity.ru.md) · [ES](docs/playbooks/resolve-my-identity.es.md) · [HI](docs/playbooks/resolve-my-identity.hi.md) · [AR](docs/playbooks/resolve-my-identity.ar.md) |
| 29 | `diagnose-alert-delivery` (POCOR-9509) | Alerts | admin, ministry | _docs follow_ |
| 30 | `view-school-accreditation` (POCOR-9610) | Institution | admin, ministry, principal | _docs follow_ |
| 31 | `view-school-registration` (POCOR-9610) | Institution | admin, ministry, principal | _docs follow_ |
| 32 | `view-institution-budget` (Core 5.10.0) | Institution | admin, finance | _docs follow_ |
| 33 | `query-student-absence-history` (Core 5.10.0) | Attendance | teacher, admin, parent, counsellor | _docs follow_ |
| 34 | `query-user-activity-audit-log` (POCOR-9697) | Security | admin, security, ministry | _docs follow_ |
| 35 | `view-class-roster` (Core 5.10.0) | Institution | teacher, admin, homeroom | _docs follow_ |
| 36 | `set-school-accreditation` ✏️ (POCOR-9610) | Institution | admin, ministry | _docs follow_ |
| 37 | `set-school-registration` ✏️ (POCOR-9610) | Institution | admin, ministry | _docs follow_ |
| 38 | `mark-student-meal-participation` ✏️ | Meals | teacher, admin, nutritionist | _docs follow_ |
| 39 | `view-admission-and-enrolment-queue-state` 🔄 | Workflow | admin, registrar, parent, principal | _docs follow_ |
| 40 | `explain-workflow-system` 🔄 | Workflow | admin, principal, developer, consultant | _docs follow_ |

> **Newer playbooks (29–40)** ship as full English content in `data/playbooks.json` and are loaded via `openemis_get_playbook`. Per-playbook markdown docs and RU/ES/HI/AR translations land in a follow-up release.
---

## Roadmap

### v0.4.0 — Browser Auth (planned)

Today, credentials require a manually-issued `api_key` from the OpenEMIS admin. v0.4.0 will add an optional `openemis_browser_auth` tool that eliminates all manual credential configuration:

1. The tool launches a local Playwright browser — **no target URL required upfront**.
2. The user navigates to their OpenEMIS instance and logs in normally.
3. Playwright watches all network traffic. When it sees a response to **`POST */api/v5/login`** or **`POST */api/v4/login`** (both return identical JWTs):
   - The **base URL** is extracted from the request URL automatically (e.g. `https://dev-demo.openemis.org/core/api/v5/login` → base `https://dev-demo.openemis.org/core`) — no need to pre-configure `OPENEMIS_BASE_URL`.
   - The **JWT** is extracted from the response body.
4. Both are cached in memory and used for all subsequent CRUD calls.

This removes `OPENEMIS_BASE_URL`, `OPENEMIS_USERNAME`, `OPENEMIS_PASSWORD`, and `OPENEMIS_API_KEY` as requirements — the user just opens a browser and logs in. Works with any OpenEMIS instance, any domain, any subdomain, including dev, staging, and production environments without any reconfiguration.

**`.env`-based credentials remain fully supported** — existing setups are unchanged. Browser auth is opt-in via the new tool.

### v0.5.0 — Risk Dashboards ✅

`view-student-risks` and `view-institution-risks` — shipped. Risk scores, per-criterion breakdown, welfare cases, alert rules, and delivery logs.

### v0.6.0 — Workflow Routes *(Institution Pro + Country Pro)*

Current write tools (`openemis_create`, `openemis_update`, `openemis_delete`) execute one operation at a time. Workflow routes take this further: the MCP **orchestrates a complete multi-step playbook automatically**, carrying state from step to step and enforcing pre-commit validation at each stage.

**New tool:** `openemis_run_workflow { playbook_id, params, dry_run? }` — accepts a playbook ID and structured input parameters, executes all steps in sequence, returns a structured run log. In dry-run mode, reports what would change without writing anything.

Workflow routes are gated above Individual Pro because bulk AI writes at institution or national scale need oversight. A teacher marking 30 students needs speed; a district office enrolling 500 students across 20 schools needs audit and approval.

| Feature | Individual Pro | Institution Pro | Country Pro |
|---|---|---|---|
| Direct write (single record) | ✅ | ✅ | ✅ |
| Institution audit trail | — | ✅ | ✅ |
| Workflow route execution | — | ✅ | ✅ |
| Institution-admin approval gate | — | ✅ | ✅ |
| Batch ops within one institution | — | ✅ | ✅ |
| Multi-institution batch ops | — | — | ✅ |
| Ministry approval gates | — | — | ✅ |
| Cross-institution oversight dashboard | — | — | ✅ |
| Roll-back on partial failure | — | — | ✅ |

---

## Plans

| | **Free** | **Individual Pro** | **Institution Pro** | **Country Pro** |
|---|---|---|---|---|
| **Scope** | Any user | One person | One school | Ministry / national |
| **Licence** | MIT | BSL 1.1 | BSL 1.1 | BSL 1.1 |
| Read tools (all 678 resources, Core 5.13.0) | ✅ | ✅ | ✅ | ✅ |
| 40 curated playbooks (26 read · 14 write/auth · 28 with translations) | ✅ | ✅ | ✅ | ✅ |
| stdio mode (Claude Code, Cursor, Cline) | ✅ | ✅ | ✅ | ✅ |
| **HTTP server mode** (Oracle / VPS install) | — | ✅ | ✅ | ✅ |
| **OpenAPI adapter** (ChatGPT Custom GPT, any REST client) | — | ✅ | ✅ | ✅ |
| Direct write — single record | — | ✅ | ✅ | ✅ |
| Institution audit trail | — | — | ✅ | ✅ |
| Workflow route execution | — | — | ✅ | ✅ |
| Institution-admin approval gate | — | — | ✅ | ✅ |
| Batch ops within one institution | — | — | ✅ | ✅ |
| Multi-institution batch ops | — | — | — | ✅ |
| Ministry approval gates | — | — | — | ✅ |
| Cross-institution oversight | — | — | — | ✅ |
| Roll-back on partial failure | — | — | — | ✅ |

→ **Pricing and access:** khindol.madraimov@gmail.com

---

## License

[MIT](LICENSE.md) — © 2026 Khindol Madraimov

---

## Acknowledgements

Built by a coordinated team of AI agents under human direction — see [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) for the full team: Adviser Arastu, Marshal Sunny, Samurai Haiku, Xéphyrin Xirdal, Captain Nemo, Coddy (GPT-5), Miniqwenco (Qwen 2.5 Coder 7B), Miniqwen (Qwen 3.5 9B), and Gemmy (Gemma 4e4b) — each with distinct roles across architecture, code, analysis, and multilingual translation.

---

*Not affiliated with OpenEMIS or its maintainers. This is a third-party bridge that speaks the public Core API. Credentials and data stay on your machine.*
