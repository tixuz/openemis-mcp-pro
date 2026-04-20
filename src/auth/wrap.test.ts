/**
 * Tests for the tool-logging wrapper:
 *   - `redact` replaces sensitive keys with "[redacted]"
 *   - `wrapHandler` passes through when no store, records success + error paths,
 *     honours isError=true, never swallows throws.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { AuthStore } from "./store.js";
import { redact, wrapHandler } from "./wrap.js";

describe("redact", () => {
  it("replaces password / pwd / secret / api_key / apiKey", () => {
    const input = {
      username: "alice",
      password: "p",
      pwd: "q",
      secret: "s",
      api_key: "k",
      apiKey: "k2",
      nested: { password: "deep" },
    };
    expect(redact(input)).toEqual({
      username: "alice",
      password: "[redacted]",
      pwd: "[redacted]",
      secret: "[redacted]",
      api_key: "[redacted]",
      apiKey: "[redacted]",
      nested: { password: "[redacted]" },
    });
  });

  it("handles arrays and primitives", () => {
    expect(redact([{ password: "p" }, "str", 42, null])).toEqual([
      { password: "[redacted]" },
      "str",
      42,
      null,
    ]);
  });

  it("leaves plain objects alone when no sensitive keys are present", () => {
    expect(redact({ resource: "users", id: 1 })).toEqual({
      resource: "users",
      id: 1,
    });
  });
});

describe("wrapHandler", () => {
  let tmpDir: string;
  let store: AuthStore;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "openemis-wrap-test-"));
    store = new AuthStore({ dbPath: join(tmpDir, "auth.db") });
  });

  afterEach(() => {
    store.close();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it("is a pass-through when store is null (HTTP mode)", async () => {
    const inner = vi.fn(async () => ({ content: [{ type: "text", text: "ok" }] }));
    const wrapped = wrapHandler("my_tool", inner, null, () => null);
    const result = await wrapped({ foo: 1 } as unknown as never);
    expect(inner).toHaveBeenCalledWith({ foo: 1 });
    expect(result).toEqual({ content: [{ type: "text", text: "ok" }] });
  });

  it("logs a success row", async () => {
    const logSpy = vi.spyOn(store, "logCall");
    const inner = async () => ({ content: [{ type: "text", text: "hi" }] });

    const wrapped = wrapHandler("openemis_get", inner, store, () => "alice");
    await wrapped({ resource: "users", id: 1 } as unknown as never);

    expect(logSpy).toHaveBeenCalledTimes(1);
    const entry = logSpy.mock.calls[0][0];
    expect(entry.tool).toBe("openemis_get");
    expect(entry.username).toBe("alice");
    expect(entry.ok).toBe(true);
    expect(entry.error).toBeNull();
    expect(JSON.parse(entry.argsJson ?? "{}")).toEqual({
      resource: "users",
      id: 1,
    });
  });

  it("logs (env) when no user is set", async () => {
    const logSpy = vi.spyOn(store, "logCall");
    const wrapped = wrapHandler(
      "openemis_health",
      async () => ({ content: [] }),
      store,
      () => null
    );
    await wrapped({} as never);
    expect(logSpy.mock.calls[0][0].username).toBe("(env)");
  });

  it("redacts passwords before they hit the DB", async () => {
    const logSpy = vi.spyOn(store, "logCall");
    const wrapped = wrapHandler(
      "openemis_login",
      async () => ({ content: [] }),
      store,
      () => null
    );
    await wrapped({ username: "alice", password: "hunter2" } as never);

    const args = JSON.parse(logSpy.mock.calls[0][0].argsJson ?? "{}");
    expect(args.password).toBe("[redacted]");
    expect(args.username).toBe("alice");
  });

  it("records ok=false + error and re-throws when the handler throws", async () => {
    const logSpy = vi.spyOn(store, "logCall");
    const wrapped = wrapHandler(
      "openemis_get",
      async () => {
        throw new Error("boom");
      },
      store,
      () => "alice"
    );
    await expect(wrapped({} as never)).rejects.toThrow("boom");
    const entry = logSpy.mock.calls[0][0];
    expect(entry.ok).toBe(false);
    expect(entry.error).toBe("boom");
  });

  it("records ok=false when the handler sets isError=true", async () => {
    const logSpy = vi.spyOn(store, "logCall");
    const wrapped = wrapHandler(
      "openemis_update",
      async () => ({ content: [], isError: true }),
      store,
      () => "alice"
    );
    const result = await wrapped({} as never);
    expect(result.isError).toBe(true);
    expect(logSpy.mock.calls[0][0].ok).toBe(false);
    expect(logSpy.mock.calls[0][0].error).toBe("tool reported isError=true");
  });

  it("never lets an audit failure break the real call", async () => {
    // Close the store to guarantee logCall throws
    store.close();
    const wrapped = wrapHandler(
      "openemis_get",
      async () => ({ content: [{ type: "text", text: "ok" }] }),
      store,
      () => "alice"
    );
    const result = await wrapped({} as never);
    expect(result).toEqual({ content: [{ type: "text", text: "ok" }] });
  });
});
