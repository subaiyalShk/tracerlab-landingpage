import { Section, SectionHead, Target, Layers, Phone, Calendar } from "./primitives";

const STEPS = [
  {
    icon: Target,
    step: "01",
    title: "We put your offer in front of ready homeowners",
    body: "Targeted local ads reach homeowners actively looking into solar in your service area — not random doors, but people already raising their hand.",
  },
  {
    icon: Layers,
    step: "02",
    title: "A high-converting funnel captures & pre-qualifies them",
    body: "Your custom landing funnel turns clicks into leads and screens for the homes worth your time — roof, bill, ownership — before anyone picks up the phone.",
  },
  {
    icon: Phone,
    step: "03",
    title: "Your AI agent calls and texts within seconds",
    body: "An AI voice agent follows up instantly, answers questions, and books the appointment 24/7 — so no lead goes cold while your team sleeps.",
  },
  {
    icon: Calendar,
    step: "04",
    title: "Qualified appointments land on your calendar",
    body: "Booked consults sync straight to your calendar and CRM with full context, ready for your closers. You just show up and sell.",
  },
];

export default function Mechanism() {
  return (
    <Section id="how" className="border-t border-line/60">
      <SectionHead
        kicker="The system"
        title={
          <>
            How we fill your calendar —{" "}
            <span className="text-gradient">
              while you sleep
            </span>
          </>
        }
        sub="One connected machine that replaces the door-knocking grind: traffic, funnel, and an AI agent that does the chasing and booking for you."
      />

      <ol className="mt-14 grid gap-5 md:grid-cols-2">
        {STEPS.map(({ icon: Icon, step, title, body }) => (
          <li
            key={step}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-7"
          >
            <span className="font-display pointer-events-none absolute -right-2 -top-4 text-7xl font-bold text-cream/5">
              {step}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber to-ember text-[#1a0f02]">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="font-display mt-5 text-xl font-semibold text-cream">{title}</h3>
            <p className="mt-2 leading-relaxed text-sand">{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
