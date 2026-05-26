import type { Metadata } from "next";
import Script from "next/script";

// NOTE: Tailwind's globals.css is intentionally NOT imported here. This page is a
// pixel-identical lift-and-shift of the legacy static site, which ships its own CSS
// (public/style.css + public/light-mode.css). Tailwind stays installed for future
// landing pages and will be wired in when we componentize.

export const metadata: Metadata = {
  metadataBase: new URL("https://tracerlabs.io"),
  title: "Tracerlabs | AI Development Agency",
  description:
    "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
  keywords: [
    "AI development",
    "web development",
    "mobile apps",
    "business automation",
    "digital transformation",
  ],
  icons: {
    icon: "/assets/favicon.ico",
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://tracerlabs.io",
    title: "Tracerlabs | AI Development Agency",
    description:
      "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
    images: ["https://tracerlabs.ai/assets/Tracer.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tracerlabs | AI Development Agency",
    description:
      "Transform your business with AI-powered digital solutions. We build cutting-edge web and mobile applications that drive real business results.",
    images: ["https://tracerlabs.ai/assets/Tracer.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Stylesheet bootstrap. These are injected as plain (non-React-managed) <link>
            elements rather than rendered by React, because the legacy theme toggle swaps
            #theme-stylesheet's href between /style.css and /light-mode.css — and a React
            `precedence` stylesheet refuses to release the old sheet on an href change, so
            both themes would stack. Running beforeInteractive puts the CSS in <head>
            before first paint (no FOUC) and before the legacy app measures the hero
            canvas (which needs real layout to size itself). The theme is read from
            localStorage up front so the correct theme paints immediately. */}
        <Script id="css-bootstrap" strategy="beforeInteractive">
          {`(function () {
  function css(href, id) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; if (id) l.id = id; document.head.appendChild(l); }
  css('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css');
  css(localStorage.getItem('theme') === 'light' ? '/light-mode.css' : '/style.css', 'theme-stylesheet');
})();`}
        </Script>

        {children}

        {/* AOS must be defined before the legacy app boots (it calls AOS.init()).
            beforeInteractive scripts execute in order, after css-bootstrap above. */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"
          strategy="beforeInteractive"
        />
        <Script src="/legacy/app.js" strategy="beforeInteractive" />

        {/* Hotjar / Contentsquare analytics (hjid 5253738). */}
        <Script id="hotjar" strategy="afterInteractive">
          {`(function (c, s, q, u, a, r, e) { c.hj=c.hj||function(){(c.hj.q=c.hj.q||[]).push(arguments)}; c._hjSettings = { hjid: a }; r = s.getElementsByTagName('head')[0]; e = s.createElement('script'); e.async = true; e.src = q + c._hjSettings.hjid + u; r.appendChild(e); })(window, document, 'https://static.hj.contentsquare.net/c/csq-', '.js', 5253738);`}
        </Script>
      </body>
    </html>
  );
}
