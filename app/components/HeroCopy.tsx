"use client";

import { useEffect, useState, type ReactNode } from "react";

// Event HeroFilm dispatches on window when the intro ends (loop completed, first
// input, load failure or timeout) — after it has cleared <html data-intro>.
export const HERO_INTRO_DONE = "tl:hero-intro-done";

// The hero copy. While <html data-intro="on"> (set pre-paint by the bootstrap
// script in app/layout.tsx) the CSS holds it at opacity 0 under the film.
// When the intro ends we RE-MOUNT the children, so the staggered rise-in
// animations replay as the copy fades in — the lines land, they don't just
// appear. No-JS / reduced-motion / Save-Data visitors never get
// the attribute and see the copy from the first paint.
export default function HeroCopy({ className, children }: { className: string; children: ReactNode }) {
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    const onDone = () => setGeneration((g) => g + 1);
    window.addEventListener(HERO_INTRO_DONE, onDone);
    return () => window.removeEventListener(HERO_INTRO_DONE, onDone);
  }, []);
  return (
    <div key={generation} className={`nt-copy ${className}`}>
      {children}
    </div>
  );
}
