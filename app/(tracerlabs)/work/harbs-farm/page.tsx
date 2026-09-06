import type { Metadata } from "next";
import Image from "next/image";
import Footer from "../../../components/Footer";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import CaseHeader from "../../../components/CaseHeader";

// Case study: Harbs Farm — the flagship client story (named with permission).
// Rewritten 2026-09 as problem → solution → outcome scenarios (mirrors
// /work/solar-lead-engine): the farm's constraint was CAPACITY, not demand —
// every scenario is a manual process the platform absorbed. Telemetry design
// language: Archivo headings, hairline panels, blue results accent, the brand
// gradient exactly once (the hero number), decorative fal.ai scenario banners.

export const metadata: Metadata = {
  title: "Case Study: Harbs Farm",
  description:
    "A meat-processing farm that ran on phone calls and paper cut sheets. We digitized the whole operation — self-serve bookings, deposit-gated slots, automated status updates, invoicing — and freed the capacity they were losing to coordination.",
  alternates: { canonical: "/work/harbs-farm" },
  openGraph: {
    type: "article",
    url: "https://tracerlabs.io/work/harbs-farm",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Case Study: Harbs Farm | Tracerlabs",
    description:
      "From phone calls and paper cut sheets to a self-serve operation — deposit-gated bookings, automated updates, digital invoicing. 20 paid bookings in the first week of ads.",
  },
};

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

const SECTIONS = [
  { id: "phone", n: "1", nav: "Run by phone" },
  { id: "no-shows", n: "2", nav: "Wasted slots" },
  { id: "status", n: "3", nav: "“Is my order ready?”" },
  { id: "back-office", n: "4", nav: "The back office" },
] as const;

const STACK = [
  "Next.js",
  "Supabase (Postgres + phone-OTP auth)",
  "Square (deposits & payments)",
  "Twilio SMS",
  "Resend email",
  "Retell voice AI",
  "Meta Pixel + CAPI",
  "Vercel",
];

function RunIn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-[1.04rem] leading-[1.75] text-ink/62">
      <strong className="font-semibold text-ink">{label} — </strong>
      {children}
    </p>
  );
}

function Result({ figure, children }: { figure: string; children: React.ReactNode }) {
  return (
    <div className="mt-7 border-l-2 pl-6" style={{ borderColor: "var(--tl-accent-text)" }}>
      <div
        className="nt-figure text-[2.1rem] font-bold leading-none tracking-tight"
        style={{ fontFamily: DISPLAY, color: "var(--tl-accent-text)" }}
      >
        {figure}
      </div>
      <p className="mt-3 max-w-[38rem] text-[1.02rem] leading-[1.7] text-ink/70">{children}</p>
    </div>
  );
}

function Scenario({
  id,
  n,
  title,
  img,
  children,
}: {
  id: string;
  n: string;
  title: string;
  img?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-ink/10 py-12 sm:py-14">
      <h2
        className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-ink"
        style={{ fontFamily: DISPLAY }}
      >
        <span className="mr-3 text-ink/30">{n}</span>
        {title}
      </h2>
      {img && (
        <div aria-hidden className="relative mt-6 aspect-[21/9] w-full max-w-[42rem] overflow-hidden bg-[#0b0b0f]">
          <Image src={img} alt="" fill sizes="(max-width: 700px) 100vw, 42rem" className="object-cover" loading="lazy" />
        </div>
      )}
      <div className="mt-5 flex max-w-[42rem] flex-col gap-4">{children}</div>
    </section>
  );
}

export default function HarbsFarmCaseStudy() {
  return (
    <div>
      <CaseHeader />
      <main className="font-body w-full bg-page text-ink">
        {/* Header */}
        <header className="mx-auto w-full max-w-[1060px] px-6 pt-16 sm:px-10 sm:pt-20">
          <p className="text-[0.95rem] text-ink/50">Case study — meat processing, New York</p>
          <h1
            className="mt-4 max-w-[17ch] text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.06] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            The farm that ran on phone calls runs on software now.
          </h1>
          <p className="mt-6 max-w-[44rem] text-[1.12rem] leading-[1.7] text-ink/60">
            Harbs Farm never had a demand problem — customers were already
            asking for a website where they could book. They had a capacity
            problem: every booking, every cut-sheet preference, every
            &ldquo;is my order ready?&rdquo; went through a phone call and a
            piece of paper, and the coordination work was eating the hours the
            family needed for the actual processing. We digitized the whole
            operation. Here are the four manual processes that fell.
          </p>

          {/* Hero figure — the page's single gradient moment */}
          <div className="mt-12 flex flex-wrap items-end gap-x-12 gap-y-8 border-y border-ink/10 py-8">
            <div>
              <div
                className="bg-gradient-to-r from-brand-pink to-brand-blue bg-clip-text text-[clamp(4rem,9vw,6.5rem)] font-extrabold leading-none tracking-tight text-transparent"
                style={{ fontFamily: DISPLAY }}
              >
                0
              </div>
              <div className="mt-2 text-[1rem] text-ink/60">
                phone calls needed to book, pay, or check an order
              </div>
            </div>
            <dl className="flex flex-wrap gap-x-10 gap-y-5 pb-1">
              {[
                ["100%", "of deposits collected up front"],
                ["20", "paid bookings, first week of ads"],
                ["1 in 8", "search visitors becomes a booking"],
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

        {/* Body: sticky index + content */}
        <div className="mx-auto grid w-full max-w-[1060px] grid-cols-1 gap-x-14 px-6 pb-8 pt-4 sm:px-10 lg:grid-cols-[180px_1fr]">
          <nav aria-label="Case study sections" className="hidden lg:block">
            <ol className="sticky top-28 flex list-none flex-col gap-3 p-0 pt-14">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="group flex items-baseline gap-2.5 text-[0.92rem] text-ink/50 transition-colors hover:text-ink"
                  >
                    <span className="text-[0.8rem] text-ink/30 group-hover:text-ink/50">{s.n}</span>
                    {s.nav}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 pt-2">
            <Scenario id="phone" n="1" title="Run by phone" img="/assets/work-harbs-phone.jpg">
              <RunIn label="The problem">
                The phone was the front desk, the order form, and the filing
                cabinet. Every booking was a call. Cut sheets — how each
                customer wants each animal processed — were emailed as paper
                forms or taken down verbally, preference by preference, and
                noted by hand. Pricing lived in someone&apos;s head. During peak
                season, answering the phone was a full-time job that produced
                zero pounds of processed meat.
              </RunIn>
              <RunIn label="What we did">
                An online booking system built around the cut sheet: farmers
                book their own slot, add each animal, and pick exactly how they
                want it processed — beef broken down primal by primal (chuck as
                roast or steak, pack sizes for ground, sausage flavors), with
                separate sheets for lamb, goat, and poultry. The farm&apos;s
                entire rate card is encoded in the system, so the price and the
                estimate compute themselves as the cut sheet fills in. Nothing
                gets re-asked at drop-off, and nothing depends on whoever
                answered the phone that day.
              </RunIn>
              <Result figure="Cut sheets fill themselves in">
                The single biggest chunk of manual coordination — collecting
                preferences and pricing them — is now done by the customer,
                correctly, before the animal ever arrives.
              </Result>
            </Scenario>

            <Scenario id="no-shows" n="2" title="Wasted slots" img="/assets/work-harbs-deposit.jpg">
              <RunIn label="The problem">
                Processing capacity is the whole business — there are only so
                many slots in a week. People would book one, then never show
                up. That slot was gone: it could have gone to a paying customer,
                and instead it produced nothing.
              </RunIn>
              <RunIn label="What we did">
                A deposit gate, integrated with Square: a booking slot is only
                reserved once the deposit is paid, and the amount is calculated
                automatically from what&apos;s in the booking — per animal, per
                species, straight from the cart rules. No deposit, no slot.
                Under the hood the card is authorized first and captured only
                after the booking lands, with an hourly reconciliation job that
                flags any charge that ever ends up without a booking. The owner
                controls capacity directly too — blocking days and setting
                per-day caps (500 chickens on a Wednesday, 1,200 on a Friday)
                from an admin calendar, so the system stops overbooking before
                it happens.
              </RunIn>
              <Result figure="100% of deposits collected">
                Every booking on the calendar is now backed by money. In the
                first week of paid ads, all 20 bookings arrived with the deposit
                already paid — no-shows stopped costing slots.
              </Result>
            </Scenario>

            <Scenario id="status" n="3" title="&ldquo;Is my order ready?&rdquo;" img="/assets/work-harbs-kanban.jpg">
              <RunIn label="The problem">
                Once an animal was dropped off, the only way for a customer to
                know its status was to call — and someone at the farm had to
                stop working, find out, and call back. Multiply by every active
                order, every week.
              </RunIn>
              <RunIn label="What we did">
                A kanban board for the processing floor — Dropped Off →
                Processing → Ready for Pickup → Picked Up. Staff move each
                order through the stages as they work, and the board is not
                just internal tracking: every stage move automatically texts
                the customer, and the one that matters most — &ldquo;your order
                is ready for pickup&rdquo; — arrives with their invoice and a
                one-tap sign-in link to their account. When customers do still
                call, an AI receptionist answers, looks up their live order
                status from the same data, and handles the routine questions.
              </RunIn>
              <Result figure="Status calls → status texts">
                Customers stopped needing to call, and the farm stopped playing
                switchboard. The same board the staff already use to run the
                floor is the thing that keeps every customer informed.
              </Result>
            </Scenario>

            <Scenario id="back-office" n="4" title="The back office" img="/assets/work-harbs-finance.jpg">
              <RunIn label="The problem">
                Invoicing was manual — hours of it — and financial visibility
                was whatever could be reconstructed from paper, memory, and the
                bank statement. Customers had no way to see an invoice or
                change a booking without another phone call.
              </RunIn>
              <RunIn label="What we did">
                Automated invoicing generated straight from the cut-sheet data
                the system already holds — the same numbers the floor entered,
                priced by the same rate card, editable line by line when
                reality differs. Every invoice and order flows into one admin
                dashboard with a live revenue view the owners can actually plan
                against. And customers got a portal of their own: their
                invoices, their bookings, and the ability to reschedule a slot
                themselves.
              </RunIn>
              <Result figure="Hours of admin → one dashboard">
                The invoicing hours are gone, the paper is gone, and for the
                first time the farm has a live financial overview of its own
                operation.
              </Result>
            </Scenario>

            {/* Closing */}
            <section className="border-t border-ink/10 py-12 sm:py-14">
              <h2
                className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-ink"
                style={{ fontFamily: DISPLAY }}
              >
                One platform, and what&apos;s next
              </h2>
              <p className="mt-5 max-w-[42rem] text-[1.04rem] leading-[1.75] text-ink/62">
                Bookings, cut sheets, deposits, the processing board, customer
                notifications, the portal, and invoicing all run as one system —
                the coordination work that used to bury the family now happens
                on its own. With the capacity problem solved, the engagement has
                moved to the growth side: ad campaigns with real conversion
                tracking are already filling the calendar (20 paid bookings in
                week one, roughly 1 booking per 8 search visitors). Next up:
                wiring the processing line itself into the platform — scales and
                machines feeding weights straight into orders and invoices, no
                manual entry anywhere from ad click to pickup.
              </p>
              <p className="mt-5 max-w-[42rem] text-[0.92rem] leading-relaxed text-ink/45">
                Built with {STACK.join(" · ")}.
              </p>
            </section>

            {/* CTA — the page's one chamfered panel */}
            <section className="pb-20">
              <Card bevel={16} contentClassName="items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                <div>
                  <h2
                    className="text-[1.4rem] font-bold leading-tight tracking-tight text-ink"
                    style={{ fontFamily: DISPLAY }}
                  >
                    Still running your operation by phone?
                  </h2>
                  <p className="mt-2 max-w-[30rem] text-[0.95rem] text-ink/55">
                    If coordination work is eating your capacity, we&apos;ll
                    build the system that absorbs it.
                  </p>
                </div>
                <Button href="/#contact" variant="primary">
                  Book a discovery call
                </Button>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
