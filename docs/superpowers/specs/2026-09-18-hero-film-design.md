# Hero film — "Attention in, money out"

**Date:** 2026-09-18
**Status:** approved design — shipped on feat/hero-film (PR #1), 2026-09-21; see "Drift" below

## Goal

Replace the hero's static backdrop with a full-bleed, silent, looping film that *shows* the
headline's claim ("We build the machine that grows your business"): the world's attention on
phones is plumbed through a machine, and revenue comes out the other side. The headline,
subhead, CTAs and proof line stay live HTML on top; the film is a backdrop that earns the copy.

Decisions taken during brainstorming (2026-09-17/18):

| decision | choice |
|---|---|
| Hero = video? | Yes — the whole hero is the film, full-bleed |
| Text layer | Live HTML over the film (SEO, LCP, typewriter, clickable CTAs, light/dark preserved) |
| Story | One unbroken camera move: world → people → phone → reveal the machine → mechanism → output → flywheel loop |
| Style | Brand motion graphics, 2.5D, entirely Remotion in the site's own tokens |
| "Money out" | Revenue in the machine's language: rising revenue line, "Booked" chips, `$` odometer — no cash imagery |
| Mobile | Separate 9:16 composition (re-layout, same scenes) |
| Sound | None. The hero is muted with no unmute; card reels below keep click-to-play sound |
| Light mode (added 2026-09-21) | Same film in the page's light palette (`#eef0f4` bg, `#0b0d12` ink, white surfaces); loads in both themes; toggle swaps the file |

## Non-goals

- No captions, narration, or readable numbers inside the film (it plays under text).
- No live-action / AI-generated footage.
- No changes to copy, CTAs, or the sections below the hero.
- ~~Light mode keeps today's hero (grid floor); the film is dark-theme only.~~ Superseded 2026-09-21: the film ships in both themes (see Drift).

## 1. The film

### Format
- 30 s seamless loop, 30 fps, silent.
- Compositions in the existing `video/` Remotion project: `HeroLoop` 1920×1080 and
  `HeroLoopMobile` 1080×1920 — same scenes, re-laid-out via the `usePortrait()` pattern
  already used by `ProblemMobile`.
- Delivered at 720p (1280×720 / 720×1280): flat brand graphics on near-black compress well
  under budget; 1080p is not worth the bytes.

### Legibility rule (shapes every scene)
On desktop the headline block covers nearly the whole vertical center, so the film's action
lives in a **frame**:
- Upper band + left third: map, people, phone beats.
- Bottom band: **the machine is the floor** — a horizontal pipeline, intake left → machine
  center → output right, where the CSS grid floor sits today.
- Center column: a soft radial scrim (a gradient `div`, never a CSS filter) sits between film
  and text.
- Portrait: map/people/phone beats in the top band; pipeline runs across the bottom band.

### Grade
Brand blue (`#056AFC` family) on page-black throughout. Pink (`#e7028d`) appears **exactly
once** (the booked signal). Warmth only on the output beat. Blacks match `--tl-page` so the
film has no visible edge and dissolves into the page.

### Beats — one unbroken camera move

| t (s) | beat | scene |
|---|---|---|
| 0–4 | **World** | Dot-matrix world map (Robinson-ish projection, ~20k dots, pitch ≈ the hero's existing 24px dot grid) breathing in blue. Opens from black. |
| 4–8 | **People** | Camera pushes into a cluster in the **left** third (attention on the left, revenue on the right — the film reads left→right and the threads fall straight into the intake ports without crossing the center column); dots resolve into silhouettes, each lit from below by a phone-glow rectangle. |
| 8–13 | **Attention** | Push into one tilted phone (left third): a stylized *generic* feed scrolls — cards, hearts, a reel — with the Instagram mark in a corner; a thumb-flick swaps to a Facebook-marked feed. Stylized UI, never a clone. |
| 13–18 | **Reveal** | Pull back out: the phone shrinks into one of hundreds of glowing threads; threads become circuit traces converging down into the floor pipeline. Monochrome platform marks (Instagram, Facebook, Google, ChatGPT) sit on the traces as intake ports. The film's key shot. |
| 18–22 | **Mechanism** | Hold on the machine: a chamfered bevel block, internal pulses moving through four unlabeled chambers (the four Services stages). One signal turns pink mid-machine — the only pink. |
| 22–26 | **Output** | Right side: pulses exit and stack into a rising revenue line; "Booked" chips land; a `$` odometer rolls and **never settles on a figure** (decorative, not a claim — see copy rules in CLAUDE.md). |
| 26–30 | **Flywheel** | Output pulses arc up and back into the map's dots; camera drifts out to the full world; the last 15 frames dip to black and frame 0 fades in from black over 12 frames (a 0.9 s breath — required because the file's first frame must be black for LCP *and* the file loops). Revenue → ads → attention. |

## 2. Production (Remotion)

Location: `video/src/hero/`.

- `HeroLoop.tsx` — orchestrator. One global camera transform (scale + translate over time)
  drives the zoom/pan; scenes are children placed in a shared world coordinate space so the
  zoom is real camera motion, not cuts.
- One file per beat: `World.tsx`, `People.tsx`, `Phone.tsx`, `Reveal.tsx`, `Machine.tsx`,
  `Output.tsx`.
- `layout.ts` — landscape/portrait frame rules (which bands/thirds each beat may occupy).
- `land.json` — packed lon/lat land mask generated once by `scripts/gen-land-mask.mjs` so the
  dot map is real geography, not a texture.
- Platform marks: stylized monochrome inline SVG components in `video/src/hero/marks.tsx`
  (Instagram, Facebook, Google, ChatGPT) — the site never displays them, only the film does.
  Same monochrome treatment as the TechBar marquee.
- Both compositions registered in `video/src/Root.tsx`.
- Verification stills at each beat boundary (0/4/8/13/18/22/26/30 s) via `remotion still`,
  reviewed by the owner **before** any full render (matches the existing `boundary-*.png`
  habit in `video/out/`).
- Render → ffmpeg H.264, crf ~28, `+faststart`, no audio track →
  `public/hero/loop-16x9.mp4` and `public/hero/loop-9x16.mp4`. Budget **≤ 2.5 MB each**.
  WebM/AV1 siblings only if H.264 exceeds budget. No poster image file.

## 3. Hero integration

New client component `app/components/HeroFilm.tsx`, mounted inside `Hero` between the grid
floor layers and the copy. Renders:
- one `<video muted playsInline loop preload="none">` with **no `src` and no `poster`**;
- the center scrim `div` (radial gradient, transform/opacity only).

The existing grid floor, horizon, pulses and dot-grid overlay are untouched — they are the
poster/fallback state (no-JS, reduced motion, Save-Data, light theme, load failure).

### Loading sequence
1. On mount, bail out entirely (no network request ever) if any of:
   `prefers-reduced-motion: reduce`, `navigator.connection?.saveData`,
   `document.documentElement.dataset.theme === "light"`.
2. `requestIdleCallback` (800 ms `setTimeout` fallback) → choose `loop-9x16.mp4` if
   `matchMedia("(orientation: portrait)")` matches, else `loop-16x9.mp4`; set `src`; `play()`.
3. On the `playing` event → set `data-film="on"` on `#tl-hero`. CSS: video opacity 0→1 over
   ~1.2 s; `.nt-gridfloor` / `.nt-horizon` fade to 0 (so CSS pulses don't double the film's).
   Transform/opacity only; the video is a single compositor layer; no filters.
4. Orientation change → swap `src` and resume (both files cached by then).
5. Theme flips to light (observe `data-theme` via `MutationObserver`) → pause, clear
   `data-film` (fade out). Flips back to dark → resume.
6. Courtesy `IntersectionObserver`: pause when the hero is fully off-screen, resume when it
   returns (same pattern as `ProjectVideo`).

### LCP safety (revised 2026-09-21 after measurement)
Chrome (v116+) counts a `<video>`'s first frame as an LCP candidate and its low-entropy
exclusion does not save a black first frame (the check uses the whole file's bytes); the
opacity 0→1 fade makes the element a candidate at fade start. LCP is finalized at the first
user input, so: **touch devices attach the film only after the first scroll/tap** (measured:
mobile LCP element = `<h1>`, 92 / 3.2 s on the preview vs prod 86 / 3.7 s). **Desktop keeps the
post-idle attach** — Lighthouse lab reports the `<h1>` (99 / 0.7 s), but a desktop visitor who
neither scrolls nor clicks before the fade-in (~1.5–3 s) will have the film recorded as LCP in
CrUX. Accepted: that value still lands inside "good" (<2.5 s) on typical desktop connections,
and a universal input gate would hide the film from non-scrolling desktop visitors. Revisit if
CrUX desktop LCP degrades.

### Unchanged
Copy, CTAs, `TypedHeadline`, `TelemetryPanel`/`MachinePanel` (stay retired on disk).

## 4. Verification

- **Remotion:** owner signs off on the 8 boundary stills; loop seam checked by rendering
  28–32 s wrapped and scrubbing the cut.
- **Assets:** both mp4s ≤ 2.5 MB, `+faststart`, no audio stream, first frame black
  (`ffprobe` + a frame-0 dump).
- **Page (Vercel preview):** Lighthouse mobile + desktop — LCP element remains the `<h1>`,
  performance score not below current; filter audit
  `[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).filter!=='none').length`
  unchanged; Network tab shows **zero** mp4 requests under reduced-motion, Save-Data and
  light theme.
- **Manual:** fade-in, seam, orientation swap, theme toggle mid-play, scroll-out pause,
  no-JS (grid floor only).
- `npm run build` clean (dev server stopped first — shared `.next/`).
- Ships as a branch → preview deploy → owner approval → `main`.

## Risks / open items
- Dot map density vs. file size: if 20k dots produce visible H.264 noise at crf 28, reduce
  dot count or step crf down to 26 before adding a WebM sibling.
- The "Reveal" pull-out is the hardest camera move; if the continuous-zoom illusion breaks
  there, a 6-frame dip-to-black at 13 s is the accepted fallback.

## Drift from this spec as shipped
- `layout.ts` lives in `config.ts` (`layoutFor`/`useLayout`).
- Dot map is a 160×80 grid (~3.9k land dots at 12 px world pitch), not "~20k dots at 24 px"; Antarctica excluded (it sat on the machine floor).
- Pink appears in the machine pulse (frames 625–680) AND on the three BOOKED chips (690→dip) — owner-approved; do not "fix" the chips.
- The reveal pull-out did not need the 6-frame dip fallback; the camera key was re-pinned instead (see camera.test.ts).
- Touch devices attach on first input (LCP safety, above).
- **Light theme (2026-09-21):** scenes read colors through `usePalette()` (ThemeContext from the composition's `theme` prop); compositions `HeroLoopLight`/`HeroLoopMobileLight`; files `loop-16x9-light.mp4` (2.41 MB, crf 29) / `loop-9x16-light.mp4` (1.48 MB); first frame = page grey (luma ≈ 240). `shouldLoadFilm` no longer bails on light; `pickSource(portrait, theme)`; the theme observer swaps files instead of pausing, which also removes the old "load in light, toggle to dark, no film" gap. Light scrim under `html[data-theme="light"]`.
