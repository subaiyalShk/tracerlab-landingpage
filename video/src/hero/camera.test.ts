import { test } from "node:test";
import assert from "node:assert/strict";
import { cameraAt, cameraKeys, cameraTransform } from "./camera";
import { BEATS, DURATION, funnelBottom, layoutFor, tierRect, worldSize } from "./config";

const near = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

test("keys are ordered and span the whole film", () => {
  for (const portrait of [false, true]) {
    const k = cameraKeys(portrait);
    assert.equal(k[0].frame, 0);
    assert.equal(k[k.length - 1].frame, DURATION);
    for (let i = 1; i < k.length; i++) assert.ok(k[i].frame > k[i - 1].frame);
  }
});

test("the camera holds the revenue pose from the end of the output beat to the last frame", () => {
  for (const portrait of [false, true]) {
    const k = cameraKeys(portrait);
    const a = cameraAt(BEATS.output.to, k);
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

test("the phone stays on screen while the camera starts to leave it (first 20 frames of the reveal)", () => {
  for (const portrait of [false, true]) {
    const { w, h } = worldSize(portrait);
    const L = layoutFor(portrait);
    const k = cameraKeys(portrait);
    for (let f = BEATS.reveal.from; f <= BEATS.reveal.from + 20; f += 5) {
      const c = cameraAt(f, k);
      const sx = c.anchor.x * w + (L.phone.x - c.target.x) * c.zoom;
      const sy = c.anchor.y * h + (L.phone.y - c.target.y) * c.zoom;
      assert.ok(sx >= 0 && sx <= w, `portrait=${portrait} f=${f} sx=${sx}`);
      assert.ok(sy >= 0 && sy <= h, `portrait=${portrait} f=${f} sy=${sy}`);
    }
  }
});

test("the camera lands on the funnel, not the world: at the end of the reveal the map is above the frame and the funnel is centered", () => {
  for (const portrait of [false, true]) {
    const { h } = worldSize(portrait);
    const L = layoutFor(portrait);
    const c = cameraAt(BEATS.reveal.to, cameraKeys(portrait));
    const sy = (y: number) => c.anchor.y * h + (y - c.target.y) * c.zoom;
    assert.ok(sy(L.map.y + L.map.h) < h * 0.2, `portrait=${portrait} map still on screen`); // (it is faded out by then anyway)
    const mid = sy((L.funnel.top + funnelBottom(L.funnel)) / 2);
    assert.ok(mid > h * 0.4 && mid < h * 0.6, `portrait=${portrait} funnel at ${mid}`);
  }
});

test("the whole funnel (ports to spout) is on screen through the mechanism beat; the output block through the output beat", () => {
  for (const portrait of [false, true]) {
    const { w, h } = worldSize(portrait);
    const L = layoutFor(portrait);
    const k = cameraKeys(portrait);
    const sx = (c: ReturnType<typeof cameraAt>, x: number) => c.anchor.x * w + (x - c.target.x) * c.zoom;
    const sy = (c: ReturnType<typeof cameraAt>, y: number) => c.anchor.y * h + (y - c.target.y) * c.zoom;
    const mouth = tierRect(L.funnel, 0);
    for (let f = BEATS.mechanism.from; f <= BEATS.mechanism.to; f += 10) {
      const c = cameraAt(f, k);
      assert.ok(sx(c, mouth.x) >= 0 && sx(c, mouth.x + mouth.w) <= w, `portrait=${portrait} f=${f} mouth cut`);
      assert.ok(sy(c, L.ports[0].y - 22) >= 0, `portrait=${portrait} f=${f} ports above frame`);
      assert.ok(sy(c, funnelBottom(L.funnel)) <= h, `portrait=${portrait} f=${f} spout below frame`);
    }
    for (let f = BEATS.output.from + 30; f <= BEATS.output.to; f += 10) {
      const c = cameraAt(f, k);
      assert.ok(sx(c, L.output.x) >= 0 && sx(c, L.output.x + L.output.w) <= w, `portrait=${portrait} f=${f} output x off-screen`);
      assert.ok(sy(c, L.output.y) >= 0 && sy(c, L.output.y + L.output.h) <= h, `portrait=${portrait} f=${f} output y off-screen`);
    }
  }
});
