import { describe, it, expect } from "vitest";
import { kebabToPascal, manifestHasMethod } from "./write.js";
import { isWorkflowBlocked } from "../policies.js";
import type { ManifestRow } from "../types.js";

// ── kebabToPascal ─────────────────────────────────────────────────────────────

describe("kebabToPascal", () => {
  it("converts a single word", () => {
    expect(kebabToPascal("students")).toBe("Students");
  });

  it("converts a multi-segment resource name", () => {
    expect(kebabToPascal("student-attendance-marked-records")).toBe(
      "StudentAttendanceMarkedRecords"
    );
  });

  it("converts a two-word name", () => {
    expect(kebabToPascal("absence-types")).toBe("AbsenceTypes");
  });

  it("handles a single-char segment gracefully", () => {
    expect(kebabToPascal("a-b-c")).toBe("ABC");
  });

  it("returns empty string for empty input", () => {
    expect(kebabToPascal("")).toBe("");
  });

  it("handles a double-dash (empty segment) without throwing", () => {
    // Edge case — consecutive dashes produce an empty segment
    expect(kebabToPascal("foo--bar")).toBe("FooBar");
  });
});

// ── manifestHasMethod ─────────────────────────────────────────────────────────

describe("manifestHasMethod", () => {
  const row = (resource: string, method: ManifestRow["method"]): ManifestRow => ({
    resource,
    method,
    path: `/api/v5/${resource.toLowerCase()}`,
    summary: `${method} ${resource}`,
    kind: method === "GET" ? "LIST" : method === "POST" ? "CREATE" : method === "PUT" ? "UPDATE" : "DELETE",
    source_file: "test",
  });

  const manifest: ManifestRow[] = [
    row("InstitutionStudents", "GET"),
    row("InstitutionStudents", "POST"),
    row("AbsenceTypes",        "GET"),
  ];

  it("returns true when resource + method exist (GET)", () => {
    expect(manifestHasMethod(manifest, "institution-students", "GET")).toBe(true);
  });

  it("returns true when resource + method exist (POST)", () => {
    expect(manifestHasMethod(manifest, "institution-students", "POST")).toBe(true);
  });

  it("returns false when method missing for existing resource", () => {
    expect(manifestHasMethod(manifest, "absence-types", "POST")).toBe(false);
  });

  it("returns false for an unknown resource", () => {
    expect(manifestHasMethod(manifest, "unknown-resource", "GET")).toBe(false);
  });

  it("is case-insensitive for the method argument", () => {
    expect(manifestHasMethod(manifest, "institution-students", "get")).toBe(true);
    expect(manifestHasMethod(manifest, "institution-students", "post")).toBe(true);
  });
});

// ── isWorkflowBlocked ─────────────────────────────────────────────────────────

describe("isWorkflowBlocked", () => {
  it("blocks student attendance marked records", () => {
    expect(isWorkflowBlocked("student-attendance-marked-records")).toBe(true);
  });

  it("blocks student attendance per-day-periods", () => {
    expect(isWorkflowBlocked("student-attendance-per-day-periods")).toBe(true);
  });

  it("blocks institution student absence details", () => {
    expect(isWorkflowBlocked("institution-student-absence-details")).toBe(true);
  });

  it("blocks staff attendances", () => {
    expect(isWorkflowBlocked("staff-attendances")).toBe(true);
  });

  it("does not block a regular writable resource", () => {
    expect(isWorkflowBlocked("institution-students")).toBe(false);
  });

  it("does not block absence-types (lookup table, not attendance write)", () => {
    expect(isWorkflowBlocked("absence-types")).toBe(false);
  });
});
