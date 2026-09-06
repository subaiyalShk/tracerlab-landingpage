"use client";

import { useEffect, useRef, useState } from "react";

// Click-to-play project demo video. No autoplay: the poster shows with a
// center play button, and the click — a real user gesture — starts playback
// WITH sound (which browsers allow only on gesture, so this sidesteps the
// muted-autoplay dance entirely). Nothing downloads or decodes until someone
// asks (preload="none"), which beats scroll-autoplay for bandwidth/battery.
// One small courtesy observer pauses a running video if it scrolls fully out
// of the viewport, so audio never talks from off-screen.
// `fit="contain"` shows the whole frame over the dark stage; `fit="cover"` fills.
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
  const [playing, setPlaying] = useState(false);

  // Keep the icon honest whatever pauses/plays the element.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  // Courtesy pause when a running video leaves the viewport entirely.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false; // the click is the gesture — sound is allowed
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        src={src}
        poster={poster}
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
      {playing ? (
        // Playing: quiet pause chip in the corner, out of the frame's way.
        <button
          type="button"
          onClick={toggle}
          aria-label="Pause video"
          className="bv-6 absolute bottom-2.5 right-2.5 z-30 flex h-9 w-9 items-center justify-center bg-black/55 text-white/85 backdrop-blur-sm transition-colors hover:bg-black/75 hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
          </svg>
        </button>
      ) : (
        // Idle: center play button over the poster — plays with sound.
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play: ${label}`}
          className="group/play absolute inset-0 z-30 flex items-center justify-center"
        >
          <span className="bv-9 flex h-14 w-14 items-center justify-center bg-black/55 text-white/90 backdrop-blur-sm transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-black/75 group-hover/play:text-white">
            <svg className="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </>
  );
}
