import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

// The differentiator section: the agent handles the call, the dashboard hands you the control
// room. Two glass columns of capabilities (id = the hero's "See the dashboard" anchor).
const AGENT = [
  "Picks up in under two rings — 24/7, no voicemail",
  "Qualifies new prospects and books straight into the calendar",
  "Verifies existing customers before sharing anything sensitive",
  "Texts insurance cards, documents, and links mid-call",
  "Looks up policy, billing, and order details on the fly",
  "Takes claim reports and orders, then routes to the right person",
];

const DASHBOARD = [
  "Every call streamed in live as it happens",
  "Full speaker-by-speaker transcripts of each conversation",
  "Call recordings on demand",
  "A real-time activity feed of every action taken",
  "What the agent did — verified, texted, booked, transferred",
  "A searchable book of your customers and their details",
];

function Column({ kind, title, blurb, items }: { kind: string; title: string; blurb: string; items: string[] }) {
  return (
    <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
      <div className="flex h-full flex-col p-6 sm:p-8">
        <span className="bv-6 inline-flex w-fit items-center gap-2 bg-ink/[0.05] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/50">
          <span aria-hidden className="h-2.5 w-px bg-gradient-to-b from-brand-pink to-brand-blue" />
          {kind}
        </span>
        <h3 className="font-display mt-4 text-[1.5rem] font-normal leading-tight tracking-tight">{title}</h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/55">{blurb}</p>
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-ink/75">
              <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue" />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </Bevel>
  );
}

export default function Capabilities() {
  return (
    <section id="tl-va-dashboard" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40vw] w-[60vw] -translate-x-1/2 rounded-full opacity-[0.12] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[46rem]">
          <Eyebrow>The solution</Eyebrow>
          <Kinetic
            segments={[{ text: "Not just an agent — " }, { text: "total visibility.", gradient: true }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
              Plenty of tools can answer a phone. The difference is what you get to see. The agent
              handles every call; the dashboard gives you the control room — every conversation,
              transcript, and action, live.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal y={34} amount={0.15} className="h-full">
            <Column
              kind="The agent"
              title="Answers, qualifies, and serves"
              blurb="A natural-voice agent that works the phones the way your best rep would — around the clock."
              items={AGENT}
            />
          </Reveal>
          <Reveal delay={0.12} y={34} amount={0.15} className="h-full">
            <Column
              kind="The dashboard"
              title="See and control everything"
              blurb="The owner's view — watch it work in real time and review any call down to the word."
              items={DASHBOARD}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
