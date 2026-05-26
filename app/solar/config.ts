// ─────────────────────────────────────────────────────────────────────────────
// Solar funnel content config.
//
// ⚠️  PLACEHOLDER DATA: items marked `PLACEHOLDER` use illustrative figures/quotes.
//     Replace them with verified Southern Energy results before this page goes live.
//     The qualitative narrative ("consistent prospects & conversions without a
//     door-to-door team") is accurate and safe to keep as-is.
// ─────────────────────────────────────────────────────────────────────────────

/** Where every CTA sends the visitor. Swap for a solar-specific Calendly/booking link. */
export const BOOKING_URL = "https://dealflow.tracerlabs.io/lead-intake";

/** Headline proof stats. The two marked PLACEHOLDER need real numbers. */
export const PROOF_STATS: { value: string; label: string; placeholder?: boolean }[] = [
  { value: "40+", label: "Qualified appointments / month", placeholder: true },
  { value: "0", label: "Door-knockers required" },
  { value: "24/7", label: "AI agent booking calls" },
  { value: "3.2×", label: "Pipeline vs. canvassing", placeholder: true },
];

/** Replace the bracketed text with a real, approved quote from the Southern Energy owner. */
export const TESTIMONIAL = {
  quote:
    "[Add a 1–2 sentence quote from the Southern Energy owner about the consistent, predictable pipeline this system created.]",
  name: "Owner",
  company: "Southern Energy",
  placeholder: true,
};

/** Onboarding scarcity line near the final CTA. Adjust to your real capacity. */
export const SCARCITY = "We onboard a limited number of solar installers each month.";
