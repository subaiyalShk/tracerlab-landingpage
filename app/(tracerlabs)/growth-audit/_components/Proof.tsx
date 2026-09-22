// Social proof — underneath everything: four production figures, customer
// testimonials (hidden until at least one real quote is in config), and the
// two founders. Figures use the site's accent + glow treatment (.nt-figure).
import Bevel, { GLASS_BG, GLASS_BORDER } from "../../../components/Bevel";
import Eyebrow from "../../../components/Eyebrow";
import { STATS, STATS_SOURCE, TEAM, TESTIMONIALS } from "../config";

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";
const ACCENT = "var(--tl-accent-text)";

export default function Proof() {
  const testimonials = TESTIMONIALS.filter((t) => !t.placeholder);

  return (
    <section className="font-body w-full bg-page py-14 text-ink">
      <div className="mx-auto w-full max-w-[960px] px-5">
        <div className="mb-7 text-center">
          <Eyebrow>Live production data</Eyebrow>
          <h2 className="mt-3.5 text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
            Numbers from systems we run
          </h2>
        </div>

        <div className="mb-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {STATS.map((s) => (
            <Bevel key={s.label} bevel={12} border={GLASS_BORDER} bg={GLASS_BG}>
              <div className="px-4 py-5">
                <b
                  className="nt-figure block text-[2rem] font-extrabold leading-none tracking-[-0.02em]"
                  style={{ fontFamily: DISPLAY, color: ACCENT }}
                >
                  {s.value}
                </b>
                <span className="mt-2 block text-[0.84rem] text-ink/55">{s.label}</span>
              </div>
            </Bevel>
          ))}
        </div>
        <p className="mb-7 text-center text-[0.78rem] text-ink/45">{STATS_SOURCE}</p>

        {testimonials.length > 0 && (
          <>
            <div className="mb-5 mt-10 text-center">
              <h2 className="text-[1.65rem] font-extrabold leading-[1.15] tracking-[-0.02em]" style={{ fontFamily: DISPLAY }}>
                See what our customers say
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {testimonials.map((t) => (
                <Bevel key={t.name} bevel={16} border={GLASS_BORDER} bg={GLASS_BG}>
                  <figure className="flex h-full flex-col justify-between gap-[18px] px-5 py-[22px]">
                    <blockquote className="text-[1rem] leading-[1.6] text-ink/80">&ldquo;{t.quote}&rdquo;</blockquote>
                    <figcaption className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="bv-6 grid h-10 w-10 shrink-0 place-items-center text-[0.85rem] font-bold text-white"
                        style={{ fontFamily: DISPLAY, background: "linear-gradient(135deg, #e7028d, #056afc)" }}
                      >
                        {t.initials}
                      </span>
                      <span>
                        <b className="block text-[0.98rem] font-bold" style={{ fontFamily: DISPLAY }}>
                          {t.name}
                        </b>
                        <span className="block text-[0.8rem] text-ink/50">{t.who}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Bevel>
              ))}
            </div>
          </>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {TEAM.map((p) => (
            <Bevel key={p.name} bevel={14} border={GLASS_BORDER} bg={GLASS_BG}>
              <div className="px-5 py-[18px]">
                <b className="text-[1.05rem] font-bold" style={{ fontFamily: DISPLAY }}>
                  {p.name}
                </b>
                <span className="mb-1.5 mt-0.5 block text-[0.8rem] font-semibold text-brand-pink">{p.role}</span>
                <p className="text-[0.92rem] text-ink/60">{p.bio}</p>
              </div>
            </Bevel>
          ))}
        </div>
      </div>
    </section>
  );
}
