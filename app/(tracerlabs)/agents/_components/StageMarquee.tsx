"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { STAGES, type Stage } from "./stages";

// Velocity-linked horizontal marquee of the 14 autopilot stages — the Motion "scroll
// velocity" pattern (useScroll → useVelocity → useSpring driving a wrapped translateX via
// useAnimationFrame). Two rows drift in opposite directions at rest; scrolling speeds them
// up and flips their direction, so the system reads as one always-running machine.
//
// Client island (below the fold). Reduced-motion users get a static wrapped grid of chips.

// Cyclically wrap v into [min, max) — local impl so we don't depend on a util export.
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

const ROWS: Stage[][] = [STAGES.slice(0, 7), STAGES.slice(7)];

function Chip({ n, title }: { n: number; title: string }) {
  return (
    <div className="group/chip bv-6 mx-1.5 flex shrink-0 items-center gap-3 bg-ink/[0.05] py-2.5 pl-2.5 pr-5 transition-colors duration-300 hover:bg-ink/[0.09]">
      {/* embossed dark-metal number plate — font-body so digits stay crisp (Duborics slashes zeros) */}
      <span
        className="bv-6 flex h-9 w-9 shrink-0 items-center justify-center font-body text-[0.82rem] font-bold tabular-nums"
        style={{
          backgroundImage: "linear-gradient(145deg,#2b2c33,#16171b)",
          color: "#e9eaef",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -2px 3px rgba(0,0,0,0.55)",
        }}
      >
        {String(n).padStart(2, "0")}
      </span>
      <span className="font-display whitespace-nowrap text-[0.95rem] tracking-tight text-ink/80 transition-colors duration-300 group-hover/chip:text-ink">
        {title}
      </span>
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink/55 transition-colors duration-300 group-hover/chip:bg-brand-pink" />
    </div>
  );
}

function Row({
  stages,
  baseVelocity,
  velocityFactor,
}: {
  stages: Stage[];
  baseVelocity: number;
  velocityFactor: MotionValue<number>;
}) {
  const baseX = useMotionValue(0);
  // translateX % is relative to the element's OWN width, so the track is w-max (= two copies)
  // and we wrap x within [-50%, 0%]: −50% shifts exactly one copy, giving a seamless loop.
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    // scroll direction flips the marquee direction
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;
    // scroll speed amplifies the drift
    moveBy += directionFactor.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden py-1.5">
      <motion.div className="flex w-max flex-nowrap" style={{ x }}>
        {[...stages, ...stages].map((s, i) => (
          <Chip key={i} n={s.n} title={s.title} />
        ))}
      </motion.div>
    </div>
  );
}

export default function StageMarquee() {
  const reduced = useReducedMotion();
  // velocity pipeline shared by both rows (computed once)
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  if (reduced) {
    return (
      <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-6 sm:px-10">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex flex-wrap gap-3">
            {row.map((s) => (
              <Chip key={s.n} n={s.n} title={s.title} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-3">
      {/* edge fades so chips dissolve into the page rather than hard-clipping */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-page to-transparent sm:w-32" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-page to-transparent sm:w-32" />
      <Row stages={ROWS[0]} baseVelocity={2.6} velocityFactor={velocityFactor} />
      <Row stages={ROWS[1]} baseVelocity={-2.6} velocityFactor={velocityFactor} />
    </div>
  );
}
