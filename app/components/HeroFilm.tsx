"use client";

import { useEffect, useRef, useState } from "react";
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
//
// Sound: the film carries a score. We try to autoplay WITH sound first —
// browsers allow it for visitors who have interacted with the site before
// (Chrome's engagement score, or arriving via a click from another page on
// the domain) — and fall back to muted when the browser refuses. Either way
// a speaker toggle (shown during the intro) lets the visitor flip it; that
// click is the one input that does NOT end the intro.
const INTRO_TIMEOUT_MS = 6000;
const INPUT_EVENTS = ["scroll", "touchstart", "pointerdown", "keydown"] as const;

export default function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

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
      setShowToggle(false);
      v.pause();
      delete section.dataset.film; // film fades out, grid floor fades in
      delete html.dataset.intro; // copy + nav fade in
      try {
        history.scrollRestoration = "auto"; // the bootstrap disabled it for the intro; normal service resumes
      } catch {
        /* ignore */
      }
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
      if ((e.target as Element | null)?.closest?.("[data-hero-sound]")) return; // the sound toggle is not "moving on"
      finish();
    };
    let playing = false;
    const onPlaying = () => {
      playing = true;
      if (state === "intro") {
        section.dataset.film = "on";
        setShowToggle(true);
      }
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
    // Unmuted first; if the browser refuses, muted (the toggle can flip it).
    v.preload = "auto";
    v.setAttribute("src", pickSource(isPortrait(), readFilmEnv().theme));
    v.load();
    v.muted = false;
    v.play()
      .then(() => setSound(true))
      .catch(() => {
        v.muted = true;
        setSound(false);
        v.play().catch(() => {});
      });

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("ended", finish);
      v.removeEventListener("error", finish);
      INPUT_EVENTS.forEach((n) => window.removeEventListener(n, onInput));
      window.clearTimeout(timer);
    };
  }, []);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = sound; // unmute on the click gesture; re-mute on the next
    setSound(!sound);
  };

  return (
    <>
      <video ref={ref} aria-hidden muted playsInline preload="none" className="nt-film -z-10" />
      <div aria-hidden className="nt-film-scrim -z-10" />
      {showToggle && (
        <button
          type="button"
          data-hero-sound
          onClick={toggleSound}
          aria-label={sound ? "Turn sound off" : "Turn sound on"}
          aria-pressed={sound}
          className="nt-sound bv-6 absolute bottom-6 right-6 z-20 flex h-10 items-center gap-2 px-3 font-body text-[0.8rem] text-ink/80 transition-colors hover:text-ink sm:bottom-8 sm:right-8"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 10v4h4l5 4V6L8 10H4Z" />
            {sound ? (
              <>
                <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
                <path d="M18.5 7a7 7 0 0 1 0 10" />
              </>
            ) : (
              <path d="m16.5 9.5 4 5m0-5-4 5" />
            )}
          </svg>
          <span>{sound ? "Sound on" : "Sound"}</span>
        </button>
      )}
    </>
  );
}
