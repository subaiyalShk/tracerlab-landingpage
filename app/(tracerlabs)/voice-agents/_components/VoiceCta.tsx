import VoiceWidget from "../../../components/VoiceWidget";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

export default function VoiceCta({ voiceEnabled, calcomUrl }: { voiceEnabled: boolean; calcomUrl: string }) {
  return (
    <section id="tl-va-cta" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[52vw] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-24 text-center sm:px-10 sm:py-28">
        <Eyebrow>Hear it for yourself</Eyebrow>
        <Kinetic
          segments={[{ text: "Hear it answer — then put it on " }, { text: "your line.", gradient: true }]}
          className="font-display mt-7 text-[clamp(2.1rem,5.5vw,3.6rem)] font-normal uppercase leading-[1.02] tracking-tight"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-ink/55">
            Talk to our AI agent right now, or book a demo and we&apos;ll deploy the agent — and your
            live dashboard — for your business in days, not months.
          </p>
        </Reveal>
        <Reveal delay={0.35} amount={0.2}>
          <div className="mt-12">
            <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
          </div>
        </Reveal>
        <Reveal delay={0.45} amount={0.2}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <Button href={calcomUrl} variant="secondary" external>Book a Demo</Button>
            <span className="text-[0.78rem] text-ink/35">Agent + dashboard, deployed in days.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
