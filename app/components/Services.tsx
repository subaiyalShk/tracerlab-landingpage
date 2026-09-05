// Tracerlabs services — second componentized section, sits between the legacy
// nav/tech-bar (MARKUP_TOP) and the legacy projects/contact (MARKUP_BOTTOM).
// Mobile-first bento that extends the hero's design language (app/components/Hero.tsx):
// black canvas, glass tiles, pink→blue brand gradients, animate-rise entrance.
// Scoped under #tl-services with a reset block in globals.css (mirrors #tl-hero).
//
// The cards are deliberately a PIPELINE, not a taxonomy: every engagement runs the same
// arc (get leads → respond instantly → never miss a call → run it on software), so each
// card is a numbered stage of one growth system, anchored with a real metric.

import Bevel, { GLASS_BORDER, GLASS_BG } from "./Bevel";
import Eyebrow from "./Eyebrow";
import { Kinetic, Reveal } from "./motion";

type Service = {
  stage: string;
  title: string;
  blurb: string;
  metrics: string[];
  badges: string[];
  cta: { label: string; href: string };
  icon: React.ReactNode;
};

const iconCls = "h-6 w-6";

// Inline line icons (stroke = currentColor), rendered white over a brand-gradient tile.
const CalendarIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
    <path d="M8.5 15.5l2.5 2.5 4.5-5" />
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
const BoltIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 4.5 13.5H11L9.5 22 18 10.5h-6.5L13 2Z" />
  </svg>
);

const FEATURED: Service & { highlights: string[] } = {
  stage: "01",
  title: "Lead Generation",
  blurb:
    "Lead generation is our core offer. We run the ads, build the funnels, and wire up tracking that doesn't lie — you get booked appointments, not click reports.",
  highlights: [
    "Meta & Google campaigns, run end to end",
    "Landing pages & funnels built to convert",
    "Pixel, CAPI & attribution set up properly",
  ],
  metrics: ["360+ solar consults booked", "≈$96 / booked consult"],
  badges: ["Meta Ads", "Google Ads", "GoHighLevel"],
  cta: { label: "Read the solar case study", href: "/work/solar-lead-engine" },
  icon: TrendIcon,
};

const SERVICES: Service[] = [
  {
    stage: "02",
    title: "Automated Engagement",
    blurb:
      "AI that handles the whole conversation — it reaches every lead in minutes, finds a time and books it, reschedules by text, nudges your reps before appointments, and keeps customers updated on their order so they never have to call and ask.",
    metrics: ["Lead → consult rate doubled", "94% appointment show rate"],
    badges: ["AI SMS Agents", "Voice AI", "Twilio"],
    cta: { label: "See it in action", href: "/work/solar-lead-engine" },
    icon: BoltIcon,
  },
  {
    stage: "03",
    title: "Online Booking & Payments",
    blurb:
      "Booking flows that turn visitors into paid customers — deposits collected up front, capacity managed automatically, and reminders that recover the ones who almost booked.",
    metrics: ["20 bookings, every deposit paid — week one"],
    badges: ["Square", "Stripe", "Supabase"],
    cta: { label: "See Harbs Farm’s system", href: "/work/harbs-farm" },
    icon: CalendarIcon,
  },
];

const CUSTOM: Service = {
  stage: "04",
  title: "Web Apps & Ops Platforms",
  blurb:
    "When off-the-shelf software doesn't fit how you run, we build what does. Harbs Farm runs bookings, cut sheets, payments, and staff boards from one interface — and we're now wiring the scales and machines on the processing line into it, so admins control the entire operation from a single screen.",
  metrics: ["One interface for the whole operation"],
  badges: ["Next.js", "React Native", "Supabase"],
  cta: { label: "Explore custom AI agents", href: "/agents" },
  icon: DeviceIcon,
};

// Dark metal plate with the icon raised as an emboss (replaces the old gradient tile).
function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="bv-6 inline-flex h-11 w-11 shrink-0 items-center justify-center"
      style={{
        backgroundImage: "linear-gradient(145deg, #2b2c33, #16171b)",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -2px 4px rgba(0,0,0,0.55), 0 6px 16px -8px rgba(0,0,0,0.7)",
      }}
      aria-hidden
    >
      <span
        className="flex items-center justify-center text-[#e9eaef]"
        style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.75)) drop-shadow(0 -0.5px 0.5px rgba(255,255,255,0.3))" }}
      >
        {children}
      </span>
    </span>
  );
}

// Stage number — makes the pipeline read as a sequence, not a menu.
function Stage({ n }: { n: string }) {
  return (
    <span aria-hidden className="font-body text-[0.8rem] font-semibold tracking-[0.22em] text-ink/30">
      {n}
    </span>
  );
}

// Real numbers from live client work — stronger emphasis than the tech badges.
function Metrics({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((m) => (
        <li
          key={m}
          className="bv-6 inline-flex items-center bg-ink/[0.06] px-3 py-1 text-[0.78rem] font-semibold text-ink/80"
        >
          {m}
        </li>
      ))}
    </ul>
  );
}

function Badges({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map((b) => (
        <li
          key={b}
          className="bv-6 bg-ink/[0.045] px-3 py-1 text-[0.72rem] font-medium tracking-wide text-ink/55"
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
      className="group/cta mt-6 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-ink/70 transition-colors hover:text-ink"
    >
      {cta.label}
      <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

// Shared glass-tile shell — beveled (chamfered) panel with a hover lift + brand edge-glow.
// `className` styles the grid item (bento spans — it lands on the Reveal wrapper, which IS
// the grid item); `contentClassName` styles the inner layout. Entrance is scroll-triggered
// (Reveal) so the stagger actually plays when the section enters view, instead of finishing
// off-screen on page load like the old animate-rise did.
function Tile({
  children,
  className = "",
  contentClassName = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} y={30} amount={0.2} className={className}>
    <Bevel
      bevel={16}
      border={GLASS_BORDER}
      bg={GLASS_BG}
      className="group h-full transition-transform duration-300 hover:-translate-y-1"
    >
      <div className={`relative flex h-full flex-col p-7 sm:p-8 ${contentClassName}`}>
        {/* brand edge glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, rgba(231,2,141,0.14), transparent 70%)",
          }}
        />
        {children}
      </div>
    </Bevel>
    </Reveal>
  );
}

export default function Services() {
  return (
    <section
      id="tl-services"
      className="font-body relative isolate w-full overflow-hidden bg-page text-ink"
    >
      {/* Ambient brand glow — quieter than the hero so it reads as the same world, calmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[38vw] w-[64vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(5,106,252,0.32) 0%, rgba(231,2,141,0.16) 45%, transparent 72%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1280px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        {/* Header */}
        <div className="max-w-[44rem]">
          <Eyebrow>What we do</Eyebrow>
          <Kinetic
            segments={[{ text: "One " }, { text: "growth system,", gradient: true }, { text: " end to end" }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[0.98] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
              Get leads. Engage them in minutes. Turn them into paid bookings.
              Run it all on software built for how you work. Buy the whole
              machine or start with one stage.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-3 text-[0.85rem] font-medium uppercase tracking-[0.14em] text-ink/40">
              Built for solar, roofing, insurance &amp; local operations
            </p>
          </Reveal>
        </div>

        {/* Bento grid — mobile: 1 col stack; sm+: 2-col bento with a featured tile */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
          {/* Featured — Lead Generation, stage 01 (spans both rows on the left at sm+) */}
          <Tile className="sm:row-span-2" delay={0.16}>
            <div className="flex items-start justify-between">
              <IconTile>{FEATURED.icon}</IconTile>
              <Stage n={FEATURED.stage} />
            </div>
            <h3 className="font-display mt-6 text-[1.6rem] font-normal leading-tight tracking-tight sm:text-[1.9rem]">
              {FEATURED.title}
            </h3>
            <p className="mt-4 max-w-[26rem] text-[0.98rem] leading-relaxed text-ink/55">
              {FEATURED.blurb}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {FEATURED.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[0.92rem] text-ink/70">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
            <Metrics items={FEATURED.metrics} />
            <Badges items={FEATURED.badges} />
            <div className="mt-auto pt-2">
              <Cta cta={FEATURED.cta} />
            </div>
          </Tile>

          {/* Two stacked tiles on the right at sm+ — stages 02 & 03 */}
          {SERVICES.map((s, i) => (
            <Tile key={s.title} delay={0.22 + i * 0.06}>
              <div className="flex items-start justify-between">
                <IconTile>{s.icon}</IconTile>
                <Stage n={s.stage} />
              </div>
              <h3 className="font-display mt-5 text-[1.3rem] font-normal leading-tight tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/55">
                {s.blurb}
              </p>
              <Metrics items={s.metrics} />
              <Badges items={s.badges} />
              <Cta cta={s.cta} />
            </Tile>
          ))}

          {/* Stage 04 — full-width bar across the bottom at sm+ */}
          <Tile className="sm:col-span-2" contentClassName="sm:flex-row sm:items-center sm:gap-7" delay={0.4}>
            <div className="flex items-start justify-between sm:block">
              <IconTile>{CUSTOM.icon}</IconTile>
              <span className="sm:hidden"><Stage n={CUSTOM.stage} /></span>
            </div>
            <div className="mt-5 sm:mt-0 sm:flex-1">
              <h3 className="font-display text-[1.3rem] font-normal leading-tight tracking-tight">
                {CUSTOM.title}
              </h3>
              <p className="mt-3 max-w-[44rem] text-[0.95rem] leading-relaxed text-ink/55">
                {CUSTOM.blurb}
              </p>
              <Metrics items={CUSTOM.metrics} />
            </div>
            <div className="mt-5 flex flex-col items-start gap-1 sm:mt-0 sm:items-end">
              <span className="hidden sm:block"><Stage n={CUSTOM.stage} /></span>
              <Badges items={CUSTOM.badges} />
              <Cta cta={CUSTOM.cta} />
            </div>
          </Tile>
        </div>

        {/* Section CTA → conversion */}
        <Reveal amount={0.6} y={14}>
        <p className="mt-12 text-[0.98rem] text-ink/55">
          Most clients start with lead generation — where it goes from there is up to you.{" "}
          <a
            href="#contact"
            className="group/link inline-flex items-center gap-1.5 font-semibold text-ink/80 transition-colors hover:text-ink"
          >
            Tell us where you&apos;re at
            <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </p>
        </Reveal>
      </div>
    </section>
  );
}
