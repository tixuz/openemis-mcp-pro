/**
 * SQLite-backed store for per-user OpenEMIS sessions + tool-call audit log.
 *
 * Used ONLY in stdio mode — the pro HTTP server stays stateless. A home
 * installation runs one stdio process per Claude / Cursor / Cline session,
 * so a single active user per process is enough.
 *
 * Schema:
 *   users(username PK, jwt, created_at, last_used_at)    ← no password stored
 *   tool_calls(id PK, ts, username, tool, args_json, ok, error, duration_ms)
 *
 * On server startup, rows in `tool_calls` older than today's midnight are
 * flushed to JSONL (`<logDir>/tool-calls-YYYY-MM-DD.jsonl`) and deleted —
 * rotation, not truncation. The DB keeps today's rows plus all user JWTs.
 *
 * Zero dependencies: uses the built-in `node:sqlite` module (Node ≥ 22.13).
 */

import { DatabaseSync } from "node:sqlite";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Options for AuthStore construction. Path defaults are resolved by caller
 * (config.ts) so this module stays focused on the storage mechanics.
 */
export interface AuthStoreOptions {
  dbPath: string;
}

export interface UserRecord {
  username: string;
  jwt: string | null;
  createdAt: string;
  lastUsedAt: string;
}

export interface ToolCallRecord {
  ts: string;
  username: string; // "(env)" when request ran under env-default credentials
  tool: string;
  argsJson: string | null; // already redacted by the caller
  ok: boolean;
  error: string | null;
  durationMs: number;
}

/**
 * SQLite wrapper. Instantiate ONCE per process; pass the same instance
 * to the client and the tool-logging wrapper.
 */
export class AuthStore {
  private db: DatabaseSync;
  private readonly _path: string;
  private closed = false;

  constructor(opts: AuthStoreOptions) {
    this._path = opts.dbPath;

    const dir = dirname(this._path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(this._path);
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.initSchema();
  }

  /** Create tables and indexes if they don't exist. */
  private initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username     TEXT PRIMARY KEY,
        jwt          TEXT,
        created_at   TEXT NOT NULL,
        last_used_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tool_calls (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        ts           TEXT    NOT NULL,
        username     TEXT    NOT NULL,
        tool         TEXT    NOT NULL,
        args_json    TEXT,
        ok           INTEGER NOT NULL,
        error        TEXT,
        duration_ms  INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_tool_calls_ts ON tool_calls (ts);
    `);
  }

  // ── users ────────────────────────────────────────────────────────────

  /** Look up a user; null if not present. */
  getUser(username: string): UserRecord | null {
    const stmt = this.db.prepare(
      "SELECT username, jwt, created_at, last_used_at FROM users WHERE username = ?"
    );
    const row = stmt.get(username) as
      | {
          username: string;
          jwt: string | null;
          created_at: string;
          last_used_at: string;
        }
      | undefined;
    if (!row) return null;
    return {
      username: row.username,
      jwt: row.jwt,
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at,
    };
  }

  /**
   * Insert-or-update a user's JWT. Creates the row on first login, updates
   * the JWT + last_used_at on subsequent logins.
   */
  upsertUserJwt(username: string, jwt: string): void {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO users (username, jwt, created_at, last_used_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(username) DO UPDATE SET
        jwt          = excluded.jwt,
        last_used_at = excluded.last_used_at
    `);
    stmt.run(username, jwt, now, now);
  }

  /** Null-out a stored JWT (e.g. after 401). Row is kept so user history persists. */
  clearUserJwt(username: string): void {
    const stmt = this.db.prepare(
      "UPDATE users SET jwt = NULL, last_used_at = ? WHERE username = ?"
    );
    stmt.run(new Date().toISOString(), username);
  }

  /** Bump last_used_at without changing the JWT. */
  touchUser(username: string): void {
    const stmt = this.db.prepare(
      "UPDATE users SET last_used_at = ? WHERE username = ?"
    );
    stmt.run(new Date().toISOString(), username);
  }

  /** Enumerate known users, most recently used first. Useful for whoami / admin. */
  listUsers(): UserRecord[] {
    const rows = this.db
      .prepare(
        "SELECT username, jwt, created_at, last_used_at FROM users ORDER BY last_used_at DESC"
      )
      .all() as Array<{
      username: string;
      jwt: string | null;
      created_at: string;
      last_used_at: string;
    }>;
    return rows.map((r) => ({
      username: r.username,
      jwt: r.jwt,
      createdAt: r.created_at,
      lastUsedAt: r.last_used_at,
    }));
  }

  // ── tool_calls ───────────────────────────────────────────────────────

  /** Append one tool-call audit row. */
  logCall(entry: ToolCallRecord): void {
    const stmt = this.db.prepare(`
      INSERT INTO tool_calls (ts, username, tool, args_json, ok, error, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      entry.ts,
      entry.username,
      entry.tool,
      entry.argsJson,
      entry.ok ? 1 : 0,
      entry.error,
      entry.durationMs
    );
  }

  /**
   * Flush every tool_call row with ts strictly before midnight of `cutoffDate`
   * (a YYYY-MM-DD string — usually today's date) to JSONL files in `logDir`,
   * grouped by the date portion of each row's ts. Then delete the flushed
   * rows. Returns the count.
   *
   * Idempotent: running it twice on the same day is a no-op the second time.
   */
  rotateOlderThan(cutoffDate: string, logDir: string): number {
    if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true });

    // ISO-8601 ts is lexicographically ordered, so string compare is safe.
    const cutoff = `${cutoffDate}T00:00:00`;

    const rows = this.db
      .prepare(
        "SELECT id, ts, username, tool, args_json, ok, error, duration_ms " +
          "FROM tool_calls WHERE ts < ? ORDER BY ts"
      )
      .all(cutoff) as Array<{
      id: number;
      ts: string;
      username: string;
      tool: string;
      args_json: string | null;
      ok: number;
      error: string | null;
      duration_ms: number;
    }>;

    if (rows.length === 0) return 0;

    // Bucket by calendar date
    const byDate = new Map<string, string[]>();
    for (const r of rows) {
      const day = r.ts.slice(0, 10);
      const line = JSON.stringify({
        ts: r.ts,
        username: r.username,
        tool: r.tool,
        args: r.args_json ? safeParse(r.args_json) : null,
        ok: r.ok === 1,
        error: r.error,
        durationMs: r.duration_ms,
      });
      const bucket = byDate.get(day) ?? [];
      bucket.push(line);
      byDate.set(day, bucket);
    }

    for (const [day, lines] of byDate) {
      const file = `${logDir}/tool-calls-${day}.jsonl`;
      appendFileSync(file, lines.join("\n") + "\n", "utf-8");
    }

    this.db.prepare("DELETE FROM tool_calls WHERE ts < ?").run(cutoff);
    return rows.length;
  }

  /** Close the underlying SQLite handle. Idempotent — safe to call from both
   *  test teardown paths and a shutdown hook. */
  close(): void {
    if (this.closed) return;
    this.closed = true;
    try {
      this.db.close();
    } catch {
      // Already closed by another path — ignore.
    }
  }

  /** Path the DB was opened from. */
  get path(): string {
    return this._path;
  }
}

/** Parse JSON, return the original string if it's not valid JSON. */
function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
