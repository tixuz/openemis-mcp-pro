/**
 * Shared utilities for openemis-mcp-pro.
 * Imported by both crud.ts and write.ts — lives here to avoid
 * code duplication and the circular-import workaround.
 */

/**
 * Normalize the raw OpenEMIS API response into a consistent shape.
 *
 * The v5 API returns three possible envelope shapes:
 *   - Paginated list: { message, data: { current_page, data: [...], total, ... } }
 *   - Single record:  { message, data: { id, ... } }
 *   - Flat list:      { message, data: [...] }
 *
 * This function unwraps whichever shape it receives so callers always see
 * a predictable object with a top-level `data` array (or the record itself).
 */
export function normalizeResponse(raw: unknown): unknown {
  if (raw === null || typeof raw !== "object") return raw;

  const obj = raw as Record<string, unknown>;

  // Paginated envelope: data is an object that contains a nested data array
  if (
    obj.data !== null &&
    typeof obj.data === "object" &&
    !Array.isArray(obj.data)
  ) {
    const inner = obj.data as Record<string, unknown>;
    if (Array.isArray(inner.data)) {
      return {
        message: obj.message,
        data: inner.data,
        total: inner.total,
        current_page: inner.current_page,
        last_page: inner.last_page,
      };
    }
  }

  // Flat array or single record — return as-is
  return raw;
}
