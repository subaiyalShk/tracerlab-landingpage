import Image from "next/image";
import VoiceWidget from "../../../components/VoiceWidget";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

export default function AgentsCta({ voiceEnabled, calcomUrl }: { voiceEnabled: boolean; calcomUrl: string }) {
  return (
    <section id="tl-ag-cta" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      {/* circuit-horizon backdrop (dark theme only) — its glowing core sits behind the voice orb */}
      <div aria-hidden className="tl-dark-only pointer-events-none absolute inset-0 -z-20">
        {/* versioned filename: the Next/Vercel image-optimizer cache persists across deploys
            keyed by source URL, so regenerated assets need a new name to actually update */}
        <Image
          src="/assets/agents/gen/backdrop-cta-v3.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_70%] opacity-35"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 78%, transparent 100%)",
          }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[52vw] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-24 text-center sm:px-10 sm:py-28">
        <div className="flex justify-center">
          <Eyebrow>Let&apos;s build</Eyebrow>
        </div>
        <Kinetic
          segments={[{ text: "Ready to put your business on " }, { text: "autopilot?", gradient: true }]}
          className="font-display mt-7 text-[clamp(2.1rem,5.5vw,3.6rem)] font-normal uppercase leading-[1.02] tracking-tight"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-ink/55">
            Talk to our AI agent right now, or book a demo to see the full system deployed for your business in days, not months.
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
            <span className="text-[0.78rem] text-ink/35">Deployed in days, not months.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
