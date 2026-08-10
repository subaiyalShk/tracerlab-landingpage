import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const TODAY = [
  "Pre-filled form, three yes/no questions",
  "Lands in the inbox with everything else",
  "A rep rings to qualify",
  "Booking link pasted by hand",
];

const PROPOSED = [
  "The ad points at our funnel",
  "Qualified before anything else",
  "Appointment booked in the flow",
  "The booking is what Meta learns",
];

export default function FunnelSlide() {
  return (
    <Slide id="tl-solrite-funnel" padY="py-12">
      <div className="max-w-[48rem]">
        <Eyebrow>What step 04 actually builds</Eyebrow>
        <KineticHeading
          segments={[{ text: "Stop buying form fills. " }, { text: "Start buying appointments.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.7rem,4vw,2.7rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.12}>
          <p className="mt-5 text-[1rem] leading-relaxed text-ink/55">
            Right now the reps are the filter.
          </p>
        </SlideReveal>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <SlideReveal delay={0.18}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                Today
              </span>
              <ul className="mt-4 flex flex-col">
                {TODAY.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 border-b border-ink/[0.07] py-2.5 text-[0.9rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
                    {t}
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
                What we build
              </span>
              <ul className="mt-4 flex flex-col">
                {PROPOSED.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 border-b border-ink/[0.07] py-2.5 text-[0.9rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>
      </div>

      <SlideReveal delay={0.38}>
        <div className="mt-7 max-w-[54rem] border-l-2 border-brand-pink/70 pl-6">
          <p className="text-[1.15rem] leading-relaxed text-ink/80">
            Cost per lead will rise. That is the trade.
          </p>
          <p className="mt-3 text-[0.98rem] text-ink/50">
            The scoreboard is cost per booked appointment — agreed before we start.
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
