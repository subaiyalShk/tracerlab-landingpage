import { NextResponse } from "next/server";
import { mint } from "../../(tracerlabs)/growth-audit/_lib/bookingToken";

// Growth Audit funnel lead intake (/growth-audit form).
//
// Validates the payload, then forwards it to dealflow's server-to-server intake
// (POST /api/leads/intake, shared secret) which creates the business → contact →
// lead in the CRM and emails the team. The lead is always logged here first, so if
// dealflow is unreachable nothing is lost and the visitor still sees "You're in."
//
// Vercel Production env: DEALFLOW_INTAKE_URL (e.g. https://dealflow.tracerlabs.io/api/leads/intake),
// DEALFLOW_INTAKE_SECRET (must match dealflow's LEAD_INTAKE_SECRET). Both bind at build time.

type LeadPayload = Record<string, unknown>;

const REQUIRED = ["name", "phone", "email", "business_type", "ad_spend"] as const;
const SOURCE_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid", "gclid"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEAD_SOURCE = "Growth Audit funnel";

async function forwardToDealflow(lead: Record<string, string>): Promise<string | null> {
  const url = process.env.DEALFLOW_INTAKE_URL;
  const secret = process.env.DEALFLOW_INTAKE_SECRET;
  if (!url || !secret) {
    console.warn("[growth-audit-lead] DEALFLOW_INTAKE_URL/SECRET not set — lead logged only");
    return null;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-intake-secret": secret },
      body: JSON.stringify({ ...lead, source: LEAD_SOURCE }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[growth-audit-lead] dealflow rejected lead:", res.status, await res.text().catch(() => ""));
      return null;
    }
    // The lead id is what lets the visitor book: it ties the appointment back to this lead.
    const json = (await res.json().catch(() => ({}))) as { lead_id?: string };
    return json.lead_id ?? null;
  } catch (err) {
    console.error("[growth-audit-lead] dealflow unreachable:", err);
    return null;
  }
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Required-field + format validation (defense in depth; the form validates too).
  const missing = REQUIRED.filter((k) => {
    const v = body[k];
    return typeof v !== "string" || v.trim() === "";
  });
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(body.email as string)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }
  if ((body.phone as string).replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "Please enter a number we can text." }, { status: 400 });
  }

  // Keep only the fields we expect — the client can't smuggle extra keys downstream.
  const pick = (keys: readonly string[]) =>
    Object.fromEntries(keys.filter((k) => typeof body[k] === "string").map((k) => [k, (body[k] as string).trim()]));

  const lead = { ...pick(REQUIRED), ...pick(SOURCE_KEYS) } as Record<string, string>;

  // Log first: this is the fallback record if the CRM hand-off fails.
  console.log("[growth-audit-lead] new lead", JSON.stringify({ ...lead, submittedAt: new Date().toISOString() }));

  const leadId = await forwardToDealflow(lead);
  if (!leadId) console.error("[growth-audit-lead] NOT in dealflow — recover from this log:", lead.email);

  // No lead id means no booking step: the client falls back to the plain
  // thank-you state rather than opening a booking page that cannot book.
  let token: string | undefined;
  if (leadId && process.env.BOOKING_TOKEN_SECRET) {
    try {
      token = mint({ leadId, name: lead.name, email: lead.email, phone: lead.phone });
    } catch (err) {
      console.error("[growth-audit-lead] could not mint booking token:", err);
    }
  }

  return NextResponse.json({ ok: true, ...(token ? { token } : {}) });
}
