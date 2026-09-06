// Recent work (Night Telemetry) — two tiers with deliberate hierarchy:
// client case studies are SPOTLIGHT glass panels (product-window media chrome,
// big telemetry figures, a real button), products & experiments stay quiet
// editorial rows beneath. No scroll-reveal gating.
import Image from "next/image";
import ProjectVideo from "./ProjectVideo";
import Button from "./Button";
import Card from "./Card";

type Media =
  | { kind: "video"; src: string; poster: string; fit?: "cover" | "contain"; label: string; hasAudio?: boolean }
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "contain" }
  | { kind: "panel" };

type Figure = { v: string; l: string };

type CaseStudy = {
  id: string;
  client: string;
  title: string;
  blurb: string;
  figures: Figure[];
  tech: string;
  href: string;
  chrome: string;
  media: Media;
};

type Product = {
  id: string;
  client: string;
  title: string;
  blurb: string;
  metrics: string[];
  tech: string;
  link: { label: string; href: string; external?: boolean };
  chrome: string;
  media: Media;
};

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";
const ACCENT = "var(--tl-accent-text)";

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "solar",
    client: "A Texas solar company",
    title: "An AI sales engine that books solar consults on autopilot",
    blurb:
      "A verified-leads funnel paired with an AI texting agent that reaches every lead within minutes and books the consultation — plus a confirmation agent that reminds and reschedules so appointments actually happen.",
    figures: [
      { v: "367", l: "consults booked" },
      { v: "2×", l: "lead → consult rate" },
      { v: "94%", l: "show rate" },
    ],
    tech: "Next.js, Retell, Twilio, GoHighLevel",
    href: "/work/solar-lead-engine",
    chrome: "solar lead engine — live",
    media: {
      kind: "video",
      src: "/assets/solar-funnel.mp4",
      poster: "/assets/solar-funnel-poster.jpg",
      fit: "cover",
      label: "Demo reel of the solar lead-gen funnel that books appointments daily.",
    },
  },
  {
    id: "meatops",
    client: "Harbs Farm — meat processing, New York",
    title: "The platform that runs Harbs Farm end-to-end",
    blurb:
      "We took a farm running on phone calls and paper fully online: a booking wizard for farmers, deposits through Square, a kanban board for staff, owner-controlled capacity — plus the ad campaigns and reminder ladders that fill it.",
    figures: [
      { v: "20", l: "bookings, week one" },
      { v: "100%", l: "deposits paid" },
      { v: "1 in 8", l: "visitors book" },
    ],
    tech: "Next.js, Supabase, Square, Meta Ads",
    href: "/work/harbs-farm",
    chrome: "harbsfarm.com — production",
    media: {
      kind: "video",
      src: "/assets/harbs-demo.mp4",
      poster: "/assets/harbs-demo-poster.jpg",
      fit: "cover",
      label: "Demo video of the Harbs Farm booking and operations platform.",
      hasAudio: true,
    },
  },
];

const PRODUCTS: Product[] = [
  {
    id: "canvassing",
    client: "Our product — Offset Canvassing",
    title: "A GIS canvassing app that turns every door into intelligence",
    blurb:
      "A GIS-style map layered with public homeowner data — plus a companion mobile CRM so reps capture intel in the field, track territory, and never knock the same door twice.",
    metrics: ["GIS + public homeowner data", "Companion mobile CRM"],
    tech: "Next.js, React Native, Google Maps, Supabase",
    link: { label: "See the live page", href: "https://offset-canvassing.vercel.app/", external: true },
    chrome: "offset-canvassing — demo",
    media: {
      kind: "video",
      src: "/assets/offset-canvassing.mp4",
      poster: "/assets/offset-canvassing-poster.jpg",
      // contain: the wide card's media column is 9:16 minus the chrome bar,
      // so contain costs only ~10px side bars and never cuts the frame.
      fit: "contain",
      label: "Demo reel of the Offset Canvassing GIS app and companion mobile CRM for door-to-door teams.",
    },
  },
  {
    id: "fitness",
    client: "Our product",
    title: "An AI coach that builds martial-arts training and meal plans",
    blurb:
      "A cross-platform fitness app where an AI “sensei” generates personalized workouts, nutrition guidance, and grocery lists — kitchen to gym, on iOS, Android, and web.",
    metrics: ["Personalized AI coach", "iOS, Android & web"],
    tech: "Flutter, React, Gemini, Supabase",
    link: { label: "See it live", href: "https://beastmode.tracerlabs.io/", external: true },
    chrome: "beastmode.tracerlabs.io",
    media: {
      kind: "video",
      src: "/assets/reel-beastmode.mp4",
      poster: "/assets/reel-beastmode-poster.jpg",
      fit: "cover",
      label: "Cinematic training reel for the BeastMode AI fitness coach.",
      hasAudio: true,
    },
  },
  {
    id: "aivideo",
    client: "For DTC & local brands",
    title: "Cinematic video ads, generated with AI",
    blurb:
      "We script, generate, and render scroll-stopping video ads with a Remotion + fal.ai pipeline — full campaigns shipped in days, not weeks, for a fraction of a traditional production crew.",
    metrics: ["Campaigns in days", "10+ reels shipped"],
    tech: "Remotion, fal.ai, Next.js",
    link: { label: "Get a reel for your brand", href: "#contact" },
    chrome: "ai-video reel",
    media: {
      kind: "video",
      src: "/assets/reel-aivideo.mp4",
      poster: "/assets/reel-aivideo-poster.jpg",
      fit: "cover",
      label: "AI-generated cinematic car advertisement reel.",
      hasAudio: true,
    },
  },
];

// Kanban-style ops board rendering for the Harbs Farm platform.
function OpsPanel() {
  const STATUS = {
    drop: { label: "Drop-off", color: "#8a8a93", bg: "rgba(138,138,147,0.15)" },
    proc: { label: "Processing", color: "#e7028d", bg: "rgba(231,2,141,0.12)" },
    ready: { label: "Ready", color: "#056afc", bg: "rgba(5,106,252,0.12)" },
  } as const;
  const orders: (keyof typeof STATUS)[] = ["ready", "proc", "proc", "drop", "ready", "drop", "proc"];
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-semibold text-white/55" style={{ fontFamily: DISPLAY }}>
          Processing board
        </span>
        <span className="text-[0.6rem] font-medium text-white/30">Today</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: "24", l: "Active" },
          { v: "8", l: "Ready" },
          { v: "3", l: "Issues" },
        ].map((s) => (
          <div key={s.l} className="flex flex-col items-center bg-white/[0.045] py-2">
            <span className="text-[0.95rem] font-bold text-white/80">{s.v}</span>
            <span className="text-[0.55rem] text-white/35">{s.l}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full w-[68%] rounded-full" style={{ backgroundColor: "#056afc" }} />
        </div>
        <span className="text-[0.55rem] font-semibold text-white/50">68%</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        {orders.map((k, i) => {
          const s = STATUS[k];
          return (
            <div key={i} className="flex items-center gap-2.5 bg-white/[0.04] p-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-white/[0.08]">
                <svg className="h-3.5 w-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
                <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/10" />
              </div>
              <span
                className="flex shrink-0 items-center gap-1.5 px-2 py-0.5 text-[0.55rem] font-semibold text-white/65"
                style={{ backgroundColor: s.bg }}
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MediaBody({ media }: { media: Media }) {
  return (
    <>
      {media.kind === "video" && (
        <ProjectVideo src={media.src} poster={media.poster} label={media.label} fit={media.fit} hasAudio={media.hasAudio} />
      )}
      {media.kind === "image" && (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 20rem"
          className={`object-${media.fit === "contain" ? "contain p-6" : "cover"}`}
          loading="lazy"
        />
      )}
      {media.kind === "panel" && <OpsPanel />}
    </>
  );
}

// Product-window media frame: slim chrome bar (dots + label), 9:16 body,
// hover glow. The media reads as a running application, not a picture.
function MediaChrome({
  media,
  chrome,
  aspect = "aspect-[9/16]",
  frameless = false,
  fill = false,
  className = "",
}: {
  media: Media;
  chrome: string;
  aspect?: string;
  frameless?: boolean;
  // fill: the media body soaks up whatever height the frame is given (chrome
  // bar stays fixed); the aspect ratio still sizes the body on small screens
  // where the frame has no imposed height. Pair with a className that sets the
  // frame's height ("h-full" in a grid cell, "flex-1" in a flex column).
  fill?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${
        frameless
          ? "overflow-hidden bg-[#0b0b0f]"
          : "overflow-hidden border border-ink/15 bg-[#0b0b0f] transition-shadow duration-300 hover:shadow-[var(--nt-underglow)]"
      }${fill ? " flex flex-col" : ""} ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 min-w-0 truncate text-[0.68rem] font-medium tracking-wide text-white/35">
          {chrome}
        </span>
        <span aria-hidden className="ml-auto flex shrink-0 items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#056afc]" />
        </span>
      </div>
      <div className={`relative w-full ${fill ? `${aspect} lg:aspect-auto lg:flex-1` : aspect}`}>
        <MediaBody media={media} />
      </div>
    </div>
  );
}

// Spotlight panel for a client case study — the loud tier.
function CaseCard({ cs, mediaRight }: { cs: CaseStudy; mediaRight: boolean }) {
  return (
    <article id={`work-${cs.id}`} className="scroll-mt-24">
      <Card bevel={16} contentClassName="h-full">
      {/* media bleeds flush to the card border (full column height); only the
          copy column carries the padding */}
      <div
        className={`grid h-full grid-cols-1 ${
          mediaRight ? "lg:grid-cols-[1fr_minmax(0,19rem)]" : "lg:grid-cols-[minmax(0,19rem)_1fr]"
        }`}
      >
        <div className={mediaRight ? "lg:order-2" : ""}>
          <MediaChrome media={cs.media} chrome={cs.chrome} frameless fill className="h-full" />
        </div>
        <div className={`min-w-0 p-6 sm:p-8 lg:p-10 ${mediaRight ? "lg:order-1" : ""}`}>
          <p className="text-[0.9rem] text-ink/50">{cs.client}</p>
          <h3
            className="mt-2 max-w-[24ch] text-[clamp(1.6rem,2.8vw,2.2rem)] font-extrabold leading-[1.12] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            {cs.title}
          </h3>
          <p className="mt-4 max-w-[40rem] text-[1rem] leading-[1.7] text-ink/60">{cs.blurb}</p>

          {/* telemetry figures */}
          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-5 border-t border-ink/10 pt-6">
            {cs.figures.map((f) => (
              <div key={f.l}>
                <dt className="sr-only">{f.l}</dt>
                <dd>
                  <span
                    className="nt-figure block text-[1.9rem] font-extrabold leading-none tracking-tight"
                    style={{ fontFamily: DISPLAY, color: ACCENT }}
                  >
                    {f.v}
                  </span>
                  <span className="mt-1.5 block text-[0.85rem] text-ink/55">{f.l}</span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-[0.82rem] text-ink/40">{cs.tech}</p>

          <div className="relative z-10 mt-6">
            <Button href={cs.href} variant="secondary">
              Read the full case study
            </Button>
          </div>
        </div>
      </div>
      {/* stretched overlay — whole card opens the case study (the visible
          Button carries the accessible name; this is pointer convenience) */}
      <a href={cs.href} aria-hidden tabIndex={-1} className="absolute inset-0" />
      </Card>
    </article>
  );
}

// Wide feature tile — case-card layout for a product: portrait media column
// (fills the card height, same mechanism as CaseCard) beside the copy. Used
// for the canvassing reel, whose 9:16 footage was unwatchable when stretched
// across a full bento column.
function ProductCardWide({ p }: { p: Product }) {
  return (
    <article id={`work-${p.id}`} className="scroll-mt-24">
      <Card bevel={12} contentClassName="h-full">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[auto_1fr]">
          {/* the media column's WIDTH derives from the card's height at 9:16,
              so the portrait reel displays essentially uncropped */}
          <div className="lg:aspect-[9/16] lg:h-full">
            <MediaChrome media={p.media} chrome={p.chrome} frameless fill className="h-full" />
          </div>
          <div className="flex min-w-0 flex-col p-6 sm:p-8">
            <p className="text-[0.85rem] text-ink/50">{p.client}</p>
            <h3
              className="mt-1.5 text-[1.35rem] font-bold leading-[1.25] tracking-tight text-ink"
              style={{ fontFamily: DISPLAY }}
            >
              {p.title}
            </h3>
            <p className="mt-3 max-w-[40rem] text-[0.95rem] leading-[1.65] text-ink/60">{p.blurb}</p>
            <ul className="mt-4 flex list-none flex-col gap-1 p-0">
              {p.metrics.map((m) => (
                <li key={m} className="text-[0.88rem] font-semibold" style={{ color: ACCENT }}>
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-2.5 text-[0.78rem] text-ink/40">{p.tech}</p>
            <a
              href={p.link.href}
              {...(p.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-auto inline-block pt-5 text-[0.92rem] font-semibold text-ink/75 underline decoration-ink/25 underline-offset-4 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-ink hover:decoration-ink/60"
            >
              {p.link.label}
            </a>
          </div>
        </div>
      </Card>
    </article>
  );
}

// Bento tile for a product — media up top (wide crop), copy below, link
// pinned to the card's foot so the grid stays flush. `fillMedia` lets the
// media soak up any surplus height the grid hands the card (the tall feature
// tile), so a stretched card never shows dead space under the copy.
function ProductCard({
  p,
  aspect = "aspect-[16/10]",
  fillMedia = false,
}: {
  p: Product;
  aspect?: string;
  fillMedia?: boolean;
}) {
  return (
    <article id={`work-${p.id}`} className="h-full scroll-mt-24">
      <Card bevel={12} className="h-full" contentClassName="h-full">
        <MediaChrome
          media={p.media}
          chrome={p.chrome}
          aspect={aspect}
          frameless
          fill={fillMedia}
          className={fillMedia ? "min-h-0 lg:flex-1" : ""}
        />
        <div className={`flex flex-col p-6 ${fillMedia ? "" : "flex-1"}`}>
          <p className="text-[0.85rem] text-ink/50">{p.client}</p>
          <h3
            className="mt-1.5 text-[1.15rem] font-bold leading-[1.25] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            {p.title}
          </h3>
          <p className="mt-3 text-[0.92rem] leading-[1.65] text-ink/60">{p.blurb}</p>
          <ul className="mt-4 flex list-none flex-col gap-1 p-0">
            {p.metrics.map((m) => (
              <li key={m} className="text-[0.88rem] font-semibold" style={{ color: ACCENT }}>
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[0.78rem] text-ink/40">{p.tech}</p>
          <a
            href={p.link.href}
            {...(p.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-auto inline-block pt-5 text-[0.92rem] font-semibold text-ink/75 underline decoration-ink/25 underline-offset-4 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-ink hover:decoration-ink/60"
          >
            {p.link.label}
          </a>
        </div>
      </Card>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="tl-projects" className="font-body relative isolate w-full overflow-hidden bg-page text-ink">
      {/* ambient color field — gives the frosted spotlight panels something to blur */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[10%] top-[10%] -z-10 h-[44vw] w-[44vw] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--nt-ambient-pink) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[12%] top-[42%] -z-10 h-[46vw] w-[46vw] rounded-full blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--nt-ambient-blue) 0%, transparent 70%)" }}
      />
      {/* scroll anchor: legacy/service links point at #projects (section id is tl-projects) */}
      <div id="projects" aria-hidden />
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10"><div className="nt-hairline" /></div>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        {/* header */}
        <div className="max-w-[44rem]">
          <span aria-hidden className="nt-kicker" />
          <p className="text-[0.98rem] text-ink/50">Recent work</p>
          <h2
            className="mt-4 text-[clamp(2.1rem,4.6vw,3.3rem)] font-extrabold leading-[1.06] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            Work we&apos;ve shipped.
          </h2>
          <p className="mt-5 max-w-[40rem] text-[1.05rem] leading-[1.7] text-ink/60">
            Real products in production — funnels, AI agents, field-sales
            platforms, operations software, and AI video.
          </p>
        </div>

        {/* Tier 1 — spotlight case studies */}
        <p className="mt-14 text-[0.9rem] font-semibold text-ink/45" style={{ fontFamily: DISPLAY }}>
          Client case studies
        </p>
        <div className="mt-6 flex flex-col gap-8">
          {CASE_STUDIES.map((cs, i) => (
            <CaseCard key={cs.id} cs={cs} mediaRight={i % 2 === 1} />
          ))}
        </div>

        {/* Portfolio strip — breadth beyond the two spotlights, kept quiet */}
        <p className="mt-6 text-[0.9rem] leading-relaxed text-ink/45">
          Also in production across the portfolio: more solar lead funnels,
          live analytics dashboards, and AI SMS agents. Next build: a DTC
          meat-delivery storefront.
        </p>

        {/* Tier 2 — products & experiments */}
        <p className="mt-16 text-[0.9rem] font-semibold text-ink/45" style={{ fontFamily: DISPLAY }}>
          Our products &amp; experiments
        </p>
        <div className="mt-6 flex flex-col gap-4 lg:gap-5">
          {/* wide feature — the canvassing reel in a case-card layout, so the
              9:16 footage keeps sane proportions instead of filling a column */}
          <ProductCardWide p={PRODUCTS[0]} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            <ProductCard p={PRODUCTS[1]} />
            <ProductCard p={PRODUCTS[2]} />
          </div>
        </div>

        {/* section CTA → conversion */}
        <p className="mt-16 text-[0.98rem] text-ink/55">
          Have something like this in mind?{" "}
          <a
            href="#contact"
            className="font-semibold text-ink/80 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
          >
            Tell us what you&apos;re building
          </a>
        </p>
      </div>
    </section>
  );
}
