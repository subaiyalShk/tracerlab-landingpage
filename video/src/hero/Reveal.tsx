import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, rgba, useLayout, type Pt, usePalette } from "./config";
import { peoplePositions } from "./People";
import { ChatGPTMark, FacebookMark, GoogleMark, InstagramMark } from "./marks";

export const PORT_SIZE = 44;
const MARKS = [InstagramMark, FacebookMark, GoogleMark, ChatGPTMark];

// Cubic bezier from a person straight down into a port: vertical tangents so
// the threads read as cables falling into the floor.
const cable = (a: Pt, b: Pt) => `M${a.x} ${a.y} C${a.x} ${(a.y + b.y) / 2} ${b.x} ${(a.y + b.y) / 2} ${b.x} ${b.y}`;
const onCable = (a: Pt, b: Pt, t: number): Pt => {
  const m = (a.y + b.y) / 2;
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * m + 3 * u * t * t * m + t * t * t * b.y,
  };
};

// Chamfered square (the site's bevel) as an SVG path.
export const bevelPath = (x: number, y: number, w: number, h: number, c = 7) =>
  `M${x + c} ${y} H${x + w - c} L${x + w} ${y + c} V${y + h - c} L${x + w - c} ${y + h} H${x + c} L${x} ${y + h - c} V${y + c} Z`;

export const Reveal: React.FC = () => {
  const P = usePalette();
  const f = useCurrentFrame();
  const L = useLayout();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  // Threads fade in as the camera pulls out (first half of the beat) and
  // stay for the rest of the film; they never show before the reveal.
  const show = interpolate(f, [BEATS.reveal.from + 20, BEATS.reveal.from + 75], [0, 1], clamp);
  const people = peoplePositions(L.cluster);
  const threads = people.flatMap((p, k) => {
    const port = L.ports[k % L.ports.length];
    const top = { x: port.x, y: port.y - PORT_SIZE / 2 };
    return Array.from({ length: 4 }, (_, n) => ({
      a: { x: p.x + (n - 1.5) * 1.6, y: p.y + 6 },
      b: { x: top.x + (n - 1.5) * 4, y: top.y },
      phase: (k * 4 + n) / (people.length * 4),
    }));
  });
  const intakeY = L.machine.y + L.machine.h / 2;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      {threads.map((t, k) => (
        <path key={k} d={cable(t.a, t.b)} fill="none" stroke={rgba(P.blue, 0.22)} strokeWidth={0.7} />
      ))}
      {/* pulses riding the threads into the ports (period 90 frames — divides 900) */}
      {threads.map((t, k) => {
        const u = ((f / 90 + t.phase) % 1 + 1) % 1;
        const p = onCable(t.a, t.b, u);
        return <circle key={`p${k}`} cx={p.x} cy={p.y} r={1.6} fill={rgba(P.blue, 0.9)} />;
      })}
      {/* intake ports with platform marks, and traces from each port into the machine */}
      {L.ports.map((port, k) => {
        const Mark = MARKS[k];
        const x = port.x - PORT_SIZE / 2;
        const y = port.y - PORT_SIZE / 2;
        return (
          <g key={`port${k}`}>
            <path d={bevelPath(x, y, PORT_SIZE, PORT_SIZE)} fill={rgba(P.ink, 0.03)} stroke={rgba(P.blue, 0.6)} strokeWidth={1.2} />
            <g transform={`translate(${x + 10} ${y + 10})`}>
              <Mark size={24} color={rgba(P.ink, 0.8)} />
            </g>
            <path
              d={`M${port.x + PORT_SIZE / 2} ${port.y} H${port.x + PORT_SIZE / 2 + 16} V${intakeY} H${L.machine.x}`}
              fill="none"
              stroke={rgba(P.blue, 0.45)}
              strokeWidth={1.4}
            />
          </g>
        );
      })}
    </svg>
  );
};
