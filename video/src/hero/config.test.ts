import { test } from "node:test";
import assert from "node:assert/strict";
import { BEATS, COLORS, DURATION, FPS, layoutFor, palette, worldSize } from "./config";

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

test("landscape layout keeps attention in the left third and the machine on the floor", () => {
  const { w, h } = worldSize(false);
  const L = layoutFor(false);
  assert.ok(L.cluster.x < w / 3);
  assert.ok(L.phone.x < w / 3);
  assert.ok(L.machine.y > h * 0.8);
  assert.ok(L.output.x > L.machine.x + L.machine.w);
});

test("portrait layout keeps attention in the top band and the machine on the floor", () => {
  const { h } = worldSize(true);
  const L = layoutFor(true);
  assert.ok(L.cluster.y < h * 0.35);
  assert.ok(L.machine.y > h * 0.82);
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

test("five intake ports, never overlapping the machine, feeding it from the side (landscape) or the top (portrait)", () => {
  for (const portrait of [false, true]) {
    const L = layoutFor(portrait);
    assert.equal(L.ports.length, 5);
    assert.equal(L.portsFeed, portrait ? "top" : "side");
    for (const p of L.ports) {
      const inside = p.x + 22 > L.machine.x && p.x - 22 < L.machine.x + L.machine.w && p.y + 22 > L.machine.y && p.y - 22 < L.machine.y + L.machine.h;
      assert.ok(!inside, `portrait=${portrait} port at ${p.x},${p.y} overlaps the machine`);
    }
    // the pipeline (first port's left edge → output's right edge) fits the frame with margin
    const { w } = worldSize(portrait);
    assert.ok(L.ports[0].x - 22 >= 60 && L.output.x + L.output.w <= w - 60, `portrait=${portrait} pipeline touches the frame edge`);
  }
});
