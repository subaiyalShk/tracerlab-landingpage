import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { CountUp, Kinetic, Reveal } from "../../../components/motion";

// Two honest case studies. The PROBLEM and the SOLUTION (what we built) are real/representative;
// the IMPACT numbers are explicitly tagged "Illustrative" so nothing reads as a fabricated
// banked result. The farm is a real client (anonymized); the insurance agency is a scenario.
type Stat = { value: number; prefix?: string; suffix?: string; k: string };
type Case = {
  badge: string;
  origin: { label: string; tone: "client" | "scenario" };
  title: string;
  problem: string;
  solution: string;
  stats: Stat[];
  kicker: string;
};

const CASES: Case[] = [
  {
    badge: "Inbound · prospect calls",
    origin: { label: "Real client · anonymized", tone: "client" },
    title: "A family-run farm & butcher",
    problem:
      "Orders and questions come in by phone while the whole team is out working the farm and the cut floor. During holiday rushes the line never stops — and after-hours calls went straight to voicemail. Every missed call was an order walking to a competitor.",
    solution:
      "An AI voice agent now answers every call in under two rings — taking orders, fielding the same ten questions, and booking pickups — while the owner watches each call, transcript, and order land on a live dashboard.",
    stats: [
      { value: 100, suffix: "%", k: "Calls answered" },
      { value: 2, prefix: "~", suffix: " in 5", k: "Were after-hours" },
      { value: 20, prefix: "~", suffix: " hrs/wk", k: "Phone time back" },
    ],
    kicker: "No more orders lost to voicemail.",
  },
  {
    badge: "Support · existing customers",
    origin: { label: "Illustrative scenario", tone: "scenario" },
    title: "A personal-lines insurance agency",
    problem:
      "Existing clients call all day for the same things — a copy of their insurance card, a billing balance, a certificate, a claim. Each one ties up a licensed agent who should be selling, and after-hours service requests sit until morning.",
    solution:
      "The agent verifies the caller, texts their insurance card or dec page, reads back policy and billing, takes first-notice-of-loss claims, and routes anything complex to the right department — every step logged on the owner's dashboard.",
    stats: [
      { value: 70, suffix: "%", k: "Routine calls handled" },
      { value: 24, suffix: "/7", k: "Service coverage" },
      { value: 2, prefix: "<", suffix: " rings", k: "To pick up" },
    ],
    kicker: "Agents freed for the calls that actually need a human.",
  },
];

function OriginChip({ label, tone }: { label: string; tone: "client" | "scenario" }) {
  const live = tone === "client";
  return (
    <span className="bv-6 inline-flex items-center gap-1.5 bg-ink/[0.05] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink/50">
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${live ? "bg-brand-pink" : "bg-ink/30"}`} />
      {label}
    </span>
  );
}

export default function CaseStudies() {
  return (
    <section id="tl-va-cases" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[46rem]">
          <Eyebrow>Case studies</Eyebrow>
          <Kinetic
            segments={[{ text: "Two owners. Two problems. " }, { text: "One system.", gradient: true }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-relaxed text-ink/55">
              The same voice-agent-plus-dashboard pattern, solving both sides of the phone — winning
              new prospects and supporting the customers you already have.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12} y={34} amount={0.12} className="h-full">
              <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG} className="h-full">
                <article className="flex h-full flex-col p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-brand-pink">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                      {c.badge}
                    </span>
                    <span className="text-ink/20">·</span>
                    <OriginChip label={c.origin.label} tone={c.origin.tone} />
                  </div>

                  <h3 className="font-display mt-4 text-[1.5rem] font-normal leading-tight tracking-tight">{c.title}</h3>

                  <div className="mt-5">
                    <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/35">The problem</div>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/55">{c.problem}</p>
                  </div>
                  <div className="mt-5">
                    <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/35">What we built</div>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink/55">{c.solution}</p>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/35">Impact</span>
                      <span className="bv-6 bg-ink/[0.05] px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                        Illustrative
                      </span>
                    </div>
                    <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
                      {c.stats.map((s) => (
                        <div key={s.k} className="flex flex-col">
                          <dd className="font-body order-1 text-[1.3rem] font-bold leading-none tracking-tight tabular-nums">
                            <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                          </dd>
                          <dt className="order-2 mt-1.5 text-[0.6rem] uppercase tracking-wide text-ink/40">{s.k}</dt>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-[0.85rem] font-medium text-ink/70">{c.kicker}</p>
                  </div>
                </article>
              </Bevel>
            </Reveal>
          ))}
        </div>

        {/* illustrative ROI model — clearly framed, not a customer claim */}
        <Reveal delay={0.2} y={28}>
          <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="mt-5">
            <div className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
              <span className="bv-6 shrink-0 bg-ink/[0.05] px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                Illustrative model
              </span>
              <p className="text-[0.95rem] leading-relaxed text-ink/65">
                A business fielding <span className="font-medium text-ink/85">~200 calls/month</span> at a{" "}
                <span className="font-medium text-ink/85">~$150</span> average call value, recovering even half of the
                <span className="font-medium text-ink/85"> ~3-in-5</span> calls that used to go unanswered, is looking at roughly{" "}
                <span className="font-medium text-ink/85">$9k/month</span> in recovered revenue — plus the hours back.
              </p>
            </div>
          </Bevel>
        </Reveal>
      </div>
    </section>
  );
}
