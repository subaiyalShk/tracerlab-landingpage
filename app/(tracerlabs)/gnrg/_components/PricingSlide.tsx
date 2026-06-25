import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import Button from "../../../components/Button";
import { Kinetic, Reveal } from "../../../components/motion";

type Tier = {
  name: string;
  result: string; // the outcome this tier buys you
  forWhom: string;
  monthly: string;
  payback: string; // the ROI line — what it pays for itself at
  features: string[];
  cta: string;
  href?: string; // optional self-serve link; otherwise falls back to book-a-call
  featured?: boolean;
};

// Live Stripe Payment Links (recurring monthly subscriptions), created 2026-06-22.
// Tier 1 = $5,000/mo, Tier 2 = $7,000/mo, Tier 3 = $12,000/mo (floor — scoped above that).
const STRIPE_LINKS = {
  tier1: "https://buy.stripe.com/cNi4gy81A2FRfOzgwdeEo0t",
  tier2: "https://buy.stripe.com/cNifZg95E3JVbyj93LeEo0u",
  tier3: "https://buy.stripe.com/fZu5kC1Dca8j7i3gwdeEo0v",
};

const TIERS: Tier[] = [
  {
    name: "Tier 1 · Marketing",
    result: "Booked appointments on your calendar.",
    forWhom: "Demand-to-booking, fully managed",
    monthly: "$5,000",
    payback: "Pays for itself at ~1 closed install / mo",
    features: [
      "Managed marketing campaigns that drive demand to a branded funnel",
      "Solar savings calculator + Meta Pixel / CAPI / GA4 conversion tracking",
      "AI Appointment Setter — texts in seconds, then an AI voice call, qualifies & books",
      "CRM, calendar & booking flow — built and maintained by us",
      "All the technical infrastructure to deliver booked appointments, end to end",
    ],
    cta: "Get started",
    href: STRIPE_LINKS.tier1,
  },
  {
    name: "Tier 2 · Ops & Back-Office Automation",
    result: "Automate your operations, in sprints.",
    forWhom: "Sprint-built · you set the priorities",
    monthly: "$7,000",
    payback: "Pays for itself at ~2 closed installs / mo",
    features: [
      "Built in 2-week sprints — ~2 new automations / month, you set priority",
      "Finance & permitting operations automation",
      "CAD / system design + proposals, e-sign & scheduling (sold-to-installable)",
      "Dispatcher AI — routes, prioritizes & assigns leads by capacity",
      "Disposition — automatically re-engages dead leads after they go cold",
    ],
    cta: "Get started",
    href: STRIPE_LINKS.tier2,
    featured: true,
  },
  {
    name: "Tier 3 · Full Partnership",
    result: "Marketing, operations, and field — all of it.",
    forWhom: "Everything, one accountable partner",
    monthly: "$12,000+",
    payback: "Pays for itself at ~3 closed installs / mo",
    features: [
      "Everything in Tier 1 — marketing → booked appointments",
      "Everything in Tier 2 — operations automation, sprint-built",
      "Offset Canvassing — door-knocking GIS app + mobile CRM for your D2D team",
      "One accountable partner across your entire business",
    ],
    cta: "Get started",
    href: STRIPE_LINKS.tier3,
  },
];

function TierCard({ t, calcomUrl }: { t: Tier; calcomUrl: string }) {
  const border = t.featured ? "rgba(231,2,141,0.5)" : GLASS_BORDER;
  return (
    <Bevel bevel={16} border={border} bg={GLASS_BG} className="h-full">
      <div className="relative flex h-full flex-col p-6 sm:p-7">
        {t.featured && (
          <span className="bv-6 absolute right-5 top-5 bg-brand-pink/15 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-brand-pink">
            Recommended
          </span>
        )}
        {/* lead with the OUTCOME */}
        <div className="max-w-[15rem] text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink/45">{t.name}</div>
        <div className="font-display mt-2 max-w-[15rem] text-[1.3rem] font-normal leading-[1.15] tracking-tight">{t.result}</div>
        <div className="mt-1.5 text-[0.74rem] uppercase tracking-[0.12em] text-ink/35">{t.forWhom}</div>

        <div className="mt-5 flex items-end gap-1.5 border-t border-ink/10 pt-5">
          <span className="font-body text-[2.3rem] font-bold leading-none tracking-tight">{t.monthly}</span>
          <span className="pb-1 text-[0.8rem] text-ink/45">/mo</span>
        </div>

        {/* the ROI line */}
        <div className="bv-6 mt-3 inline-flex w-fit items-center gap-2 bg-ink/[0.05] px-3 py-1.5 text-[0.74rem] font-medium text-ink/75">
          <span aria-hidden className="h-3 w-px shrink-0 bg-gradient-to-b from-brand-pink to-brand-blue" />
          {t.payback}
        </div>

        <ul className="mt-6 flex flex-1 flex-col gap-2.5">
          {t.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[0.86rem] leading-snug text-ink/75">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-7">
          <Button
            href={t.href ?? calcomUrl}
            external
            variant={t.featured ? "primary" : "secondary"}
            className="w-full"
            aria-label={`${t.cta} — ${t.name}`}
          >
            {t.cta}
          </Button>
        </div>
      </div>
    </Bevel>
  );
}

export default function PricingSlide({ calcomUrl }: { calcomUrl: string }) {
  return (
    <Slide id="tl-gnrg-pricing">
      <div className="max-w-[46rem]">
        <Eyebrow>Pricing · ROI</Eyebrow>
        <Kinetic
          segments={[{ text: "Priced to " }, { text: "pay for itself.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            Three levels — from marketing that fills your calendar with booked appointments, to operations
            automation that runs your back office, to the full partnership that does both plus your
            door-to-door field team. Flat monthly retainer, no build fee.
          </p>
        </Reveal>
        <Reveal delay={0.22}>
          <div className="bv-6 mt-5 flex max-w-[44rem] items-start gap-2.5 bg-ink/[0.05] px-4 py-3 text-[0.92rem] leading-relaxed text-ink/70">
            <span aria-hidden className="mt-1 h-3.5 w-px shrink-0 bg-gradient-to-b from-brand-pink to-brand-blue" />
            <span>
              <span className="font-medium text-ink/90">Pays for itself.</span> Solar is high-ticket — one closed
              install is worth thousands in gross profit. At a typical margin, each tier breaks even at just one
              to three closed installs a month; everything above that is profit.
            </span>
          </div>
        </Reveal>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1} y={30} amount={0.12} className="h-full">
            <TierCard t={t} calcomUrl={calcomUrl} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <p className="mt-6 text-[0.92rem] text-ink/55">
          Prefer to talk it through first?{" "}
          <a
            href={calcomUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-brand-pink underline-offset-4 hover:underline"
          >
            Book a 15-minute call →
          </a>
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5">
          {["No build fee", "Flat monthly retainer", "Ad spend billed to you", "Live in ~3–4 weeks"].map((b) => (
            <span key={b} className="inline-flex items-center gap-2 text-[0.85rem] text-ink/65">
              <svg className="h-4 w-4 shrink-0 text-brand-pink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b}
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-4 max-w-[52rem] text-[0.74rem] leading-relaxed text-ink/35">
          ROI shown at an illustrative $5,000 gross profit per install — the logic holds at any realistic deal
          value. Ad spend is funded by GNRG and billed to your own ad account. AI usage (call minutes, SMS, APIs)
          folds into the retainer under a fair-use cap. Tier 3 firms from $12,000 after a short onboarding scope.
        </p>
      </Reveal>
    </Slide>
  );
}
