import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import AgentsHero from "./_components/AgentsHero";
import TrustStrip from "./_components/TrustStrip";
import AutopilotSystem from "./_components/AutopilotSystem";
import AiWorkforce from "./_components/AiWorkforce";
import WhatThisReplaces from "./_components/WhatThisReplaces";
import FinancialImpact from "./_components/FinancialImpact";
import Deployments from "./_components/Deployments";
import AgentsCta from "./_components/AgentsCta";
import StickyCtaBar from "../../components/StickyCtaBar";

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

export default function AgentsPage() {
  const voiceEnabled = Boolean(process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID);
  const calcomUrl =
    process.env.NEXT_PUBLIC_CAL_BOOKING_LINK || "https://cal.com/team/tracerlabs/discovery-call";

  return (
    <>
      {/* Hero before Nav: the hero fills the first screen (100vh - 5rem) and the sticky nav
          rests at the bottom of it, rising to the top on scroll — same choreography as the
          home page. Nav links point at THIS page's section ids (the home anchors don't exist
          here). */}
      <AgentsHero />
      <Nav
        links={[
          { label: "How It Works", href: "#tl-ag-system" },
          { label: "Your AI Team", href: "#tl-ag-workforce" },
          { label: "Results", href: "#tl-ag-deployments" },
        ]}
        contactHref="#tl-ag-cta"
      />
      {/* font-body so all new sections inherit the brand body font (no #tl-* isolation edit
          needed — the legacy *{font-family:Inter} leak was removed in the perf work). Headings
          use the font-display utility. */}
      <main id="content" className="font-body bg-page text-ink">
        <TrustStrip />
        <AutopilotSystem />
        <AiWorkforce />
        <WhatThisReplaces />
        <FinancialImpact />
        <Deployments />
        <AgentsCta voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        <StickyCtaBar
          heroId="tl-ag-hero"
          ctaId="tl-ag-cta"
          message="Your business, on autopilot"
          buttonHref="#tl-ag-cta"
        />
      </main>
      <Footer />
    </>
  );
}
