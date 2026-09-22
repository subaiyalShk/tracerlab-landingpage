import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, usePalette, type Palette } from "./config";
import { display } from "../theme";
import { PLATFORMS } from "./marks";

// The Attention beat: a tilted phone, 40×84 world px, drawn at world scale —
// the camera's 8× zoom makes it fill the left third. It cycles through the
// five platforms we pull attention from (PLATFORMS order), one screen per
// SCREEN_FRAMES with a thumb-flick between them. Each screen is a stylized
// generic UI in the film's own tokens — never a clone. As each platform
// shows, a labelled chip lands beside it (PlatformChips — a separate, steady
// layer) and STAYS: the point is all of these, not one.
export const SCREEN_FRAMES = 30;
const FLICK_FRAMES = 10;

// Which screen is up at frame f, and how far (0..1) the flick to the next has gone.
export const screenAt = (f: number) => {
  const t = Math.max(0, f - BEATS.attention.from);
  const i = Math.min(PLATFORMS.length - 1, Math.floor(t / SCREEN_FRAMES));
  const next = i + 1 < PLATFORMS.length;
  const flick = next ? interpolate(t, [(i + 1) * SCREEN_FRAMES - FLICK_FRAMES, (i + 1) * SCREEN_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return { i, flick };
};

type Screen = React.FC<{ P: Palette; w: number; h: number; t: number }>;

// Every screen gets a thin header (title lines) and a bottom tab bar; content
// lives between them. Coordinates are local to the screen (0,0 = its top-left).
const Chrome: React.FC<{ P: Palette; w: number; h: number; tabs?: boolean }> = ({ P, w, h, tabs = true }) => (
  <g>
    <rect x={3} y={2.2} width={10} height={1.4} rx={0.7} fill={rgba(P.ink, 0.6)} />
    <circle cx={w - 7} cy={2.9} r={1.1} fill="none" stroke={rgba(P.ink, 0.45)} strokeWidth={0.35} />
    {tabs && (
      <g>
        <rect x={0} y={h - 12.5} width={w - 4} height={0.3} fill={rgba(P.ink, 0.12)} />
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={4 + k * ((w - 12) / 4)} cy={h - 9.5} r={1} fill={rgba(P.ink, k === 0 ? 0.8 : 0.3)} />
        ))}
      </g>
    )}
  </g>
);

// Feed (Instagram / Facebook): avatar, two lines, image, action row. Scrolls.
const Feed: Screen = ({ P, w, h, t }) => {
  const cardH = 31;
  const cards = Array.from({ length: 16 }, (_, k) => k);
  return (
    <g>
      <g clipPath="url(#feed-clip)">
        <g transform={`translate(0 ${6 - ((t * 0.55) % (cardH * 8))})`}>
          {cards.map((k) => (
            <g key={k} transform={`translate(0 ${k * cardH})`}>
              <circle cx={5.5} cy={4} r={2.1} fill={rgba(P.blue, 0.35)} />
              <rect x={9} y={2.4} width={13} height={1.2} rx={0.6} fill={rgba(P.ink, 0.6)} />
              <rect x={9} y={5} width={8} height={1} rx={0.5} fill={rgba(P.ink, 0.25)} />
              <rect x={3} y={8.6} width={w - 10} height={15.5} rx={1.6} fill={rgba(P.blue, 0.12 + 0.08 * ((k * 7) % 3))} />
              <path transform="translate(3.5 26) scale(0.2)" d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z" fill="none" stroke={rgba(P.ink, 0.5)} strokeWidth={2} />
              <circle cx={11} cy={28.2} r={1.1} fill="none" stroke={rgba(P.ink, 0.5)} strokeWidth={0.4} />
              <path d="M15 27.2 l2.4 1 l-2.4 1 z" fill={rgba(P.ink, 0.5)} />
            </g>
          ))}
        </g>
      </g>
      <Chrome P={P} w={w} h={h} />
    </g>
  );
};

// Vertical video (TikTok): one full-bleed clip at a time swiping up, side
// action column, caption lines at the bottom.
const VerticalVideo: Screen = ({ P, w, h, t }) => {
  const swipe = (t * 0.9) % (h - 8);
  return (
    <g>
      <g clipPath="url(#feed-clip)">
        <g transform={`translate(0 ${-swipe})`}>
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(0 ${k * (h - 8)})`}>
              <rect x={0} y={0} width={w - 4} height={h - 8} fill={rgba(P.blue, k ? 0.24 : 0.17)} />
              <circle cx={(w - 4) / 2} cy={(h - 8) * 0.42} r={6} fill={rgba(P.blue, 0.4)} />
              <path d={`M${(w - 4) / 2 - 1.6} ${(h - 8) * 0.42 - 2.4} l4 2.4 l-4 2.4 z`} fill={rgba(P.ink, 0.9)} />
              {[0, 1, 2].map((n) => (
                <g key={n}>
                  <circle cx={w - 8.5} cy={36 + n * 8.5} r={2.3} fill={rgba(P.ink, 0.14)} />
                  <circle cx={w - 8.5} cy={36 + n * 8.5} r={1} fill={rgba(P.ink, 0.8)} />
                </g>
              ))}
              <rect x={3} y={h - 24} width={17} height={1.3} rx={0.6} fill={rgba(P.ink, 0.85)} />
              <rect x={3} y={h - 21} width={12} height={1.1} rx={0.5} fill={rgba(P.ink, 0.45)} />
            </g>
          ))}
        </g>
      </g>
      <Chrome P={P} w={w} h={h} tabs={false} />
    </g>
  );
};

// Search results (Google): a search bar, then title + two-line snippets.
const Search: Screen = ({ P, w, h, t }) => (
  <g>
    <rect x={2.5} y={6} width={w - 9} height={5.4} rx={2.7} fill={rgba(P.ink, 0.06)} stroke={rgba(P.ink, 0.3)} strokeWidth={0.4} />
    <circle cx={6} cy={8.7} r={1.2} fill="none" stroke={rgba(P.ink, 0.6)} strokeWidth={0.4} />
    <rect x={9} y={8.1} width={11} height={1.2} rx={0.6} fill={rgba(P.ink, 0.5)} />
    <g clipPath="url(#search-clip)">
      <g transform={`translate(0 ${-((t * 0.3) % 24)})`}>
        {Array.from({ length: 6 }, (_, k) => (
          <g key={k} transform={`translate(0 ${16 + k * 24})`}>
            <circle cx={4.6} cy={1} r={1.4} fill={rgba(P.blue, 0.3)} />
            <rect x={7.5} y={0.2} width={12} height={1.1} rx={0.5} fill={rgba(P.ink, 0.35)} />
            <rect x={3} y={4.5} width={20 + (k % 2) * 5} height={1.8} rx={0.6} fill={rgba(P.blue, 0.9)} />
            <rect x={3} y={8.2} width={w - 12} height={1} rx={0.5} fill={rgba(P.ink, 0.3)} />
            <rect x={3} y={10.6} width={w - 18} height={1} rx={0.5} fill={rgba(P.ink, 0.3)} />
          </g>
        ))}
      </g>
    </g>
    <Chrome P={P} w={w} h={h} tabs={false} />
  </g>
);

// Chat (ChatGPT): alternating bubbles arriving one by one, prompt bar at the bottom.
const Chat: Screen = ({ P, w, h, t }) => {
  const shown = Math.min(5, 1 + Math.floor(t / 7));
  return (
    <g>
      {Array.from({ length: shown }, (_, k) => {
        const mine = k % 2 === 1;
        const bw = mine ? 18 : 25;
        return (
          <g key={k}>
            <rect x={mine ? w - 8 - bw : 3} y={7 + k * 11} width={bw} height={8} rx={2.4} fill={rgba(mine ? P.blue : P.ink, mine ? 0.4 : 0.1)} />
            <rect x={(mine ? w - 8 - bw : 3) + 2.4} y={9.4 + k * 11} width={bw - 6} height={1} rx={0.5} fill={rgba(P.ink, 0.5)} />
            <rect x={(mine ? w - 8 - bw : 3) + 2.4} y={11.8 + k * 11} width={bw - 10} height={1} rx={0.5} fill={rgba(P.ink, 0.3)} />
          </g>
        );
      })}
      <rect x={3} y={h - 17} width={w - 10} height={6} rx={3} fill={rgba(P.ink, 0.06)} stroke={rgba(P.ink, 0.3)} strokeWidth={0.4} />
      <rect x={6} y={h - 14.6} width={9} height={1.1} rx={0.5} fill={rgba(P.ink, 0.35)} />
      <circle cx={w - 10.5} cy={h - 14} r={1.9} fill={rgba(P.ink, 0.85)} />
      <path d={`M${w - 11.2} ${h - 13.2} l0.7 -1.6 l0.7 1.6`} fill="none" stroke={P.surface} strokeWidth={0.4} />
      <Chrome P={P} w={w} h={h} tabs={false} />
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
  const sw = w - 4; // screen width
  const sh = h - 8; // screen height
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <defs>
        <clipPath id="phone-screen">
          <rect x={2} y={4} width={sw} height={sh} rx={3.6} />
        </clipPath>
        <clipPath id="feed-clip">
          <rect x={0} y={5.5} width={sw} height={sh - 18} />
        </clipPath>
        <clipPath id="search-clip">
          <rect x={0} y={13} width={sw} height={sh - 13} />
        </clipPath>
        <filter id="phone-rim" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation={2.2} />
        </filter>
        <linearGradient id="phone-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={rgba(P.ink, 0.14)} />
          <stop offset="1" stopColor={rgba(P.ink, 0.02)} />
        </linearGradient>
      </defs>
      <g transform={`translate(${x} ${y}) rotate(-8) translate(${-w / 2} ${-h / 2})`}>
        {/* soft rim glow behind the body (replaces the old oval) */}
        <rect x={-0.6} y={-0.6} width={w + 1.2} height={h + 1.2} rx={6} fill={rgba(P.blue, 0.5)} filter="url(#phone-rim)" />
        {/* body + bezel */}
        <rect x={0} y={0} width={w} height={h} rx={5.6} fill={P.surface} stroke={rgba(P.blue, 0.75)} strokeWidth={0.45} />
        <rect x={0} y={0} width={w} height={h} rx={5.6} fill="url(#phone-body)" />
        <rect x={1.1} y={1.1} width={w - 2.2} height={h - 2.2} rx={4.8} fill="none" stroke={rgba(P.ink, 0.1)} strokeWidth={0.3} />
        {/* side buttons */}
        <rect x={-0.55} y={17} width={0.55} height={3} rx={0.25} fill={rgba(P.blue, 0.6)} />
        <rect x={-0.55} y={22} width={0.55} height={5} rx={0.25} fill={rgba(P.blue, 0.6)} />
        <rect x={-0.55} y={28.5} width={0.55} height={5} rx={0.25} fill={rgba(P.blue, 0.6)} />
        <rect x={w} y={24} width={0.55} height={8} rx={0.25} fill={rgba(P.blue, 0.6)} />
        {/* screen */}
        <rect x={2} y={4} width={sw} height={sh} rx={3.6} fill={rgba(P.blue, 0.05)} />
        <g clipPath="url(#phone-screen)">
          <rect x={2} y={4} width={sw} height={sh} fill={rgba(P.blue, 0.06)} />
          {/* current screen slides out left; the next slides in from the right on the flick */}
          <g transform={`translate(${2 - flick * w} ${4 + 4.5})`}>
            <Cur P={P} w={w} h={sh - 4.5} t={t} />
          </g>
          {flick > 0 && (
            <g transform={`translate(${2 + (1 - flick) * w} ${4 + 4.5})`}>
              <Next P={P} w={w} h={sh - 4.5} t={t} />
            </g>
          )}
          {/* status bar */}
          <text x={5} y={7.3} fontFamily={display} fontSize={1.9} fontWeight={700} fill={rgba(P.ink, 0.85)}>
            9:41
          </text>
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={w - 13 + k * 1.1} y={7.2 - k * 0.45} width={0.7} height={1.2 + k * 0.45} fill={rgba(P.ink, k < 3 ? 0.85 : 0.35)} />
          ))}
          <rect x={w - 7.4} y={5.4} width={3.6} height={1.9} rx={0.5} fill="none" stroke={rgba(P.ink, 0.7)} strokeWidth={0.3} />
          <rect x={w - 7.1} y={5.7} width={2.4} height={1.3} rx={0.3} fill={rgba(P.ink, 0.85)} />
          {/* home indicator */}
          <rect x={w / 2 - 6} y={h - 6.2} width={12} height={0.7} rx={0.35} fill={rgba(P.ink, 0.5)} />
        </g>
        {/* dynamic island */}
        <rect x={w / 2 - 5} y={5} width={10} height={2.6} rx={1.3} fill={P.bg} />
        {/* platform mark (top-right of the screen, below the status bar) */}
        <g transform={`translate(${w - 8.2} 9.2)`} opacity={1 - flick}>
          <CurMark size={4.4} color={rgba(P.ink, 0.85)} />
        </g>
        {flick > 0 && (
          <g transform={`translate(${w - 8.2} 9.2)`} opacity={flick}>
            <NextMark size={4.4} color={rgba(P.ink, 0.85)} />
          </g>
        )}
      </g>
    </svg>
  );
};
