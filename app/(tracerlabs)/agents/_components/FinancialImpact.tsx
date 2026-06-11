import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const STATS: { label: string; big: string; sub: { k: string; v: string }[] }[] = [
  { label: "Cost Savings", big: "−59%", sub: [{ k: "Labor", v: "−59%" }, { k: "Operations", v: "−57%" }, { k: "Overhead", v: "−55%" }] },
  { label: "Revenue Growth", big: "↑", sub: [{ k: "Quarter over quarter", v: "Q1 → Q4" }] },
  { label: "Efficiency", big: "5×", sub: [{ k: "Response time", v: "5× faster" }, { k: "Task completion", v: "88%" }, { k: "Accuracy", v: "97%" }] },
  { label: "Return on Investment", big: "Mo 3", sub: [{ k: "Breakeven", v: "Month 3" }, { k: "Trajectory", v: "M1 → M10" }] },
];

export default function FinancialImpact() {
  return (
    <section id="tl-ag-impact" className="relative isolate w-full overflow-hidden bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>Financial impact</Eyebrow>
          <h2 className="font-display animate-rise mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight">What this means for your business</h2>
          <p className="animate-rise mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">Backed by real-world data from AI and automation adoption.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <Bevel key={s.label} bevel={14} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md">
              <div className="flex h-full flex-col p-6">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/40">{s.label}</div>
                <div className="font-display mt-3 bg-clip-text text-[2.6rem] leading-none text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>{s.big}</div>
                <ul className="mt-5 flex flex-col gap-2">
                  {s.sub.map((x) => (
                    <li key={x.k} className="flex items-center justify-between text-[0.82rem]">
                      <span className="text-ink/55">{x.k}</span><span className="font-medium text-ink/80">{x.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Bevel>
          ))}
        </div>
      </div>
    </section>
  );
}
