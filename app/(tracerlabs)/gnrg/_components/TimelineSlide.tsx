import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

const PHASES = [
  {
    week: "Week 1",
    title: "Kickoff & access",
    body: "We collect brand assets, configure your market and service area, and connect your CRM, ad account, calendar, and tracking pixels.",
  },
  {
    week: "Weeks 2–3",
    title: "Built & wired",
    body: "Your funnel goes live in staging, solar math is tuned to your market, the AI agents are configured on live numbers, and tracking is verified.",
  },
  {
    week: "Week 4",
    title: "Go live",
    body: "Ads on, funnel converting, AI booking. Fully managed and optimized from there. Tier 3 operations (canvassing, CAD, permitting) phase in next.",
  },
];

export default function TimelineSlide() {
  return (
    <Slide id="tl-gnrg-timeline">
      <div className="max-w-[46rem]">
        <Eyebrow>Getting started</Eyebrow>
        <Kinetic
          segments={[{ text: "Live in " }, { text: "weeks, not months.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            No build fee, no long discovery. The system is already built — onboarding is configuration and
            connection, not construction. Tiers 1–2 are live in roughly three to four weeks.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PHASES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.12} y={30} amount={0.15} className="h-full">
            <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="bv-6 flex h-9 w-9 shrink-0 items-center justify-center bg-ink/[0.06] font-display text-[1.05rem] font-medium">
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#e7028d,#056afc)" }}>{i + 1}</span>
                  </span>
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink/45">{p.week}</span>
                </div>
                <h3 className="font-display mt-4 text-[1.25rem] font-normal leading-tight tracking-tight">{p.title}</h3>
                <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink/55">{p.body}</p>
              </div>
            </Bevel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.18}>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5">
          {["No build fee", "Flat monthly retainer", "Ad spend billed to you", "3-month minimum (6 for Tier 3)"].map((b) => (
            <span key={b} className="inline-flex items-center gap-2 text-[0.85rem] text-ink/65">
              <svg className="h-4 w-4 shrink-0 text-brand-pink" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b}
            </span>
          ))}
        </div>
      </Reveal>
    </Slide>
  );
}
