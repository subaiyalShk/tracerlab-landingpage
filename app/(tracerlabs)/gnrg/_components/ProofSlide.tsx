import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";

// Real early data from the live Southern Energy funnel (first ~10 days). Small sample,
// reported as-is — not a projection or guarantee.
const STATS: { value: number; prefix?: string; suffix?: string; k: string }[] = [
  { value: 81, prefix: "$", k: "Cost per booked solar consultation (early data)" },
  { value: 9, k: "Consultations booked from ~$730 of ad spend, first ~10 days" },
  { value: 24, suffix: "/7", k: "AI follow-up — every lead, instantly" },
];

const STACK = ["Conversion funnel", "Solar calculator", "AI voice agent", "SMS nurture", "Bill upload", "GHL CRM", "Live dashboard"];

export default function ProofSlide() {
  return (
    <Slide id="tl-gnrg-proof">
      <div className="max-w-[46rem]">
        <Eyebrow>Proof · live solar client</Eyebrow>
        <Kinetic
          segments={[{ text: "Already built. Already " }, { text: "converting.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
      </div>

      <Reveal delay={0.12} y={30} amount={0.12} className="mt-9">
        <Bevel bevel={18} border={GLASS_BORDER} bg={GLASS_BG}>
          <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:gap-10">
            {/* story */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-pink">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Residential solar · Texas
                </span>
                <span className="text-ink/20">·</span>
                <span className="bv-6 inline-flex items-center gap-1.5 bg-ink/[0.05] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink/50">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Live in production
                </span>
              </div>
              <h3 className="font-display mt-4 text-[1.5rem] font-normal leading-tight tracking-tight">The exact system, running for a solar company</h3>
              <div className="mt-5 space-y-3.5 text-[0.95rem] leading-relaxed text-ink/60">
                <p>
                  <span className="font-medium text-ink/80">What it is:</span> the same funnel, AI voice agent, SMS
                  automation, CRM integration, and live dashboard we are proposing for GNRG — already built and
                  operating for a Texas solar company.
                </p>
                <p>
                  <span className="font-medium text-ink/80">Early result:</span> in its first ~10 days live, the
                  funnel turned roughly $730 of Meta spend into 9 booked consultations — about $81 each — before
                  speed-to-lead and optimization were fully dialed in.
                </p>
                <p className="text-ink/45">
                  Plus <span className="text-ink/70">Offset Canvassing</span> — our own live door-to-door GIS app
                  &amp; mobile CRM, the Tier 3 field tool.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {STACK.map((a) => (
                  <span key={a} className="bv-6 bg-ink/[0.045] px-2.5 py-1 text-[0.72rem] text-ink/60">{a}</span>
                ))}
              </div>
              <div className="mt-6">
                <Button href="https://offset-canvassing.vercel.app/" external variant="secondary" size="sm">See the canvassing app live</Button>
              </div>
            </div>

            {/* the numbers */}
            <div className="flex flex-col justify-center gap-6 border-t border-ink/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              {STATS.map((s) => (
                <div key={s.k}>
                  <div
                    className="font-body bg-clip-text text-[2.5rem] font-bold leading-none tracking-tight text-transparent"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <div className="mt-1.5 text-[0.82rem] text-ink/50">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </Bevel>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-5 text-[0.7rem] text-ink/30">Early, small-sample data from a real funnel — reported as-is, not a projection or guarantee.</p>
      </Reveal>
    </Slide>
  );
}
