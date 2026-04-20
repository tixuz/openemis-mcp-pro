/**
 * Sliding-window rate limiter for per-user login attempts.
 *
 * Why: a prompt-injected conversation could try to brute-force a password
 * by looping `openemis_login({username, password: "guess1"})`,
 * `openemis_login({username, password: "guess2"})`, … We cap the blast
 * radius at `maxFailed` failed attempts per `windowMs`. Successful logins
 * reset the counter.
 *
 * Scope: process-local. A home installation runs a single stdio process per
 * client (Claude Desktop, Cursor, Cline), so per-process is enough — an
 * attacker who can restart the process already has far more capability.
 *
 * Trade-off: we deliberately DON'T rate-limit based on IP or global counters,
 * because stdio doesn't have IPs and globals would block the one legitimate
 * user fixing a typo. Per-username is the right granularity here.
 */

export interface RateLimitOptions {
  /** Max failed attempts allowed within the window. Default 5. */
  maxFailed?: number;
  /** Window size in ms. Default 60s. */
  windowMs?: number;
}

export class LoginRateLimiter {
  private readonly maxFailed: number;
  private readonly windowMs: number;
  /** username → list of failure timestamps (ms since epoch), newest last. */
  private readonly fails = new Map<string, number[]>();

  constructor(opts: RateLimitOptions = {}) {
    this.maxFailed = opts.maxFailed ?? 5;
    this.windowMs = opts.windowMs ?? 60_000;
  }

  /**
   * Throw if `username` is over the fail quota. Call this BEFORE attempting
   * the upstream login — we want to short-circuit without hitting OpenEMIS.
   */
  check(username: string, now: number = Date.now()): void {
    const arr = this.prune(username, now);
    if (arr.length >= this.maxFailed) {
      const oldest = arr[0];
      const retryIn = Math.max(
        0,
        Math.ceil((oldest + this.windowMs - now) / 1000)
      );
      throw new Error(
        `Too many failed login attempts for "${username}". ` +
          `Try again in ${retryIn}s. (Limit: ${this.maxFailed} per ${this.windowMs / 1000}s.)`
      );
    }
  }

  /** Record a failed login attempt. Call this from the catch branch. */
  recordFailure(username: string, now: number = Date.now()): void {
    const arr = this.prune(username, now);
    arr.push(now);
    this.fails.set(username, arr);
  }

  /** Reset the counter for `username`. Call this on successful login. */
  reset(username: string): void {
    this.fails.delete(username);
  }

  /** Current failure count inside the window, for tests / diagnostics. */
  currentFailures(username: string, now: number = Date.now()): number {
    return this.prune(username, now).length;
  }

  /** Drop timestamps that have aged out of the window; return the survivors. */
  private prune(username: string, now: number): number[] {
    const cutoff = now - this.windowMs;
    const arr = (this.fails.get(username) ?? []).filter((t) => t > cutoff);
    this.fails.set(username, arr);
    return arr;
  }
}
