import Slide from "./Slide";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { Kinetic, Reveal } from "../../../components/motion";

type Row = { label: string; live: boolean };

const ROWS: Row[] = [
  { label: "Funnel dashboard — lead to replied to qualified to signed, by state, channel and ad set", live: true },
  { label: "Meta lead ID, form, ad, ad set and campaign stored per lead, with the full raw payload", live: true },
  { label: "Duplicate protection against Meta's webhook retries", live: true },
  { label: "Signed deals exclude those closed by another sales partner", live: true },
  { label: "Lead outcomes sent back to Meta", live: false },
  { label: "Ad spend in the system — cost per lead, cost per qualified, cost per acquisition", live: false },
  { label: "Attribution keyed to stable campaign and ad set IDs rather than names", live: false },
  { label: "Meta click tracking on website forms", live: false },
];

export default function AuditSlide() {
  return (
    <Slide id="tl-solrite-audit" bgSrc="/assets/solrite/gen/audit-v1.png" bgOpacity={0.16}>
      <div className="max-w-[46rem]">
        <Eyebrow>What we found</Eyebrow>
        <Kinetic
          segments={[{ text: "The hard part is " }, { text: "already built.", gradient: true }]}
          className="font-display mt-6 text-[clamp(1.9rem,4.8vw,3.2rem)] font-normal uppercase leading-[1.0] tracking-tight"
        />
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-[43rem] text-[1.02rem] leading-relaxed text-ink/55">
            We audited the Spark codebase in full. The finding that matters:{" "}
            <span className="text-ink/85">every Meta lead is already stored with Meta&apos;s own lead ID</span>{" "}
            — the exact key needed to tell Meta what became of it. The outcome data is there. The join key is
            there. The connection was simply never made.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.25}>
        <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="mt-9">
          <ul className="flex flex-col p-2 sm:p-3">
            {ROWS.map((r) => (
              <li
                key={r.label}
                className="flex items-start justify-between gap-5 border-b border-ink/[0.07] px-4 py-3.5 last:border-b-0"
              >
                <span className="text-[0.94rem] leading-snug text-ink/70">{r.label}</span>
                <span
                  className={`bv-6 shrink-0 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] ${
                    r.live ? "bg-ink/[0.07] text-ink/60" : "bg-brand-pink/15 text-brand-pink"
                  }`}
                >
                  {r.live ? "Live" : "Missing"}
                </span>
              </li>
            ))}
          </ul>
        </Bevel>
      </Reveal>

      <Reveal delay={0.32}>
        <p className="mt-6 max-w-[46rem] border-l-2 border-ink/15 pl-5 text-[0.92rem] leading-relaxed text-ink/45">
          <span className="text-ink/70">One thing we could not verify.</span> We reviewed the code, not the
          live account. We cannot yet confirm from the outside that the Meta lead webhook is switched on in
          production, or how many leads have actually flowed through it — if the credentials are not set, the
          system skips leads quietly rather than failing loudly. That is the first thing we would check.
        </p>
      </Reveal>
    </Slide>
  );
}
