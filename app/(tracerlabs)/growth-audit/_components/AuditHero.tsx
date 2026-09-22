// Growth Audit hero — the homepage hero's scene (ambient light, dot grid, grid
// floor + horizon + signal pulses) with the funnel's copy, the VSL tile and one CTA.
// Logo only, no nav: a paid-traffic page gives the visitor exactly one thing to do.
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import Vsl from "./Vsl";

export default function AuditHero() {
  return (
    <header id="tl-ga-hero" className="font-body relative isolate w-full overflow-hidden bg-page text-ink">
      {/* Ambient light — plain radial gradients, no blur filters (perf rules) */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -right-[30%] -top-[12%] -z-10 h-[95vw] max-h-[700px] w-[95vw] max-w-[700px] rounded-full"
        style={{ background: "radial-gradient(circle closest-side, var(--nt-ambient-blue) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="animate-drift-slow pointer-events-none absolute -left-[35%] top-[38%] -z-10 h-[80vw] max-h-[600px] w-[80vw] max-w-[600px] rounded-full"
        style={{ background: "radial-gradient(circle closest-side, var(--nt-ambient-pink) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: "radial-gradient(circle, var(--tl-dot-grid) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 30%, #000 30%, transparent 75%)",
        }}
      />
      <div aria-hidden className="nt-horizon -z-10" />
      <div aria-hidden className="nt-gridfloor -z-10">
        <span className="nt-pulse" style={{ left: 230, ["--pulse-dur" as string]: "8s", ["--pulse-delay" as string]: "1.2s" }} />
        <span className="nt-pulse" style={{ left: 598, ["--pulse-dur" as string]: "12s", ["--pulse-delay" as string]: "5s" }} />
        <span className="nt-pulse nt-pulse-pink" style={{ left: 874, ["--pulse-dur" as string]: "14s", ["--pulse-delay" as string]: "3s" }} />
      </div>

      <div className="mx-auto w-full max-w-[600px] px-5 pb-9 pt-5 text-center sm:pb-14 sm:pt-7">
        {/* logo only — not a link; swaps per theme like the site nav */}
        <div className="mb-1.5 flex justify-center">
          <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[74px] w-auto" />
          <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[74px] w-auto" />
        </div>

        <Eyebrow>Ads in. Booked jobs out.</Eyebrow>

        <h1
          className="animate-rise mb-3.5 mt-[18px] text-[clamp(1.85rem,8.2vw,3.6rem)] font-normal uppercase leading-[1.1] tracking-[-0.01em]"
          style={{ fontFamily: "var(--font-duborics), var(--font-archivo), sans-serif", animationDelay: "0.08s" }}
        >
          Stop paying for leads your team never calls back
        </h1>
        <p className="animate-rise mx-auto mb-[22px] max-w-[36rem] text-[1.05rem] leading-[1.65] text-ink/60" style={{ animationDelay: "0.18s" }}>
          We run your ads, then an AI agent texts every lead within minutes and books them on your calendar.
          Built and run by one team, and tracked from ad dollar to booked job.
        </p>

        <Vsl />

        <div className="animate-rise" style={{ animationDelay: "0.34s" }}>
          <Button href="#form-card" variant="primary" size="lg" className="w-full sm:w-auto">
            Get my free Growth Audit
          </Button>
          <p className="mt-3 text-[0.9rem] text-ink/50">Free 30-minute call. No contract, no pitch deck.</p>
        </div>
      </div>
    </header>
  );
}
