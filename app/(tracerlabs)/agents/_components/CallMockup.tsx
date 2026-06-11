"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionConfig, type Variants } from "motion/react";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";

// World-class animated mockup for the "AI Calls & Books" stage, powered by `motion`:
//  • scroll-linked parallax + a subtle depth tilt as the panel travels through the viewport
//  • a spring-orchestrated entrance: header → caller → transcript cascade in with physics
//  • continuous CSS micro-motion (LIVE pulse, equalizer waveform, typing dots)
//  • MotionConfig reducedMotion="user" → all transform motion auto-reduces for accessibility

const TRANSCRIPT: { who: "ai" | "them"; text: string }[] = [
  { who: "ai", text: "Hi Sarah, I'm calling about your interest in our AI solutions — do you have a minute?" },
  { who: "them", text: "Yes, I'd love to learn more about automation." },
];

const card: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 230, damping: 22 } },
};
const script: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.42, delayChildren: 0.15 } },
};
const bubble: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 20 } },
};
const confirm: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 15 } },
};

export default function CallMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [34, -34]), { stiffness: 90, damping: 24, mass: 0.4 });
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -4]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div ref={ref} style={{ y }} className="[perspective:1200px]">
        <motion.div
          style={{ rotateX, transformStyle: "preserve-3d" }}
          variants={card}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md">
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              {/* header */}
              <motion.div variants={item} className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-display text-[0.95rem] tracking-tight">AI Voice Agent</div>
                  <div className="text-[0.72rem] text-ink/40">Outbound call</div>
                </div>
                <span className="bv-6 flex items-center gap-1.5 bg-brand-pink/10 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-brand-pink">
                  <span className="relative flex h-1.5 w-1.5">
                    <span aria-hidden className="animate-orb-ripple absolute h-1.5 w-1.5 rounded-full bg-brand-pink/60" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  </span>
                  Live · 00:47
                </span>
              </motion.div>

              {/* caller + animated equalizer */}
              <motion.div variants={item} className="flex items-center gap-3">
                <span className="bv-6 flex h-9 w-9 shrink-0 items-center justify-center bg-ink/[0.06] text-[0.78rem] font-semibold text-ink/70">SM</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[0.85rem] text-ink/80">Sarah Mitchell · Acme Corp</div>
                  <div className="text-[0.7rem] text-ink/40">HD Voice</div>
                </div>
                <div aria-hidden className="flex h-7 items-end gap-[3px]">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <span
                      key={i}
                      className="animate-wave w-[3px] origin-bottom rounded-full"
                      style={{ height: "100%", animationDelay: `${i * 0.11}s`, background: "linear-gradient(to top, #e7028d, #056afc)" }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* transcript — cascades in with spring physics */}
              <motion.div variants={script} className="flex flex-col gap-2 border-t border-ink/10 pt-4">
                <motion.div variants={item} className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/35">
                  Live transcript
                </motion.div>
                {TRANSCRIPT.map((l, i) => (
                  <motion.div key={i} variants={bubble} className={`max-w-[88%] ${l.who === "ai" ? "self-start" : "self-end"}`}>
                    <div className={`bv-6 px-3 py-2 text-[0.8rem] leading-snug ${l.who === "ai" ? "bg-ink/[0.06] text-ink/80" : "bg-brand-pink/12 text-ink/85"}`}>
                      {l.text}
                    </div>
                  </motion.div>
                ))}
                <motion.div variants={bubble} aria-hidden className="flex items-center gap-1 self-start">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="animate-blink h-1.5 w-1.5 rounded-full bg-ink/40" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </motion.div>
                <motion.div variants={confirm} className="bv-6 mt-1 flex items-center gap-2 bg-brand-blue/10 px-3 py-2 text-[0.8rem] text-ink/80">
                  <span className="text-brand-blue">✓</span> Appointment booked — Thursday, 2:00 PM
                </motion.div>
              </motion.div>
            </div>
          </Bevel>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}
