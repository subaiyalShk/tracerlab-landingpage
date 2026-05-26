import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, emberGrad, goldGrad } from "../theme";
import { useFade } from "../anim";
import { Scene, SceneTitle, Pill, AccentGlow } from "./parts";

const BASE_H = 210;
const COMM_H = 185;
const AD_H = 44;
const AREA_H = BASE_H + COMM_H;
const BAR_W = 290;

export const SceneCommission: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const base = spring({ frame, fps, delay: 14, config: { damping: 200 } });
  const comm = spring({ frame, fps, delay: 38, config: { damping: 200 } });
  const ad = spring({ frame, fps, delay: 42, config: { damping: 200 } });
  const lbl = (p: number) =>
    interpolate(p, [0.45, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Scene>
      <AccentGlow color="rgba(249,115,22,0.22)" delay={8} />
      <SceneTitle kicker="The commission tax" title="Same panels. Different sales model." />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 120, marginTop: 40 }}>
        <Deal
          label="Door-to-door deal"
          segs={[
            { label: "Rep commission", h: comm * COMM_H, o: lbl(comm), bg: emberGrad, color: "#2a1402" },
            { label: "Panels + install", h: base * BASE_H, o: lbl(base), bg: C.inset, color: C.sand },
          ]}
          price={{ text: "▲ Higher price", color: C.ember, delay: 70 }}
          tag={{ text: "Pushed → ~25% cancel", bg: "rgba(249,115,22,0.12)", color: C.emberDeep, delay: 82 }}
        />
        <div
          style={{
            alignSelf: "center",
            fontFamily: "inherit",
            fontWeight: 700,
            fontSize: 22,
            color: C.sand,
            border: `1px solid ${C.line}`,
            background: C.surface,
            borderRadius: 999,
            padding: "10px 16px",
            opacity: useFade(30),
          }}
        >
          vs
        </div>
        <Deal
          label="Your funnel deal"
          segs={[
            { label: "Ad cost", h: ad * AD_H, o: lbl(ad), bg: goldGrad, color: "#2a1402" },
            { label: "Panels + install", h: base * BASE_H, o: lbl(base), bg: C.inset, color: C.sand },
          ]}
          price={{ text: "▼ Lower price · better offer", color: C.emerald, delay: 70 }}
          tag={{ text: "No pressure → deals stick", bg: "rgba(5,150,105,0.12)", color: C.emerald, delay: 82 }}
        />
      </div>
    </Scene>
  );
};

type Seg = { label: string; h: number; o: number; bg: string; color: string };

const Deal: React.FC<{
  label: string;
  segs: Seg[];
  price: { text: string; color: string; delay: number };
  tag: { text: string; bg: string; color: string; delay: number };
}> = ({ label, segs, price, tag }) => {
  const priceO = useFade(price.delay);
  const tagO = useFade(tag.delay);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: C.sand, marginBottom: 16 }}>{label}</div>
      <div style={{ height: AREA_H, width: BAR_W, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${C.line}` }}>
          {segs.map((s) => (
            <div
              key={s.label}
              style={{
                height: s.h,
                background: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
                fontSize: 20,
                fontWeight: 600,
                opacity: s.o,
              }}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: 23, fontWeight: 700, color: price.color, opacity: priceO }}>
        {price.text}
      </div>
      <Pill bg={tag.bg} color={tag.color} style={{ marginTop: 12, opacity: tagO }}>
        {tag.text}
      </Pill>
    </div>
  );
};
