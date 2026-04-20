/**
 * Per-session user state.
 *
 * Two shapes live here:
 *
 *  1. **Process-global** (stdio mode) — `setCurrentUser` / `clearCurrentUser`
 *     mutate a module-level variable. A home stdio installation runs one
 *     MCP process per client (Claude Code / Cursor / Cline), so ONE active
 *     user at a time is the right model.
 *
 *  2. **Request-scoped** (HTTP mode) — `runAs(username, fn)` activates a
 *     Node AsyncLocalStorage context. Inside the callback, `getCurrentUser`
 *     returns that username; outside it, it falls back to the module-global
 *     (so stdio keeps working unchanged).
 *
 * Contract:
 *   - `getCurrentUser()` returns the username resolved for the current
 *     execution, or `null` if no per-user login was performed.
 *   - When null, callers fall back to env credentials.
 *   - `openemis_logout` (stdio) clears the module-global; the SQLite
 *     `users` table keeps JWTs for the next session.
 *
 * This module is intentionally tiny — no class, no ceremony. Lives alongside
 * the auth store because logically they're the same concern (per-user login),
 * but kept separate so tests can mock one without the other.
 */

import { AsyncLocalStorage } from "node:async_hooks";

// ── Process-global (stdio) ──────────────────────────────────────────────────

let currentUser: string | null = null;

/** Set the currently logged-in user. Called by `openemis_login` (stdio). */
export function setCurrentUser(username: string): void {
  currentUser = username;
}

/** Clear the current user, reverting to env-default creds. Called by `openemis_logout` (stdio). */
export function clearCurrentUser(): void {
  currentUser = null;
}

// ── Request-scoped (HTTP) ───────────────────────────────────────────────────

interface RequestContext {
  /** Username for this request. Lookups hit AuthStore first, then env. */
  username: string;
}

const als = new AsyncLocalStorage<RequestContext>();

/**
 * Run `fn` with `username` as the current user for this async context.
 * Used by the HTTP handler to pin each request to the authenticated user.
 *
 * Nested calls replace the context for their inner scope; on return the
 * outer context resumes. Throws propagate verbatim.
 */
export function runAs<T>(username: string, fn: () => Promise<T>): Promise<T> {
  return als.run({ username }, fn);
}

/**
 * Get the username of the currently logged-in user, or `null`.
 *
 * Resolution order:
 *   1. AsyncLocalStorage context (set by `runAs`, HTTP per-request)
 *   2. Module-global (set by `setCurrentUser`, stdio session-wide)
 *   3. `null` — fall back to env-default credentials.
 */
export function getCurrentUser(): string | null {
  const ctx = als.getStore();
  if (ctx) return ctx.username;
  return currentUser;
}
