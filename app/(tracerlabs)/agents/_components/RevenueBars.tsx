"use client";

import { motion, useReducedMotion } from "motion/react";
import { BRAND_GRADIENT } from "../../../components/motion";

// Q1→Q4 revenue staircase for the FinancialImpact card — small client leaf (scroll-triggered).
export default function RevenueBars() {
  const reduced = useReducedMotion();
  return (
    <div aria-label="Revenue rising quarter over quarter" className="flex h-[2.6rem] items-end gap-1.5">
      {[0.3, 0.5, 0.72, 1].map((h, i) => (
        <motion.span
          key={i}
          className="w-3.5 origin-bottom"
          style={{ height: `${h * 100}%`, background: BRAND_GRADIENT, clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%)" }}
          initial={reduced ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ delay: 0.2 + i * 0.12, type: "spring", stiffness: 220, damping: 20 }}
        />
      ))}
    </div>
  );
}
