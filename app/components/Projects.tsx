// Tracerlabs recent work — third componentized section, sits between <Services/> and
// the legacy contact/footer (MARKUP_BOTTOM). Five real, anonymized projects in an
// alternating feature-row layout (media ⇄ copy). Extends the hero/services design
// language: black canvas, glass, pink→blue brand accents, Duborics titles, animate-rise.
// Video media is lazy + in-view-only via the ProjectVideo client component; everything
// else is a static mockup/image or a styled UI panel. Scoped under #tl-projects.
import ProjectVideo from "./ProjectVideo";
import Bevel, { GLASS_BORDER, GLASS_BG } from "./Bevel";
import Eyebrow from "./Eyebrow";

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
  tech: string[];
  link: { label: string; href: string; external?: boolean };
  media: Media;
};

const PROJECTS: Project[] = [
  {
    id: "solar",
    client: "A Texas solar company",
    title: "An AI sales engine that books solar consults on autopilot",
    blurb:
      "A high-performing speed-to-lead funnel paired with an AI voice agent that calls every inbound lead within minutes, qualifies them, and books the consultation — so no lead ever goes cold.",
    metrics: ["2 appointments booked / day", "$38 / qualified lead", "calls in minutes"],
    tech: ["Next.js", "Retell", "Twilio", "GoHighLevel"],
    link: { label: "See the live funnel", href: "/solar" },
    media: {
      kind: "video",
      src: "/assets/solar-funnel.mp4",
      poster: "/assets/solar-funnel-poster.jpg",
      fit: "cover",
      label: "Demo reel of the solar lead-gen funnel that books appointments daily.",
    },
  },
  {
    id: "canvassing",
    client: "Our product · Offset Canvassing",
    title: "A GIS canvassing app that turns every door into intelligence",
    blurb:
      "Offset Canvassing gives roofing and door-to-door teams a GIS-style map layered with public homeowner data — plus a companion mobile CRM so reps capture intel in the field, track territory, and never knock the same door twice.",
    metrics: ["GIS + public homeowner data", "Companion mobile CRM", "Built for roofing & D2D"],
    tech: ["Next.js", "React Native", "Google Maps", "Census data", "Supabase"],
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
    id: "meatops",
    client: "A specialty meat-processing facility",
    title: "An operations platform that runs a meat-processing facility end-to-end",
    blurb:
      "A booking wizard for farmers, a kanban processing board for staff, dynamic per-animal pricing, Square payments, and an inbound AI receptionist that answers calls and looks up order status in real time.",
    metrics: ["Booking → cut sheet → payment", "AI receptionist", "Kanban ops board"],
    tech: ["Next.js", "Supabase", "Square", "Retell"],
    link: { label: "Build one for your business", href: "#contact" },
    media: { kind: "panel" },
  },
  {
    id: "fitness",
    client: "Our product",
    title: "An AI coach that builds martial-arts training and meal plans",
    blurb:
      "A cross-platform fitness app where an AI “sensei” generates personalized workouts, nutrition guidance, and grocery lists — kitchen to gym, on iOS, Android, and web.",
    metrics: ["Personalized AI coach", "iOS · Android · Web", "Auto meal plans"],
    tech: ["Flutter", "React", "Gemini", "Supabase"],
    link: { label: "See it live", href: "https://beastmode.tracerlabs.io/", external: true },
    media: { kind: "image", src: "/assets/project2.png", alt: "AI fitness app on phone and laptop.", fit: "contain" },
  },
  {
    id: "aivideo",
    client: "For DTC & local brands",
    title: "Cinematic video ads, generated with AI",
    blurb:
      "We script, generate, and render scroll-stopping video ads with a Remotion + fal.ai pipeline — full campaigns shipped in days, not weeks, for a fraction of a traditional production crew.",
    metrics: ["Remotion + fal.ai", "Campaigns in days", "10+ reels shipped"],
    tech: ["Remotion", "fal.ai", "Next.js"],
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

function Arrow() {
  return (
    <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover/lk:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Portrait mobile-ops-list motif for the (image-less, anonymized) meat-processing project.
// Reads like the staff app: a vertical list of orders with status pills — fits the 9:16 card.
function OpsPanel() {
  const STATUS = {
    drop: { label: "Drop-off", color: "#8a8a93" },
    proc: { label: "Processing", color: "#e7028d" },
    ready: { label: "Ready", color: "#056afc" },
  } as const;
  const orders: (keyof typeof STATUS)[] = ["ready", "proc", "proc", "drop", "ready", "drop", "proc"];
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
          Processing board
        </span>
        <span className="text-[0.55rem] font-medium uppercase tracking-wide text-white/30">Today</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        {orders.map((k, i) => {
          const s = STATUS[k];
          return (
            <div key={i} className="bv-6 flex items-center gap-2.5 bg-white/[0.045] p-2.5">
              <span className="bv-6 h-7 w-7 shrink-0 bg-white/[0.09]" />
              <div className="min-w-0 flex-1">
                <div className="h-1.5 w-3/4 rounded-full bg-white/18" />
                <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/10" />
              </div>
              <span
                className="bv-6 shrink-0 px-2 py-0.5 text-[0.55rem] font-semibold"
                style={{ color: s.color, backgroundColor: `${s.color}22` }}
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

const FRAME_CLIP =
  "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))";

// Beveled media panel: outer = border edge, inner (inset-px) = fill + media, both chamfered.
function Frame({ media }: { media: Media }) {
  return (
    <div
      className="relative aspect-[9/16] w-full shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
      style={{ clipPath: FRAME_CLIP, backgroundColor: GLASS_BORDER }}
    >
      <div
        className="absolute inset-px overflow-hidden"
        style={{
          clipPath: FRAME_CLIP,
          backgroundImage:
            "radial-gradient(80% 60% at 70% 20%, rgba(255,255,255,0.05), transparent 70%), linear-gradient(160deg,#121216,#0a0a0d)",
        }}
      >
        {media.kind === "video" && (
          <ProjectVideo src={media.src} poster={media.poster} label={media.label} fit={media.fit} />
        )}
        {media.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.src}
            alt={media.alt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full ${media.fit === "contain" ? "object-contain p-6" : "object-cover"}`}
          />
        )}
        {media.kind === "panel" && <OpsPanel />}
        {/* inner top sheen */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 28%)" }} />
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="tl-projects" className="font-body relative isolate w-full overflow-hidden bg-black text-ink">
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[42vw] w-[50vw] rounded-full opacity-[0.13] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.28) 0%, rgba(5,106,252,0.14) 45%, transparent 72%)" }}
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        {/* header */}
        <div className="max-w-[44rem]">
          <Eyebrow>Recent work</Eyebrow>
          <h2 className="font-display animate-rise mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight" style={{ animationDelay: "0.06s" }}>
            Work we&apos;ve{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>shipped</span>
          </h2>
          <p className="animate-rise mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-white/55" style={{ animationDelay: "0.12s" }}>
            Real products in production — voice agents, field-sales platforms, operations software, and AI video. A sample of what we&apos;ve built for the businesses we work with.
          </p>
        </div>

        {/* alternating rows */}
        <div className="mt-14 flex flex-col gap-16 sm:gap-20 lg:gap-24">
          {PROJECTS.map((p, i) => {
            const mediaRight = i % 2 === 1; // alternate sides on lg
            return (
              <article
                key={p.id}
                className={`animate-rise flex flex-col gap-9 lg:flex-row lg:items-stretch lg:gap-14 ${mediaRight ? "lg:flex-row-reverse" : ""}`}
              >
                {/* media — full width on mobile (tall 9:16 reel), phone-width on lg.
                    With flex-row(-reverse) + default justify, the slack falls to the outer edge,
                    so each media+copy cluster sits toward the inner side (alternating). */}
                <div className="w-full lg:w-[20rem] lg:shrink-0">
                  <Frame media={p.media} />
                </div>
                {/* copy — carded in the same dark-glass Bevel as the Services tiles, so each
                    row reads as two matching panels (media frame + copy card) instead of
                    panel-plus-loose-text. Stretches to the media height for an even row. */}
                <Bevel
                  bevel={16}
                  border={GLASS_BORDER}
                  bg={GLASS_BG}
                  innerClassName="backdrop-blur-md"
                  className="w-full min-w-0 lg:flex-1"
                >
                  <div className="flex h-full flex-col justify-center p-7 sm:p-10">
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/40">{p.client}</div>
                    <h3 className="font-display mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)] font-normal leading-tight tracking-tight">{p.title}</h3>
                    <p className="mt-4 text-[0.98rem] leading-relaxed text-white/55 lg:max-w-[42rem]">{p.blurb}</p>

                    {/* metric chips — neutral beveled glass (restraint: accent lives at focal points, not here) */}
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {p.metrics.map((m) => (
                        <li key={m} className="bv-6 inline-flex items-center bg-white/[0.06] px-3 py-1 text-[0.78rem] font-medium text-white/80">
                          {m}
                        </li>
                      ))}
                    </ul>

                    {/* tech badges */}
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <li key={t} className="bv-6 bg-white/[0.045] px-3 py-1 text-[0.72rem] font-medium tracking-wide text-white/50">{t}</li>
                      ))}
                    </ul>

                    {/* link */}
                    <a
                      href={p.link.href}
                      {...(p.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group/lk mt-7 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-white/70 transition-colors hover:text-white"
                    >
                      {p.link.label}
                      <Arrow />
                    </a>
                  </div>
                </Bevel>
              </article>
            );
          })}
        </div>

        {/* section CTA → conversion */}
        <p className="animate-rise mt-16 text-[0.98rem] text-white/55">
          Have something like this in mind?{" "}
          <a href="#contact" className="group/lk inline-flex items-center gap-1.5 font-semibold text-white/80 transition-colors hover:text-white">
            Tell us what you&apos;re building
            <Arrow />
          </a>
        </p>
      </div>
    </section>
  );
}
