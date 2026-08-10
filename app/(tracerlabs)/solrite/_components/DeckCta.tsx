"use client";

import Button from "../../../components/Button";

// In-deck CTA. A plain <a href="#id"> does NOT work here: the page body is not the
// scrollport — the Deck's inner div is — so hash navigation has nothing to scroll and the
// click is a no-op. Scroll the target element explicitly instead, which walks up to the
// snap container on its own.
export default function DeckCta({
  target,
  children,
  variant = "primary",
  size = "md",
}: {
  target: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
}) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => {
        const el = document.getElementById(target);
        if (!el) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      }}
    >
      {children}
    </Button>
  );
}
