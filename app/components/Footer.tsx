// Brand footer — replaces the legacy "built by subaiyalShk … pure HTML, CSS and JS" credit.
// Scoped #tl-footer so the brand fonts resolve (globals.css font isolation) and it reads in
// the same sharp/restrained system as the rest of the page.
const LINKS = [
  { label: "Services", href: "#tl-services" },
  { label: "Recent work", href: "#tl-projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer
      id="tl-footer"
      className="font-body relative w-full overflow-hidden border-t border-ink/10 bg-page text-ink"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* brand */}
          <div className="max-w-[27rem]">
            <span className="font-display text-[1.6rem] font-normal uppercase tracking-tight text-ink">
              Tracerlabs
            </span>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/55">
              AI development studio. We design, build, and ship the AI that runs your
              business — voice agents, web &amp; mobile apps, and custom AI.
            </p>
            <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ink/35">
              Think it. Build it.
            </p>
          </div>

          {/* links */}
          <nav className="flex flex-col gap-3.5">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink/35">
              Explore
            </span>
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[0.92rem] text-ink/65 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-ink/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8rem] text-ink/40">
            © 2026 Tracerlabs. All rights reserved.
          </p>
          <p className="text-[0.8rem] text-ink/35">Built in-house.</p>
        </div>
      </div>
    </footer>
  );
}
