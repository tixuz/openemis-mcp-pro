/**
 * MCP session → user map for the HTTP transport.
 *
 * Each connected MCP client gets a session ID from the StreamableHTTP
 * transport (generated in `server.ts` via `sessionIdGenerator`). When a
 * client calls the `openemis_login` tool over /mcp, we pin its session to
 * the authenticated OpenEMIS username; every subsequent tool call from
 * that session runs `runAs(username, …)` so the client picks up the
 * per-user JWT from `AuthStore`.
 *
 * This is the MCP-transport counterpart to `http-sessions.ts` (REST/
 * ChatGPT Custom Actions). Differences:
 *
 *   - Key is the MCP session ID minted by the SDK transport, not an
 *     opaque bearer token we hand the client.
 *   - No TTL tracking: the mapping lives and dies with the transport,
 *     and the server's process memory. A stale-sweep function is
 *     provided mainly as a kill-switch for tests.
 *   - Stateless MCP mode (`sessionIdGenerator: undefined`) doesn't use
 *     this module — `extra.sessionId` is undefined, and we fall back to
 *     env-default credentials just like stdio without login.
 *
 * Storage: in-memory `Map`. HTTP mode is single-process today; swap for
 * SQLite if we ever need multi-instance.
 */

export interface McpSession {
  /** OpenEMIS username tied to this MCP session. */
  username: string;
  /** Wall-clock ms of the login call. Diagnostic only. */
  loggedInAt: number;
}

const sessions = new Map<string, McpSession>();

/**
 * Pin an MCP session to a username. Replaces any prior mapping for the
 * same session ID (a client that logs in twice on one session keeps the
 * latest identity).
 */
export function setMcpSessionUser(sessionId: string, username: string): void {
  sessions.set(sessionId, { username, loggedInAt: Date.now() });
}

/**
 * Resolve the username for an MCP session, or `null` when the session
 * has never logged in (falls back to env-default credentials).
 */
export function getMcpSessionUser(sessionId: string): string | null {
  return sessions.get(sessionId)?.username ?? null;
}

/**
 * Inspect the full session row. Returned object is shared state — do
 * NOT mutate. Exposed for `openemis_whoami` so it can surface the
 * login timestamp without a second Map lookup.
 */
export function getMcpSession(sessionId: string): McpSession | null {
  return sessions.get(sessionId) ?? null;
}

/**
 * Drop the mapping. Called from `openemis_logout` and from the
 * transport's `onclose` handler when a session ends.
 * Returns `true` if a mapping existed.
 */
export function clearMcpSessionUser(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

/** Test-only — wipe the store between tests. */
export function _clearAllMcpSessions(): void {
  sessions.clear();
}

/** Test-only — inspect the store size. */
export function _mcpSessionCount(): number {
  return sessions.size;
}
