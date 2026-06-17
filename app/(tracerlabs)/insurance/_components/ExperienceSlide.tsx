import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";
import DashboardMockup from "../../voice-agents/_components/DashboardMockup";

const DEMO_URL = "https://crestline-insurance-six.vercel.app";
const DEMO_PASSWORD = "JQVWgCvzF3wLjlNW0uJ4PQpG";
const DEMO_NUMBER = "+1 (737) 358-5242";

export default function ExperienceSlide() {
  return (
    <Slide id="tl-ins-demo" bgSrc="/assets/insurance/gen/experience-v1.png" bgOpacity={0.2}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[46vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="max-w-[46rem]">
        <Eyebrow>Try it live</Eyebrow>
        <Kinetic
          segments={[{ text: "Don't take our word for it — " }, { text: "see it live.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            This is a real demo we built for a personal-lines agency — the same agent and the same owner
            dashboard. Call it, then open the dashboard and watch the call land in real time.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.1fr)] lg:gap-10">
        {/* how to experience the live Crestline demo */}
        <Reveal y={28} amount={0.2}>
          <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex flex-col gap-6 p-6 sm:p-7">
              <div>
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/40">1 · Call the agent</div>
                <a
                  href={`tel:${DEMO_NUMBER.replace(/[^0-9+]/g, "")}`}
                  className="font-display mt-2 block text-[1.7rem] tracking-tight text-ink transition-colors hover:text-brand-pink"
                >
                  {DEMO_NUMBER}
                </a>
                <p className="mt-1 text-[0.82rem] text-ink/45">Ask for a quote, or to text your insurance card.</p>
              </div>
              <div className="border-t border-ink/10 pt-5">
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/40">2 · Watch the dashboard</div>
                <p className="mt-2 text-[0.82rem] leading-relaxed text-ink/55">
                  Open the live owner dashboard and log in with the demo password:{" "}
                  <span className="select-all font-mono text-ink/80">{DEMO_PASSWORD}</span>
                </p>
                <div className="mt-4">
                  <Button href={DEMO_URL} external variant="primary" size="sm">Launch live demo</Button>
                </div>
              </div>
            </div>
          </Bevel>
        </Reveal>

        {/* the dashboard preview */}
        <Reveal delay={0.12} y={28} amount={0.2}>
          <div className="mb-4 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/50">
            <span aria-hidden className="h-2.5 w-px bg-gradient-to-b from-brand-pink to-brand-blue" />
            What the owner sees — live
          </div>
          <DashboardMockup />
        </Reveal>
      </div>
    </Slide>
  );
}
