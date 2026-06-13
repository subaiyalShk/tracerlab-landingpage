import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import AgentNetwork from "./AgentNetwork";
import { CountUp } from "../../../components/motion";
import { KineticHeading, ScrollCue } from "../../../components/Kinetic";

// Cinematic opening scene: asymmetric split — kinetic copy on the left, the live agent
// network "booting up" on the right — over a dot-grid + ambient brand glow. Quantified
// proof sits above the fold (conversion: claims before scroll).
// Labels kept short so the three stats sit on one compact line (no wrap).
const PROOF: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }[] = [
  { value: 11.28, prefix: "$", suffix: "M", decimals: 2, label: "Revenue generated" },
  { value: 83, suffix: "%", label: "Call show-up rate" },
  { value: 500, suffix: "+", label: "Active users" },
];

export default function AgentsHero() {
  return (
    // font-body + text-ink live on the section itself — the hero renders OUTSIDE the
    // page's <main> wrapper so the sticky nav can sit after it in the DOM.
    <section id="tl-ag-hero" className="font-body relative isolate flex min-h-[calc(100vh-5rem)] w-full flex-col overflow-hidden bg-page text-ink">
      {/* dot grid, faded toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(var(--tl-dot-grid) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 40%, black 35%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 40%, black 35%, transparent 80%)",
        }}
      />
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] left-[60%] -z-10 h-[55vw] w-[60vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(231,2,141,0.4) 0%, rgba(5,106,252,0.22) 45%, transparent 72%)",
        }}
      />

      {/* Vertical rhythm is deliberately tight and the headline is also vh-clamped: the hero
          must fit inside (100vh - 5rem) so the sticky nav RESTS at the bottom of the first
          screen (same choreography as home) — if content overflows, the nav slips below the
          fold and the effect is lost. */}
      <div className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-10 px-6 pb-6 pt-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-8 lg:pt-6">
        {/* ── copy ── */}
        <div>
          <Eyebrow>Custom AI Products &amp; Agents</Eyebrow>
          <KineticHeading
            as="h1"
            segments={[{ text: "Scale your " }, { text: "Intelligence.", gradient: true }]}
            className="font-display mt-5 max-w-[12ch] text-[clamp(2.4rem,min(6.5vw,8.5vh),4.6rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <p className="animate-rise mt-5 max-w-[34rem] text-[1.08rem] leading-relaxed text-ink/55 [animation-delay:0.5s]">
            Tracerlabs builds AI systems that run your business on autopilot — from lead
            generation to closing deals to managing operations.
          </p>
          <div className="animate-rise mt-7 flex flex-wrap items-center gap-4 [animation-delay:0.65s]">
            <Button href="#tl-ag-cta" variant="primary">Book a Demo</Button>
            <Button href="#tl-ag-system" variant="secondary">See How It Works</Button>
          </div>

          {/* proof row — one compact line: number over a short single-line label */}
          <dl className="animate-rise mt-7 flex flex-nowrap items-start gap-x-6 border-t border-ink/10 pt-4 [animation-delay:0.8s] sm:gap-x-9">
            {PROOF.map((p) => (
              // dt precedes dd in source (spec order); flex order paints the number first
              <div key={p.label} className="flex flex-col">
                <dt className="order-2 mt-1.5 whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                  {p.label}
                </dt>
                {/* numbers use the body font — Duborics digits (slashed zeros etc.) read as
                    glitches in data; Jakarta bold + tabular-nums keeps them crisp */}
                <dd className="order-1 font-body m-0 whitespace-nowrap text-[1.45rem] font-bold leading-none tracking-tight">
                  <CountUp value={p.value} prefix={p.prefix} suffix={p.suffix} decimals={p.decimals} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── agent network ── */}
        <div className="relative -mx-4 sm:mx-0">
          <AgentNetwork className="lg:scale-[1.08]" />
        </div>
      </div>

      {/* only when there's vertical room — on short viewports it would push the nav below the fold */}
      <ScrollCue className="hidden pb-5 lg:[@media(min-height:800px)]:flex" />
    </section>
  );
}
