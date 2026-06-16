import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import Button from "../../../components/Button";
import { Kinetic, Reveal } from "../../../components/motion";

type Tier = {
  name: string;
  forWhom: string;
  monthly: string;
  setup: string;
  minutes: string;
  features: string[];
  cta: string;
  featured?: boolean;
  contact?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    forWhom: "Solo / small agency",
    monthly: "$399",
    setup: "$1,000 setup",
    minutes: "~500 talk-min / mo",
    features: ["24/7 inbound answering", "Smart call routing", "Live owner dashboard", "Texts insurance cards (SMS)", "1 dedicated number"],
    cta: "Get started",
  },
  {
    name: "Growth",
    forWhom: "Growing agency",
    monthly: "$799",
    setup: "$1,500 setup",
    minutes: "~1,500 talk-min / mo",
    features: [
      "Everything in Starter",
      "Caller identity verification",
      "Policy & billing lookup",
      "COI sending + claim (FNOL) intake",
      "Up to 4 department transfers",
      "Priority support",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Agency",
    forWhom: "Multi-location / high volume",
    monthly: "Custom",
    setup: "from $1,499 / mo",
    minutes: "High volume",
    features: ["Everything in Growth", "AMS / CRM integration", "Multiple agents & locations", "Custom workflows", "Dedicated success manager"],
    cta: "Contact sales",
    contact: true,
  },
];

function TierCard({ t, calcomUrl }: { t: Tier; calcomUrl: string }) {
  const border = t.featured ? "rgba(231,2,141,0.5)" : GLASS_BORDER;
  return (
    <Bevel bevel={16} border={border} bg={GLASS_BG} className="h-full">
      <div className="relative flex h-full flex-col p-6 sm:p-7">
        {t.featured && (
          <span className="bv-6 absolute right-5 top-5 bg-brand-pink/15 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-brand-pink">
            Most popular
          </span>
        )}
        <div className="font-display text-[1.3rem] font-normal tracking-tight">{t.name}</div>
        <div className="mt-1 text-[0.8rem] text-ink/45">{t.forWhom}</div>

        <div className="mt-5 flex items-end gap-1.5">
          <span className="font-body text-[2.4rem] font-bold leading-none tracking-tight">{t.monthly}</span>
          {t.monthly.startsWith("$") && <span className="pb-1 text-[0.8rem] text-ink/45">/mo</span>}
        </div>
        <div className="mt-1.5 text-[0.78rem] text-ink/45">{t.setup} · {t.minutes}</div>

        <ul className="mt-6 flex flex-1 flex-col gap-2.5">
          {t.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[0.88rem] leading-snug text-ink/75">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* TODO(stripe): replace href with onClick -> POST /api/checkout (Stripe Checkout Session)
            for the self-serve tiers. Stubbed to book-a-call for now. */}
        <div className="mt-7">
          <Button
            href={calcomUrl}
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
    <Slide id="tl-ins-pricing">
      <div className="max-w-[46rem]">
        <Eyebrow>Pricing</Eyebrow>
        <Kinetic
          segments={[{ text: "Done-for-you. Priced to " }, { text: "win.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
            Less than a part-time receptionist — fully built, integrated, and managed for your agency. No
            contracts; cancel anytime.
          </p>
        </Reveal>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1} y={30} amount={0.12} className="h-full">
            <TierCard t={t} calcomUrl={calcomUrl} />
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="mt-5 text-[0.74rem] text-ink/35">
          Additional minutes at $0.20/min. Numbers, carrier, and SMS pass-through billed at cost.
        </p>
      </Reveal>
    </Slide>
  );
}
