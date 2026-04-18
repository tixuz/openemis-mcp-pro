import type { AppConfig } from "./config.js";
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
 * Fetch-based HTTP client for OpenEMIS API.
 * Implements lazy login with JWT caching: first request triggers login, token is cached,
 * 401 responses invalidate the cache and retry once.
 */
export class OpenemisClientImpl implements OpenemisClient {
  private cfg: AppConfig;
  private cachedToken: string | null = null;

  constructor(cfg: AppConfig) {
    this.cfg = cfg;
  }

  /**
   * Authenticate with OpenEMIS and return JWT bearer token.
   * POST /api/v5/login with username, password, api_key.
   * Response: { message: string, data: { token: string, client_id?: string } }
   * (v4 and v5 both answer this endpoint; we use v5 for API-version consistency.)
   */
  async login(): Promise<string> {
    if (!this.cfg.username || !this.cfg.password || !this.cfg.apiKey) {
      throw new Error(
        "Missing credentials: OPENEMIS_USERNAME, OPENEMIS_PASSWORD, and OPENEMIS_API_KEY are required"
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
        throw new Error(
          `OpenEMIS login failed [${response.status}]: ${errorMsg}`
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
      console.log(
        `[OpenEMIS] Login successful; cached JWT (${token.length} chars)`
      );
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
   * Get cached JWT or log in if missing/expired.
   */
  async getToken(): Promise<string> {
    if (this.cachedToken) {
      return this.cachedToken;
    }
    return this.login();
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

        throw new Error(
          `OpenEMIS API error [${errorPayload.status}]: ${errorMessage}`
        );
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
