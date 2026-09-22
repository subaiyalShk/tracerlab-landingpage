import { Stage } from "./Stage";
import { World } from "./World";
import { Phones } from "./Phones";
import { Phone } from "./Phone";
import { Reveal } from "./Reveal";
import { Machine } from "./Machine";
import { Output } from "./Output";
import { Standing } from "./Standing";
import { Stats } from "./Stats";
import { PhoneLayer } from "./PhoneLayer";
import { PlatformChips } from "./PlatformChips";
import { Audio, interpolate, staticFile } from "remotion";
import { BEATS, DURATION, ThemeContext, type Theme } from "./config";

// One unbroken camera move over a world of vector scenes (spec §1). Order =
// paint order; every scene positions itself in world coordinates. `theme`
// comes from the composition's defaultProps (Root.tsx) and reaches the scenes
// through ThemeContext → usePalette(); the scenes themselves are theme-blind.
// The score (public/hero-score.m4a, generated with Sonilo Music: a dark,
// minimal ambient-electronic bed that builds to a warm resolve). Fades in
// over the first second and out through the outro so it ends with the picture.
const SCORE_FADE_IN = 30;
const scoreVolume = (f: number) =>
  Math.min(
    interpolate(f, [0, SCORE_FADE_IN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [BEATS.outro.from, DURATION - 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  ) * 0.9;

export const HeroLoop: React.FC<{ theme: Theme }> = ({ theme }) => (
  <ThemeContext.Provider value={theme}>
    <Audio src={staticFile("hero-score.m4a")} volume={scoreVolume} />
    <Stage
      overlay={
        <>
          <PhoneLayer steady={<PlatformChips />}>
            <Phones />
            <Phone />
          </PhoneLayer>
          <Stats />
        </>
      }
    >
      <World />
      <Reveal />
      <Machine />
      <Standing>
        <Output />
      </Standing>
    </Stage>
  </ThemeContext.Provider>
);
