import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Illustration from "./Illustration";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

// Read straight off the Corpus Christi ad set in Ads Manager.
const SETTINGS = [
  { k: "Conversion location", v: "Instant forms" },
  { k: "Performance goal", v: "Maximize number of leads" },
  { k: "Audience", v: "Broad · 36,000–42,300" },
  { k: "Advantage+ leads", v: "Off" },
];

export default function ProblemSlide() {
  return (
    <Slide id="tl-solrite-problem" padY="py-12">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow>The configuration</Eyebrow>
          <KineticHeading
            segments={[
              { text: "Meta is doing exactly what " },
              { text: "the settings ask for.", gradient: true },
            ]}
            className="font-display mt-6 text-[clamp(1.7rem,4vw,2.7rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <SlideReveal delay={0.12}>
            <p className="mt-5 text-[1rem] leading-relaxed text-ink/55">
              This is the live Texas ad set. Nothing here is broken — it is a machine being told to produce
              the largest possible number of form submissions, and doing so.
            </p>
          </SlideReveal>

          <SlideReveal delay={0.2}>
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="mt-5">
              <ul className="flex flex-col p-2">
                {SETTINGS.map((s) => (
                  <li
                    key={s.k}
                    className="flex items-baseline justify-between gap-5 border-b border-ink/[0.07] px-4 py-2.5 last:border-b-0"
                  >
                    <span className="text-[0.85rem] uppercase tracking-[0.1em] text-ink/45">{s.k}</span>
                    <span
                      className={`text-[0.95rem] ${
                        s.k === "Performance goal" ? "text-brand-pink" : "text-ink/80"
                      }`}
                    >
                      {s.v}
                    </span>
                  </li>
                ))}
              </ul>
            </Bevel>
          </SlideReveal>
        </div>

        <div className="flex flex-col gap-5">
          <SlideReveal delay={0.1}>
            <Illustration
              src="/assets/solrite/gen/il-problem-v1.png"
              alt="A sensor aimed at a single lit checkbox, while a long row of identical leads behind it stays in darkness, unseen."
              minH="min-h-[230px]"
            />
          </SlideReveal>
          <SlideReveal delay={0.28}>
            <div className="border-l-2 border-brand-pink/70 pl-5">
              <p className="text-[0.94rem] leading-relaxed text-ink/60">
                The whole qualification gate is{" "}
                <span className="text-ink">three yes/no questions</span>
                {" — do you own your home, do you already have solar, is your bill over $150 — on a form Meta has already filled in with the person's name, email and phone."}
              </p>
              <p className="mt-3 text-[0.94rem] leading-relaxed text-ink/60">
                Answering it costs a few taps. That is why the volume is reliable, and why the volume means
                very little.
              </p>
            </div>
          </SlideReveal>
        </div>
      </div>
    </Slide>
  );
}
