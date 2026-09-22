import type { Metadata } from "next";
import AuditHero from "./_components/AuditHero";
import LeadForm from "./_components/LeadForm";
import Bullets from "./_components/Bullets";
import Proof from "./_components/Proof";
import { AuditFooter, FinalCta } from "./_components/FinalCta";

// Growth Audit funnel — paid-traffic landing page (/growth-audit).
// Single action: claim the free 30-minute Growth Audit call. Structure follows the
// lead-capture recipe: hero + VSL → form → 3 objection bullets → proof → final CTA.
// No nav, no site footer links. Content + placeholders live in ./config.ts.

export const metadata: Metadata = {
  title: "Stop Paying for Leads Your Team Never Calls Back",
  description:
    "We run your ads, then an AI agent texts every lead within minutes and books them on your calendar. Built and run by one team, tracked from ad dollar to booked job.",
  alternates: { canonical: "/growth-audit" },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/growth-audit",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Stop Paying for Leads Your Team Never Calls Back | Tracerlabs",
    description:
      "We run your ads, then an AI agent texts every lead within minutes and books them on your calendar. Free 30-minute Growth Audit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stop Paying for Leads Your Team Never Calls Back | Tracerlabs",
    description:
      "We run your ads, then an AI agent texts every lead within minutes and books them on your calendar. Free 30-minute Growth Audit.",
  },
};

export default function GrowthAuditPage() {
  return (
    <>
      {/* REPLACE: Meta Pixel base code + Google Ads / GA4 tag (next/script, afterInteractive) */}
      <AuditHero />
      <main id="content" className="font-body bg-page text-ink">
        <div id="form-card" className="mx-auto w-full max-w-[600px] scroll-mt-6 px-5">
          <LeadForm />
        </div>
        <Bullets />
        <div className="nt-hairline" />
        <Proof />
        <FinalCta />
        <AuditFooter />
      </main>
    </>
  );
}
