// ─────────────────────────────────────────────────────────────────────────────
// Growth Audit funnel content config (/growth-audit).
//
// Paid-traffic landing page: one action (claim the free Growth Audit call).
// Ported from the standalone HTML draft (claude.ai artifact EGKEg6ZJKutkb6zvKkXiei)
// onto the site's components — same copy, same layout, brand tokens from globals.
//
// ⚠️  PLACEHOLDERS: everything marked `placeholder`/REPLACE below ships in a safe
//     fallback state (video shows "coming soon", testimonials section is hidden,
//     legal links point at the homepage). Fill them in and the page picks them up.
// ─────────────────────────────────────────────────────────────────────────────

/** VSL embed URL. Player loads only on tap, so it costs nothing on page speed.
 *  Vimeo:   https://player.vimeo.com/video/VIDEO_ID?autoplay=1
 *  YouTube: https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1&rel=0
 *  Wistia:  https://fast.wistia.net/embed/iframe/VIDEO_ID?autoplay=1
 *  Empty string = no video yet → the tile says "Video coming soon" when tapped. */
export const VSL_EMBED_URL = "";

/** 16:9 poster shown in the VSL tile before play (under 150KB, in /public). Empty = grid backdrop. */
export const VSL_POSTER = "";

export const VSL_TITLE = "Watch: how we turn ad spend into booked appointments";
export const VSL_LENGTH = "3 min";

/** Where the form posts. Same stub pattern as /solar (see app/api/growth-audit-lead). */
export const LEAD_ENDPOINT = "/api/growth-audit-lead";

/** REPLACE with the real policy URLs once they exist. */
export const PRIVACY_URL = "/";
export const TERMS_URL = "/";

export const BUSINESS_TYPES = ["Solar", "HVAC", "Roofing", "Other home service"] as const;
export const AD_SPEND = ["Not running ads yet", "Under $2K", "$2K–$5K", "$5K+"] as const;

/** Headline proof stats. Cost/consult/show figures come from the solar portfolio. */
export const STATS: { value: string; label: string }[] = [
  { value: "$5M+", label: "revenue generated for clients" },
  { value: "$40–52", label: "per booked appointment" },
  { value: "2×", label: "lead-to-consult rate" },
  { value: "94%", label: "appointment show rate" },
];

export const STATS_SOURCE =
  "Cost per appointment, conversion and show-rate figures are from our solar portfolio, verified in-platform. Show rate measured across 487 appointments.";

/** Replace the bracketed text with real customers' words. Entries flagged `placeholder`
 *  are NOT rendered; the whole section is hidden until at least one is real. */
export const TESTIMONIALS: {
  quote: string;
  name: string;
  who: string;
  initials: string;
  placeholder?: boolean;
}[] = [
  {
    quote: "[Customer testimonial goes here. One to three sentences on the result they got, in their own words.]",
    name: "[Customer name]",
    who: "[Title, Company · City]",
    initials: "AB",
    placeholder: true,
  },
  {
    quote: "[Customer testimonial goes here. One to three sentences on the result they got, in their own words.]",
    name: "[Customer name]",
    who: "[Title, Company · City]",
    initials: "CD",
    placeholder: true,
  },
  {
    quote: "[Customer testimonial goes here. One to three sentences on the result they got, in their own words.]",
    name: "[Customer name]",
    who: "[Title, Company · City]",
    initials: "EF",
    placeholder: true,
  },
];

export const TEAM = [
  {
    name: "Sufyan Sheikh",
    role: "Co-founder, sales & marketing",
    bio: "$10M+ generated through his own solar company, which runs on autopilot.",
  },
  {
    name: "Subaiyal Sheikh",
    role: "Co-founder, engineering",
    bio: "Full-stack architect who has shipped for Fortune 5 companies. Builds the AI systems.",
  },
];
