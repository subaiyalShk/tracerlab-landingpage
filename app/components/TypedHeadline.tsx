"use client";

import { useEffect, useState } from "react";

const SPEED = 35; // ms per character
const START_DELAY = 150; // lets the h1's rise-in land before typing starts

// Typewriter reveal for the hero headline. The real sentence renders as a
// transparent sizing ghost, so the block holds its final wrapped height from
// the first frame (no layout shift) and stays readable to crawlers and screen
// readers; the animated copy on top is aria-hidden. The terminal cursor is
// solid while typing and hands off to its usual blink when done. Reduced
// motion skips straight to the full headline.
export default function TypedHeadline({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    // Time-based via rAF (not interval ticks): progress derives from elapsed
    // time, so browser timer throttling in unfocused tabs can't slow it down.
    let raf = 0;
    const t0 = performance.now() + START_DELAY;
    const tick = (now: number) => {
      const n = Math.max(0, Math.floor((now - t0) / SPEED));
      setCount(Math.min(n, text.length));
      if (n < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <span className="relative block">
      <span style={{ color: "transparent" }}>{text}</span>
      <span aria-hidden className="absolute inset-0" style={{ userSelect: "none" }}>
        <span className="nt-sheen">{text.slice(0, count)}</span>
        <span className="nt-cursor" style={done ? undefined : { animation: "none" }} />
      </span>
    </span>
  );
}
