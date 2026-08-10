import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Illustration from "./Illustration";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const PAIR = [
  { label: "Ad set A", cpl: "Identical cost per lead", outcome: "Fills the pipeline with homeowners", tone: "good" },
  { label: "Ad set B", cpl: "Identical cost per lead", outcome: "Fills it with renters and wrong numbers", tone: "bad" },
];

export default function CostSlide() {
  return (
    <Slide id="tl-solrite-cost">
      <div className="max-w-[46rem]">
        <Eyebrow>The business cost</Eyebrow>
        <KineticHeading
          segments={[
            { text: "Scale and kill decisions are being made on the " },
            { text: "wrong number.", gradient: true },
          ]}
          className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.15}>
          <p className="mt-5 max-w-[43rem] text-[1.02rem] leading-relaxed text-ink/55">
            Today it is possible to rank ad sets by cost per lead. It is not possible to rank them by cost per
            customer — because ad spend never enters the system, and the outcome never leaves it.
          </p>
        </SlideReveal>
      </div>

      <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-[1fr_1fr]">
        <SlideReveal y={26} className="h-full">
          <Illustration
            src="/assets/solrite/gen/il-cost-v1.png"
            alt="Two identical price tags, one leading down to a solar-panelled house and the other to an empty plot of dirt."
            minH="min-h-[230px]"
          />
        </SlideReveal>

        <div className="flex flex-col gap-4">
          {PAIR.map((p, i) => (
            <SlideReveal key={p.label} delay={0.1 + i * 0.1} y={26}>
              <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG}>
                <div className="flex flex-col p-5">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                    {p.label}
                  </span>
                  <p className="mt-2.5 text-[1.05rem] font-semibold text-ink/85">{p.cpl}</p>
                  <p
                    className={`mt-2.5 text-[0.94rem] leading-relaxed ${
                      p.tone === "good" ? "text-ink/70" : "text-brand-pink"
                    }`}
                  >
                    {p.outcome}
                  </p>
                </div>
              </Bevel>
            </SlideReveal>
          ))}
        </div>
      </div>

      <SlideReveal delay={0.3}>
        <p className="mt-7 max-w-[46rem] text-[0.98rem] leading-relaxed text-ink/55">
          On the current reporting these two look identical, and the budget gets split as though they are.
          Every week that runs, Meta is being trained on the wrong definition of success.
        </p>
      </SlideReveal>
    </Slide>
  );
}
