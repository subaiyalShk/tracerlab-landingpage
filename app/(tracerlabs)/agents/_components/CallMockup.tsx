import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";

// Rich animated mockup for the "AI Calls & Books" stage. All motion is CSS:
//  • always-on: pulsing LIVE pill, an equalizer waveform, typing dots (animate-* → reduced-motion-safe)
//  • on scroll-in: the transcript lines + booking confirmation reveal in sequence, driven by the
//    `.reveal-active` class that the <Reveal> wrapper adds when the panel enters the viewport.
const TRANSCRIPT: { who: "ai" | "them"; text: string }[] = [
  { who: "ai", text: "Hi Sarah, I'm calling about your interest in our AI solutions — do you have a minute?" },
  { who: "them", text: "Yes, I'd love to learn more about automation." },
];

export default function CallMockup() {
  return (
    <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} innerClassName="backdrop-blur-md">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-[0.95rem] tracking-tight">AI Voice Agent</div>
            <div className="text-[0.72rem] text-ink/40">Outbound call</div>
          </div>
          <span className="bv-6 flex items-center gap-1.5 bg-brand-pink/10 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wide text-brand-pink">
            <span className="relative flex h-1.5 w-1.5">
              <span aria-hidden className="animate-orb-ripple absolute h-1.5 w-1.5 rounded-full bg-brand-pink/60" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-brand-pink" />
            </span>
            Live · 00:47
          </span>
        </div>

        {/* caller + animated equalizer */}
        <div className="flex items-center gap-3">
          <span className="bv-6 flex h-9 w-9 shrink-0 items-center justify-center bg-ink/[0.06] text-[0.78rem] font-semibold text-ink/70">SM</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[0.85rem] text-ink/80">Sarah Mitchell · Acme Corp</div>
            <div className="text-[0.7rem] text-ink/40">HD Voice</div>
          </div>
          <div aria-hidden className="flex h-7 items-end gap-[3px]">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className="animate-wave w-[3px] origin-bottom rounded-full"
                style={{ height: "100%", animationDelay: `${i * 0.11}s`, background: "linear-gradient(to top, #e7028d, #056afc)" }}
              />
            ))}
          </div>
        </div>

        {/* transcript — lines reveal in sequence on scroll-in */}
        <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink/35">Live transcript</div>
          {TRANSCRIPT.map((l, i) => (
            <div
              key={i}
              className={`max-w-[88%] translate-y-2 opacity-0 transition-all duration-500 ease-out [.reveal-active_&]:translate-y-0 [.reveal-active_&]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${l.who === "ai" ? "self-start" : "self-end"}`}
              style={{ transitionDelay: `${0.25 + i * 0.45}s` }}
            >
              <div className={`bv-6 px-3 py-2 text-[0.8rem] leading-snug ${l.who === "ai" ? "bg-ink/[0.06] text-ink/80" : "bg-brand-pink/12 text-ink/85"}`}>
                {l.text}
              </div>
            </div>
          ))}
          {/* typing dots */}
          <div
            aria-hidden
            className="flex items-center gap-1 self-start opacity-0 transition-opacity duration-500 [.reveal-active_&]:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none"
            style={{ transitionDelay: "1.2s" }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="animate-blink h-1.5 w-1.5 rounded-full bg-ink/40" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>

        {/* booking confirmation — reveals last */}
        <div
          className="bv-6 flex translate-y-2 items-center gap-2 bg-brand-blue/10 px-3 py-2 text-[0.8rem] text-ink/80 opacity-0 transition-all duration-500 ease-out [.reveal-active_&]:translate-y-0 [.reveal-active_&]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
          style={{ transitionDelay: "1.5s" }}
        >
          <span className="text-brand-blue">✓</span> Appointment booked — Thursday, 2:00 PM
        </div>
      </div>
    </Bevel>
  );
}
