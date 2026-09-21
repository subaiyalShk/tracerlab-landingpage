import { Composition } from "remotion";
import { ProblemVideo, PROBLEM_DURATION } from "./Problem";
import { HeroLoop } from "./hero/HeroLoop";
import { DURATION as HERO_DURATION, FPS as HERO_FPS } from "./hero/config";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Problem"
        component={ProblemVideo}
        durationInFrames={PROBLEM_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Same component, portrait dimensions — scenes re-lay-out via usePortrait(). */}
      <Composition
        id="ProblemMobile"
        component={ProblemVideo}
        durationInFrames={PROBLEM_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="HeroLoop" component={HeroLoop} durationInFrames={HERO_DURATION} fps={HERO_FPS} width={1920} height={1080} />
      <Composition id="HeroLoopMobile" component={HeroLoop} durationInFrames={HERO_DURATION} fps={HERO_FPS} width={1080} height={1920} />
    </>
  );
};
