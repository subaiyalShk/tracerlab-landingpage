// Closing CTA (Night Telemetry) — the finale, and a bookend to the hero:
// the grid-floor scene returns beneath the conversion moment. The in-browser
// voice agent is the centerpiece (it IS the product), ringed by a faint
// "voice field"; the three steps hang on a gradient thread. A visible
// "Book a call directly" button covers visitors who won't take a voice call.
// Server component: reads env to decide whether voice is provisioned.
import VoiceWidget from "./VoiceWidget";
import Button from "./Button";

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

const STEPS = [
  { n: "1", t: "Talk to our AI", d: "A 2-minute voice chat — it asks what you're building." },
  { n: "2", t: "It books your call", d: "Right there on the call, into our calendar." },
  { n: "3", t: "We design & build", d: "Production-grade, shipped fast." },
];

export default function Cta() {
  const voiceEnabled = Boolean(process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID);
  const calcomUrl = process.env.NEXT_PUBLIC_CAL_BOOKING_LINK || "https://cal.com/team/tracerlabs/discovery-call";

  return (
    <section id="tl-cta" className="font-body relative isolate w-full overflow-hidden bg-page text-ink">
      {/* ambient glow behind the orb — the page's second (and last) ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[46vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ background: "radial-gradient(circle, var(--nt-ambient-pink) 0%, var(--nt-ambient-blue) 50%, transparent 75%)" }}
      />
      {/* the scene returns — closing bookend to the hero's grid floor */}
      <div aria-hidden className="nt-horizon -z-10" />
      <div aria-hidden className="nt-gridfloor -z-10" />

      {/* scroll anchor for #contact links (hero CTA, nav) */}
      <div id="contact" aria-hidden />

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10"><div className="nt-hairline" /></div>
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-20 text-center sm:px-10 sm:py-28 lg:py-36">
        <span aria-hidden className="nt-kicker" style={{ marginLeft: "auto", marginRight: "auto" }} />
        <h2
          className="max-w-[16ch] text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight text-ink"
          style={{ fontFamily: DISPLAY }}
        >
          Ready to put AI to work?
        </h2>

        <p className="mt-5 max-w-[34rem] text-[1.05rem] leading-[1.7] text-ink/60">
          Talk to our AI for two minutes — it&apos;ll learn what you&apos;re
          building and book your call on the spot. Yes, it&apos;s one of ours.
        </p>

        {/* The voice agent, ringed by its field */}
        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[64px] -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[64px] -z-10 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/[0.06]"
          />
          <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        </div>

        {/* Fallback for visitors who won't take a voice call */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-[0.92rem] text-ink/50">Rather not talk to an AI?</p>
          <Button href={calcomUrl} external variant="secondary" size="sm">
            Book a call directly
          </Button>
        </div>

        {/* What happens next — three steps on one thread */}
        <p className="mt-16 self-start text-[0.9rem] font-semibold text-ink/45" style={{ fontFamily: DISPLAY }}>
          What happens next
        </p>
        <div className="relative mt-5 w-full">
          <div aria-hidden className="nt-hairline absolute left-0 right-0 top-[2.6rem] hidden sm:block" />
          <ol className="grid w-full list-none grid-cols-1 gap-4 p-0 text-left sm:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="nt-card relative p-5 pt-6">
                <span
                  aria-hidden
                  className="nt-ghost-num"
                  style={{ fontFamily: DISPLAY, fontSize: "3.2rem" }}
                >
                  {s.n}
                </span>
                <h3
                  className="mt-1 text-[1.05rem] font-bold leading-tight tracking-tight text-ink"
                  style={{ fontFamily: DISPLAY }}
                >
                  {s.t}
                </h3>
                <p className="mt-2 max-w-[15rem] text-[0.88rem] leading-relaxed text-ink/55">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-10 text-[0.88rem] text-ink/45">We reply within a day.</p>
      </div>
    </section>
  );
}
