import type { Metadata } from "next"
import type { ReactNode } from "react"

/**
 * The course that people buy is at /course. This page is kept out of search
 * results so that Google sees one course page, not two with different prices
 * and lesson counts. Anyone who has the link can still open it.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

export default function MasterclassLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
