"use client";

import { useEffect, useState } from "react";
import RateChart from "./RateChart";

// Rotating client meter for the hero telemetry panel — cycles through real
// client meters (solar engine → Harbs Farm → all-clients roll-up) so the
// "same meter we run for every client" claim is demonstrated, not asserted.
// Auto-advances every 8s; pauses on hover; respects reduced motion; tabs are
// real buttons. Every figure is production data with an honest label.

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

type Pane = {
  tab: string;
  headline: string;
  headlineLabel: string;
  figures: [string, string][];
  chart?: boolean;
};

const PANES: Pane[] = [
  {
    tab: "Solar engine",
    headline: "367",
    headlineLabel: "solar consultations booked on autopilot — Texas",
    figures: [
      ["94%", "appointment show rate"],
      ["2×", "lead → consult rate after the AI texting agent"],
    ],
    chart: true,
  },
  {
    tab: "Harbs Farm",
    headline: "20",
    headlineLabel: "paid bookings in the first week of ads — Harbs Farm, New York",
    figures: [
      ["100%", "of deposits collected up front"],
      ["0", "phone calls needed to book"],
    ],
  },
  {
    tab: "All clients",
    headline: "500+",
    headlineLabel: "appointments tracked in production — Texas & New York",
    figures: [
      ["12k+", "funnel visitors measured"],
      ["1", "team running all of it"],
    ],
  },
];

export default function TelemetryPanel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % PANES.length), 12000);
    return () => clearInterval(t);
  }, [paused]);

  const pane = PANES[i];

  return (
    <div
      className="flex flex-col p-5 sm:p-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <span className="text-[0.92rem] font-medium text-ink/60" style={{ fontFamily: DISPLAY }}>
          Client telemetry
        </span>
        <span className="flex items-center gap-2 text-[0.8rem] text-ink/45">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-[#056AFC]" />
          production data
        </span>
      </div>

      {/* pane — keyed remount replays the rise animation on switch */}
      <div key={i} className="animate-rise flex min-h-[330px] flex-col">
        <div className="pt-5">
          <div
            className="bg-gradient-to-r from-brand-pink to-brand-blue bg-clip-text text-[clamp(3rem,6vw,4.2rem)] font-extrabold leading-none tracking-tight text-transparent"
            style={{ fontFamily: DISPLAY }}
          >
            {pane.headline}
          </div>
          <div className="mt-1.5 text-[0.95rem] text-ink/60">{pane.headlineLabel}</div>
        </div>

        {pane.chart && (
          <div className="mt-5 text-ink">
            <RateChart compact />
          </div>
        )}

        <dl
          className={`mt-5 grid grid-cols-2 gap-x-4 border-t border-ink/10 pt-5 ${
            pane.chart ? "gap-y-4" : "gap-y-6 pt-6"
          }`}
        >
          {pane.figures.map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd>
                <span className="text-[1.5rem] font-bold tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
                  {v}
                </span>
                <span className="mt-0.5 block text-[0.82rem] leading-snug text-ink/55">{l}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* pane dots — quiet, clickable */}
      <div className="flex justify-center gap-2.5 pt-5" role="tablist" aria-label="Client meters">
        {PANES.map((p, idx) => (
          <button
            key={p.tab}
            role="tab"
            aria-selected={idx === i}
            aria-label={p.tab}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === i ? "w-6 bg-gradient-to-r from-brand-pink to-brand-blue" : "w-1.5 bg-ink/20 hover:bg-ink/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
