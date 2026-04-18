#!/usr/bin/env node
/**
 * Smoke test for OpenEMIS client login.
 * Tests that the client can load config and attempt login (without real creds).
 * Usage: OPENEMIS_USERNAME=... OPENEMIS_PASSWORD=... OPENEMIS_API_KEY=... node scripts/smoke-login.mjs
 */

import { loadConfig } from "../dist/config.js";
import { OpenemisClientImpl } from "../dist/openemis.js";

async function main() {
  try {
    console.log("[Test] Loading config...");
    const cfg = loadConfig();
    console.log(`[OK] Config loaded: baseUrl=${cfg.baseUrl}`);

    console.log("[Test] Creating client...");
    const client = new OpenemisClientImpl(cfg);
    console.log("[OK] Client created");

    console.log("[Test] Attempting login...");
    await client.login();
    console.log("[OK] Login successful");
  } catch (err) {
    console.error("[ERROR]", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
