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

// Once the camera leaves the phone and rides the cables down to the machine,
// the world steps back to a faint ghost so the floor pipeline is the focus
// (the camera can't zoom past ~1.15 without cropping the pipeline, so the map
// would otherwise still fill the frame). It returns for the flywheel, whose
// arcs land in its dots — and is fully back well before the loop's seam.
const GHOST = 0.12;
const STEP_BACK = { from: BEATS.reveal.from + 40, to: BEATS.reveal.from + 110 } as const;
const RETURN = { from: BEATS.flywheel.from + 20, to: BEATS.flywheel.from + 80 } as const;
const worldPresence = (f: number) => {
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return f < BEATS.mechanism.to
    ? interpolate(f, [STEP_BACK.from, STEP_BACK.to], [1, GHOST], clamp)
    : interpolate(f, [RETURN.from, RETURN.to], [GHOST, 1], clamp);
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
