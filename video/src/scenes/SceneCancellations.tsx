import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { useFade, usePortrait } from "../anim";
import { Scene, SceneTitle, Pill, AccentGlow } from "./parts";

// 4 deals are "signed", then 1 flips to CANCELED (~25%).
const DEALS = [
  { name: "Signed", cancels: false },
  { name: "Signed", cancels: false },
  { name: "Signed", cancels: true },
  { name: "Signed", cancels: false },
];
const FLIP_AT = 64;

export const SceneCancellations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const portrait = usePortrait();

  return (
    <Scene>
      <AccentGlow color="rgba(220,38,38,0.13)" delay={FLIP_AT} />
      <SceneTitle kicker="Pressure today, cancellations tomorrow" title="A deal pushed at the door doesn't stick." />
      <div
        style={{
          display: "flex",
          flexWrap: portrait ? "wrap" : "nowrap",
          justifyContent: "center",
          gap: 28,
          marginTop: portrait ? 40 : 50,
          width: portrait ? 528 : "auto",
        }}
      >
        {DEALS.map((d, i) => {
          const appear = spring({ frame, fps, delay: 16 + i * 7, config: { damping: 200 } });
          const flip = d.cancels
            ? spring({ frame, fps, delay: FLIP_AT, config: { damping: 14 } })
            : 0;
          const canceled = flip > 0.02;
          return (
            <div
              key={i}
              style={{
                width: 250,
                height: 300,
                borderRadius: 22,
                border: `2px solid ${canceled ? C.red : C.line}`,
                background: canceled ? "rgba(220,38,38,0.06)" : C.surface,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                opacity: appear,
                transform: `scale(${interpolate(appear, [0, 1], [0.85, 1])})`,
                boxShadow: canceled ? "0 20px 55px -18px rgba(220,38,38,0.5)" : "none",
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#fff",
                  background: canceled ? C.red : C.emerald,
                  // CANCELED stamps in: slams from oversized + tilted, then settles.
                  transform: canceled
                    ? `scale(${interpolate(flip, [0, 1], [1.8, 1], { extrapolateRight: "clamp" })}) rotate(${interpolate(flip, [0, 1], [-16, 0], { extrapolateRight: "clamp" })}deg)`
                    : "none",
                }}
              >
                {canceled ? "✕" : "✓"}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: canceled ? C.red : C.ink }}>
                {canceled ? "CANCELED" : "Signed"}
              </div>
              <div style={{ fontSize: 16, color: C.faint }}>Solar deal #{i + 1}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 46, opacity: useFade(FLIP_AT + 16) }}>
        <Pill bg="rgba(220,38,38,0.1)" color={C.red} style={{ fontSize: 20 }}>
          ~1 in 4 cancels before it&apos;s ever installed — you paid to close it anyway.
        </Pill>
      </div>
    </Scene>
  );
};
