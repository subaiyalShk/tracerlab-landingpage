import { Section, SectionHead } from "./primitives";

const FAQS = [
  {
    q: "Do I have to get rid of my sales team?",
    a: "Not at all. This feeds your closers a steady stream of pre-qualified appointments so they spend time selling instead of prospecting. Most owners use it to replace cold canvassing, not their closers.",
  },
  {
    q: "How fast will I start seeing appointments?",
    a: "Once your funnel and AI agent are live, leads can start booking within days. We focus the first weeks on dialing in targeting and scripts so cost-per-appointment keeps dropping.",
  },
  {
    q: "How is this different from buying shared leads?",
    a: "Shared leads are sold to several installers and go cold fast. Here the leads are exclusively yours, contacted within seconds by your AI agent, and booked as real appointments — not just a name and number.",
  },
  {
    q: "What does it cost?",
    a: "It depends on your market and goals. We'll walk through the numbers on your strategy call and only move forward if the math clearly works for your business.",
  },
  {
    q: "What if I'm in a smaller market?",
    a: "We tailor targeting and spend to your area. Smaller markets often convert better because there's less competition for the same homeowners — we'll tell you honestly on the call if it's a fit.",
  },
];

export default function Faq() {
  return (
    <Section id="faq" className="border-t border-line/60">
      <SectionHead kicker="Questions" title="You're probably wondering…" center />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface/40">
        {FAQS.map((f) => (
          <details key={f.q} className="group px-6 py-5 [&_summary]:list-none">
            <summary className="flex cursor-pointer items-center justify-between gap-4">
              <span className="font-display text-[1.05rem] font-semibold text-cream">
                {f.q}
              </span>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-solar transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-sand">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
