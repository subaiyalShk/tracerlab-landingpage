"use client";

import { useEffect, useRef } from "react";

// Lazy, in-view-only project demo video. preload="none" + a poster means nothing
// downloads until the card scrolls near the viewport; it autoplays muted when in
// view and pauses when it leaves (IntersectionObserver — same pattern as the solar
// ProblemVideo). Honors prefers-reduced-motion: no autoplay, the poster just shows.
// `fit="contain"` is used for portrait (9:16) social-ad reels so the whole frame is
// visible over the card's brand backdrop; `fit="cover"` fills landscape clips.
export default function ProjectVideo({
  src,
  poster,
  label,
  fit = "cover",
}: {
  src: string;
  poster: string;
  label: string;
  fit?: "cover" | "contain";
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // leave the poster frame; never autoplay

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
