import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { BRAND_GRADIENT, CountUp, Kinetic, Reveal } from "../../../components/motion";

// Single REAL case study (Harbs Farm, kept anonymized per the client's request). These are
// the owner's reported outcomes — not illustrative.
const STATS: { value: number; prefix?: string; suffix?: string; k: string }[] = [
  { value: 5, suffix: " hrs", k: "Max owner phone time / week" },
  { value: 24, suffix: "/7", k: "Agent answers every call" },
  { value: 100, suffix: "%", k: "Orders get SMS status updates" },
];

const AUTOMATED = ["Bookings", "Payments", "Invoicing", "Order-status answers", "Step-by-step SMS updates", "Online payments"];

export default function ProofSlide() {
  return (
    <Slide id="tl-ins-proof" bgSrc="/assets/insurance/gen/proof-v1.png" bgOpacity={0.3}>
      <div className="max-w-[46rem]">
        <Eyebrow>Proof · live client</Eyebrow>
        <Kinetic
          segments={[{ text: "Already live. Already " }, { text: "scaling.", gradient: true }]}
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
                  Agriculture · direct-to-consumer
                </span>
                <span className="text-ink/20">·</span>
                <span className="bv-6 inline-flex items-center gap-1.5 bg-ink/[0.05] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink/50">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                  Real client
                </span>
              </div>
              <h3 className="font-display mt-4 text-[1.5rem] font-normal leading-tight tracking-tight">A family-run farm &amp; butcher</h3>
              <div className="mt-5 space-y-3.5 text-[0.95rem] leading-relaxed text-ink/60">
                <p>
                  <span className="font-medium text-ink/80">Before:</span> the owner was on the phone all day — order
                  status, bookings, payments, the same questions on repeat.
                </p>
                <p>
                  <span className="font-medium text-ink/80">Now:</span> the AI agent answers every call, 24/7, and we
                  automated the whole flow end-to-end. Bookings, payments, and invoicing run themselves, and customers
                  get an SMS at every step — so they stop calling to ask &ldquo;where&apos;s my order?&rdquo;
                </p>
                <p>
                  <span className="font-medium text-ink/80">Result:</span> the owner is down to about five hours a week
                  on the phone, has full visibility into what customers want, and is finally focused on scaling.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {AUTOMATED.map((a) => (
                  <span key={a} className="bv-6 bg-ink/[0.045] px-2.5 py-1 text-[0.72rem] text-ink/60">{a}</span>
                ))}
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
    </Slide>
  );
}
