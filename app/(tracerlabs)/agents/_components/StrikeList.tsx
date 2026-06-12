"use client";

import { motion, useReducedMotion } from "motion/react";

// The "delete list": each legacy cost gets struck through by a red line that draws
// itself across when the row scrolls into view — the system crossing items off.
// Client leaf (scroll-triggered); the parent section is a server component.
export default function StrikeList({ items }: { items: string[] }) {
  const reduced = useReducedMotion();
  return (
    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
      {items.map((r, i) => (
        <li key={r} className="flex items-center gap-2 text-[0.95rem] text-ink/45">
          {reduced ? (
            <>
              <span aria-hidden className="text-brand-red">✕</span>
              <span className="line-through decoration-brand-red/60">{r}</span>
            </>
          ) : (
            <>
              <motion.span
                aria-hidden
                className="text-brand-red"
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.25 + i * 0.3, type: "spring", stiffness: 380, damping: 16 }}
              >
                ✕
              </motion.span>
              <span className="relative">
                {r}
                <motion.span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-[1.5px] w-full origin-left bg-brand-red/70"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: 0.3 + i * 0.3, duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                />
              </span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
