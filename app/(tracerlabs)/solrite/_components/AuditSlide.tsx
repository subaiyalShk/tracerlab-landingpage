import Slide from "./Slide";
import SlideReveal from "./SlideReveal";
import { KineticHeading } from "../../../components/Kinetic";
import Illustration from "./Illustration";
import Bevel, { GLASS_BORDER, GLASS_BG } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

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
    <Slide id="tl-solrite-audit" padY="py-14">
      <div className="grid items-center gap-9 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Eyebrow>What we found</Eyebrow>
          <KineticHeading
            segments={[{ text: "The hard part is " }, { text: "already built.", gradient: true }]}
            className="font-display mt-6 text-[clamp(1.8rem,4.2vw,2.9rem)] font-normal uppercase leading-[1.0] tracking-tight"
          />
          <SlideReveal delay={0.15}>
            <p className="mt-5 text-[1rem] leading-relaxed text-ink/55">
              We audited the Spark codebase in full. The finding that matters:{" "}
              <span className="text-ink/85">every Meta lead is already stored with Meta&apos;s own lead ID</span>{" "}
              — the exact key needed to tell Meta what became of it. The outcome data is there. The join key is
              there. The connection was simply never made.
            </p>
          </SlideReveal>
        </div>

        <SlideReveal delay={0.1}>
          <Illustration
            src="/assets/solrite/gen/il-audit-v1.png"
            alt="A glowing cable already plugged into the equipment cabinet at one end, its other end lying coiled and unconnected on the floor."
            minH="min-h-[250px]"
          />
        </SlideReveal>
      </div>

      <SlideReveal delay={0.24}>
        <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG} className="mt-7">
          <ul className="flex flex-col p-2">
            {ROWS.map((r) => (
              <li
                key={r.label}
                className="flex items-start justify-between gap-5 border-b border-ink/[0.07] px-4 py-2.5 last:border-b-0"
              >
                <span className="text-[0.9rem] leading-snug text-ink/70">{r.label}</span>
                <span
                  className={`bv-6 shrink-0 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] ${
                    r.live ? "bg-ink/[0.07] text-ink/60" : "bg-brand-pink/15 text-brand-pink"
                  }`}
                >
                  {r.live ? "Live" : "Missing"}
                </span>
              </li>
            ))}
          </ul>
        </Bevel>
      </SlideReveal>

      <SlideReveal delay={0.3}>
        <p className="mt-5 max-w-[52rem] border-l-2 border-ink/15 pl-5 text-[0.88rem] leading-relaxed text-ink/45">
          <span className="text-ink/70">One thing we could not verify.</span> We reviewed the code, not the
          live account — we cannot confirm from the outside that the Meta lead webhook is switched on in
          production, or how many leads have actually flowed through it. That is the first thing we would check.
        </p>
      </SlideReveal>
    </Slide>
  );
}
