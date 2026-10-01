"use client"

import { useEffect, useState } from "react"
import * as W from "@/content/workshops"

/**
 * Client pieces of /workshops: the header with its mobile sheet, and the
 * sample-workshop poll. The rest of the page is server-rendered.
 *
 * The template shipped these as inline scripts; they are components here so
 * the markup stays declarative and the copy stays in content/workshops.ts.
 */

export function WsHeader() {
  const [open, setOpen] = useState(false)

  /* Lock the page behind the sheet, and release it on unmount so a route
     change cannot leave the body stuck. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="wordmark" href="/" aria-label="Lean Protocol home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cropped.png" alt="Lean Protocol" />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {W.NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href="#contact">
          Plan a workshop
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        {W.NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)}>
          Plan a workshop
        </a>
      </nav>
    </header>
  )
}

export function SamplePoll() {
  const [picked, setPicked] = useState<string | null>(null)
  const chosen = W.sample.options.find((o) => o.key === picked)

  return (
    <div className="sample-activity">
      <p className="eyebrow light">{W.sample.promptLabel}</p>
      <h3>{W.sample.prompt}</h3>

      <div className="sample-options" role="group" aria-label="Choose a lunch backup plan">
        {W.sample.options.map((o) => (
          <button
            key={o.key}
            type="button"
            aria-pressed={picked === o.key}
            onClick={() => setPicked(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* aria-live so the answer is announced, not just painted. */}
      <p className="sample-response" id="sample-response" role="status" aria-live="polite">
        {chosen ? chosen.response : W.sample.idle}
      </p>
    </div>
  )
}
