import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BEATS, funnelBottom, rgba, useLayout, usePalette } from "./config";
import { bevelPath } from "./Reveal";
import { display } from "../theme";

// The revenue scene, directly under the funnel's spout: pulses fall from the
// spout into a chamfered panel and become a rising line (warm area fill,
// glowing tip); three outcome chips land along the bottom — Booked (the pink),
// Confirmed, Paid. No figures: the shape and the chips carry "money" (the
// site's copy rule: every published number must be defensible).
const OUTCOMES = [
  { label: "Booked", pink: true },
  { label: "Confirmed", pink: false },
  { label: "Paid", pink: false },
] as const;
const CHIP_AT = (k: number) => BEATS.output.from + 50 + k * 28;
const PAD = 26;

export const Output: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const { x, y, w, h } = L.output;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const show = interpolate(f, [BEATS.output.from, BEATS.output.from + 20], [0, 1], clamp);
  const grow = interpolate(f, [BEATS.output.from + 18, BEATS.output.from + 110], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });

  // chart area inside the panel: baseline above the chip row
  const cx0 = x + PAD;
  const cx1 = x + w - PAD;
  const base = y + h - 62;
  const topY = y + 44;
  const N = 40;
  const pts = Array.from({ length: N + 1 }, (_, k) => {
    const u = k / N;
    const rise = Math.pow(u, 1.6); // slow start, steep finish
    const wobble = Math.sin(u * 19) * 0.02 + Math.sin(u * 7.3) * 0.03;
    const v = Math.min(1, Math.max(0, rise + wobble * (1 - u)));
    return { u, x: cx0 + u * (cx1 - cx0), y: base - v * (base - topY) };
  }).filter((p) => p.u <= grow + 1e-9);
  const line = pts.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  const tip = pts[pts.length - 1];
  const area = tip ? `${line} L${tip.x} ${base} L${cx0} ${base} Z` : "";

  // pulses from the spout into the panel's top edge (period divides the beat)
  const spoutX = L.funnel.cx;
  const spoutY = funnelBottom(L.funnel) + 26;
  const drop = (k: number) => (((f / 45 + k / 3) % 1) + 1) % 1;

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      <defs>
        <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.amber, 0.28)} />
          <stop offset="1" stopColor={rgba(P.blue, 0)} />
        </linearGradient>
      </defs>
      {/* feed: spout → panel */}
      <line x1={spoutX} y1={spoutY} x2={spoutX} y2={y} stroke={rgba(P.blue, 0.45)} strokeWidth={1.4} />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={spoutX} cy={spoutY + drop(k) * (y - spoutY)} r={2.6} fill={rgba(P.blue, 0.95)} />
      ))}
      {/* the panel */}
      <path d={bevelPath(x, y, w, h, 12)} fill={rgba(P.ink, 0.035)} stroke={rgba(P.blue, 0.6)} strokeWidth={1.4} />
      <text x={x + PAD} y={y + 26} fontFamily={display} fontSize={10} letterSpacing={3} fill={rgba(P.ink, 0.55)}>
        REVENUE
      </text>
      <text x={x + w - PAD} y={y + 26} textAnchor="end" fontFamily={display} fontSize={10} letterSpacing={1} fill={rgba(P.blue, 0.9)}>
        ↗ growing
      </text>
      {/* grid + baseline */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={cx0} y1={base - g * (base - topY)} x2={cx1} y2={base - g * (base - topY)} stroke={rgba(P.ink, 0.06)} strokeWidth={1} />
      ))}
      <line x1={cx0} y1={base} x2={cx1} y2={base} stroke={rgba(P.ink, 0.18)} strokeWidth={1} />
      {/* the line */}
      {area && <path d={area} fill="url(#rev-area)" />}
      <path d={line} fill="none" stroke={rgba(P.blue, 0.95)} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      {tip && (
        <g>
          <circle cx={tip.x} cy={tip.y} r={10} fill={rgba(P.blue, 0.18)} />
          <circle cx={tip.x} cy={tip.y} r={4} fill={rgba(P.blue, 1)} />
        </g>
      )}
      {/* outcome chips along the bottom */}
      {OUTCOMES.map((o, k) => {
        const a = interpolate(f, [CHIP_AT(k), CHIP_AT(k) + 12], [0, 1], clamp);
        const cw = (w - PAD * 2 - 16) / 3;
        const cxk = x + PAD + k * (cw + 8);
        const cy = y + h - 44 + (1 - a) * 6;
        const c = o.pink ? P.pink : P.blue;
        return (
          <g key={o.label} opacity={a}>
            <path d={bevelPath(cxk, cy, cw, 26, 5)} fill={rgba(c, 0.1)} stroke={rgba(c, 0.8)} strokeWidth={1} />
            <text x={cxk + cw / 2} y={cy + 17} textAnchor="middle" fontFamily={display} fontSize={11} letterSpacing={1.5} fill={rgba(P.ink, 0.92)}>
              {o.label.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
