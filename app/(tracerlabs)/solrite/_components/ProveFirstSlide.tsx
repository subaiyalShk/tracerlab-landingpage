import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const HAVE = [
  "Lead to replied to qualified to proposal to signed",
  "Broken out by state, by channel, and by Meta ad set",
  "Every Meta lead stored against Meta's own lead ID",
];

const MISSING = [
  "No ad spend in it — so no cost per qualified lead, per market",
  "Fixed to the last 30 days, with no date control",
  "Qualified and bill are partly inferred from an uploaded photo, not a clean stage",
  "Nothing reconciles it against what the ad account reports",
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
            Spark already has a lead funnel dashboard, and it already splits by Meta ad set. The reason it has
            not settled this argument is that it cannot see money, and nothing has been reconciled against the
            ad account.
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
          <p className="text-[1.02rem] leading-relaxed text-ink/80">
            Week one is not a build. We put spend beside that funnel and reconcile it against the ad account,
            so Houston and Corpus Christi finally carry a cost per <span className="text-ink">qualified</span>{" "}
            lead rather than a cost per form fill.
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/50">
            If the leads die before a rep reaches them, it is quality and the way Meta is told to buy. If they
            are reachable homeowners who do not convert, it is the sales motion — and no ad work fixes that.
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
