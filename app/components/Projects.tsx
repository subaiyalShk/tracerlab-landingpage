// Tracerlabs recent work — third componentized section, sits between <Services/> and
// the legacy contact/footer (MARKUP_BOTTOM). Five real, anonymized projects in an
// alternating feature-row layout (media ⇄ copy). Extends the hero/services design
// language: black canvas, glass, pink→blue brand accents, Duborics titles, animate-rise.
// Video media is lazy + in-view-only via the ProjectVideo client component; everything
// else is a static mockup/image or a styled UI panel. Scoped under #tl-projects.
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
      fit: "contain",
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
      fit: "contain",
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
      fit: "contain",
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

// Styled ops-board motif for the (image-less, anonymized) meat-processing project.
function OpsPanel() {
  const cols = [
    { h: "Drop-off", n: 3 },
    { h: "Processing", n: 2 },
    { h: "Ready", n: 2 },
  ];
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-5 sm:p-7">
      <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/45">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
        Processing board
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {cols.map((c) => (
          <div key={c.h} className="flex flex-col gap-2 rounded-lg border border-white/12 bg-white/[0.03] p-2.5">
            <span className="text-[0.6rem] font-medium text-white/40">{c.h}</span>
            {Array.from({ length: c.n }).map((_, i) => (
              <div key={i} className="rounded-md border border-white/12 bg-white/[0.04] p-2">
                <div className="mb-1.5 h-1.5 w-3/4 rounded-full bg-white/15" />
                <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Frame({ media }: { media: Media }) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/12 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
      style={{
        backgroundImage:
          "radial-gradient(70% 70% at 70% 25%, rgba(231,2,141,0.18), transparent 70%), radial-gradient(70% 70% at 25% 80%, rgba(5,106,252,0.16), transparent 70%), linear-gradient(160deg,#101014,#0a0a0d)",
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
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, transparent 28%)" }} />
    </div>
  );
}

export default function Projects() {
  return (
    <section id="tl-projects" className="font-body relative isolate w-full overflow-hidden bg-black text-ink">
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[45vw] w-[55vw] rounded-full opacity-30 blur-[140px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.30) 0%, rgba(5,106,252,0.16) 45%, transparent 72%)" }}
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        {/* header */}
        <div className="max-w-[44rem]">
          <div className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-2.5 pr-4 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/70">Recent work</span>
          </div>
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
              <article key={p.id} className="animate-rise grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
                {/* media (first in DOM → on top on mobile; reordered on lg for odd rows) */}
                <div className={mediaRight ? "lg:order-2" : ""}>
                  <Frame media={p.media} />
                </div>
                {/* copy */}
                <div className="min-w-0">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-pink/90">{p.client}</div>
                  <h3 className="font-display mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)] font-normal leading-tight tracking-tight">{p.title}</h3>
                  <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-relaxed text-white/55">{p.blurb}</p>

                  {/* metric chips */}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.metrics.map((m) => (
                      <li key={m} className="inline-flex items-center gap-1.5 rounded-full border border-brand-pink/25 bg-brand-pink/[0.07] px-3 py-1 text-[0.78rem] font-medium text-white/80">
                        <span className="h-1 w-1 rounded-full bg-brand-pink" />
                        {m}
                      </li>
                    ))}
                  </ul>

                  {/* tech badges */}
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[0.72rem] font-medium tracking-wide text-white/50">{t}</li>
                    ))}
                  </ul>

                  {/* link */}
                  <a
                    href={p.link.href}
                    {...(p.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group/lk mt-7 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-brand-pink transition-colors hover:text-white"
                  >
                    {p.link.label}
                    <Arrow />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* section CTA → conversion */}
        <p className="animate-rise mt-16 text-[0.98rem] text-white/55">
          Have something like this in mind?{" "}
          <a href="#contact" className="group/lk inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-pink">
            Tell us what you&apos;re building
            <Arrow />
          </a>
        </p>
      </div>
    </section>
  );
}
