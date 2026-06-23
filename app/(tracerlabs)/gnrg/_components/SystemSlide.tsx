import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

type Stage = { tier: string; kind: string; title: string; items: string[] };

const STAGES: Stage[] = [
  {
    tier: "Tier 1+",
    kind: "Capture",
    title: "Turn ad clicks into booked appointments",
    items: [
      "Branded conversion funnel + solar savings calculator (real Google Solar data)",
      "Smart qualification — renters & out-of-area leads still captured",
      "Meta ad campaigns, fully managed",
      "Meta Pixel + Conversions API + GA4 tracking",
      "CRM integration (GoHighLevel)",
      "Live admin dashboard — funnel drop-off, sources, A/B",
    ],
  },
  {
    tier: "Tier 2+",
    kind: "Convert",
    title: "Contact every lead in seconds, book on autopilot",
    items: [
      "AI Appointment Setter — texts in seconds, then an AI voice call",
      "Qualifies the lead and books straight onto your calendar",
      "No-answer retry over the following days, automatically",
      "AI Welcome Call Agent for new & booked customers",
      "Thank-you SMS + secure power-bill upload",
    ],
  },
  {
    tier: "Tier 3",
    kind: "Operate",
    title: "Carry the deal to an installable job",
    items: [
      "Offset Canvassing — GIS map + mobile CRM for your D2D reps",
      "CAD / system design via Aurora Solar",
      "Permitting automation across your AHJs",
      "Proposals, e-signature, project & install scheduling — automated",
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
            you, wired to your CRM, fully managed. Three stages, and you choose how far down the funnel we own.
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
