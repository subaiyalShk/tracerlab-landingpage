// Tracerlabs services — second componentized section, sits between the legacy
// nav/tech-bar (MARKUP_TOP) and the legacy projects/contact (MARKUP_BOTTOM).
// Mobile-first bento that extends the hero's design language (app/components/Hero.tsx):
// black canvas, glass tiles, pink→blue brand gradients, animate-rise entrance.
// Scoped under #tl-services with a reset block in globals.css (mirrors #tl-hero).

type Service = {
  title: string;
  blurb: string;
  badges: string[];
  cta: { label: string; href: string };
  icon: React.ReactNode;
};

const iconCls = "h-6 w-6";

// Inline line icons (stroke = currentColor), rendered white over a brand-gradient tile.
const PhoneIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h3l1.6 4-2 1.5a11 11 0 0 0 5.4 5.4l1.5-2 4 1.6V18a2 2 0 0 1-2.2 2A15 15 0 0 1 3 6.2 2 2 0 0 1 5 4Z" />
    <path d="M15.5 4.5a4 4 0 0 1 4 4M15 8a1.5 1.5 0 0 1 1.5 1.5" />
  </svg>
);
const DeviceIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4" width="14" height="11" rx="1.5" />
    <path d="M2.5 12.5h14M7 19h6M9.5 15.5v3.5" />
    <rect x="17.5" y="9" width="4.5" height="9" rx="1.2" />
  </svg>
);
const TrendIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l5-5 3.5 3.5L20 8" />
    <path d="M15 8h5v5" />
  </svg>
);
const ChipIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" />
    <path d="M10 10.5h4v4h-4z" />
    <path d="M9 3v2.5M15 3v2.5M9 18.5V21M15 18.5V21M3 9h2.5M3 15h2.5M18.5 9H21M18.5 15H21" />
  </svg>
);

const FEATURED: Service & { highlights: string[] } = {
  title: "AI Voice Agents",
  blurb:
    "Voice agents that answer every call, qualify leads, and book appointments — 24/7, in a natural human voice. Never miss another opportunity.",
  highlights: [
    "Picks up in under two rings, day or night",
    "Books straight into your calendar",
    "Sounds human — not a clunky phone tree",
  ],
  badges: ["Retell", "LiveKit", "Twilio"],
  cta: { label: "Hear it live", href: "#projects" },
  icon: PhoneIcon,
};

const SERVICES: Service[] = [
  {
    title: "Web & Mobile Apps",
    blurb: "Custom web & mobile apps, dashboards, and field-sales tools — shipped fast, built to scale.",
    badges: ["Next.js", "React Native", "Supabase"],
    cta: { label: "See the work", href: "#projects" },
    icon: DeviceIcon,
  },
  {
    title: "Sales & Growth Automation",
    blurb: "Lead funnels, CRM automation, and canvassing systems that turn activity into booked revenue.",
    badges: ["n8n", "Make", "Meta CAPI"],
    cta: { label: "See the work", href: "#projects" },
    icon: TrendIcon,
  },
];

const CUSTOM: Service = {
  title: "Custom AI Products & Agents",
  blurb: "Bespoke AI agents and internal tools, tailored to exactly how your business runs.",
  badges: ["OpenAI", "Anthropic", "Vercel"],
  cta: { label: "See the work", href: "#projects" },
  icon: ChipIcon,
};

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_8px_24px_-8px_rgba(231,2,141,0.7)]"
      style={{ backgroundImage: "linear-gradient(135deg,#e7028d,#056afc)" }}
      aria-hidden
    >
      {children}
    </span>
  );
}

function Badges({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((b) => (
        <li
          key={b}
          className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[0.72rem] font-medium tracking-wide text-white/55"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

function Cta({ cta }: { cta: Service["cta"] }) {
  return (
    <a
      href={cta.href}
      className="group/cta mt-6 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand-pink transition-colors hover:text-white"
    >
      {cta.label}
      <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

// Shared glass-tile shell with a hover lift + brand edge-glow.
function Tile({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`group animate-rise relative flex flex-col overflow-hidden rounded-2xl border border-white/12 bg-white/[0.03] p-7 backdrop-blur-sm transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-8 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* edge glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 0%, rgba(231,2,141,0.16), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}

export default function Services() {
  return (
    <section
      id="tl-services"
      className="font-body relative isolate w-full overflow-hidden bg-black text-ink"
    >
      {/* Ambient brand glow — quieter than the hero so it reads as the same world, calmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40vw] w-[70vw] -translate-x-1/2 rounded-full opacity-40 blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(5,106,252,0.35) 0%, rgba(231,2,141,0.18) 45%, transparent 72%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        {/* Header */}
        <div className="max-w-[44rem]">
          <div className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] py-1.5 pl-2.5 pr-4 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/70">
              What we do
            </span>
          </div>
          <h2
            className="font-display animate-rise mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[0.98] tracking-tight"
            style={{ animationDelay: "0.06s" }}
          >
            Four ways we put{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}
            >
              AI to work
            </span>
          </h2>
          <p
            className="animate-rise mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-white/55"
            style={{ animationDelay: "0.12s" }}
          >
            One team, end to end — we design, build, and ship the systems that
            answer your calls, run on your phone, and grow your pipeline.
          </p>
        </div>

        {/* Bento grid — mobile: 1 col stack; sm+: 2-col bento with a featured tile */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {/* Featured — Voice Agents (spans both rows on the left at sm+) */}
          <Tile className="sm:row-span-2 sm:p-9" delay={0.16}>
            <IconTile>{FEATURED.icon}</IconTile>
            <h3 className="font-display mt-6 text-[1.6rem] font-normal leading-tight tracking-tight sm:text-[1.9rem]">
              {FEATURED.title}
            </h3>
            <p className="mt-4 max-w-[26rem] text-[0.98rem] leading-relaxed text-white/55">
              {FEATURED.blurb}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {FEATURED.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[0.92rem] text-white/70">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
            <Badges items={FEATURED.badges} />
            <div className="mt-auto pt-2">
              <Cta cta={FEATURED.cta} />
            </div>
          </Tile>

          {/* Two stacked tiles on the right at sm+ */}
          {SERVICES.map((s, i) => (
            <Tile key={s.title} delay={0.22 + i * 0.06}>
              <IconTile>{s.icon}</IconTile>
              <h3 className="font-display mt-5 text-[1.3rem] font-normal leading-tight tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-white/55">
                {s.blurb}
              </p>
              <Badges items={s.badges} />
              <Cta cta={s.cta} />
            </Tile>
          ))}

          {/* Custom AI — full-width bar across the bottom at sm+ */}
          <Tile className="sm:col-span-2 sm:flex-row sm:items-center sm:gap-7" delay={0.4}>
            <IconTile>{CUSTOM.icon}</IconTile>
            <div className="mt-5 sm:mt-0 sm:flex-1">
              <h3 className="font-display text-[1.3rem] font-normal leading-tight tracking-tight">
                {CUSTOM.title}
              </h3>
              <p className="mt-3 max-w-[44rem] text-[0.95rem] leading-relaxed text-white/55">
                {CUSTOM.blurb}
              </p>
            </div>
            <div className="mt-5 flex flex-col items-start gap-1 sm:mt-0 sm:items-end">
              <Badges items={CUSTOM.badges} />
              <Cta cta={CUSTOM.cta} />
            </div>
          </Tile>
        </div>

        {/* Section CTA → conversion */}
        <p
          className="animate-rise mt-12 text-[0.98rem] text-white/55"
          style={{ animationDelay: "0.46s" }}
        >
          Not sure what you need?{" "}
          <a
            href="#contact"
            className="group/link inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-brand-pink"
          >
            Let&apos;s figure it out together
            <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </p>
      </div>
    </section>
  );
}
