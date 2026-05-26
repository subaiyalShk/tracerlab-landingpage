import { AbsoluteFill } from "remotion";
import { C, display, textGrad } from "../theme";
import { useFadeUp } from "../anim";

export const Outro: React.FC = () => {
  const line = useFadeUp(6);
  const sub = useFadeUp(16);
  const mark = useFadeUp(28);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <div
        style={{
          fontFamily: display,
          fontWeight: 700,
          fontSize: 84,
          letterSpacing: -2,
          background: textGrad,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          ...line,
        }}
      >
        There&apos;s a better way.
      </div>
      <div style={{ marginTop: 22, fontSize: 30, color: C.sand, ...sub }}>
        Consistent appointments — without a door-to-door team.
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: -0.5,
          color: C.ink,
          ...mark,
        }}
      >
        tracer<span style={{ color: C.solar }}>labs</span>
      </div>
    </AbsoluteFill>
  );
};
