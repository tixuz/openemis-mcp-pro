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

// ── ids= fan-out ──────────────────────────────────────────────────────────────

describe("openemis_get ids= fan-out", () => {
  it("all succeed: returns data array with requested/returned counts, no failed_ids", async () => {
    const client = makeClient((_path: unknown, opts: unknown) => {
      const id = (opts as Record<string, unknown>).id as number;
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
    const client = makeClient((_path: unknown, opts: unknown) => {
      const id = (opts as Record<string, unknown>).id as number;
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

  it("non-integer IDs are filtered out before the fan-out", async () => {
    const client = makeClient((_path: unknown, opts: unknown) => {
      const id = (opts as Record<string, unknown>).id as number;
      return Promise.resolve({ data: { id } });
    });
    const handler = createOpenemisGetHandler(client);

    const result = parseResult(
      await handler({
        resource: "security-users",
        params: { ids: "abc,5,1.5,7,0,-3" }, // only 5 and 7 are valid positive integers
      })
    );

    expect(result.requested).toBe(2);   // only 5 and 7 passed the filter
    expect(result.returned).toBe(2);
  });

  it("caps fan-out at 100 IDs even if more are supplied", async () => {
    let callCount = 0;
    const client = makeClient((_path: unknown, opts: unknown) => {
      callCount++;
      const id = (opts as Record<string, unknown>).id as number;
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

    // ids= empty string — should NOT use fan-out, should call the list endpoint normally
    const result = parseResult(
      await handler({ resource: "security-users", params: { ids: "   " } })
    );

    // Normal list response passes through normalizeResponse; data should be the array
    expect(result).not.toHaveProperty("requested");
    expect((client.get as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(
      "/api/v5/security-users"
    );
  });

  it("unwraps { data: {...} } envelope for each ID in the result array", async () => {
    const client = makeClient((_path: unknown, opts: unknown) => {
      const id = (opts as Record<string, unknown>).id as number;
      // Single-record response wrapped in OpenEMIS envelope
      return Promise.resolve({ message: "ok", data: { id, first_name: `Student${id}` } });
    });
    const handler = createOpenemisGetHandler(client);

    const result = parseResult(
      await handler({ resource: "security-users", params: { ids: "11,22" } })
    );

    expect(result.data).toHaveLength(2);
    // Records should be the unwrapped objects, not the envelope
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

    // id= takes priority: should NOT have the requested/returned structure
    expect(result).not.toHaveProperty("requested");
    expect((client.get as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(
      "/api/v5/security-users/5"
    );
  });
});
