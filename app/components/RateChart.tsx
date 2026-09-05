// Monthly lead → booked-consult rate for the solar engine, from the production
// Redis leads list (updated 2026-09). Shared between the /work/solar-lead-engine
// case study and the homepage telemetry panel (`compact`).
// Static editorial figure: one series, one hue; the agent-launch annotation
// carries the before/after story, values are direct-labeled.

export const SOLAR_RATE_BY_MONTH = [
  { m: "Apr", v: 20 },
  { m: "May", v: 28 },
  { m: "Jun", v: 58 },
  { m: "Jul", v: 50 },
  { m: "Aug", v: 40 },
  { m: "Sep", v: 42 },
];

// Results accent — brand blue (validated ≥3:1 on both light & dark surfaces).
export const ACCENT = "#056AFC";

export default function RateChart({ compact = false }: { compact?: boolean }) {
  const W = 560;
  const H = compact ? 168 : 210;
  const padX = 8;
  const chartTop = 26;
  const baseline = compact ? 128 : 168;
  const max = 60;
  const n = SOLAR_RATE_BY_MONTH.length;
  const slot = (W - padX * 2) / n;
  const barW = Math.min(52, slot - 18);
  const x = (i: number) => padX + slot * i + (slot - barW) / 2;
  const y = (v: number) => baseline - ((baseline - chartTop) * v) / max;
  // annotation between May (i=1) and Jun (i=2)
  const annX = padX + slot * 2 - 9;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Lead to consultation rate by month: April 20%, May 28%, June 58%, July 50%, August 40%, September 42%. The AI texting agent went live at the end of May."
      className="nt-chart w-full"
    >
      {/* baseline */}
      <line x1={padX} y1={baseline} x2={W - padX} y2={baseline} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
      {/* agent-launch annotation */}
      <line x1={annX} y1={chartTop - 12} x2={annX} y2={baseline} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 4" />
      <text x={annX - 8} y={chartTop - 8} textAnchor="end" fill="currentColor" fillOpacity="0.6" fontSize={compact ? 13 : 12}>
        AI texting agent live
      </text>
      {SOLAR_RATE_BY_MONTH.map((d, i) => (
        <g key={d.m}>
          <rect x={x(i)} y={y(d.v)} width={barW} height={baseline - y(d.v)} rx="4" fill={ACCENT} />
          {/* square off the bottom corners so bars sit on the baseline */}
          <rect x={x(i)} y={baseline - 5} width={barW} height={5} fill={ACCENT} />
          <text x={x(i) + barW / 2} y={y(d.v) - 8} textAnchor="middle" fill="currentColor" fillOpacity="0.85" fontSize={compact ? 15 : 14} fontWeight="600">
            {d.v}%
          </text>
          <text x={x(i) + barW / 2} y={baseline + 22} textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize={compact ? 14 : 13}>
            {d.m}
          </text>
        </g>
      ))}
      {!compact && (
        <text x={padX} y={H - 2} fill="currentColor" fillOpacity="0.45" fontSize="12">
          Share of captured leads that booked a consultation, by month
        </text>
      )}
    </svg>
  );
}
