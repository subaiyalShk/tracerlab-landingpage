import { useCurrentFrame, useVideoConfig } from "remotion";
import type { ReactNode } from "react";
import { tiltAt } from "./camera";
import { useLayout } from "./config";

// Counter-rotates its children (the dashboard) by the finale tilt, around
// the panel's top edge in world space, so while the funnel plane lies back
// the dashboard stands up and faces the camera — the last piece.
export const Standing: React.FC<{ children: ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const L = useLayout();
  const tilt = tiltAt(f, height > width);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        transformOrigin: `${L.output.x + L.output.w / 2}px ${L.output.y}px`,
        transform: `rotateX(${-tilt * 0.85}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
};
