"use client";

import Button from "../../../components/Button";
import { scrollToSlide } from "./deckScroll";

// In-deck CTA. See deckScroll.ts for why this can't be a plain <a href="#id">.
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
    <Button variant={variant} size={size} onClick={() => scrollToSlide(target)}>
      {children}
    </Button>
  );
}
