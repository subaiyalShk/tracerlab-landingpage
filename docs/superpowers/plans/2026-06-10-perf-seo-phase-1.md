# Perf/SEO Phase 1 — SEO + Dead-Weight Removal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the zero-interactivity-risk slice of the SEO+perf overhaul for www.tracerlabs.io — robots/sitemap/JSON-LD/OG-image/metadata fixes + remove the unused AOS render-blocker + image-ready `next.config` — with **no change to any JS, fonts, images, or visible UI**.

**Architecture:** The site is already 100% server-rendered (RSC, statically prerendered). This phase only adds metadata/route files (App-Router file conventions: `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`), a static JSON-LD `<script>`, metadata corrections, and deletes dead third-party scripts. Nothing touches the client islands (ThemeToggle, VoiceWidget, ProjectVideo) or the hero canvas.

**Tech Stack:** Next.js 16.2.6 App Router, React 19, `next/og` `ImageResponse`, `MetadataRoute` types.

**Spec:** `docs/superpowers/specs/2026-06-10-perf-seo-optimization-design.md` (Phase 1 section).

**Branch:** `perf/phase-1-seo` (already created; spec already committed here).

> **No unit-test runner exists** (`package.json` has only `dev`/`build`/`start`/`lint`). Per-task verification = `npx eslint <file>` (fast TS/JSX gate). The **real gate is the final `npm run build`** (Task 10) which statically generates `/robots.txt`, `/sitemap.xml`, and the OG images and fails on any type/route error. **Never run `npm run build` while `next dev` is running** (shared `.next/` — stop dev first). The two `video/src/scenes/*` ESLint errors are PRE-EXISTING and unrelated — scope lint to the file you touched.

---

## File Structure

**Create:**
- `app/robots.ts` — robots.txt route (allow all + sitemap pointer).
- `app/sitemap.ts` — sitemap.xml route (`/` + `/solar`).
- `app/components/JsonLd.tsx` — server component emitting Organization+WebSite+Service JSON-LD.
- `app/(tracerlabs)/opengraph-image.tsx` — dynamic 1200×630 OG card (home).
- `app/solar/opengraph-image.tsx` — dynamic 1200×630 OG card (funnel).

**Modify:**
- `next.config.ts` — image formats/remotePatterns/sizes + compress.
- `app/layout.tsx` — add `viewport` export + `metadataBase`; remove AOS (CSS line + JS `<Script>`).
- `app/(tracerlabs)/layout.tsx` — metadata: title.template, canonical, siteName/locale, image dims, remove hardcoded OG `images` (dynamic file supersedes).
- `app/solar/layout.tsx` — metadata: canonical, twitter card, siteName.
- `app/(tracerlabs)/page.tsx` — render `<JsonLd/>`.

---

## Task 1: `next.config.ts` — image + compression config

**Files:** Modify `next.config.ts`

- [ ] **Step 1: Replace the file contents**

Replace all of `next.config.ts` with:
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
(No `localPatterns` needed — no local image `src` uses a query string. This only *enables* `next/image`; nothing uses it until Phase 2, so this is inert/safe now.)

- [ ] **Step 2: Lint**

Run: `npx eslint next.config.ts`
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add next.config.ts
git commit -m "perf(config): enable AVIF/WebP image optimization + Unsplash remotePatterns + compress"
```

---

## Task 2: Remove AOS from `app/layout.tsx`

**Files:** Modify `app/layout.tsx`

AOS (~41KB CSS+JS, render-blocking, `beforeInteractive`) is completely unused (zero `data-aos`, never `.init()`-ed). Pure deletion.

- [ ] **Step 1: Delete the AOS CSS injection from the css-bootstrap script**

In the inline `css-bootstrap` script, delete this exact line:
```js
  css('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css');
```
(Leave the `css('/style.css', 'theme-stylesheet')` line and the rest of the script intact.)

- [ ] **Step 2: Delete the AOS JS `<Script>` tag**

Replace this exact block:
```tsx
        {/* AOS + the legacy app. app.js self-gates its initialization off /solar. */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"
          strategy="beforeInteractive"
        />
        <Script src="/legacy/app.js" strategy="beforeInteractive" />
```
with (AOS gone; legacy app.js stays beforeInteractive — that's Phase 3's job):
```tsx
        {/* The legacy app. app.js self-gates its initialization off /solar. */}
        <Script src="/legacy/app.js" strategy="beforeInteractive" />
```

- [ ] **Step 3: Verify no AOS references remain**

Run: `grep -rn "aos" app/ public/legacy/app.js | grep -iv "across\|chaos"`
Expected: matches only inside `public/legacy/app.js` (the dead `initializeAOS` method — removed in Phase 3); **zero** matches in `app/`.

- [ ] **Step 4: Lint**

Run: `npx eslint app/layout.tsx`
Expected: no errors.

- [ ] **Step 5: Commit**
```bash
git add app/layout.tsx
git commit -m "perf: remove unused AOS (render-blocking CSS+JS, never initialized)"
```

---

## Task 3: Root `viewport` + `metadataBase` in `app/layout.tsx`

**Files:** Modify `app/layout.tsx`

- [ ] **Step 1: Add `Viewport` to the type import + add `metadataBase` to root metadata + add a `viewport` export**

Change the top import line:
```tsx
import type { Metadata } from "next";
```
to:
```tsx
import type { Metadata, Viewport } from "next";
```

Replace the existing root `metadata` export:
```tsx
export const metadata: Metadata = {
  title: "Tracerlabs",
  description: "AI products, web & mobile apps, and growth systems by Tracerlabs.",
};
```
with (adds `metadataBase` so any future route inherits it, plus a `viewport` export — `viewport.themeColor` replaces the deprecated `metadata.themeColor`; `#000000` matches the default-dark first paint):
```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://tracerlabs.io"),
  title: "Tracerlabs",
  description: "AI products, web & mobile apps, and growth systems by Tracerlabs.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark light",
};
```

- [ ] **Step 2: Lint**

Run: `npx eslint app/layout.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add app/layout.tsx
git commit -m "seo: root metadataBase + viewport export (themeColor/colorScheme)"
```

---

## Task 4: `app/(tracerlabs)/layout.tsx` metadata — OG fix, title template, canonical

**Files:** Modify `app/(tracerlabs)/layout.tsx`

Fixes the **live OG-domain bug** (`tracerlabs.ai` → resolves via `metadataBase`), adds title template + self-canonical + richer OG. The hardcoded `images` arrays are removed because the dynamic `opengraph-image.tsx` (Task 9) supplies the image via the file convention (which takes precedence) — avoiding duplicate `og:image` tags.

- [ ] **Step 1: Replace the `metadata` export**

Replace the entire `export const metadata: Metadata = { … };` block (lines 6–37) with:
```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://tracerlabs.io"),
  title: {
    default: "Tracerlabs | AI Development Agency",
    template: "%s | Tracerlabs",
  },
  description:
    "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
  keywords: [
    "AI development",
    "web development",
    "mobile apps",
    "business automation",
    "digital transformation",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/assets/favicon.ico",
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Tracerlabs | AI Development Agency",
    description:
      "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracerlabs | AI Development Agency",
    description:
      "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
  },
};
```
(The `openGraph.images` / `twitter.images` keys are intentionally gone — `app/(tracerlabs)/opengraph-image.tsx` from Task 9 emits `og:image` + `twitter:image` automatically. Twitter falls back to `og:image` when `twitter.images` is absent and `card` is set.)

- [ ] **Step 2: Lint**

Run: `npx eslint "app/(tracerlabs)/layout.tsx"`
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add "app/(tracerlabs)/layout.tsx"
git commit -m "seo: fix OG domain, add title.template + canonical + og siteName/locale"
```

---

## Task 5: `app/solar/layout.tsx` metadata — canonical, twitter, siteName

**Files:** Modify `app/solar/layout.tsx`

- [ ] **Step 1: Replace the `metadata` export**

Replace the entire `export const metadata: Metadata = { … };` block with:
```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://tracerlabs.io"),
  title: "Solar Appointments on Autopilot — Without a Door-to-Door Team | Tracerlabs",
  description:
    "We build solar companies a high-converting funnel and an AI agent that books qualified homeowners straight onto your calendar — the same system filling Southern Energy's pipeline.",
  alternates: { canonical: "/solar" },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/solar",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Solar Appointments on Autopilot — Without a Door-to-Door Team",
    description:
      "A done-for-you funnel + AI booking agent that fills your calendar with qualified solar appointments.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Appointments on Autopilot — Without a Door-to-Door Team",
    description:
      "A done-for-you funnel + AI booking agent that fills your calendar with qualified solar appointments.",
  },
  robots: { index: true, follow: true },
};
```
(Adds canonical + twitter card + OG siteName/url; OG image comes from `app/solar/opengraph-image.tsx` in Task 9. The `next/font` imports + `SolarLayout` component below are unchanged.)

- [ ] **Step 2: Lint**

Run: `npx eslint app/solar/layout.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add app/solar/layout.tsx
git commit -m "seo(solar): canonical + twitter card + og siteName/url"
```

---

## Task 6: `app/robots.ts`

**Files:** Create `app/robots.ts`

- [ ] **Step 1: Create the file**
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

- [ ] **Step 2: Lint**

Run: `npx eslint app/robots.ts`
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add app/robots.ts
git commit -m "seo: add robots.ts (allow all + sitemap pointer)"
```

---

## Task 7: `app/sitemap.ts`

**Files:** Create `app/sitemap.ts`

- [ ] **Step 1: Create the file**
```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tracerlabs.io", changeFrequency: "weekly", priority: 1 },
    { url: "https://tracerlabs.io/solar", changeFrequency: "monthly", priority: 0.8 },
  ];
}
```
(`lastModified` omitted deliberately — avoids non-deterministic build churn; a static sitemap without it is valid.)

- [ ] **Step 2: Lint**

Run: `npx eslint app/sitemap.ts`
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add app/sitemap.ts
git commit -m "seo: add sitemap.ts (/ + /solar)"
```

---

## Task 8: `app/components/JsonLd.tsx` + render in home page

**Files:** Create `app/components/JsonLd.tsx`; Modify `app/(tracerlabs)/page.tsx`

- [ ] **Step 1: Create the JSON-LD server component**

Create `app/components/JsonLd.tsx`:
```tsx
// Server component: emits Organization (ProfessionalService) + WebSite + Service JSON-LD
// for the home page. Pure static data, no interactivity. The `<` escape blocks XSS in the
// JSON string. (sameAs social URLs intentionally omitted — add real profile URLs when known.)
const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://tracerlabs.io/#org",
      name: "Tracerlabs",
      url: "https://tracerlabs.io",
      logo: "https://tracerlabs.io/assets/logo-light.png",
      image: "https://tracerlabs.io/assets/Tracer.png",
      description:
        "AI development studio building voice agents, web & mobile apps, and AI-driven growth systems for businesses.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "jarvis@tracerlabs.io",
        url: "https://tracerlabs.io/#contact",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://tracerlabs.io/#website",
      url: "https://tracerlabs.io",
      name: "Tracerlabs",
      publisher: { "@id": "https://tracerlabs.io/#org" },
    },
    {
      "@type": "Service",
      serviceType: "AI software development",
      provider: { "@id": "https://tracerlabs.io/#org" },
      areaServed: "US",
      description:
        "Voice agents, custom web & mobile applications, and AI sales automation.",
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(GRAPH).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```
(Logo uses `logo-light.png` — the black-wordmark variant that's legible on Google's white knowledge panel.)

- [ ] **Step 2: Render it in the home page**

In `app/(tracerlabs)/page.tsx`, add the import after the existing imports:
```tsx
import JsonLd from "../components/JsonLd";
```
and add `<JsonLd />` as the first child inside the fragment — change:
```tsx
  return (
    <>
      <Hero />
```
to:
```tsx
  return (
    <>
      <JsonLd />
      <Hero />
```

- [ ] **Step 3: Lint**

Run: `npx eslint app/components/JsonLd.tsx "app/(tracerlabs)/page.tsx"`
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add app/components/JsonLd.tsx "app/(tracerlabs)/page.tsx"
git commit -m "seo: Organization/WebSite/Service JSON-LD on the home page"
```

---

## Task 9: Dynamic OG images (`opengraph-image.tsx` for both routes)

**Files:** Create `app/(tracerlabs)/opengraph-image.tsx`, `app/solar/opengraph-image.tsx`

`next/og` `ImageResponse`, 1200×630, brand-dark, Duborics loaded from disk. satori (the engine) supports `.ttf` (not `.woff2`) and **flexbox only** — the JSX below obeys both.

- [ ] **Step 1: Create the home OG image**

Create `app/(tracerlabs)/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Tracerlabs — we build the AI that runs your business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const duborics = await readFile(
    join(process.cwd(), "public/fonts/DuboricsRegular.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Duborics",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#8a8a93" }}>
          TRACERLABS · AI DEVELOPMENT STUDIO
        </div>
        <div style={{ display: "flex", fontSize: 82, lineHeight: 1.05, marginTop: 28 }}>
          We build the AI that runs your business.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Duborics", data: duborics, style: "normal", weight: 400 }],
    },
  );
}
```

- [ ] **Step 2: Create the solar OG image**

Create `app/solar/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Solar appointments on autopilot — Tracerlabs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const duborics = await readFile(
    join(process.cwd(), "public/fonts/DuboricsRegular.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 90,
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Duborics",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#8a8a93" }}>
          TRACERLABS · FOR SOLAR COMPANIES
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, marginTop: 28 }}>
          Solar appointments on autopilot.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Duborics", data: duborics, style: "normal", weight: 400 }],
    },
  );
}
```

- [ ] **Step 3: Lint**

Run: `npx eslint "app/(tracerlabs)/opengraph-image.tsx" "app/solar/opengraph-image.tsx"`
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add "app/(tracerlabs)/opengraph-image.tsx" "app/solar/opengraph-image.tsx"
git commit -m "seo: dynamic 1200x630 OG images via next/og (home + solar)"
```

> **Contingency (if Task 10's build fails on these files):** satori can be finicky. If the build errors point at an `opengraph-image.tsx`, delete both files and instead add `images: ["/assets/Tracer.png"]` back into `openGraph` (and `twitter`) in `app/(tracerlabs)/layout.tsx` + `app/solar/layout.tsx` (relative path → resolves via `metadataBase`, fixing the `.ai` bug with the existing square asset). Re-run the build. Report this fallback in the task summary.

---

## Task 10: Build + verify the whole phase

**Files:** none (verification only)

- [ ] **Step 1: Stop any dev server, then build**

Stop `next dev` if running (shared `.next/`). Then:
Run: `npm run build`
Expected: `✓ Compiled successfully`, TypeScript passes, and the route list now includes `○ /robots.txt`, `○ /sitemap.xml`, `○ /opengraph-image` and `○ /solar/opengraph-image` (or `/icon`/image entries) alongside `/` and `/solar`. No errors.

- [ ] **Step 2: Verify the generated routes + metadata (start the prod server, curl it)**

Run: `npm run start` in the background (serves the build on port 3000 by default), then:
```bash
curl -s localhost:3000/robots.txt
curl -s localhost:3000/sitemap.xml | head -20
curl -s localhost:3000/ | grep -o '<script type="application/ld+json"[^>]*>[^<]*' | head -1
curl -s localhost:3000/ | grep -oiE 'og:image[^>]*|twitter:card[^>]*|rel="canonical"[^>]*|name="theme-color"[^>]*' | head
curl -s localhost:3000/ | grep -oi 'aos' | head   # expect: NO output (AOS gone)
```
Expected:
- `/robots.txt` → `User-Agent: *`, `Allow: /`, `Sitemap: https://tracerlabs.io/sitemap.xml`.
- `/sitemap.xml` → XML listing `https://tracerlabs.io` and `https://tracerlabs.io/solar`.
- Home HTML contains a `<script type="application/ld+json">` block.
- `og:image` points at a `tracerlabs.io/.../opengraph-image` URL (NOT `tracerlabs.ai`); `twitter:card` = `summary_large_image`; a `<link rel="canonical">`; a `theme-color` meta.
- **No `aos` string** in the home HTML.
- Stop the prod server when done.

- [ ] **Step 3: Validate JSON-LD + OG image visually (optional but recommended)**

- Paste the home page's JSON-LD into Google's Rich Results Test (search.google.com/test/rich-results) — expect Organization + WebSite detected, no errors.
- Open `localhost:3000/opengraph-image` in a browser — expect the 1200×630 dark branded card with the Duborics headline.

- [ ] **Step 4: Confirm zero behavior change**

Start `PORT=3100 npm run dev`, load `http://localhost:3100/`, and confirm the site looks and behaves **identically** to before (dark theme, hero canvas animating, nav, voice orb, toggle) — Phase 1 made no visual/JS change. Check the console for no new errors.

---

## Done (Phase 1)

Branch `perf/phase-1-seo` is ready to merge → push `main` → Vercel prod deploy. After deploy: submit the sitemap in Google Search Console and re-share a link to confirm the OG card renders. Then proceed to the Phase 2 plan (fonts → next/font, style.css slim, next/image).
