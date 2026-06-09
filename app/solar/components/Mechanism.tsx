import Image from "next/image";
import { Section, SectionHead } from "./primitives";

const STEPS = [
  {
    step: "01",
    img: "/solar/system/step-1.png",
    alt: "A homeowner relaxing on their couch, delighted by a solar offer glowing on their phone.",
    title: "We put your offer in front of ready homeowners",
    body: "Targeted local ads reach homeowners actively looking into solar in your service area — not random doors, but people already raising their hand.",
  },
  {
    step: "02",
    img: "/solar/system/step-2.png",
    alt: "A friendly character sliding down a funnel as leads gather at the bottom.",
    title: "A high-converting funnel captures & pre-qualifies them",
    body: "Your custom landing funnel turns clicks into leads and screens for the homes worth your time — roof, bill, ownership — before anyone picks up the phone.",
  },
  {
    step: "03",
    img: "/solar/system/step-3.png",
    alt: "An AI assistant orb calling several homeowners at once.",
    title: "Your AI agent calls and texts within seconds",
    body: "An AI voice agent follows up instantly, answers questions, and books the appointment 24/7 — so no lead goes cold while your team sleeps.",
  },
  {
    step: "04",
    img: "/solar/system/step-4.png",
    alt: "A calendar filling up with booked appointment slots.",
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
            <span className="text-gradient">while you sleep</span>
          </>
        }
        sub="One connected machine that replaces the door-knocking grind: traffic, funnel, and an AI agent that does the chasing and booking for you."
      />

      <ol className="mt-14 grid gap-5 md:grid-cols-2">
        {STEPS.map(({ step, img, alt, title, body }) => (
          <li key={step} className="overflow-hidden rounded-2xl border border-line bg-surface/50">
            <div className="relative aspect-[3/2] w-full bg-base-2">
              <Image
                src={img}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber to-ember font-display text-base font-bold text-[#1a0f02] shadow-[0_8px_24px_-6px_rgba(249,115,22,0.6)]">
                {step}
              </span>
            </div>
            <div className="p-7">
              <h3 className="font-display text-xl font-semibold text-cream">{title}</h3>
              <p className="mt-2 leading-relaxed text-sand">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
