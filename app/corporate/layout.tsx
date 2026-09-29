import type { Metadata } from "next"
import "./corporate.css"

/* Scoped wrapper, same pattern as the /psp and /users layouts: every rule in
   corporate.css sits under .corporate-page so it cannot reach the main site. */

export const metadata: Metadata = {
  title: "Corporate Wellness | Lean Protocol",
  description:
    "Doctor-led metabolic health for your workforce. A full blood panel at month zero, care for those who need it, and a second panel at month six that shows what changed.",
  alternates: { canonical: "https://www.leanprotocol.in/corporate" },
  openGraph: {
    type: "website",
    url: "https://www.leanprotocol.in/corporate",
    title: "Corporate Wellness | Lean Protocol",
    description:
      "Most wellness programmes report attendance. We report HbA1c. Doctor-led metabolic care for Indian workplaces, measured before and after.",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
}

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return <div className="corporate-page">{children}</div>
}
