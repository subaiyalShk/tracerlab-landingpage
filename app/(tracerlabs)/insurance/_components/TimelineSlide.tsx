import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

const PHASES = [
  {
    week: "Weeks 1–2",
    title: "Your number",
    body: "We spin up a dedicated line — or port your existing number so your clients keep calling the one they already know. Porting takes about two weeks.",
  },
  {
    week: "Weeks 1–2 · in parallel",
    title: "Built around your business",
    body: "We map the workflows your business runs on and learn your SOPs, then build and train your agent around exactly how you operate.",
  },
  {
    week: "Weeks 3–4",
    title: "Go live",
    body: "Your agent answers every call, 24/7 — and you watch it all on the dashboard. Fully managed and continuously improved from there.",
  },
];

export default function TimelineSlide() {
  return (
    <Slide id="tl-ins-timeline" bgSrc="/assets/insurance/gen/timeline-v1.png" bgOpacity={0.26}>
      <div className="max-w-[46rem]">
        <Eyebrow>How it works</Eyebrow>
        <Kinetic
          segments={[{ text: "Live in " }, { text: "weeks, not months.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            We do the heavy lifting. Two tracks run in parallel for the first couple of weeks, then your
            agent goes live — with no disruption to how your clients reach you.
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
    </Slide>
  );
}
