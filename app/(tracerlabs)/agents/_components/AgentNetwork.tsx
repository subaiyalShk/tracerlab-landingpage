// Hero visualization: the agent network as a circuit board. A core hub fans out to eight
// agent nodes along chamfered 45°-elbow traces (the site's bevel geometry, as wiring).
// On mount the system "boots": traces draw in, nodes pop on; then SMIL data pulses run
// along the traces forever. Strokes ride currentColor so the whole board is theme-aware;
// only the pulses + core carry brand color.
//
// SERVER component — the boot sequence is pure CSS (animate-trace-draw / animate-node-pop
// keyframes; static state is fully drawn, so reduced-motion and no-JS both render the
// complete board) and the looping pulses are SMIL (hidden under reduced motion via
// .rm-hide). The hero ships zero hydration cost for this graphic.

type Node = { x: number; y: number; label: string };

const CORE = { x: 600, y: 320 };

const NODES: Node[] = [
  { x: 240, y: 250, label: "Marketer" },
  { x: 210, y: 380, label: "Email" },
  { x: 440, y: 130, label: "Reception" },
  { x: 760, y: 120, label: "Scheduler" },
  { x: 960, y: 250, label: "Voice" },
  { x: 990, y: 380, label: "Closer" },
  { x: 760, y: 520, label: "Support" },
  { x: 440, y: 520, label: "Ops" },
];

// 45°-elbow traces from the core to each node (diagonal runs keep |dx| == |dy|).
const EDGES = [
  "M600 320 L450 320 L380 250 L240 250",
  "M600 320 L450 320 L390 380 L210 380",
  "M600 320 L520 320 L440 240 L440 130",
  "M600 320 L680 320 L760 240 L760 120",
  "M600 320 L750 320 L820 250 L960 250",
  "M600 320 L750 320 L810 380 L990 380",
  "M600 320 L680 320 L760 400 L760 520",
  "M600 320 L520 320 L440 400 L440 520",
];

// Chamfered node plate (top-right + bottom-left cuts — the .bv-6 shape, 22px).
function plate(x: number, y: number, s = 22) {
  const c = s * 0.3;
  const left = x - s / 2;
  const top = y - s / 2;
  return `M${left} ${top} H${left + s - c} L${left + s} ${top + c} V${top + s} H${left + c} L${left} ${top + s - c} Z`;
}

const POP_ORIGIN = { transformBox: "fill-box", transformOrigin: "center" } as const;

export default function AgentNetwork({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 640"
      fill="none"
      aria-hidden
      className={`text-ink ${className}`}
      style={{ width: "100%", height: "auto" }}
    >
      <defs>
        <linearGradient id="agnet-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7028d" />
          <stop offset="100%" stopColor="#056afc" />
        </linearGradient>
        <radialGradient id="agnet-pulse-pink">
          <stop offset="0%" stopColor="#e7028d" />
          <stop offset="100%" stopColor="#e7028d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="agnet-pulse-blue">
          <stop offset="0%" stopColor="#056afc" />
          <stop offset="100%" stopColor="#056afc" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* traces — pathLength=1 normalizes every trace so one dasharray/keyframe draws all */}
      {EDGES.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="1.2"
          className="animate-trace-draw"
          style={{ strokeDasharray: 1, animationDelay: `${(0.25 + i * 0.08).toFixed(2)}s` }}
        />
      ))}

      {/* data pulses — SMIL motion along each trace, alternating brand colors */}
      {EDGES.map((d, i) => (
        <circle key={`p${i}`} r="3.2" fill={`url(#agnet-pulse-${i % 2 ? "blue" : "pink"})`} opacity="0.9" className="rm-hide">
          <animateMotion
            dur={`${3.4 + (i % 4) * 0.9}s`}
            begin={`${1.4 + i * 0.45}s`}
            repeatCount="indefinite"
            path={d}
            keyPoints={i % 3 === 2 ? "1;0" : "0;1"}
            keyTimes="0;1"
            calcMode="linear"
          />
        </circle>
      ))}

      {/* agent nodes */}
      {NODES.map((n, i) => (
        <g
          key={n.label}
          className="animate-node-pop"
          style={{ ...POP_ORIGIN, animationDelay: `${(0.8 + i * 0.08).toFixed(2)}s` }}
        >
          <path d={plate(n.x, n.y)} fill="var(--tl-surface)" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
          <circle cx={n.x} cy={n.y} r="2.6" fill={i % 2 ? "#056afc" : "#e7028d"}>
            <animate
              attributeName="opacity"
              values="1;0.25;1"
              dur="2.2s"
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
          <text
            x={n.x}
            y={n.y + (n.y > CORE.y ? 34 : -26)}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity="0.45"
            fontSize="11"
            letterSpacing="2.5"
            style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
          >
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* core hub */}
      <g className="animate-node-pop" style={POP_ORIGIN}>
        <circle cx={CORE.x} cy={CORE.y} r="20" stroke="url(#agnet-core)" strokeOpacity="0.5" strokeWidth="1" className="rm-hide">
          <animate attributeName="r" values="20;46" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx={CORE.x} cy={CORE.y} r="20" stroke="url(#agnet-core)" strokeOpacity="0.5" strokeWidth="1" className="rm-hide">
          <animate attributeName="r" values="20;46" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
        </circle>
        <path d={plate(CORE.x, CORE.y, 40)} fill="var(--tl-surface)" stroke="url(#agnet-core)" strokeWidth="1.4" />
        <text
          x={CORE.x}
          y={CORE.y + 4.5}
          textAnchor="middle"
          fill="currentColor"
          fontSize="12"
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AI
        </text>
        <text
          x={CORE.x}
          y={CORE.y + 46}
          textAnchor="middle"
          fill="currentColor"
          fillOpacity="0.5"
          fontSize="11"
          letterSpacing="2.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AUTOPILOT CORE
        </text>
      </g>
    </svg>
  );
}
