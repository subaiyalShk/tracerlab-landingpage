"use client";

import { useEffect, useRef } from "react";
import { isPortrait, pickSource, readFilmEnv, shouldLoadFilm } from "./heroFilmPolicy";

// The hero film: a silent full-bleed loop UNDER the copy (spec §3). No src
// and no poster in the markup — nothing is requested until after idle, and
// never under reduced-motion / Save-Data / light theme (the grid floor is
// the fallback state). While playing, the section carries data-film="on"
// and CSS fades the film in and the CSS grid scene out. Transform/opacity
// only; the video is one compositor layer.
export default function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    const section = v?.closest<HTMLElement>("#tl-hero");
    if (!v || !section) return;
    if (!shouldLoadFilm(readFilmEnv())) return; // no request, ever

    const setOn = (on: boolean) => {
      if (on) section.dataset.film = "on";
      else delete section.dataset.film;
    };
    const load = () => {
      const src = pickSource(isPortrait());
      if (v.getAttribute("src") !== src) {
        v.setAttribute("src", src);
        v.load();
      }
      v.play().catch(() => {});
    };
    const onPlaying = () => setOn(true);
    v.addEventListener("playing", onPlaying);

    // Attach after idle so the headline/fonts own first paint.
    const win = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idle: number | undefined;
    let timer: number | undefined;
    if (win.requestIdleCallback) idle = win.requestIdleCallback(load, { timeout: 800 });
    else timer = window.setTimeout(load, 800);

    // Orientation → swap file. Theme → pause/resume. Off-screen → pause.
    const mq = window.matchMedia("(orientation: portrait)");
    const onOrient = () => load();
    mq.addEventListener("change", onOrient);

    const mo = new MutationObserver(() => {
      if (readFilmEnv().theme === "light") {
        v.pause();
        setOn(false);
      } else load();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause();
        else if (readFilmEnv().theme === "dark") v.play().catch(() => {});
      },
      { threshold: 0 },
    );
    io.observe(section);

    return () => {
      v.removeEventListener("playing", onPlaying);
      if (idle !== undefined) win.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
      mq.removeEventListener("change", onOrient);
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
