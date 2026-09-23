// Advertising conversion tracking for the Growth Audit funnel.
//
// The conversion fires on **booking confirmed**, not on form submit. A submitted
// form with no meeting on the calendar is not the outcome we buy ads for, and
// optimising toward it teaches Meta to find people who fill forms and vanish.
//
// Both tags are optional: with no IDs set, every call here is a no-op, so the
// funnel runs untracked rather than broken. Set the IDs in Vercel Production:
//   NEXT_PUBLIC_META_PIXEL_ID   e.g. 1234567890
//   NEXT_PUBLIC_GA_ID           e.g. G-XXXXXXX

type Fbq = (...args: unknown[]) => void
type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    fbq?: Fbq
    gtag?: Gtag
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ""
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ""

/**
 * A meeting is on the calendar. Fires Meta's `Schedule` (semantically exact) and
 * `Lead` (what ad sets are usually optimised for, so campaigns keep working),
 * plus a GA4 `generate_lead`.
 *
 * Safe to call when no tag is configured, and safe to call twice — the caller
 * fires it once, on the confirmation state.
 */
export function trackBookingConfirmed(detail: { meetingType?: string } = {}): void {
  if (typeof window === "undefined") return
  try {
    if (window.fbq) {
      window.fbq("track", "Schedule", { content_name: detail.meetingType || "Growth Audit" })
      window.fbq("track", "Lead", { content_name: detail.meetingType || "Growth Audit" })
    }
    if (window.gtag) {
      window.gtag("event", "generate_lead", { event_category: "growth-audit", event_label: "booking_confirmed" })
    }
  } catch {
    // Never let a blocked or half-loaded ad script break the confirmation screen.
  }
}
