// app/programme/layout.tsx
// Same font set-up as app/pro/layout.tsx, because /programme shows the same page.
// Scopes the Instrument Serif accent font to this route. Body font stays the site default.

import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export default function ProgrammeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={instrumentSerif.variable}>{children}</div>;
}
