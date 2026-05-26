import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import type { ReactNode } from "react";
import { C, display } from "../theme";
import { useFadeUp } from "../anim";

/** Fades a whole scene in at its start and out at its end (to the cream background),
    with a subtle vertical drift. Used between back-to-back scenes so two scenes are
    never on screen at once — a clean fade-through-background instead of a cross-fade. */
export const SceneFade: React.FC<{ dur: number; children: ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const F = 13;
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = Math.min(
    interpolate(f, [0, F], [0, 1], clamp),
    interpolate(f, [dur - F, dur], [1, 0], clamp),
  );
  const enter = interpolate(f, [0, F], [16, 0], { easing: Easing.out(Easing.cubic), ...clamp });
  const exit = interpolate(f, [dur - F, dur], [0, -16], { easing: Easing.in(Easing.cubic), ...clamp });
  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${enter + exit}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

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

/** Soft localized glow behind a scene's focal element. Kept well inside the frame
    so it never reaches the edges — the video still blends flat-cream into the page. */
export const AccentGlow: React.FC<{
  color: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ color, delay = 0, style }) => {
  const o = useFadeUp(delay).opacity;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        top: "54%",
        transform: "translate(-50%, -50%)",
        width: 820,
        height: 720,
        borderRadius: "50%",
        filter: "blur(130px)",
        opacity: o * 0.5,
        background: `radial-gradient(circle, ${color}, transparent 68%)`,
        pointerEvents: "none",
        ...style,
      }}
    />
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
