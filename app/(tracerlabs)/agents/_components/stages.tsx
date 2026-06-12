// Shared autopilot-stage data + the default "screen" renderer, used by AutopilotConsole.
export type Visual =
  | { kind: "chat"; lines: { who: "them" | "ai"; text: string }[] }
  | { kind: "rows"; rows: { label: string; value: string; tone?: "pink" | "blue" | "muted" }[] }
  | { kind: "kv"; title: string; items: { k: string; v: string }[]; total?: { k: string; v: string } }
  | { kind: "stat"; big: string; label: string };

export type Stage = { n: number; title: string; desc: string; visual: Visual };

export const STAGES: Stage[] = [
  { n: 1, title: "AI Generates Leads", desc: "Captures inbound interest across every channel, 24/7.", visual: { kind: "chat", lines: [{ who: "them", text: "Hi, I'm interested in your AI solutions." }, { who: "ai", text: "Thanks for reaching out! What industry are you in?" }] } },
  { n: 2, title: "AI Responds Instantly", desc: "Replies in seconds — no lead ever waits.", visual: { kind: "stat", big: "< 30s", label: "Avg response time" } },
  { n: 3, title: "AI Calls & Books", desc: "An AI voice agent calls, qualifies, and books the meeting — in a natural human voice.", visual: { kind: "rows", rows: [{ label: "Sarah Mitchell · Acme Corp", value: "LIVE 00:47", tone: "pink" }, { label: "Booking appointment…", value: "Thu 2:00 PM ✓", tone: "blue" }] } },
  { n: 4, title: "AI Receptionist & Scheduler", desc: "Answers the front desk and drops appointments straight onto the calendar.", visual: { kind: "rows", rows: [{ label: "9:00 AM · Team Standup", value: "" }, { label: "11:00 AM · Client Demo", value: "" }, { label: "2:00 PM · New Consultation", value: "NEW", tone: "blue" }] } },
  { n: 5, title: "AI Qualifies & Books", desc: "Scores every lead and auto-books the qualified ones.", visual: { kind: "rows", rows: [{ label: "Acme Corp", value: "Qualified", tone: "blue" }, { label: "TechFlow Inc", value: "Reviewing", tone: "muted" }, { label: "DataSys LLC", value: "Nurture", tone: "muted" }] } },
  { n: 6, title: "AI Follows Up", desc: "Multi-touch sequences that never miss a beat.", visual: { kind: "rows", rows: [{ label: "Welcome email", value: "Day 1 ✓" }, { label: "Case study shared", value: "Day 3 ✓" }, { label: "Value proposition", value: "Day 5 ✓" }, { label: "Meeting reminder", value: "Day 7" }] } },
  { n: 7, title: "AI Proposal Generator", desc: "Drafts custom proposals instantly and sends the PDF.", visual: { kind: "kv", title: "Proposal #PR-0847 · Acme Corp", items: [{ k: "AI Chatbot Integration", v: "$12,000" }, { k: "Voice Agent Setup", v: "$8,500" }, { k: "CRM Automation", v: "$6,000" }], total: { k: "Total", v: "$26,500" } } },
  { n: 8, title: "AI Closer", desc: "Sends the agreement, collects signatures, and takes payment.", visual: { kind: "rows", rows: [{ label: "Agreement signed + countersigned", value: "✓", tone: "blue" }, { label: "$124,000 paid via Stripe", value: "PAID", tone: "pink" }] } },
  { n: 9, title: "Operations Run Smoothly", desc: "A real-time dashboard keeps every deliverable on track.", visual: { kind: "rows", rows: [{ label: "Tasks", value: "24/24" }, { label: "Onboarding", value: "Active", tone: "blue" }, { label: "SLA", value: "99.9%" }] } },
  { n: 10, title: "AI Project Manager", desc: "Schedules onboarding, spins up channels, and assigns the work.", visual: { kind: "rows", rows: [{ label: "Scheduled onboarding call", value: "Mon 10 AM ✓" }, { label: "Created #acme-redesign", value: "Slack ✓" }, { label: "Assigned tasks", value: "4 members" }] } },
  { n: 11, title: "AI Customer Support", desc: "Resolves tickets around the clock with sub-30s replies.", visual: { kind: "rows", rows: [{ label: "CSAT", value: "98.5%", tone: "blue" }, { label: "Avg reply", value: "< 30s" }, { label: "Tickets resolved", value: "24/7" }] } },
  { n: 12, title: "Generates Referrals", desc: "Turns happy customers into a growth engine.", visual: { kind: "stat", big: "3.2×", label: "Referral multiplier" } },
  { n: 13, title: "AI Accountant", desc: "Produces monthly P&L and sends it to stakeholders.", visual: { kind: "kv", title: "P&L · Mar 2026", items: [{ k: "Revenue", v: "$284,500" }, { k: "Operating Expenses", v: "-$92,300" }], total: { k: "Net Profit", v: "$105,600" } } },
  { n: 14, title: "Gets Reviews", desc: "Collects 5-star reviews automatically.", visual: { kind: "stat", big: "4.9★", label: "47 reviews this month" } },
];

function toneClass(t?: "pink" | "blue" | "muted") {
  if (t === "pink") return "text-brand-pink";
  if (t === "blue") return "text-brand-blue";
  return "text-ink/45";
}

export function StageVisual({ v }: { v: Visual }) {
  if (v.kind === "chat") {
    return (
      <div className="flex flex-col gap-2">
        {v.lines.map((l, i) => (
          <div key={i} className={`bv-6 max-w-[85%] px-3 py-2 text-[0.8rem] ${l.who === "ai" ? "self-end bg-ink/[0.06] text-ink/80" : "self-start bg-brand-pink/15 text-ink/80"}`}>
            {l.text}
          </div>
        ))}
      </div>
    );
  }
  if (v.kind === "stat") {
    return (
      <div className="flex flex-col items-start justify-center">
        <div className="font-display bg-clip-text text-[2.6rem] leading-none text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>{v.big}</div>
        <div className="mt-2 text-[0.78rem] uppercase tracking-wide text-ink/45">{v.label}</div>
      </div>
    );
  }
  if (v.kind === "kv") {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-ink/40">{v.title}</div>
        {v.items.map((it, i) => (
          <div key={i} className="flex items-center justify-between text-[0.82rem] text-ink/70">
            <span>{it.k}</span><span className="font-medium">{it.v}</span>
          </div>
        ))}
        {v.total && (
          <div className="mt-1 flex items-center justify-between border-t border-ink/8 pt-1.5 text-[0.85rem] font-semibold text-ink">
            <span>{v.total.k}</span><span className="text-brand-blue">{v.total.v}</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      {v.rows.map((r, i) => (
        <div key={i} className="flex items-center justify-between text-[0.82rem]">
          <span className="text-ink/70">{r.label}</span>
          {r.value && <span className={`shrink-0 font-medium ${toneClass(r.tone)}`}>{r.value}</span>}
        </div>
      ))}
    </div>
  );
}
