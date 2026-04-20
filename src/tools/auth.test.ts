/**
 * Tests for the mode-aware auth tools (openemis_login / logout / whoami).
 *
 * These handlers share a single factory but branch at runtime based on
 * whether the MCP SDK passes an `extra.sessionId` (HTTP stateful) or not
 * (stdio). The tests exercise both branches to make sure:
 *
 *   - stdio: module-global `currentUser` is the source of truth.
 *   - HTTP:  the `mcp-sessions` map is the source of truth; the
 *     module-global is untouched so another stdio process on the same
 *     machine isn't contaminated.
 *   - error surfaces never leak credentials.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createOpenemisLoginHandler,
  createOpenemisLogoutHandler,
  createOpenemisWhoamiHandler,
} from "./auth.js";
import {
  _clearAllMcpSessions,
  _mcpSessionCount,
  getMcpSessionUser,
  setMcpSessionUser,
} from "../auth/mcp-sessions.js";
import {
  clearCurrentUser,
  getCurrentUser,
  setCurrentUser,
} from "../auth/session.js";
import type { AppConfig } from "../config.js";

// Narrow client stub — only `loginAs` is exercised by these tests.
function makeClient() {
  return {
    loginAs: vi.fn(async (_u: string, _p: string) => "fake-jwt"),
  } as unknown as import("../openemis.js").OpenemisClientImpl;
}

function makeConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    baseUrl: "https://openemis.example/api",
    username: "env-admin",
    password: "env-secret",
    apiKey: null,
    authDbPath: ":memory:",
    manifestPath: "/dev/null",
    transport: "stdio",
    port: 0,
    authToken: null,
    authLogDir: "/tmp",
    ...overrides,
  } as AppConfig;
}

beforeEach(() => {
  clearCurrentUser();
  _clearAllMcpSessions();
});

afterEach(() => {
  clearCurrentUser();
  _clearAllMcpSessions();
});

describe("createOpenemisLoginHandler — stdio mode (no extra.sessionId)", () => {
  it("logs in upstream and pins the module-global user", async () => {
    const client = makeClient();
    const handler = createOpenemisLoginHandler(client);

    const result = await handler({ username: "alice", password: "hunter2" });

    expect(client.loginAs).toHaveBeenCalledWith("alice", "hunter2");
    expect(getCurrentUser()).toBe("alice");
    expect(_mcpSessionCount()).toBe(0);
    expect(result.structuredContent).toMatchObject({
      ok: true,
      username: "alice",
      mode: "stdio",
    });
  });

  it("works when extra is passed but lacks a sessionId", async () => {
    const client = makeClient();
    const handler = createOpenemisLoginHandler(client);

    await handler({ username: "alice", password: "hunter2" }, { other: "field" });

    expect(getCurrentUser()).toBe("alice");
    expect(_mcpSessionCount()).toBe(0);
  });
});

describe("createOpenemisLoginHandler — HTTP mode (extra.sessionId present)", () => {
  it("pins to the mcp-session map and leaves module-global alone", async () => {
    const client = makeClient();
    const handler = createOpenemisLoginHandler(client);

    const result = await handler(
      { username: "alice", password: "hunter2" },
      { sessionId: "mcp-sid-42" },
    );

    expect(client.loginAs).toHaveBeenCalledWith("alice", "hunter2");
    expect(getMcpSessionUser("mcp-sid-42")).toBe("alice");
    // Module-global MUST stay null so this HTTP login can't bleed into a
    // co-resident stdio worker's identity.
    expect(getCurrentUser()).toBeNull();
    expect(result.structuredContent).toMatchObject({
      ok: true,
      username: "alice",
      mode: "mcp-http",
    });
  });

  it("two sessions on the same server stay isolated", async () => {
    const client = makeClient();
    const handler = createOpenemisLoginHandler(client);

    await handler({ username: "alice", password: "a" }, { sessionId: "sid-a" });
    await handler({ username: "bob",   password: "b" }, { sessionId: "sid-b" });

    expect(getMcpSessionUser("sid-a")).toBe("alice");
    expect(getMcpSessionUser("sid-b")).toBe("bob");
    expect(getCurrentUser()).toBeNull();
  });

  it("treats empty-string sessionId as stdio (defensive)", async () => {
    const client = makeClient();
    const handler = createOpenemisLoginHandler(client);

    await handler(
      { username: "alice", password: "hunter2" },
      { sessionId: "" },
    );

    expect(getCurrentUser()).toBe("alice");
    expect(_mcpSessionCount()).toBe(0);
  });
});

describe("createOpenemisLoginHandler — error path", () => {
  it("returns isError=true and scrubs bearer tokens from the message", async () => {
    const client = {
      loginAs: vi.fn(async () => {
        throw new Error(
          "upstream rejected: Authorization: Bearer aaa.bbb.ccc",
        );
      }),
    } as unknown as import("../openemis.js").OpenemisClientImpl;

    const handler = createOpenemisLoginHandler(client);
    const result = await handler(
      { username: "alice", password: "hunter2" },
      { sessionId: "sid-x" },
    );

    expect(result.isError).toBe(true);
    const text = (result.content?.[0] as { text: string }).text;
    // The JWT-shaped string should be scrubbed.
    expect(text).not.toMatch(/aaa\.bbb\.ccc/);
    // And the username must NOT be treated as unbounded LLM-supplied data —
    // it should survive in the error envelope so the caller knows what failed.
    expect(text).toContain("alice");
    // No side-effects on failure.
    expect(getCurrentUser()).toBeNull();
    expect(_mcpSessionCount()).toBe(0);
  });
});

describe("createOpenemisLogoutHandler", () => {
  it("stdio: clears the module-global and reports the prior user", async () => {
    setCurrentUser("alice");
    const handler = createOpenemisLogoutHandler();

    const result = await handler({});

    expect(getCurrentUser()).toBeNull();
    expect(result.structuredContent).toMatchObject({
      ok: true,
      wasLoggedIn: true,
      previousUser: "alice",
      mode: "stdio",
    });
  });

  it("stdio: wasLoggedIn=false when no prior login", async () => {
    const handler = createOpenemisLogoutHandler();
    const result = await handler({});

    expect(result.structuredContent).toMatchObject({
      ok: true,
      wasLoggedIn: false,
      previousUser: null,
      mode: "stdio",
    });
  });

  it("HTTP: clears only the caller's mcp-session map entry", async () => {
    setMcpSessionUser("sid-a", "alice");
    setMcpSessionUser("sid-b", "bob");
    const handler = createOpenemisLogoutHandler();

    const result = await handler({}, { sessionId: "sid-a" });

    expect(getMcpSessionUser("sid-a")).toBeNull();
    expect(getMcpSessionUser("sid-b")).toBe("bob");
    expect(result.structuredContent).toMatchObject({
      ok: true,
      wasLoggedIn: true,
      mode: "mcp-http",
    });
  });

  it("HTTP: wasLoggedIn=false when the session never logged in", async () => {
    const handler = createOpenemisLogoutHandler();
    const result = await handler({}, { sessionId: "sid-unknown" });

    expect(result.structuredContent).toMatchObject({
      ok: true,
      wasLoggedIn: false,
      previousUser: null,
      mode: "mcp-http",
    });
  });
});

describe("createOpenemisWhoamiHandler", () => {
  it("reports env-default when no login happened", async () => {
    const handler = createOpenemisWhoamiHandler(makeConfig(), null);
    const result = await handler({});

    expect(result.structuredContent).toMatchObject({
      mode: "env-default",
      username: "env-admin",
      baseUrl: "https://openemis.example/api",
    });
  });

  it("reports per-user (stdio) when module-global is set", async () => {
    setCurrentUser("alice");
    const handler = createOpenemisWhoamiHandler(makeConfig(), null);
    const result = await handler({});

    expect(result.structuredContent).toMatchObject({
      mode: "per-user",
      username: "alice",
    });
  });

  it("reports mcp-http when the caller's session is pinned", async () => {
    setMcpSessionUser("sid-42", "alice");
    const handler = createOpenemisWhoamiHandler(makeConfig(), null);
    const result = await handler({}, { sessionId: "sid-42" });

    expect(result.structuredContent).toMatchObject({
      mode: "mcp-http",
      username: "alice",
    });
    const text = (result.content?.[0] as { text: string }).text;
    expect(text).toContain("mcp-http");
  });

  it("falls back to env-default when HTTP session isn't pinned", async () => {
    const handler = createOpenemisWhoamiHandler(makeConfig(), null);
    const result = await handler({}, { sessionId: "sid-unknown" });

    expect(result.structuredContent).toMatchObject({
      mode: "env-default",
      username: "env-admin",
    });
  });

  it("never leaks a JWT even if the AuthStore row carries one", async () => {
    // Mock store that returns a row with a token — the handler must not
    // surface it. (Belt-and-braces — session.ts never asks for the JWT,
    // but AuthStore.getUser does hand back the row.)
    const store = {
      getUser: vi.fn(() => ({
        username: "alice",
        jwt: "abc.def.ghi",
        lastUsedAt: "2026-04-20T00:00:00Z",
      })),
    } as unknown as import("../auth/store.js").AuthStore;

    setCurrentUser("alice");
    const handler = createOpenemisWhoamiHandler(makeConfig(), store);
    const result = await handler({});

    const text = (result.content?.[0] as { text: string }).text;
    expect(text).not.toContain("abc.def.ghi");
    expect(text).toContain("Last used: 2026-04-20T00:00:00Z");
    expect(result.structuredContent).toMatchObject({
      username: "alice",
      lastUsedAt: "2026-04-20T00:00:00Z",
    });
    // Structured content must not carry a jwt field.
    expect(
      Object.keys(result.structuredContent ?? {}),
    ).not.toContain("jwt");
  });
});
