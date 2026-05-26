import { C } from "../theme";
import { useFade, useFadeUp } from "../anim";
import { Scene, SceneTitle, Pill } from "./parts";

const RESULTS = [
  { name: "SunRise Solar Co.", tag: "Gets the call", winner: true },
  { name: "BrightVolt Energy", tag: "Sponsored", winner: false },
  { name: "Peak Power Solar", tag: "4.8 ★", winner: false },
];

export const SceneInvisible: React.FC = () => {
  return (
    <Scene>
      <SceneTitle kicker="Good homeowners never hear from you" title="Ready buyers are searching — for someone else." />
      <div style={{ display: "flex", alignItems: "center", gap: 56, marginTop: 60 }}>
        {/* Search card */}
        <div
          style={{
            width: 720,
            borderRadius: 24,
            border: `1px solid ${C.line}`,
            background: C.surface,
            padding: 30,
            boxShadow: "0 24px 70px -30px rgba(120,72,10,0.25)",
            ...useFadeUp(10),
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
            solar installer near me
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
                  ...useFadeUp(24 + i * 12),
                }}
              >
                <span style={{ fontSize: 24, fontWeight: r.winner ? 700 : 500, color: C.ink }}>{r.name}</span>
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: r.winner ? C.emberDeep : C.faint,
                  }}
                >
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meanwhile, you */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, ...useFadeUp(64) }}>
          <div style={{ fontSize: 64, opacity: 0.5 }}>🚪</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.sand, textAlign: "center", maxWidth: 320 }}>
            You&apos;re three streets over,
            <br />
            knocking — invisible to them.
          </div>
        </div>
      </div>
      <div style={{ marginTop: 44, ...useFadeUp(86) }}>
        <Pill bg="rgba(249,115,22,0.12)" color={C.emberDeep} style={{ fontSize: 20 }}>
          If you only knock, your competitor gets the click.
        </Pill>
      </div>
    </Scene>
  );
};
