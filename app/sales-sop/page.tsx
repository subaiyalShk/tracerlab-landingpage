"use client";

// Standalone internal Sales Team SOP / playbook for sales reps. Faithful port of the
// self-contained source app (light theme, inline styles) into the Next.js site as an
// isolated route at /sales-sop. Deliberately does NOT use the dark (tracerlabs) chrome,
// design system, Nav, or Footer — it lives outside the (tracerlabs) route group (like
// /solar) and is noindex/URL-only (see ./layout.tsx).

import { useState, type CSSProperties } from "react";

type Metric = { label: string; desc: string };
type Step = { title: string; body: string; callout?: string | null; metrics?: Metric[] };
type ColorKey = "blue" | "amber" | "green";
type Section = { id: string; label: string; icon: string; color: ColorKey; steps: Step[] };

const sections: Section[] = [
  {
    id: "opportunities",
    label: "Maximize Opportunities",
    icon: "🎯",
    color: "blue",
    steps: [
      {
        title: "1. Be Available More Than Anyone Else",
        body: "The single greatest predictor of total sales is total available time slots. Work the hours your prospects are available — including evenings and weekends. The rep who works the most hours almost always sells the most deals. No exceptions.",
        callout: "Rule: If the prospect is awake, you should be reachable.",
      },
      {
        title: "2. Pull Up Appointments Daily",
        body: "Every morning, scan your calendar. If you have an appointment set for Thursday and today is Monday — call them now. Today's calls have higher show rates and higher close rates. If someone hasn't confirmed and their slot is coming up, push them out one day and fill that slot with someone who's responsive.",
        callout: "Rule: Always try to have calls back-to-back-to-back with the hottest leads that day.",
      },
      {
        title: "3. BAMFAM — Book A Meeting From A Meeting",
        body: "Never end a call without knowing exactly when you're speaking to this prospect again. If they say 'let's circle back' — that's not good enough. Get a date and time locked in before you hang up. If they stall on booking, that IS an obstacle — address it now.",
        callout: "Rule: A prospect should never fall into no-man's land between calls.",
      },
      {
        title: "4. Work Leads Harder Than Anyone Else",
        body: "The best reps reach out more and follow up more. They don't take rejection personally. A no-show is not an insult — it's a number. Keep calling. Keep texting. The volume of your outreach attempts between calls directly correlates with the number of calls you take.",
        callout: "Rule: Rejection is just math. Keep going.",
      },
      {
        title: "5. Maintain a Kill List",
        body: "Keep a separate visible list of your highest-value prospects — not just in the CRM. Put it somewhere you see every single day. High-value deals need extra attention beyond the normal follow-up cadence.",
        callout: "Rule: Your top 5–10 prospects should be top of mind every morning.",
      },
      {
        title: "6. Ask for Referrals on Every Call",
        body: "At the end of every call, ask: 'Who do you know who's as awesome as you and would benefit from this?' — not 'Do you know anyone?' That forces a name, not a yes/no. Referrals close at 80–90%. One referral per 3–4 calls can cut your cost per acquisition in half.",
        callout: "Script: 'Who do you know who's like you and would love this?'",
      },
    ],
  },
  {
    id: "conversion",
    label: "Convert at the Highest Rate",
    icon: "⚡",
    color: "amber",
    steps: [
      {
        title: "7. Prepare Before Every Call (5-Min Rule)",
        body: "Before every call, spend 5–10 minutes on research. Look up their business, LinkedIn, social profiles, recent news. Open with something specific to them in the first 30 seconds. You build more know, like, and trust in the opening minute than anything else in the call.",
        callout: "Rule: 10% of call time = prep time. 60-min call = 6 min of research.",
      },
      {
        title: "8. Take Notes on Every Call",
        body: "Document everything the prospect tells you — family, business details, pain points, goals. Reference these notes at the start of follow-up calls. When a rep says 'I was reviewing our last conversation and remember you mentioned X' — the prospect feels known, not sold to.",
        callout: "Rule: Notes from this call = prep for the next call.",
      },
      {
        title: "9. Listen Twice as Much as You Talk",
        body: "The best salespeople listen 2x more than they speak. Answer questions with questions. The person answering questions is the one getting interrogated. You want them talking — because they believe everything THEY say and nothing YOU say. Let them convince themselves.",
        callout: "Script: 'What are you looking for?' → 'Why is that important to you?' → keep going.",
      },
      {
        title: "10. Breathe the Script",
        body: "Know your script so well you don't have to think about it. If you're trying to remember what to say next, you can't listen to what the prospect is actually telling you. Drill the script every morning. Role play. Work on ONE section at a time — intro this week, close next week.",
        callout: "Rule: You can't listen if you're trying to remember.",
      },
      {
        title: "11. Kill Zombies Upfront (Defuse Before Price)",
        body: "An OBSTACLE is something that comes up before you mention price. An OBJECTION is something that comes up after. Obstacles are 10x easier to handle. Proactively ask about time, budget, decision-makers, and fit BEFORE you ever talk about price. If you don't address it now, it will explode at the close.",
        callout: "The 3 Obstacles: (1) Circumstances — time, money, fit. (2) Authority — 'I need to check with my partner/boss.' (3) Self-doubt — 'I don't know if this will work for me.'",
      },
      {
        title: "12. Use Stories & Metaphors to Break Objections",
        body: "Facts tell, stories sell. For every objection, have a story ready about someone just like this prospect who had the same concern — and what happened when they went for it vs. didn't. Then play it out: 'Let's look at best case and worst case 5 years from now.'",
        callout: "Framework: Past story → Future projection → Best case / Worst case → Ask for decision.",
      },
      {
        title: "13. Ask for the Sale Again (Loop)",
        body: "When someone says no, ask WHY. Resolve the concern. Then ask again. Repeat. You can loop as many times as there are concerns to resolve — as long as you are actually resolving each one before you ask again. Never ask again without addressing the 'why' first.",
        callout: "Rule: Whoever cares most about the prospect wins the sale. Ask from a place of wanting to help, not wanting to close.",
      },
    ],
  },
  {
    id: "consistency",
    label: "Stay Consistent",
    icon: "🏆",
    color: "green",
    steps: [
      {
        title: "14. Kill for Sport — Be a Tiger",
        body: "There are three types of reps: Dogs (need constant feeding and attention), Horses (work when pushed), and Tigers (kill even when they're not hungry). Be a tiger. Take every lead seriously — even the 'bad' ones. They're free practice. A rep who treats every call like it matters becomes elite faster than anyone else.",
        callout: "Rule: Every call is either a close or a practice rep. Both have value.",
      },
      {
        title: "15. Track Your Metrics — All of Them",
        body: "Close rate alone tells you nothing. You need the full picture to know where you're leaking.",
        callout: null,
        metrics: [
          { label: "Lead Booking Rate", desc: "% of leads that book a call" },
          { label: "Show Rate", desc: "% of booked calls that actually show" },
          { label: "Offer Rate", desc: "% of shows you present an offer to" },
          { label: "Close Rate", desc: "% of offers that convert" },
          { label: "Avg Call to Close", desc: "How many calls does it take you to close a deal?" },
          { label: "Avg Cash Collected", desc: "Revenue per closed deal" },
        ],
      },
      {
        title: "16. Never Blame Circumstances",
        body: "Bad leads? Still your problem to solve. Quiet month? Still your problem to solve. The best reps never use circumstances as excuses. They look at what THEY can control and maximize that. If you have feedback on lead quality, give it one-on-one to your manager — not on a group call.",
        callout: "Rule: The worse the lead, the better you get at selling. Treat every rep as a gift.",
      },
    ],
  },
];

function ChecklistItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "8px 0", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}
      onClick={() => setChecked(!checked)}
    >
      <div
        style={{
          marginTop: "2px",
          width: "20px",
          height: "20px",
          borderRadius: "4px",
          border: checked ? "2px solid #2563eb" : "2px solid #d1d5db",
          background: checked ? "#2563eb" : "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      >
        {checked && <span style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}>✓</span>}
      </div>
      <span
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
          color: checked ? "#9ca3af" : "#374151",
          textDecoration: checked ? "line-through" : "none",
          transition: "all 0.15s",
        }}
      >
        {text}
      </span>
    </div>
  );
}

type ColorSet = {
  tabActive: CSSProperties;
  tabInactive: CSSProperties;
  dot: string;
  callout: CSSProperties;
};

const colorMap: Record<ColorKey, ColorSet> = {
  blue: {
    tabActive: { background: "#2563eb", color: "white" },
    tabInactive: { background: "white", color: "#1d4ed8", border: "1px solid #bfdbfe" },
    dot: "#2563eb",
    callout: { background: "#eff6ff", borderLeft: "4px solid #2563eb", color: "#1e40af" },
  },
  amber: {
    tabActive: { background: "#d97706", color: "white" },
    tabInactive: { background: "white", color: "#92400e", border: "1px solid #fde68a" },
    dot: "#d97706",
    callout: { background: "#fffbeb", borderLeft: "4px solid #d97706", color: "#92400e" },
  },
  green: {
    tabActive: { background: "#16a34a", color: "white" },
    tabInactive: { background: "white", color: "#166534", border: "1px solid #bbf7d0" },
    dot: "#16a34a",
    callout: { background: "#f0fdf4", borderLeft: "4px solid #16a34a", color: "#166534" },
  },
};

type ViewId = "sop" | "checklists" | "objections";

export default function SalesSOP() {
  const [activeTab, setActiveTab] = useState<ColorKey | string>("opportunities");
  const [activeView, setActiveView] = useState<ViewId>("sop");

  const activeSection = sections.find((s) => s.id === activeTab);
  const colors = colorMap[activeSection?.color ?? "blue"];

  const offCallChecklist = [
    "Pull up any appointments booked later this week to today if possible",
    "Push out any unconfirmed calls and fill those slots with responsive leads",
    "Send personalized pre-call touch to each scheduled prospect (voice memo, video, or gift card preference question)",
    "Follow up on every lead from yesterday who hasn't responded",
    "Check your Kill List — have you contacted each high-value prospect this week?",
    "Ask for a referral from anyone who closed or showed strong interest",
    "Log all outreach attempts in CRM with notes",
    "BAMFAM — confirm all booked calls have a follow-up slot if needed",
  ];

  const onCallChecklist = [
    "5-minute research: business, LinkedIn, social profiles — know something specific about them",
    "Open with something personal and specific in the first 30 seconds",
    "Ask about what they've tried before, what they liked, what didn't work",
    "Listen 2x more than you talk — answer questions with questions",
    "Surface all obstacles BEFORE you mention price (time, money, fit, decision-makers, self-doubt)",
    "If obstacle comes up, use a story + best case / worst case framework",
    "Ask for the sale confidently once obstacles are resolved",
    "If they hesitate, ask WHY, resolve the concern, then ask again",
    "Take detailed notes throughout the call",
    "BAMFAM — before hanging up, lock in the next meeting if they didn't close",
    "Ask for a referral: 'Who do you know who's like you and would love this?'",
  ];

  const objections = [
    { obstacle: "I don't have time right now", response: "Is this a seasonal thing, or will you always be this busy? If you want this to stick long-term, starting when you're busy is actually when you build the strongest habits — that's when I give the most support. When things slow down, it'll be easy. When busy hits again, you'll know exactly how to handle it." },
    { obstacle: "I need to think about it", response: "That's totally fine — what specifically is making you hesitant? Walk me through it. [Identify the real concern, address it, then ask again.] You're two steps closer to a real decision than someone who hasn't even thought about it yet." },
    { obstacle: "I need to check with my partner / spouse / business partner", response: "Makes sense. Let me ask you — are you looking for permission or for support? Because if you went home and they said no, what would you do? [Let them answer.] Most of the time people walk out and never come back — not because they didn't want it, but because they gave away their power. What can we do right now while we're both here?" },
    { obstacle: "I don't have the budget / money", response: "I hear you. Have you ever bought something before you were 100% sure you could afford it and made it work? [Yes] The question isn't whether the money is sitting in your account — it's whether this is the right move. Best case, this changes everything. Worst case, you find something to cut. Is that a bet you're willing to take?" },
    { obstacle: "I'm not sure this will work for me", response: "What specifically makes you think your situation is different? [Let them explain.] [Validate, then share a story of someone with the same doubt who succeeded.] You actually said earlier that X was the thing you needed — that's exactly what this addresses. What would need to be true for you to feel confident?" },
    { obstacle: "I need to do more research", response: "What's the main thing you'd be researching? [They say X.] Okay, let me address that right now. [Answer X directly.] What else would you want to know before moving forward? [Keep going until there are no more concerns, then ask for the sale again.]" },
  ];

  const rootStyle: CSSProperties = {
    fontFamily: "var(--font-inter), 'Inter', sans-serif",
    minHeight: "100vh",
    background: "#f9fafb",
    color: "#111827",
  };

  return (
    <div style={rootStyle}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>Sales Team SOP</h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
            The complete playbook for maximizing leads, converting at the highest rate, and staying consistent.
          </p>
        </div>
      </div>

      {/* View tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex" }}>
          {([
            { id: "sop", label: "Core SOP" },
            { id: "checklists", label: "Daily Checklists" },
            { id: "objections", label: "Objection Playbook" },
          ] as { id: ViewId; label: string }[]).map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              style={{
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                background: "none",
                cursor: "pointer",
                borderBottom: activeView === v.id ? "2px solid #2563eb" : "2px solid transparent",
                color: activeView === v.id ? "#2563eb" : "#6b7280",
                transition: "all 0.15s",
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
        {/* CORE SOP */}
        {activeView === "sop" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
              {sections.map((sec) => {
                const c = colorMap[sec.color];
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      border: "1px solid transparent",
                      ...(activeTab === sec.id ? c.tabActive : c.tabInactive),
                    }}
                  >
                    <span>{sec.icon}</span>
                    {sec.label}
                  </button>
                );
              })}
            </div>

            <div style={{ ...colors.callout, padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", fontWeight: 500 }}>
              {activeTab === "opportunities" &&
                "A salesperson's first job is to maximize the number of opportunities they have. Volume is the foundation. Everything else multiplies on top of it."}
              {activeTab === "conversion" &&
                "Once you have the call, you need to convert it. The best reps listen more than they talk, know their script cold, and address every obstacle before price is ever mentioned."}
              {activeTab === "consistency" &&
                "The difference between champions and everyone else is sustainability. Being elite for one week doesn't build a career. These habits are what make performance repeatable."}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activeSection?.steps.map((step, i) => (
                <div key={i} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", gap: "14px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors.dot, flexShrink: 0, marginTop: "6px" }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: 700, color: "#111827", marginBottom: "8px", fontSize: "15px" }}>{step.title}</h3>
                      <p style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6", marginBottom: "12px" }}>{step.body}</p>
                      {step.metrics && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                          {step.metrics.map((m, j) => (
                            <div key={j} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px" }}>
                              <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>{m.label}</div>
                              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{m.desc}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {step.callout && (
                        <div style={{ ...colors.callout, padding: "10px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: 500 }}>{step.callout}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAILY CHECKLISTS */}
        {activeView === "checklists" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {[
                { title: "Off-the-Call SOP", subtitle: "What you do between calls", emoji: "📵", items: offCallChecklist, accent: "#2563eb" },
                { title: "On-the-Call SOP", subtitle: "What you do on every single call", emoji: "📞", items: onCallChecklist, accent: "#d97706" },
              ].map((col, ci) => (
                <div key={ci} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{col.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#111827", fontSize: "15px" }}>{col.title}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{col.subtitle}</div>
                    </div>
                  </div>
                  {col.items.map((item, i) => (
                    <ChecklistItem key={i} text={item} />
                  ))}
                </div>
              ))}
            </div>

            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📊</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "15px" }}>Metrics You Must Track</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>If you only track close rate, you're flying blind</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[
                  { name: "Lead Booking Rate", formula: "Leads booked ÷ total leads" },
                  { name: "Show Rate", formula: "Shows ÷ booked calls" },
                  { name: "Offer Rate", formula: "Offers made ÷ shows" },
                  { name: "Close Rate", formula: "Closes ÷ offers made" },
                  { name: "Avg Calls to Close", formula: "Total calls ÷ total closes" },
                  { name: "Avg Cash Collected", formula: "Total revenue ÷ closes" },
                ].map((m, i) => (
                  <div key={i} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{m.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{m.formula}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "16px" }}>
                💡 Improving your show rate by 20% is just as valuable as improving your close rate by 20%. Control every variable in the funnel.
              </p>
            </div>
          </div>
        )}

        {/* OBJECTION PLAYBOOK */}
        {activeView === "objections" && (
          <div>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
              <p style={{ color: "#92400e", fontSize: "14px" }}>
                <strong>Remember:</strong> An <strong>obstacle</strong> comes up before price — address it proactively. An <strong>objection</strong> comes up after — it&apos;s 10x harder to handle. Kill the zombie upfront. Resolve the concern, then ask again.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {objections.map((obj, i) => (
                <div key={i} style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                  <div style={{ background: "#fef2f2", borderBottom: "1px solid #fecaca", padding: "12px 20px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ color: "#dc2626", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>Prospect:</span>
                    <span style={{ color: "#111827", fontWeight: 600, fontSize: "14px" }}>&quot;{obj.obstacle}&quot;</span>
                  </div>
                  <div style={{ padding: "16px 20px", display: "flex", gap: "8px" }}>
                    <span style={{ color: "#16a34a", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", flexShrink: 0, marginTop: "2px" }}>You:</span>
                    <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>{obj.response}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", marginTop: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontWeight: 700, color: "#111827", marginBottom: "12px" }}>🃏 The Best Case / Worst Case Close</h3>
              <p style={{ color: "#4b5563", fontSize: "14px", marginBottom: "12px" }}>When someone is paralyzed by fear, walk them through it explicitly:</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ color: "#dc2626", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>Worst Case</div>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.5" }}>
                    &quot;Let&apos;s say this doesn&apos;t work. Where are you? Probably in the same place you&apos;re in right now — and you&apos;ve been there before and survived. That&apos;s your floor.&quot;
                  </p>
                </div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ color: "#16a34a", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>Best Case</div>
                  <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.5" }}>
                    &quot;Now let&apos;s say this works. Play it out 3–5 years. What does that look like for your business? Your family? That&apos;s your ceiling. Is that a bet you&apos;re willing to take?&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
