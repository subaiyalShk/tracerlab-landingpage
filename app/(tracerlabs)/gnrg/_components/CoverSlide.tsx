import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { KineticHeading } from "../../../components/Kinetic";

export default function CoverSlide() {
  return (
    <section
      data-slide
      id="tl-gnrg-cover"
      className="relative isolate flex min-h-[100dvh] w-full snap-start flex-col items-center justify-center overflow-hidden bg-page text-center text-ink"
    >
      {/* dot grid + ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(var(--tl-dot-grid) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, black 35%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 45%, black 35%, transparent 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[52vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.4) 0%, rgba(5,106,252,0.2) 45%, transparent 72%)" }}
      />

      <div className="mx-auto w-full max-w-[1000px] px-6 sm:px-10">
        <div className="flex justify-center">
          <Eyebrow>A Tracerlabs proposal · for GNRG</Eyebrow>
        </div>
        <KineticHeading
          as="h1"
          segments={[
            { text: "The solar growth engine", block: true },
            { text: "that ", block: false },
            { text: "pays for itself.", gradient: true },
          ]}
          className="font-display mt-6 text-[clamp(2.4rem,6.5vw,4.8rem)] font-normal uppercase leading-[0.98] tracking-tight"
        />
        <p className="animate-rise mx-auto mt-6 max-w-[42rem] text-[1.1rem] leading-relaxed text-ink/55 [animation-delay:0.5s]">
          From ad click to booked appointment to installable job — a proven, fully-managed system, branded to
          GNRG and wired to your CRM. Already running in production for a solar company. No build fee.
        </p>
        <div className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-4 [animation-delay:0.65s]">
          <Button href="#tl-gnrg-system" variant="primary">See the system</Button>
          <Button href="#tl-gnrg-pricing" variant="secondary">See pricing</Button>
        </div>
      </div>

      <div aria-hidden className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-ink/35">
        Scroll
      </div>
    </section>
  );
}
