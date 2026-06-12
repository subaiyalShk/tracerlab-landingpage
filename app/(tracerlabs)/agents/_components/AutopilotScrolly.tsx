"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import ConsoleView from "./ConsoleView";
import { STAGES } from "./stages";

// Scrollytelling orchestrator for the autopilot console. On desktop the console pins to
// the viewport and scrolling drives it through all 14 stages — the page becomes a product
// film. Clicking/keyboarding a stage scrolls to that stage's band, so scroll position and
// UI never disagree. Mobile, short viewports, and reduced-motion users get the plain
// interactive console (no pinning, no scroll hijacking).
const STAGE_VH = 32; // scroll distance each stage occupies

export default function AutopilotScrolly() {
  const total = STAGES.length;
  const reduced = useReducedMotion();
  const [cinema, setCinema] = useState(false);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 560px)");
    const update = () => setCinema(mq.matches && !reduced);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!cinema) return;
    setActive(Math.max(0, Math.min(total - 1, Math.floor(p * total))));
  });

  function scrollToStage(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / total) * span, behavior: "smooth" });
  }

  // The ref must be attached in BOTH modes — useScroll({ target }) throws ("target ref
  // not hydrated") if the ref never lands on an element, which kills motion's frame loop
  // for the whole page.
  if (!cinema) {
    return (
      <div ref={trackRef}>
        <ConsoleView />
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative" style={{ height: `${total * STAGE_VH + 100}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center pt-20">
        <ConsoleView active={active} onSelect={scrollToStage} fineProgress={scrollYProgress} cinematic />
      </div>
    </div>
  );
}
