"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, MotionConfig } from "motion/react";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import CallMockup from "./CallMockup";
import { STAGES, StageVisual } from "./stages";

// "Mission control" presentation of the 14 autopilot stages: a clickable stage spine (left rail /
// mobile ticker) drives a single central "screen" that morphs to the active stage's mockup with
// spring physics. ARIA tablist/tabpanel + roving tabindex; reduced-motion via MotionConfig.
function Screen({ index }: { index: number }) {
  const s = STAGES[index];
  if (s.n === 3) return <CallMockup />;
  return (
    <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md">
      <div className="flex min-h-[200px] items-center p-6 sm:p-8">
        <div className="w-full">
          <StageVisual v={s.visual} />
        </div>
      </div>
    </Bevel>
  );
}

export default function AutopilotConsole() {
  const total = STAGES.length;
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const s = STAGES[active];

  function go(i: number) {
    const next = Math.max(0, Math.min(total - 1, i));
    setActive(next);
    return next;
  }

  function onKey(e: KeyboardEvent) {
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = total - 1;
    else return;
    e.preventDefault();
    tabsRef.current[go(next)]?.focus();
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,30%)_1fr] lg:gap-14">
        {/* ── STAGE SPINE ── */}
        <div
          role="tablist"
          aria-label="Autopilot stages"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="relative flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div aria-hidden className="absolute left-[18px] top-1 hidden w-px bg-ink/10 lg:block" style={{ height: "calc(100% - 0.5rem)" }}>
            <motion.div
              className="w-full bg-gradient-to-b from-brand-pink to-brand-blue"
              animate={{ height: `${total > 1 ? (active / (total - 1)) * 100 : 0}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 24 }}
            />
          </div>

          {STAGES.map((st, i) => {
            const on = i === active;
            return (
              <button
                key={st.n}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => go(i)}
                className={`group relative z-10 flex shrink-0 items-center gap-3 text-left outline-none transition-opacity lg:py-1 ${on ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
              >
                <span
                  className="bv-6 flex h-9 w-9 shrink-0 items-center justify-center text-[0.8rem] font-bold transition-all"
                  style={
                    on
                      ? { backgroundImage: "linear-gradient(135deg,#e7028d,#056afc)", color: "#fff", boxShadow: "0 6px 18px -6px rgba(231,2,141,0.5)" }
                      : { backgroundImage: "linear-gradient(145deg,#2b2c33,#16171b)", color: "#e9eaef", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -2px 3px rgba(0,0,0,0.55)" }
                  }
                >
                  {st.n}
                </span>
                <span className={`font-display hidden whitespace-nowrap text-[0.9rem] tracking-tight lg:inline lg:whitespace-normal ${on ? "text-ink" : "text-ink/70"}`}>
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── SCREEN ── */}
        <div role="tabpanel" aria-label={`${s.title} — stage ${active + 1} of ${total}`} className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="font-display shrink-0 text-[0.8rem] tabular-nums text-ink/40">
                {String(active + 1).padStart(2, "0")} / {total}
              </span>
              <motion.h3
                key={s.n}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="font-display truncate text-[clamp(1.2rem,2.6vw,1.7rem)] uppercase tracking-tight"
              >
                {s.title}
              </motion.h3>
            </div>
            <span className="bv-6 hidden shrink-0 items-center gap-1.5 bg-brand-pink/10 px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-wide text-brand-pink sm:flex">
              <span aria-hidden className="animate-orb-pulse h-1.5 w-1.5 rounded-full bg-brand-pink" /> Live
            </span>
          </div>

          <motion.p
            key={s.n}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
            className="mb-6 max-w-[48ch] text-[1rem] leading-relaxed text-ink/55"
          >
            {s.desc}
          </motion.p>

          <div className="relative flex min-h-[300px] items-start sm:min-h-[360px]">
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              className="w-full"
            >
              <Screen index={active} />
            </motion.div>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous stage"
              className="bv-6 flex h-9 w-9 items-center justify-center bg-ink/[0.06] text-ink/70 transition-colors hover:bg-ink/[0.12] hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === total - 1}
              aria-label="Next stage"
              className="bv-6 flex h-9 w-9 items-center justify-center bg-ink/[0.06] text-ink/70 transition-colors hover:bg-ink/[0.12] hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
            </button>
            <div className="relative ml-1 h-px flex-1 bg-ink/12">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-pink to-brand-blue"
                animate={{ width: `${((active + 1) / total) * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 24 }}
              />
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
