import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./solar.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tracerlabs.io"),
  title: "Solar Appointments on Autopilot — Without a Door-to-Door Team | Tracerlabs",
  description:
    "We build solar companies a high-converting funnel and an AI agent that books qualified homeowners straight onto your calendar — the same system filling Southern Energy's pipeline.",
  openGraph: {
    type: "website",
    title: "Solar Appointments on Autopilot — Without a Door-to-Door Team",
    description:
      "A done-for-you funnel + AI booking agent that fills your calendar with qualified solar appointments.",
  },
  robots: { index: true, follow: true },
};

export default function SolarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${bricolage.variable} ${jakarta.variable} font-body min-h-screen bg-base text-cream antialiased`}>
      {children}
    </div>
  );
}
