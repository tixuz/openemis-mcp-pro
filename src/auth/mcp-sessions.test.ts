/**
 * Unit tests for the MCP session → user map used by the HTTP stateful
 * transport. Mirrors the surface of http-sessions.test.ts but without a
 * TTL component — MCP sessions live as long as the transport.
 */

import { beforeEach, describe, expect, it } from "vitest";
import {
  _clearAllMcpSessions,
  _mcpSessionCount,
  clearMcpSessionUser,
  getMcpSession,
  getMcpSessionUser,
  setMcpSessionUser,
} from "./mcp-sessions.js";

beforeEach(() => {
  _clearAllMcpSessions();
});

describe("mcp-sessions store", () => {
  it("returns null for an unknown session ID", () => {
    expect(getMcpSessionUser("nope")).toBeNull();
    expect(getMcpSession("nope")).toBeNull();
  });

  it("maps session ID to username after setMcpSessionUser", () => {
    setMcpSessionUser("sid-1", "alice");
    expect(getMcpSessionUser("sid-1")).toBe("alice");
    expect(_mcpSessionCount()).toBe(1);
  });

  it("surfaces a login timestamp via getMcpSession", () => {
    const before = Date.now();
    setMcpSessionUser("sid-1", "alice");
    const row = getMcpSession("sid-1");
    expect(row).not.toBeNull();
    expect(row?.username).toBe("alice");
    expect(row?.loggedInAt).toBeGreaterThanOrEqual(before);
    expect(row?.loggedInAt).toBeLessThanOrEqual(Date.now());
  });

  it("keeps sessions independent across session IDs", () => {
    setMcpSessionUser("sid-1", "alice");
    setMcpSessionUser("sid-2", "bob");
    expect(getMcpSessionUser("sid-1")).toBe("alice");
    expect(getMcpSessionUser("sid-2")).toBe("bob");
    expect(_mcpSessionCount()).toBe(2);
  });

  it("replaces the username when the same session logs in again", () => {
    setMcpSessionUser("sid-1", "alice");
    setMcpSessionUser("sid-1", "bob");
    expect(getMcpSessionUser("sid-1")).toBe("bob");
    expect(_mcpSessionCount()).toBe(1);
  });

  it("clearMcpSessionUser returns true for known sessions, false otherwise", () => {
    setMcpSessionUser("sid-1", "alice");
    expect(clearMcpSessionUser("sid-1")).toBe(true);
    expect(getMcpSessionUser("sid-1")).toBeNull();
    expect(clearMcpSessionUser("sid-1")).toBe(false);
  });

  it("_clearAllMcpSessions wipes every entry", () => {
    setMcpSessionUser("sid-1", "alice");
    setMcpSessionUser("sid-2", "bob");
    expect(_mcpSessionCount()).toBe(2);
    _clearAllMcpSessions();
    expect(_mcpSessionCount()).toBe(0);
    expect(getMcpSessionUser("sid-1")).toBeNull();
    expect(getMcpSessionUser("sid-2")).toBeNull();
  });
});
