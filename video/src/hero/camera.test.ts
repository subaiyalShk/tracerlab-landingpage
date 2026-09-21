import { test } from "node:test";
import assert from "node:assert/strict";
import { cameraAt, cameraKeys, cameraTransform } from "./camera";
import { BEATS, DURATION, layoutFor, worldSize } from "./config";

const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

test("keys are ordered and span the whole film", () => {
  for (const portrait of [false, true]) {
    const k = cameraKeys(portrait);
    assert.equal(k[0].frame, 0);
    assert.equal(k[k.length - 1].frame, DURATION);
    for (let i = 1; i < k.length; i++) assert.ok(k[i].frame > k[i - 1].frame);
  }
});

test("loop closes: camera at DURATION equals camera at 0", () => {
  for (const portrait of [false, true]) {
    const k = cameraKeys(portrait);
    const a = cameraAt(0, k);
    const b = cameraAt(DURATION, k);
    assert.ok(near(a.zoom, b.zoom));
    assert.deepEqual(a.target, b.target);
    assert.deepEqual(a.anchor, b.anchor);
  }
});

test("interpolation eases between keys and holds at ends", () => {
  const k = cameraKeys(false);
  const mid = cameraAt((k[1].frame + k[2].frame) / 2, k);
  assert.ok(mid.zoom > Math.min(k[1].zoom, k[2].zoom));
  assert.ok(mid.zoom < Math.max(k[1].zoom, k[2].zoom));
  assert.equal(cameraAt(-10, k).zoom, k[0].zoom);
  assert.equal(cameraAt(5000, k).zoom, k[k.length - 1].zoom);
});

test("identity transform when zoom 1, target = center, anchor = center", () => {
  const t = cameraTransform({ zoom: 1, target: { x: 960, y: 540 }, anchor: { x: 0.5, y: 0.5 } }, { w: 1920, h: 1080 });
  assert.equal(t, "translate(0px, 0px) scale(1)");
});

test("the zoom target lands on the anchor point of the viewport", () => {
  const cam = { zoom: 8, target: { x: 430, y: 410 }, anchor: { x: 0.2, y: 0.5 } };
  const t = cameraTransform(cam, { w: 1920, h: 1080 });
  // translate = anchor*viewport - target*zoom
  assert.equal(t, `translate(${0.2 * 1920 - 430 * 8}px, ${0.5 * 1080 - 410 * 8}px) scale(8)`);
});

test("the cluster stays inside the viewport for the whole reveal pull-out", () => {
  for (const portrait of [false, true]) {
    const { w, h } = worldSize(portrait);
    const L = layoutFor(portrait);
    const k = cameraKeys(portrait);
    for (let f = BEATS.reveal.from; f <= BEATS.reveal.to; f += 5) {
      const c = cameraAt(f, k);
      const sx = c.anchor.x * w + (L.cluster.x - c.target.x) * c.zoom;
      const sy = c.anchor.y * h + (L.cluster.y - c.target.y) * c.zoom;
      assert.ok(sx >= 0 && sx <= w, `portrait=${portrait} f=${f} sx=${sx}`);
      assert.ok(sy >= 0 && sy <= h, `portrait=${portrait} f=${f} sy=${sy}`);
    }
  }
});
