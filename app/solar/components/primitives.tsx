import type { ReactNode, SVGProps } from "react";

/* ── CTA button ───────────────────────────────────────────────────────────── */
export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  if (variant === "ghost") {
    return (
      <a
        href={href}
        className={`inline-flex items-center gap-2 rounded-full border border-cream/15 px-6 py-3.5 text-[0.95rem] font-semibold text-cream/85 transition-colors duration-300 hover:border-cream/40 hover:text-cream ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber to-ember px-7 py-3.5 text-[0.95rem] font-bold text-[#1a0f02] shadow-[0_14px_44px_-10px_rgba(249,115,22,0.7)] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 bg-gradient-to-r from-solar to-amber opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </a>
  );
}

/* ── Eyebrow pill ─────────────────────────────────────────────────────────── */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full border border-solar/25 bg-solar/[0.07] py-1.5 pl-2.5 pr-4">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-solar" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-solar" />
      </span>
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-solar">
        {children}
      </span>
    </div>
  );
}

/* ── Section wrapper ──────────────────────────────────────────────────────── */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative px-6 py-20 sm:px-10 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1180px]">{children}</div>
    </section>
  );
}

/* Section heading kicker + title block */
export function SectionHead({
  kicker,
  title,
  sub,
  center = false,
}: {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="text-[0.74rem] font-bold uppercase tracking-[0.22em] text-solar">
        {kicker}
      </p>
      <h2 className="font-display mt-3 text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-cream">
        {title}
      </h2>
      {sub && <p className="mt-4 text-[1.05rem] leading-relaxed text-sand">{sub}</p>}
    </div>
  );
}

/* ── Icons (inline, no deps) ──────────────────────────────────────────────── */
type Icon = (p: SVGProps<SVGSVGElement>) => ReactNode;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ArrowRight: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const Sun: Icon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const Bolt: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);
export const Phone: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);
export const Calendar: Icon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);
export const Target: Icon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);
export const Shield: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
export const Check: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12l4 4 10-10" />
  </svg>
);
export const Gauge: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 13l4-3" />
    <path d="M3 18a9 9 0 1 1 18 0" />
    <circle cx="12" cy="13" r="1" />
  </svg>
);
export const Layers: Icon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5" />
  </svg>
);
