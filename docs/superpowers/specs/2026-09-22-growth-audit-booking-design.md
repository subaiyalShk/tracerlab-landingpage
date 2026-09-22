# Growth Audit booking step — design

**Date:** 2026-09-22
**Status:** approved (owner, 2026-09-22) — ready for an implementation plan
**Goal:** after a visitor submits the `/growth-audit` form, let them book the discovery
call themselves, on Sufyan's real calendar, without Cal.com.

## Why

The funnel captures a lead and then stops: the success card promises "our AI will text you
in the next few minutes" and nothing does. Every lead has to be chased manually, and the
moment of highest intent — right after they hand over their number — is wasted. A self-serve
time picker converts that moment into a meeting on the calendar.

Cal.com is deliberately not used. It stays in the estate for the Retell voice agent
(`/api/book`) and the dashboard's `cal/*` routes; this funnel does not add a dependency on it.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Whose calendar | Sufyan only (`sufyanshk@tracerlabs.io`) | Sales owns discovery calls; no assignment logic, no fairness state |
| Availability source | Google Calendar free/busy | Single source of truth — if Sufyan blocks time in his own calendar, the funnel stops offering it. Nothing to keep in sync |
| Placement | Redirect to `/growth-audit/book?t=…` | A real URL to fire the conversion on, and a link that can be re-sent to people who drop off |
| Meeting type | Google Meet video | Auto-generated link, lands in their calendar with Google's own reminders |
| Credentials | Stay in dealflow only | The service account, `googleapis` and the CRM write already live there; a domain-wide-delegation key should not be copied into a second project |
| Booking record | Google Calendar event + CRM lead update | No new database |

### Rejected

- **Port Solrite's scheduling engine** (`lib/scheduling/*` + a Supabase `bookings` table).
  Capacity, min-notice, window and granularity are already written and tested there, and it
  carries no Google dependency — but it does not know Sufyan's real calendar, so it would book
  him during client calls unless he mirrored every commitment into it. We would also still
  create a calendar event for the invite. Its model fits capacity-based field appointments,
  not one person's diary.
- **A one-time Google OAuth refresh token from Sufyan's account** instead of the scope change.
  Same code path and needs no admin console, but the token can expire and needs re-consent.
  Keep as the fallback if the delegation change is refused.

## Blocking dependency

`https://www.googleapis.com/auth/calendar` must be added to the service account's client ID in
Google Workspace admin (Security → Access and data control → API controls → Domain-wide
delegation). Today the delegation covers `admin.directory.user` only; a `freebusy.query`
impersonating `subaiyalshk@tracerlabs.io` fails with `unauthorized_client` (verified
2026-09-22). Nothing calendar-related works until this is done — do it first and re-run the
probe to confirm.

## Architecture

```
browser ──POST /api/growth-audit-lead──► landing (Next, tracerlab-landingpage)
                                          │ 1. create CRM lead (unchanged)
                                          │ 2. mint encrypted booking token
                                          ▼
browser ◄──{ok, token}── redirect to /growth-audit/book?t=…
   │
   ├─GET  /api/growth-audit/slots ─► landing proxy ─x-intake-secret─► dealflow /api/calendar/slots ─► Google free/busy
   └─POST /api/growth-audit/book  ─► landing proxy ─x-intake-secret─► dealflow /api/calendar/book
                                                                        │ re-check free/busy
                                                                        │ events.insert (Meet, attendee, sendUpdates:all)
                                                                        │ lead → stage "appointment_set" + note
                                                                        ▼
                                                              Google emails the invite
```

The browser never talks to dealflow. The landing proxies are server-only and hold no Google
credentials — just `DEALFLOW_INTAKE_URL`'s sibling endpoints and the shared secret already
configured for the lead intake.

## Components

### Dealflow (`TracerLabs-sourcecode/dealflow`)

- **`src/lib/slots.ts` — pure.** `generateSlots({ from, days, busy, config, now })` → UTC ISO
  starts. Applies business days/hours in the configured IANA zone, slot granularity, buffer
  either side, minimum notice, and window end; subtracts busy intervals. No I/O, no Google
  types. This is the only place the maths lives, and the only part with heavy unit tests.
- **`src/lib/google-calendar.ts`.** JWT client (service account, `calendar` scope, `subject` =
  the booking calendar), `freeBusy(calendarId, from, to)`, `createEvent({...})` with
  `conferenceDataVersion: 1` and `sendUpdates: 'all'`.
- **`src/app/api/calendar/slots/route.ts`** — `GET`, `x-intake-secret`, returns
  `{ slots: string[], timezone, durationMinutes }`.
- **`src/app/api/calendar/book/route.ts`** — `POST`, `x-intake-secret`, body
  `{ start, name, email, phone, leadId, businessType?, adSpend?, timezone }`. Re-checks
  free/busy, inserts the event, updates the lead, returns `{ start, meetLink, htmlLink }`.
  Returns **409** if the slot is no longer free.
- **`middleware.ts`** — add `/api/calendar/` to the public-path list (the secret is the auth,
  exactly as `/api/leads/intake` does).

### Landing (`subaiyalShk/tracerlab-landingpage`)

- **`app/(tracerlabs)/growth-audit/_lib/bookingToken.ts` — pure.** `mint(payload)` /
  `read(token)` using AES-256-GCM with `BOOKING_TOKEN_SECRET`, 7-day expiry. Encrypted rather
  than signed so no PII is readable in a URL, referrer header or analytics log.
- **`app/(tracerlabs)/growth-audit/book/page.tsx`** — server component: reads `?t=`, decrypts,
  renders `BookClient` (or the expired-link state). `robots: noindex`.
- **`app/(tracerlabs)/growth-audit/book/BookClient.tsx`** — day rail + time grid built from the
  site's `Bevel`/`Button` primitives; timezone detected via `Intl.DateTimeFormat().resolvedOptions().timeZone`,
  shown as a label with an override; states: loading / grid / submitting / confirmed / error.
- **`app/api/growth-audit/slots/route.ts`**, **`app/api/growth-audit/book/route.ts`** — proxies.
  The `book` proxy decrypts the token server-side and takes name/email/phone/leadId from it,
  never from the request body, so a caller cannot book as someone else.
- **`app/(tracerlabs)/growth-audit/_components/LeadForm.tsx`** — on success, redirect to the
  booking page instead of showing "You're in."; remove the "our AI will text you in the next
  few minutes" promise (nothing texts them).
- **`app/api/growth-audit-lead/route.ts`** — return `{ ok: true, token }` using the `lead_id`
  dealflow already returns. If the CRM hand-off failed there is no lead id: return `ok` with no
  token and let the client show the old thank-you state rather than a broken booking page.

## Rules (v1 defaults)

| Rule | Value |
|---|---|
| Slot length | 30 minutes (matches the "free 30-minute call" copy) |
| Business days/hours | Mon–Fri, 09:00–17:00 `America/Chicago` (confirm Sufyan's working zone) |
| Buffer | 15 minutes either side of an existing event |
| Minimum notice | 2 hours |
| Window | 14 days ahead |
| Display | Visitor's own timezone, labelled, overridable; stored and transmitted as UTC ISO |
| DST | IANA zones via `Intl`, never fixed offsets |

## Failure handling

The principle: never lose what already happened.

| Failure | Behaviour |
|---|---|
| Token expired / tampered | Friendly "this link has expired" + route back to the form. The lead is already in the CRM |
| Calendar unreachable / scope missing | Explicit error state and a "we'll email you some times" fallback — never a silently empty grid |
| No slots in the window | Same fallback copy, plus we are notified |
| Slot taken between render and submit | 409 → grid refetches, the taken slot disappears, they pick again |
| Event created, CRM update failed | The meeting stands. Log loudly and email us, same as `/api/leads/intake` does today |
| Lead created, booking never attempted | Nothing breaks — the lead sits at "Need to Reach Out" as it does now |

## Testing

- **Unit (pure):** `slots.ts` — busy overlap at both edges, buffer, minimum-notice cutoff,
  weekend exclusion, window end, a DST-transition day, empty-calendar and fully-booked days.
  `bookingToken.ts` — roundtrip, tampered ciphertext, expired token, wrong key.
- **Integration:** book against a throwaway test calendar first, verify the event, the Meet
  link, the attendee and the CRM stage change, then delete it. Only then point at Sufyan's
  calendar.
- **Manual:** one run through the live funnel end to end, test records cleaned up afterwards
  (same discipline as the 2026-09-22 CRM wiring test).

## Out of scope (v1)

Reschedule/cancel UI (Google's invite already offers "propose a new time"), SMS reminders
(Google Calendar's own reminders cover it), round-robin or multi-rep assignment, rescheduling
from inside the CRM, and any booking UI on the main site.

## Related, not blocking

The Meta/GA conversion event should fire on **booking confirmed** rather than form submit —
the pixel is still a `REPLACE` marker on this page. Also still open from the funnel review:
spam protection on the public form, `noindex` + sitemap removal, and real privacy/terms URLs.
