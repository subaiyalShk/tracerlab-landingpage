import { useCurrentFrame } from "remotion";
import { COLORS, rgba, useLayout, type Pt } from "./config";

// 14 silhouettes in a loose ring around the cluster center. Deterministic
// (golden-angle spiral) so Reveal can reuse the exact positions for threads.
export const peoplePositions = (c: Pt & { r: number }): Pt[] =>
  Array.from({ length: 14 }, (_, k) => {
    const a = k * 2.399963; // golden angle
    const d = c.r * (0.25 + 0.75 * Math.sqrt((k + 1) / 14));
    return { x: c.x + Math.cos(a) * d, y: c.y + Math.sin(a) * d * 0.7 };
  });

// At zoom 1 these are ~14 world px — they read as slightly brighter dots on
// the map; as the camera pushes in they resolve into people lit by phones.
export const People: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const pts = peoplePositions(L.cluster);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      {pts.map((p, k) => {
        const glow = 0.55 + 0.35 * Math.sin(f / 9 + k); // screens flicker independently
        return (
          <g key={k} transform={`translate(${p.x} ${p.y})`}>
            {/* head + shoulders, dark on dark, edge-lit */}
            <circle cx={0} cy={-6} r={3} fill="#0b0d12" stroke={rgba(COLORS.blue, 0.5)} strokeWidth={0.4} />
            <path d="M-6 6 Q-6 0 0 0 Q6 0 6 6 Z" fill="#0b0d12" stroke={rgba(COLORS.blue, 0.4)} strokeWidth={0.4} />
            {/* phone: a small glowing rectangle held low, lighting the face from below */}
            <rect x={-1.6} y={-1} width={3.2} height={5} fill={rgba(COLORS.blue, glow)} />
            <ellipse cx={0} cy={-3} rx={4} ry={3} fill={rgba(COLORS.blue, 0.18 * glow)} />
          </g>
        );
      })}
    </svg>
  );
};
