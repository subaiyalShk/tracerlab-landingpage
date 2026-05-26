"use client";

import { useEffect, useRef } from "react";

/* Full-bleed, frameless explainer (rendered with Remotion, source in /video).
   Plays only once it scrolls into view — so the section heading is read first —
   and pauses when it leaves. Its cream background matches the page, so it blends
   seamlessly with no border. */
export default function ProblemVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="mt-10 block w-full"
      src="/solar/problem.mp4"
      poster="/solar/problem-poster.png"
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Animated explainer: four ways door-to-door selling costs solar companies — rep commissions inflating the price, the retention treadmill where reps you fund leave to compete, high-pressure deals that cancel, and being invisible to homeowners searching online."
    />
  );
}
