"use client";

import { useEffect, useRef, useState } from "react";

/* Full-bleed, frameless explainer (rendered with Remotion, source in /video).
   Serves a portrait 9:16 cut on phones and the 16:9 cut on larger screens. Plays
   only once it scrolls into view (so the section heading is read first) and pauses
   when it leaves. Its cream background matches the page, so it blends with no border. */
export default function ProblemVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [mobile, setMobile] = useState(false);

  // Pick the cut by viewport.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Play in view / pause out. Re-runs when the source swaps so the new element is observed.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [mobile]);

  const src = mobile ? "/solar/problem-mobile.mp4" : "/solar/problem.mp4";
  const poster = mobile
    ? "/solar/problem-mobile-poster.png"
    : "/solar/problem-poster.png";

  return (
    <video
      key={src}
      ref={ref}
      className="mt-10 block w-full"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Animated explainer: four ways door-to-door selling costs solar companies — rep commissions inflating the price, the retention treadmill where reps you fund leave to compete, high-pressure deals that cancel, and being invisible to homeowners searching online."
    />
  );
}
