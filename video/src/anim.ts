import { Easing, interpolate, useCurrentFrame } from "remotion";

/** Fade + slide up, starting at `delay` frames (local to the current Sequence). */
export const useFadeUp = (delay: number, dist = 22) => {
  const f = useCurrentFrame();
  return {
    opacity: interpolate(f, [delay, delay + 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    transform: `translateY(${interpolate(f, [delay, delay + 16], [dist, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })}px)`,
  };
};

/** Plain fade in, starting at `delay`. */
export const useFade = (delay: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Count a number from 0 → `to` over `dur` frames starting at `delay` (eased). */
export const useCountUp = (to: number, delay: number, dur = 34) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, to], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};
