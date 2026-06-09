import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { useFadeUp, usePortrait } from "../anim";
import { Scene, SceneTitle, Pill, AccentGlow } from "./parts";

const QUERY = "solar installer near me";
const TYPE_START = 16;
const TYPE_SPEED = 1.3; // frames per character

const RESULTS = [
  { name: "SunRise Solar Co.", tag: "Gets the call", winner: true },
  { name: "BrightVolt Energy", tag: "Sponsored", winner: false },
  { name: "Peak Power Solar", tag: "4.8 ★", winner: false },
];

export const SceneInvisible: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = Math.max(0, Math.min(QUERY.length, Math.floor((frame - TYPE_START) / TYPE_SPEED)));
  const typed = QUERY.slice(0, chars);
  const typingDone = chars >= QUERY.length;
  const cursorOn = !typingDone && frame % 16 < 9;
  const resultsStart = TYPE_START + QUERY.length * TYPE_SPEED + 6;
  // gentle pulsing glow on the winning result
  const winnerPulse = frame > resultsStart + 8 ? 0.5 + 0.5 * Math.sin((frame - resultsStart) / 7) : 0;
  const portrait = usePortrait();

  return (
    <Scene>
      <AccentGlow color="rgba(245,179,1,0.18)" delay={10} />
      <SceneTitle kicker="Good homeowners never hear from you" title="Ready buyers are searching — for someone else." />
      <div
        style={{
          display: "flex",
          flexDirection: portrait ? "column" : "row",
          alignItems: "center",
          gap: portrait ? 40 : 56,
          marginTop: portrait ? 40 : 60,
        }}
      >
        {/* Search card */}
        <div
          style={{
            width: portrait ? 880 : 720,
            borderRadius: 24,
            border: `1px solid ${C.line}`,
            background: C.surface,
            padding: 30,
            boxShadow: "0 24px 70px -30px rgba(120,72,10,0.25)",
            ...useFadeUp(8),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: `1px solid ${C.line}`,
              borderRadius: 999,
              padding: "16px 22px",
              color: C.ink,
              fontSize: 24,
            }}
          >
            <span style={{ color: C.faint }}>⌕</span>
            {typed}
            <span style={{ opacity: cursorOn ? 1 : 0, color: C.faint, fontWeight: 300 }}>|</span>
          </div>
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            {RESULTS.map((r, i) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 22px",
                  borderRadius: 16,
                  border: `1px solid ${r.winner ? C.solar : C.line}`,
                  background: r.winner ? "rgba(245,179,1,0.10)" : "transparent",
                  boxShadow: r.winner ? `0 0 ${10 + winnerPulse * 26}px rgba(245,179,1,${0.25 + winnerPulse * 0.3})` : "none",
                  ...useFadeUp(resultsStart + i * 12),
                }}
              >
                <span style={{ fontSize: 24, fontWeight: r.winner ? 700 : 500, color: C.ink }}>{r.name}</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: r.winner ? C.emberDeep : C.faint }}>
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meanwhile, you */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, ...useFadeUp(resultsStart + 40) }}>
          <div style={{ fontSize: 64, opacity: 0.5 }}>🚪</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.sand, textAlign: "center", maxWidth: 320 }}>
            You&apos;re three streets over,
            <br />
            knocking — invisible to them.
          </div>
        </div>
      </div>
      <div style={{ marginTop: 44, ...useFadeUp(resultsStart + 58) }}>
        <Pill bg="rgba(249,115,22,0.12)" color={C.emberDeep} style={{ fontSize: 20 }}>
          If you only knock, your competitor gets the click.
        </Pill>
      </div>
    </Scene>
  );
};
