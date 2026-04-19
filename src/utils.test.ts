import { describe, it, expect } from "vitest";
import { normalizeResponse } from "./utils.js";

describe("normalizeResponse", () => {
  it("unwraps a paginated envelope", () => {
    const raw = {
      message: "ok",
      data: {
        current_page: 1,
        last_page: 3,
        total: 55,
        data: [{ id: 1 }, { id: 2 }],
      },
    };
    expect(normalizeResponse(raw)).toEqual({
      message: "ok",
      data: [{ id: 1 }, { id: 2 }],
      total: 55,
      current_page: 1,
      last_page: 3,
    });
  });

  it("returns a flat array response as-is", () => {
    const raw = { message: "ok", data: [{ id: 1 }] };
    expect(normalizeResponse(raw)).toBe(raw);
  });

  it("returns a single-record response as-is", () => {
    const raw = { message: "ok", data: { id: 42, name: "Avory" } };
    expect(normalizeResponse(raw)).toBe(raw);
  });

  it("returns null as-is", () => {
    expect(normalizeResponse(null)).toBeNull();
  });

  it("returns primitives as-is", () => {
    expect(normalizeResponse("hello")).toBe("hello");
    expect(normalizeResponse(123)).toBe(123);
  });

  it("handles inner data that is present but not an array (no unwrap)", () => {
    // inner.data is a nested object — should not be unwrapped
    const raw = {
      message: "ok",
      data: { id: 1, data: { nested: true } },
    };
    expect(normalizeResponse(raw)).toBe(raw);
  });
});
