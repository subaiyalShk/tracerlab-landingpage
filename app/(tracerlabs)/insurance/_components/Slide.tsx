import type { ReactNode } from "react";

// One full-viewport snap slide. Centered content column; `id` anchors nav/CTAs.
export default function Slide({
  id,
  children,
  className = "",
  contentClassName = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      data-slide
      id={id}
      className={`relative flex min-h-[100dvh] w-full snap-start flex-col justify-center overflow-hidden bg-page text-ink ${className}`}
    >
      <div className={`mx-auto w-full max-w-[1180px] px-6 py-24 sm:px-10 ${contentClassName}`}>{children}</div>
    </section>
  );
}
