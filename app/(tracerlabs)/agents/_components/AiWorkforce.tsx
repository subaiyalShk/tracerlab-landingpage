import Image from "next/image";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

// Category emblems are nano-banana generations (scripts/gen-agents-images.mjs) — neon
// pink→blue icons on dark-metal plates, matching the site's embossed-plate language.
const GROUPS: { category: string; emblem: string; agents: { name: string; role: string }[] }[] = [
  { category: "Front-End", emblem: "/assets/agents/gen/emblem-front-end.png", agents: [{ name: "AI Marketer", role: "Ads & Leads" }, { name: "AI Receptionist", role: "Instant Answers" }, { name: "AI Voice Agent", role: "Calls & Qualifies" }] },
  { category: "Sales", emblem: "/assets/agents/gen/emblem-sales.png", agents: [{ name: "AI Text Agent", role: "SMS Convos" }, { name: "AI Email Agent", role: "Follow-ups" }, { name: "AI Closer", role: "Closes Deals" }, { name: "AI Proposals", role: "Custom Docs" }] },
  { category: "Operations", emblem: "/assets/agents/gen/emblem-operations.png", agents: [{ name: "AI Project Manager", role: "Tasks & Timelines" }, { name: "Scheduler", role: "Auto Booking" }, { name: "Ops Dashboard", role: "Real-time View" }] },
  { category: "Support", emblem: "/assets/agents/gen/emblem-support.png", agents: [{ name: "AI Support", role: "24/7 Help" }] },
  { category: "Growth", emblem: "/assets/agents/gen/emblem-growth.png", agents: [{ name: "AI Referrals", role: "Grows Network" }, { name: "AI Reviews", role: "5-Star Ratings" }] },
  { category: "Finance", emblem: "/assets/agents/gen/emblem-finance.png", agents: [{ name: "AI Accountant", role: "P&L Reports" }] },
];

// One agent card. All motion is pure CSS:
//  • hover → lift + brand glow halo + sheen sweep + name brighten + status goes brand-pink
//  • always-on → a staggered orb-ripple "live signal" on the status dot (disabled under
//    prefers-reduced-motion via the global [class*="animate-"] rule)
function AgentCard({ name, role, delay }: { name: string; role: string; delay: number }) {
  return (
    <div className="group relative isolate">
      {/* brand glow halo — emanates from behind the card on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-55"
        style={{ background: "linear-gradient(120deg, #e7028d, #056afc)" }}
      />
      <Bevel
        bevel={12}
        border={GLASS_BORDER}
        bg={GLASS_BG}
        className="transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-1"
      >
        <div className="relative flex items-center justify-between gap-2 overflow-hidden p-4">
          {/* light sheen that sweeps across on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
          />
          <div className="relative min-w-0">
            <div className="font-display truncate text-[0.95rem] tracking-tight text-ink/90 transition-colors duration-300 group-hover:text-ink">
              {name}
            </div>
            <div className="truncate text-[0.78rem] text-ink/45">{role}</div>
          </div>
          <span className="bv-6 relative flex shrink-0 items-center gap-1.5 bg-ink/[0.06] px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-wide text-ink/45 transition-colors duration-300 group-hover:text-brand-pink">
            <span className="relative flex h-1.5 w-1.5 items-center justify-center">
              <span
                aria-hidden
                className="animate-orb-ripple absolute h-1.5 w-1.5 rounded-full bg-brand-pink/35 group-hover:bg-brand-pink/70"
                style={{ animationDelay: `${delay}s` }}
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-ink/30 transition-colors duration-300 group-hover:bg-brand-pink" />
            </span>
            Standby
          </span>
        </div>
      </Bevel>
    </div>
  );
}

export default function AiWorkforce() {
  return (
    <section id="tl-ag-workforce" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      {/* ambient drifting brand glow */}
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[130px]"
        style={{ background: "radial-gradient(circle, #e7028d 0%, transparent 70%)" }}
      />
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>Your AI workforce</Eyebrow>
          <Kinetic
            segments={[{ text: "Meet your AI " }, { text: "team.", gradient: true }]}
            className="font-display mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">A fully automated company working 24/7 to run and grow your business.</p>
          </Reveal>
        </div>

        {/* the team, assembled — cinematic lineup (nano-banana) framed like the site's panels */}
        <Reveal amount={0.2} y={30} className="mt-10">
          <Bevel bevel={16} border={GLASS_BORDER} bg={GLASS_BG}>
            <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
              <Image
                src="/assets/agents/gen/team-lineup.png"
                alt="A lineup of sleek AI agent figures standing ready, lit in the Tracerlabs pink and blue"
                fill
                sizes="(max-width: 1180px) 100vw, 1100px"
                className="object-cover object-[center_38%]"
              />
              {/* ground the figures into the panel */}
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-5 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/60">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-pink" />
                14 agents · always on
              </div>
            </div>
          </Bevel>
        </Reveal>

        <div className="mt-12 flex flex-col gap-8">
          {GROUPS.map((g, gi) => (
            <div key={g.category}>
              <Reveal amount={0.5} y={14}>
                <div className="mb-3 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink/40">
                  <Image src={g.emblem} alt="" width={36} height={36} className="bv-6 h-9 w-9 object-cover" />
                  {g.category}
                  <span aria-hidden className="h-px w-10 bg-gradient-to-r from-brand-pink/70 to-transparent" />
                </div>
              </Reveal>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {g.agents.map((a, ai) => (
                  <Reveal key={a.name} delay={ai * 0.07} y={20} amount={0.2}>
                    <AgentCard name={a.name} role={a.role} delay={((gi + ai) % 5) * 0.3} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Kinetic
          as="p"
          segments={[{ text: "Now you run the business. " }, { text: "The business doesn't run you.", gradient: true }]}
          className="font-display mt-14 max-w-[26ch] text-[clamp(1.5rem,3.2vw,2.2rem)] font-normal uppercase leading-[1.1] tracking-tight"
        />
      </div>
    </section>
  );
}
