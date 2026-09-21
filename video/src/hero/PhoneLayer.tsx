import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { ReactNode } from "react";
import { BEATS } from "./config";
import { MAP_OUT, cameraTransform, phonePose, useCamera } from "./camera";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The phone scene's own camera. Before the reveal the phone (and the crowd
// around it) is drawn on a FIXED phone-pose camera that fades in as the map
// goes out, with a gentle settle (a touch too close → exact pose) — a cross-
// dissolve into a scene that is already composed, not a zoom into a speck.
// From the reveal on, the children follow the main camera, which is at the
// exact phone pose at that frame, so the hand-over is invisible.
export const PhoneLayer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = useCamera();
  const opacity = interpolate(f, [MAP_OUT, MAP_OUT + 24], [0, 1], clamp);
  const settle = interpolate(f, [MAP_OUT, MAP_OUT + 70], [1.06, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  const pose = phonePose(height > width);
  const c = f < BEATS.reveal.from ? { ...pose, zoom: pose.zoom * settle } : cam;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        opacity,
        transformOrigin: "0 0",
        transform: cameraTransform(c, { w: width, h: height }),
      }}
    >
      {children}
    </div>
  );
};
