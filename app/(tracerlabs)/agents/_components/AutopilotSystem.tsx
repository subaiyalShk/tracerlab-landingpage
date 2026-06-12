import Eyebrow from "../../../components/Eyebrow";
import AutopilotScrolly from "./AutopilotScrolly";
import { Kinetic, Reveal } from "../../../components/motion";

// NOTE: no overflow-hidden on this section — the scrollytelling console inside relies on
// position: sticky, which an overflow-hidden ancestor would break.
export default function AutopilotSystem() {
  return (
    <section id="tl-ag-system" className="relative isolate w-full bg-page" style={{ scrollMarginTop: "5rem" }}>
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
              without lifting a finger. Scroll to watch the system run.
            </p>
          </Reveal>
        </div>
        <div className="mt-12 pb-20 sm:pb-24 lg:mt-6 lg:pb-0">
          <AutopilotScrolly />
        </div>
      </div>
    </section>
  );
}
