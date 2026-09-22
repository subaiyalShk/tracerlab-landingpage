import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeLand, landDots } from "./land";
import land from "./land.json" with { type: "json" };

test("decodeLand expands alternating water/land runs (starting with water)", () => {
  // 4 cols × 2 rows: row0 = W L L W, row1 = L L W W
  const cells = decodeLand({ cols: 4, rows: 2, rle: [1, 2, 1, 2, 2] });
  assert.deepEqual(cells, [
    { i: 1, j: 0 },
    { i: 2, j: 0 },
    { i: 0, j: 1 },
    { i: 1, j: 1 },
  ]);
});

test("landDots maps cell centers into the target rect", () => {
  const pts = landDots([{ i: 0, j: 0 }, { i: 3, j: 1 }], { x: 100, y: 50, w: 400, h: 200 }, 4, 2);
  assert.deepEqual(pts, [
    { x: 150, y: 100 },
    { x: 450, y: 200 },
  ]);
});

test("generated land.json is 160×80 and ~25–35% land", () => {
  assert.equal(land.cols, 160);
  assert.equal(land.rows, 80);
  const n = decodeLand(land).length;
  const frac = n / (160 * 80);
  assert.ok(frac > 0.25 && frac < 0.35, `land fraction ${frac}`);
});
