import Script from "next/script";
import { GA_ID, META_PIXEL_ID } from "../_lib/pixel";

// Meta Pixel + GA4 base tags for the funnel and its booking page.
//
// Rendered only when the corresponding ID is configured, so an unconfigured
// site ships no third-party script at all. `afterInteractive` keeps them off
// the critical path — this is a paid landing page and its speed is the ad's
// cost per click.
//
// NOTE: no PageView-as-conversion here. The conversion is fired from the
// booking confirmation (see _lib/pixel.ts).
export default function Tags() {
  return (
    <>
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
