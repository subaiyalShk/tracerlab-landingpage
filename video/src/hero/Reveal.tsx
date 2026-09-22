import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, type Pt, usePalette } from "./config";
import { cloudFloat, phonePositions } from "./Phones";
import { PLATFORMS } from "./marks";
import { display } from "../theme";
import { pop, popTransform } from "./springs";

export const PORT_SIZE = 44;

// Cubic bezier from a phone straight down into a port: vertical tangents so
// the threads read as cables falling into the funnel.
const cable = (a: Pt, b: Pt) => `M${a.x} ${a.y} C${a.x} ${(a.y + b.y) / 2} ${b.x} ${(a.y + b.y) / 2} ${b.x} ${b.y}`;
const onCable = (a: Pt, b: Pt, t: number): Pt => {
  const m = (a.y + b.y) / 2;
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * m + 3 * u * t * t * m + t * t * t * b.y,
  };
};

// Chamfered rectangle (the site's bevel) as an SVG path.
export const bevelPath = (x: number, y: number, w: number, h: number, c = 7) =>
  `M${x + c} ${y} H${x + w - c} L${x + w} ${y + c} V${y + h - c} L${x + w - c} ${y + h} H${x + c} L${x} ${y + h - c} V${y + c} Z`;

// The reveal: cables from every phone in the cloud fall into the five intake
// ports across the funnel's mouth; each port feeds straight down into it.
export const Reveal: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  // Cables appear as the camera pulls back over the cloud and stay for the film.
  const show = interpolate(f, [BEATS.reveal.from + 20, BEATS.reveal.from + 70], [0, 1], clamp);
  const phones = [
    { x: L.phone.x, y: L.phone.y },
    ...phonePositions(L.cluster).map((p, k) => {
      const { dx, dy } = cloudFloat(k, f);
      return { x: p.x + dx, y: p.y + dy };
    }),
  ];
  const threads = phones.flatMap((p, k) => {
    const port = L.ports[k % L.ports.length];
    const top = { x: port.x, y: port.y - PORT_SIZE / 2 };
    return Array.from({ length: 2 }, (_, n) => ({
      a: { x: p.x + (n - 0.5) * 3, y: p.y + L.phone.h / 2 },
      b: { x: top.x + (n - 0.5) * 6, y: top.y },
      phase: (k * 2 + n) / (phones.length * 2),
    }));
  });
  const kickerS = pop(f, BEATS.reveal.to - 16);
  const kicker = Math.min(1, kickerS * 1.6);
  const PORT_AT = (k: number) => BEATS.reveal.from + 58 + k * 5; // ports arrive left → right as the camera dives
  const kickerY = L.ports[0].y - PORT_SIZE / 2 - 24;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.blue, 0.18)} />
          <stop offset="1" stopColor={rgba(P.blue, 0.05)} />
        </linearGradient>
        <linearGradient id="cable" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.blue, 0.12)} />
          <stop offset="1" stopColor={rgba(P.blue, 0.42)} />
        </linearGradient>
      </defs>
      {threads.map((t, k) => (
        <path key={k} d={cable(t.a, t.b)} fill="none" stroke="url(#cable)" strokeWidth={0.8} />
      ))}
      {/* pulses with tails riding the cables into the ports (period 90 frames) */}
      {threads.map((t, k) => {
        const u = ((f / 90 + t.phase) % 1 + 1) % 1;
        const p = onCable(t.a, t.b, u);
        const q = onCable(t.a, t.b, Math.max(0, u - 0.05));
        return (
          <g key={`p${k}`}>
            <line x1={q.x} y1={q.y} x2={p.x} y2={p.y} stroke={rgba(P.blue, 0.45)} strokeWidth={1.4} strokeLinecap="round" />
            <circle cx={p.x} cy={p.y} r={1.7} fill={rgba(P.blue, 1)} />
          </g>
        );
      })}
      {/* THE MACHINE kicker with rules, above the ports */}
      <g opacity={kicker} transform={popTransform(kickerS, L.funnel.cx, kickerY - 4, 8)}>
        <line x1={L.funnel.cx - 150} y1={kickerY - 4} x2={L.funnel.cx - 62} y2={kickerY - 4} stroke={rgba(P.blue, 0.5)} strokeWidth={1} />
        <line x1={L.funnel.cx + 62} y1={kickerY - 4} x2={L.funnel.cx + 150} y2={kickerY - 4} stroke={rgba(P.blue, 0.5)} strokeWidth={1} />
        <text x={L.funnel.cx} y={kickerY} textAnchor="middle" fontFamily={display} fontSize={11} letterSpacing={3.5} fill={rgba(P.ink, 0.65)}>
          THE MACHINE
        </text>
      </g>
      {/* intake ports with platform marks, each feeding straight down into the mouth */}
      {L.ports.map((port, k) => {
        const { Mark } = PLATFORMS[k];
        const x = port.x - PORT_SIZE / 2;
        const y = port.y - PORT_SIZE / 2;
        const sp = pop(f, PORT_AT(k));
        return (
          <g key={`port${k}`} opacity={Math.min(1, sp * 1.6)} transform={popTransform(sp, port.x, port.y, 8)}>
            <path d={bevelPath(x, y, PORT_SIZE, PORT_SIZE)} fill="url(#glass)" stroke={rgba(P.blue, 0.6)} strokeWidth={1.2} />
            <line x1={x + 8} y1={y + 1.3} x2={x + PORT_SIZE - 8} y2={y + 1.3} stroke={rgba(P.ink, 0.18)} strokeWidth={1} />
            <g transform={`translate(${x + 10} ${y + 10})`}>
              <Mark size={24} color={rgba(P.ink, 0.85)} />
            </g>
            <path d={`M${port.x} ${port.y + PORT_SIZE / 2} V${L.funnel.top}`} fill="none" stroke={rgba(P.blue, 0.5)} strokeWidth={1.4} />
          </g>
        );
      })}
    </svg>
  );
};
