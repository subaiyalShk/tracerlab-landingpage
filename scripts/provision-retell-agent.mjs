// One-off: provision the "Tracer discovery" Retell agent used by the site's voice CTA.
// Creates a Retell LLM (discovery prompt + book_call custom tool) and an agent pointing at it.
//
// Usage (from repo root, with vars in your shell or .env.local exported):
//   RETELL_API_KEY=...  SITE_URL=https://your-preview.vercel.app  RETELL_FUNCTION_SECRET=...  \
//   node scripts/provision-retell-agent.mjs
//
// Then copy the printed agent_id into RETELL_AGENT_ID (env). The book_call tool calls
// `${SITE_URL}/api/book?s=${RETELL_FUNCTION_SECRET}` — SITE_URL must be PUBLICLY reachable
// by Retell's servers (a Vercel preview/prod URL, or a tunnel — not bare localhost).
import Retell from "retell-sdk";

const { RETELL_API_KEY, SITE_URL, RETELL_FUNCTION_SECRET } = process.env;
const VOICE_ID = process.env.RETELL_VOICE_ID || "11labs-Adrian"; // configurable

if (!RETELL_API_KEY) throw new Error("RETELL_API_KEY is required");
if (!SITE_URL) throw new Error("SITE_URL is required (public URL Retell can reach, e.g. a Vercel preview)");
if (!/^https:\/\//.test(SITE_URL) || /localhost|127\.0\.0\.1/.test(SITE_URL)) {
  console.warn("⚠️  SITE_URL looks non-public. Retell's servers must reach /api/book — use a Vercel/preview URL or a tunnel.");
}
if (!RETELL_FUNCTION_SECRET) console.warn("⚠️  RETELL_FUNCTION_SECRET not set — /api/book will be unprotected unless you set it.");

const bookUrl = `${SITE_URL.replace(/\/$/, "")}/api/book${RETELL_FUNCTION_SECRET ? `?s=${encodeURIComponent(RETELL_FUNCTION_SECRET)}` : ""}`;

const GENERAL_PROMPT = `You are the AI concierge for Tracerlabs, an AI development studio that builds voice agents, web & mobile apps, and AI go-to-market systems. You are talking to a prospective client who clicked "Talk to our AI" on the website — so you ARE a live demo of what Tracerlabs builds.

Goal: run a warm, fast discovery (~2 minutes) and then BOOK a call before hanging up.

Style: friendly, sharp, concise. One question at a time. Don't ramble. Sound human.

Flow:
1. Greet briefly and set expectation: "Hey! I'm Tracerlabs' AI — a couple quick questions and I'll get you booked with the team."
2. Ask what they're looking to build or the problem they're trying to solve.
3. Ask their rough timeline.
4. Ask their rough budget band (it's fine if they're unsure).
5. Get their name and email (confirm the email back, spelled if unclear).
6. Ask what day/time works for a call, and their timezone. Convert their answer to an ISO 8601 datetime.
7. Call the book_call function with name, email, preferred_time (ISO 8601), and timezone.
8. Speak back the confirmation the function returns. If it offers alternative times, read them and ask which works, then call book_call again with the chosen time.
9. Thank them warmly and end the call.

Rules: Stay on topic (Tracerlabs projects/booking). If asked something off-scope, answer briefly and steer back. Never invent pricing or promises — the discovery call covers specifics. Keep the whole thing under ~2 minutes.`;

const client = new Retell({ apiKey: RETELL_API_KEY });

const llm = await client.llm.create({
  general_prompt: GENERAL_PROMPT,
  general_tools: [
    {
      type: "custom",
      name: "book_call",
      description:
        "Book a discovery call on Tracerlabs' calendar at the end of the conversation. Provide an ISO 8601 datetime and IANA timezone. Returns a confirmation or alternative time slots to offer.",
      url: bookUrl,
      method: "POST",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Caller's full name" },
          email: { type: "string", description: "Caller's email for the calendar invite" },
          preferred_time: { type: "string", description: "Requested call time as ISO 8601, e.g. 2026-06-15T14:00:00-05:00" },
          timezone: { type: "string", description: "Caller's IANA timezone, e.g. America/Chicago" },
        },
        required: ["name", "email", "preferred_time", "timezone"],
      },
      speak_during_execution: true,
      execution_message_description: "Great — let me get that booked for you...",
      speak_after_execution: true,
      timeout_ms: 15000,
    },
  ],
});

const agent = await client.agent.create({
  response_engine: { type: "retell-llm", llm_id: llm.llm_id },
  voice_id: VOICE_ID,
  agent_name: "Tracer discovery (site CTA)",
});

console.log("\n✅ Provisioned.\n");
console.log("  llm_id   :", llm.llm_id);
console.log("  agent_id :", agent.agent_id);
console.log("  book_call → ", bookUrl);
console.log("\nNext:");
console.log("  1) Set RETELL_AGENT_ID =", agent.agent_id, "in your env (.env.local + Vercel).");
console.log("  2) Ensure CALCOM_API_KEY + CALCOM_EVENT_TYPE_ID are set so booking works.");
console.log("  3) Pick/adjust the voice in the Retell dashboard if desired (current:", VOICE_ID + ").");
