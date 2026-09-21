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

test("the camera lands on the floor, not the world: at the end of the reveal the map's top is above the frame", () => {
  for (const portrait of [false, true]) {
    const { h } = worldSize(portrait);
    const L = layoutFor(portrait);
    const c = cameraAt(BEATS.reveal.to, cameraKeys(portrait));
    const mapTop = c.anchor.y * h + (L.map.y - c.target.y) * c.zoom;
    const machineMid = c.anchor.y * h + (L.machine.y + L.machine.h / 2 - c.target.y) * c.zoom;
    assert.ok(mapTop < 0, `portrait=${portrait} map top on screen at ${mapTop}`);
    assert.ok(machineMid > h * 0.6 && machineMid < h * 0.9, `portrait=${portrait} machine at ${machineMid}`);
  }
});

test("the whole floor pipeline stays inside the viewport through the mechanism and output beats", () => {
  for (const portrait of [false, true]) {
    const { w, h } = worldSize(portrait);
    const L = layoutFor(portrait);
    const k = cameraKeys(portrait);
    const left = L.ports[0].x - 22; // half a port (PORT_SIZE 44)
    const right = L.output.x + L.output.w;
    const bottom = L.output.y + L.output.h;
    for (let f = BEATS.mechanism.from; f <= BEATS.output.to; f += 10) {
      const c = cameraAt(f, k);
      const sx = (x: number) => c.anchor.x * w + (x - c.target.x) * c.zoom;
      const sy = (y: number) => c.anchor.y * h + (y - c.target.y) * c.zoom;
      assert.ok(sx(left) >= 0, `portrait=${portrait} f=${f} left=${sx(left)}`);
      assert.ok(sx(right) <= w, `portrait=${portrait} f=${f} right=${sx(right)}`);
      assert.ok(sy(bottom) <= h, `portrait=${portrait} f=${f} bottom=${sy(bottom)}`);
    }
  }
});
