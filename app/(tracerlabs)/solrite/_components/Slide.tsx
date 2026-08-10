import type { ReactNode } from "react";
import SlideBackdrop from "./SlideBackdrop";

// One full-viewport snap slide. Centered content column; `id` anchors nav/CTAs.
// `bgSrc` adds a dimmed, edge-masked illustrative backdrop behind the content.
//
// Vertical padding is its own `padY` prop rather than something you pass through
// `contentClassName`: both land in the same class string with equal specificity, so a
// py-* in contentClassName silently loses to the base py-* and the override does nothing.
export default function Slide({
  id,
  children,
  className = "",
  contentClassName = "",
  padY = "py-24",
  bgSrc,
  bgOpacity = 0.3,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  padY?: string;
  bgSrc?: string;
  bgOpacity?: number;
}) {
  return (
    <section
      data-slide
      id={id}
      className={`relative isolate flex min-h-[100dvh] w-full snap-start flex-col justify-center overflow-hidden bg-page text-ink ${className}`}
    >
      {bgSrc && <SlideBackdrop src={bgSrc} opacity={bgOpacity} />}
      <div className={`mx-auto w-full max-w-[1180px] px-6 sm:px-10 ${padY} ${contentClassName}`}>{children}</div>
    </section>
  );
}
