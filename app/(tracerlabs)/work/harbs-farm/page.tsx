import type { Metadata } from "next";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import Button from "../../../components/Button";
import { Kinetic, Reveal } from "../../../components/motion";

// Case study: Harbs Farm — the flagship client story (named with permission).
// Content page: Nav sticks from the top (no full-height hero), sections inherit the
// site's design language (glass Bevel panels, brand gradients, font-body/font-display).

export const metadata: Metadata = {
  title: "Case Study: Harbs Farm",
  description:
    "How a family farm in New York went from phone calls and paper to an online operation — bookings, deposits, staff boards, reminders, and the ads that fill the calendar. 20 paid bookings in week one.",
  alternates: { canonical: "/work/harbs-farm" },
  openGraph: {
    type: "article",
    url: "https://tracerlabs.io/work/harbs-farm",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Case Study: Harbs Farm | Tracerlabs",
    description:
      "From phone calls and paper to a self-serve online operation — 20 paid bookings in the first week of ads, every deposit collected.",
  },
};

const STATS = [
  { v: "20", l: "paid bookings in week one of ads" },
  { v: "100%", l: "of deposits collected up front" },
  { v: "1 in 8", l: "Google visitors becomes a booking" },
  { v: "7", l: "new farmer customers since launch" },
];

const BUILT = [
  {
    t: "Self-serve booking",
    d: "A step-by-step wizard where farmers book drop-offs, fill out cut sheets, and pay deposits through Square — no phone call required.",
  },
  {
    t: "Staff ops board",
    d: "A kanban processing board that tracks every order from drop-off through processing to ready — the whole floor sees the same live status.",
  },
  {
    t: "Owner-controlled capacity",
    d: "The owner blocks days, sets per-day caps, and adjusts schedules from an admin calendar — the system stops overbooking before it happens.",
  },
  {
    t: "Automated customer updates",
    d: "Drop-off reminders, order-status texts and emails at every stage — customers stay informed without calling in, and fewer bookings fall through.",
  },
  {
    t: "Ads that fill the calendar",
    d: "Meta and Google campaigns wired to conversion tracking that actually works (Pixel + CAPI), with a campaign dashboard the owner reads himself.",
  },
  {
    t: "An AI receptionist",
    d: "When customers do call, an AI answers, looks up their order status in real time, and handles the routine questions.",
  },
];

function StatTile({ v, l }: { v: string; l: string }) {
  return (
    <Bevel bevel={12} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
      <div className="flex h-full flex-col items-start p-5">
        <span className="font-body bg-gradient-to-r from-brand-pink to-brand-blue bg-clip-text text-[1.9rem] font-bold leading-none text-transparent">
          {v}
        </span>
        <span className="mt-2 text-[0.85rem] leading-snug text-ink/55">{l}</span>
      </div>
    </Bevel>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-[880px] px-6 py-14 sm:px-10 sm:py-16">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display mt-5 text-[clamp(1.5rem,3.4vw,2.2rem)] font-normal uppercase leading-tight tracking-tight">
          {title}
        </h2>
        <div className="mt-5 flex flex-col gap-4 text-[1.02rem] leading-relaxed text-ink/60">
          {children}
        </div>
      </Reveal>
    </section>
  );
}

export default function HarbsFarmCaseStudy() {
  return (
    <>
      <Nav
        links={[
          { label: "Services", href: "/#tl-services" },
          { label: "Works", href: "/#tl-projects" },
        ]}
        contactHref="/#contact"
      />
      <main className="font-body relative isolate w-full overflow-hidden bg-page text-ink">
        {/* ambient brand glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40vw] w-[70vw] -translate-x-1/2 rounded-full opacity-[0.16] blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(231,2,141,0.32) 0%, rgba(5,106,252,0.16) 45%, transparent 72%)",
          }}
        />

        {/* Header */}
        <header className="mx-auto w-full max-w-[880px] px-6 pb-4 pt-16 sm:px-10 sm:pt-20">
          <Eyebrow>Case study · Meat processing · New York</Eyebrow>
          <Kinetic
            as="h1"
            segments={[{ text: "Harbs Farm", gradient: true }]}
            className="font-display mt-6 text-[clamp(2.4rem,6vw,3.8rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-[40rem] text-[1.15rem] leading-relaxed text-ink/60">
              A family-run farm and meat-processing facility that ran on phone
              calls and paper. Today its customers book, pay, and track their
              orders online — and the ads that keep the calendar full run on the
              same system.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <StatTile key={s.l} {...s} />
              ))}
            </div>
          </Reveal>
        </header>

        <Section eyebrow="The problem" title="Everything went through the phone">
          <p>
            Every booking was a phone call. Deposits weren&apos;t collected, so
            no-shows cost real money. Cut-sheet details lived on paper and got
            re-asked at drop-off. Customers called throughout the week to check
            on their orders, and during peak season the volume buried the family
            in coordination work that had nothing to do with processing meat.
          </p>
          <p>
            The farm didn&apos;t need a website. It needed an operating system —
            and a way to grow beyond word of mouth without adding more phone
            calls.
          </p>
        </Section>

        <Section eyebrow="What we built" title="One system, from ad click to pickup">
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BUILT.map((b) => (
              <Bevel key={b.t} bevel={12} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
                <div className="p-5">
                  <h3 className="font-display text-[1.05rem] font-normal leading-tight tracking-tight">
                    {b.t}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/55">{b.d}</p>
                </div>
              </Bevel>
            ))}
          </div>
        </Section>

        <Section eyebrow="The results" title="Paid bookings, not phone tag">
          <p>
            In the first week of paid ads the farm took{" "}
            <strong className="font-semibold text-ink/85">
              20 online bookings — every one with the deposit collected up front
            </strong>
            . Search traffic converts at roughly 1 booking per 8 visitors, and
            the campaigns have brought in 7 brand-new farmer customers the farm
            had never worked with before. Status texts and emails answer the
            &quot;where&apos;s my order?&quot; calls before they happen, and the
            reminder ladder quietly recovers bookings that would have been
            abandoned.
          </p>
        </Section>

        <Section eyebrow="What's next" title="Wiring in the processing line itself">
          <p>
            The next phase connects the scales and machines on the processing
            line directly into the platform — weights flowing straight from the
            floor into orders and pricing, no manual entry. The goal: admins run
            the entire operation, from ad click to finished order, through a
            single interface.
          </p>
        </Section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-[880px] px-6 pb-20 pt-6 sm:px-10">
          <Reveal>
            <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG}>
              <div className="flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                <div>
                  <h2 className="font-display text-[1.5rem] font-normal uppercase leading-tight tracking-tight">
                    Run your operation like this
                  </h2>
                  <p className="mt-2 max-w-[30rem] text-[0.95rem] text-ink/55">
                    If your business still runs on phone calls and paper, we can
                    build the system that runs it instead.
                  </p>
                </div>
                <Button href="/#contact" variant="primary">
                  Start your project
                </Button>
              </div>
            </Bevel>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
