// SERVER-rendered hero motion. These are for LCP-critical, above-the-fold content: the
// markup ships visible-by-default and animates with pure CSS (animate-kinetic-word /
// animate-cue-fall keyframes in globals.css), so the headline paints on first render and
// never waits for the JS bundle to hydrate. Below-the-fold sections use the client
// `Kinetic` from ./motion instead, which triggers on scroll (needs JS — fine down there).
//
// Reduced motion: the global `[class*="animate-"] { animation: none }` rule strips the
// cascade and the words simply render in place (the hidden state lives only inside the
// keyframes' `from`).
import { Fragment } from "react";
import type { Segment } from "./motion";

// Continuous gradient across a multi-word segment: each word paints only its SLICE of a
// phrase-wide gradient (background sized to word count, positioned by word index), so the
// sweep runs pink→blue across the whole phrase instead of restarting per word — and stays
// continuous across line wraps (slice boundaries match in hue by construction).
export function gradientSlice(wi: number, count: number) {
  return {
    backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)",
    backgroundSize: `${count * 100}% 100%`,
    backgroundPosition: count > 1 ? `${(wi / (count - 1)) * 100}% 0` : "0 0",
    WebkitBackgroundClip: "text" as const,
    backgroundClip: "text" as const,
    color: "transparent",
  };
}

export function KineticHeading({
  segments,
  as: Tag = "h2",
  className = "",
  baseDelay = 0.08,
  stagger = 0.07,
}: {
  segments: Segment[];
  as?: "h1" | "h2" | "p";
  className?: string;
  baseDelay?: number;
  stagger?: number;
}) {
  let i = 0;
  return (
    <Tag className={className}>
      {segments.map((seg, si) => {
        const words = seg.text.split(/\s+/).filter(Boolean);
        const rendered = words.map((w, wi) => {
          const idx = i++;
          const gradientStyle = seg.gradient ? gradientSlice(wi, words.length) : undefined;
          // the separating space lives BETWEEN the inline-block wrappers — a trailing
          // space inside an inline-block is trimmed by CSS line-box rules (words would jam)
          return (
            <Fragment key={`${si}-${wi}`}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span
                  className="animate-kinetic-word inline-block will-change-transform"
                  style={{ animationDelay: `${(baseDelay + idx * stagger).toFixed(2)}s`, ...gradientStyle }}
                >
                  {w}
                </span>
              </span>{" "}
            </Fragment>
          );
        });
        return seg.block ? (
          <span key={si} className="block">
            {rendered}
          </span>
        ) : (
          rendered
        );
      })}
    </Tag>
  );
}

/* Bottom-of-hero scroll invitation — CSS bead, no JS. */
export function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`} aria-hidden>
      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-ink/35">Scroll</span>
      <span className="relative h-12 w-px overflow-hidden bg-ink/15">
        <span
          className="animate-cue-fall absolute left-0 top-0 h-4 w-px"
          style={{ background: "linear-gradient(100deg,#e7028d,#056afc)" }}
        />
      </span>
    </div>
  );
}
