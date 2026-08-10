import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const EXPLANATIONS = [
  {
    k: "The leads are wrong",
    v: "Renters, no real bill, wrong numbers. Meta is buying the cheapest form fill it can find, so quality drifts down as spend goes up.",
  },
  {
    k: "The leads are fine",
    v: "Reachable homeowners with real bills who are not being converted. That is a sales and process problem, not a traffic problem.",
  },
];

export default function ComplaintSlide() {
  return (
    <Slide id="tl-solrite-complaint">
      <div className="max-w-[46rem]">
        <Eyebrow>The complaint</Eyebrow>
        <KineticHeading
          segments={[{ text: "The leads " }, { text: "aren't closing.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.6vw,3.1rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.12}>
          <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/55">
            Two explanations dominate, and they lead to completely different work. Both are testable; right now neither is being tested.
          </p>
        </SlideReveal>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {EXPLANATIONS.map((e, i) => (
          <SlideReveal key={e.k} delay={0.18 + i * 0.1}>
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-7">
                <span className="font-display text-[1.05rem] font-normal uppercase tracking-tight text-ink/90">
                  {e.k}
                </span>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/55">{e.v}</p>
              </div>
            </Bevel>
          </SlideReveal>
        ))}
      </div>

      <SlideReveal delay={0.4}>
        <div className="mt-8 max-w-[52rem] border-l-2 border-brand-pink/70 pl-6">
          <p className="text-[1.06rem] leading-relaxed text-ink/80">
            Spark can already answer it. For every lead Meta billed for, it holds whether they replied,
            whether a rep ever spoke to them, whether they owned the roof, and how far they got — down to
            the ad set that produced them.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/50">
            What has never happened is setting that against what the ads cost. That is where this starts.
            Not with a build, with an answer.
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
