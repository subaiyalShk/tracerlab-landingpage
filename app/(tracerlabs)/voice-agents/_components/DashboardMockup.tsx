"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionConfig, type Variants } from "motion/react";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";

// The hero's centerpiece: a stylized "owner dashboard" console that mirrors the real product
// (live call log → expanded transcript + actions). Same motion language as CallMockup —
// scroll parallax + depth tilt, a spring-staggered entrance, continuous LIVE micro-motion.
// MotionConfig reducedMotion="user" auto-reduces all transform motion for accessibility.

const card: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 230, damping: 22 } } };

const STATS = [
  { k: "Calls today", v: "14" },
  { k: "Cards texted", v: "9" },
  { k: "Claims", v: "2" },
];
const ACTIONS = ["Verified caller", "Texted auto ID card", "Looked up billing"];

export default function DashboardMockup() {
  const ref = useRef<HTMLDivElement>(null);
  // ref must attach in every branch or useScroll throws and kills motion's frame loop page-wide.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [28, -28]), { stiffness: 90, damping: 24, mass: 0.4 });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -3]);

  const panel = (
    <div className="flex flex-col gap-4 p-5 sm:p-6">
      {/* header */}
      <motion.div variants={item} className="flex items-center justify-between gap-3">
        <div>
          <div className="font-display text-[0.95rem] tracking-tight">Owner Dashboard</div>
          <div className="text-[0.72rem] text-ink/40">Live call monitoring</div>
        </div>
        <span className="bv-6 flex items-center gap-1.5 bg-brand-pink/10 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-brand-pink">
          <span className="relative flex h-1.5 w-1.5">
            <span aria-hidden className="animate-orb-ripple absolute h-1.5 w-1.5 rounded-full bg-brand-pink/60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-brand-pink" />
          </span>
          Live
        </span>
      </motion.div>

      {/* stat tiles */}
      <motion.div variants={item} className="grid grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div key={s.k} className="bv-6 bg-ink/[0.05] px-3 py-2">
            <div className="font-body text-[1.15rem] font-bold leading-none tracking-tight tabular-nums">{s.v}</div>
            <div className="mt-1 text-[0.58rem] uppercase tracking-wide text-ink/40">{s.k}</div>
          </div>
        ))}
      </motion.div>

      {/* one expanded call row */}
      <motion.div variants={item} className="border-t border-ink/10 pt-4">
        <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/35">Calls</div>
        <div className="bv-6 mt-2 bg-ink/[0.04] p-3">
          <div className="flex items-center gap-2 text-[0.8rem]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: "#34d399" }} />
            <span className="font-medium text-ink/85">Jane Doe</span>
            <span className="text-ink/35">· 1:32</span>
            <span className="bv-6 px-1.5 py-0.5 text-[0.58rem] font-medium" style={{ background: "rgba(52,211,153,0.12)", color: "#6ee7b7" }}>positive</span>
            <span className="ml-auto text-[0.62rem] text-ink/30">2:14p</span>
          </div>

          {/* transcript bubbles */}
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="bv-6 max-w-[86%] self-start bg-ink/[0.06] px-2.5 py-1.5 text-[0.73rem] leading-snug text-ink/75">
              <span className="text-ink/40">Riley:</span> Thanks for calling Crestline — is this Jane?
            </div>
            <div className="bv-6 max-w-[86%] self-end bg-brand-pink/12 px-2.5 py-1.5 text-[0.73rem] leading-snug text-ink/85">
              Can you text me my auto card?
            </div>
          </div>

          {/* actions taken */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ACTIONS.map((a) => (
              <span key={a} className="bv-6 inline-flex items-center gap-1 bg-brand-blue/10 px-2 py-1 text-[0.6rem] text-ink/70">
                <span aria-hidden className="text-brand-blue">✓</span>
                {a}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <motion.div ref={ref} style={{ y }} className="[perspective:1200px]">
        <motion.div
          style={{ rotateX, transformStyle: "preserve-3d" }}
          variants={card}
          initial="hidden"
          animate="show"
        >
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG}>
            {panel}
          </Bevel>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
