"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Adds the `reveal-active` class to its wrapper once it scrolls into view, so descendants can
// choreograph staggered entrance animations via the `[.reveal-active_&]:…` Tailwind variant.
// Reduced motion is handled by the children (they carry `motion-reduce:` overrides that show the
// final state with no transition). Reusable across stages.
export default function Reveal({
  children,
  className = "",
  threshold = 0.2,
}: {
  children: ReactNode;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`${active ? "reveal-active" : ""} ${className}`}>
      {children}
    </div>
  );
}
