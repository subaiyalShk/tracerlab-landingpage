"use client";

// Standalone internal Sales Team SOP / playbook for sales reps. Lives outside the (tracerlabs)
// route group (like /solar) so it never inherits the dark site chrome; it's noindex/URL-only
// (see ./layout.tsx). All styling lives in ./sop.css (real classes + media queries) so the
// layout is fully responsive; per-section accent (blue/amber/green) is switched via
// data-accent="..." wrappers that feed the --accent-* custom properties.

import { useState } from "react";

type Metric = { label: string; desc: string };
type Step = { title: string; body: string; callout?: string | null; metrics?: Metric[] };
type ColorKey = "blue" | "amber" | "green";
type Section = { id: string; label: string; icon: string; color: ColorKey; intro: string; steps: Step[] };

const sections: Section[] = [
  {
    id: "opportunities",
    label: "Maximize Opportunities",
    icon: "🎯",
    color: "blue",
    intro:
      "A salesperson's first job is to maximize the number of opportunities they have. Volume is the foundation. Everything else multiplies on top of it.",
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
    intro:
      "Once you have the call, you need to convert it. The best reps listen more than they talk, know their script cold, and address every obstacle before price is ever mentioned.",
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
    intro:
      "The difference between champions and everyone else is sustainability. Being elite for one week doesn't build a career. These habits are what make performance repeatable.",
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

const checklistColumns: { title: string; subtitle: string; emoji: string; accent: ColorKey; items: string[] }[] = [
  {
    title: "Off-the-Call SOP",
    subtitle: "What you do between calls",
    emoji: "📵",
    accent: "blue",
    items: [
      "Pull up any appointments booked later this week to today if possible",
      "Push out any unconfirmed calls and fill those slots with responsive leads",
      "Send personalized pre-call touch to each scheduled prospect (voice memo, video, or gift card preference question)",
      "Follow up on every lead from yesterday who hasn't responded",
      "Check your Kill List — have you contacted each high-value prospect this week?",
      "Ask for a referral from anyone who closed or showed strong interest",
      "Log all outreach attempts in CRM with notes",
      "BAMFAM — confirm all booked calls have a follow-up slot if needed",
    ],
  },
  {
    title: "On-the-Call SOP",
    subtitle: "What you do on every single call",
    emoji: "📞",
    accent: "amber",
    items: [
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
    ],
  },
];

const metricFormulas = [
  { name: "Lead Booking Rate", formula: "Leads booked ÷ total leads" },
  { name: "Show Rate", formula: "Shows ÷ booked calls" },
  { name: "Offer Rate", formula: "Offers made ÷ shows" },
  { name: "Close Rate", formula: "Closes ÷ offers made" },
  { name: "Avg Calls to Close", formula: "Total calls ÷ total closes" },
  { name: "Avg Cash Collected", formula: "Total revenue ÷ closes" },
];

const objections = [
  { obstacle: "I don't have time right now", response: "Is this a seasonal thing, or will you always be this busy? If you want this to stick long-term, starting when you're busy is actually when you build the strongest habits — that's when I give the most support. When things slow down, it'll be easy. When busy hits again, you'll know exactly how to handle it." },
  { obstacle: "I need to think about it", response: "That's totally fine — what specifically is making you hesitant? Walk me through it. [Identify the real concern, address it, then ask again.] You're two steps closer to a real decision than someone who hasn't even thought about it yet." },
  { obstacle: "I need to check with my partner / spouse / business partner", response: "Makes sense. Let me ask you — are you looking for permission or for support? Because if you went home and they said no, what would you do? [Let them answer.] Most of the time people walk out and never come back — not because they didn't want it, but because they gave away their power. What can we do right now while we're both here?" },
  { obstacle: "I don't have the budget / money", response: "I hear you. Have you ever bought something before you were 100% sure you could afford it and made it work? [Yes] The question isn't whether the money is sitting in your account — it's whether this is the right move. Best case, this changes everything. Worst case, you find something to cut. Is that a bet you're willing to take?" },
  { obstacle: "I'm not sure this will work for me", response: "What specifically makes you think your situation is different? [Let them explain.] [Validate, then share a story of someone with the same doubt who succeeded.] You actually said earlier that X was the thing you needed — that's exactly what this addresses. What would need to be true for you to feel confident?" },
  { obstacle: "I need to do more research", response: "What's the main thing you'd be researching? [They say X.] Okay, let me address that right now. [Answer X directly.] What else would you want to know before moving forward? [Keep going until there are no more concerns, then ask for the sale again.]" },
];

const WORST_CASE =
  "“Let's say this doesn't work. Where are you? Probably in the same place you're in right now — and you've been there before and survived. That's your floor.”";
const BEST_CASE =
  "“Now let's say this works. Play it out 3–5 years. What does that look like for your business? Your family? That's your ceiling. Is that a bet you're willing to take?”";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "sop", label: "Core SOP" },
  { id: "checklists", label: "Daily Checklists" },
  { id: "objections", label: "Objection Playbook" },
];

type ViewId = "sop" | "checklists" | "objections";

function splitNum(title: string): [string, string] {
  const m = title.match(/^(\d+)\.\s*(.*)$/);
  return m ? [m[1], m[2]] : ["•", title];
}

function ChecklistItem({ text }: { text: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <button type="button" className={`sop-check${checked ? " is-checked" : ""}`} aria-pressed={checked} onClick={() => setChecked((v) => !v)}>
      <span className="sop-check-box" aria-hidden>
        {checked ? "✓" : ""}
      </span>
      <span className="sop-check-text">{text}</span>
    </button>
  );
}

export default function SalesSOP() {
  const [activeTab, setActiveTab] = useState<string>("opportunities");
  const [activeView, setActiveView] = useState<ViewId>("sop");

  const activeSection = sections.find((s) => s.id === activeTab) ?? sections[0];

  return (
    <div className="sop">
      {/* Header */}
      <header className="sop-header">
        <div className="sop-header-inner">
          <div className="sop-eyebrow">Sales Playbook</div>
          <h1 className="sop-title">Sales Team SOP</h1>
          <p className="sop-sub">
            The complete playbook for maximizing leads, converting at the highest rate, and staying consistent.
          </p>
        </div>
      </header>

      {/* Sticky view tabs */}
      <nav className="sop-tabbar">
        <div className="sop-tabbar-inner">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`sop-tab${activeView === v.id ? " is-active" : ""}`}
              aria-pressed={activeView === v.id}
              onClick={() => setActiveView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="sop-main">
        {/* CORE SOP */}
        {activeView === "sop" && (
          <div className="sop-view" key="sop">
            <div className="sop-pills">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  data-accent={sec.color}
                  className={`sop-pill${activeTab === sec.id ? " is-active" : ""}`}
                  aria-pressed={activeTab === sec.id}
                  onClick={() => setActiveTab(sec.id)}
                >
                  <span className="sop-pill-ic" aria-hidden>
                    {sec.icon}
                  </span>
                  {sec.label}
                </button>
              ))}
            </div>

            <div data-accent={activeSection.color}>
              <div className="sop-intro">{activeSection.intro}</div>
              <div className="sop-steps" key={activeSection.id}>
                {activeSection.steps.map((step, i) => {
                  const [num, title] = splitNum(step.title);
                  return (
                    <article className="sop-step" key={i}>
                      <div className="sop-step-num" aria-hidden>
                        {num}
                      </div>
                      <div className="sop-step-main">
                        <h3 className="sop-step-title">{title}</h3>
                        <p className="sop-step-body">{step.body}</p>
                        {step.metrics && (
                          <div className="sop-metrics">
                            {step.metrics.map((m, j) => (
                              <div className="sop-metric" key={j}>
                                <div className="sop-metric-l">{m.label}</div>
                                <div className="sop-metric-d">{m.desc}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {step.callout && <div className="sop-callout">{step.callout}</div>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* DAILY CHECKLISTS */}
        {activeView === "checklists" && (
          <div className="sop-view" key="checklists">
            <div className="sop-cols">
              {checklistColumns.map((col) => (
                <section className="sop-card" data-accent={col.accent} key={col.title}>
                  <div className="sop-card-head">
                    <div className="sop-tile" aria-hidden>
                      {col.emoji}
                    </div>
                    <div>
                      <div className="sop-card-title">{col.title}</div>
                      <div className="sop-card-sub">{col.subtitle}</div>
                    </div>
                  </div>
                  {col.items.map((item, i) => (
                    <ChecklistItem key={i} text={item} />
                  ))}
                </section>
              ))}
            </div>

            <section className="sop-card" data-accent="green">
              <div className="sop-card-head">
                <div className="sop-tile" aria-hidden>
                  📊
                </div>
                <div>
                  <div className="sop-card-title">Metrics You Must Track</div>
                  <div className="sop-card-sub">If you only track close rate, you&apos;re flying blind</div>
                </div>
              </div>
              <div className="sop-metrics">
                {metricFormulas.map((m, i) => (
                  <div className="sop-metric" key={i}>
                    <div className="sop-metric-l">{m.name}</div>
                    <div className="sop-metric-d">{m.formula}</div>
                  </div>
                ))}
              </div>
              <p className="sop-note">
                💡 Improving your show rate by 20% is just as valuable as improving your close rate by 20%. Control every variable in the funnel.
              </p>
            </section>
          </div>
        )}

        {/* OBJECTION PLAYBOOK */}
        {activeView === "objections" && (
          <div className="sop-view" key="objections">
            <div className="sop-banner">
              <strong>Remember:</strong> An <strong>obstacle</strong> comes up before price — address it proactively. An{" "}
              <strong>objection</strong>{" "}comes up after — it&apos;s 10x harder to handle. Kill the zombie upfront. Resolve the concern, then ask again.
            </div>
            <div className="sop-objs">
              {objections.map((obj, i) => (
                <div className="sop-obj" key={i}>
                  <div className="sop-obj-q">
                    <span className="sop-tag sop-tag--q">Prospect:</span>
                    <span className="sop-obj-qt">&ldquo;{obj.obstacle}&rdquo;</span>
                  </div>
                  <div className="sop-obj-a">
                    <span className="sop-tag sop-tag--a">You:</span>
                    <p className="sop-obj-at">{obj.response}</p>
                  </div>
                </div>
              ))}
            </div>

            <section className="sop-case">
              <h3 className="sop-case-title">🃏 The Best Case / Worst Case Close</h3>
              <p className="sop-case-lead">When someone is paralyzed by fear, walk them through it explicitly:</p>
              <div className="sop-case-grid">
                <div className="sop-case-cell sop-case-cell--worst">
                  <div className="sop-case-k">Worst Case</div>
                  <p className="sop-case-p">{WORST_CASE}</p>
                </div>
                <div className="sop-case-cell sop-case-cell--best">
                  <div className="sop-case-k">Best Case</div>
                  <p className="sop-case-p">{BEST_CASE}</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
