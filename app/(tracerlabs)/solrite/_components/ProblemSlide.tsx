import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Illustration from "./Illustration";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

// Read straight off the live Corpus Christi ad set.
const SETTINGS = [
  { k: "Conversion location", v: "Instant forms" },
  { k: "Performance goal", v: "Maximize number of leads", flag: true },
  { k: "Audience", v: "Broad · 36,000–42,300" },
  { k: "Advantage+ leads", v: "Off" },
];

export default function ProblemSlide() {
  return (
    <Slide id="tl-solrite-problem">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow>The configuration</Eyebrow>
          <KineticHeading
            segments={[{ text: "Meta is doing exactly what " }, { text: "you asked for.", gradient: true }]}
            className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />

          <SlideReveal delay={0.15}>
            <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="mt-7">
              <ul className="flex flex-col p-2">
                {SETTINGS.map((s) => (
                  <li
                    key={s.k}
                    className="flex items-baseline justify-between gap-5 border-b border-ink/[0.07] px-4 py-3 last:border-b-0"
                  >
                    <span className="text-[0.8rem] uppercase tracking-[0.1em] text-ink/45">{s.k}</span>
                    <span className={`text-[1rem] ${s.flag ? "text-brand-pink" : "text-ink/80"}`}>{s.v}</span>
                  </li>
                ))}
              </ul>
            </Bevel>
          </SlideReveal>
        </div>

        <div className="flex flex-col gap-6">
          <SlideReveal delay={0.1}>
            <Illustration
              src="/assets/solrite/gen/il-problem-v1.png"
              alt="A sensor aimed at a single lit checkbox while identical leads behind it stay in darkness."
              minH="min-h-[250px]"
            />
          </SlideReveal>
          <SlideReveal delay={0.26}>
            <div className="border-l-2 border-brand-pink/70 pl-5">
              <p className="text-[1.05rem] leading-relaxed text-ink/80">
                The whole qualification gate: three yes/no questions.
              </p>
              <p className="mt-2 text-[0.95rem] text-ink/50">On a form Meta has already filled in.</p>
            </div>
          </SlideReveal>
        </div>
      </div>
    </Slide>
  );
}
