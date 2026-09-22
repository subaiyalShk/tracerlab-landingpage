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

// Simple line icons per stage (24-unit viewBox, drawn at ICON size).
const ICONS: Record<string, string> = {
  "Lead capture": "M4 5h16l-6 8v5l-4 2v-7z", // funnel-in
  "AI follow-up": "M4 5h16v10H9l-5 4z", // chat bubble
  "Booking & reminders": "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4", // calendar
  "Payments & invoicing": "M3 7h18v10H3zM3 11h18M6 15h4", // card
};
const ICON = 16;

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
  const pulses = Array.from({ length: N_PULSES }, (_, k) => {
    const u = pulseU(f, k);
    return { k, u, y: top + u * (bottom - top), x: fn.cx + Math.sin(u * 9 + k) * 6 * (1 - u), pink: isPink(f, k) };
  });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: exists }} width={1} height={1}>
      <defs>
        <linearGradient id="tier-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.ink, 0.07)} />
          <stop offset="1" stopColor={rgba(P.ink, 0.02)} />
        </linearGradient>
        <filter id="tier-glow" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
        <filter id="pulse-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={2.5} />
        </filter>
      </defs>
      {STAGES.map((st, k) => {
        const r = tierRect(fn, k);
        const cy = r.y + r.h / 2;
        // lit when a pulse is inside this tier
        const lit = Math.max(0, ...pulses.map((p) => 1 - Math.min(1, Math.abs(p.y - cy) / (r.h * 0.7))));
        const a = interpolate(f, [LABEL_AT(k), LABEL_AT(k) + 12], [0, 1], clamp) * labelsOut;
        const iconX = r.x + 30;
        return (
          <g key={st.title}>
            {lit > 0.05 && <path d={tierPath(fn, k)} fill={rgba(P.blue, 0.22 * lit)} filter="url(#tier-glow)" />}
            <path d={tierPath(fn, k)} fill="url(#tier-fill)" stroke={rgba(P.blue, 0.45 + 0.45 * lit)} strokeWidth={1.4} />
            {/* top-edge highlight */}
            <line x1={r.x + 10} y1={r.y + 1.2} x2={r.x + r.w - 10} y2={r.y + 1.2} stroke={rgba(P.ink, 0.08 + 0.1 * lit)} strokeWidth={1} />
            <g opacity={a} transform={`translate(0 ${(1 - a) * 6})`}>
              {/* stage number in a ring + icon */}
              <circle cx={r.x + 16} cy={cy} r={7} fill="none" stroke={rgba(P.blue, 0.7)} strokeWidth={1} />
              <text x={r.x + 16} y={cy + 3.2} textAnchor="middle" fontFamily={display} fontSize={fs.num} fontWeight={700} fill={rgba(P.blue, 0.95)}>
                {k + 1}
              </text>
              <g transform={`translate(${iconX} ${cy - ICON / 2}) scale(${ICON / 24})`}>
                <path d={ICONS[st.title]} fill="none" stroke={rgba(P.ink, 0.7)} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
              </g>
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
      {/* the spout: a short neck below the last tier, with a soft drip glow */}
      <path d={`M${fn.cx - 22} ${bottom} v26 h44 v-26`} fill="none" stroke={rgba(P.blue, 0.6)} strokeWidth={1.4} />
      <circle cx={fn.cx} cy={bottom + 26} r={5} fill={rgba(P.blue, 0.5)} filter="url(#pulse-glow)" />
      {/* pulses with tails falling down the center line */}
      {pulses.map((p) => {
        const c = p.pink ? P.pink : P.blue;
        return (
          <g key={p.k}>
            <circle cx={p.x} cy={p.y} r={6} fill={rgba(c, 0.45)} filter="url(#pulse-glow)" />
            <rect x={p.x - 1} y={p.y - 16} width={2} height={16} rx={1} fill={rgba(c, 0.35)} />
            <circle cx={p.x} cy={p.y} r={3} fill={rgba(c, 1)} />
          </g>
        );
      })}
    </svg>
  );
};
