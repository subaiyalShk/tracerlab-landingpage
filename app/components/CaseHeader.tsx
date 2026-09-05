import Link from "next/link";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

// Slim content-page header (Telemetry redesign) — logo, one quiet link, theme
// toggle, one CTA, hairline. Used on case-study pages; becomes the basis for
// the site-wide nav restyle. Shares <Button> so CTA styling stays consistent.
export default function CaseHeader({
  linkLabel = "All work",
  linkHref = "/#tl-projects",
  ctaLabel = "Start your project",
  ctaHref = "/#contact",
}: {
  linkLabel?: string;
  linkHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/10 bg-page/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1060px] items-center justify-between gap-4 px-6 sm:px-10">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80" aria-label="Tracerlabs home">
          <span className="flex h-12 shrink-0 items-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[92px] w-auto max-w-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[96px] w-auto max-w-none" />
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href={linkHref}
            className="hidden text-[0.92rem] font-medium text-ink/55 transition-colors hover:text-ink sm:block"
            style={{ fontFamily: "var(--font-archivo), system-ui, sans-serif" }}
          >
            {linkLabel}
          </Link>
          <ThemeToggle />
          <Button href={ctaHref} variant="primary" size="sm">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}
