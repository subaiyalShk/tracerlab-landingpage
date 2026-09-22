import { NextResponse } from "next/server";
import { read } from "../../../(tracerlabs)/growth-audit/_lib/bookingToken";

// Books the slot the visitor picked.
//
// The person being booked comes from the encrypted token, never from the
// request body — otherwise anyone could put a meeting in someone else's name.
export const runtime = "nodejs";

function dealflow(path: string): string | null {
  const intake = process.env.DEALFLOW_INTAKE_URL;
  if (!intake) return null;
  return intake.replace(/\/api\/leads\/intake\/?$/, path);
}

export async function POST(request: Request) {
  const url = dealflow("/api/calendar/book");
  const secret = process.env.DEALFLOW_INTAKE_SECRET;
  if (!url || !secret) {
    return NextResponse.json({ ok: false, error: "Booking is not configured." }, { status: 503 });
  }

  let body: { token?: string; start?: string; timezone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const lead = read(String(body.token || ""));
  if (!lead) {
    return NextResponse.json({ ok: false, error: "This booking link has expired." }, { status: 401 });
  }
  if (!body.start) {
    return NextResponse.json({ ok: false, error: "Pick a time first." }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-intake-secret": secret },
      body: JSON.stringify({
        start: body.start,
        timezone: body.timezone,
        leadId: lead.leadId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json().catch(() => ({}));
    if (res.status === 409) {
      // Two shapes of 409: the slot filled up, or the time was never on offer
      // (only reachable by a crafted request). Pass the upstream reason through
      // — both are safe to show and the distinction helps when debugging.
      const reason = typeof json.error === "string" && json.error ? json.error : "That time was just taken";
      return NextResponse.json({ ok: false, error: `${reason} — pick another.` }, { status: 409 });
    }
    if (!res.ok || !json.success) {
      console.error("[growth-audit/book] dealflow said", res.status, json);
      return NextResponse.json({ ok: false, error: "We could not book that time." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, start: json.start, meetLink: json.meetLink ?? null });
  } catch (err) {
    console.error("[growth-audit/book] unreachable:", err);
    return NextResponse.json({ ok: false, error: "We could not book that time." }, { status: 502 });
  }
}
