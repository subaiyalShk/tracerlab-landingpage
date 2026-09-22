// Pure decisions for the hero film (spec §3). Kept free of React/DOM so the
// bail-outs are unit-tested; HeroFilm.tsx reads the environment and calls these.
export type FilmTheme = "light" | "dark";
export type FilmEnv = { reducedMotion: boolean; saveData: boolean; theme: FilmTheme };

// The film ships in both themes (light since 2026-09-21), so only motion and
// data preferences can veto it.
export const shouldLoadFilm = (e: FilmEnv) => !e.reducedMotion && !e.saveData;

export type FilmSource = "/hero/loop-16x9.mp4" | "/hero/loop-9x16.mp4" | "/hero/loop-16x9-light.mp4" | "/hero/loop-9x16-light.mp4";
export const pickSource = (portrait: boolean, theme: FilmTheme): FilmSource =>
  `/hero/loop-${portrait ? "9x16" : "16x9"}${theme === "light" ? "-light" : ""}.mp4`;

// Attach timing is no longer a policy decision: since the film plays as the
// opening with the copy hidden (2026-09-22), it is the LCP element on every
// device by design and HeroFilm attaches it immediately. The bootstrap script
// in app/layout.tsx applies the same two vetoes pre-paint to decide whether
// the copy starts hidden.

type NavWithConn = Navigator & { connection?: { saveData?: boolean } };

export const readFilmEnv = (): FilmEnv => ({
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  saveData: Boolean((navigator as NavWithConn).connection?.saveData),
  theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
});

export const isPortrait = () => window.matchMedia("(orientation: portrait)").matches;
