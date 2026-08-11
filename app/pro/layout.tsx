// app/pro/layout.tsx
// Scopes the Instrument Serif accent font to the pro campaign route.
// Body font stays the site default. Requires this utility in globals.css:
//   .font-serif-accent { font-family: var(--font-instrument-serif), Georgia, serif; font-weight: 400; letter-spacing: 0; }

import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={instrumentSerif.variable}>{children}</div>;
}
