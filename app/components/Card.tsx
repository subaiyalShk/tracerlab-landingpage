import type { ReactNode } from "react";
import Bevel, { GLASS_BORDER, GLASS_BG } from "./Bevel";

// THE site card — single source of truth for every card panel (Night
// Telemetry): chamfered Bevel geometry, frosted glass fill, hover lift +
// brand underglow that follows the chamfer (drop-shadow, not box-shadow —
// box-shadow gets clipped by the bevel's clip-path).
// Content is wrapped in a relative flex column, so absolutely-positioned
// children (ghost numerals, brackets) anchor to the card.
export default function Card({
  children,
  bevel = 14,
  className = "",
  contentClassName = "",
}: {
  children: ReactNode;
  bevel?: number;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div className={`nt-cardframe ${className}`}>
      <Bevel
        bevel={bevel}
        border={GLASS_BORDER}
        bg={GLASS_BG}
        className="h-full"
        innerClassName="backdrop-blur-xl backdrop-saturate-150"
      >
        <div className={`relative flex h-full flex-col ${contentClassName}`}>{children}</div>
      </Bevel>
    </div>
  );
}
