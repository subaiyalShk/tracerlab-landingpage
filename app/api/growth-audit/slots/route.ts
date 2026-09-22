import { NextResponse } from "next/server";

// Browser-facing proxy for the booking page's slot grid.
//
// Holds no Google credentials: it forwards to dealflow, which owns the calendar
// (see docs/superpowers/specs/2026-09-22-growth-audit-booking-design.md). The
// browser never talks to dealflow directly — that host is SSO-protected for
// anything but its custom domain.
export const runtime = "nodejs";

/** Derive a sibling dealflow endpoint from the configured intake URL. */
function dealflow(path: string): string | null {
  const intake = process.env.DEALFLOW_INTAKE_URL; // https://dealflow.tracerlabs.io/api/leads/intake
  if (!intake) return null;
  return intake.replace(/\/api\/leads\/intake\/?$/, path);
}

export async function GET() {
  const url = dealflow("/api/calendar/slots");
  const secret = process.env.DEALFLOW_INTAKE_SECRET;
  if (!url || !secret) {
    return NextResponse.json({ error: "Booking is not configured." }, { status: 503 });
  }
  try {
    const res = await fetch(url, {
      headers: { "x-intake-secret": secret },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      console.error("[growth-audit/slots] dealflow said", res.status, json);
      return NextResponse.json({ error: "Could not load times." }, { status: 502 });
    }
    return NextResponse.json({
      slots: json.slots as string[],
      timezone: json.timezone as string,
      durationMinutes: json.durationMinutes as number,
    });
  } catch (err) {
    console.error("[growth-audit/slots] unreachable:", err);
    return NextResponse.json({ error: "Could not load times." }, { status: 502 });
  }
}
