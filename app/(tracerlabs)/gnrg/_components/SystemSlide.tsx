import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

type Stage = { tier: string; kind: string; title: string; items: string[] };

const STAGES: Stage[] = [
  {
    tier: "Tier 1",
    kind: "Marketing",
    title: "Fill the calendar with booked appointments",
    items: [
      "Managed marketing campaigns that drive demand to a branded funnel",
      "Solar savings calculator + Meta Pixel / CAPI / GA4 tracking",
      "AI Appointment Setter — texts, then an AI voice call, qualifies & books",
      "CRM, calendar & booking flow — built and maintained by us",
      "All the technical infrastructure to deliver booked appointments",
    ],
  },
  {
    tier: "Tier 2",
    kind: "Operations",
    title: "Automate the back office, in sprints",
    items: [
      "Finance & permitting operations automation",
      "CAD / system design + proposals, e-sign & scheduling (sold-to-installable)",
      "Installation-day operations automation",
      "Dispatcher AI — routes, prioritizes & assigns leads by capacity",
      "Disposition — automatically re-engages dead leads",
    ],
  },
  {
    tier: "Tier 3",
    kind: "Full Partnership",
    title: "Add the field — and run all of it",
    items: [
      "Everything in Marketing + Operations, combined",
      "Offset Canvassing — door-knocking GIS app + mobile CRM for D2D reps",
      "One accountable partner across your entire business",
    ],
  },
];

function StageCard({ s }: { s: Stage }) {
  return (
    <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
      <div className="flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="bv-6 inline-flex w-fit items-center gap-2 bg-ink/[0.05] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/50">
            <span aria-hidden className="h-2.5 w-px bg-gradient-to-b from-brand-pink to-brand-blue" />
            {s.kind}
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand-pink">{s.tier}</span>
        </div>
        <h3 className="font-display mt-4 text-[1.28rem] font-normal leading-tight tracking-tight">{s.title}</h3>
        <ul className="mt-5 flex flex-col gap-2.5">
          {s.items.map((it) => (
            <li key={it} className="flex items-start gap-2.5 text-[0.88rem] leading-relaxed text-ink/75">
              <span aria-hidden className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </Bevel>
  );
}

export default function SystemSlide() {
  return (
    <Slide id="tl-gnrg-system">
      <div className="max-w-[46rem]">
        <Eyebrow>The system</Eyebrow>
        <Kinetic
          segments={[{ text: "One engine. Ad click to " }, { text: "installable job.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[44rem] text-[1.02rem] leading-relaxed text-ink/55">
            We have already built this for a solar company. For GNRG we deploy the proven system — branded to
            you, integrated into your existing tools, fully managed. You choose how much we run — marketing,
            operations, or the full partnership.
          </p>
        </Reveal>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {STAGES.map((s, i) => (
          <Reveal key={s.kind} delay={i * 0.1} y={30} amount={0.12} className="h-full">
            <StageCard s={s} />
          </Reveal>
        ))}
      </div>
    </Slide>
  );
}
