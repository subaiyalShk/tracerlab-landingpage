import { interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, rgba, useLayout } from "./config";
import { bevelPath } from "./Reveal";
import { display } from "../theme";

const CHIPS = [BEATS.output.from + 30, BEATS.output.from + 60, BEATS.output.from + 90];
// Rolling rates per column (rightmost fastest). Each is p/10000 with p coprime to
// 10000, so no column lands on an exact digit within the 900-frame loop and the
// columns never fall into a shared pattern — the counter is motion, never a figure.
const ODOMETER_RATES = [0.0137, 0.0311, 0.0523, 0.0719, 0.0937, 0.1171, 0.1409];
const DIGITS = ODOMETER_RATES.length;

// Everything on the right of the machine. The revenue line grows across the
// output beat; three "Booked" chips land; the $ odometer rolls continuously
// and never settles (decorative motion, not a claim). Warm tint lives ONLY
// here (spec: warmth on the output beat).
export const Output: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLayout();
  const { x, y, w, h } = L.output;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const show = interpolate(f, [BEATS.output.from, BEATS.output.from + 20], [0, 1], clamp);
  const grow = interpolate(f, [BEATS.output.from + 10, BEATS.output.to], [0, 1], clamp);
  // Revenue line: 24 points, rising with a deterministic wobble.
  const pts = Array.from({ length: 24 }, (_, k) => {
    const u = k / 23;
    const v = Math.min(u, grow);
    return { x: x + v * w * 0.72, y: y + h - 30 - v * (h - 60) - Math.sin(k * 1.7) * 6 * v };
  }).filter((p, k) => k / 23 <= grow + 1e-9);
  const line = pts.map((p, k) => `${k ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  const area = pts.length ? `${line} L${pts[pts.length - 1].x} ${y + h - 30} L${x} ${y + h - 30} Z` : "";
  // Feed from the machine's exit into the chart origin.
  const exitY = L.machine.y + L.machine.h / 2;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: show }} width={1} height={1}>
      <path d={`M${L.machine.x + L.machine.w} ${exitY} H${x - 20} V${y + h - 30} H${x}`} fill="none" stroke={rgba(COLORS.blue, 0.45)} strokeWidth={1.4} />
      <defs>
        <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rgba(COLORS.amber, 0.22)} />
          <stop offset="1" stopColor={rgba(COLORS.blue, 0)} />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#rev-area)" />}
      <path d={line} fill="none" stroke={rgba(COLORS.blue, 0.95)} strokeWidth={2} strokeLinejoin="round" />
      <line x1={x} y1={y + h - 30} x2={x + w * 0.72} y2={y + h - 30} stroke={rgba(COLORS.ink, 0.15)} strokeWidth={1} />
      {/* Booked chips stacked at the right edge */}
      {CHIPS.map((at, k) => {
        const a = interpolate(f, [at, at + 12], [0, 1], clamp);
        const dy = (1 - a) * 10;
        const cx = x + w * 0.76;
        const cy = y + h - 30 - 30 * (k + 1) + dy;
        return (
          <g key={k} opacity={a}>
            <path d={bevelPath(cx, cy, 82, 22, 5)} fill={rgba(COLORS.pink, 0.12)} stroke={rgba(COLORS.pink, 0.8)} strokeWidth={1} />
            <text x={cx + 41} y={cy + 15} textAnchor="middle" fontFamily={display} fontSize={11} letterSpacing={1.5} fill={rgba(COLORS.ink, 0.9)}>
              BOOKED
            </text>
          </g>
        );
      })}
      {/* $ odometer: each column rolls at its own rate; positions are continuous mod 10 */}
      <g transform={`translate(${x} ${y - 6})`}>
        <text x={0} y={0} fontFamily={display} fontSize={18} fill={rgba(COLORS.ink, 0.75)}>$</text>
        {Array.from({ length: DIGITS }, (_, k) => {
          const rate = ODOMETER_RATES[k];
          const pos = ((f * rate) % 10 + 10) % 10;
          const cx = 16 + k * 13;
          return (
            <g key={k}>
              <clipPath id={`od${k}`}>
                <rect x={cx - 6} y={-16} width={12} height={20} />
              </clipPath>
              <g clipPath={`url(#od${k})`}>
                {Array.from({ length: 11 }, (_, d) => (
                  <text key={d} x={cx} y={(d - pos) * 20} textAnchor="middle" fontFamily={display} fontSize={18} fill={rgba(COLORS.ink, 0.75)}>
                    {d % 10}
                  </text>
                ))}
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
