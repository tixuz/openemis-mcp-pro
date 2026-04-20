/**
 * Tool-handler wrapper that records every invocation to the SQLite audit log.
 *
 * Wraps the handler with try/finally so:
 *   - Successful calls are logged with ok=true.
 *   - Thrown errors are logged with ok=false and a SCRUBBED message, then re-thrown.
 *   - MCP-protocol "soft failures" (result.isError === true) are also marked ok=false.
 *
 * Two scrubbing passes before anything lands in SQLite:
 *   1. `redact()` — drops sensitive KEYS (password, jwt, token, authorization, ...)
 *   2. `scrubSecrets()` — regex-masks JWT-shaped substrings and Bearer preambles
 *      inside the serialized args and the thrown error message.
 *
 * Result: a prompt-injected conversation that makes a tool throw with a
 * JWT in the message cannot exfiltrate that JWT via the audit trail.
 */

import type { AuthStore } from "./store.js";
import { redact, scrubSecrets } from "./redact.js";

// Re-export for backward compatibility with existing imports/tests.
export { redact, scrubSecrets };

/**
 * Wrap an MCP tool handler so every call is recorded to `store`.
 *
 * @param toolName - the MCP tool name (e.g. "openemis_get")
 * @param handler  - the original async handler returned by tool factories
 * @param store    - SQLite audit store; if null, returns the handler unchanged
 * @param getCurrentUser - fn to read the process-local current user
 *
 * The returned wrapper preserves MCP's `(args, extra)` calling convention.
 * `extra` is the `RequestHandlerExtra` object the SDK passes in — it carries
 * the MCP `sessionId` (HTTP stateful mode), the request signal, and the
 * per-request `sendNotification` callback. Auth tools need `extra.sessionId`
 * to pin a user to an MCP session over HTTP; zero-arg tools can ignore it.
 *
 * Generics preserve BOTH the handler's `Args` and its full return shape so
 * MCP's `ToolCallback` inference keeps working at the registration site. We
 * don't constrain `R` because MCP handlers return structured content objects
 * whose shape varies per tool — over-constraining would reject valid handlers.
 */
export function wrapHandler<Args, R>(
  toolName: string,
  handler: (args: Args, extra?: unknown) => Promise<R>,
  store: AuthStore | null,
  getCurrentUser: () => string | null
): (args: Args, extra?: unknown) => Promise<R> {
  if (!store) return handler;

  return async (args: Args, extra?: unknown): Promise<R> => {
    const t0 = Date.now();
    const ts = new Date().toISOString();
    const user = getCurrentUser() ?? "(env)";
    let ok = true;
    let error: string | null = null;

    try {
      const result = await handler(args, extra);
      // MCP tools can succeed at the protocol layer but signal failure via isError
      if (
        result &&
        typeof result === "object" &&
        (result as { isError?: boolean }).isError === true
      ) {
        ok = false;
        error = "tool reported isError=true";
      }
      return result;
    } catch (err) {
      ok = false;
      const raw = err instanceof Error ? err.message : String(err);
      // Scrub JWT/bearer substrings from the message before it hits the log.
      // The thrown error propagates to the LLM verbatim (caller needs the real
      // message) — the scrub is for the PERSISTENT audit trail only.
      error = scrubSecrets(raw);
      throw err;
    } finally {
      try {
        store.logCall({
          ts,
          username: user,
          tool: toolName,
          // redact() deep-scrubs keys AND string values, so a JWT passed as a
          // `token` arg or embedded in a free-text field is masked either way.
          argsJson: JSON.stringify(redact(args)),
          ok,
          error,
          durationMs: Date.now() - t0,
        });
      } catch {
        // Auditing must never break a live call. Silently swallow log errors.
      }
    }
  };
}
