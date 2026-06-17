import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

const AGENT = [
  "Answers every call in under two rings, 24/7",
  "Quotes new prospects and routes to the right producer",
  "Verifies existing clients before sharing anything",
  "Texts insurance cards, dec pages, and COIs mid-call",
  "Reads back policy & billing; takes first-notice-of-loss claims",
  "Warm-transfers Sales / Service / Claims / Billing",
];
const DASHBOARD = [
  "Every call streamed in live as it happens",
  "Full speaker-by-speaker transcripts",
  "Call recordings on demand",
  "A real-time feed of every action the agent took",
  "Verified · texted · looked up · transferred — all logged",
  "A searchable book of your clients and policies",
];

function Column({ kind, title, items }: { kind: string; title: string; items: string[] }) {
  return (
    <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
      <div className="flex h-full flex-col p-6 sm:p-7">
        <span className="bv-6 inline-flex w-fit items-center gap-2 bg-ink/[0.05] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/50">
          <span aria-hidden className="h-2.5 w-px bg-gradient-to-b from-brand-pink to-brand-blue" />
          {kind}
        </span>
        <h3 className="font-display mt-4 text-[1.4rem] font-normal leading-tight tracking-tight">{title}</h3>
        <ul className="mt-5 flex flex-col gap-2.5">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-2.5 text-[0.9rem] leading-relaxed text-ink/75">
              <span aria-hidden className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </Bevel>
  );
}

export default function SolutionSlide() {
  return (
    <Slide id="tl-ins-solution" bgSrc="/assets/insurance/gen/solution-v1.png" bgOpacity={0.26}>
      <div className="max-w-[46rem]">
        <Eyebrow>The solution</Eyebrow>
        <Kinetic
          segments={[{ text: "One agent answers. You see " }, { text: "everything.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
            A natural-voice agent works your phones like your best CSR — and a live dashboard gives you the
            control room. Built for your agency, deployed in days, fully managed.
          </p>
        </Reveal>
      </div>
      <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Reveal y={32} amount={0.15} className="h-full">
          <Column kind="The agent" title="Answers, quotes, and serves" items={AGENT} />
        </Reveal>
        <Reveal delay={0.12} y={32} amount={0.15} className="h-full">
          <Column kind="The dashboard" title="See and control everything" items={DASHBOARD} />
        </Reveal>
      </div>
    </Slide>
  );
}
