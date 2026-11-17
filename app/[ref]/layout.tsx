import type { Metadata } from "next"
import type { ReactNode } from "react"

/**
 * Short partner links such as leanprotocol.in/<code> only save the partner code
 * and send the visitor on to the landing page. They are not content, so search
 * engines are told not to index them. A mistyped one-word address lands on the
 * same page, so this also keeps those out of search results.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ReferralLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
