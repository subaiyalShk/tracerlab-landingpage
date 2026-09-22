"use client";

import { useEffect, useRef } from "react";
import { isPortrait, pickSource, readFilmEnv, shouldLoadFilm } from "./heroFilmPolicy";
import { HERO_INTRO_DONE } from "./HeroCopy";

// The hero film: an intro that plays ONCE, full-screen, with the nav and copy
// hidden — then hands the stage back to the CSS grid-floor scene the copy was
// designed on. Two states after mount:
//
//   intro  — the film is attached and playing; <html data-intro="on"> (set
//            pre-paint by the bootstrap script in app/layout.tsx) keeps the
//            copy and nav hidden; #tl-hero[data-film="on"] shows the film.
//   done   — the film is paused and faded out, the grid floor is back, the
//            copy types in and the nav fades in.
//
// EVERY exit goes through finish(): the film ending (it fades itself to the
// page background first, so the hand-over starts from black), any real input
// (scroll/tap/click/key — the visitor has moved on, so the film is killed,
// not left playing underneath), a media error, or no playback within
// INTRO_TIMEOUT_MS. There is no theme/orientation swapping and no off-screen
// pause: a toggle click or a scroll is itself an exit.
//
// No src/poster in the markup; nothing is requested under reduced-motion /
// Save-Data (then data-intro was never set and the copy is visible from the
// first paint). The film is the LCP element by design.
const INTRO_TIMEOUT_MS = 6000;
const INPUT_EVENTS = ["scroll", "touchstart", "pointerdown", "keydown"] as const;

export default function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    const section = v?.closest<HTMLElement>("#tl-hero");
    if (!v || !section) return;
    const html = document.documentElement;

    // No film if the page isn't at the top (deep link, restored scroll) or the
    // policy vetoes it. Belt and braces: the bootstrap shouldn't have set
    // data-intro in these cases either.
    if (window.scrollY >= 4 || location.hash || !shouldLoadFilm(readFilmEnv())) {
      delete html.dataset.intro;
      return; // no request, ever
    }
    window.scrollTo(0, 0);

    let state: "intro" | "done" = "intro";
    const finish = () => {
      if (state === "done") return;
      state = "done";
      v.pause();
      delete section.dataset.film; // film fades out, grid floor fades in
      delete html.dataset.intro; // copy + nav fade in
      window.dispatchEvent(new Event(HERO_INTRO_DONE)); // HeroCopy re-mounts → headline types in
      INPUT_EVENTS.forEach((n) => window.removeEventListener(n, onInput));
      v.removeEventListener("ended", finish);
      v.removeEventListener("error", finish);
      window.clearTimeout(timer);
    };
    // `scroll` also fires for scroll restoration on reload — only a real
    // displacement counts as the visitor moving on.
    const onInput = (e: Event) => {
      if (e.type === "scroll" && window.scrollY < 4) return;
      finish();
    };
    let playing = false;
    const onPlaying = () => {
      playing = true;
      if (state === "intro") section.dataset.film = "on";
    };

    v.addEventListener("playing", onPlaying);
    v.addEventListener("ended", finish);
    v.addEventListener("error", finish);
    INPUT_EVENTS.forEach((n) => window.addEventListener(n, onInput, { passive: true }));
    // (finish() reads `timer` only from event/timer callbacks, all after this line.)
    const timer = window.setTimeout(() => {
      if (!playing) finish(); // slow network: don't hold the page hostage
    }, INTRO_TIMEOUT_MS);

    // Attach now: the film is the opening. One file per orientation × theme.
    v.preload = "auto";
    v.setAttribute("src", pickSource(isPortrait(), readFilmEnv().theme));
    v.load();
    v.play().catch(() => {});

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("ended", finish);
      v.removeEventListener("error", finish);
      INPUT_EVENTS.forEach((n) => window.removeEventListener(n, onInput));
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <video ref={ref} aria-hidden muted playsInline preload="none" className="nt-film -z-10" />
      <div aria-hidden className="nt-film-scrim -z-10" />
    </>
  );
}
