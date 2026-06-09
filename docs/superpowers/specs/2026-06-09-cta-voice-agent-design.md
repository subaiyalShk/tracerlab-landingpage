# CTA Section — Embedded Voice Agent — Design Spec

**Date:** 2026-06-09
**Scope:** Replace the legacy contact section (fake testimonials + "Tracy" stepper + `dealflow` modal) with a new closing CTA section whose centerpiece is an **embedded in-browser voice agent**: the visitor clicks "Talk to our AI," talks live in the page (WebRTC via Retell web SDK), the agent runs a ~2-minute discovery and **books a call via Cal.com** before hanging up. This is both the conversion mechanism and a live demo of Tracerlabs' core product.

## Goal & priority

Serves priority #1 (book qualified calls) directly, and doubles as the most persuasive possible proof for a voice-agent agency — the CTA *is* the product. Replaces the most trust-damaging legacy content (fabricated testimonials).

## Confirmed decisions (with user, 2026-06-09)

- **Embedded in-browser voice widget** (not a phone number, not outbound-call-me).
- **Provision a NEW Retell agent** ("Tracer discovery") via the `retell-ai` tooling.
- **Booking via Cal.com** — a Retell custom function calls our `/api/book`, which books a real slot.
- **Layout: centered close** — orb widget centerpiece, headline above, 3-step below.
- **Graceful degradation** so the section is useful before keys/agent exist.

## Architecture

```
[Cta.tsx section]
   └─ [VoiceWidget.tsx  "use client"]  ── click "Talk to our AI"
          │  POST /api/retell/web-call           (server: RETELL_API_KEY → Retell create-web-call → { access_token })
          │  RetellWebClient.startCall({ accessToken })   ── live WebRTC voice
          ▼
   [Retell agent "Tracer discovery"]
          • discovery: what are you building, timeline, rough budget band, contact email
          • near end → custom function `book_call` → POST /api/book   (server: Cal.com API → create booking)
          • confirms booked time by voice, ends call
```

## Files (this repo)

- `app/components/Cta.tsx` (server) — section UI: eyebrow, headline, subcopy, `<VoiceWidget/>`, 3-step "what happens next", small trust line. Scoped `#tl-cta` with the established `:where()` reset + brand-font isolation (added to globals.css).
- `app/components/VoiceWidget.tsx` (`"use client"`) — the orb + state machine (below). Lazy-imports `retell-client-js-sdk`.
- `app/api/retell/web-call/route.ts` — POST → calls Retell `create-web-call` with `RETELL_AGENT_ID`, returns `{ accessToken }`. Server-only key. Basic abuse guard (per-IP rate limit, short-circuit if env missing → 503 so the widget shows the fallback).
- `app/api/book/route.ts` — POST endpoint the Retell custom function calls: validates payload (shared secret header from the agent function config), books via Cal.com API, returns confirmation text. Server-only key.
- `scripts/provision-retell-agent.mjs` — one-off: reads `RETELL_API_KEY` from env, creates/updates the "Tracer discovery" agent + the `book_call` custom function, prints the `agent_id`. (Alternative: documented manual dashboard config.)
- Dependency: add `retell-client-js-sdk` to `package.json`.

## Legacy removal & wiring

- Re-split `app/_landing/markup.ts`: remove the `<!-- Contact Section -->…</section>` from `MARKUP_BOTTOM` (bottom becomes footer-only) and **drop `MARKUP_MODAL`** (the `dealflow` modal).
- `app/(tracerlabs)/page.tsx`: render `<Cta/>` between `<Projects/>` and the footer markup; remove the `MARKUP_MODAL` injection. Keep `id="contact"` on the CTA section so existing `#contact` anchors (hero CTA, nav "Contact Us") still scroll here.
- **Neutralize legacy modal JS:** `public/legacy/app.js` initializes a modal/iframe against `#contact-modal`/`#iframe-container`, now removed. Guard or no-op that init so it doesn't throw (the elements will be absent). Verify no console error on load.

## Retell agent ("Tracer discovery")

- **Prompt (outline):** warm, concise discovery for a dev-agency lead. Goals in order: (1) greet + set expectation ("couple quick questions, then I'll get you booked"); (2) what are you looking to build / problem; (3) timeline; (4) rough budget band; (5) name + email; (6) call `book_call` with preferred time → confirm the booked slot by voice → thank + end. Keep it ≤ ~2 min. Decline anything off-scope politely.
- **Custom function `book_call`:** params `{ name, email, preferred_time (ISO or natural), timezone }`; URL → `${SITE_URL}/api/book`; auth via a shared-secret header. Returns `{ booked: bool, time, message }` which the agent speaks back.
- Voice/model: a natural voice; low latency. (Exact voice/model chosen during provisioning per `retell-ai` guidance.)

## /api/book (Cal.com)

- Validates shared-secret header (rejects otherwise). Validates/parses `preferred_time` + timezone.
- Cal.com API v2: resolve next suitable slot (or honor requested time if available) for the configured **event-type ID**; create booking with attendee `{ name, email, timeZone }`.
- Returns concise `{ booked, time, message }`. On failure returns a graceful message ("I couldn't lock that exact time — I'll have the team confirm by email") so the agent never dead-ends.

## VoiceWidget states

`idle` → (click) `requesting-mic` → `connecting` → `in-call` (sub-states: `listening` / `agent-speaking`) → `ended` (shows "Booked! / Thanks — check your email" or recap) ; plus `mic-denied`, `error`, `unconfigured`.

- **Visual:** a brand-gradient orb (pink→blue) that pulses on `listening`, ripples on `agent-speaking`; a clear primary button label per state ("Talk to our AI" → "Connecting…" → "End call"). Minimal, no transcript.
- **Reduced-motion:** static orb, no pulse.
- **Accessibility:** button is a real `<button>` with `aria-live` status text; mic-permission rationale shown before/with the prompt.

## Graceful degradation (ship before keys exist)

- `/api/retell/web-call` returns 503 when `RETELL_API_KEY`/`RETELL_AGENT_ID` are unset → widget renders `unconfigured`: primary button becomes **"Book a call →"** linking to the Cal.com scheduling URL (`NEXT_PUBLIC_CALCOM_URL`).
- `mic-denied` / `error` → same "Book a call →" fallback + "or email hello@tracerlabs.io".
- So the section is a working "book a call" CTA on day one; the voice experience lights up once keys + agent are set.

## Environment variables (user provides; never committed)

- `RETELL_API_KEY` (server), `RETELL_AGENT_ID` (server)
- `CALCOM_API_KEY` (server), `CALCOM_EVENT_TYPE_ID`, Cal.com username/timezone
- `RETELL_FUNCTION_SECRET` (shared secret for `/api/book`)
- `NEXT_PUBLIC_CALCOM_URL` (public scheduling link for the fallback)
- `SITE_URL` (for the custom-function callback URL)

## Security

- API keys are server-only (never `NEXT_PUBLIC_`). `/api/book` requires the shared secret. `/api/retell/web-call` rate-limited per IP and only ever returns a short-lived access token (no key). Validate/sanitize all inputs. No secrets entered by the assistant — the user sets env locally and on Vercel.

## Testability

- **By me (no keys):** full UI + all states (force via a debug prop), the `unconfigured`/`mic-denied`/`error` fallbacks, route wiring + 503 behavior, build, responsive, legacy removal, no console errors.
- **Together (needs keys):** live voice call requires `RETELL_API_KEY` + provisioned agent; real Cal.com booking requires `/api/book` to be **publicly reachable** (Retell's servers call it) — so live booking is tested on a Vercel preview deploy (or a tunnel), not bare localhost. Called out so we test that part on a preview URL.

## Out of scope (later)

- Transcript display, call recording/analytics surfacing, multi-language, the nav "Contact Us" opening the widget directly (it scrolls to the section for now), footer rewrite, nav componentization.

## Success criteria

- `npm run build` passes; `/` renders; no console errors from removed legacy modal.
- Section renders + degrades correctly at 360 / 768 / ≥1280 with no keys (shows "Book a call" fallback).
- With keys + agent on a preview deploy: clicking "Talk to our AI" starts a live in-browser voice call, the agent runs discovery and books a Cal.com slot, confirmed by voice.
- No client names; brand-consistent (dark, glass, Duborics/Plus Jakarta, animate-rise); spacing correct via `#tl-cta` `:where()` reset.
