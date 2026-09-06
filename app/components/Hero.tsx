// Homepage hero (Telemetry redesign) — the headline plus a REAL client-results
// panel instead of the old simulated "live demo" canvas. Real telemetry beats
// fake telemetry: every number here comes from client systems in production
// (see /work/solar-lead-engine and /work/harbs-farm for the sources).
// Quiet by design: no auroras/scanlines/particles, no scroll-reveal gating,
// and the brand gradient appears exactly once (the panel's headline number).
import Button from "./Button";
import Bevel, { GLASS_BORDER, GLASS_BG } from "./Bevel";
import TelemetryPanel from "./TelemetryPanel";

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

export default function Hero() {
  return (
    <section id="tl-hero" className="font-body relative isolate w-full overflow-hidden bg-page text-ink">
      {/* ── Ambient light (one of two on the page — the other sits behind the CTA) */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -right-[12%] -top-[18%] -z-10 h-[52vw] w-[52vw] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--nt-ambient-blue) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="animate-drift-slow pointer-events-none absolute -left-[14%] top-[30%] -z-10 h-[44vw] w-[44vw] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--nt-ambient-pink) 0%, transparent 70%)" }}
      />
      {/* Dot grid, hero only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle, var(--tl-dot-grid) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 85% 70% at 55% 35%, #000 30%, transparent 75%)",
        }}
      />
      {/* The scene: a perspective grid floor receding to a glowing horizon */}
      <div aria-hidden className="nt-horizon -z-10" />
      <div aria-hidden className="nt-gridfloor -z-10" />
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-8">
        {/* Left: copy */}
        <div className="min-w-0 max-w-[40rem]">
          <p className="animate-rise text-[0.98rem] text-ink/50">Tracerlabs — AI development studio</p>
          <h1
            className="animate-rise mt-4 text-[clamp(2.4rem,min(5.2vw,7.5vh),4.4rem)] font-extrabold leading-[1.03] tracking-tight"
            style={{ fontFamily: DISPLAY, animationDelay: "0.08s" }}
          >
            <span className="nt-sheen">We build the machine that grows your business.</span>
            <span aria-hidden className="nt-cursor" />
          </h1>
          <p className="animate-rise mt-5 max-w-[34rem] text-[1.08rem] leading-[1.65] text-ink/60" style={{ animationDelay: "0.18s" }}>
            Ads in, booked jobs out. Funnels, AI follow-up, booking systems,
            and the software to run it all — measured end to end, built and
            run by one team.
          </p>

          <div className="animate-rise mt-7 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.26s" }}>
            <Button href="#contact" variant="primary" size="lg">
              Start your project
            </Button>
            <Button href="#tl-projects" variant="secondary" size="lg">
              See the case studies
            </Button>
          </div>

          {/* Real proof, in words — replaces the old stock-avatar rating widget */}
          <p className="animate-rise mt-8 max-w-[32rem] border-t border-ink/10 pt-5 text-[0.92rem] leading-relaxed text-ink/55" style={{ animationDelay: "0.36s" }}>
            Built for solar, roofing, insurance, and local operations. The
            client telemetry here is live production data — the same meter we
            run for every client.
          </p>
        </div>

        {/* Right: client telemetry panel — the page's one full-treatment centerpiece:
            gradient edge, permanent underglow, corner brackets. */}
        <div className="animate-rise relative w-full min-w-0" style={{ animationDelay: "0.22s" }}>
          <div aria-hidden className="nt-brackets">
            <span /><span /><span /><span />
          </div>
        <Bevel
          bevel={16}
          border={GLASS_BORDER}
          bg={GLASS_BG}
          className="w-full min-w-0"
          innerClassName="backdrop-blur-xl"
          style={{ filter: "var(--nt-underglow-filter)" }}
        >
          <TelemetryPanel />
        </Bevel>
        </div>
      </div>
    </section>
  );
}
