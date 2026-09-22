import { NextResponse } from "next/server";

// Growth Audit funnel lead intake (/growth-audit form).
//
// ⚠️ STUB — same shape as /api/solar-lead: validates the payload and logs the lead,
// then returns success so the form works end-to-end. Wire the real destination here
// when ready — pick ONE (or more):
//   • Resend  → email the lead to jarvis@tracerlabs.io
//   • dealflow → forward to the existing intake/CRM webhook
//   • the AI texting agent → kick off the "we'll text you in minutes" follow-up
// None of these are called yet, so no keys are required to run the form.

type LeadPayload = Record<string, unknown>;

const REQUIRED = ["name", "phone", "email", "business_type", "ad_spend"] as const;
const SOURCE_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid", "gclid"] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const lead = {
    ...pick(REQUIRED),
    source: { channel: "growth-audit-funnel", ...pick(SOURCE_KEYS) },
    submittedAt: new Date().toISOString(),
  };

  // TODO: replace this log with the real destination (Resend / dealflow / texting agent).
  console.log("[growth-audit-lead] new lead", JSON.stringify(lead));

  return NextResponse.json({ ok: true });
}
