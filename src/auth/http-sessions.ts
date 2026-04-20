/**
 * HTTP session store for REST login.
 *
 * The REST surface (ChatGPT Custom Actions, curl, third-party integrators)
 * logs in once via `POST /api/auth/login`, receives an opaque session token,
 * and sends it on every subsequent `/api/resources/*` call as
 * `Authorization: Bearer <token>`.
 *
 * This module maps that token back to a username. The OpenEMIS JWT for that
 * user lives in the existing `AuthStore` SQLite table, so the HTTP handler
 * can pull a fresh JWT via `runAs(username, …)` on each request without
 * re-logging in.
 *
 * Token format: 64 hex chars (256 bits from `crypto.randomBytes(32)`) —
 * unguessable and collision-free.
 *
 * TTL: 8 hours, matching a typical OpenEMIS JWT lifetime. Expired tokens
 * are purged lazily on lookup AND proactively every 5 minutes by a
 * long-poll sweep (kept optional — callers that don't want the timer can
 * use `pruneExpired()` manually).
 *
 * Storage: in-memory `Map`. HTTP mode is single-process today; if we ever
 * need multi-instance, swap the impl for SQLite — the call surface stays
 * the same.
 */

import { randomBytes } from "node:crypto";

export interface HttpSession {
  /** Username tied to this session. Lookup into AuthStore uses this as key. */
  username: string;
  /** Wall-clock ms of creation. Used only for diagnostics + whoami. */
  createdAt: number;
  /** Wall-clock ms after which the token is rejected. */
  expiresAt: number;
}

/** 8 hours. Same ballpark as the OpenEMIS server's own JWT TTL. */
export const HTTP_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

const sessions = new Map<string, HttpSession>();

/**
 * Mint a new session token for `username` and persist it.
 * Returns the opaque token the client will send back as `Authorization: Bearer <token>`.
 */
export function mintHttpSession(
  username: string,
  ttlMs: number = HTTP_SESSION_TTL_MS,
): { token: string; session: HttpSession } {
  const token = randomBytes(32).toString("hex");
  const now = Date.now();
  const session: HttpSession = {
    username,
    createdAt: now,
    expiresAt: now + ttlMs,
  };
  sessions.set(token, session);
  return { token, session };
}

/**
 * Look up a session by its token. Returns `null` if the token is unknown
 * OR if it has expired (expired rows are dropped on read).
 */
export function getHttpSession(token: string): HttpSession | null {
  const s = sessions.get(token);
  if (!s) return null;
  if (s.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return s;
}

/**
 * Revoke a session. Safe to call with an unknown token (no-op).
 * Returns `true` if the token existed and was removed.
 */
export function revokeHttpSession(token: string): boolean {
  return sessions.delete(token);
}

/**
 * Drop all expired sessions. Called lazily from `getHttpSession` and can
 * also be invoked from a `setInterval` in `server.ts` for proactive cleanup.
 */
export function pruneExpired(now: number = Date.now()): number {
  let dropped = 0;
  for (const [token, s] of sessions) {
    if (s.expiresAt < now) {
      sessions.delete(token);
      dropped++;
    }
  }
  return dropped;
}

/** Test-only — wipe the store between tests. Not exported via index. */
export function _clearAllSessions(): void {
  sessions.clear();
}

/** Test-only — inspect the store size. */
export function _sessionCount(): number {
  return sessions.size;
}
