"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-deck shell: a full-viewport snap-scroll container (deck feel, page mechanics) with
// a right-side progress rail and ↑/↓ · PageUp/Down keyboard nav. Pure CSS snap is the no-JS
// baseline; JS only adds the progress dots + keyboard. Slides mark themselves with [data-slide].
export default function Deck({ children, count }: { children: React.ReactNode; count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = slides.indexOf(e.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { root, threshold: 0.55 },
    );
    slides.forEach((s) => io.observe(s));

    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(e.key)) return;
      e.preventDefault();
      const dir = e.key === "ArrowDown" || e.key === "PageDown" ? 1 : -1;
      const next = Math.min(slides.length - 1, Math.max(0, active + dir));
      slides[next]?.scrollIntoView({ behavior: "smooth" });
    };
    root.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      root.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const go = (i: number) => {
    ref.current?.querySelectorAll<HTMLElement>("[data-slide]")[i]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      className="h-[100dvh] snap-y snap-mandatory overflow-y-scroll scroll-smooth outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {children}
      <nav aria-label="Slides" className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${i === active ? "scale-[1.4] bg-brand-pink" : "bg-ink/25 hover:bg-ink/55"}`}
          />
        ))}
      </nav>
    </div>
  );
}
