import Eyebrow from "../../../components/Eyebrow";
import Button from "../../../components/Button";
import { Kinetic, Reveal } from "../../../components/motion";
import VoiceWidget from "../../../components/VoiceWidget";

export default function CloseSlide({ voiceEnabled, calcomUrl }: { voiceEnabled: boolean; calcomUrl: string }) {
  return (
    <section
      data-slide
      id="tl-ins-close"
      className="relative flex min-h-[100dvh] w-full snap-start flex-col items-center justify-center overflow-hidden bg-page text-center text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[50vw] w-[62vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center px-6 sm:px-10">
        <Eyebrow>Get started</Eyebrow>
        <Kinetic
          segments={[{ text: "Ready to never miss a " }, { text: "call again?", gradient: true }]}
          className="font-display mt-6 text-[clamp(2.1rem,5.5vw,3.6rem)] font-normal uppercase leading-[1.02] tracking-tight"
        />
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-[34rem] text-[1.05rem] leading-relaxed text-ink/55">
            Talk to the agent one more time, or book a call and we&apos;ll deploy your agent and dashboard in
            days, not months.
          </p>
        </Reveal>
        <Reveal delay={0.35} amount={0.2}>
          <div className="mt-10">
            <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
          </div>
        </Reveal>
        <Reveal delay={0.45} amount={0.2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href={calcomUrl} variant="primary" external>Book a call</Button>
            <Button href="#tl-ins-pricing" variant="secondary">See pricing</Button>
          </div>
        </Reveal>
      </div>
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[0.7rem] text-ink/30">
        Tracerlabs · AI voice agents + dashboards
      </div>
    </section>
  );
}
