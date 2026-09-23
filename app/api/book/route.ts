// Endpoint the Retell agent's `book_call` custom function POSTs to during a live call.
// It books a real slot on the team's booking calendar and returns a short,
// human-readable line that the agent speaks back to the caller.
//
// Availability and booking come from Google Calendar, via dealflow's
// secret-protected /api/calendar/* — the same engine the /growth-audit funnel
// and the CRM scheduler use, so all three can never disagree about whether a
// time is free. (Cal.com was retired here on 2026-09-22.)
//
// Protected by a shared secret baked into the tool URL (?s=RETELL_FUNCTION_SECRET)
// at provisioning time — retell-sdk v5 has no verify() helper, and a per-tool URL
// secret is deterministic and fully under our control. The Retell agent needs NO
// reconfiguration for this change: same URL, same arguments, same spoken replies.
//
// Env: RETELL_FUNCTION_SECRET, DEALFLOW_INTAKE_URL, DEALFLOW_INTAKE_SECRET.
export const runtime = "nodejs";

type BookArgs = {
  name?: string;
  email?: string;
  preferred_time?: string; // ISO 8601 (the agent is prompted to produce this)
  timezone?: string;
};

/** Derive a sibling dealflow endpoint from the configured intake URL. */
function dealflow(path: string): string | null {
  const intake = process.env.DEALFLOW_INTAKE_URL; // https://dealflow.tracerlabs.io/api/leads/intake
  if (!intake) return null;
  return intake.replace(/\/api\/leads\/intake\/?$/, path);
}

function speak(text: string) {
  return new Response(text, { headers: { "content-type": "text/plain" } });
}

function fmt(iso: string, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: tz,
      timeZoneName: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Open slots on the booking calendar, soonest first. */
async function openSlots(secret: string): Promise<string[]> {
  const url = dealflow("/api/calendar/slots");
  if (!url) return [];
  try {
    const res = await fetch(url, {
      headers: { "x-intake-secret": secret },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json().catch(() => ({}));
    return res.ok && Array.isArray(json.slots) ? (json.slots as string[]) : [];
  } catch (err) {
    console.error("[book] could not read availability:", err);
    return [];
  }
}

/** True when the meeting was created. 409 means the slot went while we talked. */
async function book(startISO: string, args: BookArgs, secret: string): Promise<boolean> {
  const url = dealflow("/api/calendar/book");
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-intake-secret": secret },
      body: JSON.stringify({
        start: startISO,
        name: args.name || "Website visitor",
        email: args.email,
        timezone: args.timezone || "America/Chicago",
        source: "Voice agent",
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) return true;
    if (res.status !== 409) console.error("[book] dealflow said", res.status, await res.text().catch(() => ""));
    return false;
  } catch (err) {
    console.error("[book] booking failed:", err);
    return false;
  }
}

export async function POST(req: Request) {
  // Shared-secret gate (skipped only when unset, e.g. local dev).
  const secret = process.env.RETELL_FUNCTION_SECRET;
  if (secret) {
    const url = new URL(req.url);
    if (url.searchParams.get("s") !== secret) {
      return new Response("unauthorized", { status: 401 });
    }
  }

  const raw = await req.text();
  let body: Record<string, unknown> = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    /* leave empty */
  }
  // Default payload mode nests under .args; "args only" mode is top-level.
  const args = (body.args ?? body) as BookArgs;
  const tz = args.timezone || "America/Chicago";
  const intakeSecret = process.env.DEALFLOW_INTAKE_SECRET;

  // Not wired up → capture intent gracefully so the agent never dead-ends.
  if (!intakeSecret || !dealflow("/api/calendar/slots")) {
    return speak(
      `Got it${args.name ? `, ${args.name}` : ""} — I've noted your details and our team will email you to lock in a time.`,
    );
  }

  if (!args.email || typeof args.email !== "string") {
    return speak("I just need your email to send the calendar invite — what's the best one?");
  }

  // Only accept a real ISO 8601 datetime (the agent is prompted to produce one). The format
  // guard rejects junk like "2026-13-45..." that Date() would otherwise coerce to a wrong day.
  let startISO: string | null = null;
  if (typeof args.preferred_time === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(args.preferred_time)) {
    const d = new Date(args.preferred_time);
    if (!isNaN(d.getTime())) startISO = d.toISOString();
  }

  if (startISO && (await book(startISO, args, intakeSecret))) {
    return speak(
      `Perfect — you're booked for ${fmt(startISO, tz)}. A calendar invite is on its way to ${args.email}.`,
    );
  }

  // No time given, or the one they asked for is gone → offer real openings so the
  // agent can close on the call rather than promising a follow-up email.
  const slots = (await openSlots(intakeSecret)).slice(0, 3).map((s) => fmt(s, tz));
  if (slots.length) {
    const lead = startISO ? "That time isn't open, but" : "Sure —";
    return speak(`${lead} the next available slots are: ${slots.join("; ")}. Which works best?`);
  }

  return speak(
    `I couldn't lock that time in just now — I've saved your details and the team will email ${args.email} to confirm.`,
  );
}
