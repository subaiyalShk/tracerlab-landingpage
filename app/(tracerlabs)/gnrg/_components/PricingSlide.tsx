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
    name: "Tier 1 · Operations Automation",
    result: "Automate your lead-to-booking ops.",
    forWhom: "AI setter + CRM + SMS",
    monthly: "$5,000",
    payback: "Pays for itself at ~1 closed install / mo",
    features: [
      "AI Appointment Setter — texts in seconds, then an AI voice call",
      "Qualifies & books straight onto your calendar — no-answer retry built in",
      "AI Welcome Call Agent for new & booked customers",
      "GoHighLevel CRM integration + live admin dashboard",
      "Thank-you SMS + secure power-bill upload + instant team alerts",
    ],
    cta: "Get started",
    href: STRIPE_LINKS.tier1,
  },
  {
    name: "Tier 2 · + Back-Office Operations",
    result: "Run sold-to-installable on autopilot.",
    forWhom: "+ CAD, permitting & business automation",
    monthly: "$7,000",
    payback: "Pays for itself at ~2 closed installs / mo",
    features: [
      "Everything in Tier 1, plus —",
      "CAD / system design via Aurora Solar",
      "Permitting automation across your AHJs",
      "Proposals, e-sign, scheduling — full business automation",
      "Automated customer status updates, sold to installed",
    ],
    cta: "Get started",
    href: STRIPE_LINKS.tier2,
    featured: true,
  },
  {
    name: "Tier 3 · + Growth & Marketing",
    result: "Add the demand engine on top.",
    forWhom: "+ Ads, funnel & D2D canvassing",
    monthly: "$12,000+",
    payback: "Pays for itself at ~3 closed installs / mo",
    features: [
      "Everything in Tier 2, plus —",
      "Managed Meta ad campaigns + branded conversion funnel",
      "Solar savings calculator + Meta Pixel / CAPI / GA4 tracking",
      "Offset Canvassing — door-knocking GIS app + mobile CRM",
      "One accountable partner across the entire funnel",
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
            Three levels — from automating how you handle the leads you already get, to running your entire
            back office sold-to-installable, to adding the demand engine that fills the top of the funnel.
            Flat monthly retainer, no build fee.
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
