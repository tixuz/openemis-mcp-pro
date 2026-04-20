import type { AppConfig } from "./config.js";
import type { AuthStore } from "./auth/store.js";
import { LoginRateLimiter } from "./auth/rate-limit.js";
import { scrubSecrets } from "./auth/redact.js";
import type { OpenemisClient, OpenemisErrorPayload } from "./types.js";

/**
 * Join a base URL (which may itself contain a path, e.g. ".../core") with
 * an additional path. Avoids the `new URL(path, base)` trap where an
 * absolute `path` replaces the base's path component.
 */
function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return b + p;
}

/**
 * Optional dependencies injected for per-user login (stdio mode only).
 * - `store` persists per-user JWTs across calls within a process.
 * - `getCurrentUser` returns the active user, or null for env-default.
 * Omitting both keeps the classic env-only behaviour untouched.
 */
export interface OpenemisClientDeps {
  store?: AuthStore | null;
  getCurrentUser?: () => string | null;
}

/**
 * Fetch-based HTTP client for OpenEMIS API.
 *
 * Two auth modes:
 *   1. **Env-default** (classic) — uses OPENEMIS_USERNAME/PASSWORD from
 *      config; JWT cached in memory, invalidated + retried on 401.
 *   2. **Per-user** (stdio only) — if `getCurrentUser()` returns a username,
 *      the JWT is read from `store`. Re-login requires the password, which
 *      we never store, so a 401 under per-user mode clears the JWT and
 *      surfaces a "please re-login" error to the client.
 *
 * The mode is selected per request at token-resolution time, so switching
 * users via `openemis_login` / `openemis_logout` takes effect immediately.
 */
export class OpenemisClientImpl implements OpenemisClient {
  private cfg: AppConfig;
  private cachedToken: string | null = null;
  private readonly store: AuthStore | null;
  private readonly getCurrentUser: () => string | null;
  /**
   * Process-local rate limiter on `loginAs`. Caps the damage a prompt-injected
   * conversation can do by looping login attempts with guessed passwords.
   * Successful logins reset the counter; 5 failures / 60s returns a hard error.
   */
  private readonly loginRateLimiter = new LoginRateLimiter();

  constructor(cfg: AppConfig, deps: OpenemisClientDeps = {}) {
    this.cfg = cfg;
    this.store = deps.store ?? null;
    this.getCurrentUser = deps.getCurrentUser ?? (() => null);
  }

  /**
   * Authenticate with OpenEMIS and return JWT bearer token.
   * POST /api/v5/login with username, password, api_key.
   * Response: { message: string, data: { token: string, client_id?: string } }
   * (v4 and v5 both answer this endpoint; we use v5 for API-version consistency.)
   */
  async login(): Promise<string> {
    if (!this.cfg.apiKey) {
      // api_key is shared infrastructure — server is mis-deployed if this is missing.
      throw new Error(
        "Server misconfigured: OPENEMIS_API_KEY is not set. Contact the administrator."
      );
    }
    if (!this.cfg.username || !this.cfg.password) {
      // Fail closed: env-default identity is opt-in. Without it, every caller
      // MUST authenticate explicitly — the correct posture for a public
      // deployment. Prefix with [401] so the REST layer's error→status
      // mapper returns a proper Unauthorized response rather than 500.
      // Message branches on restLoginEnabled so a gated-mode caller is never
      // pointed at POST /api/auth/login (which returns 410 in that mode).
      const perUserHint = this.cfg.restLoginEnabled
        ? "Call openemis_login (MCP) or POST /api/auth/login (REST) to authenticate as a specific OpenEMIS user."
        : "Connect via the MCP channel at /mcp and call the openemis_login tool — REST per-user login is disabled on this deployment. GET /api/auth/whoami confirms the current auth posture.";
      throw new Error(
        `Not authenticated [401]: this server requires per-user login. ${perUserHint}`
      );
    }

    const url = joinUrl(this.cfg.baseUrl, "/api/v5/login");
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.cfg.timeoutMs
    );

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.cfg.username,
          password: this.cfg.password,
          api_key: this.cfg.apiKey,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `HTTP ${response.status}`;
        try {
          const json = await response.json();
          errorMsg = json.message || json.error || errorMsg;
        } catch {
          // Non-JSON error
        }
        // Scrub any token echoed back by the upstream before surfacing.
        throw new Error(
          scrubSecrets(
            `OpenEMIS login failed [${response.status}]: ${errorMsg}`
          )
        );
      }

      const json = (await response.json()) as {
        data?: { token: string };
      };
      const token = json.data?.token;

      if (!token) {
        throw new Error("Login succeeded but response missing token");
      }

      this.cachedToken = token;
      // Intentionally do NOT log the token or its length — even a length
      // can hint at token shape. One bit of signal ("we cached it") is enough.
      console.error(`[OpenEMIS] Login successful; JWT cached in memory`);
      return token;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(
          `OpenEMIS login timed out after ${this.cfg.timeoutMs}ms`
        );
      }

      throw err;
    }
  }

  /**
   * Resolve the bearer token for the current request.
   *
   * Decision tree:
   *   - current user set + store available → read JWT from store (or throw
   *     if it's missing — client must call `openemis_login` again).
   *   - otherwise → use env-default credentials with in-memory cache.
   */
  async getToken(): Promise<string> {
    const user = this.getCurrentUser();
    if (user && this.store) {
      const row = this.store.getUser(user);
      if (!row?.jwt) {
        throw new Error(
          `No active session for user "${user}". Call openemis_login({username, password}) — the previous JWT was cleared (likely expired).`
        );
      }
      this.store.touchUser(user);
      return row.jwt;
    }

    if (this.cachedToken) {
      return this.cachedToken;
    }
    return this.login();
  }

  /**
   * Per-user login. POSTs to /api/v5/login with the supplied username +
   * password (and the shared api_key from env), then persists the JWT in
   * the auth store. Only meaningful in stdio mode.
   *
   * The password is NOT stored — we keep only the returned JWT. If the JWT
   * later expires (401), the client will ask the user to call login again.
   */
  async loginAs(username: string, password: string): Promise<string> {
    if (!this.cfg.apiKey) {
      throw new Error(
        "Missing OPENEMIS_API_KEY. The api_key is shared infrastructure — it belongs in .env."
      );
    }
    if (!this.store) {
      throw new Error(
        "Per-user login is only available in stdio mode (no auth store configured)."
      );
    }

    // Brute-force guardrail: cap failed attempts per username. Throws if the
    // caller is over quota — hits BEFORE we contact OpenEMIS so a bad actor
    // can't amplify their bandwidth at the upstream's expense either.
    this.loginRateLimiter.check(username);

    const url = joinUrl(this.cfg.baseUrl, "/api/v5/login");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.cfg.timeoutMs);

    let failed = false;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          api_key: this.cfg.apiKey,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        failed = true;
        let errorMsg = `HTTP ${response.status}`;
        try {
          const json = (await response.json()) as {
            message?: string;
            error?: string;
          };
          errorMsg = json.message || json.error || errorMsg;
        } catch {
          // Non-JSON error body — keep the HTTP status message
        }
        // Scrub any token echo from the upstream error before re-throwing.
        throw new Error(
          scrubSecrets(
            `OpenEMIS login failed for "${username}" [${response.status}]: ${errorMsg}`
          )
        );
      }

      const json = (await response.json()) as { data?: { token: string } };
      const token = json.data?.token;

      if (!token) {
        failed = true;
        throw new Error(
          `Login succeeded for "${username}" but response missing token`
        );
      }

      this.store.upsertUserJwt(username, token);
      // Successful login wipes the failure window — same-user retry after a
      // typo shouldn't carry the old failures forward.
      this.loginRateLimiter.reset(username);
      // No token or length in the console — see login() for the reasoning.
      console.error(
        `[OpenEMIS] Per-user login successful for "${username}" (JWT cached)`
      );
      return token;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === "AbortError") {
        this.loginRateLimiter.recordFailure(username);
        throw new Error(
          `OpenEMIS login timed out after ${this.cfg.timeoutMs}ms`
        );
      }

      if (failed) {
        // Only count upstream-auth failures toward the quota; network errors
        // (DNS, refused, TLS) would lock the user out of a healthy service
        // once the outage clears. Keep the quota focused on actual 4xx/5xx.
        this.loginRateLimiter.recordFailure(username);
      }
      throw err;
    }
  }

  /**
   * Normalize path: ensure it starts with /api/ prefix.
   * If path already starts with /api/, use as-is.
   * Otherwise, prepend /api/v5.
   */
  private normalizePath(path: string): string {
    if (path.startsWith("/api/")) {
      return path;
    }
    if (path.startsWith("/")) {
      return `/api/v5${path}`;
    }
    return `/api/v5/${path}`;
  }

  /**
   * Serialize query params for URL.
   * Null/undefined values are skipped.
   * Array values are joined with comma; objects are JSON-stringified.
   */
  private serializeParams(
    query: Record<string, unknown>
  ): URLSearchParams {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        params.append(key, value.join(","));
      } else if (typeof value === "object") {
        params.append(key, JSON.stringify(value));
      } else {
        params.append(key, String(value));
      }
    }

    return params;
  }

  /**
   * Build full request URL with query params.
   * Uses joinUrl() so a baseUrl that already has a path (e.g. ".../core")
   * is preserved when the path is absolute — `new URL(abs, base)` silently
   * drops the base's path component.
   */
  private buildUrl(path: string, query?: Record<string, unknown>): string {
    const normalizedPath = this.normalizePath(path);
    let full = joinUrl(this.cfg.baseUrl, normalizedPath);

    if (query) {
      const params = this.serializeParams(query);
      const qs = params.toString();
      if (qs) {
        full += (full.includes("?") ? "&" : "?") + qs;
      }
    }

    return full;
  }

  /**
   * Make an HTTP request with automatic token refresh on 401.
   * Retries once if 401, then throws if still unauthorized.
   */
  private async request(
    method: string,
    path: string,
    query?: Record<string, unknown>,
    body?: unknown,
    retryCount: number = 0
  ): Promise<unknown> {
    const token = await this.getToken();
    const url = this.buildUrl(path, query);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.cfg.timeoutMs
    );

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 401 && retryCount === 0) {
        const user = this.getCurrentUser();
        if (user && this.store) {
          // Per-user mode: we don't have the password stashed, so a 401 means
          // the stored JWT is dead and the user must log in again.
          this.store.clearUserJwt(user);
          throw new Error(
            `Session for "${user}" expired (HTTP 401). Call openemis_login({username, password}) to refresh.`
          );
        }
        // Env-default mode: invalidate in-memory cache and retry once.
        this.cachedToken = null;
        return this.request(method, path, query, body, 1);
      }

      if (!response.ok) {
        let errorPayload: OpenemisErrorPayload = {
          status: response.status,
        };

        try {
          const json = await response.json();
          errorPayload = { ...errorPayload, ...json };
        } catch {
          // Non-JSON error
        }

        const errorMessage =
          errorPayload.message ||
          errorPayload.error ||
          errorPayload.description ||
          `HTTP ${response.status}`;

        // Scrub — upstream error bodies occasionally echo the Authorization
        // header or a stale/new token. We don't want either crossing the
        // MCP boundary, where a prompt-injected caller could harvest it.
        throw new Error(
          scrubSecrets(
            `OpenEMIS API error [${errorPayload.status}]: ${errorMessage}`
          )
        );
      }

      // 204 No Content or empty body (e.g. successful DELETE / some PUTs)
      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return { ok: true };
      }

      const json = await response.json();
      return json;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(
          `OpenEMIS API request timed out after ${this.cfg.timeoutMs}ms`
        );
      }

      throw err;
    }
  }

  async get(
    path: string,
    query?: Record<string, unknown>
  ): Promise<unknown> {
    return this.request("GET", path, query);
  }

  async post(path: string, body: unknown): Promise<unknown> {
    return this.request("POST", path, undefined, body);
  }

  async put(path: string, body: unknown): Promise<unknown> {
    return this.request("PUT", path, undefined, body);
  }

  async delete(path: string): Promise<unknown> {
    return this.request("DELETE", path);
  }
}
