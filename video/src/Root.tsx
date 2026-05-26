import { Composition } from "remotion";
import { ProblemVideo, PROBLEM_DURATION } from "./Problem";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Problem"
      component={ProblemVideo}
      durationInFrames={PROBLEM_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
