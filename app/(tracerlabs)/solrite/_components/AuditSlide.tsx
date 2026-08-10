import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Illustration from "./Illustration";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

type Row = { label: string; live: boolean };

const ROWS: Row[] = [
  { label: "Funnel dashboard, split by ad set", live: true },
  { label: "Meta lead ID stored on every lead", live: true },
  { label: "Duplicate protection on delivery", live: true },
  { label: "Signed excludes other-partner deals", live: true },
  { label: "Website Pixel — PageView and Lead", live: true },
  { label: "Outcomes sent back to Meta", live: false },
  { label: "Ad spend in the system", live: false },
  { label: "Attribution keyed to IDs, not names", live: false },
  { label: "Meta click IDs on website leads", live: false },
];

export default function AuditSlide() {
  return (
    <Slide id="tl-solrite-audit" padY="py-10">
      <div className="grid items-center gap-9 lg:grid-cols-[1fr_1fr]">
        <div>
          <Eyebrow>What we found</Eyebrow>
          <KineticHeading
            segments={[{ text: "The hard part is " }, { text: "already built.", gradient: true }]}
            className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <SlideReveal delay={0.12}>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/70">
              Every Meta lead already carries Meta&apos;s own lead ID. The connection was never made.
            </p>
          </SlideReveal>
        </div>

        <SlideReveal delay={0.1}>
          <Illustration
            src="/assets/solrite/gen/il-audit-v1.png"
            alt="A cable plugged into the cabinet at one end, its other end lying coiled and unconnected."
            minH="min-h-[230px]"
          />
        </SlideReveal>
      </div>

      <SlideReveal delay={0.22}>
        <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="mt-7">
          <ul className="grid gap-x-6 p-2 sm:grid-cols-2">
            {ROWS.map((r) => (
              <li
                key={r.label}
                className="flex items-center justify-between gap-4 border-b border-ink/[0.07] px-4 py-2.5"
              >
                <span className="text-[0.92rem] text-ink/70">{r.label}</span>
                <span
                  className={`bv-6 shrink-0 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] ${
                    r.live ? "bg-ink/[0.07] text-ink/60" : "bg-brand-pink/15 text-brand-pink"
                  }`}
                >
                  {r.live ? "Live" : "Missing"}
                </span>
              </li>
            ))}
          </ul>
        </Bevel>
      </SlideReveal>

      <SlideReveal delay={0.3}>
        <div className="mt-6 max-w-[54rem] border-l-2 border-brand-pink/70 pl-6">
          <p className="text-[1.05rem] leading-relaxed text-ink/80">
            &ldquo;Connect your CRM through Conversions API and choose{" "}
            <span className="text-ink">Maximize number of qualified leads</span>.&rdquo;
          </p>
          <p className="mt-2 text-[0.8rem] uppercase tracking-[0.18em] text-ink/40">
            Meta — inside your ad set
          </p>
        </div>
      </SlideReveal>
    </Slide>
  );
}
