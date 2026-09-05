// Proof wall — the Precocity-style credibility strip: one client, one number,
// nothing else. Sits directly under the hero so the first scroll lands on
// verifiable outcomes. Numbers come from production systems (see /work/*).
const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

const PROOF = [
  { v: "367", l: "solar consultations booked", who: "A Texas solar company" },
  { v: "20", l: "paid bookings in week one", who: "Harbs Farm" },
  { v: "94%", l: "appointment show rate", who: "Across 487 appointments" },
  { v: "2×", l: "lead-to-consult rate", who: "After the AI texting agent" },
];

export default function ProofWall() {
  return (
    <section className="font-body w-full bg-page text-ink">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10">
        <div className="nt-hairline" />
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 py-12 sm:py-14 lg:grid-cols-4">
          {PROOF.map((p, i) => (
            <div key={p.l} className={i > 0 ? "lg:border-l lg:border-ink/10 lg:pl-8" : ""}>
              <dt className="text-[0.82rem] text-ink/45">{p.who}</dt>
              <dd className="mt-2">
                <span
                  className="block text-[2.2rem] font-extrabold leading-none tracking-tight text-ink"
                  style={{ fontFamily: DISPLAY }}
                >
                  {p.v}
                </span>
                <span className="mt-1.5 block text-[0.9rem] leading-snug text-ink/55">{p.l}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
