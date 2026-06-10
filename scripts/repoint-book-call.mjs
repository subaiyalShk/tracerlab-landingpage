// Re-point the existing "Tracer discovery" LLM's book_call tool to a new origin without
// creating a new agent. Use after a production deploy so bookings hit prod, not the preview.
//   RETELL_API_KEY=... RETELL_FUNCTION_SECRET=... PROD_URL=https://www.tracerlabs.io \
//   node scripts/repoint-book-call.mjs
import Retell from "retell-sdk";

const { RETELL_API_KEY, RETELL_FUNCTION_SECRET } = process.env;
const LLM_ID = process.env.RETELL_LLM_ID || "llm_b906ca424f062a1dcec7f4e59cc3";
const SITE = (process.env.PROD_URL || "https://www.tracerlabs.io").replace(/\/$/, "");

if (!RETELL_API_KEY) throw new Error("RETELL_API_KEY required");

const bookUrl = `${SITE}/api/book${RETELL_FUNCTION_SECRET ? `?s=${encodeURIComponent(RETELL_FUNCTION_SECRET)}` : ""}`;
const client = new Retell({ apiKey: RETELL_API_KEY });

await client.llm.update(LLM_ID, {
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

console.log("✅ book_call re-pointed →", bookUrl.replace(/s=[^&]+/, "s=***"));
