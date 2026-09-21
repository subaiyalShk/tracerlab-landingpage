"use client";

import { useEffect, useRef } from "react";
import { attachTrigger, isPortrait, pickSource, readFilmEnv, shouldLoadFilm } from "./heroFilmPolicy";

// The hero film: a silent full-bleed loop UNDER the copy (spec §3). No src
// and no poster in the markup — nothing is requested until after idle, and
// never under reduced-motion / Save-Data (the grid floor is the fallback
// state). One file per {orientation} × {theme}; a theme toggle fades the
// film out, swaps the file and fades the new one in on `playing`. While
// playing, the section carries data-film="on" and CSS fades the film in and
// the CSS grid scene out. Transform/opacity only; the video is one
// compositor layer. Touch devices attach on first input (scroll/tap/key)
// instead of idle, so the headline stays the LCP element.
export default function HeroFilm() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    const section = v?.closest<HTMLElement>("#tl-hero");
    if (!v || !section) return;
    const env = readFilmEnv();
    if (!shouldLoadFilm(env)) return; // no request, ever

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
    const onPlaying = () => setOn(true);
    v.addEventListener("playing", onPlaying);

    // Attach after idle so the headline/fonts own first paint — except on
    // coarse-pointer (touch) devices, where Chrome can still finalize LCP on
    // an idle-attached <video>'s first frame; there we wait for the first
    // input instead (scroll/tap/key), after which LCP is already finalized.
    const win = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idle: number | undefined;
    let timer: number | undefined;
    const INTERACTION_EVENTS = ["scroll", "touchstart", "pointerdown", "keydown"] as const;
    const onFirstInput = () => {
      INTERACTION_EVENTS.forEach((n) => window.removeEventListener(n, onFirstInput));
      load();
    };
    if (attachTrigger(env) === "interaction") {
      INTERACTION_EVENTS.forEach((n) => window.addEventListener(n, onFirstInput, { passive: true, once: true }));
    } else if (win.requestIdleCallback) idle = win.requestIdleCallback(load, { timeout: 800 });
    else timer = window.setTimeout(load, 800);

    // Orientation or theme → swap file (only once the film has been attached,
    // so a toggle before idle/first-input can't jump the LCP gate). Off-screen → pause.
    const swapIfAttached = () => {
      if (v.hasAttribute("src")) load();
    };
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener("change", swapIfAttached);

    const mo = new MutationObserver(swapIfAttached);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause();
        else if (v.hasAttribute("src")) v.play().catch(() => {});
      },
      { threshold: 0 },
    );
    io.observe(section);

    return () => {
      v.removeEventListener("playing", onPlaying);
      if (idle !== undefined) win.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
      INTERACTION_EVENTS.forEach((n) => window.removeEventListener(n, onFirstInput));
      mq.removeEventListener("change", swapIfAttached);
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
