/**
 * Tests for LoginRateLimiter — the per-username brute-force guardrail.
 *
 * Using an explicit `now` argument keeps the tests deterministic; no fake
 * timers, no real sleeps. The class accepts a `now: number` on every public
 * entry point precisely so test code can script the window.
 */

import { describe, expect, it } from "vitest";

import { LoginRateLimiter } from "./rate-limit.js";

describe("LoginRateLimiter", () => {
  it("allows up to maxFailed-1 failures without throwing", () => {
    const rl = new LoginRateLimiter({ maxFailed: 5, windowMs: 60_000 });
    const t = 1_000_000_000_000;
    rl.check("alice", t);
    rl.recordFailure("alice", t + 100);
    rl.check("alice", t + 200);
    rl.recordFailure("alice", t + 300);
    rl.check("alice", t + 400);
    rl.recordFailure("alice", t + 500);
    rl.check("alice", t + 600);
    rl.recordFailure("alice", t + 700);
    // 4 failures recorded — 5th check still allowed
    expect(() => rl.check("alice", t + 800)).not.toThrow();
  });

  it("throws on the Nth failed attempt within the window", () => {
    const rl = new LoginRateLimiter({ maxFailed: 3, windowMs: 60_000 });
    const t = 2_000_000_000_000;
    rl.recordFailure("eve", t + 100);
    rl.recordFailure("eve", t + 200);
    rl.recordFailure("eve", t + 300);
    expect(() => rl.check("eve", t + 400)).toThrowError(
      /Too many failed login attempts for "eve"/
    );
  });

  it("resets on a successful login", () => {
    const rl = new LoginRateLimiter({ maxFailed: 3, windowMs: 60_000 });
    const t = 3_000_000_000_000;
    rl.recordFailure("bob", t + 100);
    rl.recordFailure("bob", t + 200);
    rl.recordFailure("bob", t + 300);
    expect(rl.currentFailures("bob", t + 400)).toBe(3);

    rl.reset("bob");
    expect(rl.currentFailures("bob", t + 500)).toBe(0);
    expect(() => rl.check("bob", t + 500)).not.toThrow();
  });

  it("ages out failures older than the window", () => {
    const rl = new LoginRateLimiter({ maxFailed: 3, windowMs: 60_000 });
    const t = 4_000_000_000_000;
    rl.recordFailure("carol", t);
    rl.recordFailure("carol", t + 1_000);
    rl.recordFailure("carol", t + 2_000);
    // Right at the limit — this would normally throw.
    expect(() => rl.check("carol", t + 3_000)).toThrow();
    // The window is exclusive (`t > cutoff`), so a timestamp of t+2_000 only
    // falls out once `now` crosses t+62_000. Use t+62_001 to be unambiguous.
    expect(() => rl.check("carol", t + 62_001)).not.toThrow();
    expect(rl.currentFailures("carol", t + 62_001)).toBe(0);
  });

  it("is per-username — overflowing one user doesn't affect another", () => {
    const rl = new LoginRateLimiter({ maxFailed: 2, windowMs: 60_000 });
    const t = 5_000_000_000_000;
    rl.recordFailure("attacker", t);
    rl.recordFailure("attacker", t + 100);
    expect(() => rl.check("attacker", t + 200)).toThrow();
    // Another user is untouched
    expect(() => rl.check("legitimate", t + 200)).not.toThrow();
  });

  it("reports retry-in seconds in the error message", () => {
    const rl = new LoginRateLimiter({ maxFailed: 2, windowMs: 30_000 });
    const t = 6_000_000_000_000;
    rl.recordFailure("u", t);
    rl.recordFailure("u", t + 5_000);
    try {
      rl.check("u", t + 10_000);
      throw new Error("should have thrown");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // oldest failure at t, window 30s, now t+10s → retry in 20s
      expect(msg).toMatch(/Try again in 2\ds/);
    }
  });
});
