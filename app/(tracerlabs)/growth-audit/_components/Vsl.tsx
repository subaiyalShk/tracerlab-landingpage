"use client";

import { useState } from "react";
import { VSL_EMBED_URL, VSL_LENGTH, VSL_POSTER, VSL_TITLE } from "../config";

// The page's one full-treatment centerpiece: gradient edge + brand underglow.
// Click-to-play (same rule as ProjectVideo): the iframe is created only on tap,
// so the third-party player costs nothing until the visitor asks for it.
const CLIP15 = "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))";
const CLIP16 = "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))";
const CLIP12 = "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))";

export default function Vsl() {
  const [playing, setPlaying] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  function play() {
    if (!VSL_EMBED_URL) {
      setComingSoon(true);
      return;
    }
    setPlaying(true);
    // REPLACE (optional): fbq('trackCustom','VSLPlay');
  }

  return (
    // Perf: the underglow is a box-shadow on this UNCLIPPED wrapper (a shadow on the
    // clipped frame would be cut off by the chamfer), not a drop-shadow filter.
    <div className="animate-rise mb-6 shadow-[var(--nt-underglow)]" style={{ animationDelay: "0.26s" }}>
      <div className="relative p-px" style={{ clipPath: CLIP16, background: "var(--nt-edge)" }}>
        <div
          className="relative aspect-video w-full overflow-hidden bg-surface bg-cover bg-center"
          style={{
            clipPath: CLIP15,
            backgroundImage: VSL_POSTER ? `url(${VSL_POSTER})` : undefined,
          }}
        >
          {playing ? (
            <iframe
              src={VSL_EMBED_URL}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Tracerlabs video"
              className="absolute inset-0 z-[2] h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={play}
              aria-label="Play video: how Tracerlabs turns ad spend into booked appointments"
              className="group/vsl absolute inset-0 flex w-full flex-col items-center justify-center gap-3 p-4 text-center outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-blue"
              style={{
                backgroundImage:
                  "radial-gradient(60% 60% at 50% 50%, rgba(5,106,252,0.18), transparent 70%), linear-gradient(var(--nt-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--nt-grid-line) 1px, transparent 1px)",
                backgroundSize: "auto, 32px 32px, 32px 32px",
              }}
            >
              <span
                aria-hidden
                className="relative h-[70px] w-[70px] bg-brand-red shadow-[0_8px_26px_-10px_rgba(226,2,73,0.55)] transition-transform duration-300 group-hover/vsl:-translate-y-0.5"
                style={{ clipPath: CLIP12 }}
              >
                <span className="absolute left-[28px] top-[22px] border-y-[13px] border-l-[20px] border-y-transparent border-l-white" />
              </span>
              <span
                className="max-w-[26ch] text-[1rem] font-bold leading-[1.3] text-ink"
                style={{ fontFamily: "var(--font-archivo), system-ui, sans-serif" }}
              >
                {VSL_TITLE}
              </span>
              <span className="text-[0.82rem] text-ink/55">{comingSoon ? "Video coming soon" : VSL_LENGTH}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
