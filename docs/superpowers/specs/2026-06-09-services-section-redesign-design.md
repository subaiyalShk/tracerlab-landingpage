# Services Section Redesign — Design Spec

**Date:** 2026-06-09
**Scope:** First slice of the Tracerlabs main landing page improvement. Componentize and redesign the "Services" section only. Other sections (nav, tech-bar, projects, testimonials, footer) remain legacy for now and are addressed in later slices.

## Goal & priority

The site's north star, in order: (1) book qualified calls, (2) credibility through real shipped work, (3) supporting content. This slice serves all three by replacing the muddled, partly off-target service copy (one card currently targets VC/PE firms) with four clear pillars that mirror the hero's promise and are grounded in real Tracerlabs work, each routing toward proof and conversion.

## Context

- Stack: Next.js 16.2, React 19, Tailwind v4 (no preflight), branch `nextjs-migration`.
- The page is a mid-migration lift-and-shift: `app/components/Hero.tsx` is componentized; the rest lives in `app/_landing/markup.ts` and is injected via `dangerouslySetInnerHTML`, styled by legacy `public/style.css` and driven by `public/legacy/app.js`.
- Tailwind utilities are imported **unlayered** so they win on specificity against the legacy unlayered reset; legacy id/class rules only match legacy elements. New components scope themselves under their own id (e.g. `#tl-hero`) with a small reset block in `globals.css`.

## Migration integration

Split `LANDING_MARKUP` into two exported chunks and render the new component between them so visual order and the sticky nav / legacy JS are preserved:

```
<Hero />
<div dangerouslySetInnerHTML={{ __html: MARKUP_TOP }} />     // nav + tech-bar
<Services />                                                  // new React component
<div dangerouslySetInnerHTML={{ __html: MARKUP_BOTTOM }} />  // projects + testimonials + footer + modal
```

The `<section id="services">` block is removed from the legacy markup string when it is split. New file: `app/components/Services.tsx`.

## Styling

- Scoped under `#tl-services`, dark `bg-black` to flow seamlessly from the hero.
- Glass tiles: `bg-white/[0.03]`, `border-white/12`, rounded; brand pink→blue gradient accents (`--color-brand-pink #e7028d`, `--color-brand-blue #056afc`); subtle aurora glow behind the grid.
- Add a scoped reset in `app/globals.css` mirroring the existing `#tl-hero` block (box-sizing: border-box; zeroed default margins on headings/p/ul; list-style none; anchor text-decoration none).
- Entrance via existing `animate-rise` token. No AOS dependency. Honors the existing `prefers-reduced-motion` rule.

## Layout — mobile-first (bento)

Base styles target mobile; scale up with `sm:` and `lg:`. DOM order stays mobile-logical (featured card first) for accessibility; desktop bento positioning uses CSS grid `grid-template-areas` swapped at `lg`.

- **Mobile (<640px):** single column. Order: header → Voice Agents (featured, taller) → Web & Mobile → Sales & Growth → Custom AI. Full-width tiles, comfortable tap targets, wrapping badges.
- **Tablet (`sm:` 640–1024px):** 2-column grid; featured tile spans both columns at the top.
- **Desktop (`lg:` ≥1024px):** featured Voice Agents tile spans 2 rows in the left column (~1.4fr); Web & Mobile + Sales & Growth stacked on the right; Custom AI as a full-width bar across the bottom.

## Content

**Section header:** eyebrow `What we do` · headline **"Four ways we put AI to work"** (uppercase display, matching hero).

| Card | One-liner | Tech badges | Proof link |
|---|---|---|---|
| **AI Voice Agents** *(featured)* | Voice agents that answer every call, qualify leads, and book appointments — 24/7, in a natural human voice. | Retell · LiveKit · Twilio | `Hear it live →` |
| **Web & Mobile Apps** | Custom web & mobile apps, dashboards, and field-sales tools — shipped fast, built to scale. | Next.js · React Native · Supabase | `See the work →` |
| **Sales & Growth Automation** | Lead funnels, CRM automation, and canvassing systems that turn activity into booked revenue. | n8n · Make · Meta CAPI | `See the work →` |
| **Custom AI Products & Agents** | Bespoke AI agents and internal tools tailored to exactly how your business runs. | OpenAI · Anthropic · Vercel | `See the work →` |

- Each tile has a brand-gradient line icon (phone / device / flow / chip), inline SVG.
- **Proof links:** all point to `#projects` for this slice (no fabricated URLs). They will be repointed to real proof when the Projects section is redesigned in a later slice. The featured `Hear it live →` also points to `#projects` until a real demo URL is provided.
- **Section CTA:** closing line under the grid — *"Not sure what you need? Let's figure it out together →"* linking to `#contact`.

## Out of scope (future slices)

Nav + tech-bar, Projects (real shipped work + repointing proof links), testimonials/process stepper (currently fabricated — flagged for replacement), footer rewrite, theme-toggle handling. Each is its own slice → spec → ship.

## Success criteria

- `npm run build` passes; no regression to hero or legacy sections.
- Section renders correctly at 360px, 768px, and ≥1280px widths.
- Visually continuous with the hero (dark, brand gradients, glass).
- Copy reflects the four real pillars; no generic/VC-PE framing; no fabricated client names or URLs.
