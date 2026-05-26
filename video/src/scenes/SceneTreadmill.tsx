import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, emberGrad } from "../theme";
import { useCountUp, useFade, useFadeUp } from "../anim";
import { Scene, SceneTitle, Pill, AccentGlow } from "./parts";

const COSTS = [
  { label: "Housing / AirBnb", w: 100 },
  { label: "Incentives & bonuses", w: 80 },
  { label: "Recruiting & re-training", w: 64 },
  { label: "Trips & retreats", w: 48 },
];

const CHAIN = [
  "You hire, house & hype them up",
  "They learn your offers & playbook",
  "The moment they've got it — they quit",
];

export const SceneTreadmill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const burn = Math.round(useCountUp(30, 60, 30));
  const compPulse = frame > 88 ? 1 + 0.08 * Math.sin((frame - 88) / 5) : 1;

  return (
    <Scene>
      <AccentGlow color="rgba(249,115,22,0.20)" delay={10} />
      <SceneTitle kicker="The retention treadmill" title="You fund them, train them — then they compete." />
      <div style={{ display: "flex", gap: 70, marginTop: 60, width: 1500 }}>
        {/* Cash burn */}
        <div style={{ flex: 1, border: `1px solid ${C.line}`, borderRadius: 20, background: "rgba(255,255,255,0.6)", padding: 34 }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.sand }}>What it costs to keep reps</div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 20 }}>
            {COSTS.map((c, i) => {
              const grow = spring({ frame, fps, delay: 16 + i * 8, config: { damping: 200 } });
              return (
                <div key={c.label}>
                  <div style={{ fontSize: 20, color: C.ink }}>{c.label}</div>
                  <div style={{ marginTop: 8, height: 16, borderRadius: 999, background: C.inset, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${grow * c.w}%`, borderRadius: 999, background: emberGrad }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 14, opacity: useFade(60) }}>
            <span style={{ fontFamily: "inherit", fontSize: 40, fontWeight: 800, color: C.ember }}>{`~$${burn}k+/mo`}</span>
            <span style={{ fontSize: 20, color: C.sand }}>burned to keep a team that&apos;s always one offer from walking.</span>
          </div>
        </div>

        {/* Chain → competitor */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: C.sand, marginBottom: 22 }}>…then they walk</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {CHAIN.map((step, i) => {
              const s = useFadeUp(24 + i * 14);
              return (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 16, ...s }}>
                  <span style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${C.line}`, background: C.surface, color: C.faint, fontWeight: 700, display: "grid", placeItems: "center", fontSize: 18 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 24, color: C.ink }}>{step}</span>
                </div>
              );
            })}
            {/* competitor — highlighted */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, ...useFadeUp(70) }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: emberGrad,
                  color: "#2a1402",
                  fontWeight: 800,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                  transform: `scale(${compPulse})`,
                  boxShadow: `0 0 ${10 + (compPulse - 1) * 260}px rgba(249,115,22,0.55)`,
                }}
              >
                4
              </span>
              <span style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>They open a competing solar company.</span>
            </div>
          </div>
          <div style={{ marginTop: 30, ...useFadeUp(92) }}>
            <Pill bg="rgba(249,115,22,0.12)" color={C.emberDeep} style={{ fontSize: 20 }}>
              You funded — and trained — your own competition.
            </Pill>
          </div>
        </div>
      </div>
    </Scene>
  );
};
