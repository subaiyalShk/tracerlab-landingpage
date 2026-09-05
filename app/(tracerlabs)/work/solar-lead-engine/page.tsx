import type { Metadata } from "next";
import Footer from "../../../components/Footer";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Button from "../../../components/Button";
import CaseHeader from "../../../components/CaseHeader";

// Case study: the solar lead engine (client anonymized). Pilot page for the
// "Telemetry" redesign: data is the hero, chrome is quiet. Headings in Archivo
// (Duborics stays in the logo only), no scroll-reveal gating (content visible
// by default), the brand gradient appears exactly once (the hero number), and
// results render as real figures — including an actual chart of the monthly
// booking rate. All numbers from the live funnel's production data
// (Redis funnel events + GHL calendar, 2026-04 → 2026-09).

export const metadata: Metadata = {
  title: "Case Study: A Solar Lead Engine",
  description:
    "367 solar consultations booked, a lead-to-appointment rate that doubled after the AI texting agent launched, and a 94% show rate. How we fixed fake numbers, cold leads, and no-shows for a Texas solar company.",
  alternates: { canonical: "/work/solar-lead-engine" },
  openGraph: {
    type: "article",
    url: "https://tracerlabs.io/work/solar-lead-engine",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Case Study: A Solar Lead Engine | Tracerlabs",
    description:
      "367 consults booked, booking rate doubled by AI texting, 94% show rate — the full problem → solution → results story.",
  },
};

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";
// Results accent — brand blue (validated ≥3:1 on both light & dark surfaces).
const ACCENT = "#056AFC";

const SECTIONS = [
  { id: "visibility", n: "1", nav: "Flying blind" },
  { id: "lead-quality", n: "2", nav: "Fake numbers" },
  { id: "speed", n: "3", nav: "Cold leads" },
  { id: "show-rate", n: "4", nav: "No-shows" },
] as const;

// Monthly lead → booked-consult rate, from the production Redis leads list.
const RATE_BY_MONTH = [
  { m: "Apr", v: 20 },
  { m: "May", v: 28 },
  { m: "Jun", v: 58 },
  { m: "Jul", v: 50 },
  { m: "Aug", v: 40 },
  { m: "Sep", v: 42 },
];

// Static editorial figure: one series, one hue; the agent-launch annotation
// carries the before/after story, values are direct-labeled (no hover layer
// needed — every number is already visible).
function RateChart() {
  const W = 560;
  const H = 210;
  const padX = 8;
  const chartTop = 26;
  const baseline = 168;
  const max = 60;
  const n = RATE_BY_MONTH.length;
  const slot = (W - padX * 2) / n;
  const barW = Math.min(52, slot - 18);
  const x = (i: number) => padX + slot * i + (slot - barW) / 2;
  const y = (v: number) => baseline - ((baseline - chartTop) * v) / max;
  // annotation between May (i=1) and Jun (i=2)
  const annX = padX + slot * 2 - 9;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Lead to consultation rate by month: April 20%, May 28%, June 58%, July 50%, August 40%, September 42%. The AI texting agent went live at the end of May."
      className="w-full"
    >
      {/* baseline */}
      <line x1={padX} y1={baseline} x2={W - padX} y2={baseline} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
      {/* agent-launch annotation */}
      <line x1={annX} y1={chartTop - 12} x2={annX} y2={baseline} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 4" />
      <text x={annX - 8} y={chartTop - 8} textAnchor="end" fill="currentColor" fillOpacity="0.6" fontSize="12">
        AI texting agent live
      </text>
      {RATE_BY_MONTH.map((d, i) => (
        <g key={d.m}>
          <rect x={x(i)} y={y(d.v)} width={barW} height={baseline - y(d.v)} rx="4" fill={ACCENT} />
          {/* square off the bottom corners so bars sit on the baseline */}
          <rect x={x(i)} y={baseline - 5} width={barW} height={5} fill={ACCENT} />
          <text x={x(i) + barW / 2} y={y(d.v) - 8} textAnchor="middle" fill="currentColor" fillOpacity="0.85" fontSize="14" fontWeight="600">
            {d.v}%
          </text>
          <text x={x(i) + barW / 2} y={baseline + 22} textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="13">
            {d.m}
          </text>
        </g>
      ))}
      <text x={padX} y={H - 2} fill="currentColor" fillOpacity="0.45" fontSize="12">
        Share of captured leads that booked a consultation, by month
      </text>
    </svg>
  );
}

function RunIn({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-[1.04rem] leading-[1.75] text-ink/62">
      <strong className="font-semibold text-ink">{label} — </strong>
      {children}
    </p>
  );
}

function Result({
  figure,
  children,
  chart,
}: {
  figure: string;
  children: React.ReactNode;
  chart?: React.ReactNode;
}) {
  return (
    <div className="mt-7 border-l-2 border-[#056AFC] pl-6">
      <div
        className="text-[2.1rem] font-bold leading-none tracking-tight text-[#056AFC]"
        style={{ fontFamily: DISPLAY }}
      >
        {figure}
      </div>
      <p className="mt-3 max-w-[38rem] text-[1.02rem] leading-[1.7] text-ink/70">{children}</p>
      {chart && <div className="mt-6 max-w-[36rem] text-ink">{chart}</div>}
    </div>
  );
}

function Scenario({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
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
      <div className="mt-5 flex max-w-[42rem] flex-col gap-4">{children}</div>
    </section>
  );
}

export default function SolarCaseStudy() {
  return (
    <div>
      <CaseHeader />
      <main className="font-body w-full bg-page text-ink">
        {/* Header */}
        <header className="mx-auto w-full max-w-[1060px] px-6 pt-16 sm:px-10 sm:pt-20">
          <p className="text-[0.95rem] text-ink/50">Case study — solar, Texas</p>
          <h1
            className="mt-4 max-w-[17ch] text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.06] tracking-tight text-ink"
            style={{ fontFamily: DISPLAY }}
          >
            The lead engine that books solar consults on autopilot.
          </h1>
          <p className="mt-6 max-w-[44rem] text-[1.12rem] leading-[1.7] text-ink/60">
            A Texas solar company needed consultations, not click reports. We run
            the whole engine — the ads, the funnel, and the AI agents that verify,
            engage, and book every lead. Four problems stood between their ad
            spend and their calendar. Here is how each one fell.
          </p>

          {/* Hero figure — the page's single gradient moment */}
          <div className="mt-12 flex flex-wrap items-end gap-x-12 gap-y-8 border-y border-ink/10 py-8">
            <div>
              <div
                className="bg-gradient-to-r from-brand-pink to-brand-blue bg-clip-text text-[clamp(4rem,9vw,6.5rem)] font-extrabold leading-none tracking-tight text-transparent"
                style={{ fontFamily: DISPLAY }}
              >
                367
              </div>
              <div className="mt-2 text-[1rem] text-ink/60">consultations booked</div>
            </div>
            <dl className="flex flex-wrap gap-x-10 gap-y-5 pb-1">
              {[
                ["50%", "of leads book a consult"],
                ["94%", "appointment show rate"],
                ["≈$96", "ad spend per booked consult"],
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
            <Scenario id="visibility" n="1" title="Flying blind">
              <RunIn label="The problem">
                You can&apos;t fix a funnel you can&apos;t see. The ad platform reported
                clicks, the CRM showed leads, and nothing explained the gap between
                them. Which step lost people? Why? Nobody could say — so every
                &ldquo;optimization&rdquo; would have been a guess.
              </RunIn>
              <RunIn label="What we did">
                Before changing anything, we built an analytics dashboard and started
                logging everything: every page view, every funnel step, every
                drop-off and disqualification reason, tied back to ad spend. The
                first thing the data exposed: nearly half of paid clicks never even
                landed — one April week bought 223 clicks and only 116 landing
                views. People clicked the ad and gave up before the page finished
                loading. So the first fix wasn&apos;t copy or targeting. It was a
                page-speed rebuild: first paint cut from 5.5s to 0.8s, Lighthouse
                score from 55 to 80.
              </RunIn>
              <Result figure="5.5s → 0.8s">
                First paint after the rebuild. The click-to-land drop-off is gone —
                landings now track ad clicks one-for-one instead of losing half.
                Every fix below was found the same way: measure first, then solve
                the problem the data actually shows.
              </Result>
            </Scenario>

            <Scenario id="lead-quality" n="2" title="Fake numbers">
              <RunIn label="The problem">
                Meta delivered volume, but the sales reps kept coming back with the
                same report: &ldquo;the number doesn&apos;t work&rdquo;, &ldquo;wrong
                number&rdquo;. We measured it before fixing it — across every lead
                number from a 14-day window, roughly 1 in 5 wasn&apos;t a real mobile
                phone: invalid numbers, landlines, and burner VoIP numbers. Five of
                them were literally Google Voice.
              </RunIn>
              <RunIn label="What we did">
                A simple two-layer phone gate, inline on the contact form: a carrier
                line-type screen that rejects burners and landlines before a single
                SMS is spent, then a 6-digit SMS code the lead types back. A number
                that never verifies never becomes a lead — not in the CRM, not in an
                admin text, nowhere.
              </RunIn>
              <Result figure="1 in 5 → 0">
                Fake numbers reaching the sales team. Every lead is now a verified,
                reachable human — the wrong-number call reports stopped, and the ad
                account optimizes on real people instead of fake form fills.
              </Result>
            </Scenario>

            <Scenario id="speed" n="3" title="Cold leads">
              <RunIn label="The problem">
                Solar leads decay by the hour. Leads waited hours — sometimes days —
                for a callback, and by then they&apos;d filled out three
                competitors&apos; forms. In April, only 20% of captured leads ever
                became a booked consultation.
              </RunIn>
              <RunIn label="What we did">
                An AI texting agent that opens the conversation within about two
                minutes of the form submit — it answers first questions, coordinates
                a time, and books the consultation straight into the sales calendar,
                around the clock. No lead sits in an inbox waiting for the office to
                open.
              </RunIn>
              <Result figure="20% → 50%" chart={<RateChart />}>
                The lead-to-consultation rate roughly doubled in the months after
                the agent launched, and has held near 50% even after the phone gate
                made every lead count. That&apos;s 367 consultations booked to date —
                about 2 a day, on autopilot.
              </Result>
            </Scenario>

            <Scenario id="show-rate" n="4" title="No-shows">
              <RunIn label="The problem">
                People book in good faith, then life happens — plans change, work
                runs late, and a sales rep burns an hour on someone who was never
                going to pick up. In this industry, no-show rates of 30–50% are
                normal.
              </RunIn>
              <RunIn label="What we did">
                A confirmation agent that reminds every prospect before their
                appointment — and when something has changed, reschedules them right
                there in the chat. The rep&apos;s slot gets freed and rebooked
                instead of silently wasted.
              </RunIn>
              <Result figure="94% show rate">
                Of 487 appointments on the calendar, only 28 ended as no-shows —
                fewer than 1 in 15. The reminder alone is often enough: people show
                up to appointments they were reminded of.
              </Result>
            </Scenario>

            {/* Closing */}
            <section className="border-t border-ink/10 py-12 sm:py-14">
              <h2
                className="text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-tight text-ink"
                style={{ fontFamily: DISPLAY }}
              >
                One system, from ad click to sat appointment
              </h2>
              <p className="mt-5 max-w-[42rem] text-[1.04rem] leading-[1.75] text-ink/62">
                Over 12,000 funnel visitors. 766 leads captured — every recent one
                SMS-verified. 367 consultations booked, averaging under $100 in ad
                spend per booked consult across the campaign. The funnel, the
                texting agent, the confirmation agent, and the tracking all run as
                one system — which is why each piece makes the others better:
                verified leads make the ads smarter, instant follow-up makes the
                leads warmer, and reminders make the appointments real.
              </p>
            </section>

            {/* CTA — the page's one chamfered panel */}
            <section className="pb-20">
              <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG}>
                <div className="flex flex-col items-start gap-5 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                  <div>
                    <h2
                      className="text-[1.4rem] font-bold leading-tight tracking-tight text-ink"
                      style={{ fontFamily: DISPLAY }}
                    >
                      Have the same problems?
                    </h2>
                    <p className="mt-2 max-w-[30rem] text-[0.95rem] text-ink/55">
                      Fake numbers, cold leads, and no-shows are fixable. We&apos;ll
                      build the engine that fixes them.
                    </p>
                  </div>
                  <Button href="/#contact" variant="primary">
                    Start your project
                  </Button>
                </div>
              </Bevel>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
