"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, MotionConfig, type MotionValue } from "motion/react";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import CallMockup from "./CallMockup";
import { STAGES, StageVisual } from "./stages";

// "Mission control" view of the 14 autopilot stages: a stage spine (left rail / mobile
// ticker) drives a single central "screen" that morphs to the active stage's mockup with
// spring physics. ARIA tablist/tabpanel + roving tabindex; reduced-motion via MotionConfig.
//
// Two operating modes:
//  • uncontrolled (no `active` prop) — self-contained interactive console (mobile fallback)
//  • controlled — AutopilotScrolly drives `active` from scroll position and receives
//    navigation intents via `onSelect`; `fineProgress` (0–1 MotionValue) renders a buttery
//    scroll-linked progress bar; `cinematic` compacts the rail and adds the ghost numeral.
//
// Perf notes (this is the page's hot path — stage changes happen mid-scroll):
//  • ONE persistent Bevel screen frame; only the inner content is keyed/remounted per stage.
//    Remounting the frame would recreate its paint layer 14× across the scroll band.
//  • The stage transition animates opacity + y only — no filter:blur springs (per-frame
//    style.filter writes on a ~700px panel while scrolling) and no backdrop-filter (the
//    card fill is near-opaque in both themes, so the blur cost bought nothing visible).

export default function ConsoleView({
  active: controlled,
  onSelect,
  fineProgress,
  cinematic = false,
}: {
  active?: number;
  onSelect?: (i: number) => void;
  fineProgress?: MotionValue<number>;
  cinematic?: boolean;
}) {
  const total = STAGES.length;
  const [internal, setInternal] = useState(0);
  const active = controlled ?? internal;
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const s = STAGES[active];

  function go(i: number) {
    const next = Math.max(0, Math.min(total - 1, i));
    if (onSelect) onSelect(next);
    else setInternal(next);
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

  const plate = cinematic ? "h-7 w-7 text-[0.7rem]" : "h-9 w-9 text-[0.8rem]";

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
          <div
            aria-hidden
            className={`absolute top-1 hidden w-px bg-ink/10 lg:block ${cinematic ? "left-3.5" : "left-[18px]"}`}
            style={{ height: "calc(100% - 0.5rem)" }}
          >
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
                className={`group relative z-10 flex shrink-0 items-center gap-3 text-left outline-none transition-opacity focus-visible:[outline:2px_solid_var(--color-brand-pink)] focus-visible:[outline-offset:3px] ${cinematic ? "lg:py-0.5" : "lg:py-1"} ${on ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
              >
                <span
                  className={`bv-6 flex ${plate} shrink-0 items-center justify-center font-bold transition-all`}
                  style={
                    on
                      ? { backgroundImage: "linear-gradient(135deg,#e7028d,#056afc)", color: "#fff", boxShadow: "0 6px 18px -6px rgba(231,2,141,0.5)" }
                      : { backgroundImage: "linear-gradient(145deg,#2b2c33,#16171b)", color: "#e9eaef", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -2px 3px rgba(0,0,0,0.55)" }
                  }
                >
                  {st.n}
                </span>
                <span className={`font-display hidden whitespace-nowrap ${cinematic ? "text-[0.85rem]" : "text-[0.9rem]"} tracking-tight lg:inline lg:whitespace-normal ${on ? "text-ink" : "text-ink/70"}`}>
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── SCREEN ── */}
        <div role="tabpanel" aria-label={`${s.title} — stage ${active + 1} of ${total}`} className="relative min-w-0">
          {/* ghost numeral — cinematic depth layer behind the screen */}
          {cinematic && (
            <div
              aria-hidden
              className="font-display pointer-events-none absolute -top-4 right-0 z-0 select-none text-[clamp(5.5rem,9vw,8.5rem)] leading-none"
              style={{ WebkitTextStroke: "1.5px color-mix(in oklab, var(--tl-ink) 16%, transparent)", color: "transparent" }}
            >
              {String(s.n).padStart(2, "0")}
            </div>
          )}

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="font-body shrink-0 text-[0.8rem] font-semibold tabular-nums text-ink/40">
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
              className={`${cinematic ? "mb-4" : "mb-6"} max-w-[48ch] text-[1rem] leading-relaxed text-ink/55`}
            >
              {s.desc}
            </motion.p>

            <div className={`relative flex items-start ${cinematic ? "min-h-[250px]" : "min-h-[300px] sm:min-h-[360px]"}`}>
              <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="w-full">
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 210, damping: 26 }}
                  className="flex min-h-[200px] items-center p-6 sm:p-8"
                >
                  <div className="w-full">
                    {s.n === 3 ? <CallMockup frameless /> : <StageVisual v={s.visual} />}
                  </div>
                </motion.div>
              </Bevel>
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
                {fineProgress ? (
                  <motion.div
                    className="absolute inset-0 origin-left bg-gradient-to-r from-brand-pink to-brand-blue"
                    style={{ scaleX: fineProgress }}
                  />
                ) : (
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-pink to-brand-blue"
                    animate={{ width: `${((active + 1) / total) * 100}%` }}
                    transition={{ type: "spring", stiffness: 140, damping: 24 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
