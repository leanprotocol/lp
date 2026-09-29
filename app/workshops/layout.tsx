import type { Metadata } from "next"

/* Base styling is shared with /corporate on purpose: both are B2B pages for
   the same buyer, and a shared stylesheet means they cannot drift apart.
   Only the rules unique to this page live in workshops.css. */
import "../corporate/corporate.css"
import "./workshops.css"

export const metadata: Metadata = {
  title: "Workplace Health Workshops | Lean Protocol",
  description:
    "Doctor-led workshops on nutrition, metabolism, movement and stress for Indian workplaces. Education that leads to awareness, action and measurable health.",
  alternates: { canonical: "https://www.leanprotocol.in/workshops" },
  openGraph: {
    type: "website",
    url: "https://www.leanprotocol.in/workshops",
    title: "Workplace Health Workshops | Lean Protocol",
    description:
      "Nobody changes a habit they do not understand. An hour with our doctors and dietitians, built for people who sit for nine hours and eat at their desk.",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
}

export default function WorkshopsLayout({ children }: { children: React.ReactNode }) {
  /* Same wrapper class as /corporate, so corporate.css applies unchanged. */
  return <div className="corporate-page">{children}</div>
}
