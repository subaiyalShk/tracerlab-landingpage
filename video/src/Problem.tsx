import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { C, body, display } from "./theme";
import { Intro } from "./scenes/Intro";
import { SceneCommission } from "./scenes/SceneCommission";
import { SceneTreadmill } from "./scenes/SceneTreadmill";
import { SceneCancellations } from "./scenes/SceneCancellations";
import { SceneInvisible } from "./scenes/SceneInvisible";
import { Outro } from "./scenes/Outro";

const XFADE = 18;

// Scene durations (frames @ 30fps). Composition total = sum - (transitions * XFADE).
export const SCENES = [
  { c: Intro, d: 80 },
  { c: SceneCommission, d: 185 },
  { c: SceneTreadmill, d: 215 },
  { c: SceneCancellations, d: 165 },
  { c: SceneInvisible, d: 170 },
  { c: Outro, d: 95 },
] as const;

export const PROBLEM_DURATION =
  SCENES.reduce((s, x) => s + x.d, 0) - (SCENES.length - 1) * XFADE;

export const ProblemVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream, fontFamily: body, color: C.ink }}>
      {/* Sunrise glow (static) */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "50%",
          width: "120%",
          height: "70%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          filter: "blur(90px)",
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(245,179,1,0.20), rgba(249,115,22,0.09) 45%, transparent 72%)",
        }}
      />

      <TransitionSeries>
        {SCENES.flatMap(({ c: Comp, d }, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={d}>
              <Comp />
            </TransitionSeries.Sequence>
          );
          if (i === 0) return [seq];
          return [
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={fade()}
              timing={linearTiming({ durationInFrames: XFADE })}
            />,
            seq,
          ];
        })}
      </TransitionSeries>

      {/* Persistent wordmark */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 64,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: -0.5,
        }}
      >
        tracer<span style={{ color: C.solar }}>labs</span>
      </div>
    </AbsoluteFill>
  );
};
