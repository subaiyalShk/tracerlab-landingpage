import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, Kinetic, Reveal } from "../../../components/motion";

const SPARK_KNOWS = [
  "Did they reply to the first text",
  "Did a rep actually reach them",
  "Homeowner, or renting",
  "Power bill range",
  "Existing solar already installed",
  "Utility bill uploaded",
  "Proposal sent · agreement signed",
  "Or: wrong number, opted out, not interested",
];

export default function BlindSpotSlide() {
  return (
    <Slide id="tl-solrite-blindspot" bgSrc="/assets/solrite/gen/blindspot-v1.png" bgOpacity={0.18}>
      <div className="max-w-[46rem]">
        <Eyebrow>The gap</Eyebrow>
        <Kinetic
          segments={[{ text: "One of you knows what happened. " }, { text: "It isn't Meta.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Reveal y={26} amount={0.25} className="h-full">
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-7">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                What Meta currently knows
              </span>
              <div className="mt-7 flex items-baseline gap-3">
                <span
                  className="font-body bg-clip-text text-[2.6rem] font-bold leading-none tracking-tight text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  1
                </span>
                <span className="text-[1.05rem] text-ink/80">event · form submitted</span>
              </div>
              <p className="mt-auto pt-8 text-[0.92rem] leading-relaxed text-ink/50">
                Identical for every lead. The tyre-kicker and the signed customer are indistinguishable.
              </p>
            </div>
          </Bevel>
        </Reveal>

        <Reveal delay={0.12} y={26} amount={0.25} className="h-full">
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-7">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                What Spark already knows
              </span>
              <ul className="mt-5 flex flex-col">
                {SPARK_KNOWS.map((k) => (
                  <li
                    key={k}
                    className="flex items-start gap-3 border-b border-ink/[0.07] py-2.5 text-[0.92rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </Reveal>
      </div>
    </Slide>
  );
}
