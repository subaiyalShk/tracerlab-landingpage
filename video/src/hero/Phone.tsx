import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, usePalette } from "./config";
import { FacebookMark, InstagramMark } from "./marks";

const FLICK = 330; // frame where the thumb flicks IG → FB (11 s)

// A tilted phone, 40×84 world px, drawn at world scale — the camera's 8×
// zoom makes it fill the left third. Generic feed cards (avatar, two lines,
// image block, heart) scroll continuously; a platform mark sits in the
// corner. Stylized, not a clone of any real UI.
export const Phone: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const { x, y, w, h } = L.phone;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const scroll = (f - BEATS.attention.from) * 0.55; // world px per frame
  const flick = interpolate(f, [FLICK, FLICK + 10], [0, 1], clamp); // 0 = IG feed, 1 = FB feed
  const cardH = 30;
  const cards = Array.from({ length: 8 }, (_, k) => k);
  const feed = (offset: number, tint: number) => (
    <g transform={`translate(0 ${-((scroll + offset) % (cardH * 8))})`}>
      {cards.concat(cards).map((k, n) => (
        <g key={n} transform={`translate(0 ${n * cardH})`}>
          <circle cx={5} cy={4} r={2} fill={rgba(P.ink, 0.35)} />
          <rect x={9} y={2.5} width={14} height={1.1} fill={rgba(P.ink, 0.35)} />
          <rect x={9} y={5} width={9} height={1.1} fill={rgba(P.ink, 0.2)} />
          <rect x={2} y={9} width={w - 8} height={15} fill={rgba(P.blue, 0.1 + 0.08 * ((k * 7 + tint) % 3))} />
          <path transform="translate(3 26) scale(0.22)" d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9Z" fill={rgba(P.pink, 0)} stroke={rgba(P.ink, 0.35)} strokeWidth={2} />
        </g>
      ))}
    </g>
  );
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
          {/* two feeds: the FB feed slides in from the right on the flick */}
          <g transform={`translate(${-flick * w} 6)`}>{feed(0, 0)}</g>
          <g transform={`translate(${(1 - flick) * w} 6)`}>{feed(90, 1)}</g>
        </g>
        <g transform={`translate(${w - 8} 5.5)`} opacity={1 - flick}>
          <InstagramMark size={5} color={rgba(P.ink, 0.7)} />
        </g>
        <g transform={`translate(${w - 8} 5.5)`} opacity={flick}>
          <FacebookMark size={5} color={rgba(P.ink, 0.7)} />
        </g>
        {/* screen glow onto the world */}
        <ellipse cx={w / 2} cy={h / 2} rx={w} ry={h * 0.7} fill={rgba(P.blue, 0.06)} />
      </g>
    </svg>
  );
};
