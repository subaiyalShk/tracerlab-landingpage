// Closing CTA — the in-browser voice agent is the centerpiece (and a live demo of the
// product). Server component: reads env to decide whether voice is provisioned, and passes
// a boolean + the Cal.com fallback URL to the client widget (no secrets reach the browser).
// Scoped #tl-cta; carries a neutralized #contact anchor so existing #contact links land here.
import VoiceWidget from "./VoiceWidget";

const STEPS = [
  { n: 1, t: "Talk to our AI", d: "A 2-minute voice chat — it asks what you're building." },
  { n: 2, t: "It books your call", d: "Right there on the call, into our calendar." },
  { n: 3, t: "We design & build", d: "Production-grade, shipped fast." },
];

export default function Cta() {
  const voiceEnabled = Boolean(process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID);
  const calcomUrl = process.env.NEXT_PUBLIC_CAL_BOOKING_LINK || "https://cal.com/team/tracerlabs/discovery-call";

  return (
    <section id="tl-cta" className="font-body relative isolate w-full overflow-hidden bg-black text-ink">
      {/* scroll anchor for #contact links (hero CTA, nav) — legacy #contact CSS neutralized in globals.css */}
      <div id="contact" aria-hidden />

      {/* ambient brand glow, centered behind the orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[55vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.40) 0%, rgba(5,106,252,0.22) 45%, transparent 72%)" }}
      />

      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-24 text-center sm:px-10 sm:py-32">
        <div className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-2.5 pr-4 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-pink opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-pink" />
          </span>
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/70">Let&apos;s build</span>
        </div>

        <h2
          className="font-display animate-rise mt-7 text-[clamp(2.1rem,5.5vw,3.6rem)] font-normal uppercase leading-[1.02] tracking-tight"
          style={{ animationDelay: "0.06s" }}
        >
          Ready to put{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>
            AI to work?
          </span>
        </h2>

        <p className="animate-rise mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-white/55" style={{ animationDelay: "0.12s" }}>
          Talk to our AI for two minutes — it&apos;ll learn what you&apos;re building and book your
          call on the spot. Yes, it&apos;s one of ours.
        </p>

        {/* The voice agent */}
        <div className="animate-rise mt-12" style={{ animationDelay: "0.2s" }}>
          <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        </div>

        {/* What happens next */}
        <ol className="animate-rise mt-16 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3" style={{ animationDelay: "0.3s" }}>
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 backdrop-blur-sm">
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[0.8rem] font-bold text-white"
                style={{ backgroundImage: "linear-gradient(135deg,#e7028d,#056afc)" }}
              >
                {s.n}
              </span>
              <h3 className="font-display mt-4 text-[1.05rem] font-normal leading-tight tracking-tight">{s.t}</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-white/50">{s.d}</p>
            </li>
          ))}
        </ol>

        <p className="animate-rise mt-10 text-[0.85rem] text-white/40" style={{ animationDelay: "0.38s" }}>
          <span className="font-semibold text-white/70">300+</span> businesses served · we reply within a day
        </p>
      </div>
    </section>
  );
}
