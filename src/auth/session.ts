/**
 * Process-local session state for stdio mode.
 *
 * A home stdio installation runs one MCP process per client session (Claude
 * Code / Cursor / Cline), so ONE active user at a time is the right model.
 *
 * Contract:
 *   - `getCurrentUser()` returns the username set by `openemis_login`, or
 *     `null` if no per-user login was performed.
 *   - When null, callers fall back to env credentials.
 *   - `openemis_logout` clears it back to null — JWTs remain in the SQLite
 *     `users` table for the next session.
 *
 * This module is intentionally tiny — no class, no ceremony. Lives alongside
 * the auth store because logically they're the same concern (per-user login),
 * but kept separate files so tests can mock one without the other.
 */

let currentUser: string | null = null;

/** Get the username of the currently logged-in user, or null. */
export function getCurrentUser(): string | null {
  return currentUser;
}

/** Set the currently logged-in user. Called by `openemis_login`. */
export function setCurrentUser(username: string): void {
  currentUser = username;
}

/** Clear the current user, reverting to env-default creds. Called by `openemis_logout`. */
export function clearCurrentUser(): void {
  currentUser = null;
}
