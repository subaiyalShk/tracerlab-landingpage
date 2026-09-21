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
// `steady` children get the exact pose WITHOUT the settle (an integer 8× scale
// that never changes frame to frame) — for the text chips, which shimmer when
// re-rasterized at a drifting fractional scale.
export const PhoneLayer: React.FC<{ children: ReactNode; steady?: ReactNode }> = ({ children, steady }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = useCamera();
  const opacity = interpolate(f, [MAP_OUT, MAP_OUT + 24], [0, 1], clamp);
  const settle = interpolate(f, [MAP_OUT, MAP_OUT + 70], [1.06, 1], { easing: Easing.out(Easing.cubic), ...clamp });
  const pose = phonePose(height > width);
  const before = f < BEATS.reveal.from;
  const c = before ? { ...pose, zoom: pose.zoom * settle } : cam;
  const cSteady = before ? pose : cam;
  const layer = (t: typeof c): React.CSSProperties => ({
    position: "absolute",
    left: 0,
    top: 0,
    width,
    height,
    opacity,
    transformOrigin: "0 0",
    transform: cameraTransform(t, { w: width, h: height }),
  });
  return (
    <>
      <div style={layer(c)}>{children}</div>
      {steady && <div style={layer(cSteady)}>{steady}</div>}
    </>
  );
};
