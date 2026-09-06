// Retell general webhook — the transcript/notification pipeline for the site's
// voice CTA. Retell POSTs lifecycle events here; on `call_analyzed` (fires once
// per call, after transcript + post-call analysis are ready) we:
//   1. SMS the founders complete call details + recording link (Twilio).
//   2. Email the full transcript + analysis to the team inbox (Resend, jarvis@).
// Protected the same way as /api/book: shared secret in the URL (?s=…) since
// retell-sdk v5 ships no webhook signature verifier. Responses to general
// webhooks are ignored by Retell, so we always 200 quickly and do the sends
// before returning (serverless — no work survives the response).
//
// Env:
//   RETELL_FUNCTION_SECRET   shared secret baked into the webhook URL
//   RETELL_AGENT_ID          only calls from this agent notify
//   TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER
//   NOTIFY_SMS_NUMBERS       comma-separated E.164 list
//   RESEND_API_KEY           jarvis@tracerlabs.io sender
//   NOTIFY_EMAILS            comma-separated recipient list
export const runtime = "nodejs";

type RetellCall = {
  call_id?: string;
  agent_id?: string;
  call_type?: string;
  call_status?: string;
  disconnection_reason?: string;
  start_timestamp?: number;
  duration_ms?: number;
  transcript?: string;
  recording_url?: string;
  call_analysis?: {
    call_summary?: string;
    user_sentiment?: string;
    call_successful?: boolean;
    custom_analysis_data?: Record<string, unknown>;
  };
};

function fmtDuration(ms?: number): string {
  const s = Math.round((ms ?? 0) / 1000);
  return `${Math.floor(s / 60)}m${(s % 60).toString().padStart(2, "0")}s`;
}

function fmtWhen(ts?: number): string {
  if (!ts) return "unknown time";
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    timeZone: "America/Chicago", timeZoneName: "short",
  }).format(new Date(ts));
}

async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) return false;
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  });
  if (!res.ok) console.error("[retell-webhook] SMS failed", to, res.status, await res.text().catch(() => ""));
  return res.ok;
}

async function sendEmail(subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.NOTIFY_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);
  if (!key || to.length === 0) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Jarvis <jarvis@tracerlabs.io>", to, subject, html }),
  });
  if (!res.ok) console.error("[retell-webhook] email failed", res.status, await res.text().catch(() => ""));
  return res.ok;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: Request) {
  const secret = process.env.RETELL_FUNCTION_SECRET;
  if (secret) {
    const url = new URL(req.url);
    if (url.searchParams.get("s") !== secret) return new Response("unauthorized", { status: 401 });
  }

  let payload: { event?: string; call?: RetellCall } = {};
  try {
    payload = await req.json();
  } catch {
    return Response.json({ received: true });
  }

  // Only the analyzed event carries the finished transcript + analysis, and it
  // fires exactly once — so it's the single notification trigger (no dupes).
  if (payload.event !== "call_analyzed") return Response.json({ received: true });

  const call = payload.call ?? {};
  if (process.env.RETELL_AGENT_ID && call.agent_id !== process.env.RETELL_AGENT_ID) {
    return Response.json({ received: true });
  }
  // Ghost calls (token minted, mic never joined, instant hangup) aren't leads.
  if (!call.transcript || (call.duration_ms ?? 0) < 5000) {
    return Response.json({ received: true, skipped: "no_conversation" });
  }

  const a = call.call_analysis ?? {};
  const custom = (a.custom_analysis_data ?? {}) as Record<string, unknown>;
  const field = (k: string) => {
    const v = custom[k];
    return typeof v === "string" && v.trim() && v.trim().toLowerCase() !== "unknown" ? v.trim() : null;
  };
  const name = field("caller_name");
  const email = field("caller_email");
  const project = field("project");
  const timeline = field("timeline");
  const budget = field("budget");
  const booked = custom["booked_call"] === true || custom["booked_call"] === "true";

  const lines = [
    `Tracerlabs voice CTA — ${booked ? "BOOKED a discovery call ✅" : "call ended (no booking)"}`,
    `${fmtWhen(call.start_timestamp)} · ${fmtDuration(call.duration_ms)}`,
    name ? `Name: ${name}` : "Name: not captured",
    email ? `Email: ${email}` : "Email: not captured",
    project ? `Wants: ${project}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    budget ? `Budget: ${budget}` : null,
    a.call_summary ? `Summary: ${a.call_summary}` : null,
    call.recording_url ? `Recording: ${call.recording_url}` : null,
  ].filter(Boolean);
  const smsBody = lines.join("\n").slice(0, 1500);

  const smsTargets = (process.env.NOTIFY_SMS_NUMBERS || "").split(",").map((n) => n.trim()).filter(Boolean);
  const smsResults = await Promise.all(smsTargets.map((n) => sendSms(n, smsBody)));

  const html = `
    <h2 style="margin:0 0 4px">Voice CTA call — ${booked ? "✅ discovery call BOOKED" : "no booking"}</h2>
    <p style="color:#555;margin:0 0 16px">${esc(fmtWhen(call.start_timestamp))} · ${fmtDuration(call.duration_ms)} · sentiment: ${esc(a.user_sentiment ?? "n/a")}</p>
    <table style="border-collapse:collapse">
      ${[["Name", name], ["Email", email], ["Wants", project], ["Timeline", timeline], ["Budget", budget]]
        .map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#888">${k}</td><td>${esc(v ?? "—")}</td></tr>`)
        .join("")}
    </table>
    ${a.call_summary ? `<p><strong>Summary:</strong> ${esc(a.call_summary)}</p>` : ""}
    ${call.recording_url ? `<p><a href="${esc(call.recording_url)}">▶ Listen to the recording</a></p>` : ""}
    <h3 style="margin:20px 0 6px">Transcript</h3>
    <pre style="white-space:pre-wrap;font-family:inherit;background:#f6f6f6;padding:12px;border-radius:6px">${esc(call.transcript)}</pre>
    <p style="color:#999;font-size:12px">call_id ${esc(call.call_id ?? "")}</p>`;
  const emailOk = await sendEmail(
    `Voice CTA: ${booked ? "booked ✅" : "call"} — ${name ?? "unknown caller"}${project ? ` · ${project.slice(0, 60)}` : ""}`,
    html,
  );

  return Response.json({ received: true, sms: smsResults.filter(Boolean).length, email: emailOk });
}
