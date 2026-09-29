"use client"

import { useEffect, useState } from "react"
import * as C from "@/content/corporate"

/**
 * Client-side pieces of /corporate: header, scale calculator, FAQ and the
 * enquiry form. Everything else on the page renders on the server.
 */

const ARROW = "\u2192"
const TICK = "\u2713"

/* ------------------------------ header ------------------------------ */

export function CorpHeader() {
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
          {C.NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>

        <a href="#talk" className="btn btn-sage hdr-cta">
          Book a walkthrough
        </a>

        <button
          type="button"
          className="hdr-toggle"
          aria-expanded={open}
          aria-controls="corp-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden>{open ? "\u00D7" : "\u2261"}</span>
        </button>
      </div>

      {open && (
        <div id="corp-drawer" className="hdr-drawer">
          <div className="wrap">
            {C.NAV.map((n) => (
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

/* ---------------------------- calculator ---------------------------- */

export function ScaleCalculator() {
  const [n, setN] = useState(C.calc.initial)
  const fmt = (v: number) => Math.round(v).toLocaleString("en-IN")

  return (
    <section id={C.calc.id} className="on-black">
      <div className="wrap on-dark">
        <p className="eyebrow">{C.calc.eyebrow}</p>
        <h2 className="h" style={{ color: "#F9F7F2" }}>
          {C.calc.headA} <span className="serif" style={{ color: "#C8D9A7" }}>{C.calc.headB}</span>
        </h2>
        <p className="lede">{C.calc.body}</p>

        <div className="calc-shell">
          <div className="calc-grid">
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>EMPLOYEES IN SCOPE</p>
              <div className="calc-n">
                {fmt(n)}
                <em>people</em>
              </div>
              <input
                type="range"
                min={C.calc.min}
                max={C.calc.max}
                step={50}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                aria-label="Number of employees"
              />
              <p className="fine" style={{ marginTop: 18 }}>{C.calc.note}</p>
            </div>

            <div className="calc-out">
              <div className="calc-row">
                <span>Blood panels collected</span>
                <b>{fmt(n * C.calc.panelsPerEmployee)}</b>
              </div>
              <div className="calc-row">
                <span>Dietitian consultations</span>
                <b>{fmt(n * C.calc.dietitianPerEmployee)}</b>
              </div>
              <div className="calc-row">
                <span>Employees reviewed by a doctor</span>
                <b>{fmt(n * C.calc.doctorReviewRate)}</b>
              </div>
              <div className="calc-row">
                <span>Reports to your HR team</span>
                <b>2</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- FAQ -------------------------------- */

export function CorpFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="faq">
      {C.faqs.map((f, i) => (
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

export function CorpForm() {
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending) return

    /* Invisible to people, catches the simpler bots. */
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
          source: "corporate-wellness",
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
          {TICK} {C.cta.form.done}
        </p>
      </div>
    )
  }

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <div className="row2">
        <div className="field">
          <label htmlFor="cw-name">YOUR NAME</label>
          <input id="cw-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="cw-role">ROLE</label>
          <input id="cw-role" name="role" type="text" placeholder="e.g. Head of HR" />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="cw-email">WORK EMAIL</label>
          <input id="cw-email" name="email" type="email" autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="cw-phone">PHONE</label>
          <input
            id="cw-phone"
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
          <label htmlFor="cw-company">COMPANY</label>
          <input id="cw-company" name="company" type="text" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="cw-headcount">EMPLOYEES</label>
          <select id="cw-headcount" name="headcount" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {C.cta.form.sizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="cw-message">ANYTHING SPECIFIC?</label>
        <textarea id="cw-message" name="message" placeholder="Locations, timelines, what you have tried before" />
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
        {sending ? C.cta.form.sending : `${C.cta.form.submit} ${ARROW}`}
      </button>
    </form>
  )
}
