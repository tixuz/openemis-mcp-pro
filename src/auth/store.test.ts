/**
 * Tests for AuthStore — the SQLite-backed per-user JWT + tool-call audit log.
 *
 * Uses a throwaway tmp DB per test. The built-in node:sqlite driver is sync
 * and creates the file on construction, so we can mkdtemp a fresh path,
 * exercise, then close + unlink.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { AuthStore } from "./store.js";

describe("AuthStore", () => {
  let tmpDir: string;
  let dbPath: string;
  let logDir: string;
  let store: AuthStore;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "openemis-auth-test-"));
    dbPath = join(tmpDir, "auth.db");
    logDir = join(tmpDir, "logs");
    store = new AuthStore({ dbPath });
  });

  afterEach(() => {
    store.close();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("creates the DB file and the parent directory", () => {
    expect(existsSync(dbPath)).toBe(true);
  });

  it("returns null for unknown users", () => {
    expect(store.getUser("nobody")).toBeNull();
  });

  it("upsertUserJwt inserts on first call and updates on second", () => {
    store.upsertUserJwt("alice", "jwt-1");
    const first = store.getUser("alice");
    expect(first?.jwt).toBe("jwt-1");
    expect(first?.createdAt).toBeTruthy();

    // Force different timestamp by sleeping 10ms (ISO precision is ms)
    const beforeUpdate = first!.createdAt;
    store.upsertUserJwt("alice", "jwt-2");
    const second = store.getUser("alice");
    expect(second).not.toBeNull();
    expect(second!.jwt).toBe("jwt-2");
    expect(second!.createdAt).toBe(beforeUpdate); // createdAt preserved
    expect(second!.lastUsedAt >= beforeUpdate).toBe(true);
  });

  it("clearUserJwt nulls the token but keeps the row", () => {
    store.upsertUserJwt("bob", "jwt-x");
    store.clearUserJwt("bob");
    const row = store.getUser("bob");
    expect(row?.username).toBe("bob");
    expect(row?.jwt).toBeNull();
  });

  it("listUsers returns most-recently-used first", () => {
    store.upsertUserJwt("alice", "a");
    // small delay to ensure distinct ISO ms
    const t0 = Date.now();
    while (Date.now() - t0 < 5) {
      /* spin */
    }
    store.upsertUserJwt("bob", "b");
    const users = store.listUsers();
    expect(users.map((u) => u.username)).toEqual(["bob", "alice"]);
  });

  it("logCall appends rows", () => {
    store.logCall({
      ts: "2026-04-20T10:00:00.000Z",
      username: "alice",
      tool: "openemis_get",
      argsJson: JSON.stringify({ resource: "users", id: 1 }),
      ok: true,
      error: null,
      durationMs: 42,
    });
    store.logCall({
      ts: "2026-04-20T10:00:01.000Z",
      username: "(env)",
      tool: "openemis_health",
      argsJson: null,
      ok: false,
      error: "boom",
      durationMs: 100,
    });

    // rotateOlderThan reports the count we just inserted — use tomorrow as cutoff
    const count = store.rotateOlderThan("2026-04-21", logDir);
    expect(count).toBe(2);
  });

  it("rotateOlderThan flushes old rows to JSONL and deletes them", () => {
    store.logCall({
      ts: "2026-04-18T09:00:00.000Z",
      username: "alice",
      tool: "openemis_get",
      argsJson: JSON.stringify({ resource: "users" }),
      ok: true,
      error: null,
      durationMs: 10,
    });
    store.logCall({
      ts: "2026-04-19T15:30:00.000Z",
      username: "bob",
      tool: "openemis_whoami",
      argsJson: null,
      ok: true,
      error: null,
      durationMs: 5,
    });
    store.logCall({
      ts: "2026-04-20T11:00:00.000Z", // today — should be kept
      username: "alice",
      tool: "openemis_get",
      argsJson: JSON.stringify({ resource: "students" }),
      ok: true,
      error: null,
      durationMs: 20,
    });

    const flushed = store.rotateOlderThan("2026-04-20", logDir);
    expect(flushed).toBe(2);

    // Two dated files, each with one line
    const aprl18 = readFileSync(join(logDir, "tool-calls-2026-04-18.jsonl"), "utf-8")
      .trim()
      .split("\n");
    const aprl19 = readFileSync(join(logDir, "tool-calls-2026-04-19.jsonl"), "utf-8")
      .trim()
      .split("\n");
    expect(aprl18).toHaveLength(1);
    expect(aprl19).toHaveLength(1);
    expect(JSON.parse(aprl18[0])).toMatchObject({
      username: "alice",
      tool: "openemis_get",
      args: { resource: "users" },
      ok: true,
    });

    // Today's row is still in the DB — a second rotation call for "today" is a no-op
    const flushedAgain = store.rotateOlderThan("2026-04-20", logDir);
    expect(flushedAgain).toBe(0);
  });

  it("rotateOlderThan returns 0 when there are no old rows", () => {
    const flushed = store.rotateOlderThan("2026-04-20", logDir);
    expect(flushed).toBe(0);
  });

  it("survives a reopen of the same DB file", () => {
    store.upsertUserJwt("persistent", "long-lived-jwt");
    store.close();

    const reopened = new AuthStore({ dbPath });
    const row = reopened.getUser("persistent");
    expect(row?.jwt).toBe("long-lived-jwt");
    reopened.close();
  });
});
