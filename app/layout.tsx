import type React from "react"
import type { Metadata } from "next"
import { Inter, Libre_Baskerville } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ClarityInit } from "@/components/clarity"
import "./globals.css"
import Script from "next/script";

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

import { ReferralTracker } from "@/components/referral-tracker"
import { Suspense } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script
  src="https://www.googletagmanager.com/gtag/js?id= G-SN2P6LQBHW"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', ' G-SN2P6LQBHW');
  `}
</Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
      </head>
      <body className={`${inter.variable} ${libreBaskerville.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
        {children}
        <Toaster />
        <Analytics />
        <ClarityInit projectId={CLARITY_PROJECT_ID} />
      </body>
    </html>
  )
}
