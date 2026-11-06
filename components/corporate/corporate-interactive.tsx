"use client"

import { useState } from "react"
import * as C from "@/content/corporate"

/**
 * Client-side piece of /corporate: the enquiry form. Everything else on the
 * page renders on the server.
 *
 * Posts to /api/corporate/lead, unchanged from the previous version of the
 * page, so leads keep landing in TeleCRM with source "corporate-wellness".
 */

const TICK = "\u2713"

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
    const company = String(fd.get("company") ?? "").trim()
    const name = String(fd.get("name") ?? "").trim()
    const phone = String(fd.get("phone") ?? "").replace(/\D/g, "")
    const headcount = String(fd.get("headcount") ?? "")

    if (!company) return setError("Please enter your company name.")
    if (!name) return setError("Please enter your name.")
    if (!/^[6-9]\d{9}$/.test(phone)) return setError("Enter a valid 10-digit mobile number.")
    if (!headcount) return setError("Please choose the number of employees.")
    if (!consent) return setError("Please accept the privacy policy to continue.")

    setSending(true)
    setError(null)
    try {
      const res = await fetch("/api/corporate/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: `+91${phone}`,
          company,
          headcount,
          source: "corporate-wellness",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success) throw new Error(data?.error || "Could not send. Please try again.")
      setDone(true)
    } catch (err: any) {
      setError(err?.message || "Could not send. Please try again.")
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div className="cw-form" role="status">
        <p className="cw-form-done">
          <span aria-hidden className="cw-bt">
            {TICK}
          </span>
          {C.cta.form.done}
        </p>
      </div>
    )
  }

  return (
    <form className="cw-form" onSubmit={onSubmit} noValidate>
      <div className="cw-fld">
        <label htmlFor="cw-company">Company</label>
        <input id="cw-company" name="company" type="text" autoComplete="organization" placeholder="Company name" />
      </div>
      <div className="cw-fld">
        <label htmlFor="cw-name">Your name</label>
        <input id="cw-name" name="name" type="text" autoComplete="name" placeholder="Full name" />
      </div>
      <div className="cw-fld">
        <label htmlFor="cw-phone">Mobile number</label>
        <input
          id="cw-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          placeholder="10-digit mobile"
        />
      </div>
      <div className="cw-fld">
        <label htmlFor="cw-headcount">Number of employees</label>
        <select id="cw-headcount" name="headcount" defaultValue="">
          <option value="" disabled>
            Select
          </option>
          {C.cta.form.sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="cw-hp" aria-hidden="true">
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

      <label className="cw-consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          I agree to be contacted about this enquiry and accept the{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      {error && (
        <p className="cw-form-err" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="cw-btn" disabled={sending}>
        {sending ? C.cta.form.sending : C.cta.form.submit}
      </button>
      <p className="cw-fine">{C.cta.form.fine}</p>
    </form>
  )
}
