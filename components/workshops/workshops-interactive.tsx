"use client"

import { useEffect, useState } from "react"
import * as W from "@/content/workshops"

/**
 * Client pieces of /workshops: header, the module selector, FAQ and the
 * enquiry form. Everything else is server-rendered.
 *
 * Styling comes from app/corporate/corporate.css, imported by the layout,
 * so the two B2B pages cannot drift apart visually. Only the handful of
 * rules specific to this page live in workshops.css.
 */

const ARROW = "\u2192"
const TICK = "\u2713"

/* ------------------------------ header ------------------------------ */

export function WsHeader() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const read = () => {
      frame = 0
      setSolid(window.scrollY > 40)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    read()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className={"hdr" + (solid ? " solid" : "")}>
      <div className="wrap hdr-in">
        <a href="#top" className="hdr-logo" aria-label="Lean Protocol">
          <img src="/logo-cropped.png" alt="Lean Protocol" />
        </a>

        <nav className="hdr-nav" aria-label="Primary">
          {W.NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>

        <a href="#talk" className="btn btn-sage hdr-cta">
          Plan a session
        </a>

        <button
          type="button"
          className="hdr-toggle"
          aria-expanded={open}
          aria-controls="ws-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden>{open ? "\u00D7" : "\u2261"}</span>
        </button>
      </div>

      {open && (
        <div id="ws-drawer" className="hdr-drawer">
          <div className="wrap">
            {W.NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

/* -------------------------- module selector -------------------------- */

export function ModulePicker() {
  const [active, setActive] = useState(0)
  const m = W.sessions.modules[active]

  return (
    <div className="ws-modules">
      <div className="ws-tabs" role="tablist" aria-label="Workshop modules">
        {W.sessions.modules.map((mod, i) => (
          <button
            key={mod.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={"ws-tab" + (i === active ? " on" : "")}
            onClick={() => setActive(i)}
          >
            <span className="ws-tab-n">{String(i + 1).padStart(2, "0")}</span>
            {mod.title}
          </button>
        ))}
      </div>

      <div className="ws-panel" key={m.key}>
        <h3>{m.title}</h3>
        <p className="ws-panel-lead">{m.lead}</p>

        <ul className="ws-points">
          {m.points.map((p) => (
            <li key={p}>
              <span aria-hidden className="tick">
                {TICK}
              </span>
              {p}
            </li>
          ))}
        </ul>

        <div className="ws-who">
          <b>Best for</b>
          {m.who}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- FAQ -------------------------------- */

export function WsFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="faq">
      {W.faqs.map((f, i) => (
        <div key={f.q} className="faq-item">
          <button
            type="button"
            className="faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
            <span aria-hidden className="faq-sign">
              {open === i ? "\u2212" : "+"}
            </span>
          </button>
          {open === i && <p className="faq-a">{f.a}</p>}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------- form ------------------------------- */

export function WsForm() {
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return
    if (honeypot) {
      setDone(true)
      return
    }

    const fd = new FormData(e.currentTarget)
    const phone = String(fd.get("phone") ?? "").replace(/\D/g, "")

    if (!String(fd.get("name") ?? "").trim()) return setError("Please enter your name.")
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit mobile number.")
    if (!consent) return setError("Please accept the privacy policy to continue.")

    setSending(true)
    setError(null)
    try {
      const res = await fetch("/api/corporate/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? "").trim(),
          phone: `+91${phone}`,
          email: String(fd.get("email") ?? "").trim(),
          company: String(fd.get("company") ?? "").trim(),
          role: String(fd.get("role") ?? "").trim(),
          headcount: String(fd.get("headcount") ?? ""),
          message: String(fd.get("message") ?? "").trim(),
          /* Distinct from the corporate programme enquiry, so sales can see
             which door someone came through. Needs to exist as a value in
             TeleCRM or it will be dropped silently. */
          source: "workshop-enquiry",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) throw new Error(data?.error || "Could not send. Please try again.")
      setDone(true)
    } catch (err: any) {
      setError(err.message || "Could not send. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="form-card">
        <p className="form-msg good" style={{ margin: 0, fontSize: 17 }}>
          {TICK} {W.cta.form.done}
        </p>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <div className="row2">
        <div className="field">
          <label htmlFor="ws-name">YOUR NAME</label>
          <input id="ws-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="ws-role">ROLE</label>
          <input id="ws-role" name="role" type="text" placeholder="e.g. HR Manager" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="ws-email">WORK EMAIL</label>
          <input id="ws-email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="ws-phone">PHONE</label>
          <input
            id="ws-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile"
            autoComplete="tel-national"
            required
          />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="ws-company">COMPANY</label>
          <input id="ws-company" name="company" type="text" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="ws-headcount">EMPLOYEES</label>
          <select id="ws-headcount" name="headcount" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {W.cta.form.sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="ws-message">WHAT ARE YOUR PEOPLE STRUGGLING WITH?</label>
        <textarea
          id="ws-message"
          name="message"
          placeholder="Shift patterns, sitting hours, what you have tried before"
        />
      </div>

      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden>
        <label>
          Leave empty
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <label className="consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          I agree to be contacted about this enquiry and accept the{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && <p className="form-msg bad">{error}</p>}

      <button type="submit" className="btn btn-ink" style={{ width: "100%" }} disabled={sending}>
        {sending ? W.cta.form.sending : `${W.cta.form.submit} ${ARROW}`}
      </button>
    </form>
  )
}
