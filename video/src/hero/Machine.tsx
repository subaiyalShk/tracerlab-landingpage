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
const bottomWidth = (fn: Funnel, k: number) => (k < 3 ? (fn.widths[k] + fn.widths[k + 1]) / 2 : fn.widths[k] * 0.86);
const tierPath = (fn: Funnel, k: number, c = 8) => {
  const r = tierRect(fn, k);
  const wb = bottomWidth(fn, k);
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
const ICON = 20;

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
  const fs = { title: 16, sub: 9.5, num: 9 };
  const pulses = Array.from({ length: N_PULSES }, (_, k) => {
    const u = pulseU(f, k);
    return { k, u, y: top + u * (bottom - top), x: fn.cx + Math.sin(u * 9 + k) * 6 * (1 - u), pink: isPink(f, k) };
  });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: exists }} width={1} height={1}>
      <defs>
        <linearGradient id="tier-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.blue, 0.2)} />
          <stop offset="0.55" stopColor={rgba(P.blue, 0.08)} />
          <stop offset="1" stopColor={rgba(P.blue, 0.04)} />
        </linearGradient>
        <linearGradient id="tier-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={rgba(P.ink, 0)} />
          <stop offset="0.5" stopColor={rgba(P.ink, 0.22)} />
          <stop offset="1" stopColor={rgba(P.ink, 0)} />
        </linearGradient>
        <linearGradient id="core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.blue, 0.25)} />
          <stop offset="1" stopColor={rgba(P.blue, 0.85)} />
        </linearGradient>
        <filter id="core-glow" x="-300%" y="-5%" width="700%" height="110%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
      </defs>
      {/* the glowing core: a steady column of light the pulses fall along —
          brighter toward the spout, where the funnel concentrates */}
      <rect x={fn.cx - 9} y={top + 6} width={18} height={bottom + 26 - top - 6} rx={9} fill="url(#core)" opacity={0.55} filter="url(#core-glow)" />
      <line x1={fn.cx} y1={top + 6} x2={fn.cx} y2={bottom + 26} stroke={rgba(P.blue, 0.35)} strokeWidth={1.2} />
      {/* pulses ride the core BEHIND the glass (they read as inside the funnel) */}
      {pulses.map((p) => {
        const c = p.pink ? P.pink : P.blue;
        return (
          <g key={p.k}>
            <rect x={p.x - 1} y={p.y - 14} width={2} height={14} rx={1} fill={rgba(c, 0.35)} />
            <circle cx={p.x} cy={p.y} r={3.4} fill={rgba(c, 1)} />
          </g>
        );
      })}
      {STAGES.map((st, k) => {
        const r = tierRect(fn, k);
        const cy = r.y + r.h / 2;
        const depth = k / 3; // 0 at the mouth → 1 at the spout
        const a = interpolate(f, [LABEL_AT(k), LABEL_AT(k) + 12], [0, 1], clamp) * labelsOut;
        const inset = (r.w - bottomWidth(fn, k)) / 2; // the slanted edge's run
        const left = r.x + inset + 10;
        const right = r.x + r.w - inset - 10;
        const iconX = right - 24; // icon tile mirrors the badge on the right
        return (
          <g key={st.title}>
            {/* glass tier: translucent fill, bevel, top highlight, stroke brightening with depth */}
            <path d={tierPath(fn, k)} fill="url(#tier-glass)" stroke={rgba(P.blue, 0.5 + 0.4 * depth)} strokeWidth={1.4} />
            <path d={tierPath(fn, k, 8)} fill="none" stroke={rgba(P.ink, 0.06)} strokeWidth={1} transform={`translate(0 2)`} />
            <rect x={r.x + 14} y={r.y + 1.2} width={r.w - 28} height={1.2} fill="url(#tier-sheen)" />
            <g opacity={a} transform={`translate(0 ${(1 - a) * 6})`}>
              {/* number badge + icon tile */}
              <circle cx={left + 8} cy={cy} r={8} fill={rgba(P.blue, 0.95)} />
              <text x={left + 8} y={cy + 3.4} textAnchor="middle" fontFamily={display} fontSize={fs.num} fontWeight={700} fill={P.bg}>
                {k + 1}
              </text>
              <rect x={iconX - 4 - 4} y={cy - 14} width={28} height={28} rx={6} fill={rgba(P.ink, 0.07)} stroke={rgba(P.ink, 0.1)} strokeWidth={1} />
              <g transform={`translate(${iconX - 4} ${cy - ICON / 2}) scale(${ICON / 24})`}>
                <path d={ICONS[st.title]} fill="none" stroke={rgba(P.ink, 0.85)} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" />
              </g>
              <text x={fn.cx} y={cy - 4} textAnchor="middle" fontFamily={display} fontSize={fs.title} fontWeight={700} fill={rgba(P.ink, 0.95)}>
                {st.title}
              </text>
              <text x={fn.cx} y={cy + 15} textAnchor="middle" fontFamily={display} fontSize={fs.sub} fill={rgba(P.ink, 0.6)}>
                {st.sub}
              </text>
            </g>
          </g>
        );
      })}
      {/* the spout: a glass neck below the last tier; the core continues through it */}
      <path d={`M${fn.cx - 22} ${bottom} v26 h44 v-26`} fill="url(#tier-glass)" stroke={rgba(P.blue, 0.9)} strokeWidth={1.4} />
    </svg>
  );
};
