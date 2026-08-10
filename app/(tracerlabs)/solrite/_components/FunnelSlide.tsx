import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const TODAY = [
  "Pre-filled instant form, three yes/no questions",
  "Lead lands in the inbox alongside every other lead",
  "A rep rings to find out what the form should have asked",
  "If it goes well, a booking link is pasted in by hand",
];

const PROPOSED = [
  "The ad points at a funnel we build and control",
  "Ownership, bill, roof and existing solar are established before anything else",
  "The appointment is booked in the flow, onto a rep's calendar",
  "That booking is the event we report back to Meta",
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
            The reps are currently the filter. Every lead gets a call to establish facts a form could have
            established — which is expensive, slow, and the reason good leads go cold behind bad ones.
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
          <p className="text-[1rem] leading-relaxed text-ink/80">
            Expect cost per lead to <span className="text-ink">rise</span>. An instant form is pre-filled and
            never leaves Meta; a real qualification step will always convert fewer people. That is the trade,
            and it is why this runs as a second ad set at matched budget rather than replacing anything.
          </p>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/50">
            The scoreboard is agreed before it starts: cost per qualified lead, and cost per booked
            appointment. Judged on cost per form fill, this loses by design.
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
