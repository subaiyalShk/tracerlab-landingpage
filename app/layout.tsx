import type { Metadata, Viewport } from "next";
import Script from "next/script";

// Root layout: only <html>/<body> and the site-wide beforeInteractive scripts
// (Next requires beforeInteractive in the ROOT layout). Per-area styling/metadata
// live in the route-group layouts: app/(tracerlabs)/ for the main site,
// app/solar/ for the standalone funnel. No global CSS is imported here so that
// each area stays fully isolated.

export const metadata: Metadata = {
  metadataBase: new URL("https://tracerlabs.io"),
  title: "Tracerlabs",
  description: "AI products, web & mobile apps, and growth systems by Tracerlabs.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning on <html>/<body>: the css-bootstrap script sets data-theme on
  // <html> before React hydrates (the SSR markup intentionally lacks it), and browser
  // extensions add attributes to <body>. Both are expected pre-hydration mutations, not bugs.
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Legacy stylesheet bootstrap for the main Tracerlabs site. Injected as plain
            (non-React-managed) <link>s so the theme toggle can swap #theme-stylesheet's
            href cleanly. Gated by pathname so standalone pages (e.g. /solar) never load
            the legacy CSS. Runs beforeInteractive: CSS in <head> before first paint and
            before the hero canvas measures its layout. */}
        <Script id="css-bootstrap" strategy="beforeInteractive">
          {`(function () {
  if (location.pathname.indexOf('/solar') === 0) return;
  function css(href, id) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; if (id) l.id = id; document.head.appendChild(l); }
  css('/style.css', 'theme-stylesheet');
  var t; try { t = localStorage.getItem('theme'); } catch (e) {}
  document.documentElement.dataset.theme = t === 'light' ? 'light' : 'dark';
})();`}
        </Script>

        {children}

        {/* The legacy app drives ONLY the hero <canvas> (ScreenAnimation). It's decorative and
            above-the-fold but NOT critical to first paint, so it runs afterInteractive (off the
            render-blocking path) instead of beforeInteractive. The <canvas> is server-rendered in
            Hero, so deferring the JS causes no layout shift. app.js self-gates its init off /solar. */}
        <Script src="/legacy/app.js" strategy="afterInteractive" />

        {/* Hotjar / Contentsquare analytics (hjid 5253738). lazyOnload = browser-idle, off the
            INP/LCP path (analytics is never critical to first interaction). */}
        <Script id="hotjar" strategy="lazyOnload">
          {`(function (c, s, q, u, a, r, e) { c.hj=c.hj||function(){(c.hj.q=c.hj.q||[]).push(arguments)}; c._hjSettings = { hjid: a }; r = s.getElementsByTagName('head')[0]; e = s.createElement('script'); e.async = true; e.src = q + c._hjSettings.hjid + u; r.appendChild(e); })(window, document, 'https://static.hj.contentsquare.net/c/csq-', '.js', 5253738);`}
        </Script>
      </body>
    </html>
  );
}
