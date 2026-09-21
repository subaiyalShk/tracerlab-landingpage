import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import { BEATS, DURATION, rgba, useLayout, usePalette } from "./config";
import { decodeLand, landDots } from "./land";
import landJson from "./land.json";

// Dot-matrix world map. Breathing is periodic over the film (3 cycles in 900
// frames) so the loop closes; each dot has its own phase from a cheap hash.
const CYCLES = 3;
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

// The world is the opener only: it fades out completely as the camera arrives
// on the phone (so the Attention scene's screens and chips sit on clean
// black), stays out through the cable ride and the machine, and returns for
// the flywheel, whose arcs land in its dots — fully back before the seam.
const STEP_BACK = { from: BEATS.attention.from + 5, to: BEATS.attention.from + 40 } as const;
const RETURN = { from: BEATS.flywheel.from + 20, to: BEATS.flywheel.from + 80 } as const;
const worldPresence = (f: number) => {
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return f < BEATS.mechanism.to
    ? interpolate(f, [STEP_BACK.from, STEP_BACK.to], [1, 0], clamp)
    : interpolate(f, [RETURN.from, RETURN.to], [0, 1], clamp);
};

const ANTARCTICA_ROW = 67; // lat < -60° — Antarctica would sit on the machine floor
const LAND_CELLS = decodeLand(landJson).filter((c) => c.j < ANTARCTICA_ROW);

export const World: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const L = useLayout();
  const dots = useMemo(
    () => landDots(LAND_CELLS, L.map, landJson.cols, landJson.rows),
    [L.map.x, L.map.y, L.map.w, L.map.h],
  );
  const r = L.map.w / landJson.cols / 2 - 1.2; // dot radius from cell pitch
  const t = (f / DURATION) * CYCLES * Math.PI * 2;
  return (
    <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, opacity: worldPresence(f) }}>
      {dots.map((p, k) => {
        const ph = hash(p.x, p.y) * Math.PI * 2;
        const a = 0.22 + 0.18 * (0.5 + 0.5 * Math.sin(t + ph));
        return <circle key={k} cx={p.x} cy={p.y} r={r} fill={rgba(P.blue, a)} />;
      })}
    </svg>
  );
};
