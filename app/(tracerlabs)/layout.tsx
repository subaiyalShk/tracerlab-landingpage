import type { Metadata } from "next";
// Tailwind (no-preflight) + the componentized hero styles + legacy coexistence rules.
// Scoped to the main Tracerlabs site so it never touches standalone pages like /solar.
import "../globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const duborics = localFont({
  src: "../../public/fonts/DuboricsRegular.woff2",
  variable: "--font-duborics",
  display: "swap",
  weight: "400",
});

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
  return <div className={`${jakarta.variable} ${duborics.variable}`}>{children}</div>;
}
