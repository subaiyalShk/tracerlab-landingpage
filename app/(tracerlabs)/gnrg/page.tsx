import type { Metadata } from "next";
import Link from "next/link";
import Button from "../../components/Button";
import Deck from "./_components/Deck";
import CoverSlide from "./_components/CoverSlide";
import ProblemSlide from "./_components/ProblemSlide";
import SystemSlide from "./_components/SystemSlide";
import HowItWorksSlide from "./_components/HowItWorksSlide";
import ProofSlide from "./_components/ProofSlide";
import RoasSlide from "./_components/RoasSlide";
import ValueSlide from "./_components/ValueSlide";
import TimelineSlide from "./_components/TimelineSlide";
import PricingSlide from "./_components/PricingSlide";

export const metadata: Metadata = {
  title: "Solar Growth Engine for GNRG",
  description:
    "A proven, fully-managed solar growth system for GNRG — paid traffic to booked appointments to installable jobs, branded to you and priced to pay for itself.",
  alternates: { canonical: "/gnrg" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/gnrg",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Solar Growth Engine for GNRG | Tracerlabs",
    description:
      "Ad click to booked appointment to installable job — a proven, fully-managed solar growth system, branded to GNRG. See the system + pricing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Growth Engine for GNRG | Tracerlabs",
    description: "A proven, fully-managed solar growth system for GNRG. See the system + ROI-based pricing.",
  },
};

export default function GnrgPage() {
  const calcomUrl =
    process.env.NEXT_PUBLIC_CAL_BOOKING_LINK || "https://cal.com/team/tracerlabs/discovery-call";

  return (
    <div className="font-body bg-page text-ink">
      {/* minimal fixed top bar — logo + book-a-call, over the deck */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 sm:px-10">
          <Link href="/" aria-label="Tracerlabs home" className="flex items-center transition-opacity hover:opacity-80">
            {/* same logo treatment as the site nav (oversized inside a fixed window to crop the
                PNG's transparent padding) */}
            <span className="flex h-16 shrink-0 items-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[123px] w-auto max-w-none translate-y-[-2px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[128px] w-auto max-w-none translate-y-[0.5px]" />
            </span>
          </Link>
          <Button href="#tl-gnrg-pricing" variant="primary" size="sm">See pricing</Button>
        </div>
      </header>

      <Deck count={9}>
        <CoverSlide />
        <ProblemSlide />
        <SystemSlide />
        <HowItWorksSlide />
        <ProofSlide />
        <RoasSlide />
        <ValueSlide />
        <TimelineSlide />
        <PricingSlide calcomUrl={calcomUrl} />
      </Deck>
    </div>
  );
}
