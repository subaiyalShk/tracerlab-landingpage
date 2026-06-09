# Projects Section Redesign — Design Spec

**Date:** 2026-06-09
**Scope:** Third slice of the Tracerlabs main landing page. Replace the legacy `<section id="projects">` (generic stock-photo projects, fabricated framing) with a React component featuring real, anonymized shipped work in an alternating feature-row layout with lazy video/image media. Other legacy sections (contact/testimonials, footer) remain for later slices.

## Goal & priority

Serves the site's #2 priority — credibility through real shipped work — and feeds #1 (book calls) via per-project links to live pages or `#contact`. Replaces the most credibility-damaging legacy content (Unsplash stock photos, vague enterprise copy) with five concrete, proven projects.

## Decisions locked (with user, 2026-06-09)

- **Feature 5 projects:** Southern Energy (solar voice + funnel), Offset/Door-Hopper (field sales), Harbs Farm (meat-processing platform + voice), Beast Mode (AI fitness), AI Video Ads (Apache/Gridline/Habibi's).
- **Anonymize clients** — no client names; use descriptive labels.
- **Hybrid media** — video where we have it (lazy, in-view autoplay, muted, poster); screenshot/mockup otherwise.
- **Layout:** alternating feature rows (media ⇄ copy), strongest first.
- **Links:** to a live page where brand-safe (`/solar`, `doorhopper.tracerlabs.io`, `beastmode.tracerlabs.io`); to `#contact` otherwise (Harbs Farm, AI Video).

## Architecture & integration

New section rendered between `<Services/>` and the legacy contact/footer:

```
<Hero/>
<main id="content">
  {MARKUP_TOP}        // nav + tech-bar
  <Services/>
  <Projects/>         // NEW
  {MARKUP_BOTTOM}     // contact + footer (projects removed)
</main>
{MARKUP_MODAL}
```

- **Re-split `app/_landing/markup.ts`:** remove the `<!-- Projects Section --> <section id="projects">…</section>` block from `MARKUP_BOTTOM`; bottom becomes contact + footer only. (Programmatic split as before, to avoid escaping errors.)
- **`app/components/ProjectVideo.tsx`** (`"use client"`): reusable lazy video — `muted loop playsInline preload="none"`, poster image, IntersectionObserver plays when ≥some threshold in view and pauses when out (mirrors `app/solar/components/ProblemVideo.tsx`). Honors `prefers-reduced-motion` (no autoplay; shows poster). Props: `src`, `poster`, `className`/aspect.
- **`app/components/Projects.tsx`** (server component): the 5-project data array + alternating-row rendering; `<ProjectVideo>` for video projects, `<img loading="lazy">` for image projects.
- **`app/globals.css`:** extend the existing `:where()` reset group and the brand-font isolation rules to include `#tl-projects` (so spacing/fonts are correct — same fix already applied to hero/services).

## Styling

Scoped under `#tl-projects`, dark `bg-black`, glass surfaces, pink→blue brand accents, `font-display` (Duborics) titles + `font-body` (Plus Jakarta) copy, `animate-rise` entrance. Section header: eyebrow `Recent work` · headline **"Work we've shipped"**. Each media frame `16:10`, rounded, bordered, with the brand glow treatment. Rows stack to single-column on mobile (media above copy), alternate L/R from `lg`.

## Per-project content (anonymized)

Metric chips below are **from internal records / testimonials and MUST be verified by the user before publish** — see "Metrics to confirm".

1. **AI sales engine** — *"A Texas solar company"* — "An AI sales engine that books solar consults on autopilot." Blurb: speed-to-lead funnel + AI voice agent calls every inbound lead in minutes, qualifies, books the consult, runs many agents in parallel. Chips: `$38 / qualified lead` · `calls in minutes` · `9 concurrent agents`. Tech: Next.js · Retell · Twilio · GoHighLevel. Media: 🎥 `/solar/problem.mp4` (poster `/solar/problem-poster.png`). Link: **See the live funnel →** `/solar`.

2. **Field-sales command center** — *"An enterprise field-sales team"* — "A field-sales command center that tripled rep efficiency." Blurb: door-to-door teams get real-time GPS routing, property insights, territory optimization, automated SMS. Chips: `3× rep efficiency` · `GPS + territory opt` · `SMS automation`. Tech: React Native · Capacitor · Google Maps · Twilio · Supabase. Media: 🖼 `/assets/project1.png`. Link: **See it live →** `https://doorhopper.tracerlabs.io/`.

3. **Meat-processing ops platform** — *"A USDA-certified halal farm"* — "An ops platform that runs a meat-processing facility end-to-end." Blurb: farmer booking wizard, staff kanban processing board, dynamic per-animal pricing, Square payments, inbound AI receptionist that looks up orders. Chips: `Booking → cut sheet → payment` · `AI receptionist` · `kanban ops board`. Tech: Next.js · Supabase · Square · Retell. Media: 🖼 captured screenshot → `/assets/project-harbsfarm.png`. Link: **Build one for your business →** `#contact`.

4. **AI fitness coach** — *"Our product"* — "An AI coach that builds martial-arts training + meal plans." Blurb: cross-platform app where an AI 'sensei' generates personalized workouts, nutrition, and grocery lists. Chips: `Personalized AI coach` · `iOS · Android · Web` · `auto meal plans`. Tech: Flutter · React · Gemini · Supabase. Media: 🖼 `/assets/project2.png`. Link: **See it live →** `https://beastmode.tracerlabs.io/`.

5. **AI-generated video ads** — *"For DTC & local brands"* — "Cinematic video ads, generated with AI." Blurb: script, generate, and render scroll-stopping video ads with a Remotion + fal.ai pipeline — full campaigns in days. Chips: `Remotion + fal.ai` · `campaigns in days` · `10+ reels shipped`. Tech: Remotion · fal.ai · Next.js. Media: 🎥 compressed reel → `/assets/reel-aivideo.mp4` (poster `/assets/reel-aivideo-poster.jpg`). Link: **Get a reel for your brand →** `#contact`.

## Media handling & performance

- Videos: `preload="none"`, poster frames, in-view-only autoplay via IntersectionObserver, muted + `playsInline`. Only 2 videos on the page; both lazy.
- **AI reel prep:** compress one existing render (e.g. a Gridline/Apache scene from `tracerlabs/.../public/...`) with `ffmpeg` to ~2–4 MB, 720p, ~8–12s loop, no audio; extract a poster JPG. Save into `public/assets/`.
- **Harbs Farm screenshot:** capture `harbsfarm.com` (clean, current) via browser tooling; save to `public/assets/project-harbsfarm.png`. If capture isn't clean, fall back to a styled media card (no screenshot).
- Images: `loading="lazy"`, `16:10` framing.

## Metrics to confirm (before publish)

- Southern Energy: `$38 / qualified lead`, `9 concurrent agents`, "calls in minutes" (smart wait timer 2–10 min). OK to show anonymized?
- Offset/Door-Hopper: `3× rep efficiency` (from client testimonial). OK to claim?
- If any metric isn't publishable, I'll swap for a capability phrase (no numbers).

## Out of scope (future slices)

Contact/testimonials section (still fabricated — flagged for replacement), footer rewrite, nav componentization, adding "AI Video" as a 5th Services pillar, rendering bespoke product-demo videos for the apps.

## Success criteria

- `npm run build` passes; no regression to hero, services, or remaining legacy sections.
- Renders correctly at 360px, 768px, ≥1280px; rows alternate from `lg`.
- Visually continuous with hero/Services (dark, brand, glass); spacing correct (`:where()` reset + font isolation applied to `#tl-projects`).
- No client names; metrics either confirmed or replaced with capability phrasing.
- Videos lazy + in-view-only; no layout shift (posters reserve space).
