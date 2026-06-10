import type { CSSProperties, ReactNode } from "react";

// Shared dark-glass recipe for card panels (Services tiles, Hero window, Projects copy cards).
// Centralized so the look can't drift. Tuned to sit QUIETLY on the near-black page — a
// near-black fill + faint bevel edge + whisper of top sheen, so cards recede, not pop.
export const GLASS_BORDER = "var(--tl-card-border)";
export const GLASS_BG = "var(--tl-card-bg)";

// Bordered chamfered panel. clip-path can't draw a clean border along the diagonal cut, so
// we stack two clipped layers: the outer is the border color, the inner is inset by 1px with
// the panel's fill — the 1px gap reads as a crisp border that follows the bevel all the way
// around. `bg` is the inner fill (color or gradient), `border` the edge color.
function clip(size: number) {
  return `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, ${size}px 100%, 0 calc(100% - ${size}px))`;
}

export default function Bevel({
  children,
  bevel = 14,
  border = "var(--tl-card-border)",
  bg = "var(--tl-surface)",
  className = "",
  innerClassName = "",
  style,
}: {
  children: ReactNode;
  bevel?: number;
  border?: string;
  bg?: string;
  className?: string;
  innerClassName?: string;
  style?: CSSProperties;
}) {
  const c = clip(bevel);
  return (
    <div className={`relative ${className}`} style={{ filter: "var(--tl-card-shadow, none)", clipPath: c, backgroundColor: border, ...style }}>
      <div
        className={`absolute inset-px overflow-hidden ${innerClassName}`}
        style={{ clipPath: c, background: bg }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
