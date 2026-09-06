// Site nav (Telemetry redesign) — slim sticky bar: logo, quiet Archivo links,
// theme toggle, one Button CTA, hairline underneath. Sits at the top of the
// page (the old "rests at the bottom of the first screen" behavior is retired
// with the redesign). Links default to the home-page sections; pages with
// different anchors pass their own.
import Link from "next/link";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const HOME_LINKS = [
  { label: "Services", href: "#tl-services" },
  { label: "Work", href: "#tl-projects" },
];

const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

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
      className="font-body sticky top-0 z-50 w-full bg-page/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-6 sm:px-10">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80" aria-label="Tracerlabs home">
          <span className="flex h-12 shrink-0 items-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[92px] w-auto max-w-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[96px] w-auto max-w-none" />
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative text-[0.92rem] font-medium text-ink/55 transition-colors hover:text-ink"
              style={{ fontFamily: DISPLAY }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-brand-pink to-brand-blue transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button href={contactHref} variant="primary" size="sm">
            Start your project
          </Button>
        </div>
      </div>
      <div aria-hidden className="nt-hairline" />
    </header>
  );
}
