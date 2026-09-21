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
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      {threads.map((t, k) => (
        <path key={k} d={cable(t.a, t.b)} fill="none" stroke={rgba(P.blue, 0.22)} strokeWidth={0.7} />
      ))}
      {/* pulses riding the cables into the ports (period 90 frames — divides 900) */}
      {threads.map((t, k) => {
        const u = ((f / 90 + t.phase) % 1 + 1) % 1;
        const p = onCable(t.a, t.b, u);
        return <circle key={`p${k}`} cx={p.x} cy={p.y} r={1.6} fill={rgba(P.blue, 0.9)} />;
      })}
      {/* THE MACHINE kicker sits above the ports */}
      <text x={L.funnel.cx} y={L.ports[0].y - PORT_SIZE / 2 - 22} textAnchor="middle" fontFamily={display} fontSize={11} letterSpacing={3.5} fill={rgba(P.ink, 0.55 * kicker)}>
        THE MACHINE
      </text>
      {/* intake ports with platform marks, each feeding straight down into the mouth */}
      {L.ports.map((port, k) => {
        const { Mark } = PLATFORMS[k];
        const x = port.x - PORT_SIZE / 2;
        const y = port.y - PORT_SIZE / 2;
        return (
          <g key={`port${k}`}>
            <path d={bevelPath(x, y, PORT_SIZE, PORT_SIZE)} fill={rgba(P.ink, 0.03)} stroke={rgba(P.blue, 0.6)} strokeWidth={1.2} />
            <g transform={`translate(${x + 10} ${y + 10})`}>
              <Mark size={24} color={rgba(P.ink, 0.8)} />
            </g>
            <path d={`M${port.x} ${port.y + PORT_SIZE / 2} V${L.funnel.top}`} fill="none" stroke={rgba(P.blue, 0.45)} strokeWidth={1.4} />
          </g>
        );
      })}
    </svg>
  );
};
