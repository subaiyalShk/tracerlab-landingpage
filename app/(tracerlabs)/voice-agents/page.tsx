import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import StickyCtaBar from "../../components/StickyCtaBar";
import VoiceHero from "./_components/VoiceHero";
import ProblemStats from "./_components/ProblemStats";
import Capabilities from "./_components/Capabilities";
import CaseStudies from "./_components/CaseStudies";
import VoiceCta from "./_components/VoiceCta";

export const metadata: Metadata = {
  title: "AI Voice Agents with a Live Dashboard",
  description:
    "An AI voice agent that answers every call — qualifying prospects and supporting existing customers 24/7 — backed by a live dashboard where you monitor every call, transcript, and action in real time.",
  alternates: { canonical: "/voice-agents" },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/voice-agents",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "AI Voice Agents with a Live Dashboard | Tracerlabs",
    description:
      "Answer every call and monitor everything. AI voice agents for inbound sales and customer support, with a live owner dashboard.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Agents with a Live Dashboard | Tracerlabs",
    description:
      "Answer every call and monitor everything. AI voice agents with a live owner dashboard.",
  },
};

export default function VoiceAgentsPage() {
  const voiceEnabled = Boolean(process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID);
  const calcomUrl =
    process.env.NEXT_PUBLIC_CAL_BOOKING_LINK || "https://cal.com/team/tracerlabs/discovery-call";

  return (
    <>
      {/* Hero before Nav: it fills the first screen (100vh - 5rem) so the sticky nav rests at
          the bottom and rises on scroll. Nav links point at THIS page's section ids. */}
      <VoiceHero />
      <Nav
        links={[
          { label: "The Problem", href: "#tl-va-problem" },
          { label: "The Dashboard", href: "#tl-va-dashboard" },
          { label: "Case Studies", href: "#tl-va-cases" },
        ]}
        contactHref="#tl-va-cta"
      />
      <main id="content" className="font-body bg-page text-ink">
        <ProblemStats />
        <Capabilities />
        <CaseStudies />
        <VoiceCta voiceEnabled={voiceEnabled} calcomUrl={calcomUrl} />
        <StickyCtaBar
          heroId="tl-va-hero"
          ctaId="tl-va-cta"
          message="Answer every call. Monitor everything."
          buttonHref="#tl-va-cta"
        />
      </main>
      <Footer />
    </>
  );
}
