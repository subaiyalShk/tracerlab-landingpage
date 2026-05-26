import { AbsoluteFill, Series } from "remotion";
import { C, body } from "./theme";
import { SceneFade } from "./scenes/parts";
import { SceneCommission } from "./scenes/SceneCommission";
import { SceneTreadmill } from "./scenes/SceneTreadmill";
import { SceneCancellations } from "./scenes/SceneCancellations";
import { SceneInvisible } from "./scenes/SceneInvisible";
import { Outro } from "./scenes/Outro";

// Scene durations (frames @ 30fps). Scenes play back-to-back with no overlap; each
// one fades through the cream background (SceneFade), so no two scenes are ever
// visible at once.
export const SCENES = [
  { c: SceneCommission, d: 185 },
  { c: SceneTreadmill, d: 215 },
  { c: SceneCancellations, d: 165 },
  { c: SceneInvisible, d: 170 },
  { c: Outro, d: 95 },
] as const;

export const PROBLEM_DURATION = SCENES.reduce((s, x) => s + x.d, 0);

export const ProblemVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.cream, fontFamily: body, color: C.ink }}>
      {/* Uniform cream fill matches the page background (--color-base: #faf5ec) so the
          full-bleed video blends with no seam. */}
      <Series>
        {SCENES.map(({ c: Comp, d }, i) => (
          <Series.Sequence key={i} durationInFrames={d}>
            <SceneFade dur={d}>
              <Comp />
            </SceneFade>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
