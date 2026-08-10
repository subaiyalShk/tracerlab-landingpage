import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const MEASURE = [
  "Cost per booked appointment",
  "Share of leads that qualify",
  "Cost per qualified lead vs baseline",
];

const IGNORE = [
  "Cost per form fill — ours will be higher",
  "Signed deals — the cycle outruns the test",
];

export default function CheckpointSlide() {
  return (
    <Slide id="tl-solrite-checkpoint" padY="py-12">
      <div className="max-w-[48rem]">
        <Eyebrow>The checkpoint</Eyebrow>
        <KineticHeading
          segments={[{ text: "Agree the scoreboard " }, { text: "before we start.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <SlideReveal delay={0.15}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                What we judge it on
              </span>
              <ul className="mt-4 flex flex-col">
                {MEASURE.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2.5 border-b border-ink/[0.07] py-3 text-[0.98rem] leading-snug text-ink/80 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>

        <SlideReveal delay={0.24}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                What we ignore
              </span>
              <ul className="mt-4 flex flex-col">
                {IGNORE.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-2.5 border-b border-ink/[0.07] py-3 text-[0.98rem] leading-snug text-ink/60 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>
      </div>

      <SlideReveal delay={0.38}>
        <div className="mt-8 max-w-[54rem] border-l-2 border-brand-pink/70 pl-6">
          <p className="text-[1.15rem] leading-relaxed text-ink/80">
            If it doesn&apos;t beat the baseline, you spent one month finding out.
          </p>
          <p className="mt-3 text-[0.98rem] text-ink/50">
            Month to month. You decide at the end of it.
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
