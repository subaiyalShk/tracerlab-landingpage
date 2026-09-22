import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import type { ReactNode } from "react";
import { cameraTransform, tiltAt, useCamera } from "./camera";
import { BEATS, DURATION, useLayout, usePalette } from "./config";

const FADE_IN = 12; // frames — file opens from the page background so the first painted frame is flat (the site's LCP protection is the attach timing in HeroFilm, not entropy)
const FADE_OUT = BEATS.outro.to - BEATS.outro.from; // the outro: fade to the page background on the revenue scene

// Motion blur only where the camera actually travels — the pull-back over
// the cloud and the dive to the funnel. Elsewhere the rig renders once.
export const BLUR_WINDOW = { from: BEATS.reveal.from + 20, to: BEATS.reveal.to + 10 } as const;
export const BLUR = { samples: 8, shutterAngle: 150 } as const;
export const inBlurWindow = (f: number) => f >= BLUR_WINDOW.from && f < BLUR_WINDOW.to;

// The camera rig: children are laid out in world coordinates (== composition
// size at zoom 1). Lives in its own component so CameraMotionBlur can render
// it at sub-frame offsets — the transform must be computed INSIDE the blur.
const CameraRig: React.FC<{ children: ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cam = useCamera();
  const L = useLayout();
  const portrait = height > width;
  // Finale tilt pivots on the dashboard's top edge, in screen space.
  const tilt = tiltAt(f, portrait);
  const pivotY = cam.anchor.y * height + (L.output.y - cam.target.y) * cam.zoom;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        transformOrigin: `50% ${pivotY}px`,
        transform: `perspective(${portrait ? 1400 : 1700}px) rotateX(${tilt}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transformOrigin: "0 0",
          transform: cameraTransform(cam, { w: width, h: height }),
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Page-colored background (black in dark, page grey in light), fade in/out,
// the camera rig, a cinematic vignette, and `overlay` in SCREEN space
// (outside the camera, inside the fade) for stats/captions.
export const Stage: React.FC<{ children: ReactNode; overlay?: ReactNode }> = ({ children, overlay }) => {
  const P = usePalette();
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = Math.min(
    interpolate(f, [0, FADE_IN], [0, 1], clamp),
    interpolate(f, [DURATION - FADE_OUT, DURATION - 4], [1, 0], { easing: Easing.inOut(Easing.quad), ...clamp }), // fully black for the last frames
  );
  const rig = <CameraRig>{children}</CameraRig>;
  return (
    <AbsoluteFill style={{ backgroundColor: P.bg }}>
      <div style={{ position: "absolute", left: 0, top: 0, width, height, opacity }}>
        {inBlurWindow(f) ? (
          <CameraMotionBlur samples={BLUR.samples} shutterAngle={BLUR.shutterAngle}>
            {rig}
          </CameraMotionBlur>
        ) : (
          rig
        )}
        {/* cinematic vignette: darkens the frame's edges toward the page background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse 70% 62% at 50% 50%, transparent 55%, ${P.bg} 130%)`,
            opacity: 0.85,
          }}
        />
        {overlay}
      </div>
    </AbsoluteFill>
  );
};
