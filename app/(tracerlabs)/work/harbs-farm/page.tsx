import type { Metadata } from "next";
import Footer from "../../../components/Footer";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Button from "../../../components/Button";
import CaseHeader from "../../../components/CaseHeader";

// Case study: Harbs Farm — the flagship client story (named with permission).
// Telemetry design language (matches /work/solar-lead-engine): Archivo
// headings, flat hairline panels, blue results accent, no reveal gating,
// the brand gradient exactly once (the hero number).

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

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";
const ACCENT = "#056AFC";

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[880px] border-t border-ink/10 px-6 py-12 sm:px-10 sm:py-14">
      <h2
        className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-ink"
        style={{ fontFamily: DISPLAY }}
      >
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-4 text-[1.04rem] leading-[1.75] text-ink/62">
        {children}
      </div>
    </section>
  );
}

export default function HarbsFarmCaseStudy() {
  return (
    <div>
      <CaseHeader />
      <main className="font-body w-full bg-page text-ink">
        {/* Header */}
        <header className="mx-auto w-full max-w-[880px] px-6 pb-12 pt-16 sm:px-10 sm:pt-20">
          <p className="text-[0.95rem] text-ink/50">Case study — meat processing, New York</p>
          <h1
            className="mt-4 max-w-[16ch] text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.06] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            Harbs Farm runs online now.
          </h1>
          <p className="mt-6 max-w-[42rem] text-[1.12rem] leading-[1.7] text-ink/60">
            A family-run farm and meat-processing facility that ran on phone
            calls and paper. Today its customers book, pay, and track their
            orders online — and the ads that keep the calendar full run on the
            same system.
          </p>

          {/* Hero figure — the page's single gradient moment */}
          <div className="mt-12 flex flex-wrap items-end gap-x-12 gap-y-8 border-y border-ink/10 py-8">
            <div>
              <div
                className="bg-gradient-to-r from-brand-pink to-brand-blue bg-clip-text text-[clamp(4rem,9vw,6.5rem)] font-extrabold leading-none tracking-tight text-transparent"
                style={{ fontFamily: DISPLAY }}
              >
                20
              </div>
              <div className="mt-2 text-[1rem] text-ink/60">
                paid bookings in the first week of ads
              </div>
            </div>
            <dl className="flex flex-wrap gap-x-10 gap-y-5 pb-1">
              {[
                ["100%", "of deposits collected up front"],
                ["1 in 8", "Google visitors becomes a booking"],
                ["7", "new farmer customers since launch"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="text-[1.6rem] font-bold tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
                      {v}
                    </span>
                    <span className="mt-1 block max-w-[11rem] text-[0.88rem] leading-snug text-ink/55">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <Section title="Everything went through the phone">
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

        <Section title="One system, from ad click to pickup">
          <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BUILT.map((b) => (
              <div key={b.t} className="border border-ink/10 p-5">
                <h3 className="text-[1.02rem] font-bold leading-tight tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
                  {b.t}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink/55">{b.d}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Paid bookings, not phone tag">
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

        <Section title="Next: wiring in the processing line itself">
          <div className="border-l-2 pl-6" style={{ borderColor: ACCENT }}>
            <p>
              The next phase connects the scales and machines on the processing
              line directly into the platform — weights flowing straight from
              the floor into orders and pricing, no manual entry. The goal:
              admins run the entire operation, from ad click to finished order,
              through a single interface.
            </p>
          </div>
        </Section>

        {/* CTA — the page's one chamfered panel */}
        <section className="mx-auto w-full max-w-[880px] px-6 pb-20 pt-4 sm:px-10">
          <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG}>
            <div className="flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
              <div>
                <h2 className="text-[1.4rem] font-bold leading-tight tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
