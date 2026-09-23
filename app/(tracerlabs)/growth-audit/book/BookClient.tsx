"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Bevel, { GLASS_BG, GLASS_BORDER } from "../../../components/Bevel";
import Button from "../../../components/Button";
import { trackBookingConfirmed } from "../_lib/pixel";

// Day rail + time grid. Slots arrive as UTC ISO strings and are rendered in the
// visitor's own timezone, so nobody has to do mental arithmetic to book a call.
const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

type State = "loading" | "ready" | "booking" | "booked" | "error";

function localTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
  } catch {
    return "America/Chicago";
  }
}

export default function BookClient({ token, firstName }: { token: string; firstName: string }) {
  const [state, setState] = useState<State>("loading");
  const [slots, setSlots] = useState<string[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState<{ start: string; meetLink: string | null } | null>(null);
  const tz = useMemo(() => localTz(), []);

  const dayKey = useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(
        new Date(iso),
      ),
    [tz],
  );
  const dayLabel = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)));
  };
  const timeLabel = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(new Date(iso));

  const fetchSlots = useCallback(async (): Promise<string[]> => {
    const res = await fetch("/api/growth-audit/slots", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !Array.isArray(json.slots)) throw new Error(json.error || "Could not load times.");
    return json.slots as string[];
  }, []);

  const applySlots = useCallback(
    (list: string[]) => {
      setSlots(list);
      setDay((d) => d ?? (list.length ? dayKey(list[0]) : null));
      setState("ready");
    },
    [dayKey],
  );

  const failed = useCallback((e: unknown, fallback: string) => {
    setError(e instanceof Error ? e.message : fallback);
    setState("error");
  }, []);

  // First load. The fetch is started without touching state synchronously —
  // the component already renders in "loading" — so this never cascades renders.
  useEffect(() => {
    let alive = true;
    fetchSlots()
      .then((list) => {
        if (alive) applySlots(list);
      })
      .catch((e) => {
        if (alive) failed(e, "Could not load times.");
      });
    return () => {
      alive = false;
    };
  }, [fetchSlots, applySlots, failed]);

  // Retry / refresh-after-409, driven by a user action rather than an effect.
  const load = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      applySlots(await fetchSlots());
    } catch (e) {
      failed(e, "Could not load times.");
    }
  }, [fetchSlots, applySlots, failed]);

  const days = useMemo(() => [...new Set(slots.map(dayKey))], [slots, dayKey]);
  const times = useMemo(() => slots.filter((s) => dayKey(s) === day), [slots, day, dayKey]);

  async function book() {
    if (!chosen) return;
    setState("booking");
    try {
      const res = await fetch("/api/growth-audit/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, start: chosen, timezone: tz }),
      });
      const json = await res.json();
      if (res.status === 409) {
        // Someone took it between render and submit — refresh and let them repick.
        setChosen(null);
        await load();
        setError(json.error || "That time was just taken — pick another.");
        return;
      }
      if (!res.ok || !json.ok) throw new Error(json.error || "We could not book that time.");
      setBooked({ start: json.start, meetLink: json.meetLink ?? null });
      setState("booked");
      // The conversion is the meeting, not the form fill.
      trackBookingConfirmed({ meetingType: "Growth Audit" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not book that time.");
      setState("error");
    }
  }

  if (state === "booked" && booked) {
    return (
      <Bevel bevel={18} border={GLASS_BORDER} bg={GLASS_BG}>
        <div className="px-6 py-8 text-center sm:px-9">
          <h1
            className="text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]"
            style={{ fontFamily: DISPLAY }}
          >
            You&rsquo;re booked.
          </h1>
          <p className="mt-3 text-[1.05rem] text-ink/75">
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: tz,
              timeZoneName: "short",
            }).format(new Date(booked.start))}
          </p>
          <p className="mt-3 text-[0.95rem] text-ink/55">
            The calendar invite is on its way to your inbox
            {booked.meetLink ? ", with the video link in it." : "."}
          </p>
          {booked.meetLink && (
            <p className="mt-5">
              <a href={booked.meetLink} className="underline" target="_blank" rel="noreferrer">
                Join link
              </a>
            </p>
          )}
        </div>
      </Bevel>
    );
  }

  return (
    <Bevel bevel={18} border={GLASS_BORDER} bg={GLASS_BG}>
      <div className="px-5 py-7 sm:px-8 sm:py-9">
        <h1 className="text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
          Nice one, {firstName} — pick your time.
        </h1>
        <p className="mt-2 text-[0.98rem] text-ink/60">
          Thirty minutes with Sufyan. Times shown in {tz.replace(/_/g, " ")}.
        </p>

        {state === "loading" && <p className="mt-6 text-ink/55">Loading available times&hellip;</p>}

        {state === "error" && (
          <div className="mt-6">
            <p className="text-[0.95rem] text-[#ff6b81]" role="alert">
              {error}
            </p>
            <p className="mt-2 text-[0.95rem] text-ink/60">
              We have your details either way — we&rsquo;ll email you some times.
            </p>
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={() => void load()}>
                Try again
              </Button>
            </div>
          </div>
        )}

        {(state === "ready" || state === "booking") && days.length === 0 && (
          <p className="mt-6 text-ink/60">
            No times are open in the next two weeks — we&rsquo;ll email you some options instead.
          </p>
        )}

        {(state === "ready" || state === "booking") && days.length > 0 && (
          <>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Day">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={d === day}
                  onClick={() => {
                    setDay(d);
                    setChosen(null);
                  }}
                  className={`bv-6 shrink-0 px-4 py-2 text-[0.9rem] transition-colors ${
                    d === day ? "bg-brand-blue text-white" : "bg-surface text-ink/70 hover:text-ink"
                  }`}
                >
                  {dayLabel(d)}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {times.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setChosen(s)}
                  aria-pressed={chosen === s}
                  className={`bv-6 min-h-[46px] px-3 py-2 text-[0.95rem] transition-colors ${
                    chosen === s ? "bg-brand-blue text-white" : "bg-surface text-ink/80 hover:text-ink"
                  }`}
                >
                  {timeLabel(s)}
                </button>
              ))}
            </div>

            {error && (
              <p className="mt-4 text-[0.9rem] text-[#ff6b81]" role="alert">
                {error}
              </p>
            )}

            <div className="mt-7">
              <Button
                variant="primary"
                size="lg"
                className="w-full disabled:cursor-default disabled:opacity-55 disabled:hover:translate-y-0"
                disabled={!chosen || state === "booking"}
                onClick={() => void book()}
              >
                {state === "booking" ? "Booking…" : "Confirm my time"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Bevel>
  );
}
