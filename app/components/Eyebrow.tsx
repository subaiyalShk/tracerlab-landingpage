import type { CSSProperties, ReactNode } from "react";

// The section eyebrow — a beveled glass chip + animated brand ping-dot + uppercase label.
// One component so all four sections stay byte-identical (the dot was drifting before:
// animated in Hero/CTA, static-and-smaller in Services/Projects).
export default function Eyebrow({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`bv-9 animate-rise inline-flex items-center gap-2.5 bg-white/[0.05] py-1.5 pl-2.5 pr-4 backdrop-blur-sm ${className}`}
      style={style}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-pink opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-pink" />
      </span>
      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/70">{children}</span>
    </div>
  );
}
