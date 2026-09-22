# Growth Audit booking step — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** after submitting the `/growth-audit` form, the visitor picks a 30-minute discovery-call slot from Sufyan's real Google Calendar availability and gets a Google Meet invite, with the CRM lead moved to "Appointment Set".

**Architecture:** availability and booking live in **dealflow** (it already holds the Google service-account credentials, `googleapis`, and the CRM). The **landing page** gets a tokenised `/growth-audit/book` page plus two server-side proxy routes that call dealflow with the `x-intake-secret` shared secret already in place. The browser never talks to dealflow and never sees Google credentials. Google Calendar is the single source of truth for availability — there is no bookings table.

**Tech Stack:** Next.js App Router (both repos), `googleapis` + `google-auth-library` (dealflow, already installed), Node `crypto` (AES-256-GCM token), `Intl.DateTimeFormat` for IANA timezone maths (no date library), `tsx --test` + `node:test` for unit tests.

**Spec:** `docs/superpowers/specs/2026-09-22-growth-audit-booking-design.md` (in the landing repo)

## Global Constraints

- Two repos. **Dealflow** = `/Users/subaiyal/development/tracerlabs/SalesDashboard/tracerlabs-sales-dashboard` (GitHub `TracerLabs-sourcecode/dealflow`, prod branch `main`, deploys to `dealflow.tracerlabs.io`). **Landing** = `/Users/subaiyal/development/tracerlabs/landingpages/tracerlab-landingpage` (GitHub `subaiyalShk/tracerlab-landingpage`, prod branch `main`, deploys to `www.tracerlabs.io`).
- **Commit as the configured git identity** (`subaiyalshk@gmail.com`). A commit whose author Vercel cannot map to a GitHub account makes the deployment `BLOCKED` — this already happened once on dealflow (2026-09-22).
- **Dealflow is reached only at `https://dealflow.tracerlabs.io`.** Its Vercel SSO protection is `all_except_custom_domains`, so `*.vercel.app` URLs return 401 "Protected deployment" to server-to-server callers.
- Server-to-server auth is the existing header `x-intake-secret`, compared with `timingSafeEqual`; the secret is `LEAD_INTAKE_SECRET` on dealflow and `DEALFLOW_INTAKE_SECRET` on the landing page (same value, already set in Production).
- Booking calendar: `sufyanshk@tracerlabs.io`. Slot rules: **30-minute** slots, **Mon–Fri 09:00–17:00 `America/Chicago`**, **15-minute** buffer either side, **2 hours** minimum notice, **14-day** window. Times are transmitted and stored as UTC ISO; the visitor sees their own timezone.
- Landing-page perf rules (`CLAUDE.md`): animate transform/opacity only, no CSS `filter`/`backdrop-filter` at scale, card shadows are `box-shadow` on an unclipped wrapper.
- Every published number must be defensible; do not add new marketing claims in this work.
- **Blocking dependency for Tasks 2, 3 and 8:** `https://www.googleapis.com/auth/calendar` must be added to the service account's client ID in Google Workspace admin (Security → Access and data control → API controls → Domain-wide delegation). Until then `freebusy.query` fails with `unauthorized_client`. Tasks 1, 4, 5, 6 and 7 do not need it.
- Never write a test event to Sufyan's calendar. Task 8 uses a throwaway test calendar first.

---

### Task 1: Pure slot generator (dealflow)

**Files:**
- Create: `src/lib/slots.ts`
- Create: `src/lib/slots.test.ts`
- Modify: `package.json` (add `tsx` devDependency and a `test` script — dealflow has no test runner today)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export interface SlotConfig { timezone: string; businessDays: number[]; startMinute: number; endMinute: number; slotMinutes: number; bufferMinutes: number; minNoticeMinutes: number; windowDays: number }`
  - `export interface Interval { start: string; end: string }` (UTC ISO)
  - `export const DEFAULT_SLOT_CONFIG: SlotConfig`
  - `export function generateSlots(opts: { now: Date; busy: Interval[]; config: SlotConfig }): string[]` — UTC ISO slot starts, ascending
  - `export function isSlotFree(start: string, busy: Interval[], config: SlotConfig): boolean`

- [ ] **Step 1: Add the test runner**

```bash
cd /Users/subaiyal/development/tracerlabs/SalesDashboard/tracerlabs-sales-dashboard
npm install --save-dev tsx
```

Then add to `package.json` `scripts`:

```json
"test": "tsx --test \"src/**/*.test.ts\""
```

- [ ] **Step 2: Write the failing tests**

Create `src/lib/slots.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generateSlots, isSlotFree, DEFAULT_SLOT_CONFIG, type SlotConfig } from './slots'

// Monday 2026-09-21 14:00 UTC = 09:00 America/Chicago (CDT, UTC-5)
const MON_9AM_CT = new Date('2026-09-21T14:00:00Z')

const cfg: SlotConfig = { ...DEFAULT_SLOT_CONFIG, minNoticeMinutes: 0, windowDays: 1 }

test('generates business-hours slots in the configured zone', () => {
  const slots = generateSlots({ now: MON_9AM_CT, busy: [], config: cfg })
  // 09:00-17:00 CT in 30-minute slots = 16 slots
  assert.equal(slots.length, 16)
  assert.equal(slots[0], '2026-09-21T14:00:00.000Z') // 09:00 CT
  assert.equal(slots[15], '2026-09-21T21:30:00.000Z') // 16:30 CT, ends 17:00
})

test('honours minimum notice', () => {
  const slots = generateSlots({ now: MON_9AM_CT, busy: [], config: { ...cfg, minNoticeMinutes: 120 } })
  assert.equal(slots[0], '2026-09-21T16:00:00.000Z') // first slot at/after 11:00 CT
})

test('removes slots overlapping a busy block, plus the buffer', () => {
  // Busy 11:00-11:30 CT (16:00-16:30Z). With a 15-minute buffer this also kills
  // the 10:30 and 11:30 slots (they fall inside busy±15min).
  const busy = [{ start: '2026-09-21T16:00:00.000Z', end: '2026-09-21T16:30:00.000Z' }]
  const slots = generateSlots({ now: MON_9AM_CT, busy, config: cfg })
  assert.ok(!slots.includes('2026-09-21T15:30:00.000Z')) // 10:30 CT
  assert.ok(!slots.includes('2026-09-21T16:00:00.000Z')) // 11:00 CT
  assert.ok(!slots.includes('2026-09-21T16:30:00.000Z')) // 11:30 CT
  assert.ok(slots.includes('2026-09-21T15:00:00.000Z')) // 10:00 CT survives
  assert.ok(slots.includes('2026-09-21T17:00:00.000Z')) // 12:00 CT survives
})

test('skips weekends', () => {
  // Saturday 2026-09-26 14:00Z
  const sat = new Date('2026-09-26T14:00:00Z')
  const slots = generateSlots({ now: sat, busy: [], config: { ...cfg, windowDays: 2 } })
  assert.equal(slots.length, 0) // Saturday and Sunday are both excluded
})

test('spans the whole window and stays ordered', () => {
  const slots = generateSlots({ now: MON_9AM_CT, busy: [], config: { ...DEFAULT_SLOT_CONFIG, minNoticeMinutes: 0 } })
  const sorted = [...slots].sort()
  assert.deepEqual(slots, sorted)
  // 14 calendar days from Monday = 10 business days x 16 slots
  assert.equal(slots.length, 160)
})

test('handles the US DST transition without drifting the local hour', () => {
  // DST ends 2026-11-01. Thursday 2026-11-05 is CST (UTC-6), so 09:00 CT = 15:00Z.
  const nov = new Date('2026-11-05T13:00:00Z')
  const slots = generateSlots({ now: nov, busy: [], config: { ...cfg, windowDays: 1 } })
  assert.equal(slots[0], '2026-11-05T15:00:00.000Z')
})

test('a fully booked day yields nothing', () => {
  const busy = [{ start: '2026-09-21T13:00:00.000Z', end: '2026-09-21T23:00:00.000Z' }]
  const slots = generateSlots({ now: MON_9AM_CT, busy, config: cfg })
  assert.equal(slots.length, 0)
})

test('isSlotFree agrees with generateSlots', () => {
  const busy = [{ start: '2026-09-21T16:00:00.000Z', end: '2026-09-21T16:30:00.000Z' }]
  assert.equal(isSlotFree('2026-09-21T16:00:00.000Z', busy, cfg), false)
  assert.equal(isSlotFree('2026-09-21T15:00:00.000Z', busy, cfg), true)
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './slots'`.

- [ ] **Step 4: Implement the slot generator**

Create `src/lib/slots.ts`:

```ts
// Pure availability maths for the Growth Audit booking step. No I/O, no Google
// types — the only place slot rules live, and the only part that is unit-tested.
//
// Timezone handling uses Intl rather than a date library: `tzOffsetMs` asks the
// runtime what the zone's offset is at a given instant, so DST transitions are
// handled by the tz database instead of by us.

export interface SlotConfig {
  /** IANA zone the business hours are expressed in. */
  timezone: string
  /** ISO weekdays that are bookable: 1 = Monday … 7 = Sunday. */
  businessDays: number[]
  /** Minutes from local midnight when bookable hours start (540 = 09:00). */
  startMinute: number
  /** Minutes from local midnight when bookable hours end (1020 = 17:00). */
  endMinute: number
  slotMinutes: number
  /** Dead time kept either side of an existing event. */
  bufferMinutes: number
  /** A slot must start at least this far in the future. */
  minNoticeMinutes: number
  /** How many calendar days ahead to offer. */
  windowDays: number
}

/** A busy block from Google free/busy, as UTC ISO strings. */
export interface Interval {
  start: string
  end: string
}

export const DEFAULT_SLOT_CONFIG: SlotConfig = {
  timezone: 'America/Chicago',
  businessDays: [1, 2, 3, 4, 5],
  startMinute: 9 * 60,
  endMinute: 17 * 60,
  slotMinutes: 30,
  bufferMinutes: 15,
  minNoticeMinutes: 120,
  windowDays: 14,
}

/** Offset of `tz` from UTC at `date`, in ms (positive east of Greenwich). */
function tzOffsetMs(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const p: Record<string, string> = {}
  for (const part of dtf.formatToParts(date)) p[part.type] = part.value
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second),
  )
  return asUTC - date.getTime()
}

/** The wall-clock calendar date in `tz` at `date`. */
function zonedParts(date: Date, tz: string): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
  const [year, month, day] = dtf.format(date).split('-').map(Number)
  return { year, month, day }
}

/** UTC instant of a wall-clock time in `tz`. Two passes so DST edges land right. */
function zonedToUtc(year: number, month: number, day: number, minuteOfDay: number, tz: string): Date {
  const naive = Date.UTC(year, month - 1, day, 0, minuteOfDay)
  const first = naive - tzOffsetMs(new Date(naive), tz)
  const second = naive - tzOffsetMs(new Date(first), tz)
  return new Date(second)
}

/** ISO weekday (1 = Monday … 7 = Sunday) of a Y/M/D in `tz`. */
function isoWeekday(year: number, month: number, day: number): number {
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.getUTCDay() === 0 ? 7 : d.getUTCDay()
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** True when [start, start+slot) clears every busy block by at least the buffer. */
export function isSlotFree(start: string, busy: Interval[], config: SlotConfig): boolean {
  const s = new Date(start).getTime()
  const e = s + config.slotMinutes * 60_000
  const buffer = config.bufferMinutes * 60_000
  for (const b of busy) {
    const bs = new Date(b.start).getTime() - buffer
    const be = new Date(b.end).getTime() + buffer
    if (overlaps(s, e, bs, be)) return false
  }
  return true
}

export function generateSlots(opts: { now: Date; busy: Interval[]; config: SlotConfig }): string[] {
  const { now, busy, config } = opts
  const earliest = now.getTime() + config.minNoticeMinutes * 60_000
  const latest = now.getTime() + config.windowDays * 86_400_000
  const out: string[] = []

  for (let i = 0; i <= config.windowDays; i++) {
    const cursor = new Date(now.getTime() + i * 86_400_000)
    const { year, month, day } = zonedParts(cursor, config.timezone)
    if (!config.businessDays.includes(isoWeekday(year, month, day))) continue

    for (let m = config.startMinute; m + config.slotMinutes <= config.endMinute; m += config.slotMinutes) {
      const start = zonedToUtc(year, month, day, m, config.timezone)
      const t = start.getTime()
      if (t < earliest || t > latest) continue
      if (!isSlotFree(start.toISOString(), busy, config)) continue
      out.push(start.toISOString())
    }
  }

  // The day loop can revisit a date across a DST boundary; de-duplicate and sort.
  return [...new Set(out)].sort()
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/slots.ts src/lib/slots.test.ts package.json package-lock.json
git commit -m "feat(booking): pure slot generator for the Growth Audit funnel"
```

---

### Task 2: Google Calendar client (dealflow)

**Files:**
- Create: `src/lib/google-calendar.ts`
- Create: `scripts/probe-calendar.mjs` (a throwaway verification script, committed so the next person can re-run it)

**Interfaces:**
- Consumes: `Interval` from `src/lib/slots.ts`.
- Produces:
  - `export function bookingCalendarId(): string` — `BOOKING_CALENDAR_ID` or `sufyanshk@tracerlabs.io`
  - `export async function freeBusy(calendarId: string, from: Date, to: Date): Promise<Interval[]>`
  - `export async function createBookingEvent(args: { calendarId: string; startISO: string; durationMinutes: number; attendeeEmail: string; attendeeName: string; summary: string; description: string; timezone: string }): Promise<{ meetLink: string | null; htmlLink: string | null; eventId: string }>`

**Prerequisite:** the Workspace delegation must already include `https://www.googleapis.com/auth/calendar` (see Global Constraints).

- [ ] **Step 1: Implement the client**

Create `src/lib/google-calendar.ts`:

```ts
import { google, type calendar_v3 } from 'googleapis'
import { JWT } from 'google-auth-library'
import type { Interval } from './slots'

// Google Calendar access for the booking step. Uses the same service account as
// src/lib/google-workspace.ts, with domain-wide delegation impersonating the
// calendar's owner. The delegation must grant
// https://www.googleapis.com/auth/calendar — without it every call fails with
// `unauthorized_client`.

const SCOPES = ['https://www.googleapis.com/auth/calendar']

function envOrThrow(key: string): string {
  const v = process.env[key]
  if (!v) throw new Error(`Missing required env var: ${key}`)
  return v
}

export function bookingCalendarId(): string {
  return process.env.BOOKING_CALENDAR_ID || 'sufyanshk@tracerlabs.io'
}

function client(subject: string): calendar_v3.Calendar {
  const auth = new JWT({
    email: envOrThrow('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    key: envOrThrow('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
    scopes: SCOPES,
    subject,
  })
  return google.calendar({ version: 'v3', auth })
}

export async function freeBusy(calendarId: string, from: Date, to: Date): Promise<Interval[]> {
  const res = await client(calendarId).freebusy.query({
    requestBody: {
      timeMin: from.toISOString(),
      timeMax: to.toISOString(),
      items: [{ id: calendarId }],
    },
  })
  const cal = res.data.calendars?.[calendarId]
  if (cal?.errors?.length) {
    throw new Error(`free/busy for ${calendarId}: ${JSON.stringify(cal.errors)}`)
  }
  return (cal?.busy || [])
    .filter((b): b is { start: string; end: string } => Boolean(b.start && b.end))
    .map((b) => ({ start: new Date(b.start).toISOString(), end: new Date(b.end).toISOString() }))
}

export async function createBookingEvent(args: {
  calendarId: string
  startISO: string
  durationMinutes: number
  attendeeEmail: string
  attendeeName: string
  summary: string
  description: string
  timezone: string
}): Promise<{ meetLink: string | null; htmlLink: string | null; eventId: string }> {
  const end = new Date(new Date(args.startISO).getTime() + args.durationMinutes * 60_000)
  const res = await client(args.calendarId).events.insert({
    calendarId: args.calendarId,
    conferenceDataVersion: 1, // required for Google to mint a Meet link
    sendUpdates: 'all', // Google emails the invite and runs the reminders
    requestBody: {
      summary: args.summary,
      description: args.description,
      start: { dateTime: args.startISO, timeZone: args.timezone },
      end: { dateTime: end.toISOString(), timeZone: args.timezone },
      attendees: [{ email: args.attendeeEmail, displayName: args.attendeeName }],
      conferenceData: {
        createRequest: {
          requestId: `ga-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    },
  })
  const data = res.data
  const meetLink =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri ||
    null
  return { meetLink, htmlLink: data.htmlLink || null, eventId: data.id as string }
}
```

- [ ] **Step 2: Write the probe script**

Create `scripts/probe-calendar.mjs`:

```js
// Verifies the service account can read free/busy for the booking calendar.
// Run from the repo root with the env loaded:  node --env-file=.env.local scripts/probe-calendar.mjs
import { JWT } from 'google-auth-library'
import { google } from 'googleapis'

const calendarId = process.env.BOOKING_CALENDAR_ID || 'sufyanshk@tracerlabs.io'
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
  subject: calendarId,
})

try {
  const cal = google.calendar({ version: 'v3', auth })
  const now = new Date()
  const res = await cal.freebusy.query({
    requestBody: {
      timeMin: now.toISOString(),
      timeMax: new Date(now.getTime() + 7 * 86400000).toISOString(),
      items: [{ id: calendarId }],
    },
  })
  const c = res.data.calendars?.[calendarId] || {}
  console.log('OK —', calendarId, 'busy blocks in the next 7 days:', (c.busy || []).length)
  if (c.errors?.length) console.log('errors:', JSON.stringify(c.errors))
} catch (e) {
  console.log('FAILED —', e.message)
  process.exitCode = 1
}
```

- [ ] **Step 3: Run the probe**

Run: `node --env-file=.env.local scripts/probe-calendar.mjs`
Expected: `OK — sufyanshk@tracerlabs.io busy blocks in the next 7 days: <n>`.
If it prints `FAILED — unauthorized_client`, the Workspace scope has not been added yet — stop and report that; do not continue to Task 3.

- [ ] **Step 4: Commit**

```bash
git add src/lib/google-calendar.ts scripts/probe-calendar.mjs
git commit -m "feat(booking): Google Calendar free/busy + event creation"
```

---

### Task 3: Calendar API routes (dealflow)

**Files:**
- Create: `src/app/api/calendar/slots/route.ts`
- Create: `src/app/api/calendar/book/route.ts`
- Modify: `middleware.ts` (add the public path)

**Interfaces:**
- Consumes: `generateSlots`, `isSlotFree`, `DEFAULT_SLOT_CONFIG` (Task 1); `freeBusy`, `createBookingEvent`, `bookingCalendarId` (Task 2).
- Produces:
  - `GET /api/calendar/slots` → `{ success: true, slots: string[], timezone: string, durationMinutes: number }`
  - `POST /api/calendar/book` → `{ success: true, start: string, meetLink: string | null, htmlLink: string | null }`, or `409 { error: 'That time was just taken' }`

- [ ] **Step 1: Make the routes public in middleware**

In `middleware.ts`, directly after the `pathname.startsWith('/api/leads/intake') ||` line, add:

```ts
    pathname.startsWith('/api/calendar/') ||
```

(The shared secret is the auth, exactly as for `/api/leads/intake`.)

- [ ] **Step 2: Implement the slots route**

Create `src/app/api/calendar/slots/route.ts`:

```ts
import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { apiError, apiSuccess, handleApiError } from '@/lib/api-utils'
import { DEFAULT_SLOT_CONFIG, generateSlots } from '@/lib/slots'
import { bookingCalendarId, freeBusy } from '@/lib/google-calendar'

// Open slots for the Growth Audit booking page. Server-to-server only: the
// landing page proxies to this, the browser never calls it directly.

function isAuthorized(req: NextRequest) {
  const expected = process.env.LEAD_INTAKE_SECRET
  const given = req.headers.get('x-intake-secret')
  if (!expected || !given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.LEAD_INTAKE_SECRET) return apiError('Booking is not configured', 503)
    if (!isAuthorized(req)) return apiError('Unauthorized', 401)

    const config = DEFAULT_SLOT_CONFIG
    const now = new Date()
    const calendarId = bookingCalendarId()
    const busy = await freeBusy(calendarId, now, new Date(now.getTime() + config.windowDays * 86_400_000))
    const slots = generateSlots({ now, busy, config })

    return apiSuccess({ slots, timezone: config.timezone, durationMinutes: config.slotMinutes })
  } catch (error) {
    return handleApiError(error, 'GET /api/calendar/slots')
  }
}
```

- [ ] **Step 3: Implement the booking route**

Create `src/app/api/calendar/book/route.ts`:

```ts
import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { apiError, apiSuccess, handleApiError } from '@/lib/api-utils'
import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_SLOT_CONFIG, generateSlots, isSlotFree } from '@/lib/slots'
import { bookingCalendarId, createBookingEvent, freeBusy } from '@/lib/google-calendar'

// Books a Growth Audit discovery call. Server-to-server only.
//
// Order matters: the calendar event is the thing the visitor is promised, so it
// is created first. If the CRM update afterwards fails the meeting still stands
// and we log loudly — same rule as /api/leads/intake.

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

function isAuthorized(req: NextRequest) {
  const expected = process.env.LEAD_INTAKE_SECRET
  const given = req.headers.get('x-intake-secret')
  if (!expected || !given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.LEAD_INTAKE_SECRET) return apiError('Booking is not configured', 503)
    if (!isAuthorized(req)) return apiError('Unauthorized', 401)

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return apiError('Invalid request body', 400)
    }

    const start = str(body.start)
    const name = str(body.name)
    const email = str(body.email)
    const phone = str(body.phone)
    const leadId = str(body.leadId)
    const visitorTz = str(body.timezone) || DEFAULT_SLOT_CONFIG.timezone
    if (!start || !name || !email) return apiError('start, name and email are required', 400)
    if (Number.isNaN(new Date(start).getTime())) return apiError('Invalid start time', 400)

    const config = DEFAULT_SLOT_CONFIG
    const calendarId = bookingCalendarId()
    const now = new Date()

    // The slot must still be one we would offer (guards min-notice, business
    // hours and the window) and still be clear of the live calendar.
    const offered = generateSlots({ now, busy: [], config })
    if (!offered.includes(new Date(start).toISOString())) {
      return apiError('That time is not available', 409)
    }
    const busy = await freeBusy(calendarId, now, new Date(now.getTime() + config.windowDays * 86_400_000))
    if (!isSlotFree(new Date(start).toISOString(), busy, config)) {
      return apiError('That time was just taken', 409)
    }

    const event = await createBookingEvent({
      calendarId,
      startISO: new Date(start).toISOString(),
      durationMinutes: config.slotMinutes,
      attendeeEmail: email,
      attendeeName: name,
      summary: `Growth Audit — ${name}`,
      description: [
        'Free 30-minute Growth Audit booked from tracerlabs.io/growth-audit.',
        `Name: ${name}`,
        `Phone: ${phone || 'not given'}`,
        `Email: ${email}`,
      ].join('\n'),
      timezone: config.timezone,
    })

    // CRM write-back is best effort: the meeting is already real.
    if (leadId) {
      try {
        const admin = createAdminClient()
        const when = new Intl.DateTimeFormat('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
          hour: 'numeric', minute: '2-digit',
          timeZone: visitorTz, timeZoneName: 'short',
        }).format(new Date(start))
        const { data: lead } = await admin.from('leads').select('notes').eq('id', leadId).single()
        const notes = Array.isArray(lead?.notes) ? (lead!.notes as string[]) : []
        notes.push(`Discovery call booked for ${when}${event.meetLink ? ` — ${event.meetLink}` : ''}`)
        await admin.from('leads').update({ stage: 'appointment_set', notes }).eq('id', leadId)
      } catch (crmError) {
        console.error('[calendar/book] event created but CRM update failed for lead', leadId, crmError)
      }
    }

    return apiSuccess({ start: new Date(start).toISOString(), meetLink: event.meetLink, htmlLink: event.htmlLink })
  } catch (error) {
    return handleApiError(error, 'POST /api/calendar/book')
  }
}
```

- [ ] **Step 4: Verify locally**

```bash
npm run build                      # must compile
npm run dev -- -p 3311 &
SECRET=$(grep '^LEAD_INTAKE_SECRET=' .env.local | cut -d= -f2-)
curl -s -o /dev/null -w "no secret: %{http_code}\n" "http://localhost:3311/api/calendar/slots"
curl -s "http://localhost:3311/api/calendar/slots" -H "x-intake-secret: $SECRET" | head -c 300
```

Expected: `no secret: 401`, then a JSON body with a non-empty `slots` array and `"timezone":"America/Chicago"`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/calendar middleware.ts
git commit -m "feat(booking): secret-protected slots + book endpoints"
```

---

### Task 4: Booking token codec (landing)

**Files:**
- Create: `app/(tracerlabs)/growth-audit/_lib/bookingToken.ts`
- Create: `app/(tracerlabs)/growth-audit/_lib/bookingToken.test.ts`
- Modify: `package.json` (widen the `test` glob so tests outside `app/components/` run)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export interface BookingPayload { leadId: string; name: string; email: string; phone: string; exp: number }`
  - `export function mint(p: Omit<BookingPayload, 'exp'>, opts?: { ttlMs?: number; now?: number; secret?: string }): string`
  - `export function read(token: string, opts?: { now?: number; secret?: string }): BookingPayload | null`
  - `export const TOKEN_TTL_MS: number` (7 days)

- [ ] **Step 1: Widen the test glob**

In `package.json`, change the `test` script to:

```json
"test": "tsx --test \"app/**/*.test.ts\""
```

Run `npm test` — the 2 existing `heroFilmPolicy` tests must still be found and pass.

- [ ] **Step 2: Write the failing tests**

Create `app/(tracerlabs)/growth-audit/_lib/bookingToken.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mint, read, TOKEN_TTL_MS } from "./bookingToken";

const secret = "test-secret-do-not-use-in-production";
const lead = { leadId: "abc-123", name: "Jo Tester", email: "jo@example.com", phone: "5125550100" };

test("round-trips a payload", () => {
  const t = mint(lead, { secret });
  const back = read(t, { secret });
  assert.equal(back?.leadId, "abc-123");
  assert.equal(back?.email, "jo@example.com");
});

test("carries no readable PII in the token", () => {
  const t = mint(lead, { secret });
  assert.ok(!t.includes("jo@example.com"));
  assert.ok(!Buffer.from(t, "base64url").toString("utf8").includes("jo@example.com"));
});

test("rejects a tampered token", () => {
  const t = mint(lead, { secret });
  const flipped = t.slice(0, -2) + (t.endsWith("A") ? "B" : "A");
  assert.equal(read(flipped, { secret }), null);
});

test("rejects the wrong key", () => {
  const t = mint(lead, { secret });
  assert.equal(read(t, { secret: "a-different-secret" }), null);
});

test("rejects an expired token", () => {
  const t = mint(lead, { secret, now: 0 });
  assert.equal(read(t, { secret, now: TOKEN_TTL_MS + 1 }), null);
  assert.ok(read(t, { secret, now: TOKEN_TTL_MS - 1 }));
});

test("rejects rubbish", () => {
  assert.equal(read("", { secret }), null);
  assert.equal(read("not-a-token", { secret }), null);
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot find `./bookingToken`.

- [ ] **Step 4: Implement the codec**

Create `app/(tracerlabs)/growth-audit/_lib/bookingToken.ts`:

```ts
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

// The Growth Audit booking link carries who the visitor is, so the booking page
// can prefill and the booking call can identify the CRM lead. The payload is
// ENCRYPTED (AES-256-GCM), not merely signed: the token travels in a URL, and a
// signed-but-readable payload would leak the lead's name, email and phone into
// browser history, Referer headers and any analytics that records URLs.
//
// Server-only: the key never reaches the client.

export interface BookingPayload {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  /** Epoch ms after which the token is refused. */
  exp: number;
}

export const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const IV_BYTES = 12;
const TAG_BYTES = 16;

function keyFrom(secret: string): Buffer {
  // The env var is an arbitrary string; hash it to the 32 bytes AES-256 needs.
  return createHash("sha256").update(secret).digest();
}

function secretOrThrow(explicit?: string): string {
  const s = explicit ?? process.env.BOOKING_TOKEN_SECRET;
  if (!s) throw new Error("BOOKING_TOKEN_SECRET is not set");
  return s;
}

export function mint(
  p: Omit<BookingPayload, "exp">,
  opts: { ttlMs?: number; now?: number; secret?: string } = {},
): string {
  const now = opts.now ?? Date.now();
  const payload: BookingPayload = { ...p, exp: now + (opts.ttlMs ?? TOKEN_TTL_MS) };
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", keyFrom(secretOrThrow(opts.secret)), iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

/** Returns null for anything we will not honour — bad key, tampering, expiry, junk. */
export function read(token: string, opts: { now?: number; secret?: string } = {}): BookingPayload | null {
  try {
    if (!token) return null;
    const raw = Buffer.from(token, "base64url");
    if (raw.length <= IV_BYTES + TAG_BYTES) return null;
    const iv = raw.subarray(0, IV_BYTES);
    const tag = raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
    const body = raw.subarray(IV_BYTES + TAG_BYTES);
    const decipher = createDecipheriv("aes-256-gcm", keyFrom(secretOrThrow(opts.secret)), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8");
    const parsed = JSON.parse(json) as BookingPayload;
    if (typeof parsed?.exp !== "number" || (opts.now ?? Date.now()) > parsed.exp) return null;
    if (!parsed.leadId || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — 8 tests (2 hero-film + 6 token).

- [ ] **Step 6: Commit**

```bash
git add "app/(tracerlabs)/growth-audit/_lib" package.json
git commit -m "feat(growth-audit): encrypted booking-link token"
```

---

### Task 5: Landing proxy routes

**Files:**
- Create: `app/api/growth-audit/slots/route.ts`
- Create: `app/api/growth-audit/book/route.ts`

**Interfaces:**
- Consumes: `read` from `app/(tracerlabs)/growth-audit/_lib/bookingToken`; dealflow's `/api/calendar/*` (Task 3).
- Produces:
  - `GET /api/growth-audit/slots` → `{ slots, timezone, durationMinutes }`
  - `POST /api/growth-audit/book` body `{ token, start, timezone }` → `{ ok: true, start, meetLink }`, `409 { ok:false, error }` when taken, `401` when the token is bad.

**Why the token is decrypted here:** the identity of the person being booked comes from the token, never from the request body, so a caller cannot book a meeting in someone else's name.

- [ ] **Step 1: Implement the slots proxy**

Create `app/api/growth-audit/slots/route.ts`:

```ts
import { NextResponse } from "next/server";

// Browser-facing proxy for the booking page's slot grid. Holds no Google
// credentials — it forwards to dealflow, which owns the calendar.
export const runtime = "nodejs";

function dealflow(path: string): string | null {
  const intake = process.env.DEALFLOW_INTAKE_URL; // .../api/leads/intake
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
```

- [ ] **Step 2: Implement the booking proxy**

Create `app/api/growth-audit/book/route.ts`:

```ts
import { NextResponse } from "next/server";
import { read } from "../../../(tracerlabs)/growth-audit/_lib/bookingToken";

// Books the slot the visitor picked. The person being booked comes from the
// encrypted token, never from the request body.
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
      return NextResponse.json({ ok: false, error: "That time was just taken — pick another." }, { status: 409 });
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
```

- [ ] **Step 3: Verify**

Run: `npm run build` — must compile.

- [ ] **Step 4: Commit**

```bash
git add app/api/growth-audit
git commit -m "feat(growth-audit): slot + booking proxies to the CRM's calendar"
```

---

### Task 6: Booking page and picker UI (landing)

**Files:**
- Create: `app/(tracerlabs)/growth-audit/book/page.tsx`
- Create: `app/(tracerlabs)/growth-audit/book/BookClient.tsx`

**Interfaces:**
- Consumes: `read`, `BookingPayload` (Task 4); `GET /api/growth-audit/slots`, `POST /api/growth-audit/book` (Task 5); `Bevel` (`bevel`, `border`, `bg`, `className`), `Button` (`variant`, `size`, `onClick`, `disabled`, `type`, `className`).
- Produces: the route `/growth-audit/book?t=<token>`.

- [ ] **Step 1: Implement the page shell**

Create `app/(tracerlabs)/growth-audit/book/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { read } from "../_lib/bookingToken";
import BookClient from "./BookClient";

// Step 2 of the Growth Audit funnel: pick a time. Reached only by redirect from
// the form with an encrypted token; never indexed, never linked.
export const metadata: Metadata = {
  title: "Pick your Growth Audit time | Tracerlabs",
  robots: { index: false, follow: false },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;
  const lead = t ? read(t) : null;

  return (
    <main className="font-body relative isolate min-h-[100dvh] w-full overflow-clip bg-page text-ink">
      <div aria-hidden className="nt-horizon -z-10" />
      <div aria-hidden className="nt-gridfloor -z-10" />
      <div className="mx-auto w-full max-w-[640px] px-5 py-12 sm:py-16">
        <div className="mb-8 flex justify-center">
          <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[64px] w-auto" />
          <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[64px] w-auto" />
        </div>
        {lead ? (
          <BookClient token={t as string} firstName={lead.name.split(" ")[0] || "there"} />
        ) : (
          <div className="text-center">
            <h1 className="text-[1.6rem] font-extrabold tracking-tight">This booking link has expired.</h1>
            <p className="mt-3 text-ink/60">
              No problem — we still have your details and will reach out. If you would rather pick a time now,{" "}
              <Link href="/growth-audit" className="underline">start again</Link>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Implement the picker**

Create `app/(tracerlabs)/growth-audit/book/BookClient.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Bevel, { GLASS_BG, GLASS_BORDER } from "../../../components/Bevel";
import Button from "../../../components/Button";

// Day rail + time grid. Slots arrive as UTC ISO strings and are rendered in the
// visitor's own timezone, so nobody has to do mental arithmetic.
const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

type State = "loading" | "ready" | "booking" | "booked" | "error";

function localTz(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";
  } catch {
    return "America/Chicago";
  }
}

export default function BookClient({ token, firstName }: { token: string; firstName: string }) {
  const [state, setState] = useState<State>("loading");
  const [slots, setSlots] = useState<string[]>([]);
  const [day, setDay] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState<{ start: string; meetLink: string | null } | null>(null);
  const tz = useMemo(localTz, []);

  const dayKey = (iso: string) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso));
  const dayLabel = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })
      .format(new Date(Date.UTC(y, m - 1, d)));
  };
  const timeLabel = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(new Date(iso));

  async function load() {
    setState("loading");
    try {
      const res = await fetch("/api/growth-audit/slots", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !Array.isArray(json.slots)) throw new Error(json.error || "Could not load times.");
      setSlots(json.slots);
      setDay((d) => d ?? (json.slots.length ? dayKey(json.slots[0]) : null));
      setState("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load times.");
      setState("error");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = useMemo(() => [...new Set(slots.map(dayKey))], [slots, tz]);
  const times = useMemo(() => slots.filter((s) => dayKey(s) === day), [slots, day, tz]);

  async function book() {
    if (!chosen) return;
    setState("booking");
    try {
      const res = await fetch("/api/growth-audit/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, start: chosen, timezone: tz }),
      });
      const json = await res.json();
      if (res.status === 409) {
        setError(json.error || "That time was just taken — pick another.");
        setChosen(null);
        await load();
        return;
      }
      if (!res.ok || !json.ok) throw new Error(json.error || "We could not book that time.");
      setBooked({ start: json.start, meetLink: json.meetLink ?? null });
      setState("booked");
    } catch (e) {
      setError(e instanceof Error ? e.message : "We could not book that time.");
      setState("error");
    }
  }

  if (state === "booked" && booked) {
    return (
      <Bevel bevel={18} border={GLASS_BORDER} bg={GLASS_BG}>
        <div className="px-6 py-8 text-center sm:px-9">
          <h1 className="text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
            You&rsquo;re booked.
          </h1>
          <p className="mt-3 text-ink/70">
            {new Intl.DateTimeFormat("en-US", {
              weekday: "long", month: "long", day: "numeric",
              hour: "numeric", minute: "2-digit", timeZone: tz, timeZoneName: "short",
            }).format(new Date(booked.start))}
          </p>
          <p className="mt-3 text-[0.95rem] text-ink/55">
            The calendar invite is on its way to your inbox.
            {booked.meetLink ? " It has the video link in it." : ""}
          </p>
          {booked.meetLink && (
            <p className="mt-5">
              <a href={booked.meetLink} className="underline" target="_blank" rel="noreferrer">
                Join link
              </a>
            </p>
          )}
        </div>
      </Bevel>
    );
  }

  return (
    <Bevel bevel={18} border={GLASS_BORDER} bg={GLASS_BG}>
      <div className="px-5 py-7 sm:px-8 sm:py-9">
        <h1 className="text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
          Nice one, {firstName} — pick your time.
        </h1>
        <p className="mt-2 text-[0.98rem] text-ink/60">
          Thirty minutes with Sufyan. Times shown in {tz.replace(/_/g, " ")}.
        </p>

        {state === "loading" && <p className="mt-6 text-ink/55">Loading available times…</p>}

        {state === "error" && (
          <div className="mt-6">
            <p className="text-[0.95rem] text-[#ff6b81]" role="alert">{error}</p>
            <p className="mt-2 text-[0.95rem] text-ink/60">
              We have your details either way — we&rsquo;ll email you some times.
            </p>
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={() => void load()}>Try again</Button>
            </div>
          </div>
        )}

        {(state === "ready" || state === "booking") && days.length === 0 && (
          <p className="mt-6 text-ink/60">
            No times are open in the next two weeks — we&rsquo;ll email you some options instead.
          </p>
        )}

        {(state === "ready" || state === "booking") && days.length > 0 && (
          <>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Day">
              {days.map((d) => (
                <button
                  key={d}
                  role="tab"
                  aria-selected={d === day}
                  onClick={() => { setDay(d); setChosen(null); }}
                  className={`bv-6 shrink-0 px-4 py-2 text-[0.9rem] transition-colors ${
                    d === day ? "bg-brand-blue text-white" : "bg-surface text-ink/70 hover:text-ink"
                  }`}
                >
                  {dayLabel(d)}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {times.map((s) => (
                <button
                  key={s}
                  onClick={() => setChosen(s)}
                  aria-pressed={chosen === s}
                  className={`bv-6 min-h-[46px] px-3 py-2 text-[0.95rem] transition-colors ${
                    chosen === s ? "bg-brand-blue text-white" : "bg-surface text-ink/80 hover:text-ink"
                  }`}
                >
                  {timeLabel(s)}
                </button>
              ))}
            </div>

            {error && <p className="mt-4 text-[0.9rem] text-[#ff6b81]" role="alert">{error}</p>}

            <div className="mt-7">
              <Button
                variant="primary"
                size="lg"
                className="w-full disabled:cursor-default disabled:opacity-55 disabled:hover:translate-y-0"
                disabled={!chosen || state === "booking"}
                onClick={() => void book()}
              >
                {state === "booking" ? "Booking…" : "Confirm my time"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Bevel>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` and `npm run lint`. Both must be clean (the pre-existing `video/src/scenes/*` lint errors are expected and unrelated).

- [ ] **Step 4: Commit**

```bash
git add "app/(tracerlabs)/growth-audit/book"
git commit -m "feat(growth-audit): booking page with day rail + time grid"
```

---

### Task 7: Hand the form off to the booking step (landing)

**Files:**
- Modify: `app/api/growth-audit-lead/route.ts`
- Modify: `app/(tracerlabs)/growth-audit/_components/LeadForm.tsx`

**Interfaces:**
- Consumes: `mint` (Task 4); the booking page route (Task 6).
- Produces: `/api/growth-audit-lead` now returns `{ ok: true, token?: string }`.

- [ ] **Step 1: Return a booking token from the lead route**

In `app/api/growth-audit-lead/route.ts`:

1. Add the import: `import { mint } from "../../(tracerlabs)/growth-audit/_lib/bookingToken";`
2. Change `forwardToDealflow` to return the created lead id instead of a boolean:

```ts
async function forwardToDealflow(lead: Record<string, string>): Promise<string | null> {
  const url = process.env.DEALFLOW_INTAKE_URL;
  const secret = process.env.DEALFLOW_INTAKE_SECRET;
  if (!url || !secret) {
    console.warn("[growth-audit-lead] DEALFLOW_INTAKE_URL/SECRET not set — lead logged only");
    return null;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-intake-secret": secret },
      body: JSON.stringify({ ...lead, source: LEAD_SOURCE }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[growth-audit-lead] dealflow rejected lead:", res.status, await res.text().catch(() => ""));
      return null;
    }
    const json = (await res.json().catch(() => ({}))) as { lead_id?: string };
    return json.lead_id ?? null;
  } catch (err) {
    console.error("[growth-audit-lead] dealflow unreachable:", err);
    return null;
  }
}
```

3. Replace the tail of `POST` (from `const crm = await forwardToDealflow(lead)` onwards) with:

```ts
  const leadId = await forwardToDealflow(lead);
  if (!leadId) console.error("[growth-audit-lead] NOT in dealflow — recover from this log:", lead.email);

  // No lead id means no booking step: the client falls back to the plain
  // thank-you state rather than opening a booking page that cannot book.
  let token: string | undefined;
  if (leadId && process.env.BOOKING_TOKEN_SECRET) {
    try {
      token = mint({ leadId, name: lead.name, email: lead.email, phone: lead.phone });
    } catch (err) {
      console.error("[growth-audit-lead] could not mint booking token:", err);
    }
  }

  return NextResponse.json({ ok: true, ...(token ? { token } : {}) });
```

- [ ] **Step 2: Redirect the form to the booking page**

In `app/(tracerlabs)/growth-audit/_components/LeadForm.tsx`:

1. Import the router: `import { useRouter } from "next/navigation";` and inside the component `const router = useRouter();`
2. In `onSubmit`, replace `setStatus("success");` with:

```ts
      if (json.token) {
        router.push(`/growth-audit/book?t=${encodeURIComponent(json.token as string)}`);
        return; // keep the button in its "Sending…" state through the navigation
      }
      setStatus("success");
```

3. In the `status === "success"` block, replace the promise we cannot keep:

```tsx
            <p className="mt-2 text-ink/60">We&rsquo;ve got your details — we&rsquo;ll be in touch shortly to lock in your audit time.</p>
```

- [ ] **Step 3: Verify**

Run: `npm run build`, then exercise it locally:

```bash
BOOKING_TOKEN_SECRET=local-test \
DEALFLOW_INTAKE_URL=http://localhost:3311/api/leads/intake \
DEALFLOW_INTAKE_SECRET=$(grep '^LEAD_INTAKE_SECRET=' ../../SalesDashboard/tracerlabs-sales-dashboard/.env.local | cut -d= -f2-) \
npx next dev -p 3101
```

with dealflow running on 3311, then submit the form in a browser at `http://localhost:3101/growth-audit` using a name prefixed `TEST — delete me`. Expected: redirect to `/growth-audit/book?t=…`, a grid of times, and after confirming, the "You're booked." panel. **Delete the test lead, contact, business rows and the calendar event afterwards.**

- [ ] **Step 4: Commit**

```bash
git add app/api/growth-audit-lead/route.ts "app/(tracerlabs)/growth-audit/_components/LeadForm.tsx"
git commit -m "feat(growth-audit): send submitters to the booking step"
```

---

### Task 8: Ship it

**Files:** none (configuration and verification only).

- [ ] **Step 1: Set the production environment variables**

```bash
# landing
cd /Users/subaiyal/development/tracerlabs/landingpages/tracerlab-landingpage
openssl rand -hex 32 | vercel env add BOOKING_TOKEN_SECRET production --scope team_XFZamY8bMnv4DjRkPfUvRRx4 --sensitive

# dealflow (only if the calendar is not sufyanshk@tracerlabs.io)
cd /Users/subaiyal/development/tracerlabs/SalesDashboard/tracerlabs-sales-dashboard
printf '%s' 'sufyanshk@tracerlabs.io' | vercel env add BOOKING_CALENDAR_ID production --scope team_XFZamY8bMnv4DjRkPfUvRRx4
```

- [ ] **Step 2: Rehearse on a throwaway calendar**

Create a secondary Google Calendar (e.g. "Booking test"), share it with edit rights to the service account's impersonated user, set `BOOKING_CALENDAR_ID` to its id in `.env.local`, and book one slot through the local funnel. Confirm: the event exists, it has a Meet link, the attendee is the test email, and the CRM lead moved to **Appointment Set**. Then delete the event and the test CRM rows.

- [ ] **Step 3: Deploy both repos**

Push to `main` in each repo (as the configured git identity, so Vercel does not block the build) and wait for both production deployments to report `READY`.

- [ ] **Step 4: Verify on production**

Submit the live form at `https://www.tracerlabs.io/growth-audit` with a name prefixed `LIVE TEST — delete me`, book the **last** slot in the window (least likely to collide with anything real), and confirm: the booking page rendered in your timezone, the confirmation panel showed the right time, the invite arrived, the event is on the calendar, and the CRM lead is at **Appointment Set** with the note. Then delete the event, the lead, the contact and the business.

- [ ] **Step 5: Update the docs**

Add a paragraph to `CLAUDE.md` (landing repo) under the components section describing `/growth-audit/book`, the token, the proxy routes, and the rule that Google Calendar is the only source of availability. Commit.

---

## Self-review

**Spec coverage:** decisions table → Tasks 1–3, 6, 7; architecture diagram → Tasks 3, 5; components list → Tasks 1–7; rules table → Task 1 (`DEFAULT_SLOT_CONFIG`); failure-handling table → expired token (Task 6 page), calendar unreachable (Tasks 5, 6 error state), no slots (Task 6 empty state), 409 (Tasks 3, 5, 6), CRM write failure (Task 3), lead without booking (Task 7 token-less fallback); testing section → Tasks 1, 4 unit tests and Task 8 rehearsal; blocking dependency → Task 2 Step 3 gate.

**Not covered by design:** the conversion-pixel move to the booking confirmation is listed in the spec as "related, not blocking" and is deliberately not a task here.

**Type consistency:** `SlotConfig`/`Interval`/`generateSlots`/`isSlotFree` are defined in Task 1 and used with the same names in Task 3. `BookingPayload`/`mint`/`read` are defined in Task 4 and used in Tasks 5, 6, 7. `freeBusy`/`createBookingEvent`/`bookingCalendarId` are defined in Task 2 and used in Task 3. The dealflow routes return `{ success: true, ... }` (`apiSuccess`) and the landing proxies check `json.success`, then return `{ ok: true, ... }` to the browser, which the client checks as `json.ok` — consistent across Tasks 3, 5, 6, 7.
