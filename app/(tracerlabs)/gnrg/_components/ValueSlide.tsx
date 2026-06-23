import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";

type Pkg = {
  tier: string;
  name: string;
  hours: number;
  hoursNote: string;
  money: string;
  moneyNote: string;
  driver: string;
  featured?: boolean;
};

const PKGS: Pkg[] = [
  {
    tier: "Tier 1",
    name: "Operations Automation",
    hours: 100,
    hoursNote: "an AI setter doing a full-time rep's calling & texting, 24/7",
    money: "More closes",
    moneyNote: "instant 24/7 follow-up wins the deals slow human callbacks lose",
    driver: "AI contacts every lead in seconds and books it — no lead ever goes cold.",
  },
  {
    tier: "Tier 2",
    name: "+ Back-Office Operations",
    hours: 250,
    hoursNote: "+ CAD, permitting & paperwork, sold to installable (on top of Tier 1)",
    money: "Cash, sooner",
    moneyNote: "automated design & permitting cut weeks off install — collect faster, do more jobs",
    driver: "Every sold deal moves to installable on autopilot — design, permits, scheduling.",
    featured: true,
  },
  {
    tier: "Tier 3",
    name: "+ Growth & Marketing",
    hours: 290,
    hoursNote: "+ ad, funnel & canvassing management (on top of all of the above)",
    money: "$225K / mo",
    moneyNote: "revenue at 75× ROAS — managed ads + funnel + D2D fill the pipeline",
    driver: "The demand engine: managed ads, a converting funnel, and door-to-door canvassing.",
  },
];

function PkgCard({ p }: { p: Pkg }) {
  const border = p.featured ? "rgba(231,2,141,0.5)" : GLASS_BORDER;
  return (
    <Bevel bevel={16} border={border} bg={GLASS_BG} className="h-full">
      <div className="relative flex h-full flex-col p-6 sm:p-7">
        {p.featured && (
          <span className="bv-6 absolute right-5 top-5 bg-brand-pink/15 px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-brand-pink">
            Recommended
          </span>
        )}
        <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/45">{p.tier}</div>
        <div className="font-display mt-1.5 text-[1.2rem] font-normal leading-tight tracking-tight">{p.name}</div>

        {/* time saved */}
        <div className="mt-6 border-t border-ink/10 pt-5">
          <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink/40">Time saved</div>
          <div className="mt-1.5 flex items-end gap-1.5">
            <span
              className="font-body bg-clip-text text-[2.2rem] font-bold leading-none tracking-tight text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              <CountUp value={p.hours} suffix={p.tier === "Tier 3" ? "+" : ""} />
            </span>
            <span className="pb-1 text-[0.78rem] text-ink/45">hrs / mo</span>
          </div>
          <p className="mt-1.5 text-[0.8rem] leading-snug text-ink/50">{p.hoursNote}</p>
        </div>

        {/* extra money made */}
        <div className="mt-5 border-t border-ink/10 pt-5">
          <div className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink/40">Extra money made</div>
          <div className="font-body mt-1.5 text-[1.75rem] font-bold leading-none tracking-tight">{p.money}</div>
          <p className="mt-1.5 text-[0.8rem] leading-snug text-ink/50">{p.moneyNote}</p>
        </div>

        <p className="mt-5 flex-1 text-[0.86rem] leading-relaxed text-ink/70">{p.driver}</p>
      </div>
    </Bevel>
  );
}

export default function ValueSlide() {
  return (
    <Slide id="tl-gnrg-value">
      <div className="max-w-[46rem]">
        <Eyebrow>What you get back</Eyebrow>
        <Kinetic
          segments={[{ text: "Every tier gives back " }, { text: "more than it costs.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            Two returns on every package: the hours your team stops spending on manual work, and the revenue the
            system makes that you would otherwise leave on the table.
          </p>
        </Reveal>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PKGS.map((p, i) => (
          <Reveal key={p.tier} delay={i * 0.1} y={30} amount={0.12} className="h-full">
            <PkgCard p={p} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-5 max-w-[52rem] text-[0.72rem] leading-relaxed text-ink/35">
          Illustrative, at $3K/mo ad spend and the funnel math on the previous slide. Hours saved estimate the
          manual ad, follow-up, and back-office work the services replace. Tier benefits are cumulative — each
          tier includes everything below it.
        </p>
      </Reveal>
    </Slide>
  );
}
