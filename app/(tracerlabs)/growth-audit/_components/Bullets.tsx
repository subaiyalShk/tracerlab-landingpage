// Three objection bullets, most → least common. Each is a quiet glass panel with
// a brand-blue check chip (same Bevel recipe as the site cards, no hover glow).
import Bevel, { GLASS_BG, GLASS_BORDER } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

const BULLETS = [
  {
    title: "You see booked appointments, not click reports.",
    body: "Every lead is tracked from the ad it came from to the slot on your calendar, so you know exactly what each dollar bought.",
  },
  {
    title: "Leads get answered in minutes, and they show up.",
    body: "AI texts every lead right away, books them, and reminds them. Our clients see a 94% show rate.",
  },
  {
    title: "No new vendor to babysit.",
    body: "One team builds and runs the whole system, from ads to follow-up to booking, so you're not refereeing three agencies.",
  },
];

export default function Bullets() {
  return (
    <section className="font-body w-full bg-page py-14 text-ink">
      <div className="mx-auto w-full max-w-[600px] px-5">
        <div className="mb-7 text-center">
          <Eyebrow>Why owners say yes</Eyebrow>
          <h2 className="mt-3.5 text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
            Built for owners who&rsquo;ve been burned before
          </h2>
        </div>
        <ul className="grid list-none gap-3">
          {BULLETS.map((b) => (
            <li key={b.title}>
              <Bevel bevel={14} border={GLASS_BORDER} bg={GLASS_BG}>
                <div className="relative py-5 pl-[58px] pr-5">
                  <i aria-hidden className="bv-6 absolute left-[18px] top-[21px] grid h-[26px] w-[26px] place-items-center bg-brand-blue not-italic">
                    <span className="h-1.5 w-2.5 -translate-y-px translate-x-px -rotate-45 border-b-[2.5px] border-l-[2.5px] border-white" />
                  </i>
                  <b className="mb-1 block text-[1.05rem] font-bold leading-[1.3]" style={{ fontFamily: DISPLAY }}>
                    {b.title}
                  </b>
                  <p className="text-[0.96rem] text-ink/60">{b.body}</p>
                </div>
              </Bevel>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
