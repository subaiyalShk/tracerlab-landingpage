// Recent work (Telemetry redesign) — two tiers: client case studies (each
// links to its full write-up) and our own products & experiments. Media frames
// (9:16 reels) stay; the copy side is flat editorial — Archivo titles, blue
// metric figures, hairlines, no glass, no scroll-reveal gating.
import Image from "next/image";
import ProjectVideo from "./ProjectVideo";

type Media =
  | { kind: "video"; src: string; poster: string; fit?: "cover" | "contain"; label: string }
  | { kind: "image"; src: string; alt: string; fit?: "cover" | "contain" }
  | { kind: "panel" };

type Project = {
  id: string;
  client: string;
  title: string;
  blurb: string;
  metrics: string[];
  tech: string;
  link: { label: string; href: string; external?: boolean };
  media: Media;
};

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";
const ACCENT = "#056AFC";

const CASE_STUDIES: Project[] = [
  {
    id: "solar",
    client: "A Texas solar company",
    title: "An AI sales engine that books solar consults on autopilot",
    blurb:
      "A verified-leads funnel paired with an AI texting agent that reaches every lead within minutes and books the consultation — plus a confirmation agent that reminds and reschedules so appointments actually happen. Fake numbers blocked at the door, calendar full.",
    metrics: ["367 consults booked", "Lead → consult rate doubled", "94% show rate"],
    tech: "Next.js, Retell, Twilio, GoHighLevel",
    link: { label: "Read the full case study", href: "/work/solar-lead-engine" },
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
      "We took a farm running on phone calls and paper fully online: a booking wizard for farmers, deposits through Square, a kanban processing board for staff, capacity the owner controls from a calendar — plus the ad campaigns and reminder ladders that fill it.",
    metrics: ["20 bookings, every deposit paid — week 1 of ads", "1 in 8 Google visitors books"],
    tech: "Next.js, Supabase, Square, Meta Ads",
    link: { label: "Read the full case study", href: "/work/harbs-farm" },
    media: { kind: "panel" },
  },
];

const PRODUCTS: Project[] = [
  {
    id: "canvassing",
    client: "Our product — Offset Canvassing",
    title: "A GIS canvassing app that turns every door into intelligence",
    blurb:
      "Offset Canvassing gives roofing and door-to-door teams a GIS-style map layered with public homeowner data — plus a companion mobile CRM so reps capture intel in the field, track territory, and never knock the same door twice.",
    metrics: ["GIS + public homeowner data", "Companion mobile CRM"],
    tech: "Next.js, React Native, Google Maps, Supabase",
    link: { label: "See the live page", href: "https://offset-canvassing.vercel.app/", external: true },
    media: {
      kind: "video",
      src: "/assets/offset-canvassing.mp4",
      poster: "/assets/offset-canvassing-poster.jpg",
      fit: "cover",
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
    media: { kind: "image", src: "/assets/project2.png", alt: "AI fitness app on phone and laptop.", fit: "contain" },
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
    media: {
      kind: "video",
      src: "/assets/reel-aivideo.mp4",
      poster: "/assets/reel-aivideo-poster.jpg",
      fit: "cover",
      label: "AI-generated cinematic car advertisement reel.",
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

      {/* mini stat row */}
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

      {/* progress bar */}
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
                className="shrink-0 px-2 py-0.5 text-[0.55rem] font-semibold"
                style={{ color: s.color, backgroundColor: s.bg }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Media panel — plain hairline frame; the 9:16 reel is the content.
function Frame({ media }: { media: Media }) {
  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden border border-ink/10 bg-[#0b0b0f] transition-shadow duration-300 hover:shadow-[var(--nt-underglow)]">
      {media.kind === "video" && (
        <ProjectVideo src={media.src} poster={media.poster} label={media.label} fit={media.fit} />
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
    </div>
  );
}

function Row({ p, mediaRight }: { p: Project; mediaRight: boolean }) {
  return (
    <article
      id={`work-${p.id}`}
      className={`scroll-mt-24 flex flex-col gap-8 border-t border-ink/10 pt-12 lg:flex-row lg:gap-14 ${mediaRight ? "lg:flex-row-reverse" : ""}`}
    >
      <div className="w-full lg:w-[19rem] lg:shrink-0">
        <Frame media={p.media} />
      </div>
      <div className="w-full min-w-0 lg:flex-1 lg:self-center">
        <p className="text-[0.9rem] text-ink/50">{p.client}</p>
        <h3
          className="mt-2 max-w-[26ch] text-[clamp(1.4rem,2.4vw,1.85rem)] font-bold leading-[1.15] tracking-tight text-ink"
          style={{ fontFamily: DISPLAY }}
        >
          {p.title}
        </h3>
        <p className="mt-4 max-w-[40rem] text-[0.98rem] leading-[1.7] text-ink/60">{p.blurb}</p>

        <ul className="mt-5 flex list-none flex-col gap-1.5 p-0">
          {p.metrics.map((m) => (
            <li key={m} className="text-[0.95rem] font-semibold" style={{ color: ACCENT }}>
              {m}
            </li>
          ))}
        </ul>

        <p className="mt-3 text-[0.82rem] text-ink/40">{p.tech}</p>

        <a
          href={p.link.href}
          {...(p.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-6 inline-block text-[0.95rem] font-semibold text-ink/75 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
        >
          {p.link.label}
        </a>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="tl-projects" className="font-body w-full bg-page text-ink">
      {/* scroll anchor: legacy/service links point at #projects (section id is tl-projects) */}
      <div id="projects" aria-hidden />
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10"><div className="nt-hairline" /></div>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        {/* header */}
        <div className="max-w-[44rem]">
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

        {[
          { label: "Client case studies", items: CASE_STUDIES, offset: 0 },
          { label: "Our products & experiments", items: PRODUCTS, offset: CASE_STUDIES.length },
        ].map((tier) => (
          <div key={tier.label}>
            <p className="mt-14 text-[0.9rem] font-semibold text-ink/45" style={{ fontFamily: DISPLAY }}>
              {tier.label}
            </p>
            <div className="mt-6 flex flex-col gap-12">
              {tier.items.map((p, idx) => (
                <Row key={p.id} p={p} mediaRight={(idx + tier.offset) % 2 === 1} />
              ))}
            </div>
          </div>
        ))}

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
