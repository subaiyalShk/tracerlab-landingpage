import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BEATS, STAGES, funnelBottom, rgba, tierRect, useLayout, usePalette, type Funnel } from "./config";
import { display } from "../theme";
import { SOFT, pop, popTransform } from "./springs";

// THE MACHINE, drawn as a funnel: four narrowing tiers = the four STAGES of
// the service-business stack, top of funnel → paid. It appears DARK and
// lights up tier by tier, top → bottom — stroke and glass brighten, a light
// sweep crosses the tier, its label lands — while the core column fills
// downward: data moving through each step. The booking tier's sweep is pink
// (the film's only pink besides the BOOKED chip). Labels live INSIDE each
// tier so the layout is the same at phone width.
const LIGHT_AT = (k: number) => BEATS.mechanism.from + 12 + k * 22; // tier k lights up
const SWEEP_FRAMES = 16;
const SPOUT_AT = BEATS.mechanism.from + 12 + 4 * 22 + 6;

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
  const TIER_AT = (k: number) => BEATS.reveal.from + 66 + k * 7; // tiers build top → bottom as the camera lands
  const labelsOut = interpolate(f, [BEATS.output.from + 4, BEATS.output.from + 16], [1, 0], clamp);
  const top = fn.top;
  const bottom = funnelBottom(fn);
  const fs = { title: 16, sub: 9.5, num: 9 };
  // cascade progress 0..1 (top of tier 1 → spout): drives the core column
  const cascade = interpolate(f, [LIGHT_AT(0), SPOUT_AT], [0, 1], { easing: Easing.inOut(Easing.quad), ...clamp });
  const spoutLit = interpolate(f, [SPOUT_AT, SPOUT_AT + 8], [0, 1], clamp);
  const coreLen = Math.max(0, cascade * (bottom + 26 - top - 6));
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
        <linearGradient id="sweep-ink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={rgba(P.ink, 0)} />
          <stop offset="0.5" stopColor={rgba(P.ink, 0.35)} />
          <stop offset="1" stopColor={rgba(P.ink, 0)} />
        </linearGradient>
        <linearGradient id="sweep-pink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={rgba(P.pink, 0)} />
          <stop offset="0.5" stopColor={rgba(P.pink, 0.55)} />
          <stop offset="1" stopColor={rgba(P.pink, 0)} />
        </linearGradient>
        <linearGradient id="core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.blue, 0.25)} />
          <stop offset="1" stopColor={rgba(P.blue, 0.85)} />
        </linearGradient>
        <filter id="core-glow" x="-300%" y="-5%" width="700%" height="110%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
      </defs>
      {/* the core column fills downward as the tiers light up */}
      {coreLen > 0 && (
        <g>
          <rect x={fn.cx - 9} y={top + 6} width={18} height={coreLen} rx={9} fill="url(#core)" opacity={0.55} filter="url(#core-glow)" />
          <line x1={fn.cx} y1={top + 6} x2={fn.cx} y2={top + 6 + coreLen} stroke={rgba(P.blue, 0.4)} strokeWidth={1.2} strokeLinecap="round" />
        </g>
      )}
      {STAGES.map((st, k) => {
        const r = tierRect(fn, k);
        const cy = r.y + r.h / 2;
        const depth = k / 3; // 0 at the mouth → 1 at the spout
        const lit = interpolate(f, [LIGHT_AT(k), LIGHT_AT(k) + 10], [0, 1], clamp);
        const sweep = interpolate(f, [LIGHT_AT(k), LIGHT_AT(k) + SWEEP_FRAMES], [-0.25, 1.25], clamp);
        const sweepA = interpolate(f, [LIGHT_AT(k), LIGHT_AT(k) + 4, LIGHT_AT(k) + SWEEP_FRAMES], [0, 1, 0], clamp);
        const ls = pop(f, LIGHT_AT(k));
        const a = Math.min(1, ls * 1.6) * labelsOut;
        const ts = pop(f, TIER_AT(k), SOFT);
        const inset = (r.w - bottomWidth(fn, k)) / 2; // the slanted edge's run
        const left = r.x + inset + 10;
        const right = r.x + r.w - inset - 10;
        const iconX = right - 24; // icon tile mirrors the badge on the right
        const path = tierPath(fn, k);
        return (
          <g key={st.title} opacity={Math.min(1, ts * 1.6)} transform={popTransform(ts, fn.cx, cy, 14)}>
            <clipPath id={`tier-clip-${k}`}>
              <path d={path} />
            </clipPath>
            {/* dark tier, then the lit glass on top as it lights up */}
            <path d={path} fill={rgba(P.ink, 0.025)} stroke={rgba(P.blue, 0.22)} strokeWidth={1.4} />
            <g opacity={lit}>
              <path d={path} fill="url(#tier-glass)" stroke={rgba(P.blue, 0.5 + 0.4 * depth)} strokeWidth={1.4} />
              <path d={tierPath(fn, k, 8)} fill="none" stroke={rgba(P.ink, 0.06)} strokeWidth={1} transform="translate(0 2)" />
              <rect x={r.x + 14} y={r.y + 1.2} width={r.w - 28} height={1.2} fill="url(#tier-sheen)" />
            </g>
            {/* the light sweep, clipped to the tier */}
            <g clipPath={`url(#tier-clip-${k})`} opacity={sweepA}>
              <rect x={r.x + sweep * r.w - r.w * 0.18} y={r.y} width={r.w * 0.36} height={r.h} fill={`url(#sweep-${k === 2 ? "pink" : "ink"})`} />
            </g>
            <g opacity={a} transform={popTransform(ls, fn.cx, cy, 6)}>
              {/* number badge + icon tile */}
              <circle cx={left + 8} cy={cy} r={8} fill={rgba(P.blue, 0.95)} />
              <text x={left + 8} y={cy + 3.4} textAnchor="middle" fontFamily={display} fontSize={fs.num} fontWeight={700} fill={P.bg}>
                {k + 1}
              </text>
              <rect x={iconX - 8} y={cy - 14} width={28} height={28} rx={6} fill={rgba(P.ink, 0.07)} stroke={rgba(P.ink, 0.1)} strokeWidth={1} />
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
      {/* the spout lights last */}
      <path d={`M${fn.cx - 22} ${bottom} v26 h44 v-26`} fill="none" stroke={rgba(P.blue, 0.22)} strokeWidth={1.4} />
      <g opacity={spoutLit}>
        <path d={`M${fn.cx - 22} ${bottom} v26 h44 v-26`} fill="url(#tier-glass)" stroke={rgba(P.blue, 0.9)} strokeWidth={1.4} />
        <circle cx={fn.cx} cy={bottom + 26} r={6} fill={rgba(P.blue, 0.6)} filter="url(#core-glow)" />
      </g>
    </svg>
  );
};
