import type { ReactNode } from "react";
import SlideBackdrop from "./SlideBackdrop";

// One full-viewport snap slide. Centered content column; `id` anchors nav/CTAs.
// `bgSrc` adds a dimmed, edge-masked illustrative backdrop behind the content.
export default function Slide({
  id,
  children,
  className = "",
  contentClassName = "",
  bgSrc,
  bgOpacity = 0.3,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
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
      <div className={`mx-auto w-full max-w-[1180px] px-6 py-24 sm:px-10 ${contentClassName}`}>{children}</div>
    </section>
  );
}
