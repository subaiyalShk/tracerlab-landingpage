// Sticky top nav — replaces the legacy #main-nav (rounded logo pill + emoji toggle + pink
// hovers + raw #cta button). Scoped #tl-nav so the brand fonts resolve (globals font isolation).
import Button from "./Button";
import { GLASS_BORDER, GLASS_BG } from "./Bevel";

const LINKS = [
  { label: "Services", href: "#tl-services" },
  { label: "Works", href: "#tl-projects" },
];

export default function Nav() {
  return (
    <header
      id="tl-nav"
      className="font-body sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{ background: GLASS_BG, borderColor: GLASS_BORDER }}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-4 px-6 sm:px-10">
        <a href="#" className="flex items-center transition-opacity hover:opacity-80" aria-label="Tracerlabs home">
          {/* logo-dark.png is ~half transparent padding; render it large inside a fixed-height
              overflow-hidden box so the brand mark fills the height instead of being shrunk by
              the padding. */}
          <span className="flex h-16 shrink-0 items-center overflow-hidden">
            {/* The pill mark sits above the square image's center, so shift the oversized image
                down a touch so the crop shows the full pill centered (not clipped at the top). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-dark.png" alt="Tracerlabs" className="h-[150px] w-auto max-w-none translate-y-3" />
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-display text-[0.95rem] uppercase tracking-[0.06em] text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Button href="#contact" variant="primary">
          Contact
        </Button>
      </div>
    </header>
  );
}
