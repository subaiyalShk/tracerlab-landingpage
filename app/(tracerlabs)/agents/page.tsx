import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Custom AI Products & Agents",
  description:
    "Voice call agents and custom agentic workflows that run your business on autopilot — from lead generation to closing deals to managing operations.",
  alternates: { canonical: "/agents" },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/agents",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Custom AI Products & Agents | Tracerlabs",
    description:
      "Voice call agents and custom agentic workflows that run your business on autopilot.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom AI Products & Agents | Tracerlabs",
    description:
      "Voice call agents and custom agentic workflows that run your business on autopilot.",
  },
};

// Server component. (The Retell env reads for VoiceWidget are added in Task 8, alongside the
// CTA that consumes them — keeping page.tsx lint-clean here with no unused vars.)
export default function AgentsPage() {
  return (
    <>
      <Nav />
      {/* font-body so all new sections inherit the brand body font (no #tl-* isolation edit
          needed — the legacy *{font-family:Inter} leak was removed in the perf work). Headings
          use the font-display utility. */}
      <main id="content" className="font-body bg-page text-ink">
        {/* sections added in Tasks 2–8 */}
      </main>
      <Footer />
    </>
  );
}
