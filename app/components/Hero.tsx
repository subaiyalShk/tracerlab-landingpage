// Tracerlabs hero — first componentized section of the landing page.
// Tailwind (no preflight) + brand tokens from globals.css. Keeps the legacy
// <canvas id="screen-canvas"> so the existing ScreenAnimation JS (public/legacy/app.js)
// drives the product-screen animation unchanged.
import Button from "./Button";
import Bevel, { GLASS_BORDER, GLASS_BG } from "./Bevel";
import Eyebrow from "./Eyebrow";

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format",
];

const CAPABILITIES = ["Voice agents", "Web & mobile apps", "AI GTM"];

// SVG grain, base64-free data URI — adds film-grain texture over the gradients.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

export default function Hero() {
  return (
    <section
      id="tl-hero"
      className="font-body relative isolate w-full overflow-hidden bg-black text-ink"
    >
      {/* ── Ambient background layers ───────────────────────────────── */}
      {/* Drifting brand auroras */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -top-[20%] -left-[10%] -z-10 h-[55vw] w-[55vw] rounded-full opacity-[0.32] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(231,2,141,0.55) 0%, rgba(231,2,141,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="animate-drift-slow pointer-events-none absolute -right-[12%] top-[18%] -z-10 h-[50vw] w-[50vw] rounded-full opacity-[0.28] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(5,106,252,0.50) 0%, rgba(5,106,252,0) 70%)",
        }}
      />
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 35%, #000 30%, transparent 75%)",
        }}
      />
      {/* Grain + vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1280px] grid-cols-1 items-center gap-14 px-6 py-24 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20">
        {/* Left: copy */}
        <div className="min-w-0 max-w-[42rem]">
          {/* Eyebrow */}
          <Eyebrow style={{ animationDelay: "0.05s" }}>
            Tracerlabs · AI Development Studio
          </Eyebrow>

          {/* Headline */}
          <h1
            className="font-display animate-rise mt-7 text-[clamp(1.9rem,4.4vw,3.5rem)] font-normal uppercase leading-[1.04] tracking-tight"
            style={{ animationDelay: "0.12s" }}
          >
            <span className="block">We build the AI</span>
            <span
              className="animate-shimmer block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg,#e7028d,#9b30ff 35%,#056afc 70%,#e7028d)",
                backgroundSize: "200% auto",
              }}
            >
              that runs
            </span>
            <span className="block">your business.</span>
          </h1>

          {/* Subcopy */}
          <p
            className="animate-rise mt-7 max-w-[34rem] text-[1.05rem] leading-relaxed text-white/55"
            style={{ animationDelay: "0.2s" }}
          >
            From voice agents that answer every call to custom web &amp; mobile
            apps and sales automation — we design, build, and ship
            production-grade AI for growing businesses. Fast.
          </p>

          {/* CTAs */}
          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.28s" }}
          >
            <Button href="#contact" variant="primary">
              Start your project
            </Button>
            <Button href="#projects" variant="secondary">
              See our work
            </Button>
          </div>

          {/* Capability strip */}
          <ul
            className="animate-rise mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8rem] font-medium text-white/45"
            style={{ animationDelay: "0.34s" }}
          >
            {CAPABILITIES.map((c, i) => (
              <li key={c} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-white/25" />}
                <span>{c}</span>
              </li>
            ))}
          </ul>

          {/* Trust row */}
          <div
            className="animate-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/8 pt-7"
            style={{ animationDelay: "0.42s" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex">
                {AVATARS.map((src, i) => (
                  <span
                    key={src}
                    className="h-9 w-9 rounded-full border-2 border-black bg-cover bg-center ring-1 ring-white/15"
                    style={{
                      backgroundImage: `url('${src}')`,
                      marginLeft: i === 0 ? 0 : "-10px",
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-[0.95rem] leading-none text-amber-300">
                  ★★★★★
                </span>
                <span className="mt-1 text-[0.78rem] text-white/45">
                  <span className="font-semibold text-white/80">4.9</span> avg
                  rating
                </span>
              </div>
            </div>
            <div className="h-9 w-px bg-white/10" />
            <p className="text-[0.85rem] text-white/55">
              <span className="font-semibold text-white">300+</span> businesses
              served
            </p>
          </div>
        </div>

        {/* Right: product window framing the canvas animation */}
        <div
          className="animate-rise relative mx-auto w-full min-w-0 max-w-[640px] lg:mx-0"
          style={{ animationDelay: "0.22s" }}
        >
          {/* Glow behind the window */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-[0.45] blur-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 70% 30%, rgba(231,2,141,0.26), transparent 70%), radial-gradient(60% 60% at 20% 80%, rgba(5,106,252,0.22), transparent 70%)",
            }}
          />
          {/* Window — beveled to match the site's angular language */}
          <Bevel
            bevel={18}
            border={GLASS_BORDER}
            bg={GLASS_BG}
            innerClassName="backdrop-blur-md"
            className="shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          >
            {/* Top chrome */}
            <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="h-3 w-3 rounded-full bg-white/15" />
              <span className="ml-3 min-w-0 truncate text-[0.7rem] font-medium tracking-wide text-white/35">
                tracerlabs · live demo
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-widest text-brand-pink/80">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                running
              </span>
            </div>
            {/* Screen — canvas drives the animation. Absolutely positioned so the
                fixed pixel width ScreenAnimation writes onto it can't expand the
                window's intrinsic width. */}
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-black">
              <canvas
                id="screen-canvas"
                suppressHydrationWarning
                className="absolute inset-0 block h-full w-full"
              />
              {/* faint inner reflection */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 30%)",
                }}
              />
            </div>
          </Bevel>
        </div>
      </div>

      {/* Seam fade into the legacy sections below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black"
      />
    </section>
  );
}
