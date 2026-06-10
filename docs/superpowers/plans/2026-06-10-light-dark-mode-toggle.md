# Light / Dark Mode Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a navbar toggle that switches the Tracerlabs main site (`app/(tracerlabs)/`) between the existing dark theme and a new "cool slate" light theme, persisted in `localStorage`, defaulting to dark.

**Architecture:** Semantic CSS-variable tokens. A `data-theme="light"|"dark"` attribute on `<html>` flips a small set of `--tl-*` custom properties; Tailwind v4 `@theme inline` maps them to `--color-ink`/`--color-page`/`--color-surface` so utilities like `text-ink/55`, `bg-page`, `bg-surface`, `border-ink/8` re-resolve at runtime with no rebuild. Hardcoded inline-style colors (glows, shadows, the shared glass-card recipe) move to `--tl-*` vars. Dark-locked elements (embossed metal plates, the hero device-screen canvas, the Projects device mockup, the red mic orb) are deliberately excluded from the flip. A client `ThemeToggle` drives only `<html data-theme>` + `localStorage` (never the legacy `theme-toggle-checkbox` id or a `themeChanged` event, which would re-activate dead legacy JS and flip the hero canvas).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (unlayered, **no preflight**), legacy `public/style.css` (reset + fonts + body bg), `public/legacy/app.js` (hero canvas only).

**Spec:** `docs/superpowers/specs/2026-06-10-light-dark-mode-toggle-design.md`

**Branch:** `feat/light-dark-mode` (already created; spec already committed).

> **No unit-test framework in this repo** (`package.json` has only `dev`/`build`/`start`/`lint`). Verification per task = `npm run lint` (fast TS/JSX gate) + **visual QA in both themes**. Build (`npm run build`) and full visual QA happen at the end. **Never run `npm run build` while `next dev` is running** — they share `.next/` and clobber each other ("Cannot find module './XXX.js'"). Dev server runs on **PORT=3100**.

---

## File Structure

**Create:**
- `app/components/ThemeToggle.tsx` — client toggle button (sun/moon, angular), flips `data-theme` + persists.

**Modify:**
- `app/globals.css` — token layer: split `@theme`, add `@theme inline` + `:root`/`html[data-theme=light]` `--tl-*` values, `html body` page-bg rule, logo-swap CSS.
- `app/layout.tsx` — bootstrap: always load `/style.css`, set `data-theme` pre-paint, drop the `light-mode.css` branch.
- `app/components/Bevel.tsx` — repoint `GLASS_BG`/`GLASS_BORDER` + defaults to card vars; add `--tl-card-shadow` via `filter: drop-shadow`.
- `app/components/Nav.tsx` — dual logo (CSS-swapped), add `ThemeToggle`, sweep.
- `app/components/Hero.tsx` — sweep (targeted: keep device-screen `bg-black`), dot-grid + vignette vars, drop the clipped window box-shadow.
- `app/components/Services.tsx` — file-wide sweep (plate is inline-style, untouched).
- `app/components/Projects.tsx` — sweep the `Projects()` body only (exclude `OpsPanel`/`Frame`); Frame edge → dark literal; Frame shadow → `--tl-frame-shadow` filter.
- `app/components/Cta.tsx` — file-wide sweep (plate is inline-style, untouched).
- `app/components/TechBar.tsx` — sweep + `--tl-logo-filter`.
- `app/components/Footer.tsx`, `app/components/Eyebrow.tsx` — file-wide sweep.
- `app/components/Button.tsx` — lift base `text-white` into per-variant tone; secondary ghost → vars.
- `app/components/VoiceWidget.tsx` — sweep label/status text only (orb excluded).
- `public/legacy/app.js` *(optional, Task 11)* — null-guard the per-load TypeError.

**Delete:**
- `public/light-mode.css` — stale legacy light theme (2,180 lines).

---

## Task 1: Token layer in `globals.css`

**Files:**
- Modify: `app/globals.css:23-45` (the `@theme {…}` block)

- [ ] **Step 1: Replace the `@theme` block with the restructured token layer**

In `app/globals.css`, replace the entire existing `@theme { … }` block (lines 23–45, starting `@theme {` and ending at its closing `}` after `--animate-orb-ripple`) with the following. Everything before line 23 (the imports + `a {}` reset) and after line 45 (the `@keyframes`) stays unchanged.

```css
@theme {
  /* Tracerlabs brand palette (lifted from public/style.css :root) */
  --color-brand-pink: #e7028d;
  --color-brand-blue: #056afc;
  --color-brand-red: #e21949;
  --color-muted: #8a8a93;
  --color-faint: #5a5a63;

  /* Fonts already loaded by public/style.css (@font-face Duborics, @import Plus Jakarta) */
  --font-display: "Duborics", "Plus Jakarta Sans", sans-serif;
  --font-body: "Plus Jakarta Sans", system-ui, sans-serif;

  /* Hero entrance + ambient motion */
  --animate-rise: rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  --animate-drift: drift 18s ease-in-out infinite alternate;
  --animate-drift-slow: drift 26s ease-in-out infinite alternate-reverse;
  --animate-shimmer: shimmer 6s linear infinite;

  /* Voice widget orb (CTA). animate-* prefix so the reduced-motion rule disables them. */
  --animate-orb-pulse: orbPulse 2.4s ease-in-out infinite;
  --animate-orb-ripple: orbRipple 1.6s ease-out infinite;
}

/* Theme-aware semantic colors. @theme inline (NOT plain @theme) so utilities emit the raw
   var() — e.g. text-ink/55 → color-mix(in oklab, var(--tl-ink) 55%, transparent) — which
   re-resolves at runtime when --tl-ink flips on <html data-theme>. Verified vs tailwindcss@4.3.0.
   The --tl-* values live in the plain :root rules below (they must NOT go inside @theme). */
@theme inline {
  --color-ink: var(--tl-ink);
  --color-page: var(--tl-page);
  --color-surface: var(--tl-surface);
}

/* ── Theme token values ──────────────────────────────────────────────────────
   Dark is the default (no attribute); light is opt-in via data-theme="light" on <html>,
   set before first paint by the css-bootstrap script in app/layout.tsx. */
:root {
  color-scheme: dark;

  /* core */
  --tl-ink: #ffffff;
  --tl-page: #000000;
  --tl-surface: #0b0b0e;

  /* shared card recipe (Bevel.tsx GLASS_BG/GLASS_BORDER + defaults point here) */
  --tl-card-bg: linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 35%, rgba(255,255,255,0) 70%), rgba(7,8,10,0.82);
  --tl-card-border: rgba(255,255,255,0.10);
  --tl-card-shadow: none;

  /* decorative (per-theme) */
  --tl-dot-grid: rgba(255,255,255,0.06);
  --tl-hero-vignette: rgba(0,0,0,0.85);
  --tl-frame-shadow: none;
  --tl-btn-ghost-border: rgba(255,255,255,0.22);
  --tl-btn-ghost-fill: #0a0a0c;
  --tl-logo-filter: grayscale(1) brightness(1.6) contrast(0.9);
}

html[data-theme="light"] {
  color-scheme: light;

  /* core */
  --tl-ink: #0b0d12;
  --tl-page: #eef0f4;
  --tl-surface: #ffffff;

  /* cards become solid white + a soft drop-shadow (applied via filter: drop-shadow in
     Bevel — box-shadow is clipped by the bevel clip-path, drop-shadow follows the shape) */
  --tl-card-bg: #ffffff;
  --tl-card-border: rgba(11,13,18,0.08);
  --tl-card-shadow: drop-shadow(0 1px 2px rgba(11,13,18,0.05)) drop-shadow(0 12px 24px rgba(11,13,18,0.10));

  /* decorative */
  --tl-dot-grid: rgba(11,13,18,0.06);
  --tl-hero-vignette: rgba(15,23,42,0.08);
  --tl-frame-shadow: drop-shadow(0 24px 40px rgba(11,13,18,0.22));
  --tl-btn-ghost-border: rgba(11,13,18,0.22);
  --tl-btn-ghost-fill: #ffffff;
  --tl-logo-filter: grayscale(1) invert(1);
}

/* Own the page background here so it flips with the theme. Beats legacy public/style.css
   `body{background:#000}` — `html body` = (0,0,0,2) > `body` = (0,0,0,1); there is zero
   !important in style.css. Keep this rule UNLAYERED (never inside @layer) so it stays in
   the same tier as the legacy sheet and wins on specificity regardless of load order. */
html body {
  background-color: var(--tl-page, #000);
}

/* Per-theme logo swap. Nav renders both <img>s tagged data-logo; CSS shows the right one
   (no client JS, no flash). */
html[data-theme="light"] [data-logo="dark"] { display: none; }
html:not([data-theme="light"]) [data-logo="light"] { display: none; }
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: no errors (CSS isn't linted, but this confirms nothing else broke).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(theme): semantic CSS-var token layer (dark default, light values)"
```

> Note: dark `--tl-page` is `#000` to exactly preserve the current pure-black look (`bg-black` was `#000`). `--color-muted`/`--color-faint` stay static brand grays; if a later `grep -rn 'text-muted\|text-faint' app/components` finds usages on themeable surfaces, give them `--tl-*` flips — none are expected.

---

## Task 2: Theme bootstrap in `layout.tsx` + delete stale CSS

**Files:**
- Modify: `app/layout.tsx:28-35` (the `css-bootstrap` Script)
- Delete: `public/light-mode.css`

- [ ] **Step 1: Update the `css-bootstrap` inline script**

In `app/layout.tsx`, replace this exact block:

```jsx
        <Script id="css-bootstrap" strategy="beforeInteractive">
          {`(function () {
  if (location.pathname.indexOf('/solar') === 0) return;
  function css(href, id) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; if (id) l.id = id; document.head.appendChild(l); }
  css('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css');
  css(localStorage.getItem('theme') === 'light' ? '/light-mode.css' : '/style.css', 'theme-stylesheet');
})();`}
        </Script>
```

with:

```jsx
        <Script id="css-bootstrap" strategy="beforeInteractive">
          {`(function () {
  if (location.pathname.indexOf('/solar') === 0) return;
  function css(href, id) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; if (id) l.id = id; document.head.appendChild(l); }
  css('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css');
  css('/style.css', 'theme-stylesheet');
  document.documentElement.dataset.theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
})();`}
        </Script>
```

(Only two lines change: `/style.css` is now unconditional, and a new line sets `data-theme` before first paint. The `/solar` early-return is preserved, so `/solar` never receives `data-theme`.)

- [ ] **Step 2: Delete the stale legacy light stylesheet**

Run: `git rm public/light-mode.css`
Expected: `rm 'public/light-mode.css'`

- [ ] **Step 3: Verify the mechanism in the browser**

Start dev (in a separate terminal, leave running): `PORT=3100 npm run dev`
Open `http://localhost:3100`. Site looks identical to before (dark). In DevTools console:
- `document.documentElement.dataset.theme` → `"dark"`.
- Run `document.documentElement.dataset.theme = 'light'` → **page background turns light gray (`#eef0f4`)**. (Component text will look broken — that's expected until the sweep tasks; you're only verifying the token mechanism + page bg flip work.)
- Run `document.documentElement.dataset.theme = 'dark'` → back to black.

- [ ] **Step 4: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/layout.tsx public/light-mode.css
git commit -m "feat(theme): set data-theme pre-paint, drop light-mode.css swap"
```

---

## Task 3: Card vars + clip-safe shadow in `Bevel.tsx`

**Files:**
- Modify: `app/components/Bevel.tsx:6-8` (exported tokens), `:21-22` (defaults), `:37` (root style)

- [ ] **Step 1: Repoint the exported glass tokens to the card vars**

Replace lines 6–8:

```ts
export const GLASS_BORDER = "rgba(255,255,255,0.10)";
export const GLASS_BG =
  "linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 35%, rgba(255,255,255,0) 70%), rgba(7,8,10,0.82)";
```

with:

```ts
export const GLASS_BORDER = "var(--tl-card-border)";
export const GLASS_BG = "var(--tl-card-bg)";
```

- [ ] **Step 2: Repoint the default props**

Replace lines 21–22:

```ts
  border = "rgba(255,255,255,0.14)",
  bg = "#0b0b0e",
```

with:

```ts
  border = "var(--tl-card-border)",
  bg = "var(--tl-surface)",
```

- [ ] **Step 3: Add the clip-safe card shadow to the Bevel root**

Replace line 37:

```ts
    <div className={`relative ${className}`} style={{ clipPath: c, backgroundColor: border, ...style }}>
```

with (adds `filter` FIRST so call sites can still override via `style`; `var(--tl-card-shadow)` is `none` in dark → `filter:none`, no stacking context):

```ts
    <div className={`relative ${className}`} style={{ filter: "var(--tl-card-shadow, none)", clipPath: c, backgroundColor: border, ...style }}>
```

- [ ] **Step 4: Verify**

With dev running, reload `http://localhost:3100`. Dark: cards look identical (`--tl-card-shadow: none`). Set `data-theme='light'` in console: card panels (Services tiles, Projects copy cards, Cta steps, hero window frame) now have **white fills + a soft drop-shadow + a faint black hairline**. Set back to `dark`.

- [ ] **Step 5: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/Bevel.tsx
git commit -m "feat(theme): Bevel card vars + clip-safe drop-shadow"
```

---

## Task 4: `ThemeToggle` component + Nav integration

**Files:**
- Create: `app/components/ThemeToggle.tsx`
- Modify: `app/components/Nav.tsx`

- [ ] **Step 1: Create `ThemeToggle.tsx`**

Create `app/components/ThemeToggle.tsx` with exactly:

```tsx
"use client";

import { useEffect, useState } from "react";

// Light/dark toggle. Drives ONLY <html data-theme> + localStorage. It deliberately does NOT
// use the id "theme-toggle-checkbox" or dispatch a 'themeChanged' event — both would
// re-activate dead legacy code in public/legacy/app.js and flip the hero canvas against the
// design intent. The initial attribute is set pre-paint by the css-bootstrap script in
// app/layout.tsx; we read it on mount (null until then) so the icon never causes a hydration
// mismatch.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* private mode — ignore */
    }
    setTheme(next);
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className={`bv-6 inline-flex h-9 w-9 shrink-0 items-center justify-center text-ink/70 transition-colors hover:text-ink ${className}`}
      style={{ background: "var(--tl-card-bg)", boxShadow: "inset 0 0 0 1px var(--tl-card-border)" }}
    >
      {theme === null ? (
        <span className="h-4 w-4" aria-hidden />
      ) : isLight ? (
        // moon → click switches to dark
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        // sun → click switches to light
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Wire the toggle + dual logo into `Nav.tsx`**

In `app/components/Nav.tsx`:

(a) Add the import after the existing `Bevel` import (line 4):
```tsx
import ThemeToggle from "./ThemeToggle";
```

(b) Replace the single logo `<img>` (line 27):
```tsx
            <img src="/assets/logo-dark.png" alt="Tracerlabs" className="h-[150px] w-auto max-w-none translate-y-3" />
```
with both logos (CSS in globals shows the right one):
```tsx
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[150px] w-auto max-w-none translate-y-3" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[150px] w-auto max-w-none translate-y-3" />
```

(c) Sweep the nav links — replace line 36:
```tsx
              className="font-display text-[0.95rem] uppercase tracking-[0.06em] text-white/70 transition-colors hover:text-white"
```
with:
```tsx
              className="font-display text-[0.95rem] uppercase tracking-[0.06em] text-ink/70 transition-colors hover:text-ink"
```

(d) Add the toggle next to the Contact button — replace lines 43–45:
```tsx
        <Button href="#contact" variant="primary">
          Contact
        </Button>
```
with:
```tsx
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button href="#contact" variant="primary">
            Contact
          </Button>
        </div>
```

- [ ] **Step 3: Verify end-to-end**

Reload `http://localhost:3100`. A sun icon appears in the nav (dark mode). **Click it** → page bg + nav + cards flip to light, the logo swaps to `logo-light.png` (black wordmark, legible), icon becomes a moon. **Reload** → stays light (persisted). Click again → back to dark, persists. (The Hero/Services/etc. body text will still be partly broken in light — fixed in Tasks 5–10.)

- [ ] **Step 4: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/ThemeToggle.tsx app/components/Nav.tsx
git commit -m "feat(theme): ThemeToggle in nav + per-theme logo swap"
```

---

## Task 5: `Hero.tsx` sweep (keep device screen dark)

**Files:**
- Modify: `app/components/Hero.tsx`

**Exclusions (leave dark — do NOT change):** line 210 `bg-black` (the device-screen frame), the canvas (211–215), and the inner-reflection inline style (217–224, `rgba(255,255,255,0.06)`). The brand auroras (34, 42), window glow (183), grain (61), gradient-text (87–97), and `maskImage` (54) also stay unchanged.

- [ ] **Step 1: File-wide utility swaps that are safe everywhere in Hero**

These utility classes appear only on the (light) hero frame/copy, never on the dark device screen, so use **substring replace_all** (each substring rule naturally covers every opacity variant — e.g. `text-white`→`text-ink` turns `text-white/55` into `text-ink/55` and the bare `text-white` on line 166 into `text-ink`):
- `text-white` → `text-ink`   (lines 102, 158, 159, 165, 166, 199)
- `bg-white` → `bg-ink`   (lines 130, 164, 196–198 — the `/25`, `/10`, `/15` chrome dots)
- `border-white` → `border-ink`   (lines 138, 195 — the `/8` borders)
- `ring-white` → `ring-ink`   (line 146 — `ring-white/15`)
- `border-black` → `border-page`   (line 146 — avatar ring)
- `to-black` → `to-page`   (line 233 — seam fade)

(`bg-black` is intentionally NOT in this list — it has two occurrences and only one flips; handled in Step 2.)

- [ ] **Step 2: Targeted `bg-black` — section only, NOT the screen**

Replace line 25 (the section root) exactly:
```tsx
      className="font-body relative isolate w-full overflow-hidden bg-black text-ink"
```
with:
```tsx
      className="font-body relative isolate w-full overflow-hidden bg-page text-ink"
```
**Do NOT change line 210** (`className="relative aspect-[16/11] w-full overflow-hidden bg-black"`) — the device screen stays black.

- [ ] **Step 3: Dot-grid + vignette → vars**

Replace the dot-grid color on line 51:
```tsx
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
```
with:
```tsx
            "radial-gradient(circle, var(--tl-dot-grid) 1px, transparent 1px)",
```

Replace the vignette on line 68:
```tsx
            "radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(0,0,0,0.85) 100%)",
```
with:
```tsx
            "radial-gradient(120% 80% at 50% 0%, transparent 55%, var(--tl-hero-vignette) 100%)",
```

- [ ] **Step 4: Drop the clipped window box-shadow (the Bevel `--tl-card-shadow` filter handles it)**

On the `<Bevel>` (lines 187–193), remove the shadow className. Replace line 192:
```tsx
            className="shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
```
with:
```tsx
            className=""
```
(That box-shadow was clipped by the bevel `clip-path` and invisible anyway; the hero window now gets the shared `--tl-card-shadow` drop-shadow in light, nothing in dark.)

- [ ] **Step 5: Verify**

Reload, toggle to light: hero section bg is light gray, copy text is dark ink, the browser-chrome window is a light frosted card with dark dots, **and the device screen inside it stays dark** with the canvas animation running. Toggle to dark → identical to original.

- [ ] **Step 6: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/Hero.tsx
git commit -m "feat(theme): Hero light mode (device screen stays dark)"
```

---

## Task 6: `Services.tsx` sweep (file-wide — plate is inline-style)

**Files:**
- Modify: `app/components/Services.tsx`

The embossed `IconTile` (88–107) uses inline styles + `text-[#e9eaef]` (an arbitrary value) and the gradient word uses `text-transparent` — none are `text-white`/`bg-white`/`bg-black` utilities, so a utility-level sweep cannot touch them. File-wide replace is safe.

- [ ] **Step 1: File-wide utility swaps (replace all occurrences)**
- `text-white/55` → `text-ink/55`
- `text-white/70` → `text-ink/70`
- `text-white/80` → `text-ink/80`
- `hover:text-white` → `hover:text-ink`
- `bg-white/[0.045]` → `bg-ink/[0.045]`
- `bg-black` → `bg-page` (section root, line 180)

(`text-ink` on line 180, `text-brand-pink` on 231, the IconTile inline styles, and `text-transparent` on 202 are untouched — correct.)

- [ ] **Step 2: Verify**

Reload, toggle light: Services section is light gray, tiles are white cards with shadows, headings/body dark ink, **the embossed icon plates stay dark** (intentional), the gradient word "AI to work" still shows the pink→blue gradient. Toggle dark → identical to original.

- [ ] **Step 3: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/Services.tsx
git commit -m "feat(theme): Services light mode (embossed plates stay dark)"
```

---

## Task 7: `Projects.tsx` — sweep the main body, keep the device mockup dark

**Files:**
- Modify: `app/components/Projects.tsx`

**Critical:** the `OpsPanel` (lines 113–151) and `Frame` (156–189) functions render the always-dark portrait device mockup. Their `text-white/*` / `bg-white/*` utilities and inline styles **must stay dark**. Apply the white→ink sweep **only inside the `Projects()` default export function (lines 191–287)**, plus the two specific Frame edits below.

- [ ] **Step 1: Sweep inside `Projects()` only (lines 191–287)**

Within the `export default function Projects()` body, replace:
- `bg-black` → `bg-page` (line 193, section root — the only `bg-black` in the file)
- `text-white/55` → `text-ink/55` (lines 209, 242, 277)
- `text-white/40` → `text-ink/40` (line 240)
- `text-white/80` → `text-ink/80` (lines 247, 279)
- `text-white/50` → `text-ink/50` (line 256)
- `text-white/70` → `text-ink/70` (line 264)
- `hover:text-white` → `hover:text-ink` (lines 264, 279)
- `bg-white/[0.06]` → `bg-ink/[0.06]` (line 247)
- `bg-white/[0.045]` → `bg-ink/[0.045]` (line 256)

**Do NOT touch** `OpsPanel` (lines 121–148: `text-white/55` 123, `text-white/30` 127, `bg-white/[0.045]` 133, `bg-white/[0.09]` 134, `bg-white/18` 136, `bg-white/10` 137) — these stay dark. The `shipped` gradient text (207, `text-transparent`) and the copy-card Bevel (232–235, already uses the flipping `GLASS_*` vars) need no manual change here.

- [ ] **Step 2: Pin the Frame edge dark + convert its shadow to a clip-safe filter**

The `Frame` uses the shared `GLASS_BORDER` for its edge, which now flips — pin it back to a dark literal so the device frame stays dark. Replace line 160–161:
```tsx
      className="relative aspect-[9/16] w-full shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
      style={{ clipPath: FRAME_CLIP, backgroundColor: GLASS_BORDER }}
```
with:
```tsx
      className="relative aspect-[9/16] w-full"
      style={{ clipPath: FRAME_CLIP, backgroundColor: "rgba(255,255,255,0.10)", filter: "var(--tl-frame-shadow, none)" }}
```
(The old box-shadow was clipped by `FRAME_CLIP` and invisible; `--tl-frame-shadow` is `none` in dark and a clip-following drop-shadow in light so the dark device casts a soft shadow on the light page. The Frame's inner gradient (167–168), top sheen (185), and `OpsPanel` stay dark.)

- [ ] **Step 3: Verify**

Reload, toggle light: Projects section light gray, copy cards white with dark text, **each portrait media frame stays a dark device mockup** (the meat-ops list, screenshots, and reels all read as before), with a soft shadow under it. Toggle dark → identical to original.

- [ ] **Step 4: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/Projects.tsx
git commit -m "feat(theme): Projects light mode (device mockups stay dark)"
```

---

## Task 8: `Cta.tsx` sweep (file-wide — plate is inline-style)

**Files:**
- Modify: `app/components/Cta.tsx`

The step-number chip (60–70) is inline-style + `text-[#e9eaef]`; the headline word is `text-transparent`. File-wide utility sweep is safe.

- [ ] **Step 1: File-wide utility swaps (replace all occurrences)**
- `bg-black` → `bg-page` (line 20)
- `text-white/55` → `text-ink/55` (line 44)
- `text-white/50` → `text-ink/50` (line 72)
- `text-white/40` → `text-ink/40` (line 79)
- `text-white/70` → `text-ink/70` (line 80)

- [ ] **Step 2: Verify**

Reload, toggle light: CTA section light gray, copy dark ink, the three step cards white with shadows, **the embossed step-number chips stay dark**, the "AI to work?" gradient word intact, and the red mic orb unchanged. Toggle dark → identical.

- [ ] **Step 3: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/Cta.tsx
git commit -m "feat(theme): Cta light mode (step plates stay dark)"
```

---

## Task 9: `TechBar.tsx` + `Footer.tsx` + `Eyebrow.tsx`

**Files:**
- Modify: `app/components/TechBar.tsx`, `app/components/Footer.tsx`, `app/components/Eyebrow.tsx`

- [ ] **Step 1: `TechBar.tsx` — band, fades, logo filter**

Replace line 17:
```tsx
    <div className="relative w-full overflow-hidden border-y border-white/[0.07] bg-black py-7">
```
with:
```tsx
    <div className="relative w-full overflow-hidden border-y border-ink/[0.07] bg-page py-7">
```
Replace `from-black` → `from-page` on lines 19 and 20 (the two edge-fade gradients; band and fades must share the page color).
Replace the logo filter on line 30:
```tsx
            style={{ filter: "grayscale(1) brightness(1.6) contrast(0.9)" }}
```
with:
```tsx
            style={{ filter: "var(--tl-logo-filter)" }}
```

- [ ] **Step 2: `Footer.tsx` — file-wide sweep (replace all occurrences)**
- `border-white/10` → `border-ink/10` (line 14)
- `bg-black` → `bg-page` (line 14)
- `text-white` → `text-ink` (line 20 — bare)
- `text-white/55` → `text-ink/55` (line 23)
- `text-white/35` → `text-ink/35` (lines 27, 34, 54)
- `text-white/65` → `text-ink/65` (line 41)
- `hover:text-white` → `hover:text-ink` (line 41)
- `border-white/[0.08]` → `border-ink/[0.08]` (line 50)
- `text-white/40` → `text-ink/40` (line 51)

- [ ] **Step 3: `Eyebrow.tsx` — file-wide sweep (replace all occurrences)**
- `bg-white/[0.05]` → `bg-ink/[0.05]` (line 17)
- `text-white/70` → `text-ink/70` (line 24)

(`bg-brand-pink` on 21–22 stays.)

- [ ] **Step 4: Verify**

Reload, toggle light: the tech marquee band is light with dark-readable logos (no black boxes, no vanished logos), all four section eyebrows are faint dark chips with a pink dot, and the footer is light with dark text + readable links. Toggle dark → identical. *(If a TechBar logo reads oddly, note it for the QA pass in Task 12 — the `invert` filter is a known cosmetic compromise.)*

- [ ] **Step 5: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/TechBar.tsx app/components/Footer.tsx app/components/Eyebrow.tsx
git commit -m "feat(theme): TechBar/Footer/Eyebrow light mode"
```

---

## Task 10: `Button.tsx` + `VoiceWidget.tsx`

**Files:**
- Modify: `app/components/Button.tsx`, `app/components/VoiceWidget.tsx`

- [ ] **Step 1: `Button.tsx` — lift base text color, theme the secondary ghost**

(a) Remove `text-white ` from the base string (line 41). Replace:
```tsx
  const base = `font-display group/btn relative inline-flex items-center justify-center gap-2 ${sizeCls} font-bold uppercase leading-none tracking-[0.04em] text-white outline-none transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5`;
```
with:
```tsx
  const base = `font-display group/btn relative inline-flex items-center justify-center gap-2 ${sizeCls} font-bold uppercase leading-none tracking-[0.04em] outline-none transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-0.5`;
```

(b) Put the color back per-variant (primary stays white on the red fill; secondary flips to ink). Replace lines 43–49:
```tsx
  const style = primary
    ? { clipPath: CLIP, backgroundColor: "#e21949", boxShadow: "0 8px 26px -10px rgba(226,2,73,0.55)" }
    : { clipPath: CLIP, backgroundColor: "rgba(255,255,255,0.22)" };

  const tone = primary
    ? "opacity-90 hover:opacity-100 hover:shadow-[0_12px_34px_-8px_rgba(226,25,73,0.7)]"
    : "text-white/85 hover:text-white";
```
with:
```tsx
  const style = primary
    ? { clipPath: CLIP, backgroundColor: "#e21949", boxShadow: "0 8px 26px -10px rgba(226,2,73,0.55)" }
    : { clipPath: CLIP, backgroundColor: "var(--tl-btn-ghost-border)" };

  const tone = primary
    ? "text-white opacity-90 hover:opacity-100 hover:shadow-[0_12px_34px_-8px_rgba(226,25,73,0.7)]"
    : "text-ink/85 hover:text-ink";
```

(c) Theme the secondary ghost interior. Replace line 54:
```tsx
        <span aria-hidden className="absolute inset-[1.5px] z-0" style={{ clipPath: CLIP, backgroundColor: "#0a0a0c" }} />
```
with:
```tsx
        <span aria-hidden className="absolute inset-[1.5px] z-0" style={{ clipPath: CLIP, backgroundColor: "var(--tl-btn-ghost-fill)" }} />
```

- [ ] **Step 2: `VoiceWidget.tsx` — flip label/status text only (orb excluded)**

Replace **all occurrences of the substring `text-white`** with `text-ink` (covers `text-white`, `text-white/45`, `text-white/70`, `text-white/80`, `hover:text-white` on lines 25, 176, 177, 180, 181, 182, 185, 186). This does **not** match the orb's `border-white/45 border-t-white` (line 149) or any orb inline style / `bg-[#ffe7ec]` — leave those exactly as-is.

- [ ] **Step 3: Verify**

Reload, toggle light: the "See our work" secondary button in the hero is now a light ghost (white interior, dark border + text); the primary red "Start your project"/"Contact" buttons are unchanged (red, white text). The voice widget's status text ("Talk to our AI", "~2 minutes…") is dark ink, **the red mic orb is unchanged** (including its white spinner when connecting). Toggle dark → identical to original.

- [ ] **Step 4: Lint + commit**

Run: `npm run lint` → no errors.
```bash
git add app/components/Button.tsx app/components/VoiceWidget.tsx
git commit -m "feat(theme): Button ghost + VoiceWidget labels light mode"
```

---

## Task 11 (optional): harden legacy `app.js`

**Files:**
- Modify: `public/legacy/app.js:525`

This kills a pre-existing per-load `TypeError` (`addEventListener` on a null `#theme-toggle-checkbox`) and removes any chance of the legacy path flipping the hero canvas. Skip if you prefer not to touch legacy JS.

- [ ] **Step 1: Null-guard the checkbox listener**

Replace line 525:
```js
                    document.getElementById('theme-toggle-checkbox').addEventListener('change', (e) => {
```
with:
```js
                    const __tc = document.getElementById('theme-toggle-checkbox'); __tc && __tc.addEventListener('change', (e) => {
```
(The arrow-function body and its closing `});` stay unchanged — `__tc && (…)` short-circuits when the element is absent, which it always is now.)

- [ ] **Step 2: Verify no console error**

Reload `http://localhost:3100` with the console open. The previous `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` from `app.js` is gone. Toggle light/dark a few times → hero canvas **stays dark** in both (the legacy `updateTheme` never fires). 

- [ ] **Step 3: Commit**

```bash
git add public/legacy/app.js
git commit -m "fix(legacy): null-guard theme-toggle-checkbox listener"
```

---

## Task 12: Build + full visual QA in both themes

**Files:** none (verification only)

- [ ] **Step 1: Stop dev, run a production build**

Stop the `next dev` process first (they share `.next/`). Then:
Run: `npm run build`
Expected: `✓ Compiled successfully` and the route list including `/` and `/solar`; no type errors.

- [ ] **Step 2: Full visual QA checklist (toggle each, both themes)**

Start `PORT=3100 npm run dev` again, load `http://localhost:3100`, and confirm in **light** mode (then re-confirm dark is unchanged):
- [ ] Page background is `#eef0f4` light gray; no black flashes on reload when light is saved (no FOUC).
- [ ] Nav: white bar, dark links, `logo-light.png` legible, sun↔moon icon correct, toggle persists across reload.
- [ ] Hero: dark copy on light; browser-window frame is a light card; **device screen inside stays dark** with canvas running; secondary button is a light ghost; primary button red.
- [ ] TechBar: light band, all 9 logos legible (no dark boxes / no vanished logos).
- [ ] Services: white tiles + shadows; **embossed icon plates dark**; gradient word intact.
- [ ] Projects: white copy cards; **portrait device mockups stay dark** (ops list, screenshots, reels); gradient "shipped" intact.
- [ ] Cta: white step cards; **step-number plates dark**; red mic orb unchanged (start a call if env allows → orb + spinner correct); gradient headline intact.
- [ ] Footer: light, dark text, links readable.
- [ ] No `data-theme`/`localStorage` console errors.
- [ ] Visit `http://localhost:3100/solar` → **completely unaffected** by the theme (its own design), and toggling theme on `/` does not change `/solar`.

- [ ] **Step 3: Optional decorative tuning (only if QA flags it)**

If any ambient brand glow looks muddy on the light page, lower its wrapper opacity for light only (e.g. wrap the value or add a `html[data-theme="light"]` override). Candidates: Hero auroras (Hero.tsx 31/39, `opacity-[0.32]`/`[0.28]`) and window glow (180, `opacity-[0.45]`), Services ambient (185, `opacity-[0.16]`), Projects glow (197, `opacity-[0.13]`), Cta glow (27, `opacity-[0.28]`). These are polish, not blockers. Commit separately if changed.

- [ ] **Step 4: Final commit (if Step 3 made changes)**

```bash
git add -A
git commit -m "polish(theme): tune ambient glow opacity for light mode"
```

---

## Done

The feature branch `feat/light-dark-mode` now has a working light/dark toggle. Next step (outside this plan): open a PR / merge to `main` (which auto-deploys to `www.tracerlabs.io` via Vercel) per the team's finishing-a-development-branch flow.
