import type { Metadata } from "next"
import "./corporate.css"

/* Scoped wrapper, same pattern as the /psp and /users layouts: every rule in
   corporate.css sits under .corporate-page so it cannot reach the main site. */

export const metadata: Metadata = {
  title: "Corporate Wellness | Lean Protocol",
  description:
    "Doctor-led corporate wellness for Indian workplaces: blood tests at work or at home, doctor follow-up, and a quarterly report that names nobody.",
  alternates: { canonical: "https://www.leanprotocol.in/corporate" },
  openGraph: {
    type: "website",
    url: "https://www.leanprotocol.in/corporate",
    title: "Corporate Wellness | Lean Protocol",
    description:
      "Good health is the foundation of a productive workforce. Screening, doctor follow-up and quarterly reporting for Indian workplaces.",
    locale: "en_IN",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
}

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <div className="corporate-page">{children}</div>
}
