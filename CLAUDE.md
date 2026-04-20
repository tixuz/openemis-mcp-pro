# openemis-mcp-pro — project rules for Claude

**Repo:** `github.com/tixuz/openemis-mcp-pro` — **PRIVATE**.
**Free/public sibling:** `github.com/tixuz/openemis-mcp` on npm as `openemis-mcp`.

---

## Git identity (hard rule)

Every commit in this repo MUST be authored by:

- **Name:**  `Khindol Madraimov`
- **Email:** `khindol.madraimov@gmail.com`

Before the first commit of any new clone / devcontainer / CI runner, verify:

```
git config --get user.email   # must return khindol.madraimov@gmail.com
```

If it returns empty or a machine-derived form (e.g. `khindol@192.168.2.7`), set it:

```
git config --global user.name  "Khindol Madraimov"
git config --global user.email "khindol.madraimov@gmail.com"
```

If you realise a bad-author commit was already made but NOT pushed to a shared branch:
`git commit --amend --reset-author --no-edit`.

## Commit-message rules (hard rule)

- **Never** add a `Co-Authored-By: Claude ...` trailer. Not here, not in any of Khindol's repos.
- Plain conventional-commits subject + optional body. Nothing else.
- Why: GitHub's contributor graph caches "claude" as a committor for days after the trailer is added; we had to `git-filter-repo` rewrite 43 commits to clean it up on 2026-04-20.

## Distribution (hard rule)

- **Never `npm publish` this repo.** The tarball bundles `dist/` with compiled pro business logic (`rest.ts`, `write.ts`, `policies.ts`, etc.). Publishing it to public npm leaks the source.
- If pro ever needs npm distribution, use a PRIVATE scoped package (`@drkhindol/openemis-mcp-pro` on a paid plan) or GitHub Packages with repo-scoped auth.
- The MCP Registry entry `io.github.tixuz/openemis` is for the **free** repo only — do not submit pro there.
- Before any `npm publish` in this directory, run: `gh repo view tixuz/openemis-mcp-pro --json visibility` — if it says `PRIVATE`, do not publish.

---

## Project orientation

Per-user, audit-logged MCP server for OpenEMIS v5. TypeScript, ESM, Node 22.

**Transports (both first-class):**
- `stdio` — one process per client (Claude Desktop, Cursor).
- `http` — one stateful MCP transport *per MCP session*, plus a REST gateway for ChatGPT Custom Actions.

**Auth surfaces:**
- `POST /api/auth/login` (REST) — mints a 64-hex bearer into `src/auth/http-sessions.ts` (8h TTL).
- `openemis_login` (MCP tool) — pins username into `src/auth/mcp-sessions.ts` keyed on the MCP session ID (HTTP) or into the module-global `setCurrentUser` (stdio).
- `openemis_whoami` / `openemis_logout` — mode-aware, read/clear whichever store the current caller is in.

**Pre-dispatch user resolution (HTTP):**
```
req → resolve user from (http bearer | mcp-session-id → map | null)
    → wrap dispatch in runAs(user, handler) via AsyncLocalStorage
    → tool call sees getCurrentUser() === user
```

**Key files:**
- `src/server.ts` — transport bootstrapping; stateful per-session `buildMcpServer()` factory.
- `src/rest.ts` — REST gateway (login/logout/whoami, resources, playbooks).
- `src/auth/mcp-sessions.ts` — MCP session → username map.
- `src/auth/http-sessions.ts` — REST bearer → username map (TTL'd).
- `src/auth/session.ts` — module-global current user + AsyncLocalStorage (`runAs`).
- `src/auth/wrap.ts` — audit-log wrapper around every tool handler. Passes `(args, extra)` through to the inner handler.
- `src/tools/auth.ts` — `openemis_login` / `openemis_logout` / `openemis_whoami`.
- `src/tools/crud.ts` — `openemis_get` / `openemis_discover` / etc.
- `src/auth/store.ts` — SQLite audit + JWT cache (password NEVER stored).

**Tests:** `npm test` (vitest). 130 tests as of 2026-04-20.

**Local Docker:** `docker compose --profile mcp up -d` at `/Users/khindol/webstore/utils/docker-compose.yml`, binds to `127.0.0.1:8806`.

## Test/build commands

```
npm test                          # vitest
npx tsc --noEmit                  # type-check only
npm run build                     # tsc → dist/
node dist/server.js               # start stdio
MCP_TRANSPORT=http node dist/server.js   # start HTTP on $PORT (default 3000)
```

## Fail-closed by default (2026-04-20)

`OPENEMIS_USERNAME` / `OPENEMIS_PASSWORD` are **not set** in any shipped `.env` and are documented as discouraged-in-production. The server boots without them. Every resource call must be preceded by either `/api/auth/login` (REST, gated — see below) or `openemis_login` (MCP); gateway-bearer-only callers get a 401-style "Not authenticated: call openemis_login" error rather than silently acting as a shared admin.

If an env-default IS configured, the whoami endpoints still expose that fact, but it's a legacy/test convenience — not the recommended posture.

## REST per-user login gate (2026-04-21)

`OPENEMIS_REST_LOGIN_ENABLED` (default `false`) controls whether `POST /api/auth/login` and `POST /api/auth/logout` are reachable at all. The flag exists because of a real failure mode we hit on 2026-04-20: when ChatGPT Custom Actions call `/api/auth/login`, the response body contains a 64-hex session bearer that the GPT can SEE (it's rendered in the tool-call trace) but CANNOT USE on the next call (Custom Actions only carry one preconfigured Bearer, set at import time). So the token leaks into the model's visible context while simultaneously doing no useful work — pure downside.

- **Default (`false`)**: `POST /api/auth/login` / `/logout` return `410 Gone` with guidance pointing the caller at the MCP channel. `/openapi.json` omits both paths entirely, so ChatGPT Custom Action importers never see a login button. `GET /api/auth/whoami` stays available in both modes — it is read-only and never returns a bearer handle.
- **Enabled (`true`)**: the original REST login flow is restored for trusted non-ChatGPT REST clients (backend scripts, curl pipelines, bespoke integrations that CAN propagate the session token per-request).

The first-class per-user path is now **MCP `openemis_login`**: the caller connects to `/mcp`, the server mints a transport-managed `Mcp-Session-Id`, and `openemis_login` pins the identity to that session ID in `src/auth/mcp-sessions.ts`. The session ID is not a secret and never appears in response bodies as a reusable bearer — it lives purely in the transport handshake. This is the pattern the user wanted: "the API should handle auth, not send it to the user."

## Known static-bearer caveat (not a bug, explain to users)

ChatGPT Custom Actions can only send ONE pre-configured bearer token on every call — it has no mechanism to swap to a response-derived dynamic token. With the REST login gate on (default) they simply cannot act as a specific OpenEMIS user: they either run as the gateway's env-default identity (if one is configured — discouraged in production) or fail closed with "Not authenticated". The proper fix for ChatGPT-originated per-user access is either OAuth2 or, cleaner, ChatGPT's MCP connector, which speaks the stateful MCP HTTP transport directly and handles `openemis_login` natively. See `src/rest.ts` and the Phase A/B session notes for the long-form rationale.
