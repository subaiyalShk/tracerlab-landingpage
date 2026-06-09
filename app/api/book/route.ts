// Endpoint the Retell agent's `book_call` custom function POSTs to during a live call.
// It books a real Cal.com slot and returns a short, human-readable line that the agent
// speaks back to the caller. Protected by a shared secret baked into the tool URL
// (?s=RETELL_FUNCTION_SECRET) at provisioning time — retell-sdk v5 has no verify() helper,
// and a per-tool URL secret is deterministic and fully under our control.
//
// Env (shared with the Tracerlabs sales dashboard's Cal.com account):
//   CAL_API_KEY              cal_live_… (server only)
//   CAL_EVENT_TYPE_SLUG      e.g. "discovery-call"   ┐ team event:
//   CAL_TEAM_SLUG            e.g. "tracerlabs"        ┘ slug + team
//   CAL_USERNAME             (alt to team: slug + username for a personal event)
//   CAL_EVENT_TYPE_ID        (alt: numeric id; takes precedence if set)
export const runtime = "nodejs";

const CAL_BASE = "https://api.cal.com/v2";
const CAL_KEY = process.env.CAL_API_KEY;

type BookArgs = {
  name?: string;
  email?: string;
  preferred_time?: string; // ISO 8601 (the agent is prompted to produce this)
  timezone?: string;
};

// One of: { eventTypeId } | { eventTypeSlug, teamSlug } | { eventTypeSlug, username }.
function eventTarget(): Record<string, string | number> | null {
  const id = process.env.CAL_EVENT_TYPE_ID;
  if (id) return { eventTypeId: Number(id) };
  const slug = process.env.CAL_EVENT_TYPE_SLUG;
  const team = process.env.CAL_TEAM_SLUG;
  const user = process.env.CAL_USERNAME;
  if (slug && team) return { eventTypeSlug: slug, teamSlug: team };
  if (slug && user) return { eventTypeSlug: slug, username: user };
  return null;
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

async function calBook(startISO: string, args: BookArgs, target: Record<string, string | number>): Promise<boolean> {
  const res = await fetch(`${CAL_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CAL_KEY}`,
      "cal-api-version": "2024-08-13",
    },
    body: JSON.stringify({
      ...target,
      start: startISO,
      attendee: {
        name: args.name || "Website visitor",
        email: args.email,
        timeZone: args.timezone || "America/Chicago",
        language: "en",
      },
      metadata: { source: "tracerlabs-site-voice-cta" },
    }),
  });
  return res.ok;
}

async function calSuggest(tz: string, target: Record<string, string | number>): Promise<string[]> {
  const now = new Date();
  const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    start: now.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    timeZone: tz,
  });
  for (const [k, v] of Object.entries(target)) params.append(k, String(v));
  const res = await fetch(`${CAL_BASE}/slots?${params}`, {
    headers: {
      Authorization: `Bearer ${CAL_KEY}`,
      "cal-api-version": "2024-09-04", // NB: different version than /bookings
    },
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  const byDay = json?.data ?? {};
  const starts: string[] = [];
  for (const day of Object.keys(byDay)) {
    for (const slot of byDay[day] || []) {
      if (slot?.start) starts.push(slot.start);
      if (starts.length >= 3) break;
    }
    if (starts.length >= 3) break;
  }
  return starts.map((s) => fmt(s, tz));
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

  const target = eventTarget();

  // Not wired to Cal.com yet → capture intent gracefully so the agent never dead-ends.
  if (!CAL_KEY || !target) {
    return new Response(
      `Got it${args.name ? `, ${args.name}` : ""} — I've noted your details and our team will email you to lock in a time.`,
      { headers: { "content-type": "text/plain" } },
    );
  }

  if (!args.email || typeof args.email !== "string") {
    return new Response("I just need your email to send the calendar invite — what's the best one?", {
      headers: { "content-type": "text/plain" },
    });
  }

  // Only accept a real ISO 8601 datetime (the agent is prompted to produce one). The format
  // guard rejects junk like "2026-13-45..." that Date() would otherwise coerce to a wrong day.
  let startISO: string | null = null;
  if (typeof args.preferred_time === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(args.preferred_time)) {
    const d = new Date(args.preferred_time);
    if (!isNaN(d.getTime())) startISO = d.toISOString();
  }

  if (startISO && (await calBook(startISO, args, target))) {
    return new Response(`Perfect — you're booked for ${fmt(startISO, tz)}. A calendar invite is on its way to ${args.email}.`, {
      headers: { "content-type": "text/plain" },
    });
  }

  // Couldn't book the requested time (taken/invalid/none given) → offer real openings.
  const suggestions = await calSuggest(tz, target);
  if (suggestions.length) {
    return new Response(
      `That time isn't open, but the next available slots are: ${suggestions.join("; ")}. Which works best?`,
      { headers: { "content-type": "text/plain" } },
    );
  }

  return new Response(
    `I couldn't lock that time in just now — I've saved your details and the team will email ${args.email} to confirm.`,
    { headers: { "content-type": "text/plain" } },
  );
}
