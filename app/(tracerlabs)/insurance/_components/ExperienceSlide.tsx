import Slide from "./Slide";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";
import VoiceWidget from "../../../components/VoiceWidget";
import DashboardMockup from "../../voice-agents/_components/DashboardMockup";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Button from "../../../components/Button";

const DEMO_URL = "https://crestline-insurance-six.vercel.app";
const DEMO_PASSWORD = "JQVWgCvzF3wLjlNW0uJ4PQpG";

export default function ExperienceSlide({ voiceEnabled, calcomUrl }: { voiceEnabled: boolean; calcomUrl: string }) {
  return (
    <Slide id="tl-ins-demo">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[46vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="max-w-[46rem]">
        <Eyebrow>Try it live</Eyebrow>
        <Kinetic
          segments={[{ text: "Don't take our word for it — " }, { text: "talk to it.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
            This is the real agent and the real dashboard. Tap to start a call — ask for a quote, or for your
            insurance card — and watch the action land on the owner&apos;s view.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        {/* talk to the agent */}
        <Reveal y={28} amount={0.2} className="flex flex-col items-center">
          <span className="bv-6 mb-6 inline-flex items-center gap-2 bg-ink/[0.05] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/50">
            <span aria-hidden className="h-2.5 w-px bg-gradient-to-b from-brand-pink to-brand-blue" />
            Talk to Riley
          </span>
          <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        </Reveal>

        {/* the dashboard — preview + launch the REAL app with the demo login */}
        <Reveal delay={0.12} y={28} amount={0.2}>
          <div className="mb-4 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/50">
            <span aria-hidden className="h-2.5 w-px bg-gradient-to-b from-brand-pink to-brand-blue" />
            What the owner sees — live
          </div>
          <DashboardMockup />
          <Bevel bevel={12} border={GLASS_BORDER} bg={GLASS_BG} className="mt-4">
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="text-[0.85rem] font-medium text-ink/85">Open the real dashboard</div>
                <div className="mt-1 text-[0.74rem] leading-relaxed text-ink/45">
                  Log in with the demo password:{" "}
                  <span className="select-all font-mono text-ink/80">{DEMO_PASSWORD}</span>
                </div>
              </div>
              <Button href={DEMO_URL} external variant="primary" size="sm" className="shrink-0">
                Launch live demo
              </Button>
            </div>
          </Bevel>
        </Reveal>
      </div>
    </Slide>
  );
}
