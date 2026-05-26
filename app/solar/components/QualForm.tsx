"use client";

import { useState, type ReactNode } from "react";
import { BOOKING_URL } from "../config";
import { ArrowRight, Check } from "./primitives";
import {
  ROLES,
  REVENUE_RANGES,
  DEAL_SIZE_RANGES,
  INSTALLS_PER_MONTH,
  AD_SPEND_RANGES,
  MARKETING_CHANNELS,
  BLOCKERS,
  APPOINTMENT_GOALS,
  TIMELINES,
  REFERRAL_SOURCES,
} from "../leadFields";

type Data = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  role: string;
  revenue: string;
  dealSize: string;
  installsPerMonth: string;
  salesReps: string;
  doorToDoor: string;
  doorToDoorSize: string;
  markets: string;
  channels: string[];
  adSpend: string;
  blocker: string;
  blockerOther: string;
  goal: string;
  timeline: string;
  referral: string;
};

const EMPTY: Data = {
  firstName: "", lastName: "", email: "", phone: "", company: "", website: "", role: "",
  revenue: "", dealSize: "", installsPerMonth: "", salesReps: "", doorToDoor: "", doorToDoorSize: "",
  markets: "", channels: [], adSpend: "", blocker: "", blockerOther: "", goal: "", timeline: "", referral: "",
};

const STEPS = ["About you", "Your business", "Marketing & goals", "Confirm"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function QualForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function validateStep(s: number): Partial<Record<keyof Data, string>> {
    const e: Partial<Record<keyof Data, string>> = {};
    if (s === 0) {
      if (!data.firstName.trim()) e.firstName = "Required";
      if (!data.lastName.trim()) e.lastName = "Required";
      if (!data.email.trim()) e.email = "Required";
      else if (!EMAIL_RE.test(data.email)) e.email = "Enter a valid email";
      if (!data.phone.trim()) e.phone = "Required";
      else if (data.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone";
    }
    if (s === 1) {
      if (!data.revenue) e.revenue = "Pick one";
      if (!data.salesReps.trim()) e.salesReps = "Required";
    }
    if (s === 2) {
      if (data.channels.length === 0) e.channels = "Pick at least one";
      if (!data.blocker) e.blocker = "Pick one";
      else if (data.blocker === "Other" && !data.blockerOther.trim())
        e.blockerOther = "Tell us briefly";
    }
    return e;
  }

  const next = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function submit() {
    // validate all gating steps before sending
    for (let s = 0; s <= 2; s++) {
      const e = validateStep(s);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    setStatus("submitting");
    setSubmitError("");
    try {
      const res = await fetch("/api/solar-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") return <SuccessScreen firstName={data.firstName} />;

  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_70px_-26px_rgba(120,72,10,0.28)]">
      {/* Progress header */}
      <div className="border-b border-line px-6 py-5">
        <div className="flex items-center justify-between text-[0.78rem] font-semibold">
          <span className="text-solar">Step {step + 1} of {STEPS.length}</span>
          <span className="text-faint">{STEPS[step]}</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-base-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber to-ember transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Step body */}
      <div className="px-6 py-6">
        {step === 0 && (
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required error={errors.firstName}>
                <TextInput value={data.firstName} onChange={(v) => set("firstName", v)} placeholder="Jane" />
              </Field>
              <Field label="Last name" required error={errors.lastName}>
                <TextInput value={data.lastName} onChange={(v) => set("lastName", v)} placeholder="Doe" />
              </Field>
            </div>
            <Field label="Business email" required error={errors.email}>
              <TextInput type="email" value={data.email} onChange={(v) => set("email", v)} placeholder="jane@yoursolar.com" />
            </Field>
            <Field label="Phone" required error={errors.phone}>
              <TextInput type="tel" value={data.phone} onChange={(v) => set("phone", v)} placeholder="(555) 123-4567" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name">
                <TextInput value={data.company} onChange={(v) => set("company", v)} placeholder="Your Solar Co." />
              </Field>
              <Field label="Website">
                <TextInput value={data.website} onChange={(v) => set("website", v)} placeholder="yoursolar.com" />
              </Field>
            </div>
            <Field label="Your role">
              <Chips options={ROLES} value={data.role} onChange={(v) => set("role", v as string)} />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5">
            <Field label="Current monthly revenue" required error={errors.revenue}>
              <Chips options={REVENUE_RANGES} value={data.revenue} onChange={(v) => set("revenue", v as string)} />
            </Field>
            <Field label="Average revenue per install">
              <Chips options={DEAL_SIZE_RANGES} value={data.dealSize} onChange={(v) => set("dealSize", v as string)} />
            </Field>
            <Field label="Installs closed per month">
              <Chips options={INSTALLS_PER_MONTH} value={data.installsPerMonth} onChange={(v) => set("installsPerMonth", v as string)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="How many sales reps?" required error={errors.salesReps}>
                <TextInput type="number" value={data.salesReps} onChange={(v) => set("salesReps", v)} placeholder="e.g. 4" />
              </Field>
              <Field label="Run a door-to-door team?">
                <Chips options={["Yes", "No"]} value={data.doorToDoor} onChange={(v) => set("doorToDoor", v as string)} />
              </Field>
            </div>
            {data.doorToDoor === "Yes" && (
              <Field label="How many door-to-door reps?">
                <TextInput type="number" value={data.doorToDoorSize} onChange={(v) => set("doorToDoorSize", v)} placeholder="e.g. 8" />
              </Field>
            )}
            <Field label="Markets / states you serve">
              <TextInput value={data.markets} onChange={(v) => set("markets", v)} placeholder="e.g. Texas, Arizona" />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <Field label="Channels you've already tried" required error={errors.channels}>
              <Chips multi options={MARKETING_CHANNELS} value={data.channels} onChange={(v) => set("channels", v as string[])} />
            </Field>
            <Field label="Current monthly marketing spend">
              <Chips options={AD_SPEND_RANGES} value={data.adSpend} onChange={(v) => set("adSpend", v as string)} />
            </Field>
            <Field label="Your biggest blocker to growth" required error={errors.blocker}>
              <Chips options={BLOCKERS} value={data.blocker} onChange={(v) => set("blocker", v as string)} />
            </Field>
            {data.blocker === "Other" && (
              <Field label="Tell us more" required error={errors.blockerOther}>
                <TextInput value={data.blockerOther} onChange={(v) => set("blockerOther", v)} placeholder="What's holding growth back?" />
              </Field>
            )}
            <Field label="How many more appointments / installs do you want per month?">
              <Chips options={APPOINTMENT_GOALS} value={data.goal} onChange={(v) => set("goal", v as string)} />
            </Field>
            <Field label="How soon are you looking to start?">
              <Chips options={TIMELINES} value={data.timeline} onChange={(v) => set("timeline", v as string)} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <div className="rounded-xl border border-line bg-base-2/50 p-4">
              <p className="text-[0.82rem] font-semibold text-cream">Quick recap</p>
              <dl className="mt-3 grid gap-1.5 text-[0.85rem]">
                <Recap label="Name" value={`${data.firstName} ${data.lastName}`.trim()} />
                <Recap label="Email" value={data.email} />
                <Recap label="Phone" value={data.phone} />
                {data.company && <Recap label="Company" value={data.company} />}
                {data.revenue && <Recap label="Revenue" value={data.revenue} />}
                {data.salesReps && <Recap label="Sales reps" value={data.salesReps} />}
                {data.channels.length > 0 && <Recap label="Channels" value={data.channels.join(", ")} />}
                {data.blocker && <Recap label="Biggest blocker" value={data.blocker === "Other" ? data.blockerOther : data.blocker} />}
              </dl>
            </div>
            <Field label="How did you hear about us?">
              <Chips options={REFERRAL_SOURCES} value={data.referral} onChange={(v) => set("referral", v as string)} />
            </Field>
            {status === "error" && (
              <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-[0.85rem] text-red-700">
                {submitError} Please try again.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-5">
        {step > 0 ? (
          <button onClick={back} className="rounded-full px-4 py-2.5 text-[0.9rem] font-semibold text-sand transition-colors hover:text-cream">
            ← Back
          </button>
        ) : (
          <span className="text-[0.78rem] text-faint">Takes ~60 seconds</span>
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber to-ember px-6 py-3 text-[0.9rem] font-bold text-[#1a0f02] shadow-[0_10px_30px_-10px_rgba(249,115,22,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Continue
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={status === "submitting"}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber to-ember px-6 py-3 text-[0.9rem] font-bold text-[#1a0f02] shadow-[0_10px_30px_-10px_rgba(249,115,22,0.7)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Get my strategy call"}
            {status !== "submitting" && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Field primitives ─────────────────────────────────────────────────────── */
function Field({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[0.82rem] font-semibold text-cream">
        {label}
        {required && <span className="text-ember">*</span>}
        {error && <span className="ml-auto text-[0.75rem] font-medium text-red-600">{error}</span>}
      </span>
      {children}
    </label>
  );
}

function TextInput({
  value, onChange, placeholder, type = "text",
}: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-line bg-base-2/40 px-4 py-3 text-[0.95rem] text-cream placeholder:text-faint outline-none transition-colors focus:border-solar focus:bg-surface focus:ring-2 focus:ring-solar/20"
    />
  );
}

function Chips({
  options, value, onChange, multi = false,
}: {
  options: readonly string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
}) {
  const selected = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  const toggle = (o: string) => {
    if (!multi) return onChange(o);
    const cur = value as string[];
    onChange(cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          type="button"
          key={o}
          onClick={() => toggle(o)}
          className={`rounded-full border px-3.5 py-2 text-[0.85rem] font-medium transition-colors ${
            selected(o)
              ? "border-ember bg-ember/10 text-ember"
              : "border-line bg-base-2/40 text-sand hover:border-solar/40 hover:text-cream"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Recap({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-faint">{label}</dt>
      <dd className="text-right font-medium text-cream">{value}</dd>
    </div>
  );
}

function SuccessScreen({ firstName }: { firstName: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-[0_24px_70px_-26px_rgba(120,72,10,0.28)] sm:p-10">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber to-ember text-[#1a0f02] shadow-[0_14px_40px_-12px_rgba(249,115,22,0.6)]">
        <Check className="h-8 w-8" />
      </span>
      <h3 className="font-display mt-6 text-2xl font-semibold text-cream">
        You&apos;re in{firstName ? `, ${firstName}` : ""}.
      </h3>
      <p className="mx-auto mt-3 max-w-sm leading-relaxed text-sand">
        We&apos;ve got your details. Grab the best time below and we&apos;ll map out your
        appointment system on the call.
      </p>
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber to-ember px-7 py-3.5 text-[0.95rem] font-bold text-[#1a0f02] shadow-[0_14px_44px_-10px_rgba(249,115,22,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        Grab a time
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
  );
}
