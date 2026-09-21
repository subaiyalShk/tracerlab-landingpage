import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, type Pt, usePalette } from "./config";

const ARCS = 4;
// Quadratic arc from the output up over the top band back into the map.
const arc = (a: Pt, c: Pt, b: Pt) => `M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`;
const onArc = (a: Pt, c: Pt, b: Pt, t: number): Pt => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};

// Revenue → ads → attention: pulses leave the output, arc across the top
// band and land back among the map's dots. Fades in over the beat and is
// gone by the black dip, so frame 0 never shows it.
export const Flywheel: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const show = Math.min(
    interpolate(f, [BEATS.flywheel.from, BEATS.flywheel.from + 25], [0, 1], clamp),
    interpolate(f, [BEATS.flywheel.to - 30, BEATS.flywheel.to - 15], [1, 0], clamp),
  );
  const start = { x: L.output.x + L.output.w * 0.36, y: L.output.y + L.output.h }; // chart bottom, under the spout
  const arcs = Array.from({ length: ARCS }, (_, k) => {
    const end = { x: L.map.x + L.map.w * (0.18 + k * 0.12), y: L.map.y + L.map.h * (0.28 + (k % 2) * 0.12) };
    const ctrl = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - L.map.h * 0.35 };
    return { end, ctrl, phase: k / ARCS };
  });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      {arcs.map((a, k) => (
        <path key={k} d={arc(start, a.ctrl, a.end)} fill="none" stroke={rgba(P.blue, 0.18)} strokeWidth={1} strokeDasharray="4 8" />
      ))}
      {arcs.map((a, k) => {
        const u = (((f - BEATS.flywheel.from) / 60 + a.phase) % 1 + 1) % 1;
        const p = onArc(start, a.ctrl, a.end, u);
        return <circle key={`p${k}`} cx={p.x} cy={p.y} r={2.4} fill={rgba(P.blue, 0.95)} />;
      })}
    </svg>
  );
};
