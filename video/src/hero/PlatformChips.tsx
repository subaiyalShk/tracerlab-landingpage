import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, usePalette, usePortraitFilm } from "./config";
import { PLATFORMS } from "./marks";
import { bevelPath } from "./Reveal";
import { SCREEN_FRAMES } from "./Phone";
import { display } from "../theme";

const CHIP_DELAY = 8; // frames after a screen arrives before its chip lands
const CHIP_W = 30;

// The stacking platform chips + kicker for the Attention beat. Beside the
// phone in landscape; BELOW it, centered, in portrait (a phone-wide frame has
// no room to the right). Rendered on PhoneLayer's steady slot: an exact 8×
// scale, so the thin strokes and small text never re-rasterize mid-settle.
export const PlatformChips: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const portrait = usePortraitFilm();
  const { x, y, w, h } = L.phone;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const t = Math.max(0, f - BEATS.attention.from);
  const chipX = portrait ? x - CHIP_W / 2 : x + w / 2 + 12;
  const chipY0 = portrait ? y + h / 2 + 14 : y - h / 2 + 10;
  const beatOut = interpolate(f, [BEATS.reveal.from + 5, BEATS.reveal.from + 30], [1, 0], clamp);
  const kicker = interpolate(t, [4, 16], [0, 1], clamp);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <g opacity={beatOut}>
        <text x={portrait ? x : chipX} y={chipY0 - 3} textAnchor={portrait ? "middle" : "start"} fontFamily={display} fontSize={2} letterSpacing={0.6} fill={rgba(P.ink, 0.55 * kicker)}>
          WHERE ATTENTION LIVES
        </text>
        {PLATFORMS.map(({ name, surface, Mark }, k) => {
          const at = k * SCREEN_FRAMES + CHIP_DELAY;
          const a = interpolate(t, [at, at + 10], [0, 1], clamp);
          const dx = (1 - a) * 4;
          const cy = chipY0 + k * 9;
          return (
            <g key={name} opacity={a} transform={`translate(${dx} 0)`}>
              <path d={bevelPath(chipX, cy, CHIP_W, 7, 1.6)} fill={rgba(P.ink, 0.05)} stroke={rgba(P.blue, 0.55)} strokeWidth={0.35} />
              <g transform={`translate(${chipX + 1.8} ${cy + 1.5})`}>
                <Mark size={4} color={rgba(P.ink, 0.85)} />
              </g>
              <text x={chipX + 7.5} y={cy + 4.9} fontFamily={display} fontSize={2.6} fill={rgba(P.ink, 0.9)}>
                {name}
                <tspan fill={rgba(P.ink, 0.5)}> · {surface}</tspan>
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
