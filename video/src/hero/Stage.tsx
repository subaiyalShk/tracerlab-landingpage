import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { ReactNode } from "react";
import { cameraTransform, useCamera } from "./camera";
import { COLORS, DURATION } from "./config";

const FADE_IN = 12; // frames — file opens from black so the first painted frame is dark (the site's LCP protection is the attach timing in HeroFilm, not entropy)
const FADE_OUT = 15; // frames — loop seam dips through black (spec adjustment #1)

// Black background, fade in/out, and the ONE camera transform. Children are
// laid out in world coordinates (== composition size at zoom 1).
export const Stage: React.FC<{ children: ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = useCamera();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = Math.min(
    interpolate(f, [0, FADE_IN], [0, 1], clamp),
    interpolate(f, [DURATION - FADE_OUT, DURATION - 1], [1, 0], clamp),
  );
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          opacity,
          transformOrigin: "0 0",
          transform: cameraTransform(cam, { w: width, h: height }),
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
