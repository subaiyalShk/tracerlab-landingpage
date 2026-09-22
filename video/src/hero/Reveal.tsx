import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, type Pt, usePalette } from "./config";
import { phonePositions } from "./Phones";
import { PLATFORMS } from "./marks";
import { display } from "../theme";

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
  const phones = [{ x: L.phone.x, y: L.phone.y }, ...phonePositions(L.cluster)];
  const threads = phones.flatMap((p, k) => {
    const port = L.ports[k % L.ports.length];
    const top = { x: port.x, y: port.y - PORT_SIZE / 2 };
    return Array.from({ length: 2 }, (_, n) => ({
      a: { x: p.x + (n - 0.5) * 3, y: p.y + L.phone.h / 2 },
      b: { x: top.x + (n - 0.5) * 6, y: top.y },
      phase: (k * 2 + n) / (phones.length * 2),
    }));
  });
  const kicker = interpolate(f, [BEATS.reveal.to - 20, BEATS.reveal.to + 10], [0, 1], clamp);
  const kickerY = L.ports[0].y - PORT_SIZE / 2 - 24;
  // a port lights briefly whenever a pulse on one of its cables arrives (u ≈ 1)
  const portLit = L.ports.map((_, pi) =>
    Math.max(
      0,
      ...threads
        .filter((_, k) => Math.floor(k / 2) % L.ports.length === pi)
        .map((t) => {
          const u = ((f / 90 + t.phase) % 1 + 1) % 1;
          return u > 0.92 ? (u - 0.92) / 0.08 : 0;
        }),
    ),
  );
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      <defs>
        <linearGradient id="cable" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(P.blue, 0.12)} />
          <stop offset="1" stopColor={rgba(P.blue, 0.42)} />
        </linearGradient>
        <filter id="port-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
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
      <g opacity={kicker}>
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
        const lit = portLit[k];
        return (
          <g key={`port${k}`}>
            {lit > 0 && <circle cx={port.x} cy={port.y} r={PORT_SIZE * 0.7} fill={rgba(P.blue, 0.35 * lit)} filter="url(#port-glow)" />}
            <path d={bevelPath(x, y, PORT_SIZE, PORT_SIZE)} fill={rgba(P.ink, 0.04 + 0.05 * lit)} stroke={rgba(P.blue, 0.55 + 0.45 * lit)} strokeWidth={1.2} />
            <path d={bevelPath(x + 3, y + 3, PORT_SIZE - 6, PORT_SIZE - 6, 5)} fill="none" stroke={rgba(P.ink, 0.06)} strokeWidth={1} />
            <g transform={`translate(${x + 10} ${y + 10})`}>
              <Mark size={24} color={rgba(P.ink, 0.8 + 0.2 * lit)} />
            </g>
            <path d={`M${port.x} ${port.y + PORT_SIZE / 2} V${L.funnel.top}`} fill="none" stroke={rgba(P.blue, 0.45 + 0.4 * lit)} strokeWidth={1.4} />
          </g>
        );
      })}
    </svg>
  );
};
