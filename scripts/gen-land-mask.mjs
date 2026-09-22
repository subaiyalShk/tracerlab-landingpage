// One-time: rasterize Natural Earth 110m land polygons onto a 160×80
// lon/lat grid and write an RLE mask for the hero film's dot map.
//   node scripts/gen-land-mask.mjs
import { writeFileSync } from "node:fs";

const SRC_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson";
const COLS = 160;
const ROWS = 80;
const OUT = new URL("../video/src/hero/land.json", import.meta.url);

const res = await fetch(SRC_URL);
if (!res.ok) throw new Error(`fetch ${res.status}`);
const geo = await res.json();

// Ray-cast point-in-ring (lon/lat as x/y).
const inRing = (ring, x, y) => {
  let inside = false;
  for (let a = 0, b = ring.length - 1; a < ring.length; b = a++) {
    const [xa, ya] = ring[a];
    const [xb, yb] = ring[b];
    if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) inside = !inside;
  }
  return inside;
};
// Polygon = outer ring + holes.
const inPoly = (poly, x, y) => inRing(poly[0], x, y) && !poly.slice(1).some((h) => inRing(h, x, y));

const polys = [];
for (const f of geo.features) {
  const g = f.geometry;
  if (g.type === "Polygon") polys.push(g.coordinates);
  else if (g.type === "MultiPolygon") polys.push(...g.coordinates);
}

const grid = new Uint8Array(COLS * ROWS);
for (let j = 0; j < ROWS; j++) {
  const lat = 90 - ((j + 0.5) * 180) / ROWS;
  for (let i = 0; i < COLS; i++) {
    const lon = -180 + ((i + 0.5) * 360) / COLS;
    if (polys.some((p) => inPoly(p, lon, lat))) grid[j * COLS + i] = 1;
  }
}

// RLE: alternating water/land runs, starting with water.
const rle = [];
let cur = 0;
let run = 0;
for (const v of grid) {
  if (v === cur) run++;
  else {
    rle.push(run);
    cur = v;
    run = 1;
  }
}
rle.push(run);

const land = grid.reduce((s, v) => s + v, 0);
writeFileSync(OUT, JSON.stringify({ cols: COLS, rows: ROWS, rle }));
console.log(`wrote ${OUT.pathname}: ${land}/${COLS * ROWS} land cells (${((100 * land) / (COLS * ROWS)).toFixed(1)}%), ${rle.length} runs`);
