import type React from "react"
import type { Metadata } from "next"
import { Inter, Libre_Baskerville } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ClarityInit } from "@/components/clarity"
import "./globals.css"

const CLARITY_PROJECT_ID = "wa6e7p1xur"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Lean Protocol | Clinically Proven Weight Loss for India",
  description: "Advanced blood tests, 1-on-1 doctor & nutritionist care, personalized GLP-1 protocol. Lose 15-22% body weight with Lean Protocol.",
  openGraph: {
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${libreBaskerville.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
        <ClarityInit projectId={CLARITY_PROJECT_ID} />
      </body>
    </html>
  )
}
