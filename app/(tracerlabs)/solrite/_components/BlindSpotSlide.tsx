import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import { BRAND_GRADIENT } from "../../../components/motion";
import Illustration from "./Illustration";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

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
    <Slide id="tl-solrite-blindspot">
      <div className="max-w-[46rem]">
        <Eyebrow>The gap</Eyebrow>
        <KineticHeading
          segments={[{ text: "One of you knows what happened. " }, { text: "It isn't Meta.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>

      <div className="mt-9 grid items-stretch gap-5 lg:grid-cols-3">
        <SlideReveal y={26} className="h-full">
          <Illustration
            src="/assets/solrite/gen/il-gap-v1.png"
            alt="One lone lit bar on the left, a dense cluster of lit bars on the right — one signal against many."
            minH="min-h-[220px]"
          />
        </SlideReveal>

        <SlideReveal delay={0.1} y={26} className="h-full">
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                What Meta knows
              </span>
              <div className="mt-6 flex items-baseline gap-3">
                <span
                  className="font-body bg-clip-text text-[2.4rem] font-bold leading-none tracking-tight text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  1
                </span>
                <span className="text-[1rem] text-ink/80">event</span>
              </div>
              <p className="mt-3 text-[0.9rem] text-ink/60">Form submitted.</p>
              <p className="mt-auto pt-6 text-[0.88rem] leading-relaxed text-ink/50">
                Identical for every lead. The tyre-kicker and the signed customer are indistinguishable.
              </p>
            </div>
          </Bevel>
        </SlideReveal>

        <SlideReveal delay={0.18} y={26} className="h-full">
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                What Spark already knows
              </span>
              <ul className="mt-4 flex flex-col">
                {SPARK_KNOWS.map((k) => (
                  <li
                    key={k}
                    className="flex items-start gap-2.5 border-b border-ink/[0.07] py-2 text-[0.86rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>
      </div>
    </Slide>
  );
}
