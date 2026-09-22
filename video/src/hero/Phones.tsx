import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, usePalette, type Pt } from "./config";

// The phone cloud: the hero phone is one of many. Same-size phones scattered
// in a loose spiral around it (deterministic — golden angle + a cheap hash
// for tilt), fading in as the camera pulls back so the picture gets bigger,
// then serving as the cable sources for the reveal. The hero phone itself is
// drawn by Phone.tsx at the cluster's center.
const N = 28;
const hash = (k: number) => {
  const s = Math.sin(k * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

export type CloudPhone = Pt & { tilt: number };
export const phonePositions = (c: Pt & { r: number }): CloudPhone[] =>
  Array.from({ length: N }, (_, k) => {
    const a = (k + 1) * 2.399963;
    const d = c.r * (0.3 + 0.7 * Math.sqrt((k + 1) / N));
    return { x: c.x + Math.cos(a) * d, y: c.y + Math.sin(a) * d * 0.8, tilt: -14 + 28 * hash(k) };
  });

export const Phones: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const presence = interpolate(f, [BEATS.reveal.from + 8, BEATS.reveal.from + 60], [0, 1], clamp);
  const { w, h } = L.phone;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: presence }} width={1} height={1}>
      <defs>
        <filter id="cloud-rim" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation={1.6} />
        </filter>
      </defs>
      {phonePositions(L.cluster).map((p, k) => {
        const glow = 0.5 + 0.3 * Math.sin(f / 11 + k);
        const tint = 0.1 + 0.08 * (k % 3);
        return (
          <g key={k} transform={`translate(${p.x} ${p.y}) rotate(${p.tilt}) translate(${-w / 2} ${-h / 2})`}>
            <rect x={-0.4} y={-0.4} width={w + 0.8} height={h + 0.8} rx={6} fill={rgba(P.blue, 0.22 * glow)} filter="url(#cloud-rim)" />
            <rect x={0} y={0} width={w} height={h} rx={5.6} fill={P.surface} stroke={rgba(P.blue, 0.5)} strokeWidth={0.45} />
            <rect x={2} y={4} width={w - 4} height={h - 8} rx={3.6} fill={rgba(P.blue, tint)} />
            <rect x={w / 2 - 4} y={5} width={8} height={2.2} rx={1.1} fill={P.bg} />
            {/* a hint of a feed */}
            <circle cx={6.5} cy={14} r={1.8} fill={rgba(P.ink, 0.3)} />
            <rect x={9.5} y={12.8} width={12} height={1.1} rx={0.5} fill={rgba(P.ink, 0.35)} />
            <rect x={9.5} y={15.2} width={8} height={1} rx={0.5} fill={rgba(P.ink, 0.2)} />
            <rect x={4} y={19} width={w - 8} height={22} rx={1.6} fill={rgba(P.blue, 0.18 + 0.1 * glow)} />
            <rect x={4} y={45} width={w - 8} height={1.1} rx={0.5} fill={rgba(P.ink, 0.25)} />
            <rect x={4} y={48} width={w - 14} height={1.1} rx={0.5} fill={rgba(P.ink, 0.15)} />
            <rect x={w / 2 - 6} y={h - 6.2} width={12} height={0.7} rx={0.35} fill={rgba(P.ink, 0.4)} />
          </g>
        );
      })}
    </svg>
  );
};
