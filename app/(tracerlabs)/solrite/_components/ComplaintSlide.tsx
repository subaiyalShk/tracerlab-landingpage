import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const EXPLANATIONS = [
  { k: "Bad leads", v: "Renters. No real bill. Wrong numbers." },
  { k: "Good leads, poor conversion", v: "Reachable homeowners who don't buy." },
];

export default function ComplaintSlide() {
  return (
    <Slide id="tl-solrite-complaint">
      <div className="max-w-[46rem]">
        <Eyebrow>The complaint</Eyebrow>
        <KineticHeading
          segments={[{ text: "The leads " }, { text: "aren't closing.", gradient: true }]}
          className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {EXPLANATIONS.map((e, i) => (
          <SlideReveal key={e.k} delay={0.1 + i * 0.1}>
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-7">
                <span className="font-display text-[1.1rem] font-normal uppercase tracking-tight text-ink/90">
                  {e.k}
                </span>
                <p className="mt-3 text-[1rem] leading-relaxed text-ink/55">{e.v}</p>
              </div>
            </Bevel>
          </SlideReveal>
        ))}
      </div>

      <SlideReveal delay={0.32}>
        <p className="mt-10 text-[1.15rem] leading-relaxed text-ink/80">
          Nobody has tested which.
        </p>
      </SlideReveal>
    </Slide>
  );
}
