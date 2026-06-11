import VoiceWidget from "../../../components/VoiceWidget";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";

export default function AgentsCta({ voiceEnabled, calcomUrl }: { voiceEnabled: boolean; calcomUrl: string }) {
  return (
    <section id="tl-ag-cta" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[52vw] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-24 text-center sm:px-10 sm:py-28">
        <div className="flex justify-center">
          <Eyebrow>Let&apos;s build</Eyebrow>
        </div>
        <h2 className="font-display animate-rise mt-7 text-[clamp(2.1rem,5.5vw,3.6rem)] font-normal uppercase leading-[1.02] tracking-tight">
          Ready to put your business on{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>autopilot?</span>
        </h2>
        <p className="animate-rise mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-ink/55">
          Talk to our AI agent right now, or book a demo to see the full system deployed for your business in days, not months.
        </p>
        <div className="animate-rise mt-12">
          <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        </div>
        <div className="animate-rise mt-10">
          <Button href={calcomUrl} variant="secondary" external>Book a Demo</Button>
        </div>
      </div>
    </section>
  );
}
