import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./sop.css";

// Standalone, isolated layout for the internal Sales Team SOP (same pattern as app/solar/).
// It lives OUTSIDE the (tracerlabs) route group, so it never inherits the dark site chrome,
// globals.css, Nav, or Footer. Inter matches the source playbook's typography.

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sales Team SOP",
  description:
    "The complete playbook for maximizing leads, converting at the highest rate, and staying consistent.",
  alternates: { canonical: "/sales-sop" },
  // Internal tool — keep it off search engines and the public marketing surface.
  robots: { index: false, follow: false },
};

export default function SalesSopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={inter.variable}>{children}</div>;
}
