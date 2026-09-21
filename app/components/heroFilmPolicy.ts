// Pure decisions for the hero film (spec §3). Kept free of React/DOM so the
// bail-outs are unit-tested; HeroFilm.tsx reads the environment and calls these.
export type FilmEnv = { reducedMotion: boolean; saveData: boolean; theme: "light" | "dark" };

export const shouldLoadFilm = (e: FilmEnv) => !e.reducedMotion && !e.saveData && e.theme === "dark";

export const pickSource = (portrait: boolean): "/hero/loop-9x16.mp4" | "/hero/loop-16x9.mp4" =>
  portrait ? "/hero/loop-9x16.mp4" : "/hero/loop-16x9.mp4";

type NavWithConn = Navigator & { connection?: { saveData?: boolean } };

export const readFilmEnv = (): FilmEnv => ({
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  saveData: Boolean((navigator as NavWithConn).connection?.saveData),
  theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
});

export const isPortrait = () => window.matchMedia("(orientation: portrait)").matches;
