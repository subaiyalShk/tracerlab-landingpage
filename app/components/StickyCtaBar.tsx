"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Button from "./Button";

// Persistent conversion bar: slides in once the hero scrolls away, and gets out of the
// way again when the reader reaches the real CTA section (or dismisses it).
// Per-page wiring via props: which sections gate visibility, and what the bar says/links to.
export default function StickyCtaBar({
  heroId,
  ctaId,
  message,
  buttonLabel = "Book a Demo",
  buttonHref,
}: {
  heroId: string;
  ctaId: string;
  message: string;
  buttonLabel?: string;
  buttonHref: string;
}) {
  const reduced = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [nearCta, setNearCta] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const cta = document.getElementById(ctaId);
    if (!hero || !cta) return;
    const heroObs = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { threshold: 0.05 });
    const ctaObs = new IntersectionObserver(([e]) => setNearCta(e.isIntersecting), { threshold: 0.1 });
    heroObs.observe(hero);
    ctaObs.observe(cta);
    return () => {
      heroObs.disconnect();
      ctaObs.disconnect();
    };
  }, [heroId, ctaId]);

  const show = pastHero && !nearCta && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 56 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 56 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6"
        >
          <div className="pointer-events-auto border border-ink/15 bg-page/95 shadow-[var(--nt-underglow)] backdrop-blur-sm">
            <div className="flex items-center gap-3 py-2.5 pl-4 pr-2.5 sm:gap-5 sm:pl-5">
              <span
                className="hidden text-[0.9rem] font-semibold text-ink/75 sm:block"
                style={{ fontFamily: "var(--font-archivo), system-ui, sans-serif" }}
              >
                {message}
              </span>
              <Button href={buttonHref} variant="primary" size="sm">{buttonLabel}</Button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss"
                className="flex h-8 w-8 items-center justify-center text-ink/40 transition-colors hover:bg-ink/[0.08] hover:text-ink"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
