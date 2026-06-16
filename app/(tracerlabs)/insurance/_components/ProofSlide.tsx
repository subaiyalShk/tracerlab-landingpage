import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { CountUp, Kinetic, Reveal } from "../../../components/motion";

type Stat = { value: number; prefix?: string; suffix?: string; k: string };
type Case = { badge: string; origin: string; live: boolean; title: string; line: string; stats: Stat[] };

const CASES: Case[] = [
  {
    badge: "Inbound · prospect calls",
    origin: "Real client · anonymized",
    live: true,
    title: "A family-run farm & butcher",
    line: "Orders came by phone while the team worked the floor; after-hours calls went to voicemail. The agent now answers every one and books pickups.",
    stats: [
      { value: 100, suffix: "%", k: "Calls answered" },
      { value: 2, prefix: "~", suffix: " in 5", k: "Were after-hours" },
      { value: 20, prefix: "~", suffix: " hrs/wk", k: "Phone time back" },
    ],
  },
  {
    badge: "Support · existing clients",
    origin: "Illustrative scenario",
    live: false,
    title: "A personal-lines insurance agency",
    line: "Clients call all day for cards, billing, COIs, and claims. The agent verifies them, handles the routine, and routes the rest — every step logged.",
    stats: [
      { value: 70, suffix: "%", k: "Routine calls handled" },
      { value: 24, suffix: "/7", k: "Service coverage" },
      { value: 2, prefix: "<", suffix: " rings", k: "To pick up" },
    ],
  },
];

export default function ProofSlide() {
  return (
    <Slide id="tl-ins-proof">
      <div className="max-w-[46rem]">
        <Eyebrow>Proof</Eyebrow>
        <Kinetic
          segments={[{ text: "Two owners. Two problems. " }, { text: "One system.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>
      <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {CASES.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.12} y={30} amount={0.15} className="h-full">
            <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-pink">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                    {c.badge}
                  </span>
                  <span className="text-ink/20">·</span>
                  <span className="bv-6 inline-flex items-center gap-1.5 bg-ink/[0.05] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink/50">
                    <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${c.live ? "bg-brand-pink" : "bg-ink/30"}`} />
                    {c.origin}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-[1.35rem] font-normal leading-tight tracking-tight">{c.title}</h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-ink/55">{c.line}</p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink/35">Impact</span>
                  <span className="bv-6 bg-ink/[0.05] px-1.5 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-ink/40">Illustrative</span>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
                  {c.stats.map((s) => (
                    <div key={s.k} className="flex flex-col">
                      <dd className="font-body order-1 text-[1.25rem] font-bold leading-none tracking-tight tabular-nums">
                        <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                      </dd>
                      <dt className="order-2 mt-1.5 text-[0.58rem] uppercase tracking-wide text-ink/40">{s.k}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </Bevel>
          </Reveal>
        ))}
      </div>
    </Slide>
  );
}
