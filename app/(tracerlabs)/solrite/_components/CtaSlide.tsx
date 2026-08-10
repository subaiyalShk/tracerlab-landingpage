import Button from "../../../components/Button";
import DeckCta from "./DeckCta";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

export default function CtaSlide({ calcomUrl }: { calcomUrl: string }) {
  return (
    <section
      data-slide
      id="tl-solrite-cta"
      className="relative isolate flex min-h-[100dvh] w-full snap-start flex-col items-center justify-center overflow-hidden bg-page text-center text-ink"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[46vw] w-[56vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.4) 0%, rgba(5,106,252,0.2) 45%, transparent 72%)" }}
      />

      <div className="mx-auto w-full max-w-[900px] px-6 sm:px-10">
        <div className="flex justify-center">
          <Eyebrow>Next step</Eyebrow>
        </div>
        <Kinetic
          as="h2"
          segments={[{ text: "One wire away from " }, { text: "buying customers.", gradient: true }]}
          className="font-display mt-6 text-[clamp(2rem,5.2vw,3.6rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-[40rem] text-[1.05rem] leading-relaxed text-ink/55">
            Give us read access to the ad account and we will start with step 00 — confirming what is live and
            establishing the baseline. Everything after that is measured against it.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href={calcomUrl} variant="primary" external>
              Book a call
            </Button>
            <DeckCta target="tl-solrite-plan" variant="secondary">
              Back to the plan
            </DeckCta>
          </div>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-12 text-[0.72rem] uppercase tracking-[0.22em] text-ink/30">
            Prepared by Tracerlabs for Solrite Energy · Based on a full audit of the Spark codebase
          </p>
        </Reveal>
      </div>
    </section>
  );
}
