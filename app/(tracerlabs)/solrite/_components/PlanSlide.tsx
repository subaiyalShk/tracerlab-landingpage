import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const STEPS = [
  {
    n: "00",
    title: "Settle the argument",
    body: "One reconciliation, by hand. Lead problem or sales problem — answered.",
  },
  {
    n: "01",
    title: "Send outcomes back to Meta",
    body: "Report outcomes back against the lead ID. Switch the goal off form fills.",
    emphasis: "Changes what Meta buys.",
  },
  {
    n: "02",
    title: "Put a cost on every stage",
    body: "Automate it. Nightly spend, cost per qualified lead by ad set.",
  },
  {
    n: "03",
    title: "Stop the numbers drifting",
    body: "Key to IDs, not names. Capture click IDs on the site.",
  },
  {
    n: "04",
    title: "Prove it head to head",
    body: "Our funnel runs as a second ad set, matched budget. Head to head.",
  },
];

export default function PlanSlide() {
  return (
    <Slide id="tl-solrite-plan" padY="py-16" bgSrc="/assets/solrite/gen/plan-v1.png" bgOpacity={0.16}>
      <div className="max-w-[46rem]">
        <Eyebrow>The proposal</Eyebrow>
        <KineticHeading
          segments={[{ text: "Close the loop. " }, { text: "Then measure it in dollars.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.15}>
          <p className="mt-5 max-w-[43rem] text-[1.02rem] leading-relaxed text-ink/55">
            Five steps. Nothing bet on a hunch.
          </p>
        </SlideReveal>
      </div>

      <div className="mt-9 grid gap-4 lg:grid-cols-5">
        {STEPS.map((s, i) => (
          <SlideReveal key={s.n} delay={i * 0.08} y={26} className="h-full">
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-5">
                <span className="font-display text-[0.78rem] font-bold tracking-[0.18em] text-brand-pink">
                  {s.n}
                </span>
                <h3 className="font-display mt-3 text-[1.02rem] font-normal uppercase leading-tight tracking-tight text-ink/90">
                  {s.title}
                </h3>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-ink/55">{s.body}</p>
                {s.emphasis && (
                  <p className="mt-auto pt-4 text-[0.85rem] font-medium leading-relaxed text-ink/80">
                    {s.emphasis}
                  </p>
                )}
              </div>
            </Bevel>
          </SlideReveal>
        ))}
      </div>
    </Slide>
  );
}
