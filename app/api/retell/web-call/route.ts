import Retell from "retell-sdk";

// Mints a short-lived (~30s) Retell web-call access token for the in-browser voice widget.
// The RETELL_API_KEY never leaves the server. Returns 503 (not an error page) when the agent
// isn't configured yet, so the widget cleanly falls back to the "Book a call" link.
export const runtime = "nodejs";

// Best-effort in-memory rate limit (per warm instance) so the public endpoint can't be
// hammered into minting unlimited calls. Not a security boundary — just a guard rail.
const HITS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = HITS.get(ip);
  if (!entry || now > entry.resetAt) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const apiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.RETELL_AGENT_ID;

  // Not provisioned yet → tell the client to use the booking fallback.
  if (!apiKey || !agentId) {
    return Response.json({ error: "voice_unconfigured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const client = new Retell({ apiKey });
    const webCall = await client.call.createWebCall({ agent_id: agentId });
    // Only the short-lived access token crosses to the browser — never the API key.
    return Response.json({ accessToken: webCall.access_token, callId: webCall.call_id });
  } catch (err) {
    console.error("[web-call] failed to create Retell web call:", err);
    return Response.json({ error: "create_failed" }, { status: 502 });
  }
}
