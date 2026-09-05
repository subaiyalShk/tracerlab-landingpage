// Homepage hero (Telemetry redesign) — the headline plus a REAL client-results
// panel instead of the old simulated "live demo" canvas. Real telemetry beats
// fake telemetry: every number here comes from client systems in production
// (see /work/solar-lead-engine and /work/harbs-farm for the sources).
// Quiet by design: no auroras/scanlines/particles, no scroll-reveal gating,
// and the brand gradient appears exactly once (the panel's headline number).
import Button from "./Button";
import Bevel, { GLASS_BORDER, GLASS_BG } from "./Bevel";
import RateChart from "./RateChart";

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
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-32">
        {/* Left: copy */}
        <div className="min-w-0 max-w-[40rem]">
          <p className="text-[0.98rem] text-ink/50">Tracerlabs — AI development studio</p>
          <h1
            className="mt-4 text-[clamp(2.2rem,4.8vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            We build the AI that runs your business.
          </h1>
          <p className="mt-6 max-w-[34rem] text-[1.1rem] leading-[1.7] text-ink/60">
            We generate the leads and build the systems that turn them into
            revenue — ads, funnels, AI follow-up, and custom software. Designed,
            built, and shipped by one team. Fast.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="#contact" variant="primary">
              Start your project
            </Button>
            <Button href="#tl-projects" variant="secondary">
              See our work
            </Button>
          </div>

          {/* Real proof, in words — replaces the old stock-avatar rating widget */}
          <p className="mt-10 max-w-[32rem] border-t border-ink/10 pt-6 text-[0.95rem] leading-relaxed text-ink/55">
            Real systems in production for solar, roofing, insurance, and food
            businesses — the numbers on the right are live client results, not a
            demo.
          </p>
        </div>

        {/* Right: client telemetry panel — the page's one full-treatment centerpiece:
            gradient edge, permanent underglow, corner brackets. */}
        <div className="relative w-full min-w-0">
          <div aria-hidden className="nt-brackets">
            <span /><span /><span /><span />
          </div>
        <Bevel
          bevel={16}
          border={GLASS_BORDER}
          bg={GLASS_BG}
          className="w-full min-w-0"
          style={{ background: "var(--nt-edge)", filter: "var(--nt-underglow-filter)" }}
        >
          <div className="flex flex-col p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <span className="text-[0.92rem] font-medium text-ink/60" style={{ fontFamily: DISPLAY }}>
                Client telemetry
              </span>
              <span className="flex items-center gap-2 text-[0.8rem] text-ink/45">
                <span className="inline-block h-2 w-2 rounded-full bg-[#056AFC]" aria-hidden />
                production data
              </span>
            </div>

            <div className="pt-5">
              <div
                className="bg-gradient-to-r from-brand-pink to-brand-blue bg-clip-text text-[clamp(3rem,6vw,4.2rem)] font-extrabold leading-none tracking-tight text-transparent"
                style={{ fontFamily: DISPLAY }}
              >
                367
              </div>
              <div className="mt-1.5 text-[0.95rem] text-ink/60">
                solar consultations booked on autopilot
              </div>
            </div>

            <div className="mt-5 text-ink">
              <RateChart compact />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
              {[
                ["94%", "appointment show rate"],
                ["20", "paid bookings in week one — Harbs Farm"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="text-[1.5rem] font-bold tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
                      {v}
                    </span>
                    <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink/55">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Bevel>
        </div>
      </div>
    </section>
  );
}
