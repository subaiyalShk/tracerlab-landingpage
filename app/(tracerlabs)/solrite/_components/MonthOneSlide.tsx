import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const WEEKS = [
  {
    n: "WEEK 1",
    title: "Baseline",
    body: "Spark's funnel, reconciled against ad spend. True cost per qualified lead — Houston and Corpus Christi.",
  },
  {
    n: "WEEK 1–2",
    title: "Build",
    body: "Our funnel, live on its own domain. A proven build, not a first draft.",
  },
  {
    n: "WEEK 2",
    title: "Launch",
    body: "New ad set, matched budget, optimising for booked appointments from day one.",
  },
  {
    n: "WEEK 3–4",
    title: "Read",
    body: "Appointments and qualification rate, measured against the baseline.",
  },
];

export default function MonthOneSlide() {
  return (
    <Slide id="tl-solrite-month-one" padY="py-12">
      <div className="max-w-[48rem]">
        <Eyebrow>Month one</Eyebrow>
        <KineticHeading
          segments={[{ text: "One month. " }, { text: "One number.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9vw,4.4vw,3rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.12}>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/55">
            Nothing automated yet. Nothing rebuilt. Just the answer.
          </p>
        </SlideReveal>
      </div>

      <div className="mt-9 grid gap-4 lg:grid-cols-4">
        {WEEKS.map((w, i) => (
          <SlideReveal key={w.n} delay={0.18 + i * 0.08}>
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-5">
                <span className="font-display text-[0.72rem] font-bold tracking-[0.16em] text-brand-pink">
                  {w.n}
                </span>
                <h3 className="font-display mt-3 text-[1.05rem] font-normal uppercase leading-tight tracking-tight text-ink/90">
                  {w.title}
                </h3>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-ink/55">{w.body}</p>
              </div>
            </Bevel>
          </SlideReveal>
        ))}
      </div>

      <SlideReveal delay={0.5}>
        <p className="mt-8 max-w-[52rem] border-l-2 border-brand-pink/70 pl-6 text-[1.05rem] leading-relaxed text-ink/80">
          The existing campaigns keep running throughout. Nothing is switched off to make room.
        </p>
      </SlideReveal>
    </Slide>
  );
}
