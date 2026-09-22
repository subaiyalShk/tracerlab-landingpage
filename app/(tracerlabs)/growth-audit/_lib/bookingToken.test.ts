import { test } from "node:test";
import assert from "node:assert/strict";
import { mint, read, TOKEN_TTL_MS } from "./bookingToken";

const secret = "test-secret-do-not-use-in-production";
const lead = { leadId: "abc-123", name: "Jo Tester", email: "jo@example.com", phone: "5125550100" };

test("round-trips a payload", () => {
  const back = read(mint(lead, { secret }), { secret });
  assert.equal(back?.leadId, "abc-123");
  assert.equal(back?.email, "jo@example.com");
  assert.equal(back?.name, "Jo Tester");
  assert.equal(back?.phone, "5125550100");
});

test("carries no readable PII — the token is encrypted, not just signed", () => {
  const t = mint(lead, { secret });
  assert.ok(!t.includes("jo@example.com"));
  assert.ok(!Buffer.from(t, "base64url").toString("utf8").includes("jo@example.com"));
  assert.ok(!Buffer.from(t, "base64url").toString("utf8").includes("Jo Tester"));
});

test("a fresh token differs every time (random IV)", () => {
  assert.notEqual(mint(lead, { secret }), mint(lead, { secret }));
});

test("rejects a tampered token", () => {
  const t = mint(lead, { secret });
  const flipped = t.slice(0, -2) + (t.endsWith("A") ? "B" : "A");
  assert.equal(read(flipped, { secret }), null);
});

test("rejects the wrong key", () => {
  assert.equal(read(mint(lead, { secret }), { secret: "a-different-secret" }), null);
});

test("rejects an expired token", () => {
  const t = mint(lead, { secret, now: 0 });
  assert.equal(read(t, { secret, now: TOKEN_TTL_MS + 1 }), null);
  assert.ok(read(t, { secret, now: TOKEN_TTL_MS - 1 }));
});

test("rejects rubbish", () => {
  assert.equal(read("", { secret }), null);
  assert.equal(read("not-a-token", { secret }), null);
  assert.equal(read("AAAA", { secret }), null);
});
