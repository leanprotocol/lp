import type { ReactNode } from "react"

/**
 * Line icons and the five small report charts for /corporate.
 *
 * Server-safe: no hooks, no "use client". Icon names are referenced from
 * content/corporate.ts; an unknown name renders nothing rather than breaking
 * the page.
 */

const PATHS: Record<string, ReactNode> = {
  drop: (
    <>
      <path d="M16 4c4.7 5.4 8 9 8 13.1A8 8 0 0 1 8 17.1C8 13 11.3 9.4 16 4z" />
      <path d="M16 17v6" />
    </>
  ),
  heartPulse: (
    <>
      <path d="M27.7 9.2a6.3 6.3 0 0 0-11.7-2.5A6.3 6.3 0 0 0 4.3 9.2C3 14 8.3 19 16 24.3 23.7 19 29 14 27.7 9.2z" />
      <path d="M5 16h5l2-3.5 2.5 7 2.5-5 1.7 3h4.8" />
    </>
  ),
  liver: (
    <>
      <path d="M4 10h20c3 0 5 2 5 5 0 6-4 11-10 11h-5C7 26 4 21 4 15z" />
      <path d="M12 15h9" />
      <path d="M15 10v5" />
    </>
  ),
  cholesterol: (
    <>
      <path d="M5 8h13a6 6 0 0 1 0 12h-6a5 5 0 0 0 0 10" />
      <circle cx="24" cy="26" r="3.2" />
    </>
  ),
  thyroid: (
    <>
      <path d="M16 9v15" />
      <path d="M16 12c-2.6-4.2-10-4-10 2.6S12 24 16 24s10-1.4 10-9.4S18.6 7.8 16 12z" />
    </>
  ),
  hormone: (
    <>
      <circle cx="16" cy="16" r="5.2" />
      <path d="M16 3v4M16 25v4M3 16h4M25 16h4M7 7l2.8 2.8M22.2 22.2L25 25M25 7l-2.8 2.8M9.8 22.2L7 25" />
    </>
  ),
  waist: (
    <>
      <rect x="4" y="8" width="24" height="16" rx="4" />
      <rect x="11" y="12" width="10" height="6" rx="2" />
      <circle cx="8.5" cy="21" r="1.4" />
      <circle cx="23.5" cy="21" r="1.4" />
    </>
  ),
  moon: <path d="M26 19a10.5 10.5 0 0 1-13.8-13.2A11.2 11.2 0 1 0 26 19z" />,
  calendar: (
    <>
      <path d="M8 6h16a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" />
      <path d="M11 3v5M21 3v5M5 14h22" />
      <path d="M12 21h8" />
    </>
  ),
  search: (
    <>
      <circle cx="14" cy="14" r="8.5" />
      <path d="M20.2 20.2L27 27" />
      <path d="M14 10.5v7M10.5 14h7" />
    </>
  ),
  trend: (
    <>
      <path d="M5 24l7-7 5 4 10-11" />
      <path d="M22 10h5v5" />
      <path d="M5 27h22" />
    </>
  ),
  heart: <path d="M16 27s-10-6.2-10-13a5.6 5.6 0 0 1 10-3.4A5.6 5.6 0 0 1 26 14c0 6.8-10 13-10 13z" />,
  scale: (
    <>
      <rect x="5" y="5" width="22" height="22" rx="5" />
      <path d="M10.5 13.5a5.5 5.5 0 0 1 11 0" />
      <path d="M16 13.5l2.4-3" />
    </>
  ),
  bowl: (
    <>
      <path d="M4.5 16h23a11.5 11.5 0 0 1-23 0z" />
      <path d="M12 12.5c0-2.5 1.6-4.4 3.4-5.6M18 12.5c0-1.8 1.2-3.3 2.6-4.2" />
    </>
  ),
  mind: <path d="M20 27v-4a6 6 0 0 0 4-5.6V15h3l-3.4-5.6A9 9 0 0 0 7 13.4C7 18 9.5 19 11 20.5V27" />,
  physio: (
    <>
      <circle cx="16" cy="6.5" r="3" />
      <path d="M16 10v8" />
      <path d="M16 18l-5 9M16 18l5 9" />
      <path d="M9 13l7 2 7-2" />
    </>
  ),
  family: (
    <>
      <circle cx="11.5" cy="10" r="3.6" />
      <circle cx="22.5" cy="12.5" r="2.8" />
      <path d="M4.5 26.5c0-4.4 3.1-7.6 7-7.6s7 3.2 7 7.6" />
      <path d="M19 21.2c.9-1.6 2.3-2.5 3.9-2.5 2.6 0 4.6 2.3 4.6 5.6" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M6 12v8M26 12v8M10 9v14M22 9v14" />
      <path d="M10 16h12" />
    </>
  ),
}

export function CorpIcon({ name, size = 30 }: { name: string; size?: number }) {
  const paths = PATHS[name]
  if (!paths) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  )
}

/* ------------------------- report card charts ------------------------- */

const SAGE = "#C8D9A7"
const GOLD = "#C9A84C"
const FAINT = "rgba(200,217,167,.22)"
const AXIS = "rgba(200,217,167,.3)"

const CHARTS: Record<string, { label: string; body: ReactNode }> = {
  participation: {
    label: "Participation, roughly three quarters",
    body: (
      <>
        <circle cx="40" cy="40" r="26" fill="none" stroke="rgba(200,217,167,.2)" strokeWidth={9} />
        <circle
          cx="40"
          cy="40"
          r="26"
          fill="none"
          stroke={SAGE}
          strokeWidth={9}
          strokeDasharray="122 163"
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="45" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="16" fontWeight="800" fill="#F9F7F2">
          74%
        </text>
        <rect x="78" y="26" width="34" height="6" rx="3" fill="rgba(200,217,167,.35)" />
        <rect x="78" y="38" width="24" height="6" rx="3" fill={FAINT} />
        <rect x="78" y="50" width="30" height="6" rx="3" fill={FAINT} />
      </>
    ),
  },
  prevalence: {
    label: "Prevalence across conditions",
    body: (
      <>
        <rect x="10" y="52" width="16" height="20" rx="3" fill={SAGE} />
        <rect x="33" y="38" width="16" height="34" rx="3" fill="#A8C77F" />
        <rect x="56" y="24" width="16" height="48" rx="3" fill={GOLD} />
        <rect x="79" y="44" width="16" height="28" rx="3" fill="rgba(200,217,167,.45)" />
        <line x1="6" y1="72" x2="110" y2="72" stroke={AXIS} strokeWidth={1.5} />
      </>
    ),
  },
  change: {
    label: "Markers improving across quarters",
    body: (
      <>
        <polyline
          points="10,22 38,34 66,42 94,58 110,62"
          fill="none"
          stroke={SAGE}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="22" r="3.5" fill={SAGE} />
        <circle cx="38" cy="34" r="3.5" fill={SAGE} />
        <circle cx="66" cy="42" r="3.5" fill={SAGE} />
        <circle cx="94" cy="58" r="3.5" fill={SAGE} />
        <circle cx="110" cy="62" r="4.5" fill={GOLD} />
        <line x1="6" y1="72" x2="112" y2="72" stroke={AXIS} strokeWidth={1.5} />
      </>
    ),
  },
  risk: {
    label: "Where the risk is concentrated",
    body: (
      <>
        <rect x="12" y="14" width="22" height="18" rx="4" fill={FAINT} />
        <rect x="40" y="14" width="22" height="18" rx="4" fill="rgba(200,217,167,.4)" />
        <rect x="68" y="14" width="22" height="18" rx="4" fill={FAINT} />
        <rect x="12" y="38" width="22" height="18" rx="4" fill="rgba(200,217,167,.3)" />
        <rect x="40" y="38" width="22" height="18" rx="4" fill={GOLD} />
        <rect x="68" y="38" width="22" height="18" rx="4" fill={FAINT} />
      </>
    ),
  },
  cover: {
    label: "What your insurer will see at renewal",
    body: (
      <>
        <path
          d="M60 10l26 9v20c0 15-11 26-26 31-15-5-26-16-26-31V19z"
          fill="none"
          stroke={SAGE}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        <path d="M48 41l9 9 17-18" fill="none" stroke={GOLD} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
}

export function ReportChart({ kind }: { kind: string }) {
  const c = CHARTS[kind]
  if (!c) return null
  return (
    <svg viewBox="0 0 120 80" role="img" aria-label={c.label}>
      {c.body}
    </svg>
  )
}
