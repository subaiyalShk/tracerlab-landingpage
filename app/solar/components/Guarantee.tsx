import { Section, Shield, CTAButton } from "./primitives";

export default function Guarantee() {
  return (
    <Section id="guarantee">
      <div className="relative overflow-hidden rounded-3xl border border-solar/25 bg-gradient-to-br from-surface to-base-2 p-8 text-center sm:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(50% 70% at 50% 0%, rgba(245,179,1,0.18), transparent 70%)",
          }}
        />
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber to-ember text-[#1a0f02] shadow-[0_14px_40px_-10px_rgba(249,115,22,0.6)]">
          <Shield className="h-8 w-8" />
        </span>

        {/* PLACEHOLDER: finalize the exact guarantee terms before launch. */}
        <h2 className="font-display mx-auto mt-6 max-w-2xl text-[clamp(1.7rem,3.6vw,2.6rem)] font-semibold leading-tight text-cream">
          Booked appointments in 30 days — or you don&apos;t pay.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-sand">
          We&apos;re so confident in the system that we put our fee on the line. If we
          don&apos;t deliver qualified solar appointments in your first month, you owe us
          nothing. <span className="text-faint">(Placeholder terms — confirm before launch.)</span>
        </p>
        <div className="mt-8 flex justify-center">
          <CTAButton href="#book">Claim your strategy call</CTAButton>
        </div>
      </div>
    </Section>
  );
}
