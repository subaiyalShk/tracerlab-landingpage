import { NextResponse } from "next/server";
import { scoreFit } from "@/app/solar/leadFields";

// Solar funnel lead intake.
//
// ⚠️ STUB: this validates the payload, scores internal fit, and logs the lead, then
// returns success so the form works end-to-end. Wire the real destination here when
// ready — pick ONE (or more):
//   • Resend  → email the lead to jarvis@tracerlabs.io (see the `resend-email` skill)
//   • Supabase → insert into a `solar_leads` table
//   • dealflow → forward to the existing intake/CRM webhook
// None of these are called yet, so no keys are required to run the form.

type LeadPayload = Record<string, unknown>;

const REQUIRED = ["firstName", "lastName", "email", "phone", "revenue", "salesReps", "blocker"] as const;
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
    return v === undefined || v === null || (typeof v === "string" && v.trim() === "");
  });
  if (missing.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 },
    );
  }
  if (typeof body.email !== "string" || !EMAIL_RE.test(body.email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
  }

  const fitTier = scoreFit({
    revenue: body.revenue as string,
    installsPerMonth: body.installsPerMonth as string,
    adSpend: body.adSpend as string,
  });

  const lead = {
    ...body,
    fitTier, // internal — for routing/prioritization, never shown to the prospect
    source: "solar-funnel",
    submittedAt: new Date().toISOString(),
  };

  // TODO: replace this log with the real destination (Resend / Supabase / dealflow).
  console.log("[solar-lead] new lead", JSON.stringify(lead));

  return NextResponse.json({ ok: true });
}
