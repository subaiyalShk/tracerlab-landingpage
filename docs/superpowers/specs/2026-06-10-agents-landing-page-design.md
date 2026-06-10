# `/agents` — Custom AI Products & Agents Landing Page — Design

**Date:** 2026-06-10
**Site:** Tracerlabs marketing site (`app/(tracerlabs)/`), Next.js 16, React 19, Tailwind v4 (no preflight), live at www.tracerlabs.io.
**Goal:** A dedicated landing page for the **Custom AI Products & Agents** offering (voice call agents + custom agentic workflows), reached from the Services "Custom AI Products & Agents" pillar.

## Source & approach (decided)

- **Source content:** the replit reference site's **Home / "Autopilot System" page** (`https://tracerlabs-live.replit.app/`). Its full content is captured in §"Content" below.
- **Design fidelity:** **adapt to the current site's design system** — keep the replit page's content/structure/messaging, but render it with the existing `Bevel`/`Button`/`Eyebrow` primitives, `--tl-*` theme tokens (full **light/dark** support), and Duborics/Plus Jakarta fonts. It must feel native to tracerlabs.io, not a replit clone.
- **Autopilot section:** all **14 stages**, each a styled Bevel card with a *clean representative visual* (not pixel-perfect animated replicas of the replit mockups).
- **Voice:** embed the existing live Retell `VoiceWidget` (talk to the agent on-page) + a `Book a Demo` CTA.
- **Route:** `/agents`.

## Architecture

- **Route:** `app/(tracerlabs)/agents/page.tsx` (a new route in the existing route group → inherits the `(tracerlabs)` layout: `next/font`, `--tl-*` tokens, `metadataBase`, globals.css). It's a **Server Component** that composes `<Nav>` + the new sections + `<Footer>` (same shape as the home `page.tsx`).
- **Section components:** co-located under `app/(tracerlabs)/agents/_components/` — `AgentsHero.tsx`, `TrustStrip.tsx`, `AutopilotSystem.tsx`, `AiWorkforce.tsx`, `WhatThisReplaces.tsx`, `FinancialImpact.tsx`, `AgentsCta.tsx`. Each is a Server Component except where it composes a client island.
- **Reuse:** `app/components/` — `Nav`, `Footer`, `Bevel` (+ `GLASS_BG`/`GLASS_BORDER`), `Button`, `Eyebrow`, `VoiceWidget`, `TechBar` (optional, for the trust strip).
- **Data into the voice island:** `page.tsx` reads `process.env.RETELL_API_KEY`/`RETELL_AGENT_ID` and `NEXT_PUBLIC_CAL_BOOKING_LINK` on the server and passes `voiceEnabled: boolean` + `calcomUrl: string` into `<VoiceWidget>` — identical to the existing `Cta.tsx` (secrets never reach the client). The Cal.com "Book a Demo" link uses `NEXT_PUBLIC_CAL_BOOKING_LINK` (default `https://cal.com/team/tracerlabs/discovery-call`).

### Fonts / no-preflight (important)
Tailwind runs with **no preflight**. After the Phase-2 work, the legacy `*{font-family:Inter}` leak is **gone**, so elements with no explicit font-family fall to the UA default (serif). The brand fonts come from `--font-display`/`--font-body`, defined on the `(tracerlabs)` wrapper div. **New sections must carry the font explicitly.** Approach: wrap the page's section stack in a `font-body` container and give every heading the `font-display` utility (the `Eyebrow`/`Button` primitives already set their own fonts). This is **self-contained** — no edit to the globals `#tl-*` font-isolation block is needed (the legacy Inter leak that block defended against no longer exists). Each top-level section still gets a stable `id` (`#tl-ag-hero`, `#tl-ag-system`, `#tl-ag-workforce`, `#tl-ag-impact`, `#tl-ag-cta`) for anchor links + scroll-margin.

### Theme
All sections use the semantic tokens (`bg-page`, `bg-surface`, `text-ink`, `text-ink/NN`, `border-ink/NN`, `Bevel` card vars, brand accents) so the page flips correctly with the existing light/dark toggle. The embossed stage-number plates reuse the CTA step-number recipe (`linear-gradient(145deg,#2b2c33,#16171b)` + emboss shadow + `text-[#e9eaef]`) which **stay dark in both themes** (consistent with the rest of the site's locked dark plates).

### SEO
- `page.tsx` exports `metadata`: `title: "Custom AI Products & Agents"` (inherits the `%s | Tracerlabs` template), a focused description, `alternates: { canonical: "/agents" }`, and `openGraph`/twitter via a new `app/(tracerlabs)/agents/opengraph-image.tsx` (next/og, same recipe as the home/solar OG cards, headline "Custom AI Products & Agents").
- Add `https://tracerlabs.io/agents` to `app/sitemap.ts` (weekly, priority 0.8).
- One `<h1>` (the hero), section `<h2>`s, semantic `<section>`/`<main>`. JSON-LD: optionally add a `Service` entry — deferred (the home page already carries the Organization/Service graph).

### Linking
In `app/components/Services.tsx`, the `CUSTOM` service ("Custom AI Products & Agents") `cta.href` changes from `#projects` to `/agents`. (Optional: add an `/agents` link to the Nav `LINKS` — deferred unless requested.)

## Content (from the replit Autopilot page — to render in the design system)

**Hero:** eyebrow "Custom AI Products & Agents"; headline "Scale your **Intelligence**." (gradient focal word "Intelligence"); subcopy "Tracerlabs builds AI systems that run your business on autopilot — from lead generation to closing deals to managing operations."; CTAs `Book a Demo` (primary → Cal.com) + `See How It Works` (secondary → `#tl-ag-system`).

**Trust strip:** "Powering infrastructure for industry leaders" eyebrow + **reuse the existing `<TechBar>`** marquee (the tech-logo strip is the design-system equivalent of the replit "industry leaders" logo bar — zero new work, stays consistent).

**The Autopilot System** (header "Your business on autopilot." + sub "Fourteen AI-powered stages working 24/7 to generate, convert, and retain customers — without lifting a finger."). The **14 stages** (number · title · description · representative visual):
1. **AI Generates Leads** — captures inbound interest. *Visual:* chat bubbles ("Hi, I'm interested in your AI solutions." → "Thanks for reaching out! What industry are you in?").
2. **AI Responds Instantly** — replies in seconds, any channel.
3. **AI Calls & Books** *(voice agent — flagship)* — outbound AI voice call that qualifies + books. *Visual:* live-call row (caller "Sarah Mitchell · Acme Corp", timer "00:47", HD Voice, transcript snippet, "Thursday 2:00 PM confirmed").
4. **AI Receptionist & Scheduler** — answers + books appointments. *Visual:* incoming request + today's schedule rows + "Confirmation sent + calendar invite created".
5. **AI Qualifies & Books** — lead scoring + auto-booking. *Visual:* lead-score rows (Acme Qualified / TechFlow Reviewing / DataSys Nurture).
6. **AI Follows Up** — multi-touch sequences. *Visual:* sequence checklist (Welcome Day 1, Case study Day 3, Value prop Day 5, Reminder Day 7).
7. **AI Proposal Generator** — instant custom proposals. *Visual:* proposal draft #PR-0847 line items (Chatbot $12k, Voice Agent $8.5k, CRM $6k, Total $26.5k).
8. **AI Closer** — agreements + payment. *Visual:* "Agreement signed/countersigned · $124,000 paid via Stripe".
9. **Operations Run Smoothly** — ops dashboard. *Visual:* stat tiles (Tasks 24/24, SLA 99.9%, Onboarding Active).
10. **AI Project Manager** — tasks, channels, timelines. *Visual:* PM checklist (onboarding call, #acme-redesign Slack, tasks to 4 members).
11. **AI Customer Support** — 24/7 tickets. *Visual:* 98.5% CSAT, <30s reply, live ticket rows.
12. **Generates Referrals** — 3.2× referral multiplier. *Visual:* a single bold "3.2×" stat.
13. **AI Accountant** — monthly P&L. *Visual:* mini P&L (Revenue $284.5k, Net Profit $105.6k).
14. **Gets Reviews** — automated review collection. *Visual:* review cards + "47 reviews this month · 4.9 avg".

**Your AI Workforce** (header "Meet Your AI Team" + sub "A fully automated company working 24/7 to run and grow your business"). Grid grouped by category, each agent a Bevel chip (name · role · STANDBY badge):
- **Front-End:** AI Marketer (Ads & Leads), AI Receptionist (Instant Answers), AI Voice Agent (Calls & Qualifies)
- **Sales:** AI Text Agent (SMS Convos), AI Email Agent (Follow-ups), AI Closer (Closes Deals), AI Proposals (Custom Docs)
- **Operations:** AI Project Manager (Tasks & Timelines), Scheduler (Auto Booking), Ops Dashboard (Real-time View)
- **Support:** AI Support (24/7 Help)
- **Growth:** AI Referrals (Grows Network), AI Reviews (5-Star Ratings)
- **Finance:** AI Accountant (P&L Reports)
- Closing line: "Now you run the business. The business doesn't run you."

**What This Replaces:** compact strike-through row — "10–15 employees", "Manual processes", "Missed follow-ups", "Operational inefficiencies".

**Financial Impact** (header "What This Means For Your Business" + sub "Backed by real-world data from AI and automation adoption") — 4 Bevel stat cards:
- **Cost Savings** — Labor −59%, Operations −57%, Overhead −55%.
- **Revenue Growth** — increases quarter over quarter (Q1→Q4).
- **Efficiency** — 5× faster response; Task Completion 88%; Accuracy 97%.
- **ROI** — average ROI, breakeven ~Month 3.
(Numbers lifted verbatim from the replit page, per user. Rendered as **static** values — count-up animation is deferred polish.)

**Final CTA:** "Ready to put your business on autopilot?" + "See how our AI system can be customized and deployed for your business in days, not months." + the embedded **`VoiceWidget`** (live talk) + `Book a Demo` (Cal.com).

**Footer:** reuse `<Footer>`.

## Out of scope / deferred
- Pixel-perfect animated mockups (chosen "design-system cards" fidelity).
- `/team` and `/partners` replit pages (not requested; this is `/agents` only).
- Count-up animations on the financial stats (optional polish).
- A nav link to `/agents` (reached via the Services pillar for now).

## Verification
- `npm run build` clean; `/agents` prerenders (`○`); `/agents/opengraph-image` generates; `/sitemap.xml` includes `/agents`.
- Browser QA in **both themes**: every section renders with brand fonts (no serif leak), the VoiceWidget mints a token / falls back to Book-a-Demo, the Services pillar links to `/agents`, anchor scroll works, no console errors.
- Confirm the page is server-rendered (RSC) — content present in the initial HTML for crawlers.
