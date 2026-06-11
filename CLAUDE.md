@AGENTS.md

# Tracerlabs landing page

Marketing site for **Tracerlabs** (AI development studio) — live at **www.tracerlabs.io**.
Next.js 16 (App Router, route group `app/(tracerlabs)/`), React 19, Tailwind v4.
Originally a legacy static HTML/CSS/JS site; now **fully migrated to React components**.

## Run / build / ship
- `PORT=3100 npm run dev` — dev server (this project conventionally runs on **3100**).
- `npm run build` — production build. **Never run `next build` while `next dev` is running**
  on this project (they share `.next/` → "Cannot find module './XXX.js'"). Stop dev first.
- **Deploy:** push to `main` → Vercel auto-deploys to production (www.tracerlabs.io).
  Branch `v2` = the old static site, kept as a rollback. Prod env vars live in Vercel’s
  Production scope and bind at **build time** (a new push is needed after changing them).

## Page structure
`app/(tracerlabs)/page.tsx` composes the page entirely from React:
`<Nav> <Hero> <main id="content">{ <TechBar> <Services> <Projects> <Cta> <Footer> }</main>`.
There is **no more injected legacy markup** — `app/_landing/markup.ts` (MARKUP_TOP/BOTTOM) is
retired/unused.

Components (`app/components/`):
- **Nav** — sticky bar that *rests at the bottom of the first screen* then sticks to the top on
  scroll (it’s placed AFTER `<Hero>`, and the hero is `min-h-[calc(100vh-5rem)]` where 5rem =
  the nav height; pure CSS `position: sticky; top: 0`). Logo image + neutral links + small `<Button>`.
- **Hero** — keeps `<canvas id="screen-canvas">`, animated by the legacy `ScreenAnimation`.
- **TechBar** — monochrome tech-logo marquee (`.animate-marquee`).
- **Services** (4-tile bento), **Projects** (5 feature rows: portrait 9:16 reels + full-width
  glass copy cards), **Cta** (embedded Retell voice agent that books via Cal.com), **Footer**.
- Shared: **Button** (angular red CTA, `variant` + `size`), **Bevel** (chamfered bordered panel;
  exports `GLASS_BORDER`/`GLASS_BG` dark-frosted tokens), **Eyebrow** (section eyebrow).

## Design system — "sharp technical dark"
- **Geometry:** chamfered corners everywhere via `clip-path` — `.bv-6`/`.bv-9` utilities (globals)
  for chips/pills, `<Bevel>` for bordered panels. No rounded UI (the logo image is exempt — it’s
  brand identity).
- **Color:** near-black + a white-opacity scale; the pink→blue gradient is reserved for focal
  accents (one headline word, etc.); brand-red `#e21949` for CTAs; ambient glows are dimmed. The
  CTA mic orb is red metallic; icon tiles + step numbers are embossed dark-metal plates.
- **Type:** Duborics (`font-display`) for headings/buttons/labels; Plus Jakarta (`font-body`) for body.

## ⚠️ Tailwind v4 — NO preflight (read before adding anything)
`app/globals.css` imports Tailwind’s theme + utilities **unlayered** and **omits preflight**
(preflight would clobber the legacy `public/style.css`, incl. its `* { margin:0 }`). Consequences:
- A base `a { color: inherit; text-decoration: none }` reset lives in globals — without it,
  links get the browser-default underline + blue. Use the `underline` utility if you ever want one.
- **Fonts (updated by the perf work):** the legacy `* { font-family: 'Inter' }` leak is **gone** —
  `public/style.css` was slimmed to just the universal box reset. Brand fonts now come from
  `next/font` on the `(tracerlabs)` wrapper (`--font-display`/`--font-body`). A new top-level
  section just needs to **inherit `font-body`** (place it under a `font-body` container — the home
  page sections and `app/(tracerlabs)/agents/<main className="font-body">` do this) and put
  `font-display` on its headings. The old `#tl-*` font-isolation block in globals still exists but
  is now vestigial — **new sections no longer need a `#tl-*` id** to get the right font.

## Legacy JS
`public/legacy/app.js` (`DevForgeSite`) is stripped to **only** initialize `ScreenAnimation`
(the hero canvas, which self-manages resize). AOS, JS smooth-scroll, the nav sticky-toggle,
reveal effects, and the removed stepper/testimonials/modal/iframe are **not** initialized — those
scroll handlers were snapping programmatic scroll + breaking anchor-link nav, and AOS mutated
`<body>` (hydration mismatch). Smooth anchor scrolling is now CSS (`html { scroll-behavior: smooth }`),
with `scroll-margin-top` on the sections so the sticky nav doesn’t cover them.

## Voice agent (CTA)
`/api/retell/web-call` mints a short-lived Retell token; `VoiceWidget` runs the in-browser call;
the agent books via `/api/book` (Cal.com; shared secret in `?s=`). Vercel **Production** env:
`RETELL_API_KEY`, `RETELL_AGENT_ID`, `RETELL_FUNCTION_SECRET`, `CAL_API_KEY`, `CAL_EVENT_TYPE_SLUG`,
`CAL_TEAM_SLUG`, `NEXT_PUBLIC_CAL_BOOKING_LINK`. `scripts/repoint-book-call.mjs` re-points the
agent’s `book_call` URL after a domain change (updates the existing LLM, no new agent).
