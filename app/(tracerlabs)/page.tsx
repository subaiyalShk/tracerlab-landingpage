import Hero from "../components/Hero";
import { LANDING_MARKUP } from "../_landing/markup";

// The hero is now a React + Tailwind component (app/components/Hero.tsx).
// The rest of the page is still the legacy static markup, injected as raw HTML
// (first-party, no user input) so the legacy vanilla JS keeps working. We retire
// these sections one at a time as we componentize.
export default function Home() {
  return (
    <>
      <Hero />
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: LANDING_MARKUP }}
      />
    </>
  );
}
