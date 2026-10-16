// app/course/layout.tsx
// Tracking for /course and /course/checkout. Same tags as the /users funnel
// (app/users/layout.tsx): GTM, Google Ads + GA4 on one gtag library, the
// OpenAI pixel and both Meta pixels.
//
// Kept deliberately in step with the funnel layout: if an ID changes there,
// change it here too. The page view fires on both Meta pixels, as it does in
// the funnel, so each agency sees the same traffic.
//
// The course sells for Rs 99, so the conversion here is a PURCHASE, sent from
// the checkout after payment is verified - not the funnel's lead event. That
// keeps course buyers out of the programme's lead optimisation.
//
// Pure ASCII file.

import Script from "next/script";

const GOOGLE_ADS_ID = "AW-18352829434";
const GA4_ID = "G-LEFM5XNNP5";
const GTM_ID = "GTM-P2Q8FQJ3";
const OAI_PIXEL_ID = "ExeXJ9TEEr7Gci9U65VWhm";
const META_PIXEL_ID = "1388275653443222";
const META_PIXEL_ID_2 = "1110969804946521";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Google Tag Manager */}
      <Script id="gtm-course" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {/* Google Ads + GA4 on a single gtag library */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="afterInteractive" />
      <Script id="google-tags-course" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
          gtag('config', '${GA4_ID}');
        `}
      </Script>

      {/* OpenAI ads pixel */}
      <Script id="oaiq-course" strategy="afterInteractive">
        {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${OAI_PIXEL_ID}"});`}
      </Script>

      {/* Meta Pixel (both destinations, as on the funnel) */}
      <Script id="meta-pixel-course" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('init', '${META_PIXEL_ID_2}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>

      {children}
    </>
  );
}