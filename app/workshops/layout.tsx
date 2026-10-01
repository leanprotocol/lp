import type { Metadata } from "next"
import "./workshops.css"

/* The template's own stylesheet, scoped under .ws-page. It carries its own
   reset and font stack, so this page deliberately does not inherit the
   site-wide styles. */

export const metadata: Metadata = {
  title: "Workplace Wellness Workshop | Lean Protocol",
  description:
    "A practical workshop with doctors and dietitians: nutrition, movement and reset habits your team can use the next workday. Built around your workforce.",
  alternates: { canonical: "https://www.leanprotocol.in/workshops" },
  openGraph: {
    type: "website",
    url: "https://www.leanprotocol.in/workshops",
    title: "Workplace Wellness Workshop | Lean Protocol",
    description:
      "Healthier habits fit into the workday. A practical workshop packed with activities and simple nutrition and movement hacks your team can put to work the very next day.",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
}

export default function WorkshopsLayout({ children }: { children: React.ReactNode }) {
  return <div className="ws-page">{children}</div>
}
