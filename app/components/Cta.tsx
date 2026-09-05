// Closing CTA (Telemetry redesign) — the in-browser voice agent stays the
// centerpiece (it's a live demo of the product), now with a visible direct
// booking link for visitors who won't take a voice call. Server component:
// reads env to decide whether voice is provisioned (no secrets reach the
// browser). Carries the #contact anchor every CTA on the site points at.
import VoiceWidget from "./VoiceWidget";

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
      {/* scroll anchor for #contact links (hero CTA, nav) */}
      <div id="contact" aria-hidden />

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10"><div className="nt-hairline" /></div>
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-20 text-center sm:px-10 sm:py-28 lg:py-36">
        <span aria-hidden className="nt-kicker" style={{ marginLeft: "auto", marginRight: "auto" }} />
        <h2
          className="max-w-[16ch] text-[clamp(2.1rem,4.8vw,3.4rem)] font-extrabold leading-[1.06] tracking-tight text-ink"
          style={{ fontFamily: DISPLAY }}
        >
          Ready to put AI to work?
        </h2>

        <p className="mt-5 max-w-[34rem] text-[1.05rem] leading-[1.7] text-ink/60">
          Talk to our AI for two minutes — it&apos;ll learn what you&apos;re
          building and book your call on the spot. Yes, it&apos;s one of ours.
        </p>

        {/* The voice agent */}
        <div className="mt-10">
          <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        </div>

        {/* Fallback for visitors who won't take a voice call */}
        <p className="mt-6 text-[0.95rem] text-ink/55">
          Rather not talk to an AI?{" "}
          <a
            href={calcomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink/80 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
          >
            Book a call directly
          </a>
        </p>

        {/* What happens next */}
        <ol className="mt-14 grid w-full list-none grid-cols-1 gap-4 p-0 text-left sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="nt-card p-5">
              <span className="text-[0.85rem] font-semibold text-ink/30" style={{ fontFamily: DISPLAY }}>
                {s.n}
              </span>
              <h3 className="mt-3 text-[1.05rem] font-bold leading-tight tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
                {s.t}
              </h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-ink/55">{s.d}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-[0.88rem] text-ink/45">
          We reply within a day.
        </p>
      </div>
    </section>
  );
}
