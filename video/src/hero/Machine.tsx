import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, STAGES, funnelBottom, rgba, tierRect, useLayout, usePalette, type Funnel } from "./config";
import { display } from "../theme";

// THE MACHINE, drawn as a funnel: four narrowing tiers = the four STAGES of
// the service-business stack, top of funnel → paid. Pulses fall through the
// center; one turns pink in the booking tier — the film's only pink besides
// the BOOKED chips. Labels live INSIDE each tier so the layout is the same
// at phone width. It only exists once the cables have found it.
export const PINK_WINDOW = { from: BEATS.mechanism.from + 60, to: BEATS.mechanism.from + 150 } as const;
const N_PULSES = 6;
const PERIOD = 150; // frames for one pulse to fall through (divides 900)
const LABEL_AT = (k: number) => BEATS.mechanism.from + 15 + k * 30;

// Progress 0..1 of pulse k down the funnel at frame f.
export const pulseU = (f: number, k: number) => (((f / PERIOD + k / N_PULSES) % 1) + 1) % 1;
// Pulse 2 books: pink while it is inside the third tier during PINK_WINDOW.
export const isPink = (f: number, k: number) => k === 2 && f >= PINK_WINDOW.from && f <= PINK_WINDOW.to && pulseU(f, k) > 0.5 && pulseU(f, k) < 0.78;

// A tier as a chamfered trapezoid: top edge = this tier's width, bottom edge
// eases toward the next tier's width so the whole stack reads as one funnel.
const tierPath = (fn: Funnel, k: number, c = 8) => {
  const r = tierRect(fn, k);
  const wb = k < 3 ? (fn.widths[k] + fn.widths[k + 1]) / 2 : fn.widths[k] * 0.86;
  const xl = fn.cx - r.w / 2;
  const xr = fn.cx + r.w / 2;
  const bl = fn.cx - wb / 2;
  const br = fn.cx + wb / 2;
  const yt = r.y;
  const yb = r.y + r.h;
  return `M${xl + c} ${yt} H${xr - c} L${xr} ${yt + c} L${br} ${yb - c} L${br - c} ${yb} H${bl + c} L${bl} ${yb - c} L${xl} ${yt + c} Z`;
};

export const Machine: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const fn = L.funnel;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const exists = interpolate(f, [BEATS.reveal.from + 60, BEATS.reveal.from + 100], [0, 1], clamp);
  const labelsOut = interpolate(f, [BEATS.output.from + 10, BEATS.output.from + 30], [1, 0], clamp);
  const top = fn.top;
  const bottom = funnelBottom(fn);
  const fs = { title: 15, sub: 9, num: 9 };
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: exists }} width={1} height={1}>
      {STAGES.map((st, k) => {
        const r = tierRect(fn, k);
        const cy = r.y + r.h / 2;
        // lit when a pulse is inside this tier
        const lit = Math.max(
          0,
          ...Array.from({ length: N_PULSES }, (_, p) => {
            const py = top + pulseU(f, p) * (bottom - top);
            return 1 - Math.min(1, Math.abs(py - cy) / (r.h * 0.7));
          }),
        );
        const a = interpolate(f, [LABEL_AT(k), LABEL_AT(k) + 12], [0, 1], clamp) * labelsOut;
        return (
          <g key={st.title}>
            <path d={tierPath(fn, k)} fill={rgba(P.ink, 0.03 + 0.03 * lit)} stroke={rgba(P.blue, 0.45 + 0.4 * lit)} strokeWidth={1.4} />
            <g opacity={a} transform={`translate(0 ${(1 - a) * 6})`}>
              <text x={r.x + 22} y={cy - 6} fontFamily={display} fontSize={fs.num} fill={rgba(P.blue, 0.9)}>
                {k + 1}
              </text>
              <text x={fn.cx} y={cy - 4} textAnchor="middle" fontFamily={display} fontSize={fs.title} fontWeight={700} fill={rgba(P.ink, 0.92)}>
                {st.title}
              </text>
              <text x={fn.cx} y={cy + 14} textAnchor="middle" fontFamily={display} fontSize={fs.sub} fill={rgba(P.ink, 0.55)}>
                {st.sub}
              </text>
            </g>
          </g>
        );
      })}
      {/* the spout: a short neck below the last tier, where the output begins */}
      <path d={`M${fn.cx - 22} ${bottom} v26 h44 v-26`} fill="none" stroke={rgba(P.blue, 0.6)} strokeWidth={1.4} />
      {/* pulses falling down the center line (slight lateral wobble so they don't stack) */}
      {Array.from({ length: N_PULSES }, (_, k) => {
        const u = pulseU(f, k);
        const py = top + u * (bottom - top);
        const px = fn.cx + Math.sin(u * 9 + k) * 6 * (1 - u);
        const c = isPink(f, k) ? P.pink : P.blue;
        return (
          <g key={k}>
            <rect x={px - 1} y={py - 14} width={2} height={14} fill={rgba(c, 0.35)} />
            <circle cx={px} cy={py} r={3} fill={rgba(c, 1)} />
          </g>
        );
      })}
    </svg>
  );
};
