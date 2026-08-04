import type { Metadata } from "next";
import Script from "next/script";
import "./users.css";

/* Google Ads conversion tag - scoped to the /users funnel only.
   This does not load on the main site. */
const GOOGLE_ADS_ID = "AW-18352829434";

export const metadata: Metadata = {
  title: "Get Your Personalised Plan | Lean Protocol",
  description:
    "Answer six quick questions and a Lean Protocol expert will call you with a personalised, doctor-guided weight-management plan.",
  robots: { index: false, follow: false },
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="users-page">
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
      {children}
    </div>
  );
}