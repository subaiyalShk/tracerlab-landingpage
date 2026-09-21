import { test } from "node:test";
import assert from "node:assert/strict";
import { BEATS, COLORS, DURATION, FPS, funnelBottom, layoutFor, palette, worldSize } from "./config";

test("film is 30s at 30fps", () => {
  assert.equal(FPS, 30);
  assert.equal(DURATION, 900);
});

test("beats are contiguous, ordered and end at DURATION", () => {
  const order = ["world", "people", "attention", "reveal", "mechanism", "output", "flywheel"] as const;
  let prev = 0;
  for (const k of order) {
    assert.equal(BEATS[k].from, prev, `${k} starts where previous ended`);
    assert.ok(BEATS[k].to > BEATS[k].from);
    prev = BEATS[k].to;
  }
  assert.equal(prev, DURATION);
});

test("the phone sits in the legibility frame; the funnel is centered below the map in both orientations", () => {
  for (const portrait of [false, true]) {
    const { w } = worldSize(portrait);
    const L = layoutFor(portrait);
    const map = L.map;
    // landscape: phone in the left third (chips to its right); portrait: centered (chips below)
    if (portrait) assert.equal(L.phone.x, w / 2);
    else assert.ok(L.phone.x < w / 3, "phone not in the left third");
    assert.equal(L.funnel.cx, w / 2);
    assert.ok(L.funnel.top > map.y + map.h, `portrait=${portrait} funnel overlaps the map`);
    for (let k = 1; k < 4; k++) assert.ok(L.funnel.widths[k] < L.funnel.widths[k - 1], "tiers must narrow");
    assert.ok(L.funnel.widths[0] <= w - 80, `portrait=${portrait} mouth too wide for the frame`);
    assert.ok(L.output.y > funnelBottom(L.funnel), "output sits under the spout");
  }
});

test("five intake ports sit across the funnel's mouth, above it and inside its width", () => {
  for (const portrait of [false, true]) {
    const L = layoutFor(portrait);
    assert.equal(L.ports.length, 5);
    const half = L.funnel.widths[0] / 2;
    for (const p of L.ports) {
      assert.ok(p.y < L.funnel.top, "port above the mouth");
      assert.ok(Math.abs(p.x - L.funnel.cx) < half - 22, "port inside the mouth's width");
    }
  }
});

test("palette: dark is the original COLORS; light uses the page's light tokens", () => {
  assert.deepEqual(palette("dark"), { ...COLORS, surface: "#05060a" });
  const L = palette("light");
  assert.equal(L.bg, "#eef0f4");
  assert.equal(L.ink, "#0b0d12");
  assert.equal(L.surface, "#ffffff");
  assert.equal(L.blue, COLORS.blue);
  assert.equal(L.pink, COLORS.pink);
  assert.equal(L.amber, COLORS.amber);
});

