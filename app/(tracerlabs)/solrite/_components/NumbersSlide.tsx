import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

// Figures read directly from the Solrite Energy ad account (act 753313159867772),
// last 30 days, 11 Jul – 9 Aug 2026. Update the window label if these are refreshed.
const CAMPAIGNS = [
  { name: "Illinois Direct", state: "Active", leads: "233", cpl: "$8.19", spend: "$1,907", tone: "ok" },
  { name: "Texas Direct", state: "Active", leads: "138", cpl: "$13.04", spend: "$1,799", tone: "ok" },
  { name: "California Direct", state: "Switched off", leads: "32", cpl: "$18.29", spend: "$585", tone: "off" },
];

const TX = [
  { name: "Houston", leads: "83", cpl: "$10.83", spend: "$899", tone: "ok" },
  { name: "Corpus Christi", leads: "55", cpl: "$16.37", spend: "$900", tone: "bad" },
];

export default function NumbersSlide() {
  return (
    <Slide id="tl-solrite-numbers" padY="py-16">
      <div className="max-w-[46rem]">
        <Eyebrow>The numbers</Eyebrow>
        <KineticHeading
          segments={[{ text: "Every one of these is cost per " }, { text: "form fill.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <SlideReveal delay={0.12}>
          <p className="mt-5 text-[1rem] leading-relaxed text-ink/55">
            Last 30 days · <span className="text-ink/85">403 leads · ~$4,300</span>
          </p>
        </SlideReveal>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <SlideReveal delay={0.18}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                By campaign
              </span>
              <ul className="mt-4 flex flex-col">
                {CAMPAIGNS.map((c) => (
                  <li key={c.name} className="border-b border-ink/[0.07] py-3 last:border-b-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[0.95rem] text-ink/80">{c.name}</span>
                      <span
                        className={`font-body text-[1.15rem] font-semibold tabular-nums ${
                          c.tone === "off" ? "text-brand-pink" : "text-ink/90"
                        }`}
                      >
                        {c.cpl}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between gap-4 text-[0.8rem] text-ink/45">
                      <span>{c.state} · {c.spend} spent</span>
                      <span className="tabular-nums">{c.leads} leads</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Bevel>
        </SlideReveal>

        <SlideReveal delay={0.28}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
            <div className="p-6">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink/45">
                Inside Texas — same $30/day, same spend
              </span>
              <ul className="mt-4 flex flex-col">
                {TX.map((t) => (
                  <li key={t.name} className="border-b border-ink/[0.07] py-3 last:border-b-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[0.95rem] text-ink/80">{t.name}</span>
                      <span
                        className={`font-body text-[1.15rem] font-semibold tabular-nums ${
                          t.tone === "bad" ? "text-brand-pink" : "text-ink/90"
                        }`}
                      >
                        {t.cpl}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between gap-4 text-[0.8rem] text-ink/45">
                      <span>{t.spend} spent</span>
                      <span className="tabular-nums">{t.leads} leads</span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.9rem] text-ink/55">
                <span className="text-brand-pink">51% more per lead.</span> Same budget.
              </p>
            </div>
          </Bevel>
        </SlideReveal>
      </div>

      <SlideReveal delay={0.4}>
        <p className="mt-8 text-[1.15rem] leading-relaxed text-ink/80">
          None of it says who answered, who owned the roof, or who signed.
        </p>
      </SlideReveal>
    </Slide>
  );
}
