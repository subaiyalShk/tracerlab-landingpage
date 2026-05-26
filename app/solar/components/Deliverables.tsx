import { Section, SectionHead, Layers, Target, Phone, Gauge, Calendar, Bolt } from "./primitives";

const ITEMS = [
  {
    icon: Layers,
    title: "High-converting funnel",
    body: "A custom landing page and lead flow engineered to turn solar-curious clicks into booked consults.",
  },
  {
    icon: Target,
    title: "Done-for-you ads & targeting",
    body: "Creative, copy, and audience setup that reach homeowners in your service area who are ready to buy.",
  },
  {
    icon: Phone,
    title: "AI booking agent (calls + SMS)",
    body: "An always-on voice and text agent that follows up in seconds, qualifies, and books appointments 24/7.",
  },
  {
    icon: Calendar,
    title: "CRM & appointment dashboard",
    body: "Every lead and booking organized in one place, synced to your calendar with full context for your closers.",
  },
  {
    icon: Bolt,
    title: "Instant lead nurture & follow-up",
    body: "Automated reminders and re-engagement so no-shows get rebooked and warm leads never slip through.",
  },
  {
    icon: Gauge,
    title: "Weekly optimization",
    body: "We watch the numbers and tune ads, funnel, and scripts every week to keep your cost-per-appointment dropping.",
  },
];

export default function Deliverables() {
  return (
    <Section id="deliverables" className="border-t border-line/60">
      <SectionHead
        kicker="What you get"
        title="A complete appointment machine — built and managed for you"
        sub="Not another tool to figure out. We build, launch, and run the entire system so you can focus on closing and installing."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-line bg-surface/50 p-7 transition-colors duration-300 hover:border-solar/40"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-solar/25 bg-solar/10 text-solar">
              <Icon className="h-5.5 w-5.5" />
            </span>
            <h3 className="font-display mt-5 text-lg font-semibold text-cream">{title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-sand">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
