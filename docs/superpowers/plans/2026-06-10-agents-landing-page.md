# `/agents` Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Build a new `/agents` landing page for the Custom AI Products & Agents offering — the replit "Autopilot System" content rendered in the current design system (Bevel/Button/Eyebrow, light/dark `--tl-*` tokens, next/font), with a live embedded `VoiceWidget`, linked from the Services "Custom AI Products & Agents" pillar.

**Architecture:** A new Server Component route `app/(tracerlabs)/agents/page.tsx` (inherits the route-group layout: next/font, tokens, metadataBase) composes `<Nav>` + section components + `<Footer>`. New sections live in `app/(tracerlabs)/agents/_components/`. Repetitive content (14 stages, workforce, stats) is data-driven (one card component + a data array). Reuses Bevel/Button/Eyebrow/VoiceWidget/TechBar.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (no preflight), next/og.

**Spec:** `docs/superpowers/specs/2026-06-10-agents-landing-page-design.md`. **Branch:** `feat/agents-landing-page`.

> No unit-test runner. Per-task: `npx eslint <files>`. **Real gate: `npm run build` + browser QA in BOTH themes** (Task 9). Stop `next dev` before building. Ignore the 2 pre-existing `video/scenes` lint errors. Design-system reference (read these for patterns): `app/components/Bevel.tsx` (`<Bevel bevel border bg className innerClassName style>`, exports `GLASS_BORDER`/`GLASS_BG`), `app/components/Button.tsx` (`<Button href variant="primary|secondary" size="md|sm">`), `app/components/Eyebrow.tsx` (`<Eyebrow>text</Eyebrow>`), `app/components/Cta.tsx` (env→VoiceWidget pattern), `app/components/Services.tsx` (embossed `IconTile` plate recipe), `app/components/Footer.tsx`/`Nav.tsx`.

---

## File Structure

**Create:**
- `app/(tracerlabs)/agents/page.tsx` — route; server component; reads env; metadata; composes Nav + sections + Footer.
- `app/(tracerlabs)/agents/opengraph-image.tsx` — OG card.
- `app/(tracerlabs)/agents/_components/AgentsHero.tsx`
- `app/(tracerlabs)/agents/_components/AutopilotSystem.tsx` (+ STAGES data + StageCard + StageVisual)
- `app/(tracerlabs)/agents/_components/AiWorkforce.tsx`
- `app/(tracerlabs)/agents/_components/WhatThisReplaces.tsx`
- `app/(tracerlabs)/agents/_components/FinancialImpact.tsx`
- `app/(tracerlabs)/agents/_components/AgentsCta.tsx`

**Modify:**
- `app/sitemap.ts` — add `/agents`.
- `app/components/Services.tsx` — `CUSTOM.cta.href` `#projects` → `/agents`.

---

## Task 1: Route scaffold + plumbing (renders Nav + empty main + Footer)

**Files:** Create `app/(tracerlabs)/agents/page.tsx`, `app/(tracerlabs)/agents/opengraph-image.tsx`; Modify `app/sitemap.ts`, `app/components/Services.tsx`

- [ ] **Step 1: Create `app/(tracerlabs)/agents/page.tsx`**
```tsx
import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Custom AI Products & Agents",
  description:
    "Voice call agents and custom agentic workflows that run your business on autopilot — from lead generation to closing deals to managing operations.",
  alternates: { canonical: "/agents" },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/agents",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Custom AI Products & Agents | Tracerlabs",
    description:
      "Voice call agents and custom agentic workflows that run your business on autopilot.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom AI Products & Agents | Tracerlabs",
    description:
      "Voice call agents and custom agentic workflows that run your business on autopilot.",
  },
};

// Server component. (The Retell env reads for VoiceWidget are added in Task 8, alongside the
// CTA that consumes them — keeping page.tsx lint-clean here with no unused vars.)
export default function AgentsPage() {
  return (
    <>
      <Nav />
      {/* font-body so all new sections inherit the brand body font (no #tl-* isolation edit
          needed — the legacy *{font-family:Inter} leak was removed in the perf work). Headings
          use the font-display utility. */}
      <main id="content" className="font-body bg-page text-ink">
        {/* sections added in Tasks 2–8 */}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create `app/(tracerlabs)/agents/opengraph-image.tsx`**
```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Custom AI Products & Agents — Tracerlabs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const duborics = await readFile(join(process.cwd(), "public/fonts/DuboricsRegular.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Duborics",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#8a8a93" }}>
          TRACERLABS · AI AGENTS & WORKFLOWS
        </div>
        <div style={{ display: "flex", fontSize: 78, lineHeight: 1.05, marginTop: 28 }}>
          Scale your Intelligence.
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Duborics", data: duborics, style: "normal", weight: 400 }] },
  );
}
```

- [ ] **Step 3: Add `/agents` to `app/sitemap.ts`**

In the returned array, add this entry after the `/` entry (keep `/solar`):
```ts
    { url: "https://tracerlabs.io/agents", changeFrequency: "weekly", priority: 0.8 },
```

- [ ] **Step 4: Repoint the Services pillar to `/agents`**

In `app/components/Services.tsx`, find the `CUSTOM` service object's cta:
```tsx
  cta: { label: "See the work", href: "#projects" },
```
(it is the `const CUSTOM: Service = { … }` block — "Custom AI Products & Agents"). Change it to:
```tsx
  cta: { label: "Explore AI agents", href: "/agents" },
```

- [ ] **Step 5: Lint**

Run: `npx eslint "app/(tracerlabs)/agents/page.tsx" "app/(tracerlabs)/agents/opengraph-image.tsx" app/sitemap.ts app/components/Services.tsx`
Expected: no errors.

- [ ] **Step 6: Commit**
```bash
git add "app/(tracerlabs)/agents" app/sitemap.ts app/components/Services.tsx
git commit -m "feat(agents): route scaffold + metadata + OG + sitemap + Services link"
```

---

## Task 2: `AgentsHero` section

**Files:** Create `app/(tracerlabs)/agents/_components/AgentsHero.tsx`; Modify `app/(tracerlabs)/agents/page.tsx`

- [ ] **Step 1: Create the hero**
```tsx
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";

export default function AgentsHero() {
  return (
    <section id="tl-ag-hero" className="relative isolate w-full overflow-hidden bg-page">
      {/* ambient brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[15%] left-1/2 -z-10 h-[55vw] w-[70vw] -translate-x-1/2 rounded-full opacity-[0.18] blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(231,2,141,0.4) 0%, rgba(5,106,252,0.2) 45%, transparent 72%)",
        }}
      />
      <div className="mx-auto w-full max-w-[1100px] px-6 py-24 text-center sm:px-10 sm:py-28 lg:py-32">
        <Eyebrow className="mx-auto">Custom AI Products &amp; Agents</Eyebrow>
        <h1 className="font-display animate-rise mx-auto mt-7 max-w-[18ch] text-[clamp(2.2rem,6vw,4rem)] font-normal uppercase leading-[1.02] tracking-tight">
          Scale your{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}
          >
            Intelligence
          </span>
          .
        </h1>
        <p className="animate-rise mx-auto mt-7 max-w-[42rem] text-[1.08rem] leading-relaxed text-ink/55">
          Tracerlabs builds AI systems that run your business on autopilot — from lead generation
          to closing deals to managing operations.
        </p>
        <div className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="#tl-ag-cta" variant="primary">Book a Demo</Button>
          <Button href="#tl-ag-system" variant="secondary">See How It Works</Button>
        </div>
      </div>
    </section>
  );
}
```
> `Eyebrow` accepts a `className` (passed through to its root) — `mx-auto` centers the inline-flex chip. If the chip doesn't center, wrap it: `<div className="flex justify-center"><Eyebrow>…</Eyebrow></div>`.

- [ ] **Step 2: Wire into page.tsx**

In `app/(tracerlabs)/agents/page.tsx`, add the import:
```tsx
import AgentsHero from "./_components/AgentsHero";
```
and replace the `{/* sections added in Tasks 2–8 */}` comment inside `<main>` with:
```tsx
        <AgentsHero />
```
(Subsequent section tasks add their `<Section />` immediately after the previous one.)

- [ ] **Step 3: Lint + commit**
```bash
npx eslint "app/(tracerlabs)/agents/_components/AgentsHero.tsx" "app/(tracerlabs)/agents/page.tsx"
git add "app/(tracerlabs)/agents"
git commit -m "feat(agents): hero section"
```

---

## Task 3: `TrustStrip` (reuse TechBar)

**Files:** Create `app/(tracerlabs)/agents/_components/TrustStrip.tsx`; Modify `page.tsx`

- [ ] **Step 1: Create the trust strip**
```tsx
import TechBar from "../../../components/TechBar";

export default function TrustStrip() {
  return (
    <section id="tl-ag-trust" className="w-full bg-page pt-6">
      <p className="mx-auto mb-2 max-w-[1280px] px-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink/35 sm:px-10">
        Powering infrastructure for industry leaders
      </p>
      <TechBar />
    </section>
  );
}
```

- [ ] **Step 2: Wire into page.tsx** — add `import TrustStrip from "./_components/TrustStrip";` and place `<TrustStrip />` immediately after `<AgentsHero />`.

- [ ] **Step 3: Lint + commit**
```bash
npx eslint "app/(tracerlabs)/agents/_components/TrustStrip.tsx" "app/(tracerlabs)/agents/page.tsx"
git add "app/(tracerlabs)/agents"
git commit -m "feat(agents): trust strip (reuse TechBar)"
```

---

## Task 4: `AutopilotSystem` — 14 stages (data-driven)

**Files:** Create `app/(tracerlabs)/agents/_components/AutopilotSystem.tsx`; Modify `page.tsx`

Data-driven: a `STAGES` array → one `StageCard`. Each stage has a small representative visual chosen from a few `kind`s (`chat`, `rows`, `kv`, `stat`) rendered by `StageVisual` — clean design-system mock panels, not pixel replicas.

- [ ] **Step 1: Create the component**
```tsx
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

type Visual =
  | { kind: "chat"; lines: { who: "them" | "ai"; text: string }[] }
  | { kind: "rows"; rows: { label: string; value: string; tone?: "pink" | "blue" | "muted" }[] }
  | { kind: "kv"; title: string; items: { k: string; v: string }[]; total?: { k: string; v: string } }
  | { kind: "stat"; big: string; label: string };

type Stage = { n: number; title: string; desc: string; visual: Visual };

const STAGES: Stage[] = [
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

function StageVisual({ v }: { v: Visual }) {
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
  // rows
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

function StageCard({ s, mediaRight }: { s: Stage; mediaRight: boolean }) {
  return (
    <article className={`animate-rise flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12 ${mediaRight ? "" : "lg:flex-row-reverse"}`}>
      <div className="lg:w-[46%]">
        <span
          className="bv-6 inline-flex h-9 w-9 items-center justify-center text-[0.85rem] font-bold text-[#e9eaef]"
          style={{
            backgroundImage: "linear-gradient(145deg, #2b2c33, #16171b)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.14), inset 0 -2px 3px rgba(0,0,0,0.55), 0 4px 12px -6px rgba(0,0,0,0.6)",
            textShadow: "0 1px 1px rgba(0,0,0,0.75), 0 -0.5px 0.5px rgba(255,255,255,0.3)",
          }}
        >
          {s.n}
        </span>
        <h3 className="font-display mt-4 text-[clamp(1.3rem,2.4vw,1.7rem)] font-normal leading-tight tracking-tight">{s.title}</h3>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/55">{s.desc}</p>
      </div>
      <div className="lg:flex-1">
        <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md">
          <div className="p-5 sm:p-6">
            <StageVisual v={s.visual} />
          </div>
        </Bevel>
      </div>
    </article>
  );
}

export default function AutopilotSystem() {
  return (
    <section id="tl-ag-system" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>The autopilot system</Eyebrow>
          <h2 className="font-display animate-rise mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight">
            Your business on{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>autopilot</span>.
          </h2>
          <p className="animate-rise mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">
            Fourteen AI-powered stages working 24/7 to generate, convert, and retain customers — without lifting a finger.
          </p>
        </div>
        <div className="mt-14 flex flex-col gap-14 sm:gap-16">
          {STAGES.map((s, i) => (
            <StageCard key={s.n} s={s} mediaRight={i % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page.tsx** — add `import AutopilotSystem from "./_components/AutopilotSystem";` and place `<AutopilotSystem />` after `<TrustStrip />`.

- [ ] **Step 3: Lint + commit**
```bash
npx eslint "app/(tracerlabs)/agents/_components/AutopilotSystem.tsx" "app/(tracerlabs)/agents/page.tsx"
git add "app/(tracerlabs)/agents"
git commit -m "feat(agents): autopilot system — 14 stages (data-driven cards)"
```

---

## Task 5: `AiWorkforce` grid

**Files:** Create `app/(tracerlabs)/agents/_components/AiWorkforce.tsx`; Modify `page.tsx`

- [ ] **Step 1: Create the component**
```tsx
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
```

- [ ] **Step 2: Wire into page.tsx** — `import AiWorkforce from "./_components/AiWorkforce";` and place `<AiWorkforce />` after `<AutopilotSystem />`.

- [ ] **Step 3: Lint + commit**
```bash
npx eslint "app/(tracerlabs)/agents/_components/AiWorkforce.tsx" "app/(tracerlabs)/agents/page.tsx"
git add "app/(tracerlabs)/agents"
git commit -m "feat(agents): AI workforce grid"
```

---

## Task 6: `WhatThisReplaces`

**Files:** Create `app/(tracerlabs)/agents/_components/WhatThisReplaces.tsx`; Modify `page.tsx`

- [ ] **Step 1: Create the component**
```tsx
const REPLACES = ["10–15 employees", "Manual processes", "Missed follow-ups", "Operational inefficiencies"];

export default function WhatThisReplaces() {
  return (
    <section id="tl-ag-replaces" className="w-full bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-8 sm:px-10">
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink/35">What this replaces</div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {REPLACES.map((r) => (
            <li key={r} className="flex items-center gap-2 text-[0.95rem] text-ink/45">
              <span aria-hidden className="text-brand-red">✕</span>
              <span className="line-through decoration-ink/30">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page.tsx** — `import WhatThisReplaces from "./_components/WhatThisReplaces";` and place `<WhatThisReplaces />` after `<AiWorkforce />`.

- [ ] **Step 3: Lint + commit**
```bash
npx eslint "app/(tracerlabs)/agents/_components/WhatThisReplaces.tsx" "app/(tracerlabs)/agents/page.tsx"
git add "app/(tracerlabs)/agents"
git commit -m "feat(agents): what-this-replaces strip"
```

---

## Task 7: `FinancialImpact` stat cards

**Files:** Create `app/(tracerlabs)/agents/_components/FinancialImpact.tsx`; Modify `page.tsx`

- [ ] **Step 1: Create the component**
```tsx
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const STATS: { label: string; big: string; sub: { k: string; v: string }[] }[] = [
  { label: "Cost Savings", big: "−59%", sub: [{ k: "Labor", v: "−59%" }, { k: "Operations", v: "−57%" }, { k: "Overhead", v: "−55%" }] },
  { label: "Revenue Growth", big: "↑", sub: [{ k: "Quarter over quarter", v: "Q1 → Q4" }] },
  { label: "Efficiency", big: "5×", sub: [{ k: "Response time", v: "5× faster" }, { k: "Task completion", v: "88%" }, { k: "Accuracy", v: "97%" }] },
  { label: "Return on Investment", big: "Mo 3", sub: [{ k: "Breakeven", v: "Month 3" }, { k: "Trajectory", v: "M1 → M10" }] },
];

export default function FinancialImpact() {
  return (
    <section id="tl-ag-impact" className="relative isolate w-full overflow-hidden bg-page">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="max-w-[44rem]">
          <Eyebrow>Financial impact</Eyebrow>
          <h2 className="font-display animate-rise mt-6 text-[clamp(2rem,5vw,3.4rem)] font-normal uppercase leading-[1.0] tracking-tight">What this means for your business</h2>
          <p className="animate-rise mt-5 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink/55">Backed by real-world data from AI and automation adoption.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <Bevel key={s.label} bevel={14} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md">
              <div className="flex h-full flex-col p-6">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink/40">{s.label}</div>
                <div className="font-display mt-3 bg-clip-text text-[2.6rem] leading-none text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>{s.big}</div>
                <ul className="mt-5 flex flex-col gap-2">
                  {s.sub.map((x) => (
                    <li key={x.k} className="flex items-center justify-between text-[0.82rem]">
                      <span className="text-ink/55">{x.k}</span><span className="font-medium text-ink/80">{x.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Bevel>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page.tsx** — `import FinancialImpact from "./_components/FinancialImpact";` and place `<FinancialImpact />` after `<WhatThisReplaces />`.

- [ ] **Step 3: Lint + commit**
```bash
npx eslint "app/(tracerlabs)/agents/_components/FinancialImpact.tsx" "app/(tracerlabs)/agents/page.tsx"
git add "app/(tracerlabs)/agents"
git commit -m "feat(agents): financial impact stat cards"
```

---

## Task 8: `AgentsCta` (live VoiceWidget + Book a Demo)

**Files:** Create `app/(tracerlabs)/agents/_components/AgentsCta.tsx`; Modify `page.tsx`

- [ ] **Step 1: Create the component** (mirrors the home CTA's structure; takes the env-derived props)
```tsx
import VoiceWidget from "../../../components/VoiceWidget";
import Button from "../../../components/Button";
import Eyebrow from "../../../components/Eyebrow";

export default function AgentsCta({ voiceEnabled, calcomUrl }: { voiceEnabled: boolean; calcomUrl: string }) {
  return (
    <section id="tl-ag-cta" className="relative isolate w-full overflow-hidden bg-page" style={{ scrollMarginTop: "5rem" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[52vw] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[150px]"
        style={{ background: "radial-gradient(circle, rgba(231,2,141,0.34) 0%, rgba(5,106,252,0.18) 45%, transparent 72%)" }}
      />
      <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-6 py-24 text-center sm:px-10 sm:py-28">
        <Eyebrow className="mx-auto">Let&apos;s build</Eyebrow>
        <h2 className="font-display animate-rise mt-7 text-[clamp(2.1rem,5.5vw,3.6rem)] font-normal uppercase leading-[1.02] tracking-tight">
          Ready to put your business on{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#e7028d,#056afc)" }}>autopilot?</span>
        </h2>
        <p className="animate-rise mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-ink/55">
          Talk to our AI agent right now, or book a demo to see the full system deployed for your business in days, not months.
        </p>
        <div className="animate-rise mt-12">
          <VoiceWidget voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        </div>
        <div className="animate-rise mt-10">
          <Button href={calcomUrl} variant="secondary" external>Book a Demo</Button>
        </div>
      </div>
    </section>
  );
}
```
> Confirm `Button` accepts an `external` prop (it does — used for new-tab external links). If not present, omit it and add `target="_blank"` via the supported API.

- [ ] **Step 2: Wire into page.tsx (+ add the env reads now)**

In `app/(tracerlabs)/agents/page.tsx`:
(a) add `import AgentsCta from "./_components/AgentsCta";`
(b) at the top of the `AgentsPage()` function body (before `return`), add the server-side env reads (same pattern as `Cta.tsx`):
```tsx
  const voiceEnabled = Boolean(process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID);
  const calcomUrl =
    process.env.NEXT_PUBLIC_CAL_BOOKING_LINK || "https://cal.com/team/tracerlabs/discovery-call";
```
(c) place `<AgentsCta voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />` after `<FinancialImpact />` (last section before `</main>`).

- [ ] **Step 3: Lint + commit**
```bash
npx eslint "app/(tracerlabs)/agents/_components/AgentsCta.tsx" "app/(tracerlabs)/agents/page.tsx"
git add "app/(tracerlabs)/agents"
git commit -m "feat(agents): CTA with live VoiceWidget + Book a Demo"
```

---

## Task 9: Build + full visual QA (both themes)

**Files:** none (verification)

- [ ] **Step 1: Build**

Stop `next dev`. Run: `npm run build`
Expected: `✓ Compiled successfully`; route list includes `○ /agents` and `/agents/opengraph-image`; no type/route errors.

- [ ] **Step 2: Visual QA both themes**

`PORT=3100 npm run dev`, open `http://localhost:3100/agents`, toggle dark↔light, and confirm:
- [ ] Renders `<Nav>` (sticky), all sections in order (hero → trust/TechBar → 14 autopilot stages → workforce grid → what-this-replaces → financial impact → CTA), `<Footer>`.
- [ ] **Fonts:** headings Duborics, body Plus Jakarta everywhere (no serif/Inter leak) in BOTH themes.
- [ ] **Theme:** page bg flips (dark `#000` / light `#eef0f4`); cards become white in light with shadow; embossed stage-number plates STAY dark in both; gradient focal words intact.
- [ ] Hero CTAs scroll (`See How It Works` → autopilot section; `Book a Demo` → CTA section / Cal.com).
- [ ] **VoiceWidget** in the CTA mints a token (or shows the "Book a call" fallback) — same as the home page.
- [ ] TechBar marquee animates; workforce chips + stage cards + stat cards all render; no overflow/broken layout at mobile + desktop widths.
- [ ] No console errors.

- [ ] **Step 3: Verify routing + SEO**

`npm run start` (port 3000 or a free port), then:
```bash
curl -s localhost:<port>/agents | grep -oiE '<title>[^<]*|rel="canonical"[^>]*|og:image[^>]*' | head
curl -s localhost:<port>/sitemap.xml | grep agents
curl -s localhost:<port>/ | grep -o '/agents' | head -1   # Services pillar links to /agents
```
Expected: title "Custom AI Products & Agents | Tracerlabs"; canonical `/agents`; og:image at `tracerlabs.io/agents/opengraph-image…`; sitemap lists `/agents`; the home page's Services pillar links to `/agents`.

- [ ] **Step 4:** Confirm `/agents` is server-rendered — `curl -s localhost:<port>/agents | grep -o "Scale your"` returns the hero copy (content in initial HTML, no JS needed).

---

## Done

Branch `feat/agents-landing-page` → merge to `main` → push (deploys `/agents` live). The Services "Custom AI Products & Agents" pillar now routes there.
