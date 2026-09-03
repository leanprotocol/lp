import type { Metadata } from "next";
import Script from "next/script";
import "./users.css";

/* Google tags - scoped to the /users funnel only, not the main site.
   gtag/js is loaded once with the Ads ID, then each product is configured
   separately; loading it twice would double-count.
   GTM is a separate container. If GA4 or Ads tags are also configured
   inside GTM-P2Q8FQJ3, remove them from here or events will fire twice. */
const GOOGLE_ADS_ID = "AW-18352829434";
const GA4_ID = "G-LEFM5XNNP5";
const GTM_ID = "GTM-P2Q8FQJ3";

/* OpenAI ads pixel. The loader below defines a queue stub so the measure
   calls in page.tsx work before the SDK has finished downloading.
   debug:true logs to the console - marketing asked for it while they verify
   events are arriving. Remove it once they confirm. */
const OAI_PIXEL_ID = "ExeXJ9TEEr7Gci9U65VWhm";

export const metadata: Metadata = {
  title: "Get Your Personalised Plan | Lean Protocol",
  description:
    "Answer six quick questions and a Lean Protocol expert will call you with a personalised, doctor-guided weight-management plan.",
  robots: { index: false, follow: false },
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="users-page">
      {/* Google Tag Manager */}
      <Script id="gtm" strategy="afterInteractive">
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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tags" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
          gtag('config', '${GA4_ID}');
        `}
      </Script>

      {/* OpenAI ads pixel */}
      <Script id="oaiq" strategy="afterInteractive">
        {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${OAI_PIXEL_ID}",debug:true});`}
      </Script>

      {children}
    </div>
  );
}