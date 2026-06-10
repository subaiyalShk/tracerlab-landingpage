# SEO + Performance Optimization — Design

**Date:** 2026-06-10
**Site:** Tracerlabs marketing site, LIVE at **www.tracerlabs.io** (push to `main` → Vercel prod deploy). Next.js 16.2.6 (App Router, Turbopack), React 19.2, Tailwind v4 (imported **unlayered, no preflight**).
**Goal:** **SEO is the #1 priority**, plus fast loads / strong Core Web Vitals — **without breaking any JS or interactivity.**

Grounded in a 12-agent audit + research workflow (8 codebase dimensions + Core Web Vitals + 3 Next.js-16 best-practice topics). Findings live in the session; this spec is the decisions.

---

## 0. The reframe (critical)

The user asked to "convert all pages to server-side." **The site is already 100% server-rendered:** every route (`/`, `/solar`) is React Server Components, **statically prerendered (`○`)** at build time — zero dynamic APIs, no `force-dynamic`. The only client code is **5 minimal, correctly-placed leaf islands** (`ThemeToggle`, `VoiceWidget`, `ProjectVideo`, `ProblemVideo`, `QualForm`), with secrets kept server-side. So "convert to SSR" is a **no-op**, and forcing it (e.g. wrapping VoiceWidget in `dynamic({ssr:false})`) would *remove* useful prerendered HTML — a regression. **The real levers are: (a) SEO surface, (b) shrink the render-blocking critical path, (c) defer/gate client JS** — all without touching island behavior.

## 1. Approved decisions

| Decision | Choice |
|---|---|
| Hero canvas (`ScreenAnimation`) | **Defer + gate** — keep the code, move off `beforeInteractive`, slim dead code, add IntersectionObserver pause + `prefers-reduced-motion`. |
| Legacy `style.css` (46KB, ~64% dead) | **Slim in place** — keep the file + its pre-paint injection (the canvas measures layout before paint), strip dead rules + the Google-Fonts `@import` + `body{transition}` + eot/ttf. |
| Shipping | **Phased, safest-first** — 3 phases, each its own branch → merge → deploy → verify before the next. |
| Out of scope | PPR/`cacheComponents` (high risk — could desync theme bootstrap / self-measuring canvas; marginal benefit), video re-encoding (separate effort), React Compiler (measure-first). |

## 2. Success criteria (Core Web Vitals — these ARE a Google ranking signal)

| Metric | Now (est.) | Target |
|---|---|---|
| LCP | ~2.8s (borderline/poor) | < 2.0s (good) |
| CLS | ~0.12 (fair) | < 0.08 |
| INP | ~200–300ms (fair) | < 150ms |
| Lighthouse (mobile) | ~71–85 | ~90+ |

Drivers: the render-blocking chain in `<head>` — css-bootstrap injects AOS CSS (cdnjs, no preconnect) + `/style.css` (46KB, contains a Google-Fonts `@import` with no preconnect) before paint; AOS JS + legacy `app.js` load `beforeInteractive`; fonts swap (CLS); the hero canvas runs a constant 60fps rAF with no off-screen pause (INP/battery).

## 3. Non-negotiable guardrails (do NOT change these while optimizing)

- The inline `css-bootstrap` script stays `beforeInteractive` and keeps setting `data-theme` on `<html>` before first paint (FOUC/FOWT prevention) and keeps its `/solar` early-return path-gate.
- Keep `suppressHydrationWarning` on `<html>`/`<body>`/`<canvas>` and `ThemeToggle`'s `theme===null`-until-mount pattern.
- `<canvas id="screen-canvas">` stays **server-rendered** in `Hero.tsx` with its id intact — only its JS execution is deferred.
- `VoiceWidget` keeps its `await import('retell-client-js-sdk')` lazy load and its server-passed `voiceEnabled`/`calcomUrl` props (secrets never cross to client). Do **not** wrap it in `dynamic({ssr:false})`.
- Tailwind stays unlayered/no-preflight; any new top-level section must register its `#tl-*` id in the globals font-isolation block.
- Per project convention: never `next build` while `next dev` is running (shared `.next/`).

---

## Phase 1 — SEO + dead-weight removal (zero interactivity risk)

*Pure additive metadata + unused-code deletion. No fonts/images/canvas/client code touched. Ships the biggest SEO surface and removes the AOS render-blocker (~0.4–0.6s LCP).*

### 1.1 `app/robots.ts` (new)
```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://tracerlabs.io/sitemap.xml",
    host: "https://tracerlabs.io",
  };
}
```

### 1.2 `app/sitemap.ts` (new)
```ts
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tracerlabs.io",       changeFrequency: "weekly",  priority: 1 },
    { url: "https://tracerlabs.io/solar", changeFrequency: "monthly", priority: 0.8 },
  ];
}
```
> `lastModified` is intentionally omitted (scripts can't call `new Date()` deterministically; a static sitemap without it is valid and avoids churn). Implementer may add a fixed build date if desired.

### 1.3 `app/components/JsonLd.tsx` (new) — rendered once in `(tracerlabs)/page.tsx`
A `@graph` of `ProfessionalService` (Organization subtype) + `WebSite` + `Service`, injected as a native `<script type="application/ld+json">` with XSS-safe escaping (`.replace(/</g, "\\u003c")`). Use real values (logo `/assets/logo-dark.png`, contact `jarvis@tracerlabs.io`, LinkedIn `sameAs`). **Omit `SearchAction`** (no on-site search). Place on the home page only.

### 1.4 Metadata fixes — `app/(tracerlabs)/layout.tsx`
- **Fix the live OG bug:** `openGraph.images` + `twitter.images` `https://tracerlabs.ai/assets/Tracer.png` → relative `/assets/Tracer.png` (resolves via the already-set `metadataBase: https://tracerlabs.io`). *Every shared link's preview image is broken today.*
- Add `title: { default: "Tracerlabs | AI Development Agency", template: "%s | Tracerlabs" }`, `alternates: { canonical: "/" }`, `openGraph.siteName: "Tracerlabs"`, `locale: "en_US"`, image `width/height/alt`.

### 1.5 `app/solar/layout.tsx`
- Add `alternates: { canonical: "/solar" }`, `openGraph.siteName`, and a Twitter card (copy main site's). OG image handled by 1.6.

### 1.6 Dynamic OG cards (new) — `app/(tracerlabs)/opengraph-image.tsx` + `app/solar/opengraph-image.tsx`
`next/og` `ImageResponse`, 1200×630, brand-dark, Duborics loaded via `readFile(join(process.cwd(),"public/fonts/DuboricsRegular.ttf"))`. Constraints: flexbox only (no grid), `export const size/alt/contentType`. The file convention auto-emits all `og:image:*`/`twitter:image` tags and overrides the manual `images` array. *(If `next/og` proves fiddly, fallback = a hand-made static 1200×630 PNG replacing the square 1080² `Tracer.png`.)*

### 1.7 `viewport` export
Add to root `app/layout.tsx` (so all routes inherit): `export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark light" }`. Replaces the deprecated `metadata.themeColor`. Also hoist `metadataBase: new URL("https://tracerlabs.io")` into the root `metadata` for future routes.

### 1.8 Remove AOS — `app/layout.tsx`
- Delete `css('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css')` from the css-bootstrap inline script.
- Delete the `<Script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js" strategy="beforeInteractive" />`.
- Also delete the AOS JS `<Script src=".../aos.js" ...>` loaded after children if present.
- ~41KB (26KB CSS + 14.7KB JS), render-blocking, **completely unused** (zero `data-aos`, never `.init()`-ed). Zero risk.

### 1.9 `next.config.ts` — image + compression config (enables Phase 2)
```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
export default nextConfig;
```
> Note Next 16 image defaults: `qualities` now `[75]`, `minimumCacheTTL` 4h, and **local `src` with a query string requires `images.localPatterns`** — none of our local assets use query strings, so no `localPatterns` needed, but verify in Phase 2.

**Phase 1 verification:** `npm run build` clean; `/robots.txt`, `/sitemap.xml`, `/opengraph-image` resolve; OG image URL is now `tracerlabs.io`; JSON-LD validates (Rich Results Test); AOS gone from `<head>`/network; **site looks and behaves identically** (no visual/JS change). Merge → deploy → spot-check prod, then Phase 2.

---

## Phase 2 — Fonts + CSS slim + images (low risk; display-only; full visual QA both themes)

### 2.1 Fonts → `next/font` (the biggest LCP/CLS lever)
- `app/(tracerlabs)/layout.tsx`: `Plus_Jakarta_Sans({ subsets:["latin"], weight:["400","500","600","700"], variable:"--font-body", display:"swap" })` and `localFont({ src:[{path:"../../public/fonts/DuboricsRegular.woff2", weight:"400"}], variable:"--font-display", display:"swap" })`. Apply both `.variable` classes to the route-group wrapper.
- The existing `--font-display`/`--font-body` consumers in `globals.css` (`@theme` tokens + the `#tl-*` font-isolation block) pick up the injected vars with no change.
- **Removes the render-blocking Google `@import`** — self-hosted, preloaded, metric-matched fallback (kills headline CLS). One fewer origin connection.

### 2.2 Slim `style.css` in place
Keep the file + its `beforeInteractive` injection (the canvas reads its rendered layout before paint). Delete:
- the Google-Fonts `@import` (now in next/font),
- the Duborics `@font-face` CSS block entirely (next/font owns Duborics now). **Keep `DuboricsRegular.woff2` AND `DuboricsRegular.ttf` on disk** — woff2 for next/font/local, **.ttf for the `next/og` OG image** (satori can't read woff2). Only `.eot` is safe to delete from disk,
- the `body { transition: background-color/color 0.5s }` (theme-flip glitch + computed-style read interference),
- the ~30KB of dead rules targeting removed static markup (`.service-card`, `#main-nav`, `.hero`, `.modal`, `.stepper`, `.testimonial`, `.theme-toggle`, `.tech-scroll`, legacy `:root` vars, etc.).
- **Keep:** the `*{margin/padding/box-sizing}` reset, `*{font-family}` base (still needed by the no-preflight setup — but it can now reference the brand body font), `body` base bg, `.bv-6`/`.bv-9` clip utilities (used by `Bevel`/chips), and anything the React components still match. 46KB → ~6KB.
> The light/dark heading-isolation + page-bg rules already live in `globals.css` and are unaffected.

### 2.3 Images → `next/image`
- **Nav logos** (`Nav.tsx`): both `<img data-logo>` → `<Image data-logo>` with explicit `width/height`, preserving the CSS theme-swap (`globals.css` `[data-logo]` rules) and the `h-[150px] translate-y-3` crop classes. Add `priority` only if it's the confirmed LCP (it's the sticky-nav fallback LCP).
- **TechBar logos** (`TechBar.tsx`): the 9 `<img>` → `<Image>` sized to render (~32px) — fixes the 215KB CrewAI / 111KB Ethereum / 29KB Gemini offenders. Keep `loading="lazy"`; verify the CSS marquee (`clip-path`/`overflow-hidden`) still animates.
- **Projects images** (`Projects.tsx`): `project2.png` etc. → `<Image>`.
- **Hero avatars** (`Hero.tsx`): remote Unsplash `background-image` on `<span>` → `<Image>` (or `<img>`) — also makes them crawlable; preserve the `-10px` overlap + ring. `remotePatterns` for Unsplash added in Phase 1.
- AVIF/WebP + reserved dimensions (CLS) + responsive srcset. ~200KB+ savings. **Do NOT** migrate the `<video>` posters or the CSS gradient/GRAIN layers.

**Phase 2 verification:** `npm run build` clean; browser QA **both themes** — fonts render in Duborics/Plus Jakarta (no Inter leak, no FOUT), no CLS on load, logos/tech-logos/avatars render and the theme logo-swap + marquee still work; Network shows no Google-Fonts request and images served as AVIF/WebP. Merge → deploy → verify.

---

## Phase 3 — Hero canvas defer/gate + Hotjar (highest risk — isolated, most-scrutinized)

### 3.1 Slim `public/legacy/app.js`
Keep only `onDomReady` + the `DevForgeSite` constructor/`init()` stub + `ScreenAnimation`/`Particle`. Delete the ~12KB of never-called methods (`cacheElements`, `initializeAOS`, `initializeSmoothScroll`, `initializeNav`, `initializeRevealEffects`, `initializeStepper`, `initializeModal`, `initializeIframeEvents`, terminal/chat/iframe handlers, `initializeTestimonials`, `setupEventListeners`) and the dead theme-toggle block (~lines 732–780, which also throws a per-load `TypeError` on the null `#theme-toggle-checkbox`).

### 3.2 Defer + gate the canvas
- Move the legacy `app.js` `<Script>` from `strategy="beforeInteractive"` → `strategy="afterInteractive"` (or `lazyOnload`). Keep `<canvas id="screen-canvas">` server-rendered in `Hero.tsx`.
- Add an **IntersectionObserver** that `stop()`s the rAF loop when the hero leaves the viewport and `start()`s it when it re-enters, and an early **`matchMedia('(prefers-reduced-motion: reduce)')`** guard that renders a static frame instead of animating. Model exactly on `ProjectVideo.tsx`.
> Risk note: `ScreenAnimation.init()` calls `getBoundingClientRect()` (a layout read). After deferral, verify the canvas still measures its container correctly (no zero-size canvas) and animates before/at the fold.

### 3.3 Hotjar → `lazyOnload`
Change the Hotjar `<Script>` from `afterInteractive` → `lazyOnload` (browser-idle). Full analytics retained; frees INP. (Optional: gate behind first interaction; not required.)

**Phase 3 verification (most scrutiny):** `npm run build` clean; browser QA both themes — **hero canvas still animates** (and pauses when scrolled away / is static under reduced-motion), **voice orb still mints a token and starts a call**, theme toggle works, no console `TypeError`, Hotjar still loads (idle). Merge → deploy → verify live (voice + canvas + theme).

---

## 4. File-change summary

**Create:** `app/robots.ts`, `app/sitemap.ts`, `app/components/JsonLd.tsx`, `app/(tracerlabs)/opengraph-image.tsx`, `app/solar/opengraph-image.tsx`.
**Modify:** `app/layout.tsx` (viewport, metadataBase, remove AOS), `app/(tracerlabs)/layout.tsx` (OG fix, title.template, canonical, fonts), `app/solar/layout.tsx` (canonical, twitter, OG), `app/(tracerlabs)/page.tsx` (render `<JsonLd/>`), `next.config.ts` (images/compress), `app/globals.css` (font var wiring if needed), `public/style.css` (slim), `app/components/Nav.tsx`/`TechBar.tsx`/`Projects.tsx`/`Hero.tsx` (next/image), `public/legacy/app.js` (slim + gate), and the canvas `<Script>` + Hotjar strategies.
**Delete:** AOS references (CSS+JS); the legacy Duborics `@font-face` + Google-Fonts `@import` + `body{transition}` + dead rules in `style.css`. **Keep** `DuboricsRegular.woff2` (next/font) and `.ttf` (next/og) on disk; only `.eot` is deletable.

## 5. Risks & mitigations
- **next/font + style.css slim** (Phase 2): the no-preflight `*{font-family}` leak is currently neutralized by the `#tl-*` isolation block; verify brand fonts still resolve everywhere after the `@import`/`@font-face` removal. Mitigation: migrate fonts first, confirm visually, then strip style.css font rules.
- **Canvas deferral** (Phase 3): the one item with real interactivity risk. Mitigation: keep markup server-rendered, change only script timing + add gating, verify the `getBoundingClientRect` measurement and the voice/theme islands on a preview deploy before merging.
- **OG `next/og`**: build-time image gen; if it errors, fall back to a static 1200×630 PNG. Non-blocking.
- Live-site safety: each phase is its own branch/deploy/verify; nothing risky is bundled with metadata changes.
