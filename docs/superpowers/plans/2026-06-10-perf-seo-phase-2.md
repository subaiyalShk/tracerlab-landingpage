# Perf/SEO Phase 2 — Fonts + CSS slim + Images — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Kill the render-blocking font path and oversized images on www.tracerlabs.io — migrate the main site to `next/font`, slim the 46KB legacy `style.css` to its live base, and serve right-sized/AVIF-WebP images — with **no visual or interactivity regression** (verified by build + both-theme browser QA).

**Architecture:** `next/font/local` (Duborics) + `next/font/google` (Plus Jakarta) self-host + preload the fonts, wired to the existing `--font-display`/`--font-body` Tailwind tokens; the Google-Fonts `@import` + legacy `@font-face` + dead rules are stripped from `style.css` (kept tiny + still injected pre-paint). Oversized Nav logo PNGs are downscaled; TechBar/Projects/Hero-avatar images move to `next/image`.

**Tech Stack:** Next 16, `next/font`, `next/image`, `sips` (macOS image resize).

**Spec:** `docs/superpowers/specs/2026-06-10-perf-seo-optimization-design.md` (Phase 2). **Branch:** `perf/phase-2-fonts-images`.

> No test runner. Per-task: `npx eslint <file>`. **Real gate: `npm run build` + browser QA in BOTH themes** (Task 7). Stop `next dev` before building. The 2 `video/scenes` lint errors are pre-existing.

---

## Task 1: `next/font` setup in `app/(tracerlabs)/layout.tsx`

**Files:** Modify `app/(tracerlabs)/layout.tsx`

The layout currently returns `children` bare. Add the fonts and a wrapper that carries their CSS variables.

- [ ] **Step 1: Add font imports + a wrapping div**

At the top of `app/(tracerlabs)/layout.tsx`, after the existing `import "../globals.css";` line, add:
```tsx
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const duborics = localFont({
  src: "../../public/fonts/DuboricsRegular.woff2",
  variable: "--font-duborics",
  display: "swap",
  weight: "400",
});
```
Change the component to wrap `children` in a div carrying both variable classes:
```tsx
export default function TracerlabsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${jakarta.variable} ${duborics.variable}`}>{children}</div>;
}
```
(A plain `display:block` wrapper does not break the sticky nav or the section layout.)

- [ ] **Step 2: Wire the Tailwind font tokens to the next/font vars**

In `app/globals.css`, in the plain `@theme` block, replace these two lines:
```css
  --font-display: "Duborics", "Plus Jakarta Sans", sans-serif;
  --font-body: "Plus Jakarta Sans", system-ui, sans-serif;
```
with (now reference the next/font-injected vars, with safe fallbacks):
```css
  --font-display: var(--font-duborics), "Plus Jakarta Sans", sans-serif;
  --font-body: var(--font-jakarta), system-ui, sans-serif;
```
Also update the stale comment above them from `/* Fonts already loaded by public/style.css … */` to `/* Fonts self-hosted via next/font (app/(tracerlabs)/layout.tsx); vars injected on the wrapper. */`.

- [ ] **Step 3: Lint**

Run: `npx eslint "app/(tracerlabs)/layout.tsx"`
Expected: no errors. (Do NOT build yet — `style.css` still has the old `@font-face`/`@import`; Task 2 removes them. Building between would double-load Duborics but not break.)

- [ ] **Step 4: Commit**
```bash
git add "app/(tracerlabs)/layout.tsx" app/globals.css
git commit -m "perf(fonts): self-host Duborics + Plus Jakarta via next/font, wire to --font-* tokens"
```

---

## Task 2: Slim `public/style.css` to its live base

**Files:** Modify `public/style.css`

The file is 2,368 lines / 46KB. Lines 1–92 are the global base; **everything from ~line 93 onward targets removed static-HTML markup** (`#main-nav`, `#hero`, `.service-card`, `#services`, `#projects`, `#contact`, `.modal`, `.stepper`, `.testimonial`, `.tech-scroll`, `.theme-toggle`, `.btn`, etc.) — the React site uses `#tl-*` ids + Tailwind, so none of it matches. The base is itself mostly redundant with `globals.css` (scoped `#tl-*` resets + heading-color isolation + `html body` page background) and `next/font` (Task 1).

- [ ] **Step 1: Replace the ENTIRE file with the minimal live base**

Replace ALL of `public/style.css` with:
```css
/* Slimmed legacy base. The old static-HTML site's 2,368-line stylesheet is gone — every
   id/class rule (#main-nav, #hero, .service-card, .modal, .stepper, .testimonial, etc.)
   targeted markup that no longer exists (the site is fully React under #tl-* + Tailwind).
   Fonts moved to next/font; the page background, scoped resets, and heading colors live in
   app/globals.css. All that must remain here is the universal box-model reset (Tailwind runs
   with NO preflight). Still injected pre-paint by the css-bootstrap script in app/layout.tsx. */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

- [ ] **Step 2: Confirm nothing else references removed style.css rules**

Run: `grep -rn "service-card\|main-nav\|stepper\|tech-scroll\|theme-toggle\b\|--primary-color\|--dark-bg" app/ public/legacy/app.js`
Expected: matches only inside `public/legacy/app.js` (legacy/dead) — **zero** in `app/`. (If any `app/` match appears, STOP and report — a React component unexpectedly depends on a legacy class.)

- [ ] **Step 3: Lint (no eslint for css; just confirm file saved)**

Run: `wc -l public/style.css`
Expected: ~14 lines.

- [ ] **Step 4: Commit**
```bash
git add public/style.css
git commit -m "perf(css): slim legacy style.css 46KB->~0.3KB (drop dead rules, @import, @font-face, body transition)"
```

---

## Task 3: Downscale the oversized Nav logo PNGs

**Files:** Modify `public/assets/logo-dark.png`, `public/assets/logo-light.png` (binary resize, no markup change)

The Nav renders the logos at ~24px but ships `logo-light.png` at **1080×1080 / 92KB** and `logo-dark.png` at 500×500 / 19KB. The Nav markup deliberately over-sizes + crops them (`h-[150px]` in an `h-16 overflow-hidden` box), so `next/image` is a poor fit — instead resize the source to 300×300 (ample for the 150px@2x crop). Markup unchanged → zero risk.

- [ ] **Step 1: Resize both PNGs to 300×300 in place**
```bash
cd public/assets
sips -Z 300 logo-light.png
sips -Z 300 logo-dark.png
ls -la logo-light.png logo-dark.png
```
Expected: both now ~300px on the long edge, file sizes drop sharply (logo-light ~92KB → ~12–20KB).

- [ ] **Step 2: Visually confirm the crop still works**

(Deferred to Task 7's browser QA — the `h-[150px]` crop math is unchanged since the images stay square; 300px is sharp at 150px@2x.)

- [ ] **Step 3: Commit**
```bash
git add public/assets/logo-light.png public/assets/logo-dark.png
git commit -m "perf(images): downscale nav logo PNGs 1080/500 -> 300px (rendered at ~24px)"
```

---

## Task 4: TechBar tech logos → `next/image`

**Files:** Modify `app/components/TechBar.tsx`

The 9 marquee logos (rendered twice = 18 `<img>`) include CrewAI 215KB, Ethereum 111KB, Gemini 29KB — all displayed at ~24–28px. Read the current file first; it maps `[...LOGOS, ...LOGOS]` to `<img className="h-6 w-auto shrink-0 opacity-40 ... sm:h-7" style={{ filter: "var(--tl-logo-filter)" }} loading="lazy" />`.

- [ ] **Step 1: Swap `<img>` → `next/image` `<Image>`**

Add `import Image from "next/image";` at the top. Replace the `<img …>` with:
```tsx
<Image
  key={i}
  src={l.src}
  alt={l.alt}
  width={120}
  height={32}
  className="h-6 w-auto shrink-0 opacity-40 transition-opacity duration-300 hover:opacity-70 sm:h-7"
  style={{ filter: "var(--tl-logo-filter)" }}
  loading="lazy"
/>
```
(width/height are intrinsic-ratio hints — the `h-6 w-auto` classes control rendered size; `next/image` serves a right-sized AVIF/WebP. Keep the existing `eslint-disable @next/next/no-img-element` comment removed if present — `next/image` doesn't need it. Remove the now-unneeded eslint-disable line above the old `<img>` if there is one.)

- [ ] **Step 2: Lint**

Run: `npx eslint app/components/TechBar.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add app/components/TechBar.tsx
git commit -m "perf(images): TechBar logos -> next/image (AVIF/WebP, right-sized)"
```

---

## Task 5: Projects image + Hero avatars → `next/image`

**Files:** Modify `app/components/Projects.tsx`, `app/components/Hero.tsx`

- [ ] **Step 1: Projects `project2.png` → `<Image>`**

Read `app/components/Projects.tsx`. Find the `kind === "image"` branch (the `<img src={media.src} alt={media.alt} loading="lazy" className="absolute inset-0 h-full w-full ...object-contain/object-cover" />`). Add `import Image from "next/image";` at the top and replace that `<img>` with a `fill`-mode `<Image>` (it sits in a `relative`/`absolute inset-0` frame):
```tsx
<Image
  src={media.src}
  alt={media.alt}
  fill
  sizes="(max-width: 1024px) 100vw, 20rem"
  className={`object-${media.fit === "contain" ? "contain p-6" : "cover"}`}
  loading="lazy"
/>
```
(Remove the old `eslint-disable @next/next/no-img-element` comment above it if present. The parent already establishes a positioning context — verify it has `position: relative`/`absolute`; the Frame's inner div is `absolute inset-px overflow-hidden`, which is a valid `fill` ancestor.)

- [ ] **Step 2: Hero avatars (remote Unsplash background-image) → `<Image>`**

Read `app/components/Hero.tsx`. The 3 avatars render as `<span className="h-9 w-9 rounded-full border-2 border-page bg-cover bg-center ring-1 ring-ink/15" style={{ backgroundImage: url(...), marginLeft: ... }} />`. Convert each to a wrapper `<span>` (keeps the ring/border/overlap) containing a `next/image` `<Image>` (makes the avatar a real, crawlable `<img>`). Add `import Image from "next/image";`. Replace the avatars `.map(...)` body with:
```tsx
<span
  key={src}
  className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-page ring-1 ring-ink/15"
  style={{ marginLeft: i === 0 ? 0 : "-10px" }}
>
  <Image src={src} alt="" fill sizes="36px" className="object-cover" />
</span>
```
(`alt=""` — decorative avatars. `remotePatterns` for `images.unsplash.com` was added to `next.config.ts` in Phase 1, so `next/image` will optimize the Unsplash URLs. The `?w=64&h=64` query in the URLs is on a REMOTE src — allowed; `localPatterns` only governs local paths.)

- [ ] **Step 3: Lint**

Run: `npx eslint app/components/Projects.tsx app/components/Hero.tsx`
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add app/components/Projects.tsx app/components/Hero.tsx
git commit -m "perf(images): Projects image + Hero avatars -> next/image (avatars now crawlable)"
```

---

## Task 6: (skipped — folded into Task 5)

---

## Task 7: Build + full visual QA in BOTH themes

**Files:** none (verification only)

- [ ] **Step 1: Build**

Stop `next dev`. Run: `npm run build`
Expected: `✓ Compiled successfully`, no type/route errors. Watch for any `next/image` config warnings (none expected — formats/remotePatterns set in Phase 1).

- [ ] **Step 2: Visual QA both themes (the real gate)**

Start `PORT=3100 npm run dev`, load `http://localhost:3100/`, toggle dark↔light, and confirm:
- [ ] **Fonts render correctly** — headings in **Duborics**, body in **Plus Jakarta** (NOT system serif/Inter); no FOUT flash on reload; no layout shift on load.
- [ ] **No Inter/serif leak** anywhere (the `*{font-family:Inter}` rule is gone — globals + next/font must cover all text). Check Nav links, hero copy, services, projects, cta, footer.
- [ ] **Nav logos** render crisply (resized 300px, still cropped/centered correctly), and the **theme logo-swap** still works (dark↔light).
- [ ] **TechBar** logos render and the marquee still animates; logos legible in both themes (filter intact).
- [ ] **Projects** media images render (object-contain/cover), device frames intact.
- [ ] **Hero avatars** render (overlapping circles with ring/border) and are now `<img>` (inspect DOM).
- [ ] **Page background** correct in both themes; **no `body` transition glitch** on theme flip (it's gone — flip is instant).
- [ ] Interactivity intact: theme toggle, hero canvas animating, voice orb, video autoplay-in-view.
- [ ] Network panel: **no `fonts.googleapis.com` request**; images served as `.avif`/`.webp` via `/_next/image`.
- [ ] Console: no errors.

- [ ] **Step 3: Confirm the slimmed CSS didn't break layout**

Specifically eyeball spacing/margins across all sections (the universal reset is all that remains of style.css). If anything looks unspaced/overlapping, the `globals.css` scoped resets should still cover `#tl-*` — report any gap.

---

## Done (Phase 2)

Branch `perf/phase-2-fonts-images` → after QA passes, merge to `main` → push (deploy). Verify fonts/images live, then Phase 3 (canvas defer/gate + Hotjar).
