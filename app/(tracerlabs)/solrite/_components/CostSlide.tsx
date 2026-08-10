import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

const PAIR = [
  {
    label: "Ad set A",
    cpl: "Identical cost per lead",
    outcome: "Fills the pipeline with homeowners",
    tone: "good",
  },
  {
    label: "Ad set B",
    cpl: "Identical cost per lead",
    outcome: "Fills it with renters and wrong numbers",
    tone: "bad",
  },
];

export default function CostSlide() {
  return (
    <Slide id="tl-solrite-cost" bgSrc="/assets/solrite/gen/cost-v1.png" bgOpacity={0.2}>
      <div className="max-w-[46rem]">
        <Eyebrow>The business cost</Eyebrow>
        <Kinetic
          segments={[
            { text: "Scale and kill decisions are being made on the " },
            { text: "wrong number.", gradient: true },
          ]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-[43rem] text-[1.02rem] leading-relaxed text-ink/55">
            Today it is possible to rank ad sets by cost per lead. It is not possible to rank them by cost per
            customer — because ad spend never enters the system, and the outcome never leaves it.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {PAIR.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.12} y={26} amount={0.25} className="h-full">
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-7">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                  {p.label}
                </span>
                <p className="mt-4 text-[1.15rem] font-semibold text-ink/85">{p.cpl}</p>
                <p
                  className={`mt-5 text-[0.98rem] leading-relaxed ${
                    p.tone === "good" ? "text-ink/70" : "text-brand-pink"
                  }`}
                >
                  {p.outcome}
                </p>
              </div>
            </Bevel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.28}>
        <p className="mt-8 max-w-[46rem] text-[1.02rem] leading-relaxed text-ink/55">
          On the current reporting these two look identical, and the budget gets split as though they are.
          Every week that runs, Meta is being trained on the wrong definition of success.
        </p>
      </Reveal>
    </Slide>
  );
}
