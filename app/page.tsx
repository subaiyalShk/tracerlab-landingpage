import { LANDING_MARKUP } from "./_landing/markup";

// Pixel-identical lift-and-shift of the legacy Tracerlabs landing page.
// LANDING_MARKUP is first-party static HTML (no user input). We inject it as raw HTML
// so the legacy vanilla JS in public/legacy/app.js — which finds elements by id/class
// after DOMContentLoaded — keeps working unchanged. `display: contents` keeps this
// wrapper from generating a box, so the legacy CSS sees the markup as if it were a
// direct child of <body>.
export default function Home() {
  return (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: LANDING_MARKUP }}
    />
  );
}
