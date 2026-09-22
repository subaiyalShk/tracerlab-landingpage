import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

// The Growth Audit booking link carries who the visitor is, so the booking page
// can greet them and the booking call can identify the CRM lead.
//
// The payload is ENCRYPTED (AES-256-GCM), not merely signed: the token travels
// in a URL, and a signed-but-readable payload would leak the lead's name, email
// and phone into browser history, Referer headers and anything that logs URLs.
// GCM also authenticates, so tampering fails closed.
//
// Server-only — BOOKING_TOKEN_SECRET must never reach the client.

export interface BookingPayload {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  /** Epoch ms after which the token is refused. */
  exp: number;
}

export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const IV_BYTES = 12;
const TAG_BYTES = 16;

function keyFrom(secret: string): Buffer {
  // The env var is an arbitrary string; hash it to the 32 bytes AES-256 needs.
  return createHash("sha256").update(secret).digest();
}

function secretOrThrow(explicit?: string): string {
  const s = explicit ?? process.env.BOOKING_TOKEN_SECRET;
  if (!s) throw new Error("BOOKING_TOKEN_SECRET is not set");
  return s;
}

export function mint(
  p: Omit<BookingPayload, "exp">,
  opts: { ttlMs?: number; now?: number; secret?: string } = {},
): string {
  const now = opts.now ?? Date.now();
  const payload: BookingPayload = { ...p, exp: now + (opts.ttlMs ?? TOKEN_TTL_MS) };
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", keyFrom(secretOrThrow(opts.secret)), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

/** Returns null for anything we will not honour — bad key, tampering, expiry, junk. */
export function read(token: string, opts: { now?: number; secret?: string } = {}): BookingPayload | null {
  try {
    if (!token) return null;
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= IV_BYTES + TAG_BYTES) return null;
    const iv = raw.subarray(0, IV_BYTES);
    const tag = raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
    const body = raw.subarray(IV_BYTES + TAG_BYTES);
    const decipher = createDecipheriv("aes-256-gcm", keyFrom(secretOrThrow(opts.secret)), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
    const parsed = JSON.parse(json) as BookingPayload;
    if (typeof parsed?.exp !== "number" || (opts.now ?? Date.now()) > parsed.exp) return null;
    if (!parsed.leadId || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}
