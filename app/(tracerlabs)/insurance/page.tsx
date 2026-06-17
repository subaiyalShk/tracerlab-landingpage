import type { Metadata } from "next";
import Link from "next/link";
import Button from "../../components/Button";
import Deck from "./_components/Deck";
import CoverSlide from "./_components/CoverSlide";
import ProblemSlide from "./_components/ProblemSlide";
import SolutionSlide from "./_components/SolutionSlide";
import ExperienceSlide from "./_components/ExperienceSlide";
import ProofSlide from "./_components/ProofSlide";
import PricingSlide from "./_components/PricingSlide";

export const metadata: Metadata = {
  title: "AI Voice Agents for Insurance Agencies",
  description:
    "A done-for-you AI voice agent that answers every call — quoting prospects and supporting existing clients 24/7 — with a live owner dashboard. See it live, plus pricing.",
  alternates: { canonical: "/insurance" },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io/insurance",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "AI Voice Agents for Insurance Agencies | Tracerlabs",
    description:
      "Answer every call, support every client, monitor everything — a done-for-you AI voice agent + live dashboard for insurance agencies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Agents for Insurance Agencies | Tracerlabs",
    description: "Done-for-you AI voice agent + live dashboard for insurance agencies. See it live + pricing.",
  },
};

export default function InsurancePage() {
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
          <Button href={calcomUrl} external variant="primary" size="sm">Book a call</Button>
        </div>
      </header>

      <Deck count={6}>
        <CoverSlide />
        <ProblemSlide />
        <SolutionSlide />
        <ExperienceSlide />
        <ProofSlide />
        <PricingSlide calcomUrl={calcomUrl} />
      </Deck>
    </div>
  );
}
