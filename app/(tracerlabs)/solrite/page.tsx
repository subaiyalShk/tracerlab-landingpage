import type { Metadata } from "next";
import Link from "next/link";
import Deck from "./_components/Deck";
import DeckCta from "./_components/DeckCta";
import CoverSlide from "./_components/CoverSlide";
import ComplaintSlide from "./_components/ComplaintSlide";
import ProblemSlide from "./_components/ProblemSlide";
import LoopSlide from "./_components/LoopSlide";
import BlindSpotSlide from "./_components/BlindSpotSlide";
import NumbersSlide from "./_components/NumbersSlide";
import AuditSlide from "./_components/AuditSlide";
import MonthOneSlide from "./_components/MonthOneSlide";
import CheckpointSlide from "./_components/CheckpointSlide";
import FunnelSlide from "./_components/FunnelSlide";
import NeedsSlide from "./_components/NeedsSlide";
import CtaSlide from "./_components/CtaSlide";

export const metadata: Metadata = {
  title: "Closing the Loop on Meta Lead Ads — for Solrite Energy",
  description:
    "Meta optimises Solrite's lead campaigns for form submissions, not customers. A five-step plan to send real outcomes back to Meta and price the funnel properly.",
  alternates: { canonical: "/solrite" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/solrite",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Closing the Loop on Meta Lead Ads | Tracerlabs × Solrite",
    description:
      "Your ads are optimised for form fills, not customers. What we found in the Spark codebase, and the five steps to fix it.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Closing the Loop on Meta Lead Ads | Tracerlabs × Solrite",
    description: "Your ads are optimised for form fills, not customers. The audit, and the plan.",
  },
};

export default function SolritePage() {
  return (
    <div className="font-body bg-page text-ink">
      {/* minimal fixed top bar — logo + CTA, over the deck */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-6 sm:px-10">
          <Link href="/" aria-label="Tracerlabs home" className="flex items-center transition-opacity hover:opacity-80">
            <span className="flex h-16 shrink-0 items-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-dark.png" alt="Tracerlabs" data-logo="dark" className="h-[123px] w-auto max-w-none translate-y-[-2px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-light.png" alt="Tracerlabs" data-logo="light" className="h-[128px] w-auto max-w-none translate-y-[0.5px]" />
            </span>
          </Link>
          <DeckCta target="tl-solrite-month-one" variant="primary" size="sm">Month one</DeckCta>
        </div>
      </header>

      <Deck count={12}>
        <CoverSlide />
        <ComplaintSlide />
        <ProblemSlide />
        <LoopSlide />
        <BlindSpotSlide />
        <NumbersSlide />
        <AuditSlide />
        <FunnelSlide />
        <MonthOneSlide />
        <CheckpointSlide />
        <NeedsSlide />
        <CtaSlide />
      </Deck>
    </div>
  );
}
