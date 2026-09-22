import { spring } from "remotion";
import { FPS } from "./config";

// Every entrance in the film is a spring — snappy, with a touch of overshoot
// (POP) for UI-like elements, softer (SOFT) for big shapes. `pop()` returns
// 0→1(+) from frame `from`; `enter()` turns it into the usual entrance
// recipe: fade quickly, scale up from 94%, rise a few px.
export const POP = { damping: 13, stiffness: 170, mass: 0.8 } as const;
export const SOFT = { damping: 18, stiffness: 110, mass: 1 } as const;

export const pop = (frame: number, from: number, config: typeof POP | typeof SOFT = POP) =>
  frame < from ? 0 : spring({ frame: frame - from, fps: FPS, config });

export const enter = (s: number, rise = 10) => ({
  opacity: Math.min(1, s * 1.6),
  scale: 0.94 + 0.06 * s,
  dy: (1 - s) * rise,
});

// SVG transform that scales about a point and lifts by dy.
export const popTransform = (s: number, cx: number, cy: number, rise = 10) => {
  const e = enter(s, rise);
  return `translate(${cx} ${cy + e.dy}) scale(${e.scale}) translate(${-cx} ${-cy})`;
};
