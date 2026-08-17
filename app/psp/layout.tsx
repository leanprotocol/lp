// app/psp/layout.tsx
// Scopes the PSP stylesheet. Fonts (Inter and Libre Baskerville) already
// come from the root layout as --font-sans and --font-serif.

import "./psp.css";

export default function PspLayout({ children }: { children: React.ReactNode }) {
  return <div className="psp-page">{children}</div>;
}
