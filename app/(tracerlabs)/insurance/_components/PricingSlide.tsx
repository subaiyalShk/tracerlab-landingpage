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
    result: "Never miss a call.",
    forWhom: "Voice automation",
    monthly: "$1,500",
    setup: "$2,500 build",
    minutes: "~1,000 talk-min / mo",
    features: [
      "Every call answered in under two rings, 24/7",
      "Callers qualified, routed, and booked — no voicemail, no lost leads",
      "Texts insurance cards & documents on request",
      "1 dedicated number",
    ],
    cta: "Get started",
  },
  {
    name: "Growth",
    result: "See everything. Serve clients on autopilot.",
    forWhom: "Voice + live dashboard",
    monthly: "$3,000",
    setup: "$5,000 build",
    minutes: "~3,000 talk-min / mo",
    features: [
      "Everything in Starter, plus —",
      "Live dashboard: watch every call, transcript & action in real time",
      "Smart routing, caller verification, policy & billing lookups",
      "Automated payment reminders & status updates to clients (SMS)",
      "Fewer inbound “where’s my…” calls; full visibility into what clients want",
      "AMS / CRM integration",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Agency",
    result: "Your whole business on autopilot.",
    forWhom: "Complete automation",
    monthly: "$5,000+",
    setup: "from $7,500 build",
    minutes: "High volume · custom",
    features: [
      "Everything in Growth, plus —",
      "End-to-end: win prospects → serve clients → bill & invoice",
      "Bookings, payments, invoicing & online payments, fully automated",
      "Step-by-step SMS keeps clients updated and off the phone",
      "Replaces your patchwork of tools with one system",
      "Multi-location, dedicated team — you focus on scaling",
    ],
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
        {/* lead with the OUTCOME */}
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink/45">{t.name}</div>
        <div className="font-display mt-2 max-w-[15rem] text-[1.3rem] font-normal leading-[1.15] tracking-tight">{t.result}</div>
        <div className="mt-1.5 text-[0.74rem] uppercase tracking-[0.12em] text-ink/35">{t.forWhom}</div>

        <div className="mt-5 flex items-end gap-1.5 border-t border-ink/10 pt-5">
          <span className="font-body text-[2.3rem] font-bold leading-none tracking-tight">{t.monthly}</span>
          {t.monthly.startsWith("$") && <span className="pb-1 text-[0.8rem] text-ink/45">/mo</span>}
        </div>
        <div className="mt-1.5 text-[0.78rem] text-ink/45">{t.setup} · {t.minutes}</div>

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
    <Slide id="tl-ins-pricing" bgSrc="/assets/insurance/gen/pricing-v1.png" bgOpacity={0.24}>
      <div className="max-w-[46rem]">
        <Eyebrow>Pricing</Eyebrow>
        <Kinetic
          segments={[{ text: "Choose your " }, { text: "outcome.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
            Three levels of automation — from never missing a call, to total visibility into your customers,
            to running the entire business on autopilot. Custom-built and fully managed; no long-term contract.
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
          Additional minutes at $0.25/min. Numbers, carrier, and SMS pass-through billed at cost.
        </p>
      </Reveal>
    </Slide>
  );
}
