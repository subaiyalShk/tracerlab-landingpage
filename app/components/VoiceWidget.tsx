"use client";

import { useCallback, useRef, useState } from "react";

// In-browser voice agent for the CTA. Click → mint a short-lived token from /api/retell/web-call
// → start a WebRTC voice call with the Retell agent (lazy-imported, browser-only). The agent runs
// discovery and books the call; this widget just drives the call + a live orb. Degrades to a
// "Book a call" link when voice is unconfigured, mic is denied, or anything errors.
type State = "idle" | "connecting" | "listening" | "speaking" | "ended" | "denied" | "error";

// Minimal shape of the Retell web client we use (avoids a hard type dep at module load).
type RetellClient = {
  startCall: (cfg: { accessToken: string }) => Promise<void>;
  stopCall: () => void;
  on: (event: string, cb: (arg?: unknown) => void) => void;
};

function BookFallback({ url, note }: { url: string; note?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_10px_40px_-8px_rgba(231,2,141,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
        style={{ backgroundImage: "linear-gradient(100deg,#e21949,#e7028d)" }}
      >
        Book a call
        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      {note && <p className="text-[0.8rem] text-white/45">{note}</p>}
    </div>
  );
}

export default function VoiceWidget({
  voiceEnabled,
  calcomUrl,
}: {
  voiceEnabled: boolean;
  calcomUrl: string;
}) {
  const [state, setState] = useState<State>("idle");
  const clientRef = useRef<RetellClient | null>(null);

  const endCall = useCallback(() => {
    try {
      clientRef.current?.stopCall();
    } catch {
      /* ignore */
    }
  }, []);

  const start = useCallback(async () => {
    setState("connecting");

    // Load the browser SDK FIRST (it's a separate chunk fetch). Minting the ~30s-lived
    // access token before this download could let it expire before startCall runs.
    let RetellWebClient: (new () => RetellClient) | undefined;
    try {
      ({ RetellWebClient } = (await import("retell-client-js-sdk")) as unknown as {
        RetellWebClient: new () => RetellClient;
      });
    } catch {
      setState("error"); // SDK chunk failed to load — not a mic issue.
      return;
    }

    try {
      // Mint the token immediately before joining so it's freshest.
      const res = await fetch("/api/retell/web-call", { method: "POST" });
      if (!res.ok) {
        // 503 (unconfigured) / 429 / 502 → fall back to booking.
        setState("error");
        return;
      }
      const { accessToken } = await res.json();

      const client = new RetellWebClient();
      clientRef.current = client;

      client.on("call_started", () => setState("listening"));
      client.on("agent_start_talking", () => setState("speaking"));
      client.on("agent_stop_talking", () => setState("listening"));
      client.on("call_ended", () => setState("ended"));
      client.on("error", () => {
        try {
          client.stopCall();
        } catch {
          /* ignore */
        }
        setState("error");
      });

      await client.startCall({ accessToken });
    } catch (err) {
      // The most common failure here is the user denying microphone access.
      const name = (err as { name?: string } | null)?.name;
      setState(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
    }
  }, []);

  // ── Unconfigured / failure states → booking fallback ──────────────────
  if (!voiceEnabled) {
    return <BookFallback url={calcomUrl} />;
  }
  if (state === "denied") {
    return <BookFallback url={calcomUrl} note="Mic access is needed to talk — or just book a call." />;
  }
  if (state === "error") {
    return <BookFallback url={calcomUrl} note="Couldn't start the call — book a call and we'll take it from there." />;
  }

  // ── Voice states ──────────────────────────────────────────────────────
  const inCall = state === "listening" || state === "speaking";
  const speaking = state === "speaking";

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Orb */}
      <button
        type="button"
        onClick={inCall ? endCall : state === "connecting" ? undefined : start}
        disabled={state === "connecting"}
        aria-label={inCall ? "End the voice call" : "Talk to our AI"}
        className="group relative flex h-28 w-28 items-center justify-center rounded-full outline-none"
      >
        {/* speaking ripple */}
        {speaking && (
          <span
            aria-hidden
            className="animate-orb-ripple absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(231,2,141,0.45), transparent 70%)" }}
          />
        )}
        {/* glow */}
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-500 ${inCall ? "opacity-90" : "opacity-60 group-hover:opacity-90"}`}
          style={{ background: "radial-gradient(circle, rgba(231,2,141,0.6), rgba(5,106,252,0.4) 60%, transparent 75%)" }}
        />
        {/* core */}
        <span
          className={`relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-white shadow-[0_10px_40px_-8px_rgba(231,2,141,0.7)] transition-transform duration-300 group-hover:scale-105 ${state === "listening" ? "animate-orb-pulse" : ""}`}
          style={{ backgroundImage: "linear-gradient(135deg,#e7028d,#056afc)" }}
        >
          {state === "connecting" ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : inCall ? (
            // stop square
            <span className="h-5 w-5 rounded-[3px] bg-white" />
          ) : (
            // mic icon
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          )}
        </span>
      </button>

      {/* Status + label */}
      <div className="flex flex-col items-center gap-1" aria-live="polite">
        {state === "idle" && (
          <>
            <span className="text-[1.02rem] font-semibold text-white">Talk to our AI</span>
            <span className="text-[0.82rem] text-white/45">~2 minutes · it books your call</span>
          </>
        )}
        {state === "connecting" && <span className="text-[0.95rem] font-medium text-white/80">Connecting…</span>}
        {state === "listening" && <span className="text-[0.95rem] font-medium text-white/80">Listening… <span className="text-white/45">(tap to end)</span></span>}
        {state === "speaking" && <span className="text-[0.95rem] font-medium text-white/80">Speaking… <span className="text-white/45">(tap to end)</span></span>}
        {state === "ended" && (
          <>
            <span className="text-[1.02rem] font-semibold text-white">Thanks — talk soon.</span>
            <button type="button" onClick={() => setState("idle")} className="text-[0.85rem] font-semibold text-brand-pink hover:text-white">
              Start over
            </button>
          </>
        )}
      </div>
    </div>
  );
}
