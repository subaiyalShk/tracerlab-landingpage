// Sticky top nav — replaces the legacy #main-nav (rounded logo pill + emoji toggle + pink
// hovers + raw #cta button). Scoped #tl-nav so the brand fonts resolve (globals font isolation).
import Button from "./Button";

const LINKS = [
  { label: "Services", href: "#tl-services" },
  { label: "Works", href: "#tl-projects" },
];

export default function Nav() {
  return (
    <header
      id="tl-nav"
      className="font-body sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/70 backdrop-blur-md"
    >
      <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between gap-4 px-6 sm:px-10">
        <a href="#" className="flex items-center transition-opacity hover:opacity-80" aria-label="Tracerlabs home">
          {/* logo-dark.png is ~half transparent padding; render it large inside a fixed-height
              overflow-hidden box so the brand mark fills the height instead of being shrunk by
              the padding. */}
          <span className="flex h-16 shrink-0 items-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-dark.png" alt="Tracerlabs" className="h-[160px] w-auto max-w-none" />
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-display text-[0.82rem] uppercase tracking-[0.06em] text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Button href="#contact" variant="primary" size="sm">
          Contact
        </Button>
      </div>
    </header>
  );
}
