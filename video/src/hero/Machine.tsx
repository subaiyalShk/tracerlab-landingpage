import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, STAGES, rgba, useLayout, usePortraitFilm, type Layout, usePalette } from "./config";
import { bevelPath } from "./Reveal";
import { display } from "../theme";

// The pink "booked" signal happens while the camera holds on the machine.
export const PINK_WINDOW = { from: BEATS.mechanism.from + 100, to: BEATS.mechanism.from + 190 } as const;
// Stage labels land one by one as the camera settles, left → right.
const LABEL_AT = (k: number) => BEATS.mechanism.from + 20 + k * 40;
const N_PULSES = 6;
const PERIOD = 150; // frames for one pulse to cross the machine (divides 900)

// x of pulse k at frame f, as a fraction 0..1 across the machine.
export const pulseU = (f: number, k: number) => (((f / PERIOD + k / N_PULSES) % 1) + 1) % 1;
export const pulseX = (f: number, k: number, L: Layout) => L.machine.x + pulseU(f, k) * L.machine.w;

// Pulse 2 is the one that "books": it turns pink in the right half of the
// machine during PINK_WINDOW and fades back to blue just before the exit —
// the film's only pink besides the BOOKED chips.
export const isPink = (f: number, k: number) => k === 2 && f >= PINK_WINDOW.from && f <= PINK_WINDOW.to && pulseU(f, k) > 0.5;

// The machine: one chamfered block, four chambers = the four STAGES of the
// service-business stack, pulses flowing left → right. During the Mechanism
// beat the camera holds on it, centered, and it becomes the explainer: a
// title above and a label per chamber that lands as the pulses light it.
export const Machine: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const portrait = usePortraitFilm();
  const { x, y, w, h } = L.machine;
  const cw = w / 4;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  // Labels live in the Mechanism beat only: in by LABEL_AT, all gone as the
  // output beat pans away (they'd crowd the revenue block).
  const labelsOut = interpolate(f, [BEATS.output.from + 10, BEATS.output.from + 30], [1, 0], clamp);
  const titleIn = interpolate(f, [BEATS.mechanism.from + 5, BEATS.mechanism.from + 25], [0, 1], clamp);
  const fs = portrait ? { title: 8.2, sub: 5.6, head: 7, chipH: 30, gap: 34, pad: 6 } : { title: 11, sub: 7, head: 8, chipH: 34, gap: 40, pad: 12 };
  // The machine only exists once the cables have found it: it fades in as the
  // camera rides down (with the Reveal's ports), never before.
  const exists = interpolate(f, [BEATS.reveal.from + 45, BEATS.reveal.from + 90], [0, 1], clamp);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: exists }} width={1} height={1}>
      {/* Title + label row: ABOVE the machine in landscape; BELOW it in portrait,
          where the intake ports and their traces occupy the space above. */}
      {(() => {
        const below = portrait;
        const chipTop = below ? y + h + fs.gap : y - fs.gap - fs.chipH;
        const titleY = below ? chipTop + fs.chipH + 26 : chipTop - 26;
        return (
          <g opacity={titleIn * labelsOut}>
            <text x={x + w / 2} y={titleY} textAnchor="middle" fontFamily={display} fontSize={fs.head} letterSpacing={2.4} fill={rgba(P.ink, 0.55)}>
              THE MACHINE
            </text>
            <text x={x + w / 2} y={titleY + 14} textAnchor="middle" fontFamily={display} fontSize={fs.title} fill={rgba(P.ink, 0.92)}>
              One system runs the whole service stack
            </text>
          </g>
        );
      })()}
      {/* one label chip per chamber, above it */}
      {STAGES.map((st, k) => {
        const a = interpolate(f, [LABEL_AT(k), LABEL_AT(k) + 12], [0, 1], clamp) * labelsOut;
        const cx = x + cw * (k + 0.5);
        const cwid = cw - fs.pad;
        const chipTop = portrait ? y + h + fs.gap : y - fs.gap - fs.chipH;
        const cy = chipTop + (1 - a) * (portrait ? -6 : 6);
        return (
          <g key={st.title} opacity={a}>
            <path d={bevelPath(cx - cwid / 2, cy, cwid, fs.chipH, 4)} fill={rgba(P.ink, 0.05)} stroke={rgba(P.blue, 0.55)} strokeWidth={0.8} />
            <text x={cx} y={cy + fs.chipH * 0.42} textAnchor="middle" fontFamily={display} fontSize={fs.title} fill={rgba(P.ink, 0.92)}>
              {st.title}
            </text>
            <text x={cx} y={cy + fs.chipH * 0.8} textAnchor="middle" fontFamily={display} fontSize={fs.sub} fill={rgba(P.ink, 0.55)}>
              {st.sub}
            </text>
            {/* leader from the chip down to the chamber */}
            <line x1={cx} y1={portrait ? cy : cy + fs.chipH} x2={cx} y2={portrait ? y + h : y} stroke={rgba(P.blue, 0.4)} strokeWidth={0.8} strokeDasharray="2 3" />
            <text x={cx - cwid / 2 + 4} y={cy + fs.chipH * 0.42} fontFamily={display} fontSize={fs.sub} fill={rgba(P.blue, 0.9)}>
              {k + 1}
            </text>
          </g>
        );
      })}
      <path d={bevelPath(x, y, w, h, 12)} fill={rgba(P.ink, 0.035)} stroke={rgba(P.blue, 0.7)} strokeWidth={1.5} />
      {[1, 2, 3].map((k) => (
        <line key={k} x1={x + cw * k} y1={y + 10} x2={x + cw * k} y2={y + h - 10} stroke={rgba(P.blue, 0.3)} strokeWidth={1} />
      ))}
      {/* chamber internals: a breathing core per chamber, lit as a pulse passes */}
      {[0, 1, 2, 3].map((k) => {
        const cx = x + cw * (k + 0.5);
        const near = Array.from({ length: N_PULSES }, (_, p) => Math.abs(pulseX(f, p, L) - cx)).reduce((a, b) => Math.min(a, b));
        const lit = Math.max(0, 1 - near / (cw * 0.6));
        return (
          <g key={k}>
            <path d={bevelPath(cx - 28, y + h / 2 - 22, 56, 44, 6)} fill="none" stroke={rgba(P.blue, 0.25 + 0.5 * lit)} strokeWidth={1} />
            <circle cx={cx} cy={y + h / 2} r={6 + 4 * lit} fill={rgba(P.blue, 0.15 + 0.6 * lit)} />
          </g>
        );
      })}
      {/* the pulses */}
      {Array.from({ length: N_PULSES }, (_, k) => {
        const px = pulseX(f, k, L);
        const c = isPink(f, k) ? P.pink : P.blue;
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
