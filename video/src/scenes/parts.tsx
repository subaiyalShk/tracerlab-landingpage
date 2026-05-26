import { AbsoluteFill } from "remotion";
import type { ReactNode } from "react";
import { C, display } from "../theme";
import { useFadeUp } from "../anim";

/** Centered scene wrapper. Transparent so the shared background shows through. */
export const Scene: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      padding: "120px 110px 90px",
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Scene kicker + heading near the top. */
export const SceneTitle: React.FC<{ kicker: string; title: string }> = ({
  kicker,
  title,
}) => {
  const k = useFadeUp(2);
  const t = useFadeUp(8);
  return (
    <div style={{ position: "absolute", top: 96, width: "100%", textAlign: "center" }}>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: C.solar,
          ...k,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: display,
          fontWeight: 600,
          fontSize: 58,
          letterSpacing: -1.5,
          color: C.ink,
          ...t,
        }}
      >
        {title}
      </div>
    </div>
  );
};

export const Pill: React.FC<{
  children: ReactNode;
  bg: string;
  color: string;
  style?: React.CSSProperties;
}> = ({ children, bg, color, style }) => (
  <span
    style={{
      display: "inline-flex",
      padding: "8px 16px",
      borderRadius: 999,
      background: bg,
      color,
      fontSize: 18,
      fontWeight: 600,
      ...style,
    }}
  >
    {children}
  </span>
);
