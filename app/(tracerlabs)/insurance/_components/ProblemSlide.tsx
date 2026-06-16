import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";

const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 62, suffix: "%", label: "of calls to small businesses go unanswered" },
  { value: 85, suffix: "%", label: "of callers who can't reach you never call back" },
  { value: 40, suffix: "%", label: "of calls come after hours, when the office is closed" },
  { value: 21, suffix: "×", label: "more likely to win a lead if you answer within 5 minutes" },
];

export default function ProblemSlide() {
  return (
    <Slide id="tl-ins-problem">
      <div className="max-w-[44rem]">
        <Eyebrow>The leak</Eyebrow>
        <Kinetic
          segments={[{ text: "Your phone is your pipeline — and it's " }, { text: "leaking.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
            New quotes and existing-client service both come in by phone — for cards, billing, COIs, and
            claims. When a licensed agent is on another line or it&apos;s after hours, the caller doesn&apos;t
            wait. They dial the next agency.
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
        <p className="mt-5 text-[0.7rem] text-ink/30">Industry estimates; figures vary by sector.</p>
      </Reveal>
    </Slide>
  );
}
