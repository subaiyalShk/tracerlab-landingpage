"use client";

import { useEffect, useRef, useState } from "react";

// Lazy, in-view project demo video. preload="none" + a poster means nothing
// downloads until the card scrolls near the viewport. Playback is gated on the
// CENTER band of the viewport: an IntersectionObserver with a -38% top/bottom
// rootMargin plays the video while it sits in the middle ~quarter of the
// screen and pauses it the moment it drifts out — so exactly one card tends to
// be alive at a time as you scroll.
// Sound: browsers block unmuted autoplay, so every video starts muted; clips
// that carry an audio track (`hasAudio`) render a speaker toggle. The tap is a
// real user gesture, so unmuting sticks — from then on the scroll-driven
// play/pause keeps the sound. Honors prefers-reduced-motion: no autoplay, the
// poster just shows.
// `fit="contain"` shows the whole frame over the dark stage; `fit="cover"` fills.
export default function ProjectVideo({
  src,
  poster,
  label,
  fit = "cover",
  hasAudio = false,
}: {
  src: string;
  poster: string;
  label: string;
  fit?: "cover" | "contain";
  hasAudio?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // React is unreliable about syncing the `muted` prop to the DOM after mount
  // (long-standing react#10389), so the toggle drives the element directly.
  const toggleMuted = () => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next && v.paused) v.play().catch(() => {});
    setMuted(next);
  };

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
      // Shrink the observation window to the middle band of the viewport:
      // the video plays only while it overlaps the central ~24%.
      { threshold: 0, rootMargin: "-38% 0px -38% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
      {hasAudio && (
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={muted ? "Unmute video" : "Mute video"}
          aria-pressed={!muted}
          className="bv-6 absolute bottom-2.5 right-2.5 z-30 flex h-8 w-8 items-center justify-center bg-black/55 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white"
        >
          {muted ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="m16 9 6 6M22 9l-6 6" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
