import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BEATS, funnelBottom, rgba, useLayout, usePalette } from "./config";
import { bevelPath } from "./Reveal";
import { display } from "../theme";
import { SOFT, pop, popTransform } from "./springs";

// The finale, directly under the funnel's spout: an operations DASHBOARD —
// the kind we build — coming alive as the pulses drop in. Four KPI tiles
// (value counting up, delta, sparkline), the revenue curve, and the pipeline
// column (Booked → Confirmed → Paid, pink on Booked). The figures are an
// illustration of the dashboard, not a published result (owner's call,
// 2026-09-22, to show it untagged).
const KPIS = [
  { label: "Leads", to: 128, delta: "↑ 18%", spark: [3, 4, 4, 5, 6, 7, 9, 10] },
  { label: "Booked", to: 41, delta: "↑ 24%", spark: [2, 2, 3, 3, 4, 5, 6, 7] },
  { label: "Show rate", to: 91, unit: "%", delta: "↑ 6 pts", spark: [5, 5, 6, 6, 7, 7, 8, 8] },
  { label: "Paid", to: 37, delta: "↑ 31%", spark: [1, 2, 2, 3, 4, 4, 6, 7] },
] as const;
const PIPELINE = [
  { label: "Booked", fill: 1, pink: true },
  { label: "Confirmed", fill: 0.82, pink: false },
  { label: "Paid", fill: 0.7, pink: false },
] as const;
const PAD = 22;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const t0 = BEATS.output.from;

const sparkPath = (v: readonly number[], x: number, y: number, w: number, h: number, prog: number) => {
  const max = Math.max(...v);
  const n = Math.max(2, Math.ceil(v.length * prog));
  return v
    .slice(0, n)
    .map((val, k) => `${k ? "L" : "M"}${x + (k / (v.length - 1)) * w} ${y + h - (val / max) * h}`)
    .join(" ");
};

export const Output: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const { x, y, w, h } = L.output;
  const panelS = pop(f, t0 + 2, SOFT);
  const show = Math.min(1, panelS * 1.6);
  const prog = interpolate(f, [t0 + 18, t0 + 110], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });

  // header + tiles + body split
  const headerY = y + 24;
  const tileY = y + 44;
  const tileH = 74;
  const gap = 10;
  const tileW = (w - PAD * 2 - gap * 3) / 4;
  const bodyY = tileY + tileH + 16;
  const bodyH = y + h - bodyY - PAD;
  const chartW = (w - PAD * 2) * 0.6;
  const cx0 = x + PAD;
  const cx1 = cx0 + chartW;
  const base = bodyY + bodyH - 6;
  const topY = bodyY + 14;
  const pipeX = cx1 + 22;
  const pipeW = x + w - PAD - pipeX;

  // revenue curve
  const N = 40;
  const pts = Array.from({ length: N + 1 }, (_, k) => {
    const u = k / N;
    const rise = Math.pow(u, 1.6);
    const wobble = Math.sin(u * 19) * 0.02 + Math.sin(u * 7.3) * 0.03;
    const v = Math.min(1, Math.max(0, rise + wobble * (1 - u)));
    return { u, x: cx0 + u * chartW, y: base - v * (base - topY) };
  }).filter((p) => p.u <= prog + 1e-9);
  const line = pts.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  const tip = pts[pts.length - 1];
  const area = tip ? `${line} L${tip.x} ${base} L${cx0} ${base} Z` : "";

  // pulses from the spout into the panel's top edge
  const spoutX = L.funnel.cx;
  const spoutY = funnelBottom(L.funnel) + 26;
  const drop = (k: number) => (((f / 45 + k / 3) % 1) + 1) % 1;

  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      <g transform={popTransform(panelS, x + w / 2, y + h / 2, 16)}>
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

      {/* the panel: a faint grid texture inside, chamfered frame */}
      <defs>
        <pattern id="dash-grid" width={16} height={16} patternUnits="userSpaceOnUse">
          <path d="M16 0H0V16" fill="none" stroke={rgba(P.ink, 0.035)} strokeWidth={1} />
        </pattern>
      </defs>
      <path d={bevelPath(x, y, w, h, 12)} fill={rgba(P.ink, 0.035)} stroke={rgba(P.blue, 0.6)} strokeWidth={1.4} />
      <path d={bevelPath(x, y, w, h, 12)} fill="url(#dash-grid)" />
      <text x={x + PAD} y={headerY} fontFamily={display} fontSize={10} letterSpacing={3} fill={rgba(P.ink, 0.55)}>
        OPERATIONS
      </text>
      <text x={x + PAD + 92} y={headerY} fontFamily={display} fontSize={9} fill={rgba(P.ink, 0.35)}>
        This week ▾
      </text>
      <circle cx={x + w - PAD - 30} cy={headerY - 3} r={2.4} fill={rgba(P.blue, 0.65 + 0.35 * Math.sin(f / 30))} />
      <text x={x + w - PAD} y={headerY} textAnchor="end" fontFamily={display} fontSize={8} letterSpacing={2} fill={rgba(P.ink, 0.45)}>
        LIVE
      </text>

      {/* KPI tiles */}
      {KPIS.map((k, i) => {
        const tx = x + PAD + i * (tileW + gap);
        const sp = pop(f, t0 + 10 + i * 8);
        const a = Math.min(1, sp * 1.6);
        const val = Math.round(interpolate(f, [t0 + 14 + i * 8, t0 + 80 + i * 8], [0, k.to], { easing: Easing.out(Easing.cubic), ...clamp }));
        const unit = "unit" in k ? k.unit : "";
        return (
          <g key={k.label} opacity={a} transform={popTransform(sp, tx + tileW / 2, tileY + tileH / 2, 10)}>
            <path d={bevelPath(tx, tileY, tileW, tileH, 6)} fill={rgba(P.ink, 0.045)} stroke={rgba(P.blue, 0.4)} strokeWidth={1} />
            <line x1={tx + 8} y1={tileY + 1.2} x2={tx + tileW - 8} y2={tileY + 1.2} stroke={rgba(P.ink, 0.14)} strokeWidth={1} />
            <text x={tx + 10} y={tileY + 16} fontFamily={display} fontSize={8} letterSpacing={1.2} fill={rgba(P.ink, 0.5)}>
              {k.label.toUpperCase()}
            </text>
            <text x={tx + 10} y={tileY + 42} fontFamily={display} fontSize={24} fontWeight={700} fill={rgba(P.ink, 0.95)}>
              {val}
              {unit}
            </text>
            <text x={tx + 10} y={tileY + 62} fontFamily={display} fontSize={9} fill={rgba(P.blue, 0.95)}>
              {k.delta}
            </text>
            <path d={sparkPath(k.spark, tx + tileW - 46, tileY + 40, 36, 20, prog)} fill="none" stroke={rgba(P.blue, 0.8)} strokeWidth={1.4} strokeLinejoin="round" />
          </g>
        );
      })}

      {/* revenue curve */}
      <text x={cx0} y={bodyY + 2} fontFamily={display} fontSize={8} letterSpacing={2} fill={rgba(P.ink, 0.45)}>
        REVENUE
      </text>
      {[0.33, 0.66].map((g) => (
        <line key={g} x1={cx0} y1={base - g * (base - topY)} x2={cx1} y2={base - g * (base - topY)} stroke={rgba(P.ink, 0.06)} strokeWidth={1} />
      ))}
      <line x1={cx0} y1={base} x2={cx1} y2={base} stroke={rgba(P.ink, 0.18)} strokeWidth={1} />
      {area && <path d={area} fill="url(#rev-area)" />}
      <path d={line} fill="none" stroke={rgba(P.blue, 0.95)} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      {tip && (
        <g>
          <circle cx={tip.x} cy={tip.y} r={9} fill={rgba(P.blue, 0.18)} />
          <circle cx={tip.x} cy={tip.y} r={3.5} fill={rgba(P.blue, 1)} />
        </g>
      )}

      {/* pipeline column */}
      <text x={pipeX} y={bodyY + 2} fontFamily={display} fontSize={8} letterSpacing={2} fill={rgba(P.ink, 0.45)}>
        PIPELINE
      </text>
      {PIPELINE.map((p, i) => {
        const rowY = bodyY + 18 + i * ((bodyH - 18) / 3);
        const rs = pop(f, t0 + 50 + i * 22);
        const a = Math.min(1, rs * 1.6);
        const fill = interpolate(f, [t0 + 56 + i * 22, t0 + 110 + i * 22], [0, p.fill], { easing: Easing.out(Easing.cubic), ...clamp });
        const c = p.pink ? P.pink : P.blue;
        return (
          <g key={p.label} opacity={a} transform={popTransform(rs, pipeX + pipeW / 2, rowY + 10, 8)}>
            <text x={pipeX} y={rowY + 8} fontFamily={display} fontSize={9} letterSpacing={1.2} fill={rgba(P.ink, 0.85)}>
              {p.label.toUpperCase()}
            </text>
            <text x={pipeX + pipeW} y={rowY + 8} textAnchor="end" fontFamily={display} fontSize={9} fill={rgba(P.ink, 0.5)}>
              {Math.round(fill * 100)}%
            </text>
            <rect x={pipeX} y={rowY + 14} width={pipeW} height={6} rx={3} fill={rgba(P.ink, 0.08)} />
            <rect x={pipeX} y={rowY + 14} width={Math.max(6, pipeW * fill)} height={6} rx={3} fill={rgba(c, 0.9)} />
          </g>
        );
      })}
      </g>
    </svg>
  );
};
