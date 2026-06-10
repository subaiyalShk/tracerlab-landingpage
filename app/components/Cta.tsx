// Closing CTA — the in-browser voice agent is the centerpiece (and a live demo of the
// product). Server component: reads env to decide whether voice is provisioned, and passes
// a boolean + the Cal.com fallback URL to the client widget (no secrets reach the browser).
// Scoped #tl-cta; carries a neutralized #contact anchor so existing #contact links land here.
import VoiceWidget from "./VoiceWidget";
import Bevel, { GLASS_BORDER, GLASS_BG } from "./Bevel";
import Eyebrow from "./Eyebrow";

const STEPS = [
  { n: 1, t: "Talk to our AI", d: "A 2-minute voice chat — it asks what you're building." },
  { n: 2, t: "It books your call", d: "Right there on the call, into our calendar." },
  { n: 3, t: "We design & build", d: "Production-grade, shipped fast." },
];

export default function Cta() {
  const voiceEnabled = Boolean(process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID);
  const calcomUrl = process.env.NEXT_PUBLIC_CAL_BOOKING_LINK || "https://cal.com/team/tracerlabs/discovery-call";

  return (
    <section id="tl-cta" className="font-body relative isolate w-full overflow-hidden bg-page text-ink">
      {/* scroll anchor for #contact links (hero CTA, nav) — legacy #contact CSS neutralized in globals.css */}
      <div id="contact" aria-hidden />

      {/* ambient brand glow, centered behind the orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[52vw] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.28] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />

      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-20 text-center sm:px-10 sm:py-24 lg:py-28">
        <Eyebrow>Let&apos;s build</Eyebrow>

        <h2
          className="font-display animate-rise mt-7 text-[clamp(2.1rem,5.5vw,3.6rem)] font-normal uppercase leading-[1.02] tracking-tight"
          style={{ animationDelay: "0.06s" }}
        >
          Ready to put{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>
            AI to work?
          </span>
        </h2>

        <p className="animate-rise mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-ink/55" style={{ animationDelay: "0.12s" }}>
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
            <li key={s.n}>
              <Bevel bevel={12} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md" className="h-full">
                <div className="p-5">
                  <span
                    className="bv-6 inline-flex h-7 w-7 items-center justify-center text-[0.8rem] font-bold text-[#e9eaef]"
                    style={{
                      backgroundImage: "linear-gradient(145deg, #2b2c33, #16171b)",
                      boxShadow:
                        "inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -2px 3px rgba(0,0,0,0.55), 0 4px 12px -6px rgba(0,0,0,0.6)",
                      textShadow: "0 1px 1px rgba(0,0,0,0.75), 0 -0.5px 0.5px rgba(255,255,255,0.3)",
                    }}
                  >
                    {s.n}
                  </span>
                  <h3 className="font-display mt-4 text-[1.05rem] font-normal leading-tight tracking-tight">{s.t}</h3>
                  <p className="mt-2 text-[0.85rem] leading-relaxed text-ink/50">{s.d}</p>
                </div>
              </Bevel>
            </li>
          ))}
        </ol>

        <p className="animate-rise mt-10 text-[0.85rem] text-ink/40" style={{ animationDelay: "0.38s" }}>
          <span className="font-semibold text-ink/70">300+</span> businesses served · we reply within a day
        </p>
      </div>
    </section>
  );
}
