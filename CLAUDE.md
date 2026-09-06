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
`<Nav> <Hero> <main id="content">{ <TechBar> <Services> <Projects> <Team> <Cta> <StickyCtaBar> <Footer> }</main>`.
There is **no more injected legacy markup** — `app/_landing/markup.ts` (MARKUP_TOP/BOTTOM) is
retired/unused.

Components (`app/components/`):
- **Hero** — copy-only, centered: typewriter headline (`TypedHeadline` — rAF *time-based*, never
  `setInterval`, which Chrome throttles in background tabs; transparent full-text ghost prevents
  layout shift and keeps SEO text) over the grid-floor scene with `.nt-pulse` signal streaks
  (offsets = multiples of the 46px grid column) + breathing horizon. **Retired-but-kept side
  visuals:** `TelemetryPanel` (stat dashboard), `MachinePanel` (animated pipeline) — on disk,
  unmounted; restoring either is a two-line change in Hero.
- **TechBar** — monochrome tech-logo marquee. Swappable with **ProofWall** (outcome-figures
  strip, on disk unmounted) for the under-hero slot; user chose the marquee (2026-09-05).
- **Services** (4-stage bento; per-card `Figures` = attributed outcome numbers),
  **Projects** (2 spotlight case studies w/ flush full-height media + product bento + portfolio
  strip), **Team** (co-founder cards; portrait crops aligned via per-member
  `imgTransform`/`imgOrigin` — Subaiyal's photo has zero headroom above the face),
  **Cta** (embedded Retell voice agent that books via Cal.com), **StickyCtaBar** (slides in
  after hero, hides near CTA).
- Shared: **Button** (angular red CTA, `variant` + `size`), **Bevel** (chamfered bordered panel;
  exports `GLASS_BORDER`/`GLASS_BG` dark-frosted tokens), **Eyebrow** (section eyebrow),
  **Card** (THE site card — bevel + glass + hover glow).

## Copy rules (user-set, 2026-09-05)
- **Never state exact client counts** — vague plurals only ("solar companies", "our solar
  portfolio"). Clients stay anonymized except Harbs Farm (already public on its case study).
- **Every published number must be defensible**: lead counts/CPL trace to the clients' Meta ad
  accounts (via the meta-ads-official MCP; count only campaigns we ran — Solrite's account has
  ~$21k of pre-engagement history), consults/bookings to production systems.
- CTA framing = **discovery call** (understand the business, uncover bottlenecks) — not
  "build your AI"; keep "machine" to the hero headline + one Services mention.

## ⚠️ Performance rules (hard-won 2026-09-06 — scroll-jank hunt)
The page died by a thousand compositing cuts. Do not reintroduce these:
- **No CSS `filter`/`backdrop-filter` at scale.** Light mode once ran `drop-shadow` filters
  on every Bevel (the light-only scroll lag) and the marquee filtered 18 logos individually.
  Card shadows = `box-shadow` on the UNCLIPPED `.nt-cardframe` (a box-shadow on the Bevel
  itself gets clipped by the chamfer; the soft blur hides the corner mismatch). If a moving
  row needs a filter, put ONE on the container. Page-wide budget: a handful of small,
  non-animated filtered elements (marquee row, grayscale portraits) — audit with
  `[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).filter!=='none')`.
- **No giant blurred layers.** Ambient glows are plain `radial-gradient(circle closest-side …)`
  divs — the old `blur(120–140px)` filters were redundant and expensive. Same for the horizon.
- **Animate transform/opacity only.** The grid floor scrolls via a `::before` translateY,
  never `background-position` (per-frame repaint).
- **Sticky/fixed elements keep blur ≤ `md`** (nav) / `sm` (CTA bar) — a fixed backdrop-blur
  re-blurs everything under it every scrolled frame.
- **`content-visibility:auto`** on the 4 below-fold sections, masked by `.cv-fade` (a
  TRANSFORM-ONLY slide-up — an opacity keyframe can strand sections invisible when
  animations don't run, e.g. throttled tabs).
- **No session-replay scripts** (Hotjar/Contentsquare removed — they hook every scroll and
  were the dominant jank after the rendering fixes). Re-add only as a deliberate decision.
- TypedHeadline renders the FULL headline visible in server HTML (LCP); the ghost goes
  transparent only after the first typed character. Don't "simplify" that away.

## Design system — "sharp technical dark"
- **Geometry:** chamfered corners everywhere via `clip-path` — `.bv-6`/`.bv-9` utilities (globals)
  for chips/pills, `<Bevel>` for bordered panels. No rounded UI (the logo image is exempt — it’s
  brand identity).
- **Color:** near-black + a white-opacity scale; the pink→blue gradient is reserved for focal
  accents (one headline word, etc.); brand-red `#e21949` for CTAs; ambient glows are dimmed. The
  CTA mic orb is red metallic; icons are plain ink line SVGs (stroke=currentColor — the old
  embossed metal plates are gone); section accent blue `#056AFC`, pink `#e7028d` used sparingly.
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

**Notification pipeline (2026-09-05, audited end-to-end):** the agent's `webhook_url` points at
`/api/retell/webhook?s=…` (same secret). On `call_analyzed` it SMSes both founders
(`NOTIFY_SMS_NUMBERS`, from toll-free `TWILIO_FROM_NUMBER` +18665760554) complete call details +
recording link, and emails the full transcript via Resend (`NOTIFY_EMAILS`, from jarvis@).
Extra prod env: `TWILIO_ACCOUNT_SID/AUTH_TOKEN/FROM_NUMBER`, `NOTIFY_SMS_NUMBERS`,
`NOTIFY_EMAILS`, `RESEND_API_KEY`. Ghost calls (<5s / no transcript) are filtered.
- Retell config lives **out of band** (API-applied, not in repo): post-call analysis fields
  (`caller_name/caller_email/project/timeline/budget/booked_call`) + prompt that collects
  name/email right after the first question. LLM id `llm_b906ca424f062a1dcec7f4e59cc3`.
- Audit/debug pattern: `node --env-file=.env.local -e '…retell-sdk…'` — note `call.list()`
  returns `{items, pagination_key, has_more}`, NOT an array.
- Booking was proven live: POST prod `/api/book?s=…` with `{args:{name,email,preferred_time,timezone}}`
  books a real Cal.com slot (cancel via `POST /v2/bookings/{uid}/cancel`). Cal `/slots` uses
  api-version 2024-09-04 but `/bookings` uses 2024-08-13.
