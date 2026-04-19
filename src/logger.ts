/**
 * In-memory request log — ring buffer of the last MAX entries.
 * Persists for the container lifetime. Zero dependencies.
 */

export interface LogEntry {
  ts:     string;   // ISO-8601
  ip:     string;
  method: string;
  path:   string;   // pathname only
  status: number;
  ms:     number;   // response time ms
}

const MAX = 2_000;
const ring: LogEntry[] = [];

export function record(e: LogEntry): void {
  ring.push(e);
  if (ring.length > MAX) ring.shift();
}

export interface Snapshot {
  total:     number;
  uniqueIPs: number;
  errorRate: number;   // %
  avgMs:     number;
  topPaths:  { path: string; count: number }[];
  topIPs:    { ip: string; count: number }[];
  entries:   LogEntry[];
}

export function snapshot(limit = 500): Snapshot {
  const entries = ring.slice().reverse().slice(0, limit);

  const ipMap   = new Map<string, number>();
  const pathMap = new Map<string, number>();
  let errors = 0;
  let totalMs = 0;

  for (const e of ring) {
    ipMap.set(e.ip,     (ipMap.get(e.ip)     ?? 0) + 1);
    pathMap.set(e.path, (pathMap.get(e.path) ?? 0) + 1);
    if (e.status >= 400) errors++;
    totalMs += e.ms;
  }

  const top = <K>(m: Map<K, number>, n: number) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);

  return {
    total:     ring.length,
    uniqueIPs: ipMap.size,
    errorRate: ring.length > 0 ? Math.round((errors / ring.length) * 100) : 0,
    avgMs:     ring.length > 0 ? Math.round(totalMs / ring.length) : 0,
    topPaths:  top(pathMap, 6).map(([path, count]) => ({ path, count })),
    topIPs:    top(ipMap,   8).map(([ip,   count]) => ({ ip,   count })),
    entries,
  };
}
