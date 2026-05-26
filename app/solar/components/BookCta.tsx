import { Section, Check } from "./primitives";
import { SCARCITY } from "../config";
import QualForm from "./QualForm";

const BULLETS = [
  "A clear plan to fill your calendar without door-knocking",
  "Your projected cost-per-appointment, honestly",
  "No pressure — we only take it forward if the math works",
];

export default function BookCta() {
  return (
    <Section id="book" className="border-t border-line/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] opacity-70"
        style={{
          background:
            "radial-gradient(50% 80% at 50% 0%, rgba(245,179,1,0.16), transparent 70%)",
        }}
      />
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        {/* Pitch */}
        <div className="lg:sticky lg:top-12">
          <h2 className="font-display text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.05] text-cream">
            See if we can fill your calendar with{" "}
            <span className="text-gradient">solar appointments</span>
          </h2>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-sand">
            Answer a few quick questions and we&apos;ll map out exactly how the funnel
            and AI booking agent would work for your company — the same system behind
            Southern Energy&apos;s pipeline.
          </p>
          <ul className="mt-7 space-y-3">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-cream/90">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-solar/15 text-solar">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-2 text-[0.82rem] text-sand">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-ember" />
            {SCARCITY}
          </p>
        </div>

        {/* Qualification form */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-5 -z-10 rounded-[2rem] opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 60% 20%, rgba(249,115,22,0.16), transparent 70%)",
            }}
          />
          <QualForm />
        </div>
      </div>
    </Section>
  );
}
