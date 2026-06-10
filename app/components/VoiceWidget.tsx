"use client";

import { useCallback, useRef, useState } from "react";
import Button from "./Button";

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
    <div className="flex flex-col items-center gap-3">
      <Button href={url} external variant="primary">
        Book a call
      </Button>
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
        {/* glow */}
        <span
          aria-hidden
          className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${inCall ? "opacity-100" : "opacity-50 group-hover:opacity-95"}`}
          style={{ background: "radial-gradient(circle, rgba(226,25,73,0.7), transparent 70%)" }}
        />
        {/* speaking ripple */}
        {speaking && (
          <span
            aria-hidden
            className="animate-orb-ripple absolute inset-1 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(226,25,73,0.45), transparent 70%)" }}
          />
        )}
        {/* core — machined red-anodized metal: a conic spun-metal sheen + a polished
            reflection highlight + curvature shadows, with the mic raised as an emboss */}
        <span
          className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 ${state === "listening" ? "animate-orb-pulse" : ""}`}
          style={{
            backgroundColor: "#cf1640",
            backgroundImage:
              "radial-gradient(circle at 36% 26%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 44%), conic-gradient(from 218deg at 50% 48%, #ff6379 0deg, #b21036 64deg, #ff6379 132deg, #8b0c2b 198deg, #ff6379 270deg, #b21036 330deg, #ff6379 360deg)",
            boxShadow:
              "0 16px 44px -12px rgba(226,25,73,0.8), inset 0 2px 2px rgba(255,255,255,0.55), inset 0 -10px 16px rgba(75,3,19,0.6), inset 0 0 0 1px rgba(0,0,0,0.18)",
          }}
        >
          {state === "connecting" ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/45 border-t-white" />
          ) : inCall ? (
            // stop square (embossed)
            <span className="h-5 w-5 rounded-[3px] bg-[#ffe7ec]" style={{ filter: "drop-shadow(0 1.5px 1px rgba(70,2,18,0.7))" }} />
          ) : (
            // mic icon — raised emboss
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,236,241,0.95)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 1.5px 1px rgba(70,2,18,0.75)) drop-shadow(0 -0.5px 0.5px rgba(255,255,255,0.5))" }}
            >
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
            <button type="button" onClick={() => setState("idle")} className="text-[0.85rem] font-semibold text-white/70 transition-colors hover:text-white">
              Start over
            </button>
          </>
        )}
      </div>
    </div>
  );
}
