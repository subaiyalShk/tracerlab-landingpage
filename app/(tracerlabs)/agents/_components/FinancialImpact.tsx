import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";
import RevenueBars from "./RevenueBars";

// Server component — the animated bits (Kinetic/Reveal/CountUp/RevenueBars) are client
// leaves; the section markup and data ship as server HTML.

type Headline =
  | { kind: "count"; value: number; prefix?: string; suffix?: string }
  | { kind: "bars" }; // Q1→Q4 revenue staircase

const STATS: { label: string; head: Headline; sub: { k: string; v: string }[] }[] = [
  { label: "Cost Savings", head: { kind: "count", value: 59, prefix: "−", suffix: "%" }, sub: [{ k: "Labor", v: "−59%" }, { k: "Operations", v: "−57%" }, { k: "Overhead", v: "−55%" }] },
  { label: "Revenue Growth", head: { kind: "bars" }, sub: [{ k: "Quarter over quarter", v: "Q1 → Q4" }] },
  { label: "Efficiency", head: { kind: "count", value: 5, suffix: "×" }, sub: [{ k: "Response time", v: "5× faster" }, { k: "Task completion", v: "88%" }, { k: "Accuracy", v: "97%" }] },
  { label: "Return on Investment", head: { kind: "count", value: 3, prefix: "Mo " }, sub: [{ k: "Breakeven", v: "Month 3" }, { k: "Trajectory", v: "M1 → M10" }] },
];

export default function FinancialImpact() {
  return (
    <section id="tl-ag-impact" className="relative isolate w-full overflow-hidden bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>Financial impact</Eyebrow>
          <Kinetic
            segments={[{ text: "What this means for your " }, { text: "business.", gradient: true }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">Backed by real-world data from AI and automation adoption.</p>
          </Reveal>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} y={28} amount={0.25} className="h-full">
              <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
                <div className="flex h-full flex-col p-6">
                  <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/40">{s.label}</div>
                  <div className="mt-3 flex h-[2.6rem] items-end">
                    {s.head.kind === "bars" ? (
                      <RevenueBars />
                    ) : (
                      <span className="font-body bg-clip-text text-[2.4rem] font-bold leading-none tracking-tight text-transparent" style={{ backgroundImage: BRAND_GRADIENT }}>
                        <CountUp value={s.head.value} prefix={s.head.prefix} suffix={s.head.suffix} />
                      </span>
                    )}
                  </div>
                  <ul className="mt-5 flex flex-col gap-2">
                    {s.sub.map((x) => (
                      <li key={x.k} className="flex items-center justify-between text-[0.82rem]">
                        <span className="text-ink/55">{x.k}</span><span className="font-medium text-ink/80">{x.v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Bevel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
