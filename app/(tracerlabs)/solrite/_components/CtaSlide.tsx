import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Button from "../../../components/Button";
import SlideBackdrop from "./SlideBackdrop";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

// Live Stripe payment link for the Solrite setup fee — the same link sent to Jarom on
// 6 Aug 2026. Terms below must stay in step with it: $2,000 one-time setup fee, then
// $5,000/month from month 2, month to month.
const STRIPE_SETUP_FEE = "https://buy.stripe.com/14A3cu95EcgreKvbbTeEo0y";

const TERMS = [
  { k: "$2,000", v: "one-time setup fee — the only charge in month 1" },
  { k: "$5,000", v: "per month, beginning in month 2" },
  { k: "Month to month", v: "decide at the end of month one" },
];

export default function CtaSlide() {
  return (
    <section
      data-slide
      id="tl-solrite-cta"
      className="relative isolate flex min-h-[100dvh] w-full snap-start flex-col items-center justify-center overflow-hidden bg-page text-center text-ink"
    >
      <SlideBackdrop src="/assets/solrite/gen/cta-v1.png" opacity={0.24} />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[46vw] w-[56vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.4) 0%, rgba(5,106,252,0.2) 45%, transparent 72%)" }}
      />

      <div className="mx-auto w-full max-w-[900px] px-6 sm:px-10">
        <div className="flex justify-center">
          <Eyebrow>Get started</Eyebrow>
        </div>
        <KineticHeading
          as="h2"
          segments={[{ text: "Month one. " }, { text: "Then you decide.", gradient: true }]}
          className="font-display mt-6 text-[clamp(2rem,5.2vw,3.6rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-[40rem] text-[1.05rem] leading-relaxed text-ink/55">
            The baseline starts as soon as the setup fee lands.
          </p>
        </SlideReveal>

        <SlideReveal delay={0.22}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="mx-auto mt-9 max-w-[38rem]">
            <ul className="flex flex-col p-2">
              {TERMS.map((t) => (
                <li
                  key={t.k}
                  className="flex flex-wrap items-baseline justify-center gap-x-2.5 border-b border-ink/[0.07] px-5 py-3 last:border-b-0"
                >
                  <span className="font-body text-[1.05rem] font-semibold tracking-tight text-ink/90 tabular-nums">
                    {t.k}
                  </span>
                  <span className="text-[0.92rem] text-ink/55">{t.v}</span>
                </li>
              ))}
            </ul>
          </Bevel>
        </SlideReveal>

        <SlideReveal delay={0.3}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href={STRIPE_SETUP_FEE} variant="primary" external>
              Pay setup fee
            </Button>
          </div>
        </SlideReveal>
        <SlideReveal delay={0.36}>
          <p className="mt-5 text-[0.8rem] text-ink/35">
            Secure checkout via Stripe.
          </p>
        </SlideReveal>

        <SlideReveal delay={0.48}>
          <p className="mt-10 text-[0.72rem] uppercase tracking-[0.22em] text-ink/30">
            Tracerlabs × Solrite Energy
          </p>
        </SlideReveal>
      </div>
    </section>
  );
}
