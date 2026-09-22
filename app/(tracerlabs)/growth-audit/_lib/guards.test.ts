import { test } from "node:test";
import assert from "node:assert/strict";
import { MIN_FILL_MS, RATE_LIMIT, spamVerdict, rateLimited, __resetRateLimit } from "./guards";

const human = {
  name: "Jo Tester",
  email: "jo@example.com",
  phone: "5125550100",
  company_website: "",
  renderedAt: Date.now() - 20_000,
};

test("lets a normal submission through", () => {
  assert.equal(spamVerdict(human, { now: Date.now() }), null);
});

test("catches a filled honeypot", () => {
  assert.equal(spamVerdict({ ...human, company_website: "http://spam.example" }, { now: Date.now() }), "honeypot");
});

test("catches a submission faster than a human could type", () => {
  const now = Date.now();
  assert.equal(spamVerdict({ ...human, renderedAt: now - 500 }, { now }), "too-fast");
  assert.equal(spamVerdict({ ...human, renderedAt: now - (MIN_FILL_MS - 1) }, { now }), "too-fast");
  assert.equal(spamVerdict({ ...human, renderedAt: now - MIN_FILL_MS }, { now }), null);
});

test("a missing or nonsense timestamp is not held against the visitor", () => {
  // JS disabled, a stale cached page, a clock skew — none of these are bot evidence
  // on their own, so they pass the fill-time check and rely on the other guards.
  const now = Date.now();
  assert.equal(spamVerdict({ ...human, renderedAt: undefined }, { now }), null);
  assert.equal(spamVerdict({ ...human, renderedAt: NaN }, { now }), null);
  assert.equal(spamVerdict({ ...human, renderedAt: now + 60_000 }, { now }), null);
});

test("catches a link in the name — the classic contact-spam signature", () => {
  const now = Date.now();
  assert.equal(spamVerdict({ ...human, name: "Cheap deals http://spam.example" }, { now }), "link-in-name");
  assert.equal(spamVerdict({ ...human, name: "visit www.spam.example now" }, { now }), "link-in-name");
  assert.equal(spamVerdict({ ...human, name: "Jo O'Brien-Smith" }, { now }), null);
});

test("rate limits per IP, and forgets after the window", () => {
  __resetRateLimit();
  const now = Date.now();
  for (let i = 0; i < RATE_LIMIT.max; i++) {
    assert.equal(rateLimited("1.2.3.4", now), false, `submission ${i + 1} should pass`);
  }
  assert.equal(rateLimited("1.2.3.4", now), true);
  // a different visitor is unaffected
  assert.equal(rateLimited("5.6.7.8", now), false);
  // and the window expires
  assert.equal(rateLimited("1.2.3.4", now + RATE_LIMIT.windowMs + 1), false);
});
