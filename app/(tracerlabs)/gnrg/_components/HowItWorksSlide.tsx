import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

const STEPS = [
  {
    title: "A lead lands",
    body: "From your ads, a 60-second savings funnel, or a rep at the door — every lead drops into one pipeline, bad-fit ones filtered but still captured.",
  },
  {
    title: "Captured → contacted in seconds",
    body: "The moment they submit, an AI agent texts them — then places a natural-voice AI call before the lead ever goes cold.",
  },
  {
    title: "AI qualifies & books",
    body: "The agent qualifies the lead, handles objections, and books the appointment straight onto your calendar — retrying no-answers for days.",
  },
  {
    title: "CRM, bill & nurture",
    body: "Everything lands in your CRM, the power bill is collected, your team is alerted by SMS, and nurture runs automatically.",
  },
];

export default function HowItWorksSlide() {
  return (
    <Slide id="tl-gnrg-how">
      <div className="max-w-[46rem]">
        <Eyebrow>How it works</Eyebrow>
        <Kinetic
          segments={[{ text: "Every lead, contacted in " }, { text: "seconds.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            Tier 1 (Marketing) turns ad spend into booked appointments — the flow below. Tier 2 (Operations)
            automates the back office that turns those deals into installs. Tier 3 (Full Partnership) runs both,
            plus your door-to-door field team.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.1} y={30} amount={0.15} className="h-full">
            <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
              <div className="flex h-full flex-col p-6">
                <span className="bv-6 flex h-9 w-9 shrink-0 items-center justify-center bg-ink/[0.06] font-display text-[1.05rem] font-medium">
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#e7028d,#056afc)" }}>{i + 1}</span>
                </span>
                <h3 className="font-display mt-4 text-[1.12rem] font-normal leading-tight tracking-tight">{p.title}</h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-ink/55">{p.body}</p>
              </div>
            </Bevel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.18}>
        <div className="bv-6 mt-5 flex items-start gap-3 bg-ink/[0.05] px-5 py-4 text-[0.95rem] leading-relaxed text-ink/70">
          <span aria-hidden className="mt-1 h-4 w-px shrink-0 bg-gradient-to-b from-brand-pink to-brand-blue" />
          <span>
            <span className="font-medium text-ink/90">One pipeline, one partner.</span> Whether a lead comes from
            paid ads or a knock on the door, it runs through the same system — contacted, booked, designed,
            permitted, and tracked end to end.
          </span>
        </div>
      </Reveal>
    </Slide>
  );
}
