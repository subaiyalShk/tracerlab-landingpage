import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";

// Server section; CountUp is a client leaf. Numbers here are REAL industry figures (sourced
// below) — they carry the credibility so the case-study impact numbers can stay illustrative.
const STATS: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }[] = [
  { value: 62, suffix: "%", label: "of calls to small businesses go unanswered" },
  { value: 85, suffix: "%", label: "of callers who can't reach you never call back" },
  { value: 40, suffix: "%", label: "of calls come after hours, when no one's there" },
  { value: 21, suffix: "×", label: "more likely to win a lead if you answer within 5 minutes" },
];

export default function ProblemStats() {
  return (
    <section id="tl-va-problem" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>The cost of a missed call</Eyebrow>
          <Kinetic
            segments={[{ text: "Every missed call is a " }, { text: "customer lost.", gradient: true }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
              The phone still drives most of the revenue for service businesses — and most of it leaks
              away the moment no one picks up. The caller doesn&apos;t wait; they dial a competitor.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} y={28} amount={0.25} className="h-full">
              <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
                <div className="flex h-full flex-col p-6">
                  <span
                    className="font-body bg-clip-text text-[2.6rem] font-bold leading-none tracking-tight text-transparent"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                  </span>
                  <p className="mt-4 text-[0.9rem] leading-relaxed text-ink/55">{s.label}</p>
                </div>
              </Bevel>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-6 text-[0.72rem] leading-relaxed text-ink/30">
            Sources:{" "}
            <a href="https://www.getaira.io/blog/missed-business-calls-statistics" target="_blank" rel="noopener noreferrer" className="underline decoration-ink/20 underline-offset-2 hover:text-ink/50">
              missed-call &amp; call-back data
            </a>
            ,{" "}
            <a href="https://www.amplemarket.com/blog/how-to-win-deals-faster-speed-to-lead-statistics-you-need-to-know" target="_blank" rel="noopener noreferrer" className="underline decoration-ink/20 underline-offset-2 hover:text-ink/50">
              speed-to-lead research
            </a>
            . Industry estimates; figures vary by sector.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
