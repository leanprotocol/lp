import type { Metadata } from "next";
import Script from "next/script";
import "./challenge.css";

// Standalone marketing campaign layout.
// Deliberately does NOT import the main site's Header/Footer/nav -
// this page has zero interconnection with the rest of leanprotocol.in.
// Metadata is plain text: use "Rs", never a rupee symbol (it corrupts).

export const metadata: Metadata = {
  title: "Lean Protocol - 30 Days GLP-1 Challenge | Doctor-Led Weight Care",
  description:
    "A personalised, doctor-led GLP-1 protocol. Start with a Rs 449 doctor consultation. Eligibility is decided by a licensed doctor; individual results vary.",
};

const LINKEDIN_PARTNER_ID = "9794132";

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="challenge-page">
      {children}

      {/* LinkedIn Insight Tag - scoped to the challenge funnel only
          (/challenge, /challenge/checkout, /challenge/unlock). */}
      <Script id="linkedin-partner-id" strategy="afterInteractive">
        {`_linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);`}
      </Script>
      <Script id="linkedin-insight" strategy="afterInteractive">
        {`(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
        />
      </noscript>
    </div>
  );
}