import Eyebrow from "../../../components/Eyebrow";
import StageMarquee from "./StageMarquee";
import CallMockup from "./CallMockup";
import { Kinetic, Reveal } from "../../../components/motion";

// The autopilot system, reworked: the 14 stages stream past as a velocity-linked marquee
// (breadth — "always running"), and one flagship stage renders live below it (depth — what
// a stage actually does). Replaces the old pinned click-through console.
export default function AutopilotSystem() {
  return (
    <section id="tl-ag-system" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div className="mx-auto w-full max-w-[1180px] px-6 pt-20 sm:px-10 sm:pt-24 lg:pt-28">
        <div className="max-w-[44rem]">
          <Eyebrow>The autopilot system</Eyebrow>
          <Kinetic
            segments={[{ text: "Your business on " }, { text: "autopilot.", gradient: true }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
              Fourteen AI-powered stages working 24/7 to generate, convert, and retain customers —
              without lifting a finger.
            </p>
          </Reveal>
        </div>
      </div>

      {/* full-bleed streaming marquee of all 14 stages */}
      <div className="mt-10 sm:mt-12">
        <StageMarquee />
      </div>

      {/* one stage, live — the flagship example */}
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-20 sm:px-10 sm:pb-24 lg:pb-28">
        <Reveal amount={0.2} className="mx-auto mt-12 max-w-[640px] sm:mt-16">
          <div className="mb-4 flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink/40">
            <span className="relative flex h-1.5 w-1.5">
              <span aria-hidden className="animate-orb-ripple absolute h-1.5 w-1.5 rounded-full bg-brand-pink/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-brand-pink" />
            </span>
            Live · Stage 03 — AI Calls &amp; Books
          </div>
          <CallMockup />
        </Reveal>
      </div>
    </section>
  );
}
