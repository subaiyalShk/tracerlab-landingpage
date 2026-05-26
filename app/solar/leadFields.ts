// Option sets for the qualification form. Edit here to tune the funnel — the form,
// the API validation, and the fit scoring all read from these.

export const ROLES = [
  "Owner / Founder",
  "Partner / Co-owner",
  "Executive / GM",
  "Marketing lead",
  "Other",
] as const;

// value is used for fit scoring (index-ordered low→high); label is shown to the user.
export const REVENUE_RANGES = [
  "Under $50k / mo",
  "$50k – $100k / mo",
  "$100k – $250k / mo",
  "$250k – $500k / mo",
  "$500k – $1M / mo",
  "$1M+ / mo",
] as const;

export const DEAL_SIZE_RANGES = [
  "Under $10k",
  "$10k – $20k",
  "$20k – $35k",
  "$35k – $50k",
  "$50k+",
] as const;

export const INSTALLS_PER_MONTH = [
  "0 – 5",
  "6 – 15",
  "16 – 30",
  "31 – 60",
  "60+",
] as const;

export const AD_SPEND_RANGES = [
  "$0 (none yet)",
  "Under $2k / mo",
  "$2k – $5k / mo",
  "$5k – $15k / mo",
  "$15k – $50k / mo",
  "$50k+ / mo",
] as const;

export const MARKETING_CHANNELS = [
  "Door-to-door / canvassing",
  "Google / search ads",
  "Facebook / Instagram ads",
  "Referrals / word of mouth",
  "Bought / shared leads",
  "SEO / content",
  "TikTok / YouTube",
  "Nothing yet",
] as const;

export const BLOCKERS = [
  "Not enough leads",
  "Lead quality is poor",
  "Too slow to follow up",
  "Cost per appointment too high",
  "Can't hire / keep reps",
  "Closing rate",
  "Other",
] as const;

export const APPOINTMENT_GOALS = [
  "10 – 25 more / mo",
  "25 – 50 more / mo",
  "50 – 100 more / mo",
  "100+ more / mo",
] as const;

export const TIMELINES = [
  "ASAP / this month",
  "Next 1 – 3 months",
  "3 – 6 months",
  "Just exploring",
] as const;

export const REFERRAL_SOURCES = [
  "Instagram / Facebook",
  "Google",
  "Referral",
  "YouTube / TikTok",
  "Email",
  "Other",
] as const;

/**
 * Internal fit tier (A best → C). Captured with the lead, never shown to the user.
 * Heuristic: established revenue + volume + willingness to spend = better fit.
 */
export function scoreFit(input: {
  revenue?: string;
  installsPerMonth?: string;
  adSpend?: string;
}): "A" | "B" | "C" {
  const idx = (arr: readonly string[], v?: string) =>
    v ? arr.indexOf(v) : -1;
  const rev = idx(REVENUE_RANGES, input.revenue); // 0..5
  const vol = idx(INSTALLS_PER_MONTH, input.installsPerMonth); // 0..4
  const spend = idx(AD_SPEND_RANGES, input.adSpend); // 0..5
  const score = Math.max(rev, 0) + Math.max(vol, 0) + Math.max(spend, 0);
  if (score >= 9) return "A";
  if (score >= 5) return "B";
  return "C";
}
