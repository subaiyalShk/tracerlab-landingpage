import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { CountUp } from "../../../components/motion";
import { KineticHeading, ScrollCue } from "../../../components/Kinetic";
import DashboardMockup from "./DashboardMockup";

// Opening scene: kinetic two-line lockup + the value prop on the left, the live "owner
// dashboard" console on the right — the differentiator (the dashboard) is the hero visual.
// Renders OUTSIDE <main> so the sticky nav can rest at the bottom of the first screen.
const PROOF: { value: number; prefix?: string; suffix?: string; label: string }[] = [
  { value: 100, suffix: "%", label: "Calls answered" },
  { value: 24, suffix: "/7", label: "Always on" },
  { value: 2, prefix: "<", suffix: " rings", label: "To pick up" },
];

export default function VoiceHero() {
  return (
    <section id="tl-va-hero" className="font-body relative isolate flex min-h-[calc(100vh-5rem)] w-full flex-col overflow-hidden bg-page text-ink">
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
        className="pointer-events-none absolute -top-[20%] left-[62%] -z-10 h-[55vw] w-[60vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.4) 0%, rgba(5,106,252,0.22) 45%, transparent 72%)" }}
      />

      <div className="mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-10 px-6 pb-6 pt-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:pt-6">
        {/* ── copy ── */}
        <div>
          <Eyebrow>Voice AI + Live Dashboard</Eyebrow>
          <KineticHeading
            as="h1"
            segments={[{ text: "Answer every call.", block: true }, { text: "Monitor " }, { text: "everything.", gradient: true }]}
            className="font-display mt-5 max-w-[16ch] text-[clamp(2.3rem,min(6vw,8vh),4.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <p className="animate-rise mt-5 max-w-[34rem] text-[1.08rem] leading-relaxed text-ink/55 [animation-delay:0.5s]">
            An AI voice agent that picks up in under two rings — qualifying new prospects and supporting
            existing customers 24/7 — backed by a live dashboard where you watch every call, transcript,
            and action in real time.
          </p>
          <div className="animate-rise mt-7 flex flex-wrap items-center gap-4 [animation-delay:0.65s]">
            <Button href="#tl-va-cta" variant="primary">Talk to the agent</Button>
            <Button href="#tl-va-dashboard" variant="secondary">See the dashboard</Button>
          </div>

          <dl className="animate-rise mt-7 flex flex-nowrap items-start gap-x-6 border-t border-ink/10 pt-4 [animation-delay:0.8s] sm:gap-x-9">
            {PROOF.map((p) => (
              <div key={p.label} className="flex flex-col">
                <dt className="order-2 mt-1.5 whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                  {p.label}
                </dt>
                <dd className="font-body order-1 m-0 whitespace-nowrap text-[1.45rem] font-bold leading-none tracking-tight">
                  <CountUp value={p.value} prefix={p.prefix} suffix={p.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── live dashboard console ── */}
        <div className="relative">
          <DashboardMockup />
        </div>
      </div>

      <ScrollCue className="hidden pb-5 lg:[@media(min-height:800px)]:flex" />
    </section>
  );
}
