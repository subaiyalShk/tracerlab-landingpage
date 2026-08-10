import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const HAVE = [
  "Lead to replied to qualified to signed",
  "Split by state, channel and ad set",
  "Keyed to Meta's own lead ID",
];

const MISSING = [
  "No spend in it",
  "No cost per qualified lead",
  "Never reconciled with the ad account",
];

export default function ProveFirstSlide() {
  return (
    <Slide id="tl-solrite-prove" padY="py-12">
      <div className="max-w-[48rem]">
        <Eyebrow>Before we build anything</Eyebrow>
        <KineticHeading
          segments={[{ text: "You already own half " }, { text: "the answer.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.12}>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink/55">
            The funnel already exists. It just cannot see money.
          </p>
        </SlideReveal>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <SlideReveal delay={0.18}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                Already built and running
              </span>
              <ul className="mt-4 flex flex-col">
                {HAVE.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2.5 border-b border-ink/[0.07] py-2.5 text-[0.9rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>

        <SlideReveal delay={0.26}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                Why it has not answered the question
              </span>
              <ul className="mt-4 flex flex-col">
                {MISSING.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2.5 border-b border-ink/[0.07] py-2.5 text-[0.9rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>
      </div>

      <SlideReveal delay={0.4}>
        <div className="mt-7 max-w-[54rem] border-l-2 border-brand-pink/70 pl-6">
          <p className="text-[1.15rem] leading-relaxed text-ink/80">
            Week one is not a build. It is a number.
          </p>
          <p className="mt-3 text-[0.98rem] text-ink/50">
            Cost per qualified lead, Houston versus Corpus Christi.
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
