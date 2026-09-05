// Services — the 4-stage growth pipeline (Telemetry redesign).
// Flat hairline panels instead of glass cards, Archivo headings, real metrics
// as blue figures, content visible by default (no scroll-reveal gating).
// The cards are deliberately a PIPELINE, not a taxonomy: every engagement runs
// the same arc (get leads → engage instantly → take payment → run on software).

type Service = {
  stage: string;
  title: string;
  blurb: string;
  metrics: string[];
  tools: string;
  cta: { label: string; href: string };
  icon: React.ReactNode;
};

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";
const ACCENT = "#056AFC";

const iconCls = "h-6 w-6";

// Inline line icons (stroke = currentColor), plain ink — no metal plates.
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
const BoltIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 4.5 13.5H11L9.5 22 18 10.5h-6.5L13 2Z" />
  </svg>
);
const CalendarIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
    <path d="M8.5 15.5l2.5 2.5 4.5-5" />
  </svg>
);

const FEATURED: Service & { highlights: string[] } = {
  stage: "1",
  title: "Lead Generation",
  blurb:
    "Lead generation is our core offer. We run the ads, build the funnels, and wire up tracking that doesn't lie — you get booked appointments, not click reports.",
  highlights: [
    "Meta & Google campaigns, run end to end",
    "Landing pages & funnels built to convert",
    "Pixel, CAPI & attribution set up properly",
  ],
  metrics: ["360+ solar consults booked", "≈$96 / booked consult"],
  tools: "Meta Ads, Google Ads, GoHighLevel",
  cta: { label: "Read the solar case study", href: "/work/solar-lead-engine" },
  icon: TrendIcon,
};

const SERVICES: Service[] = [
  {
    stage: "2",
    title: "Automated Engagement",
    blurb:
      "AI that handles the whole conversation — it reaches every lead in minutes, finds a time and books it, reschedules by text, nudges your reps before appointments, and keeps customers updated on their order so they never have to call and ask.",
    metrics: ["Lead → consult rate doubled", "94% appointment show rate"],
    tools: "AI SMS agents, voice AI, Twilio",
    cta: { label: "See it in action", href: "/work/solar-lead-engine" },
    icon: BoltIcon,
  },
  {
    stage: "3",
    title: "Online Booking & Payments",
    blurb:
      "Booking flows that turn visitors into paid customers — deposits collected up front, capacity managed automatically, and reminders that recover the ones who almost booked.",
    metrics: ["20 bookings, every deposit paid — week one"],
    tools: "Square, Stripe, Supabase",
    cta: { label: "See Harbs Farm’s system", href: "/work/harbs-farm" },
    icon: CalendarIcon,
  },
];

const CUSTOM: Service = {
  stage: "4",
  title: "Web Apps & Ops Platforms",
  blurb:
    "When off-the-shelf software doesn't fit how you run, we build what does. Harbs Farm runs bookings, cut sheets, payments, and staff boards from one interface — and we're now wiring the scales and machines on the processing line into it, so admins control the entire operation from a single screen.",
  metrics: ["One interface for the whole operation"],
  tools: "Next.js, React Native, Supabase",
  cta: { label: "Explore custom AI agents", href: "/agents" },
  icon: DeviceIcon,
};

function Metrics({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-5 flex list-none flex-col gap-1.5 p-0">
      {items.map((m) => (
        <li key={m} className="text-[0.95rem] font-semibold" style={{ color: ACCENT }}>
          {m}
        </li>
      ))}
    </ul>
  );
}

function CardHead({ s }: { s: Pick<Service, "stage" | "icon" | "title"> }) {
  return (
    <>
      <span aria-hidden className="nt-ghost-num" style={{ fontFamily: DISPLAY }}>
        {s.stage}
      </span>
      <div className="text-ink/45">{s.icon}</div>
      <h3
        className="mt-5 text-[1.35rem] font-bold leading-tight tracking-tight text-ink"
        style={{ fontFamily: DISPLAY }}
      >
        {s.title}
      </h3>
    </>
  );
}

function CardFoot({ s }: { s: Pick<Service, "tools" | "cta"> }) {
  return (
    <>
      <p className="mt-3 text-[0.82rem] text-ink/40">{s.tools}</p>
      <a
        href={s.cta.href}
        className="mt-5 inline-block text-[0.92rem] font-semibold text-ink/70 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
      >
        {s.cta.label}
      </a>
    </>
  );
}

export default function Services() {
  return (
    <section id="tl-services" className="font-body w-full bg-page text-ink">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10"><div className="nt-hairline" /></div>
      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-28 lg:py-36">
        {/* Header */}
        <div className="max-w-[44rem]">
          <p className="text-[0.98rem] text-ink/50">What we do</p>
          <h2
            className="mt-4 text-[clamp(2.1rem,4.6vw,3.3rem)] font-extrabold leading-[1.06] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            One growth system, end to end.
          </h2>
          <p className="mt-5 max-w-[40rem] text-[1.05rem] leading-[1.7] text-ink/60">
            Get leads. Engage them in minutes. Turn them into paid bookings. Run
            it all on software built for how you work. Buy the whole machine or
            start with one stage.
          </p>
          <p className="mt-3 text-[0.9rem] text-ink/45">
            Built for solar, roofing, insurance & local operations.
          </p>
        </div>

        {/* Bento grid — flat hairline panels */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {/* Featured — Lead Generation, stage 1 (spans both rows on the left at sm+) */}
          <div className="nt-card relative flex flex-col p-7 sm:row-span-2 sm:p-8">
            <CardHead s={FEATURED} />
            <p className="mt-4 max-w-[26rem] text-[0.98rem] leading-[1.7] text-ink/60">
              {FEATURED.blurb}
            </p>
            <ul className="mt-6 flex list-none flex-col gap-2.5 p-0">
              {FEATURED.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[0.94rem] text-ink/70">
                  <svg className="mt-1 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
            <Metrics items={FEATURED.metrics} />
            <div className="mt-auto pt-2">
              <CardFoot s={FEATURED} />
            </div>
          </div>

          {/* Two stacked tiles on the right at sm+ — stages 2 & 3 */}
          {SERVICES.map((s) => (
            <div key={s.title} className="nt-card relative flex flex-col p-7 sm:p-8">
              <CardHead s={s} />
              <p className="mt-3 text-[0.95rem] leading-[1.65] text-ink/60">{s.blurb}</p>
              <Metrics items={s.metrics} />
              <div className="mt-auto">
                <CardFoot s={s} />
              </div>
            </div>
          ))}

          {/* Stage 4 — full-width bar across the bottom at sm+ */}
          <div className="nt-card relative p-7 sm:col-span-2 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <div className="sm:flex-1">
                <CardHead s={CUSTOM} />
                <p className="mt-3 max-w-[44rem] text-[0.95rem] leading-[1.65] text-ink/60">
                  {CUSTOM.blurb}
                </p>
              </div>
              <div className="sm:w-64 sm:shrink-0 sm:pt-1">
                <Metrics items={CUSTOM.metrics} />
                <CardFoot s={CUSTOM} />
              </div>
            </div>
          </div>
        </div>

        {/* Section CTA → conversion */}
        <p className="mt-12 text-[0.98rem] text-ink/55">
          Most clients start with lead generation — where it goes from there is up to you.{" "}
          <a
            href="#contact"
            className="font-semibold text-ink/80 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink/60"
          >
            Tell us where you&apos;re at
          </a>
        </p>
      </div>
    </section>
  );
}
