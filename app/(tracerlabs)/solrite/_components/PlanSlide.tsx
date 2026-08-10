import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const STEPS = [
  {
    n: "00",
    title: "Verify what is actually live",
    body: "Confirm the Meta lead webhook is running in production, count the leads that have genuinely arrived, and establish a baseline from real numbers before changing anything.",
  },
  {
    n: "01",
    title: "Send outcomes back to Meta",
    body: "Report each meaningful stage — reached, qualified as a homeowner, signed — back against the original lead ID, then move the campaign's optimisation goal off the form fill and onto that stage.",
    emphasis: "This is the step that changes what Meta buys.",
  },
  {
    n: "02",
    title: "Bring spend in, get unit economics out",
    body: "Pull ad spend nightly and put it alongside the funnel that already exists: cost per lead, cost per qualified lead, cost per signed deal, and return by campaign and ad set.",
  },
  {
    n: "03",
    title: "Harden the attribution",
    body: "Key reporting to stable campaign and ad set IDs so renaming an ad set stops splitting its history, and capture Meta click IDs on the website forms so paid traffic stops counting as ordinary website traffic.",
  },
  {
    n: "04",
    title: "Put it on a cadence",
    body: "A weekly read of cost per outcome by ad set, with agreed rules for what gets scaled and what gets cut. The reporting is only worth building if it changes what happens to the budget.",
  },
];

export default function PlanSlide() {
  return (
    <Slide id="tl-solrite-plan" padY="py-16" bgSrc="/assets/solrite/gen/plan-v1.png" bgOpacity={0.16}>
      <div className="max-w-[46rem]">
        <Eyebrow>The proposal</Eyebrow>
        <KineticHeading
          segments={[{ text: "Close the loop, " }, { text: "then price the funnel.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.15}>
          <p className="mt-5 max-w-[43rem] text-[1.02rem] leading-relaxed text-ink/55">
            Five steps, in this order. The sequence matters: step one changes what Meta buys, step two proves
            whether it worked.
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
