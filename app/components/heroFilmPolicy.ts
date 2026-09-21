// Pure decisions for the hero film (spec §3). Kept free of React/DOM so the
// bail-outs are unit-tested; HeroFilm.tsx reads the environment and calls these.
export type FilmEnv = { reducedMotion: boolean; saveData: boolean; theme: "light" | "dark"; coarsePointer: boolean };

export const shouldLoadFilm = (e: FilmEnv) => !e.reducedMotion && !e.saveData && e.theme === "dark";

export const pickSource = (portrait: boolean): "/hero/loop-9x16.mp4" | "/hero/loop-16x9.mp4" =>
  portrait ? "/hero/loop-9x16.mp4" : "/hero/loop-16x9.mp4";

// When to attach the film. Chrome counts a <video>'s first frame as an LCP
// candidate (v116+) and LCP is finalized at the first user input, so on touch
// devices we wait for that input — the headline stays the LCP element and the
// film arrives on the first scroll. Desktop attaches after idle.
export type AttachTrigger = "idle" | "interaction";
export const attachTrigger = (e: FilmEnv): AttachTrigger => (e.coarsePointer ? "interaction" : "idle");

type NavWithConn = Navigator & { connection?: { saveData?: boolean } };

export const readFilmEnv = (): FilmEnv => ({
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  saveData: Boolean((navigator as NavWithConn).connection?.saveData),
  theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
  coarsePointer: window.matchMedia("(pointer: coarse)").matches,
});

export const isPortrait = () => window.matchMedia("(orientation: portrait)").matches;
