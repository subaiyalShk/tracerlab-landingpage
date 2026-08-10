import type { ReactNode } from "react";

// Entrance wrapper for deck blocks — CSS only, deliberately.
//
// The obvious implementation is motion's `whileInView`, and that is what this deck used
// first. It does not survive this snap-scroll deck: when a slide is reached by an
// instantaneous programmatic jump (a CTA or the dot rail) the viewport observers never
// fire and the slide stays permanently blank. A replacement built on our own
// IntersectionObserver plus an unconditional timeout failsafe did not run either, which
// pins the problem on hydration of these nested client blocks rather than on motion's
// viewport logic specifically.
//
// A missed animation is a cosmetic loss; a blank slide in front of a client is not. So the
// entrance is the site's `animate-rise` keyframe, staggered with animationDelay. It runs on
// paint, needs no JS, and cannot leave content invisible. `prefers-reduced-motion` is
// honoured globally by the same stylesheet that defines the keyframe.
export default function SlideReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  /** kept for source compatibility with the previous motion-based API */
  y?: number;
  amount?: number;
  className?: string;
}) {
  return (
    <div className={`animate-rise ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
