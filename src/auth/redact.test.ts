/**
 * Tests for redaction — the defensive core of the per-user login system.
 *
 * Every stored audit-log row and every error message that crosses the MCP
 * boundary runs through these functions. If we miss a token-shaped string
 * here, a prompt-injected conversation could extract stored credentials.
 * So: broad coverage, both the key-based deep-clone and the regex scrubber.
 */

import { describe, expect, it } from "vitest";

import { redact, scrubSecrets, REDACTED } from "./redact.js";

describe("redact (key-based)", () => {
  it("replaces the classic sensitive keys case-INSENSITIVELY", () => {
    const input = {
      username: "alice",
      password: "p",
      PASSWORD: "P",
      Pwd: "pw",
      secret: "s",
      api_key: "k",
      apiKey: "k2",
      apikey: "k3",
      "API-KEY": "k4",
    };
    const out = redact(input) as Record<string, unknown>;
    expect(out.username).toBe("alice");
    expect(out.password).toBe(REDACTED);
    expect(out.PASSWORD).toBe(REDACTED);
    expect(out.Pwd).toBe(REDACTED);
    expect(out.secret).toBe(REDACTED);
    expect(out.api_key).toBe(REDACTED);
    expect(out.apiKey).toBe(REDACTED);
    expect(out.apikey).toBe(REDACTED);
    expect(out["API-KEY"]).toBe(REDACTED);
  });

  it("covers token / jwt / authorization / bearer keys", () => {
    const input = {
      jwt: "eyJabc.def.ghi",
      token: "t",
      access_token: "a",
      refresh_token: "r",
      id_token: "i",
      authorization: "Bearer xyz",
      Authorization: "Bearer zzz",
      bearer: "b",
      cookie: "c",
    };
    const out = redact(input) as Record<string, string>;
    for (const k of Object.keys(input)) {
      expect(out[k]).toBe(REDACTED);
    }
  });

  it("recurses into nested objects and arrays", () => {
    const input = {
      outer: {
        inner: { password: "x", list: [{ token: "y" }] },
      },
    };
    const out = redact(input) as any;
    expect(out.outer.inner.password).toBe(REDACTED);
    expect(out.outer.inner.list[0].token).toBe(REDACTED);
  });

  it("scrubs JWT-shaped strings inside non-sensitive STRING fields", () => {
    // A JWT accidentally logged inside a `description` field should still
    // be masked — redact() runs scrubSecrets on every string value.
    const input = {
      description:
        "Call failed: upstream said eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload12345.signature67890 is invalid",
    };
    const out = redact(input) as { description: string };
    expect(out.description).not.toContain("eyJhbGci");
    expect(out.description).toContain(REDACTED);
  });

  it("leaves innocuous payloads unchanged", () => {
    expect(redact({ resource: "users", id: 1 })).toEqual({
      resource: "users",
      id: 1,
    });
  });

  it("passes through primitives and null/undefined", () => {
    expect(redact(null)).toBeNull();
    expect(redact(undefined)).toBeUndefined();
    expect(redact(42)).toBe(42);
    expect(redact(true)).toBe(true);
  });
});

describe("scrubSecrets (regex)", () => {
  it("masks a bare JWT", () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    expect(scrubSecrets(jwt)).toBe(REDACTED);
  });

  it("masks a JWT embedded in a sentence", () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const text = `HTTP 401: token ${jwt} has expired`;
    const out = scrubSecrets(text);
    expect(out).not.toContain(jwt);
    expect(out).toContain("HTTP 401");
    expect(out).toContain("has expired");
    expect(out).toContain(REDACTED);
  });

  it("masks an Authorization header string", () => {
    const text =
      'response headers: { "Authorization": "Bearer eyJabcdefghij.payloadpayload.signaturesignature" }';
    const out = scrubSecrets(text);
    expect(out).not.toContain("eyJabcdefghij");
    expect(out).toContain(REDACTED);
  });

  it("masks a bare Bearer preamble with a long token", () => {
    const text = "curl -H 'Bearer abcdefghijklmnopqrstuv' ...";
    const out = scrubSecrets(text);
    expect(out).not.toContain("abcdefghijklmnopqrstuv");
    expect(out).toContain(REDACTED);
  });

  it("does not touch strings with no token-shaped content", () => {
    const text = "HTTP 404: resource /api/v5/security-users not found";
    expect(scrubSecrets(text)).toBe(text);
  });

  it("handles empty input", () => {
    expect(scrubSecrets("")).toBe("");
  });

  it("masks multiple JWTs in one string", () => {
    const j1 = "eyJaaaaa.bbbbbbbb.ccccccccc";
    const j2 = "eyJxxxxx.yyyyyyyy.zzzzzzzzz";
    const out = scrubSecrets(`old=${j1} new=${j2}`);
    expect(out).not.toContain(j1);
    expect(out).not.toContain(j2);
    expect(out.match(new RegExp(REDACTED.replace(/\[/g, "\\[").replace(/\]/g, "\\]"), "g"))?.length).toBe(2);
  });
});
