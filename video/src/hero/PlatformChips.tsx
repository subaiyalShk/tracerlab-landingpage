import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, usePalette, usePortraitFilm } from "./config";
import { PLATFORMS } from "./marks";
import { bevelPath } from "./Reveal";
import { SCREEN_FRAMES, screenAt } from "./Phone";
import { display } from "../theme";
import { pop, popTransform } from "./springs";

const CHIP_DELAY = 8; // frames after a screen arrives before its chip lands
const CHIP_W = 36;
const CHIP_H = 8;
const GAP = 2.4;

// The stacking platform chips + kicker for the Attention beat. Beside the
// phone in landscape; BELOW it, centered, in portrait. Each chip: an accent
// bar, the mark in a tile, the name bold, the surface muted. The chip whose
// platform is on the phone right now is lit; the rest sit quiet. Rendered on
// PhoneLayer's steady slot (exact 8× scale, no shimmer).
export const PlatformChips: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const portrait = usePortraitFilm();
  const { x, y, w, h } = L.phone;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const t = Math.max(0, f - BEATS.attention.from);
  const { i: active } = screenAt(f);
  const chipX = portrait ? x - CHIP_W / 2 : x + w / 2 + 14;
  const chipY0 = portrait ? y + h / 2 + 16 : y - h / 2 + 12;
  const kickerX = portrait ? x : chipX;
  const beatOut = interpolate(f, [BEATS.reveal.from + 5, BEATS.reveal.from + 30], [1, 0], clamp);
  const kicker = interpolate(t, [4, 16], [0, 1], clamp);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <g opacity={beatOut}>
        {/* kicker + rule */}
        <text x={kickerX} y={chipY0 - 4.2} textAnchor={portrait ? "middle" : "start"} fontFamily={display} fontSize={2} letterSpacing={0.7} fill={rgba(P.ink, 0.6 * kicker)}>
          WHERE ATTENTION LIVES
        </text>
        <rect x={portrait ? x - CHIP_W / 2 : chipX} y={chipY0 - 2.2} width={CHIP_W * kicker} height={0.25} fill={rgba(P.blue, 0.6)} />

        {PLATFORMS.map(({ name, surface, Mark }, k) => {
          const at = k * SCREEN_FRAMES + CHIP_DELAY;
          const sp = pop(t, at);
          const a = Math.min(1, sp * 1.6);
          const cy = chipY0 + k * (CHIP_H + GAP);
          const lit = k === active && f < BEATS.reveal.from ? 1 : 0;
          const stroke = rgba(P.blue, 0.35 + 0.6 * lit);
          return (
            <g key={name} opacity={a} transform={popTransform(sp, chipX + CHIP_W / 2, cy + CHIP_H / 2, portrait ? 4 : 0)}>
              <path d={bevelPath(chipX, cy, CHIP_W, CHIP_H, 1.8)} fill={rgba(P.ink, 0.04 + 0.03 * lit)} stroke={stroke} strokeWidth={0.32} />
              {/* accent bar */}
              <rect x={chipX + 0.9} y={cy + 1.6} width={0.55} height={CHIP_H - 3.2} rx={0.27} fill={rgba(lit ? P.blue : P.ink, lit ? 1 : 0.3)} />
              {/* mark tile */}
              <rect x={chipX + 2.6} y={cy + 1.3} width={5.4} height={5.4} rx={1.2} fill={rgba(P.blue, 0.1 + 0.12 * lit)} />
              <g transform={`translate(${chipX + 3.4} ${cy + 2.1})`}>
                <Mark size={3.8} color={rgba(P.ink, 0.7 + 0.25 * lit)} />
              </g>
              <text x={chipX + 10} y={cy + 4.35} fontFamily={display} fontSize={2.6} fontWeight={700} fill={rgba(P.ink, 0.72 + 0.25 * lit)}>
                {name}
              </text>
              <text x={chipX + 10} y={cy + 6.75} fontFamily={display} fontSize={1.9} fill={rgba(P.ink, 0.42 + 0.15 * lit)}>
                {surface}
              </text>
              {lit === 1 && <circle cx={chipX + CHIP_W - 3} cy={cy + CHIP_H / 2} r={0.7} fill={rgba(P.blue, 1)} />}
            </g>
          );
        })}
      </g>
    </svg>
  );
};
