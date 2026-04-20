#!/usr/bin/env node
/**
 * End-to-end smoke test for per-user login (pro, stdio mode).
 *
 * Flow:
 *   1. Open a tmp SQLite auth DB.
 *   2. Build a client with { store, getCurrentUser } — getCurrentUser is
 *      backed by a simple mutable ref we control from this script.
 *   3. Call client.loginAs("teacher", "teacher") — hits OpenEMIS demo.
 *   4. Set the currentUser ref to "teacher".
 *   5. Call client.getToken() — should return the stored JWT, not env creds.
 *   6. Clear currentUser → getToken() should fall back to env default.
 *   7. Clean up the tmp DB.
 *
 * Required env: OPENEMIS_BASE_URL, OPENEMIS_USERNAME, OPENEMIS_PASSWORD,
 * OPENEMIS_API_KEY (env defaults for step 6), plus demo-instance "teacher" /
 * "teacher" credentials for step 3 (configurable via SMOKE_USER / SMOKE_PASS).
 */

import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { loadConfig } from "../dist/config.js";
import { OpenemisClientImpl } from "../dist/openemis.js";
import { AuthStore } from "../dist/auth/store.js";

const SMOKE_USER = process.env.SMOKE_USER ?? "teacher";
const SMOKE_PASS = process.env.SMOKE_PASS ?? "teacher";

async function main() {
  const tmpDir = mkdtempSync(join(tmpdir(), "openemis-smoke-peruser-"));
  const dbPath = join(tmpDir, "auth.db");
  let store;
  let failed = false;

  try {
    const cfg = loadConfig();
    console.log(`[Test] baseUrl=${cfg.baseUrl}`);
    console.log(`[Test] tmp auth DB at ${dbPath}`);

    store = new AuthStore({ dbPath });
    let currentUser = null;
    const client = new OpenemisClientImpl(cfg, {
      store,
      getCurrentUser: () => currentUser,
    });

    // ── Step 3: per-user login ─────────────────────────────────────────
    console.log(`[Test] loginAs("${SMOKE_USER}", "${SMOKE_PASS}")…`);
    const jwt = await client.loginAs(SMOKE_USER, SMOKE_PASS);
    console.log(`[OK] per-user JWT received (${jwt.length} chars)`);

    // ── Step 4-5: session pointer + stored JWT ─────────────────────────
    currentUser = SMOKE_USER;
    const stored = store.getUser(SMOKE_USER);
    if (stored?.jwt !== jwt) {
      throw new Error(`Stored JWT mismatch — expected ${jwt.slice(0, 12)}…, got ${stored?.jwt?.slice(0, 12)}…`);
    }
    const resolved = await client.getToken();
    if (resolved !== jwt) {
      throw new Error(`getToken() returned a different token than the stored one under per-user mode`);
    }
    console.log(`[OK] client.getToken() under currentUser="${SMOKE_USER}" returns the stored JWT`);

    // ── Step 6: env-default fallback ──────────────────────────────────
    currentUser = null;
    const envToken = await client.getToken();
    if (envToken === jwt) {
      // They'd only collide if env creds are the same user — unlikely but not
      // an error per se. Still, flag for visibility.
      console.log(`[WARN] env-default token matches per-user token — env creds may be the same account`);
    } else {
      console.log(`[OK] env-default fallback returns a different token (env user != "${SMOKE_USER}")`);
    }

    // ── Rotation sanity check ─────────────────────────────────────────
    store.logCall({
      ts: new Date().toISOString(),
      username: SMOKE_USER,
      tool: "smoke_test",
      argsJson: JSON.stringify({ marker: "ok" }),
      ok: true,
      error: null,
      durationMs: 1,
    });
    console.log(`[OK] audit log append works`);

    console.log(`\n✅ per-user login smoke test passed`);
  } catch (err) {
    failed = true;
    console.error(`\n❌ [FAIL]`, err instanceof Error ? err.message : err);
  } finally {
    if (store) store.close();
    rmSync(tmpDir, { recursive: true, force: true });
  }

  if (failed) process.exit(1);
}

main();
