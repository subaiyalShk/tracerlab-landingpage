import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const GROUPS: { category: string; agents: { name: string; role: string }[] }[] = [
  { category: "Front-End", agents: [{ name: "AI Marketer", role: "Ads & Leads" }, { name: "AI Receptionist", role: "Instant Answers" }, { name: "AI Voice Agent", role: "Calls & Qualifies" }] },
  { category: "Sales", agents: [{ name: "AI Text Agent", role: "SMS Convos" }, { name: "AI Email Agent", role: "Follow-ups" }, { name: "AI Closer", role: "Closes Deals" }, { name: "AI Proposals", role: "Custom Docs" }] },
  { category: "Operations", agents: [{ name: "AI Project Manager", role: "Tasks & Timelines" }, { name: "Scheduler", role: "Auto Booking" }, { name: "Ops Dashboard", role: "Real-time View" }] },
  { category: "Support", agents: [{ name: "AI Support", role: "24/7 Help" }] },
  { category: "Growth", agents: [{ name: "AI Referrals", role: "Grows Network" }, { name: "AI Reviews", role: "5-Star Ratings" }] },
  { category: "Finance", agents: [{ name: "AI Accountant", role: "P&L Reports" }] },
];

export default function AiWorkforce() {
  return (
    <section id="tl-ag-workforce" className="relative isolate w-full overflow-hidden bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>Your AI workforce</Eyebrow>
          <h2 className="font-display animate-rise mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight">Meet your AI team</h2>
          <p className="animate-rise mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">A fully automated company working 24/7 to run and grow your business.</p>
        </div>
        <div className="mt-12 flex flex-col gap-8">
          {GROUPS.map((g) => (
            <div key={g.category}>
              <div className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink/40">{g.category}</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {g.agents.map((a) => (
                  <Bevel key={a.name} bevel={12} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md">
                    <div className="flex items-center justify-between gap-2 p-4">
                      <div className="min-w-0">
                        <div className="font-display truncate text-[0.95rem] tracking-tight">{a.name}</div>
                        <div className="truncate text-[0.78rem] text-ink/45">{a.role}</div>
                      </div>
                      <span className="bv-6 shrink-0 bg-ink/[0.06] px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-ink/45">Standby</span>
                    </div>
                  </Bevel>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="animate-rise mt-12 max-w-[40rem] text-[1.1rem] font-medium leading-snug text-ink/80">
          Now you run the business. The business doesn&apos;t run you.
        </p>
      </div>
    </section>
  );
}
