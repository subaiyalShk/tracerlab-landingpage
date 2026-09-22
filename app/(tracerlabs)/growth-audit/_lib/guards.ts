// Bot guards for the public Growth Audit form.
//
// The rule that makes these work: a caught submission gets the SAME response a
// human gets — `{ ok: true }`, the thank-you card, no hint about which guard
// fired. A bot that can tell it was blocked will iterate until it isn't.
//
// None of these is a security boundary; they are the cheap layers that stopped
// the Harbs Farm contact-form spam (honeypot + fill time + per-IP limit). If
// determined bots get through, the escalation is Cloudflare Turnstile.
//
// Every drop is logged with the payload at the call site, so a real person who
// trips a guard — fast autofill, a shared office IP — can still be recovered.

/** Faster than this and nobody typed five fields by hand. */
export const MIN_FILL_MS = 3_000;

export const RATE_LIMIT = { max: 5, windowMs: 10 * 60_000 };

export type SpamVerdict = "honeypot" | "too-fast" | "link-in-name" | null;

export interface Submission {
  name?: string;
  email?: string;
  phone?: string;
  /** Hidden honeypot field — invisible to people, irresistible to form-fillers. */
  company_website?: string;
  /** Epoch ms stamped by the client when the form rendered. */
  renderedAt?: number;
}

// Matches a URL or bare domain anywhere in the string. Real names never contain one.
const LINK_RE = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|ru|cn|xyz|top|info|biz)\b)/i;

export function spamVerdict(sub: Submission, opts: { now: number }): SpamVerdict {
  if (typeof sub.company_website === "string" && sub.company_website.trim() !== "") {
    return "honeypot";
  }

  // A missing, malformed or future timestamp is NOT evidence of a bot — it just
  // means we cannot measure. Only a measurably impossible fill time counts.
  const stamped = typeof sub.renderedAt === "number" && Number.isFinite(sub.renderedAt);
  if (stamped) {
    const elapsed = opts.now - (sub.renderedAt as number);
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) return "too-fast";
  }

  if (typeof sub.name === "string" && LINK_RE.test(sub.name)) return "link-in-name";

  return null;
}

// Per-instance, in-memory limiter. Serverless means several warm instances, so
// the real ceiling is a multiple of `max` — fine for a guard rail whose job is
// to stop a flood, not to be exact. (The same shape guards /api/retell/web-call.)
const HITS = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(ip: string, now: number = Date.now()): boolean {
  const entry = HITS.get(ip);
  if (!entry || now > entry.resetAt) {
    HITS.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

/** Test-only: the limiter is module state, so tests must start from a clean slate. */
export function __resetRateLimit(): void {
  HITS.clear();
}
