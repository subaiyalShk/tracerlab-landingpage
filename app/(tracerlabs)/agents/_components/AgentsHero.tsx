import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";

export default function AgentsHero() {
  return (
    <section id="tl-ag-hero" className="relative isolate w-full overflow-hidden bg-page">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[15%] left-1/2 -z-10 h-[55vw] w-[70vw] -translate-x-1/2 rounded-full opacity-[0.18] blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(231,2,141,0.4) 0%, rgba(5,106,252,0.2) 45%, transparent 72%)",
        }}
      />
      <div className="mx-auto w-full max-w-[1100px] px-6 py-24 text-center sm:px-10 sm:py-28 lg:py-32">
        <div className="flex justify-center">
          <Eyebrow>Custom AI Products &amp; Agents</Eyebrow>
        </div>
        <h1 className="font-display animate-rise mx-auto mt-7 max-w-[18ch] text-[clamp(2.2rem,6vw,4rem)] font-normal uppercase leading-[1.02] tracking-tight">
          Scale your{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}
          >
            Intelligence
          </span>
          .
        </h1>
        <p className="animate-rise mx-auto mt-7 max-w-[42rem] text-[1.08rem] leading-relaxed text-ink/55">
          Tracerlabs builds AI systems that run your business on autopilot — from lead generation
          to closing deals to managing operations.
        </p>
        <div className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="#tl-ag-cta" variant="primary">Book a Demo</Button>
          <Button href="#tl-ag-system" variant="secondary">See How It Works</Button>
        </div>
      </div>
    </section>
  );
}
