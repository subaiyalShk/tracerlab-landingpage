import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const STEPS = [
  { k: "Reached", v: "How many of the 403 ever replied or answered a call" },
  { k: "Qualified", v: "How many were homeowners with a real bill and no existing solar" },
  { k: "Progressed", v: "How many uploaded a bill, took a proposal, signed" },
  { k: "Split by market", v: "The same funnel for Houston, Corpus Christi and Illinois, side by side" },
];

export default function ProveFirstSlide() {
  return (
    <Slide id="tl-solrite-prove" padY="py-16">
      <div className="max-w-[46rem]">
        <Eyebrow>Before we build anything</Eyebrow>
        <KineticHeading
          segments={[{ text: "First we settle " }, { text: "the argument.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.12}>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/55">
            Spark already stores every one of those 403 leads against Meta&apos;s own lead ID, and already
            tracks what happened to each. Nobody has run that query. It needs no new tracking, no new build,
            and no change to a live campaign.
          </p>
        </SlideReveal>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <SlideReveal key={s.k} delay={0.18 + i * 0.07}>
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-5">
                <span className="font-display text-[0.98rem] font-normal uppercase tracking-tight text-ink/90">
                  {s.k}
                </span>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-ink/55">{s.v}</p>
              </div>
            </Bevel>
          </SlideReveal>
        ))}
      </div>

      <SlideReveal delay={0.48}>
        <div className="mt-8 max-w-[54rem] border-l-2 border-brand-pink/70 pl-6">
          <p className="text-[1.04rem] leading-relaxed text-ink/80">
            If they die before a rep ever reaches them, it is lead quality and the way Meta is being told to
            buy. If they are reachable homeowners who do not convert, it is the sales motion — and no amount
            of ad work will fix that.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/50">
            Either way you stop guessing, using data you already own.
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
