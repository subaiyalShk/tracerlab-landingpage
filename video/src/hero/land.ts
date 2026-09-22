import type { Pt, Rect } from "./config";

export type LandJson = { cols: number; rows: number; rle: number[] };
export type Cell = { i: number; j: number };

// RLE of the row-major grid: run lengths alternate water, land, water, …
// (always starting with water — a leading 0 is allowed).
export const decodeLand = (j: LandJson): Cell[] => {
  const out: Cell[] = [];
  let pos = 0;
  let land = false;
  for (const run of j.rle) {
    if (land) {
      for (let k = 0; k < run; k++) {
        const p = pos + k;
        out.push({ i: p % j.cols, j: Math.floor(p / j.cols) });
      }
    }
    pos += run;
    land = !land;
  }
  return out;
};

// Cell centers → world points inside `rect` (equirectangular: i → x, j → y).
export const landDots = (cells: Cell[], rect: Rect, cols: number, rows: number): Pt[] =>
  cells.map(({ i, j }) => ({
    x: rect.x + ((i + 0.5) / cols) * rect.w,
    y: rect.y + ((j + 0.5) / rows) * rect.h,
  }));
