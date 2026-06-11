"use client";

import { Children, useRef, useState, type ReactNode } from "react";

// Horizontal scroll-snap carousel for the autopilot stages. Native swipe / trackpad scroll +
// scroll-snap, prev/next arrows, a live "NN / total · stage" counter, and a gradient progress
// scrubber. Each child becomes a snap slide. Accessible: real scroll container + buttons.
export default function AutopilotCarousel({ children, labels }: { children: ReactNode; labels: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const slides = Children.toArray(children);

  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, el.scrollLeft / max) : 0);
    const slideW = el.scrollWidth / slides.length;
    setActive(Math.max(0, Math.min(slides.length - 1, Math.round(el.scrollLeft / slideW))));
  }

  function nudge(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-3 sm:-mx-10 sm:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div key={i} className="w-[86%] shrink-0 snap-center sm:w-[72%] lg:w-[60%]">
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center gap-4">
        <div className="flex min-w-0 shrink-0 items-baseline gap-2 sm:max-w-[48%]">
          <span className="font-display text-[0.95rem] tabular-nums text-ink/75">
            {String(active + 1).padStart(2, "0")}
            <span className="text-ink/30"> / {String(slides.length).padStart(2, "0")}</span>
          </span>
          <span className="hidden truncate text-[0.85rem] text-ink/45 sm:inline">· {labels[active]}</span>
        </div>

        <div className="relative h-px flex-1 bg-ink/12">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-pink to-brand-blue transition-[width] duration-150 ease-out"
            style={{ width: `${Math.max(4, progress * 100)}%` }}
          />
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Previous stage"
            className="bv-6 flex h-9 w-9 items-center justify-center bg-ink/[0.06] text-ink/70 transition-colors hover:bg-ink/[0.12] hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Next stage"
            className="bv-6 flex h-9 w-9 items-center justify-center bg-ink/[0.06] text-ink/70 transition-colors hover:bg-ink/[0.12] hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
