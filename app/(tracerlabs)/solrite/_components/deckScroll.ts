"use client";

// Scroll a deck slide into view.
//
// Two gotchas, both verified in the browser on this deck:
//
//   1. The page body is NOT the scrollport — the Deck's inner div is — so a plain
//      <a href="#id"> has nothing to scroll and is a silent no-op.
//
//   2. Smooth programmatic scrolling does not work on this container at all.
//      scrollIntoView({behavior:"smooth"}) leaves scrollTop at 0 even with
//      scroll-snap-type temporarily set to none, while
//      scrollTo({top, behavior:"instant"}) lands exactly. (The container also sets
//      CSS scroll-behavior: smooth, so behavior:"auto" inherits smooth and fails
//      the same way — "instant" has to be explicit.)
//
// So: compute the offset ourselves and jump. For a full-viewport snap deck an
// instant move reads as a slide change, which is the intent anyway.
export function scrollToSlide(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const deck = el.parentElement;
  if (!deck) {
    el.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    return;
  }

  // Offset of the slide within the scrollport, independent of offsetParent.
  const top = deck.scrollTop + el.getBoundingClientRect().top - deck.getBoundingClientRect().top;
  deck.scrollTo({ top, behavior: "instant" as ScrollBehavior });
}
