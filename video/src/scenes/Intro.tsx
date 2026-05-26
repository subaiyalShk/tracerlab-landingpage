import { AbsoluteFill } from "remotion";
import { C, display } from "../theme";
import { useFadeUp } from "../anim";

export const Intro: React.FC = () => {
  const kicker = useFadeUp(4);
  const title = useFadeUp(12);
  const sub = useFadeUp(22);
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 120px" }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 7,
          textTransform: "uppercase",
          color: C.solar,
          ...kicker,
        }}
      >
        The old way is breaking
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 86,
          letterSpacing: -2.5,
          lineHeight: 1.04,
          maxWidth: 1300,
          color: C.ink,
          ...title,
        }}
      >
        Door-to-door is quietly costing you.
      </div>
      <div style={{ marginTop: 26, fontSize: 30, color: C.sand, maxWidth: 900, ...sub }}>
        Four ways canvassing eats your margin and your growth.
      </div>
    </AbsoluteFill>
  );
};
