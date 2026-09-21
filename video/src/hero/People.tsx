import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, type Pt, usePalette } from "./config";

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
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const pts = peoplePositions(L.cluster);
  // Dim the crowd while the phone has the scene (the chip column reads over
  // them), back to full for the cable ride, where they are the cable sources.
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const presence =
    f < BEATS.reveal.from
      ? interpolate(f, [BEATS.attention.from + 5, BEATS.attention.from + 40], [1, 0.3], clamp)
      : interpolate(f, [BEATS.reveal.from, BEATS.reveal.from + 30], [0.3, 1], clamp);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: presence }} width={1} height={1}>
      {pts.map((p, k) => {
        const glow = 0.55 + 0.35 * Math.sin(f / 9 + k); // screens flicker independently
        return (
          <g key={k} transform={`translate(${p.x} ${p.y})`}>
            {/* head + shoulders, dark on dark, edge-lit */}
            <circle cx={0} cy={-6} r={3} fill={P.surface} stroke={rgba(P.blue, 0.5)} strokeWidth={0.4} />
            <path d="M-6 6 Q-6 0 0 0 Q6 0 6 6 Z" fill={P.surface} stroke={rgba(P.blue, 0.4)} strokeWidth={0.4} />
            {/* phone: a small glowing rectangle held low, lighting the face from below */}
            <rect x={-1.6} y={-1} width={3.2} height={5} fill={rgba(P.blue, glow)} />
            <ellipse cx={0} cy={-3} rx={4} ry={3} fill={rgba(P.blue, 0.18 * glow)} />
          </g>
        );
      })}
    </svg>
  );
};
