// The machine — hero visual (replaces the telemetry dashboard). A live
// pipeline diagram that animates the headline's claim: an ad click enters,
// gets verified, the AI follows up, a consult comes out booked. One payload
// dot runs a single orchestrated 9s loop; the nodes wake as it passes and
// settle after. Pure CSS — no state, no data, nothing to read but four
// stage names. Pink appears exactly once: the booked confirmation.
// Reduced motion: the diagram renders static with every stage lit.

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

const iconCls = "h-5 w-5";

const ClickIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3.5v3M4.6 5.6l2.1 2.1M3.5 10h3" />
    <path d="M10.5 10.5 20 14l-4.2 1.8L14 20l-3.5-9.5Z" />
  </svg>
);
const ShieldIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v5c0 4.4 3 8.4 7 9.5 4-1.1 7-5.1 7-9.5V6l-7-3Z" />
    <path d="m9 11.5 2 2 4-4.5" />
  </svg>
);
const ChatIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a8 8 0 0 1-8 8H4l2.2-2.6A8 8 0 1 1 21 12Z" />
  </svg>
);
const CalendarIcon = (
  <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 10h18" />
    <path d="M8.5 15.5l2.5 2.5 4.5-5" />
  </svg>
);

const STAGES = [
  { title: "Ad click", icon: ClickIcon, cls: "mp-n1" },
  { title: "Lead verified", icon: ShieldIcon, cls: "mp-n2" },
  { title: "AI follow-up", icon: ChatIcon, cls: "mp-n3", typing: true },
  { title: "Consult booked", icon: CalendarIcon, cls: "mp-n4", booked: true },
];

export default function MachinePanel() {
  return (
    <div className="flex flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <span className="text-[0.92rem] font-medium text-ink/60" style={{ fontFamily: DISPLAY }}>
          The machine
        </span>
        <span className="flex items-center gap-2 text-[0.8rem] text-ink/45">
          <span aria-hidden className="mp-live inline-block h-2 w-2 rounded-full bg-[#056afc]" />
          running
        </span>
      </div>

      <div className="flex flex-col pt-6 pb-2" aria-label="How it works: ad click, lead verified, AI follow-up, consult booked">
        {STAGES.map((s, i) => (
          <div key={s.title}>
            {i > 0 && (
              <div aria-hidden className="relative ml-[1.375rem] h-10 w-px bg-ink/10">
                <span className={`mp-dot mp-d${i}`} />
              </div>
            )}
            <div className="flex items-center gap-4">
              <span className={`mp-chip ${s.cls} bv-6 flex h-11 w-11 shrink-0 items-center justify-center border border-ink/15 text-ink/45`}>
                {s.icon}
              </span>
              <span
                className="text-[1.05rem] font-semibold tracking-tight text-ink/85"
                style={{ fontFamily: DISPLAY }}
              >
                {s.title}
              </span>
              {s.typing && (
                <span aria-hidden className="mp-typing flex items-center gap-1">
                  <span /><span /><span />
                </span>
              )}
              {s.booked && (
                <span
                  aria-hidden
                  className="mp-plus bv-6 px-2 py-0.5 text-[0.78rem] font-bold text-[#e7028d]"
                  style={{ fontFamily: DISPLAY, backgroundColor: "rgba(231,2,141,0.1)" }}
                >
                  +1
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* One shared 9s clock; every part keys off its own window of it. */
        .mp-live { animation: mpLive 2.4s ease-in-out infinite; }
        @keyframes mpLive {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(5,106,252,0.7); }
          50% { opacity: 0.45; box-shadow: none; }
        }

        .mp-chip { transition: none; }
        .mp-n1 { animation: mpWake 9s infinite; }
        .mp-n2 { animation: mpWake2 9s infinite; }
        .mp-n3 { animation: mpWake3 9s infinite; }
        .mp-n4 { animation: mpBook 9s infinite; }
        @keyframes mpWake {
          0%, 9% { color: #056afc; border-color: rgba(5,106,252,0.55); box-shadow: 0 0 16px rgba(5,106,252,0.28); }
          14%, 100% { color: inherit; border-color: inherit; box-shadow: none; }
        }
        @keyframes mpWake2 {
          0%, 13% { color: inherit; box-shadow: none; }
          15%, 24% { color: #056afc; border-color: rgba(5,106,252,0.55); box-shadow: 0 0 16px rgba(5,106,252,0.28); }
          29%, 100% { color: inherit; box-shadow: none; }
        }
        @keyframes mpWake3 {
          0%, 35% { color: inherit; box-shadow: none; }
          37%, 58% { color: #056afc; border-color: rgba(5,106,252,0.55); box-shadow: 0 0 16px rgba(5,106,252,0.28); }
          63%, 100% { color: inherit; box-shadow: none; }
        }
        @keyframes mpBook {
          0%, 68% { color: inherit; box-shadow: none; }
          70%, 82% { color: #e7028d; border-color: rgba(231,2,141,0.55); box-shadow: 0 0 18px rgba(231,2,141,0.3); }
          90%, 100% { color: inherit; box-shadow: none; }
        }

        /* Payload dot traveling each connector during its window. */
        .mp-dot {
          position: absolute;
          left: 50%;
          top: 0;
          width: 7px;
          height: 7px;
          margin-left: -3.5px;
          border-radius: 9999px;
          background: #056afc;
          box-shadow: 0 0 12px rgba(5,106,252,0.8);
          opacity: 0;
        }
        .mp-d1 { animation: mpTravel1 9s infinite; }
        .mp-d2 { animation: mpTravel2 9s infinite; }
        .mp-d3 { animation: mpTravel3 9s infinite; }
        @keyframes mpTravel1 {
          0%, 4% { opacity: 0; transform: translateY(-2px); }
          6% { opacity: 1; }
          13% { opacity: 1; }
          15%, 100% { opacity: 0; transform: translateY(36px); }
        }
        @keyframes mpTravel2 {
          0%, 26% { opacity: 0; transform: translateY(-2px); }
          28% { opacity: 1; }
          35% { opacity: 1; }
          37%, 100% { opacity: 0; transform: translateY(36px); }
        }
        @keyframes mpTravel3 {
          0%, 59% { opacity: 0; transform: translateY(-2px); }
          61% { opacity: 1; }
          68% { opacity: 1; }
          70%, 100% { opacity: 0; transform: translateY(36px); }
        }

        /* AI conversation: typing dots, gated to the follow-up window. */
        .mp-typing { animation: mpGateTyping 9s infinite; opacity: 0; }
        .mp-typing span {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: rgba(5,106,252,0.75);
          animation: mpBlink 0.9s ease-in-out infinite;
        }
        .mp-typing span:nth-child(2) { animation-delay: 0.15s; }
        .mp-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes mpGateTyping {
          0%, 36% { opacity: 0; }
          39%, 57% { opacity: 1; }
          61%, 100% { opacity: 0; }
        }
        @keyframes mpBlink {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-2.5px); opacity: 1; }
        }

        /* Output: the +1 pops when the booking lands. */
        .mp-plus { animation: mpPlus 9s infinite; opacity: 0; }
        @keyframes mpPlus {
          0%, 69% { opacity: 0; transform: translateY(5px) scale(0.9); }
          72%, 84% { opacity: 1; transform: translateY(0) scale(1); }
          90%, 100% { opacity: 0; transform: translateY(-4px) scale(0.95); }
        }

        @media (prefers-reduced-motion: reduce) {
          .mp-live, .mp-chip, .mp-dot, .mp-typing, .mp-typing span, .mp-plus { animation: none; }
          .mp-chip { color: #056afc; border-color: rgba(5,106,252,0.4); }
          .mp-n4 { color: #e7028d; border-color: rgba(231,2,141,0.4); }
          .mp-plus { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
