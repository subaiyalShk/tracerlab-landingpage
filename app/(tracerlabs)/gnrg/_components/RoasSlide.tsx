import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";

// The funnel math, anchored to Southern Energy's live cost-per-booked-consultation ($81).
// $3,000 / $81 ≈ 37 consults → ~24% close → 9 installs → ~$25k each → $225,000 → 75× ROAS.
const STEPS: { value: number; prefix?: string; suffix?: string; label: string; sub: string; featured?: boolean }[] = [
  { value: 3000, prefix: "$", label: "Ad spend / mo", sub: "funded by you, billed to your account" },
  { value: 37, label: "Booked consultations", sub: "at $81 each — our live cost-per-consult" },
  { value: 9, label: "Closed installs", sub: "at a ~24% consultation-to-close rate" },
  { value: 225000, prefix: "$", label: "In revenue / mo", sub: "at a ~$25K average system", featured: true },
];

export default function RoasSlide() {
  return (
    <Slide id="tl-gnrg-roas">
      <div className="max-w-[46rem]">
        <Eyebrow>Return on ad spend</Eyebrow>
        <Kinetic
          segments={[{ text: "$3K in ads. " }, { text: "$225K back.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            This is not a projection pulled from the air — it is the funnel math, built on our live
            cost-per-booked-consultation. Every dollar of ad spend runs through the same machine.
          </p>
        </Reveal>
      </div>

      {/* the funnel math chain */}
      <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STEPS.map((s, i) => {
          const border = s.featured ? "rgba(231,2,141,0.5)" : GLASS_BORDER;
          return (
            <Reveal key={s.label} delay={i * 0.1} y={26} amount={0.2} className="h-full">
              <Bevel bevel={14} border={border} bg={GLASS_BG} className="h-full">
                <div className="flex h-full flex-col p-5">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-ink/35">Step {i + 1}</span>
                  <span
                    className="font-body mt-2 bg-clip-text text-[2.1rem] font-bold leading-none tracking-tight text-transparent"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </span>
                  <span className="mt-2 text-[0.92rem] font-medium text-ink/80">{s.label}</span>
                  <span className="mt-1 text-[0.78rem] leading-snug text-ink/45">{s.sub}</span>
                </div>
              </Bevel>
            </Reveal>
          );
        })}
      </div>

      {/* the ROAS conclusion */}
      <Reveal delay={0.15} y={28} amount={0.2} className="mt-5">
        <Bevel bevel={18} border="rgba(231,2,141,0.5)" bg={GLASS_BG}>
          <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:gap-8 sm:p-8 sm:text-left">
            <div className="flex items-end gap-2">
              <span
                className="font-body bg-clip-text text-[4.5rem] font-bold leading-[0.85] tracking-tight text-transparent"
                style={{ backgroundImage: BRAND_GRADIENT }}
              >
                <CountUp value={75} suffix="×" />
              </span>
              <span className="pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink/45">ROAS</span>
            </div>
            <div className="sm:border-l sm:border-ink/10 sm:pl-8">
              <p className="font-display text-[1.35rem] font-normal leading-tight tracking-tight">
                $75 in revenue for every $1 of ad spend.
              </p>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/55">
                $225,000 in revenue against $3,000 in ad spend — the full marketing engine (Tier 1),
                working every lead the moment it lands.
              </p>
            </div>
          </div>
        </Bevel>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-4 max-w-[52rem] text-[0.72rem] leading-relaxed text-ink/35">
          Modeled from Southern Energy&apos;s live $81 cost-per-booked-consultation. Consultation-to-close rate
          (~24%) and average system value (~$25K) are illustrative assumptions — your numbers will vary with
          market, offer, and sales team. Ad spend is funded by GNRG.
        </p>
      </Reveal>
    </Slide>
  );
}
