import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";

const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 21, suffix: "×", label: "more likely to qualify a lead when you respond within 5 minutes vs 30" },
  { value: 78, suffix: "%", label: "of customers buy from the company that responds to them first" },
  { value: 391, suffix: "%", label: "more conversions when a new lead is called within the first minute" },
  { value: 24, suffix: "/7", label: "leads arrive around the clock — human sales teams clock out" },
];

export default function ProblemSlide() {
  return (
    <Slide id="tl-gnrg-problem">
      <div className="max-w-[44rem]">
        <Eyebrow>The math</Eyebrow>
        <Kinetic
          segments={[{ text: "Solar leads are expensive — and most of them " }, { text: "leak away.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            Paid solar leads don&apos;t come cheap, and most teams waste them: a generic form, a callback hours
            later, a homeowner who is already talking to three other companies. In solar, the deal goes to
            whoever answers first — and a human team cannot answer first, every time, 24/7.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} y={26} amount={0.25} className="h-full">
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-5">
                <span
                  className="font-body bg-clip-text text-[2.3rem] font-bold leading-none tracking-tight text-transparent"
                  style={{ backgroundImage: BRAND_GRADIENT }}
                >
                  <CountUp value={s.value} suffix={s.suffix} />
                </span>
                <p className="mt-3 text-[0.85rem] leading-relaxed text-ink/55">{s.label}</p>
              </div>
            </Bevel>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="mt-5 text-[0.7rem] text-ink/30">Speed-to-lead research (Harvard Business Review · Lead Response Management). Figures vary by sector.</p>
      </Reveal>
    </Slide>
  );
}
