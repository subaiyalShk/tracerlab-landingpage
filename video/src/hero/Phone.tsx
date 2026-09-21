import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, usePalette, usePortraitFilm, type Palette } from "./config";
import { PLATFORMS } from "./marks";
import { bevelPath } from "./Reveal";
import { display } from "../theme";

// The Attention beat: a tilted phone, 40×84 world px, drawn at world scale —
// the camera's 8× zoom makes it fill the left third. It cycles through the
// five platforms we pull attention from (PLATFORMS order), one screen per
// SCREEN_FRAMES with a thumb-flick between them. Each screen is a stylized
// generic UI in the film's own tokens — never a clone. As each platform
// shows, a labelled chip lands beside the phone and STAYS, so by the end of
// the beat all five sit in a column: the point is all of these, not one.
const SCREEN_FRAMES = 30;
const FLICK_FRAMES = 10;
const CHIP_DELAY = 8; // frames after a screen arrives before its chip lands

// Which screen is up at frame f, and how far (0..1) the flick to the next has gone.
export const screenAt = (f: number) => {
  const t = Math.max(0, f - BEATS.attention.from);
  const i = Math.min(PLATFORMS.length - 1, Math.floor(t / SCREEN_FRAMES));
  const next = i + 1 < PLATFORMS.length;
  const flick = next ? interpolate(t, [(i + 1) * SCREEN_FRAMES - FLICK_FRAMES, (i + 1) * SCREEN_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return { i, flick };
};

type Screen = React.FC<{ P: Palette; w: number; h: number; t: number }>;

// Feed (Instagram / Facebook): avatar, two lines, image block, heart. Scrolls.
const Feed: Screen = ({ P, w, h, t }) => {
  const cardH = 30;
  const cards = Array.from({ length: 16 }, (_, k) => k);
  return (
    <g transform={`translate(0 ${-((t * 0.55) % (cardH * 8))})`}>
      {cards.map((k) => (
        <g key={k} transform={`translate(0 ${k * cardH})`}>
          <circle cx={5} cy={4} r={2} fill={rgba(P.ink, 0.35)} />
          <rect x={9} y={2.5} width={14} height={1.1} fill={rgba(P.ink, 0.35)} />
          <rect x={9} y={5} width={9} height={1.1} fill={rgba(P.ink, 0.2)} />
          <rect x={2} y={9} width={w - 8} height={15} fill={rgba(P.blue, 0.1 + 0.08 * ((k * 7) % 3))} />
          <path transform="translate(3 26) scale(0.22)" d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z" fill="none" stroke={rgba(P.ink, 0.35)} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
};

// Vertical video (TikTok): one full-bleed clip at a time swiping up, side
// action column, caption lines at the bottom.
const VerticalVideo: Screen = ({ P, w, h, t }) => {
  const swipe = (t * 0.9) % (h - 8);
  return (
    <g transform={`translate(0 ${-swipe})`}>
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(0 ${k * (h - 8)})`}>
          <rect x={0} y={0} width={w - 4} height={h - 8} fill={rgba(P.blue, k ? 0.22 : 0.16)} />
          <circle cx={w / 2 - 2} cy={(h - 8) * 0.42} r={5} fill={rgba(P.blue, 0.35)} />
          {[0, 1, 2].map((n) => (
            <circle key={n} cx={w - 8} cy={38 + n * 8} r={2} fill={rgba(P.ink, 0.6)} />
          ))}
          <rect x={3} y={h - 22} width={18} height={1.2} fill={rgba(P.ink, 0.7)} />
          <rect x={3} y={h - 19} width={12} height={1.2} fill={rgba(P.ink, 0.4)} />
        </g>
      ))}
    </g>
  );
};

// Search results (Google): a search bar, then title + two-line snippets.
const Search: Screen = ({ P, w, h, t }) => (
  <g>
    <rect x={2} y={2} width={w - 8} height={5} rx={2.5} fill="none" stroke={rgba(P.ink, 0.35)} strokeWidth={0.6} />
    <rect x={5} y={4} width={12} height={1.1} fill={rgba(P.ink, 0.45)} />
    <g transform={`translate(0 ${-((t * 0.3) % 24)})`}>
      {Array.from({ length: 6 }, (_, k) => (
        <g key={k} transform={`translate(0 ${11 + k * 24})`}>
          <rect x={3} y={0} width={20 + (k % 2) * 6} height={1.6} fill={rgba(P.blue, 0.85)} />
          <rect x={3} y={3.5} width={w - 12} height={1} fill={rgba(P.ink, 0.3)} />
          <rect x={3} y={6} width={w - 18} height={1} fill={rgba(P.ink, 0.3)} />
        </g>
      ))}
    </g>
  </g>
);

// Chat (ChatGPT): alternating bubbles arriving one by one, prompt bar at the bottom.
const Chat: Screen = ({ P, w, h, t }) => {
  const shown = Math.min(5, 1 + Math.floor(t / 7));
  return (
    <g>
      {Array.from({ length: shown }, (_, k) => {
        const mine = k % 2 === 1;
        const bw = mine ? 18 : 24;
        return (
          <rect key={k} x={mine ? w - 8 - bw : 3} y={4 + k * 11} width={bw} height={8} rx={2} fill={rgba(mine ? P.blue : P.ink, mine ? 0.35 : 0.12)} />
        );
      })}
      <rect x={3} y={h - 15} width={w - 10} height={5} rx={2.5} fill="none" stroke={rgba(P.ink, 0.35)} strokeWidth={0.6} />
      <rect x={6} y={h - 13} width={8} height={1} fill={rgba(P.ink, 0.3)} />
    </g>
  );
};

const SCREENS: Screen[] = [Feed, VerticalVideo, Feed, Search, Chat];

export const Phone: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const { x, y, w, h } = L.phone;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const t = Math.max(0, f - BEATS.attention.from);
  const { i, flick } = screenAt(f);
  const Cur = SCREENS[i];
  const Next = SCREENS[Math.min(i + 1, SCREENS.length - 1)];
  const CurMark = PLATFORMS[i].Mark;
  const NextMark = PLATFORMS[Math.min(i + 1, PLATFORMS.length - 1)].Mark;
  // Chip column: beside the phone in landscape; BELOW it, centered, in portrait
  // (a phone-wide frame has no room to the right). Level — outside the tilt.
  const portrait = usePortraitFilm();
  const chipW = 30;
  const chipX = portrait ? x - chipW / 2 : x + w / 2 + 12;
  const chipY0 = portrait ? y + h / 2 + 14 : y - h / 2 + 10;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <g transform={`translate(${x} ${y}) rotate(-8) translate(${-w / 2} ${-h / 2})`}>
        <defs>
          <clipPath id="phone-screen">
            <rect x={2} y={4} width={w - 4} height={h - 8} rx={2} />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={w} height={h} rx={4} fill={P.surface} stroke={rgba(P.blue, 0.55)} strokeWidth={0.6} />
        <g clipPath="url(#phone-screen)">
          <rect x={2} y={4} width={w - 4} height={h - 8} fill={P.surface} />
          {/* current screen slides out left; the next slides in from the right on the flick */}
          <g transform={`translate(${2 - flick * w} 6)`}>
            <Cur P={P} w={w} h={h} t={t} />
          </g>
          {flick > 0 && (
            <g transform={`translate(${2 + (1 - flick) * w} 6)`}>
              <Next P={P} w={w} h={h} t={t} />
            </g>
          )}
        </g>
        <g transform={`translate(${w - 8} 5.5)`} opacity={1 - flick}>
          <CurMark size={5} color={rgba(P.ink, 0.7)} />
        </g>
        {flick > 0 && (
          <g transform={`translate(${w - 8} 5.5)`} opacity={flick}>
            <NextMark size={5} color={rgba(P.ink, 0.7)} />
          </g>
        )}
        {/* screen glow onto the world */}
        <ellipse cx={w / 2} cy={h / 2} rx={w} ry={h * 0.7} fill={rgba(P.blue, 0.06)} />
      </g>

      {/* Kicker + the stacking platform chips. Each chip lands CHIP_DELAY frames after
          its screen arrives and never leaves; the column fades with the beat's end. */}
      {(() => {
        const beatOut = interpolate(f, [BEATS.reveal.from + 5, BEATS.reveal.from + 30], [1, 0], clamp);
        const kicker = interpolate(t, [4, 16], [0, 1], clamp);
        return (
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
                  <path d={bevelPath(chipX, cy, chipW, 7, 1.6)} fill={rgba(P.ink, 0.05)} stroke={rgba(P.blue, 0.55)} strokeWidth={0.35} />
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
        );
      })()}
    </svg>
  );
};
