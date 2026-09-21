"use client";

import { useEffect, useRef } from "react";
import { isPortrait, pickSource, readFilmEnv, shouldLoadFilm } from "./heroFilmPolicy";
import { HERO_INTRO_DONE } from "./HeroCopy";

// The hero film, played ONCE as the opening with the copy hidden (the "intro"),
// then looping as a backdrop under the copy. No src/poster in the markup;
// nothing is requested under reduced-motion / Save-Data (the grid floor is the
// fallback state and the copy is visible from the first paint — the bootstrap
// script in app/layout.tsx only sets <html data-intro> when the film will play).
//
// Intro: the film attaches as soon as we're hydrated (it IS the opening, so it
// is the LCP element by design) and the copy stays hidden until the first pass
// completes — or until anything that means the visitor shouldn't wait: any
// scroll/tap/click/key, a load error, or no `playing` within INTRO_TIMEOUT_MS.
// Ending the intro clears data-intro (CSS fades the copy in) and dispatches
// HERO_INTRO_DONE so HeroCopy re-mounts the copy and the headline types in.
//
// One file per {orientation} × {theme}; a theme toggle or rotation fades the
// film out, swaps the file and fades back in on `playing`. While playing, the
// section carries data-film="on" and CSS fades the film in and the CSS grid
// scene out. Transform/opacity only; the video is one compositor layer.
const INTRO_TIMEOUT_MS = 6000;
const INTRO_END_S = 29.4; // the film's dip-to-black starts at 29.5 s: reveal as it goes dark
const INPUT_EVENTS = ["scroll", "touchstart", "pointerdown", "keydown"] as const;

export default function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    const section = v?.closest<HTMLElement>("#tl-hero");
    if (!v || !section) return;
    const html = document.documentElement;

    // Idempotent: the intro ends once, whichever trigger fires first.
    // `scroll` also fires for scroll restoration on reload — only a real
    // displacement counts as the visitor moving on.
    const onInput = (e: Event) => {
      if (e.type === "scroll" && window.scrollY < 4) return;
      endIntro();
    };
    let lastTime = 0;
    const onTime = () => {
      if (v.currentTime >= INTRO_END_S || v.currentTime < lastTime - 1) endIntro(); // end of pass, or the loop wrapped
      lastTime = v.currentTime;
    };
    const endIntro = () => {
      if (html.dataset.intro === undefined) return;
      delete html.dataset.intro;
      INPUT_EVENTS.forEach((n) => window.removeEventListener(n, onInput));
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("error", endIntro);
      window.dispatchEvent(new Event(HERO_INTRO_DONE));
    };

    if (!shouldLoadFilm(readFilmEnv())) {
      endIntro(); // belt and braces: the bootstrap shouldn't have set it either
      return; // no request, ever
    }

    const setOn = (on: boolean) => {
      if (on) section.dataset.film = "on";
      else delete section.dataset.film;
    };
    // Picks the file for the CURRENT orientation + theme. A different file
    // (theme toggle, rotation) drops data-film first so the old film fades
    // out under the swap; `playing` on the new file fades it back in.
    const load = () => {
      const src = pickSource(isPortrait(), readFilmEnv().theme);
      if (v.getAttribute("src") !== src) {
        setOn(false);
        v.setAttribute("src", src);
        v.load();
      }
      v.play().catch(() => {});
    };
    let playing = false;
    const onPlaying = () => {
      playing = true;
      setOn(true);
    };
    v.addEventListener("playing", onPlaying);

    // Intro triggers.
    INPUT_EVENTS.forEach((n) => window.addEventListener(n, onInput, { passive: true }));
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("error", endIntro);
    const introTimer = window.setTimeout(() => {
      if (!playing) endIntro(); // slow network: don't hold the copy hostage
    }, INTRO_TIMEOUT_MS);

    // Attach now: the film is the opening.
    v.preload = "auto";
    load();

    // Orientation or theme → swap file. Off-screen → pause.
    const swap = () => load();
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener("change", swap);
    const mo = new MutationObserver((muts) => {
      if (muts.some((m) => m.attributeName === "data-theme")) swap();
    });
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause();
        else v.play().catch(() => {});
      },
      { threshold: 0 },
    );
    io.observe(section);

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("error", endIntro);
      INPUT_EVENTS.forEach((n) => window.removeEventListener(n, onInput));
      window.clearTimeout(introTimer);
      mq.removeEventListener("change", swap);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <>
      <video ref={ref} aria-hidden muted playsInline loop preload="none" className="nt-film -z-10" />
      <div aria-hidden className="nt-film-scrim -z-10" />
    </>
  );
}
