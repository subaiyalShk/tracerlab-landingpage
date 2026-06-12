"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { gradientSlice } from "./Kinetic";

// Shared scroll-cinematic primitives. Everything here animates transform/opacity/filter
// only (compositor-friendly) and collapses to a static render under prefers-reduced-motion.
//
// ⚠️ These are CLIENT components — use them BELOW the fold only, where hydration races
// scroll instead of gating first paint. Above-the-fold/LCP content must use the server
// equivalents in ./Kinetic.tsx (CSS-only animation, no hydration dependency).

export const BRAND_GRADIENT = "linear-gradient(100deg,#e7028d,#056afc)";

/* ── Kinetic headline ─────────────────────────────────────────────────────────
   Splits copy into words and cascades them in with a rise + blur + slight skew —
   the "product film" title treatment. Segments let one focal word carry the brand
   gradient without breaking the word-level stagger. */
export type Segment = { text: string; gradient?: boolean; block?: boolean };

const word: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(10px)" },
  show: (i: number) => ({
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { delay: 0.08 + i * 0.07, type: "spring", stiffness: 180, damping: 24 },
  }),
};

export function Kinetic({
  segments,
  as: Tag = "h2",
  className = "",
  ...rest
}: {
  segments: Segment[];
  as?: "h1" | "h2" | "p";
  className?: string;
} & Record<string, unknown>) {
  const reduced = useReducedMotion();
  // The in-view trigger lives on the HEADLINE, not the words: a hidden word is translated
  // outside its overflow-hidden clip, so an observer on the word itself reports 0%
  // visibility and would never fire. Variants propagate from the root to the word spans.
  const MTag = reduced ? Tag : motion[Tag];
  const inView = reduced
    ? {}
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.3 } };
  let i = 0;
  return (
    <MTag className={className} {...inView} {...rest}>
      {segments.map((seg, si) => {
        // keep trailing punctuation glued to its word so "autopilot?" never orphan-wraps
        const words = seg.text.split(/\s+/).filter(Boolean);
        const rendered = words.map((w, wi) => {
          const idx = i++;
          const gradientStyle = seg.gradient ? gradientSlice(wi, words.length) : undefined;
          // the separating space lives BETWEEN the inline-block wrappers — a trailing
          // space inside an inline-block is trimmed by CSS line-box rules (words would jam)
          if (reduced) {
            return (
              <Fragment key={`${si}-${wi}`}>
                <span className="inline-block" style={gradientStyle}>
                  {w}
                </span>{" "}
              </Fragment>
            );
          }
          return (
            <Fragment key={`${si}-${wi}`}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  custom={idx}
                  variants={word}
                  className="inline-block will-change-transform"
                  style={gradientStyle}
                >
                  {w}
                </motion.span>
              </span>{" "}
            </Fragment>
          );
        });
        // block segments render as their own line (multi-line headline lockups)
        return seg.block ? (
          <span key={si} className="block">
            {rendered}
          </span>
        ) : (
          rendered
        );
      })}
    </MTag>
  );
}

/* ── Reveal ───────────────────────────────────────────────────────────────────
   whileInView rise + de-blur for blocks. `delay` staggers siblings. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  // opacity + transform only — a blur() entrance here would repaint every staggering card
  // per frame (the workforce grid reveals 14 at once on mobile).
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ delay, type: "spring", stiffness: 150, damping: 24 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── CountUp ──────────────────────────────────────────────────────────────────
   Progressive odometer for proof stats. The server HTML carries the FINAL value (so the
   number is correct before hydration, without JS, and for crawlers); after hydration the
   first time it scrolls into view it snaps to 0 and counts up with an rAF tween. No motion
   dependency — keeps this leaf tiny for landing pages. Fixed decimals so layout never
   shifts mid-count. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1.4,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (v: number) =>
    `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  const [display, setDisplay] = useState(() => fmt(value));

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const format = (v: number) =>
      `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          // clamp from below too — the first rAF timestamp can predate t0 (frame batching),
          // which would otherwise drive the eased value negative
          const p = Math.min(1, Math.max(0, (t - t0) / (duration * 1000)));
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(format(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
