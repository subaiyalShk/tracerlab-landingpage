import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const NEEDS = [
  "Business Manager access — admin rights sufficient to issue a token that can read ad spend and send conversion events",
  "Confirmation of the ad account and page running the live lead campaigns",
  "A decision on the target stage: a reached lead, a qualified homeowner, or a signed deal",
  "A named owner for the weekly decision on where budget moves",
];

const SUCCESS = [
  "Cost per qualified lead becomes visible for the first time — then starts falling",
  "At the same spend, a higher share of leads reply and qualify as homeowners",
  "Ad set decisions get made on cost per outcome instead of cost per form fill",
];

const RISKS = [
  "Optimisation needs volume to learn. If weekly signed deals are thin we target an earlier but still meaningful stage — often the better choice regardless.",
  "Changing the goal resets learning. Expect a noisy period before it improves; that needs planning for, not panic.",
  "Nothing here is based on Solrite's live numbers, because we do not have access yet. Step 00 exists to fix that before anyone commits to a target.",
];

export default function NeedsSlide() {
  return (
    <Slide id="tl-solrite-needs" padY="py-16" bgSrc="/assets/solrite/gen/needs-v1.png" bgOpacity={0.16}>
      <div className="max-w-[46rem]">
        <Eyebrow>To start</Eyebrow>
        <KineticHeading
          segments={[{ text: "What we need, and " }, { text: "how we will know it worked.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.7rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <SlideReveal y={26} className="h-full">
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-7">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                What we need from Solrite
              </span>
              <ul className="mt-5 flex flex-col">
                {NEEDS.map((n) => (
                  <li
                    key={n}
                    className="flex items-start gap-3 border-b border-ink/[0.07] py-3 text-[0.92rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>

        <SlideReveal delay={0.12} y={26} className="h-full">
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="flex h-full flex-col p-7">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                How we will know it worked
              </span>
              <ul className="mt-5 flex flex-col">
                {SUCCESS.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-3 border-b border-ink/[0.07] py-3 text-[0.92rem] leading-snug text-ink/70 last:border-b-0"
                  >
                    <span aria-hidden className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink" />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 text-[0.85rem] leading-relaxed text-ink/45">
                Expect several weeks before the first two read cleanly.
              </p>
            </div>
          </Bevel>
        </SlideReveal>
      </div>

      <SlideReveal delay={0.24}>
        <div className="mt-6 border-l-2 border-ink/15 pl-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">Straight talk</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {RISKS.map((r) => (
              <li key={r} className="max-w-[52rem] text-[0.9rem] leading-relaxed text-ink/50">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </SlideReveal>
    </Slide>
  );
}
