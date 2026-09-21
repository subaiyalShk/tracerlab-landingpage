import { useCurrentFrame } from "remotion";
import { COLORS, rgba, useLayout, type Layout } from "./config";
import { bevelPath } from "./Reveal";

export const PINK_WINDOW = { from: 590, to: 680 } as const;
const N_PULSES = 6;
const PERIOD = 150; // frames for one pulse to cross the machine (divides 900)

// x of pulse k at frame f, as a fraction 0..1 across the machine.
export const pulseU = (f: number, k: number) => (((f / PERIOD + k / N_PULSES) % 1) + 1) % 1;
export const pulseX = (f: number, k: number, L: Layout) => L.machine.x + pulseU(f, k) * L.machine.w;

// Pulse 2 is the one that "books": it turns pink inside chamber 3 during
// PINK_WINDOW and exits pink — the film's only pink.
export const isPink = (f: number, k: number) => k === 2 && f >= PINK_WINDOW.from && f <= PINK_WINDOW.to && pulseU(f, k) > 0.5;

// The machine: one chamfered block on the floor, four unlabeled chambers
// (the four Services stages), pulses flowing left → right.
export const Machine: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { x, y, w, h } = L.machine;
  const cw = w / 4;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <path d={bevelPath(x, y, w, h, 12)} fill={rgba(COLORS.ink, 0.035)} stroke={rgba(COLORS.blue, 0.7)} strokeWidth={1.5} />
      {[1, 2, 3].map((k) => (
        <line key={k} x1={x + cw * k} y1={y + 10} x2={x + cw * k} y2={y + h - 10} stroke={rgba(COLORS.blue, 0.3)} strokeWidth={1} />
      ))}
      {/* chamber internals: a breathing core per chamber, lit as a pulse passes */}
      {[0, 1, 2, 3].map((k) => {
        const cx = x + cw * (k + 0.5);
        const near = Array.from({ length: N_PULSES }, (_, p) => Math.abs(pulseX(f, p, L) - cx)).reduce((a, b) => Math.min(a, b));
        const lit = Math.max(0, 1 - near / (cw * 0.6));
        return (
          <g key={k}>
            <path d={bevelPath(cx - 28, y + h / 2 - 22, 56, 44, 6)} fill="none" stroke={rgba(COLORS.blue, 0.25 + 0.5 * lit)} strokeWidth={1} />
            <circle cx={cx} cy={y + h / 2} r={6 + 4 * lit} fill={rgba(COLORS.blue, 0.15 + 0.6 * lit)} />
          </g>
        );
      })}
      {/* the pulses */}
      {Array.from({ length: N_PULSES }, (_, k) => {
        const px = pulseX(f, k, L);
        const c = isPink(f, k) ? COLORS.pink : COLORS.blue;
        return (
          <g key={k}>
            <rect x={px - 14} y={y + h / 2 - 1} width={14} height={2} fill={rgba(c, 0.35)} />
            <circle cx={px} cy={y + h / 2} r={3} fill={rgba(c, 1)} />
          </g>
        );
      })}
    </svg>
  );
};
