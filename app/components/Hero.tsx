// Homepage hero — copy only, centered: the typewriter headline IS the hero,
// staged on the grid-floor scene with nothing competing for attention. The
// real client numbers live in the case studies below (/work/*); TelemetryPanel
// and MachinePanel are kept on disk if a side visual is ever wanted back.
// Quiet by design: no auroras/scanlines/particles, no scroll-reveal gating.
import Button from "./Button";
import TypedHeadline from "./TypedHeadline";

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
          maskImage: "radial-gradient(ellipse 85% 70% at 50% 38%, #000 30%, transparent 75%)",
        }}
      />
      {/* The scene: a perspective grid floor receding to a glowing horizon,
          with signal pulses shooting along its lines (offsets = 46px columns) */}
      <div aria-hidden className="nt-horizon -z-10" />
      <div aria-hidden className="nt-gridfloor -z-10">
        <span className="nt-pulse" style={{ left: 230, ["--pulse-dur" as string]: "8s", ["--pulse-delay" as string]: "1.2s" }} />
        <span className="nt-pulse" style={{ left: 598, ["--pulse-dur" as string]: "12s", ["--pulse-delay" as string]: "5s" }} />
        <span className="nt-pulse" style={{ left: 1012, ["--pulse-dur" as string]: "10s", ["--pulse-delay" as string]: "0s" }} />
        <span className="nt-pulse nt-pulse-pink" style={{ left: 1380, ["--pulse-dur" as string]: "17s", ["--pulse-delay" as string]: "7.5s" }} />
      </div>
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-[1280px] items-center justify-center px-6 py-10 sm:px-10 sm:py-12">
        <div className="flex min-w-0 max-w-[52rem] flex-col items-center text-center">
          <p className="animate-rise text-[0.98rem] text-ink/50">Tracerlabs — AI development studio</p>
          <h1
            className="animate-rise mt-5 text-[clamp(2rem,min(4.8vw,7vh),3.9rem)] font-normal uppercase leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-duborics), var(--font-archivo), sans-serif", animationDelay: "0.08s" }}
          >
            <TypedHeadline text="We build the machine that grows your business." />
          </h1>
          <p className="animate-rise mt-6 max-w-[38rem] text-[1.1rem] leading-[1.65] text-ink/60" style={{ animationDelay: "0.18s" }}>
            Ads in, booked jobs out. Funnels, AI follow-up, booking systems,
            and the software to run it all — measured end to end, built and
            run by one team.
          </p>

          <div className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.26s" }}>
            <Button href="#contact" variant="primary" size="lg">
              Book a discovery call
            </Button>
            <Button href="#tl-projects" variant="secondary" size="lg">
              See the case studies
            </Button>
          </div>

          {/* Real proof, in words — replaces the old stock-avatar rating widget */}
          <p className="animate-rise mt-9 max-w-[34rem] border-t border-ink/10 pt-5 text-[0.92rem] leading-relaxed text-ink/55" style={{ animationDelay: "0.36s" }}>
            Solar companies, meat processors, and local service businesses run
            on systems we built. Every number in the case studies below is
            live production data.
          </p>
        </div>
      </div>
    </section>
  );
}
