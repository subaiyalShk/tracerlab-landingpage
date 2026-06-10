# Light / Dark Mode Toggle — Design

**Date:** 2026-06-10
**Site:** Tracerlabs marketing site (`app/(tracerlabs)/`), Next.js 16, React 19, Tailwind v4 (unlayered, **no preflight**).
**Goal:** A navbar toggle that switches the main site between the existing dark theme and a new light theme, persisted across visits.

This design is grounded in an exhaustive per-component color audit and adversarial verification of the theming mechanism (see "Verified facts" at the end — several of my initial assumptions were wrong and are corrected here).

---

## 1. Decisions (locked)

| Decision | Choice |
|---|---|
| Implementation | **Semantic CSS-variable tokens**, flipped by `data-theme` on `<html>`. Built fresh. |
| Palette | **Cool slate**: page `#eef0f4`, white frosted cards, near-black ink `#0b0d12`, black-opacity for muted text/borders. Brand accents (pink `#e7028d`, blue `#056afc`, red `#e21949`) unchanged. |
| Default | **Dark**, persisted in `localStorage.theme`, **OS preference ignored**. |
| Scope | **Main site only.** `/solar` funnel untouched (verified isolated). |
| Embossed metal plates | **Stay dark** in light mode (intentional dark chips on white cards). |
| Hero device-screen canvas | **Stays dark** (depicts a device screen). |
| Stale `public/light-mode.css` | **Deleted.** |

---

## 2. Architecture / mechanism

### 2.1 The switch
A single `data-theme="light" | "dark"` attribute on `<html>` drives everything. CSS variables read it and flip; no stylesheet swapping.

### 2.2 Tailwind v4 token wiring (`app/globals.css`) — VERIFIED
Use **`@theme inline`** (verified against installed `tailwindcss@4.3.0`). With `@theme inline`, utilities emit `color-mix(in oklab, var(--tl-ink) 55%, transparent)` referencing the raw runtime var, so flipping `--tl-ink` at runtime inverts every `*-ink` / `*-ink/NN` utility with **no rebuild**. (Plain `@theme` also works for an `<html>`-level flip but bakes the value at `:root`, breaking any future subtree theming — `inline` is the correct, future-proof choice.)

Restructure the existing `@theme` block into:

```css
/* (A) constants that never flip — keep in a PLAIN @theme block */
@theme {
  --color-brand-pink: #e7028d;
  --color-brand-blue: #056afc;
  --color-brand-red:  #e21949;
  --font-display: "Duborics", "Plus Jakarta Sans", sans-serif;
  --font-body:    "Plus Jakarta Sans", system-ui, sans-serif;
  --animate-rise: …; --animate-drift: …; /* etc, unchanged */
  /* REMOVE --color-ink from here (currently hardcoded #ffffff at line 28). */
}

/* (B) theme-aware semantic colors — @theme inline so they re-resolve at runtime */
@theme inline {
  --color-ink:     var(--tl-ink);
  --color-page:    var(--tl-page);
  --color-surface: var(--tl-surface);
}

/* (C) the actual values — plain UNLAYERED :root rules (NOT inside @theme) */
:root {
  color-scheme: dark;
  --tl-ink: #ffffff;
  --tl-page: #07080a;
  --tl-surface: #0b0b0e;
  /* card recipe + decorative vars — see token catalog */
}
html[data-theme="light"] {
  color-scheme: light;
  --tl-ink: #0b0d12;
  --tl-page: #eef0f4;
  --tl-surface: #ffffff;
}
```

> **Note on `--color-muted` / `--color-faint`:** currently static brand grays in `@theme`. Implementation must grep for `text-muted` / `text-faint` usage in components; if used on themeable surfaces, give them `--tl-*` flips too, otherwise leave static.

### 2.3 Page background — VERIFIED (my original approach was wrong)
My initial plan (`html[data-theme="light"] body { background: var(--tl-page) }`) was **refuted**: the var was undefined, `data-theme` was never actually set anywhere, and in light mode a *different* stylesheet loads that *also* paints black. Corrected approach:

- Define `--tl-page` (done above, with values for both themes).
- Own the page background in `globals.css`, **unlayered**, with a selector that beats the legacy `body { background:#000 }` (0,0,0,1) — there is **zero `!important`** in `style.css`, so `html body` (0,0,0,2) wins in both themes regardless of load order:
  ```css
  html body { background-color: var(--tl-page, #07080a); }
  ```
  Keep this rule **unlayered** (never inside `@layer`) — Tailwind utilities import unlayered here, so unlayered-vs-unlayered is decided purely on specificity.

### 2.4 Stylesheet bootstrap (`app/layout.tsx`) — simplify + set the attribute
Today the `beforeInteractive` `css-bootstrap` script swaps `#theme-stylesheet` between `/style.css` and `/light-mode.css` off `localStorage.theme`. Change to:
- **Always** load `/style.css` (still needed: `@font-face` Duborics + Plus Jakarta `@import`, the `*` reset, brand vars). Drop the `/light-mode.css` branch.
- **Set `data-theme` before first paint** (prevents FOUC for returning light users):
  ```js
  (function () {
    if (location.pathname.indexOf('/solar') === 0) return;   // /solar stays isolated
    function css(href, id) { /* unchanged */ }
    css('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css');
    css('/style.css', 'theme-stylesheet');
    document.documentElement.dataset.theme =
      localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  })();
  ```
  Because this script early-returns on `/solar`, `/solar` never receives `data-theme` and never loads `globals.css` — fully isolated (verified).

### 2.5 Delete `public/light-mode.css`
2,180 lines of legacy CSS targeting removed static-HTML selectors. Dead. Remove it and the conditional that referenced it.

---

## 3. Token catalog

### Core (flip via §2.2)
| Var | Dark | Light | Drives |
|---|---|---|---|
| `--tl-ink` | `#ffffff` | `#0b0d12` | `text-ink`, `text-ink/NN`, `bg-ink/NN`, `border-ink/NN` (every `white/NN` → `ink/NN`) |
| `--tl-page` | `#07080a` | `#eef0f4` | `bg-page`, `html body` background |
| `--tl-surface` | `#0b0b0e` | `#ffffff` | `bg-surface`, solid card fill |

### Card recipe (repointed from `Bevel.tsx` `GLASS_*`)
| Var | Dark | Light |
|---|---|---|
| `--tl-card-bg` | current `GLASS_BG` gradient | `#ffffff` (optional faint ink top-sheen: `linear-gradient(160deg, rgba(11,13,18,0.025), transparent 35%), #ffffff`) |
| `--tl-card-border` | `rgba(255,255,255,0.10)` | `rgba(11,13,18,0.08)` |
| `--tl-card-shadow` | `none` | `0 1px 2px rgba(11,13,18,0.06), 0 8px 24px -12px rgba(11,13,18,0.12)` — **NEW**, needed so white cards separate from the gray page (no card shadow exists today) |

### Decorative (per-theme)
| Var | Dark | Light | Where |
|---|---|---|---|
| `--tl-dot-grid` | `rgba(255,255,255,0.06)` | `rgba(11,13,18,0.06)` | Hero dot grid (Hero.tsx:50-52) |
| `--tl-hero-vignette` | `rgba(0,0,0,0.85)` | `rgba(15,23,42,0.08)` | Hero edge vignette (67-68) |
| `--tl-hero-window-shadow` | `0 40px 120px -30px rgba(0,0,0,0.9)` | `0 30px 80px -28px rgba(15,23,42,0.25)` | Hero window (192) |
| `--tl-frame-shadow` | `0 40px 120px -40px rgba(0,0,0,0.9)` | `0 30px 80px -40px rgba(11,13,18,0.28)` | Projects media frame (160) |
| `--tl-btn-ghost-border` | `rgba(255,255,255,0.22)` | `rgba(11,13,18,0.22)` | secondary Button border (45) |
| `--tl-btn-ghost-fill` | `#0a0a0c` | `#ffffff` | secondary Button fill (54) |
| `--tl-logo-filter` | `grayscale(1) brightness(1.6) contrast(0.9)` | `grayscale(1) invert(1)` | TechBar marquee (30) — see §5 |

> Ambient brand glows (Hero auroras, Services/Projects/Cta radial washes) keep their **brand hues in both themes**; only their wrapper **opacity** is tuned down on light so halos don't muddy `#eef0f4`. Handle as a light-mode opacity override per glow (visual-QA pass), not a color flip.

---

## 4. Component migration — the rule **and the exclusions**

**The sweep:** in each component, `text-white*` → `text-ink*`, `bg-black` → `bg-page`, `border-white*` → `border-ink*`, `bg-white/[…]` → `bg-ink/[…]`, `ring-white*` → `ring-ink*`, gradient `to-black`/`from-black` → `to-page`/`from-page`. Per-component exact line maps are in the audit (preserved in git history / the workflow output).

**A blind find-replace WILL break the site.** These subtrees are dark-locked and must be **excluded** from the sweep (they sit on dark devices/plates/the red orb):

1. **Hero device screen** (Hero.tsx ~210-222): `bg-black` screen frame, `<canvas id="screen-canvas">`, inner sheen `rgba(255,255,255,0.06)`. Leave as literals. *(The Hero's outer `<Bevel>` window frame at 188-190 DOES flip — light browser chrome around a dark screen.)*
2. **Projects `<Frame>` media panel** (Projects.tsx ~157-189): the entire portrait device mockup, **including its OpsPanel subtree** — `text-white/55` (123), `text-white/30` (127), `bg-white/[0.045]` (133), `bg-white/[0.09]` (134), `bg-white/18` (136), `bg-white/10` (137), status colors (116-118,141), frame edge (161), inner fill (167-168), top sheen (185). All STAY DARK.
3. **Embossed metal plates**: Services `IconTile` (93-101) and Cta step-number chip (60-70) — gradient `linear-gradient(145deg,#2b2c33,#16171b)`, emboss `box-shadow`/`text-shadow`/`filter`, glyph `text-[#e9eaef]`. STAY DARK.
4. **VoiceWidget mic orb** (VoiceWidget.tsx ~120-170): red-metallic brand accent. Its internal `border-white/45 border-t-white` spinner (149) and `bg-[#ffe7ec]` stop square (152) sit ON the red orb — **do NOT flip**. Only the status/label text (25, 176-186) flips.
5. **Button base `text-white`** (Button.tsx:41): primary button text sits on the red fill — stays white in both themes. Only the secondary variant's tone (line 49) flips. *(Decision: the secondary ghost button inverts to a light ghost — fill `--tl-btn-ghost-fill` `#fff`, border `--tl-btn-ghost-border`, text `text-ink/85`. Low risk; primary CTA is theme-invariant.)*
6. **Gradient-text spans** (Hero 87-93, Services 202-203, Projects 206-208, Cta 39): keep `text-transparent` + `bg-clip-text` + the brand gradient. Never swap `text-transparent` to `text-ink`.

### 4.1 Shared-constant split (critical)
`GLASS_BORDER` / `GLASS_BG` (`Bevel.tsx`) are consumed both by cards that should flip (Nav, Services tiles, Hero window, Projects copy card, Cta step card) **and** by the Projects `<Frame>` edge (line 161) which must stay dark.

Plan:
- Repoint `Bevel.tsx`: `GLASS_BG → var(--tl-card-bg)`, `GLASS_BORDER → var(--tl-card-border)`; default props (`border` `rgba(255,255,255,0.14)`, `bg` `#0b0b0e`) → `var(--tl-card-border)` / `var(--tl-surface)`. Add `--tl-card-shadow` at the Bevel level or card call sites.
- At **Projects `<Frame>` (line 161)** stop importing/using `GLASS_BORDER` — inline a dark literal (`rgba(255,255,255,0.10)`) so the frame edge does **not** flip. (Its inner fill 167-168 and sheen 185 are already separate dark literals — leave them.)

---

## 5. Assets

- **Nav logo** (Nav.tsx:27): swap `/assets/logo-dark.png` → `/assets/logo-light.png` in light mode. Verified: `logo-light.png` exists (1080×1080, black wordmark), same 1:1 aspect as `logo-dark.png` (500×500, white wordmark) — drop-in, the existing `h-[150px]/translate-y-3` crop is preserved. **Implementation:** render both `<img>`s and show/hide via CSS keyed on `html[data-theme]` (no client JS, no flash):
  ```css
  html[data-theme="light"] [data-logo="dark"] { display: none; }
  html:not([data-theme="light"]) [data-logo="light"] { display: none; }
  ```
- **TechBar marquee** (TechBar.tsx:30): one filter change handles all 9 logos. Light mode uses `--tl-logo-filter: grayscale(1) invert(1)` — `invert` flips the 5 baked-black-background logos (aws/google/firebase/flutter/next) to light-on-dark-mark (boxes disappear into the page) AND the 4 white-on-transparent logos (anthropic/gemini/ethereum/crew-ai) to dark-on-transparent. Flip the band `bg-black` → `bg-page` and the two `from-black` edge-fade gradients → `from-page` (band and fades **must** share the same color or the edge mask breaks). *Cosmetic compromise: color logos render monochrome-inverted — acceptable for a dimmed marquee; flag for visual QA.*
- **Footer:** no image assets (brand mark is live text) — pure color-token flip.
- **Projects/Hero media** (screenshots, reel posters/videos, avatar photos): content, theme-agnostic — leave.

---

## 6. Toggle component

New `app/components/ThemeToggle.tsx` (`"use client"`), rendered in the Nav (visible on mobile too, near the Contact button):
- Initial state from `document.documentElement.dataset.theme` (set pre-paint in §2.4).
- On click: flip `document.documentElement.dataset.theme`, write `localStorage.setItem('theme', next)`.
- Logo handled by the CSS in §5 (no JS needed for the image).
- UI: sun/moon icon, angular (`bv-6` clip) to match the system — **not** the legacy emoji.

**Legacy-JS traps (verified — must avoid):**
- **Do NOT** give the toggle the id `theme-toggle-checkbox`. `public/legacy/app.js:525` currently calls `.addEventListener` on that (null) id and throws a benign per-load `TypeError` that aborts the legacy theme wiring — which is exactly why the hero canvas is permanently dark. Re-creating that id would re-activate `updateTheme()` and start flipping the canvas to light, violating the locked design.
- **Do NOT** dispatch a document `'themeChanged'` CustomEvent (same reason).
- The toggle drives **only** `<html data-theme>`, which `app.js` ignores entirely.

**Optional hardening (recommended):** null-guard `app.js:525` (`const cb = document.getElementById('theme-toggle-checkbox'); cb && cb.addEventListener(...)`) to kill the per-load uncaught `TypeError`, and remove/neuter the `'themeChanged'` listener (530-534) so the canvas can never be flipped.

---

## 7. Out of scope / visual-QA tuning (not blockers)
- Ambient glow opacities (Hero auroras 0.32/0.28/0.45, Services 0.16, Projects 0.13, Cta 0.28/0.34) — down-tune on light so halos don't muddy the page.
- Hero grain texture (`mix-blend-overlay` at opacity 0.06) reads differently on light — possible opacity/blend tweak.
- `amber-300` rating stars and avatar seams (`border-black`→`border-page`, `ring-white/15`→`ring-ink/15`) — contrast check on white.
- Legacy `body { color:#808080 }` default — only affects un-themed text (rare); confirm nothing relies on it.
- TechBar true-black band becomes `#07080a` in dark (negligible).

---

## 8. Sequencing (one PR, reviewable chunks)
1. **Token layer + mechanism**: `globals.css` (@theme split, `--tl-*` vars, `html body` bg rule), `layout.tsx` bootstrap (always `/style.css`, set `data-theme`), delete `public/light-mode.css`. *No visible change in dark.*
2. **Toggle + logo**: `ThemeToggle.tsx` in Nav, logo CSS swap, optional `app.js` hardening. *Toggle works; Nav themed.*
3. **`Bevel.tsx` card vars + shared-constant split** (incl. Projects `<Frame>` dark literal).
4. **Component sweep with exclusions**: Hero → Services → Projects → Cta → Footer/TechBar/Eyebrow/Button/VoiceWidget.
5. **Light-mode decorative tuning + visual QA** (§7) in both themes.

---

## 9. Testing / verification
- `npm run build` clean (stop `next dev` first — shared `.next/` clobber).
- Manual QA both themes at each breakpoint: page bg, every card, embossed plates stay dark, hero canvas stays dark, Projects device mockup stays dark, mic orb intact, gradient-text intact, logo legible, TechBar logos legible, toggle persists across reload, no FOUC for light users, `/solar` unaffected.
- Confirm no `localStorage`/`data-theme` console errors and that `app.js` no longer throws (if hardening applied).

---

## 10. Verified facts (from adversarial audit, 2026-06-10)
1. **Tailwind v4 `@theme inline` + opacity modifier flips at runtime** — confirmed by compiling against `tailwindcss@4.3.0`. Must remove the hardcoded `--color-ink:#ffffff` from the plain `@theme` block; keep `--tl-*` as plain `:root` rules (not inside `@theme`).
2. **Page-bg via `html[data-theme=light] body { background: var(--tl-page) }` as I first proposed = FALSE** — var undefined, `data-theme` never set, and light mode loads `light-mode.css` (which also paints body black at line 58), not `style.css`. Corrected by §2.3 + §2.4 + deleting `light-mode.css`. No `!important` anywhere in `style.css`, so `html body` (0,0,0,2) wins.
3. **Hero canvas is theme-blind / permanently dark** — `ScreenAnimation.isLightMode` can never flip (legacy `app.js:525` TypeError aborts theme init). Keeping it dark is zero-effort; the surrounding hero *frame* is the real work. Avoid re-activating the legacy path (§6).
4. **`/solar` is isolated** — imports only `solar.css` with its own tokens; never loads `globals.css`; bootstrap early-returns for it.
5. **Assets** — `logo-light.png` exists and is a viable drop-in; TechBar needs one filter change (`grayscale(1) invert(1)`); Footer has no assets.
