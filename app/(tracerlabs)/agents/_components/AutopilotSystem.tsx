import Eyebrow from "../../../components/Eyebrow";
import AutopilotConsole from "./AutopilotConsole";

export default function AutopilotSystem() {
  return (
    <section id="tl-ag-system" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>The autopilot system</Eyebrow>
          <h2 className="font-display animate-rise mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight">
            Your business on{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>autopilot</span>.
          </h2>
          <p className="animate-rise mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
            Fourteen AI-powered stages working 24/7 to generate, convert, and retain customers — without lifting a finger.
          </p>
        </div>
        <div className="mt-12">
          <AutopilotConsole />
        </div>
      </div>
    </section>
  );
}
