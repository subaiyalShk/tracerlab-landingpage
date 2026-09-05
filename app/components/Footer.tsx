// Brand footer (Telemetry redesign) — quiet: Archivo wordmark, hairline top,
// plain links. Explore column keeps /agents and /voice-agents reachable.
const DISPLAY = "var(--font-archivo), system-ui, sans-serif";

const LINKS = [
  { label: "Services", href: "#tl-services" },
  { label: "Recent work", href: "#tl-projects" },
  { label: "AI agents", href: "/agents" },
  { label: "Voice agents", href: "/voice-agents" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer id="tl-footer" className="font-body w-full bg-page text-ink">
      <div className="nt-hairline" />
      <div className="mx-auto w-full max-w-[1280px] px-6 py-14 sm:px-10 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          {/* brand */}
          <div className="max-w-[27rem]">
            <span className="text-[1.25rem] font-extrabold tracking-tight text-ink" style={{ fontFamily: DISPLAY }}>
              Tracerlabs
            </span>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/55">
              AI development studio. We generate the leads and build the systems
              that turn them into revenue — ads, funnels, AI follow-up, and
              custom software.
            </p>
            <p className="mt-4 text-[0.85rem] text-ink/40">Think it. Build it.</p>
          </div>

          {/* links */}
          <nav className="flex flex-col gap-3">
            <span className="text-[0.85rem] font-semibold text-ink/45" style={{ fontFamily: DISPLAY }}>
              Explore
            </span>
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[0.92rem] text-ink/60 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* contact — a real-world anchor */}
          <div className="flex flex-col gap-3">
            <span className="text-[0.85rem] font-semibold text-ink/45" style={{ fontFamily: DISPLAY }}>
              Contact
            </span>
            <a
              href="mailto:jarvis@tracerlabs.io"
              className="text-[0.92rem] text-ink/60 transition-colors hover:text-ink"
            >
              jarvis@tracerlabs.io
            </a>
            <a
              href="https://cal.com/team/tracerlabs/discovery-call"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.92rem] text-ink/60 transition-colors hover:text-ink"
            >
              Book a call
            </a>
            <span className="text-[0.92rem] text-ink/45">Texas, USA</span>
          </div>
        </div>

        {/* ghost wordmark */}
        <div aria-hidden className="pointer-events-none select-none overflow-hidden">
          <div
            className="-mb-[0.34em] mt-10 text-center text-[clamp(4rem,13vw,11rem)] font-extrabold leading-none tracking-tight text-ink/[0.05]"
            style={{ fontFamily: DISPLAY }}
          >
            TRACERLABS
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col gap-2 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8rem] text-ink/40">© 2026 Tracerlabs. All rights reserved.</p>
          <p className="text-[0.8rem] text-ink/35">Built in-house.</p>
        </div>
      </div>
    </footer>
  );
}
