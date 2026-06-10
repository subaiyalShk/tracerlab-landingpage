import type { Metadata } from "next";
// Tailwind (no-preflight) + the componentized hero styles + legacy coexistence rules.
// Scoped to the main Tracerlabs site so it never touches standalone pages like /solar.
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tracerlabs.io"),
  title: {
    default: "Tracerlabs | AI Development Agency",
    template: "%s | Tracerlabs",
  },
  description:
    "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
  keywords: [
    "AI development",
    "web development",
    "mobile apps",
    "business automation",
    "digital transformation",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: "/assets/favicon.ico",
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io",
    siteName: "Tracerlabs",
    locale: "en_US",
    title: "Tracerlabs | AI Development Agency",
    description:
      "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracerlabs | AI Development Agency",
    description:
      "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
  },
};

export default function TracerlabsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
