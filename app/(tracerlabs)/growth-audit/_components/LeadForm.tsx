"use client";

import { useState, type ReactNode } from "react";
import Bevel, { GLASS_BG, GLASS_BORDER } from "../../../components/Bevel";
import Button from "../../../components/Button";
import { AD_SPEND, BUSINESS_TYPES, LEAD_ENDPOINT } from "../config";

// The form card: the page's single conversion point. Five fields (minimum viable
// qualification), inline validation on blur, lead-source hidden fields captured
// from the URL so attribution survives into the CRM, and a JSON POST to the lead
// API (same pattern as /solar's QualForm).
const DISPLAY = "var(--font-archivo), system-ui, sans-serif";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCE_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid", "gclid"] as const;

type Values = {
  name: string;
  phone: string;
  email: string;
  business_type: string;
  ad_spend: string;
};
type Errors = Partial<Record<keyof Values, string>>;

const MESSAGES: Record<keyof Values, string> = {
  name: "Please enter your name.",
  phone: "Please enter a number we can text.",
  email: "Please enter a valid email.",
  business_type: "Please choose one.",
  ad_spend: "Please choose one.",
};

// Lead source from the landing URL, so attribution survives into the CRM.
function leadSource(): Record<string, string> {
  const s: Record<string, string> = {};
  try {
    const p = new URLSearchParams(window.location.search);
    for (const k of SOURCE_KEYS) {
      const v = p.get(k);
      if (v) s[k] = v;
    }
  } catch {}
  return s;
}

function validate(key: keyof Values, value: string): string | undefined {
  const v = value.trim();
  if (!v) return MESSAGES[key];
  if (key === "email" && !EMAIL_RE.test(v)) return MESSAGES.email;
  if (key === "phone" && v.replace(/\D/g, "").length < 10) return MESSAGES.phone;
  return undefined;
}

// Chamfered field chrome. No preflight → set every box property explicitly.
const FIELD =
  "bv-9 block min-h-[50px] w-full appearance-none border border-ink/10 bg-surface px-3.5 py-3 text-[16px] text-ink outline-none transition-colors focus:border-brand-blue focus:shadow-[inset_0_0_0_1px_#056afc]";
const FIELD_INVALID = "border-[#ff6b81]";
const CHEVRON =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a93' stroke-width='2.5' stroke-linecap='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div className="mb-3.5">
      <label htmlFor={htmlFor} className="mb-1.5 block text-[0.9rem] font-semibold text-ink/85">
        {label}
      </label>
      {children}
      {error && (
        <span className="mt-1.5 block text-[0.84rem] text-[#ff6b81]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default function LeadForm() {
  const [values, setValues] = useState<Values>({ name: "", phone: "", email: "", business_type: "", ad_spend: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  function set(key: keyof Values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    // Re-check a field that's already flagged so the error clears as they fix it.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: validate(key, value) }));
  }
  function blur(key: keyof Values) {
    setErrors((e) => ({ ...e, [key]: validate(key, values[key]) }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};
    let first: keyof Values | null = null;
    for (const k of Object.keys(values) as (keyof Values)[]) {
      const err = validate(k, values[k]);
      if (err) {
        next[k] = err;
        first ??= k;
      }
    }
    setErrors(next);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setStatus("submitting");
    setServerError("");
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...leadSource() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      // REPLACE: fire conversion on success, e.g. fbq('track','Lead') + CAPI event with matching event_id
      // REPLACE: or redirect to a thank-you page URL (preferred for tracking)
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const invalid = (k: keyof Values) => (errors[k] ? ` ${FIELD_INVALID}` : "");

  return (
    <Bevel bevel={18} border={GLASS_BORDER} bg={GLASS_BG} className="mt-[34px]">
      <div className="px-5 py-[26px] sm:px-8 sm:py-[34px]">
        {status === "success" ? (
          <div className="py-4 text-center" aria-live="polite">
            <h2 className="text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
              You&rsquo;re in.
            </h2>
            <p className="mt-2 text-ink/60">Check your phone. Our AI will text you in the next few minutes to lock in your audit time.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
              Claim your free Growth Audit
            </h2>
            <p className="mb-5 text-[0.98rem] text-ink/60">
              A 30-minute call where we map exactly where your business is leaking leads, and what it&rsquo;s costing you.
            </p>

            <form onSubmit={onSubmit} noValidate>
              <Field label="Full name" htmlFor="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => blur("name")}
                  className={FIELD + invalid("name")}
                />
              </Field>
              <Field label="Mobile phone" htmlFor="phone" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                  className={FIELD + invalid("phone")}
                />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => blur("email")}
                  className={FIELD + invalid("email")}
                />
              </Field>
              <Field label="Business type" htmlFor="business_type" error={errors.business_type}>
                <select
                  id="business_type"
                  name="business_type"
                  required
                  value={values.business_type}
                  onChange={(e) => set("business_type", e.target.value)}
                  onBlur={() => blur("business_type")}
                  className={FIELD + " bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10" + invalid("business_type")}
                  style={{ backgroundImage: CHEVRON }}
                >
                  <option value="">Select one</option>
                  {BUSINESS_TYPES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Monthly ad spend" htmlFor="ad_spend" error={errors.ad_spend}>
                <select
                  id="ad_spend"
                  name="ad_spend"
                  required
                  value={values.ad_spend}
                  onChange={(e) => set("ad_spend", e.target.value)}
                  onBlur={() => blur("ad_spend")}
                  className={FIELD + " bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10" + invalid("ad_spend")}
                  style={{ backgroundImage: CHEVRON }}
                >
                  <option value="">Select one</option>
                  {AD_SPEND.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>

              {status === "error" && (
                <p className="mb-3 text-[0.9rem] text-[#ff6b81]" role="alert">
                  {serverError} Please try again.
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === "submitting"}
                className="w-full disabled:cursor-default disabled:opacity-55 disabled:hover:translate-y-0"
              >
                {status === "submitting" ? "Sending…" : "Get my free Growth Audit"}
              </Button>
              <p className="mt-3 text-[0.74rem] leading-[1.55] text-ink/45">
                By submitting, you agree Tracerlabs may contact you at the number provided, including by automated text message,
                about your audit. Consent is not a condition of purchase. Msg &amp; data rates may apply. Reply STOP to opt out.
              </p>
            </form>
          </>
        )}
      </div>
    </Bevel>
  );
}
