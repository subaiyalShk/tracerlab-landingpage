// Final CTA over the breathing horizon, then the funnel's own quiet footer
// (legal + policy links only — no site nav, nothing to leak the visitor away).
import Button from "../../../components/Button";
import { PRIVACY_URL, TERMS_URL } from "../config";

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

export function FinalCta() {
  return (
    <section className="font-body relative isolate w-full overflow-hidden bg-page py-14 text-center text-ink">
      <div aria-hidden className="nt-horizon -z-10 !bottom-0 !h-[60%]" />
      <div className="mx-auto w-full max-w-[600px] px-5">
        <h2
          className="text-[clamp(1.5rem,6.4vw,2.6rem)] font-normal uppercase leading-[1.12] tracking-[-0.01em]"
          style={{ fontFamily: "var(--font-duborics), var(--font-archivo), sans-serif" }}
        >
          Find out where your leads are leaking.
        </h2>
        <p className="mx-auto mb-6 mt-3.5 max-w-[30rem] text-ink/60">
          Thirty minutes, free, and you leave with the map whether you hire us or not.
        </p>
        <Button href="#form-card" variant="primary" size="lg" className="w-full sm:w-auto">
          Get my free Growth Audit
        </Button>
        <p className="mt-3 text-[0.9rem] text-ink/50">We reply within a day.</p>
      </div>
    </section>
  );
}

export function AuditFooter() {
  return (
    <footer className="font-body w-full bg-page px-5 pb-10 pt-7 text-center text-[0.84rem] text-ink/50">
      <div className="mx-auto w-full max-w-[960px]">
        <p className="mb-2.5 text-[0.75rem] font-bold tracking-[0.14em]" style={{ fontFamily: DISPLAY }}>
          <span className="text-brand-pink">THINK IT</span> <span className="text-brand-blue">BUILD IT</span>
        </p>
        Tracerlabs &middot; Texas, USA &middot; jarvis@tracerlabs.io
        <br />
        <a href={PRIVACY_URL}>Privacy Policy</a> &middot; <a href={TERMS_URL}>Terms of Service</a>
        <p className="mt-3 text-[0.72rem] leading-[1.6] text-ink/40">
          Results shown are from specific client campaigns and are not a guarantee of future results. By submitting the form
          you agree to be contacted by Tracerlabs at the number provided, including by automated text message and AI voice.
          Consent is not a condition of purchase. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt
          out, HELP for help.
        </p>
        <p className="mt-3 text-[0.72rem] leading-[1.6] text-ink/40">&copy; {new Date().getFullYear()} Tracerlabs. All rights reserved.</p>
      </div>
    </footer>
  );
}
