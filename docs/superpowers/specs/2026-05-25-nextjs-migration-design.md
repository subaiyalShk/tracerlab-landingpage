# Tracerlabs landing page → Next.js (lift-and-shift)

**Date:** 2026-05-25
**Status:** Approved
**Branch:** `nextjs-migration`

## Goal

Move the existing static Tracerlabs landing page (`index.html` + `style.css` + `light-mode.css` + `assets/` + `fonts/`) onto Next.js (App Router, TypeScript, Tailwind installed) with **zero visual change**. This is the foundation for adding more landing pages later — but that is explicitly a future step, not part of this ship.

## Non-goals (this ship)

- Componentizing the page into React components.
- Rewriting the ~777 lines of inline JS as React hooks.
- Styling anything with Tailwind (installed but unused on this page for now).
- Multi-page routing for future landing pages.
- `next/image` optimization of assets.

## Existing page — what it does

- Hero with a `<canvas id="screen-canvas">` animation.
- Sticky `#main-nav` with a dark/light theme toggle implemented by swapping the `<link id="theme-stylesheet">` href between `style.css` (dark) and `light-mode.css` (light).
- Services grid, projects, contact section, footer.
- Contact modal (`#contact-modal`) whose JS injects an iframe to `https://dealflow.tracerlabs.io/lead-intake`, plus a multi-step "stepper".
- Scroll-reveal animations via AOS (CDN).
- Hotjar/Contentsquare analytics snippet (hjid 5253738).
- Fonts: local Duborics (`@font-face`, `./fonts/...` relative to CSS) + Plus Jakarta Sans via Google Fonts `@import`. Testimonial avatars are remote Unsplash URLs.

## Architecture

1. **Scaffold** `create-next-app` (App Router, TypeScript, Tailwind, ESLint) into a temp directory, then merge generated files into this repo so `.git` is preserved.
2. **Static assets → `public/`:** move `assets/`, `fonts/`, `style.css`, `light-mode.css` into `public/`. Path-relative references resolve unchanged:
   - `style.css` `url('./fonts/...')` → `/fonts/...`
   - markup `/assets/...` → `/assets/...`
3. **`app/layout.tsx`** (server): renders `<html>`/`<body>`; SEO/OG/Twitter meta via Next `Metadata`; loads AOS + the legacy JS via `next/script` `beforeInteractive`; analytics (Hotjar) via `afterInteractive`.
   - **Stylesheets are injected by a `beforeInteractive` inline `css-bootstrap` script**, NOT rendered by React. React 19's `precedence`-managed stylesheets refuse to release the old sheet when the legacy theme toggle mutates `#theme-stylesheet`'s `href`, leaving both themes stacked. A plain `<link>` injected into `<head>` swaps cleanly. Running before first paint also avoids FOUC and ensures the hero canvas has real layout to size against. Initial theme is read from `localStorage`.
4. **`app/page.tsx`** (server): injects the original `<body>` inner markup as raw HTML (the markup is bundled as a string in `app/_landing/markup.ts`, escaped via `JSON.stringify` — avoids runtime `fs`), wrapped in a `display: contents` div.
5. **`public/legacy/app.js`** — the two original inline scripts concatenated verbatim, with one shim: an `onDomReady()` helper runs the init immediately when the DOM is already parsed, because Next's script loader executes `beforeInteractive` scripts after `DOMContentLoaded` has already fired (so the original `DOMContentLoaded` listeners would never run).

### Why inject raw HTML rather than hand-convert to JSX

The markup is our own trusted static content (no user input, so no injection surface). Injecting it raw guarantees pixel-identical output and lets the existing vanilla JS — which queries elements by `id`/`class` after mount — keep working untouched. Smallest, lowest-risk ship. Componentizing later replaces this markup section by section.

## Verification

`npm run dev`, then confirm against the current `index.html`:
- Hero canvas animates.
- Theme toggle swaps light/dark stylesheet.
- Scroll reveals fire (AOS).
- Contact modal opens the dealflow iframe.
- Local font (Duborics) and all `/assets` images load.
- No console errors from the ported JS.
