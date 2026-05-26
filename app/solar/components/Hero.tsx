import { CTAButton, Eyebrow, Sun, Bolt, Calendar, Phone } from "./primitives";

const FEED = [
  { name: "Jordan M.", town: "Frisco, TX", time: "9:40a", delay: "0.15s" },
  { name: "Priya S.", town: "Mesa, AZ", time: "11:15a", delay: "0.3s" },
  { name: "Dwayne K.", town: "Tampa, FL", time: "1:30p", delay: "0.45s" },
  { name: "The Alvarez Home", town: "Reno, NV", time: "4:05p", delay: "0.6s" },
];

export default function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      {/* Sunrise glow */}
      <div
        aria-hidden
        className="animate-sun pointer-events-none absolute left-1/2 top-[-30%] -z-10 h-[70vh] w-[120vw] -translate-x-1/2 rounded-[50%] blur-[90px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 40%, rgba(245,179,1,0.22), rgba(249,115,22,0.10) 45%, transparent 72%)",
        }}
      />
      {/* horizon line shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-solar/40 to-transparent"
      />
      {/* faint dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(33,26,17,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 25%, #000 35%, transparent 78%)",
        }}
      />

      {/* Minimal top bar (no nav — single-goal funnel) */}
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-lg font-bold tracking-tight text-cream">
          tracer<span className="text-solar">labs</span>
        </span>
        <CTAButton href="#book" className="!px-5 !py-2.5 text-[0.85rem]">
          Book a call
        </CTAButton>
      </div>

      {/* Hero body */}
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-12 px-6 pb-24 pt-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:pb-32">
        <div className="min-w-0">
          <div className="animate-rise" style={{ animationDelay: "0.05s" }}>
            <Eyebrow>For solar company owners</Eyebrow>
          </div>

          <h1
            className="animate-rise font-display mt-6 text-[clamp(2.5rem,5.4vw,4.3rem)] font-semibold leading-[1.02] tracking-tight text-cream"
            style={{ animationDelay: "0.12s" }}
          >
            Solar appointments
            <br />
            on autopilot —{" "}
            <span className="text-gradient">
              without a door-to-door team.
            </span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-[34rem] text-[1.1rem] leading-relaxed text-sand"
            style={{ animationDelay: "0.2s" }}
          >
            We build you a high-converting funnel and an AI agent that books
            qualified homeowners straight onto your calendar — the same system
            quietly filling{" "}
            <span className="font-semibold text-cream">Southern Energy&apos;s</span>{" "}
            pipeline.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.28s" }}
          >
            <CTAButton href="#book">Book your free strategy call</CTAButton>
            <CTAButton href="#how" variant="ghost">
              See how it works
            </CTAButton>
          </div>

          <ul
            className="animate-rise mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[0.9rem] text-sand"
            style={{ animationDelay: "0.34s" }}
          >
            {[
              { icon: Bolt, label: "No door-knocking" },
              { icon: Calendar, label: "Appointments on autopilot" },
              { icon: Sun, label: "Built & managed for you" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-solar" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Live booking feed mock */}
        <div
          className="animate-rise relative mx-auto w-full min-w-0 max-w-[440px] lg:mx-0"
          style={{ animationDelay: "0.22s" }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(55% 55% at 60% 25%, rgba(245,179,1,0.2), transparent 70%), radial-gradient(55% 55% at 30% 85%, rgba(249,115,22,0.14), transparent 70%)",
            }}
          />
          <div className="rounded-2xl border border-line bg-surface/80 p-5 shadow-[0_24px_70px_-26px_rgba(120,72,10,0.28)] backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber to-ember text-[#1a0f02]">
                  <Calendar className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-cream">Today&apos;s booked appointments</p>
                  <p className="text-[0.72rem] text-faint">Auto-booked by your AI agent</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <ul className="mt-5 space-y-2.5">
              {FEED.map((f) => (
                <li
                  key={f.name}
                  className="animate-feed flex items-center gap-3 rounded-xl border border-line bg-base-2/60 px-3.5 py-3"
                  style={{ animationDelay: f.delay }}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-solar/10 text-solar">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-cream">{f.name}</p>
                    <p className="truncate text-[0.72rem] text-faint">
                      Solar consult · {f.town}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-cream">{f.time}</p>
                    <p className="text-[0.66rem] font-semibold uppercase tracking-wide text-emerald-400">
                      Qualified
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <p className="text-[0.78rem] text-sand">Booked this week</p>
              <p className="font-display text-lg font-bold text-cream">
                <span className="text-solar">+</span>18 {/* PLACEHOLDER */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
