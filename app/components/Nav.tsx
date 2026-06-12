// Sticky nav — place it AFTER a full-height (100vh - 5rem) hero and it rests at the bottom
// of the first screen, then (position: sticky; top: 0) rises to stick at the top on scroll.
// Scoped #tl-nav so the brand fonts resolve (globals font isolation).
// Links default to the home-page sections; pages with different anchors (e.g. /agents) pass
// their own so the nav never points at ids that don't exist on that page.
import Link from "next/link";
import Button from "./Button";
import { GLASS_BORDER, GLASS_BG } from "./Bevel";
import ThemeToggle from "./ThemeToggle";

const HOME_LINKS = [
  { label: "Services", href: "#tl-services" },
  { label: "Works", href: "#tl-projects" },
];

export default function Nav({
  links = HOME_LINKS,
  contactHref = "#contact",
}: {
  links?: { label: string; href: string }[];
  contactHref?: string;
}) {
  return (
    <header
      id="tl-nav"
      className="font-body sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{ background: GLASS_BG, borderColor: GLASS_BORDER }}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-4 px-6 sm:px-10">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80" aria-label="Tracerlabs home">
          {/* The logo PNGs are 300×300 canvases that are ~half transparent padding; render
              them oversized inside a fixed-height overflow-hidden box so the mark isn't
              shrunk by the padding. Sizes/nudges are computed from measured pixel bounds so
              the FULL lockup (pill + "THINK IT BUILD IT" tagline) fits the 64px window in
              both themes with the pill at ~38px:
                dark  — lockup rows 81–229, pill 81–174  → h-123 (scale .41), nudge −2px
                light — lockup rows 97–201, pill 98–187  → h-128 (scale .427), nudge +0.5px
              Re-measure (alpha bbox) if the assets are ever regenerated. */}
          <span className="flex h-16 shrink-0 items-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[123px] w-auto max-w-none translate-y-[-2px]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[128px] w-auto max-w-none translate-y-[0.5px]" />
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-display text-[0.95rem] uppercase tracking-[0.06em] text-ink/70 transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button href={contactHref} variant="primary">
            Contact
          </Button>
        </div>
      </div>
    </header>
  );
}
