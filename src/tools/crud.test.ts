import { describe, it, expect, vi } from "vitest";
import { createOpenemisGetHandler } from "./crud.js";
import type { OpenemisClient } from "../types.js";

// ── helpers ───────────────────────────────────────────────────────────────────

/** Build a minimal mock client whose .get() you can control per-test. */
function makeClient(getFn: (...args: unknown[]) => unknown): OpenemisClient {
  return {
    get: vi.fn(getFn),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    getToken: vi.fn(),
  } as unknown as OpenemisClient;
}

/** Parse the JSON text from the first content block. */
function parseResult(result: { content: { text: string }[] }) {
  return JSON.parse(result.content[0].text);
}

/**
 * Extract the id from a path like "/api/v5/security-users/42" → 42.
 * Fan-out now uses path-based lookup (GET /resource/{id}), not ?id= query param.
 */
function idFromPath(path: unknown): number {
  return Number(String(path).split("/").pop());
}

// ── ids= fan-out ──────────────────────────────────────────────────────────────

describe("openemis_get ids= fan-out", () => {
  it("all succeed: returns data array with requested/returned counts, no failed_ids", async () => {
    const client = makeClient((path: unknown) => {
      const id = idFromPath(path);
      return Promise.resolve({ data: { id, name: `User ${id}` } });
    });
    const handler = createOpenemisGetHandler(client);

    const result = parseResult(
      await handler({
        resource: "security-users",
        params: { ids: "10,20,30" },
      })
    );

    expect(result.requested).toBe(3);
    expect(result.returned).toBe(3);
    expect(result.data).toHaveLength(3);
    expect(result.data.map((r: { id: number }) => r.id)).toEqual(
      expect.arrayContaining([10, 20, 30])
    );
    expect(result.failed_ids).toBeUndefined();
  });

  it("partial failure: failed_ids lists only the failing IDs", async () => {
    const FAIL_ID = 20;
    const client = makeClient((path: unknown) => {
      const id = idFromPath(path);
      if (id === FAIL_ID) return Promise.reject(new Error("404 not found"));
      return Promise.resolve({ data: { id, name: `User ${id}` } });
    });
    const handler = createOpenemisGetHandler(client);

    const result = parseResult(
      await handler({
        resource: "security-users",
        params: { ids: "10,20,30" },
      })
    );

    expect(result.requested).toBe(3);
    expect(result.returned).toBe(2);
    expect(result.failed_ids).toEqual([FAIL_ID]);
    expect(result.data.map((r: { id: number }) => r.id)).toEqual(
      expect.arrayContaining([10, 30])
    );
  });

  it("all fail: returns empty data with all IDs in failed_ids", async () => {
    const client = makeClient(() => Promise.reject(new Error("server error")));
    const handler = createOpenemisGetHandler(client);

    const result = parseResult(
      await handler({
        resource: "security-users",
        params: { ids: "1,2,3" },
      })
    );

    expect(result.requested).toBe(3);
    expect(result.returned).toBe(0);
    expect(result.data).toEqual([]);
    expect(result.failed_ids).toEqual([1, 2, 3]);
  });

  it("non-integer and non-positive IDs filtered out (floats, zero, negative, strings)", async () => {
    const client = makeClient((path: unknown) => {
      const id = idFromPath(path);
      return Promise.resolve({ data: { id } });
    });
    const handler = createOpenemisGetHandler(client);

    // "abc" → NaN; "1.5" → float, not integer; "0" → not > 0; "-3" → negative
    // only 5 and 7 are valid positive integers
    const result = parseResult(
      await handler({
        resource: "security-users",
        params: { ids: "abc,5,1.5,7,0,-3" },
      })
    );

    expect(result.requested).toBe(2);
    expect(result.returned).toBe(2);
  });

  it("caps fan-out at 100 IDs even if more are supplied", async () => {
    let callCount = 0;
    const client = makeClient((path: unknown) => {
      callCount++;
      const id = idFromPath(path);
      return Promise.resolve({ data: { id } });
    });
    const handler = createOpenemisGetHandler(client);

    const manyIds = Array.from({ length: 150 }, (_, i) => i + 1).join(",");
    const result = parseResult(
      await handler({ resource: "security-users", params: { ids: manyIds } })
    );

    expect(callCount).toBe(100);
    expect(result.requested).toBe(100);
    expect(result.returned).toBe(100);
  });

  it("empty ids string skips fan-out and falls through to normal list call", async () => {
    const listResponse = { message: "ok", data: [{ id: 1 }] };
    const client = makeClient(() => Promise.resolve(listResponse));
    const handler = createOpenemisGetHandler(client);

    // ids= whitespace string — should NOT use fan-out; falls through to normal list
    const result = parseResult(
      await handler({ resource: "security-users", params: { ids: "   " } })
    );

    // Normal list response: no requested/returned keys
    expect(result).not.toHaveProperty("requested");
    expect((client.get as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(
      "/api/v5/security-users"
    );
  });

  it("fan-out uses path-based GET /resource/{id} not query-param ?id=", async () => {
    const calledPaths: string[] = [];
    const client = makeClient((path: unknown) => {
      calledPaths.push(String(path));
      const id = idFromPath(path);
      return Promise.resolve({ data: { id } });
    });
    const handler = createOpenemisGetHandler(client);

    await handler({ resource: "security-users", params: { ids: "11,22" } });

    expect(calledPaths).toContain("/api/v5/security-users/11");
    expect(calledPaths).toContain("/api/v5/security-users/22");
  });

  it("unwraps { data: {...} } envelope for each ID in the result array", async () => {
    const client = makeClient((path: unknown) => {
      const id = idFromPath(path);
      return Promise.resolve({ message: "ok", data: { id, first_name: `Student${id}` } });
    });
    const handler = createOpenemisGetHandler(client);

    const result = parseResult(
      await handler({ resource: "security-users", params: { ids: "11,22" } })
    );

    expect(result.data).toHaveLength(2);
    // Records should be the unwrapped objects, not the outer envelope
    expect(result.data[0]).toHaveProperty("first_name");
    expect(result.data[0]).not.toHaveProperty("message");
  });

  it("when id= is given alongside ids=, uses the single-record path not fan-out", async () => {
    const singleResponse = { message: "ok", data: { id: 5 } };
    const client = makeClient(() => Promise.resolve(singleResponse));
    const handler = createOpenemisGetHandler(client);

    const result = parseResult(
      await handler({ resource: "security-users", id: 5, params: { ids: "1,2,3" } })
    );

    // id= takes priority — no fan-out structure
    expect(result).not.toHaveProperty("requested");
    expect((client.get as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(
      "/api/v5/security-users/5"
    );
  });
});
