"use client";

import { useState } from "react";

interface FormState {
  name: string;
  phone: string;
  email: string;
  city: string;
  goal: string;
  preferred_time: string;
  consent: boolean;
}

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  goal: "",
  preferred_time: "",
  consent: false,
};

export function LeadFormSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) {
      next.name = "Please enter your name";
    }

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      next.phone = "Enter a valid 10-digit mobile number";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot — silently succeed without posting anything if a bot filled this in.
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    if (!validate()) return;

    if (!form.consent) {
      alert("Please agree to be contacted so our team can call you back.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const url = new URL(window.location.href);
      const res = await fetch("/api/challenge/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: `+91${form.phone.replace(/\D/g, "")}`,
          email: form.email.trim(),
          city: form.city.trim(),
          goal: form.goal,
          preferred_time: form.preferred_time,
          source: "30day-glp1-campaign-lp2",
          utm_source: url.searchParams.get("utm_source") || "",
          utm_medium: url.searchParams.get("utm_medium") || "",
          utm_campaign: url.searchParams.get("utm_campaign") || "",
          gclid: url.searchParams.get("gclid") || "",
          fbclid: url.searchParams.get("fbclid") || "",
          page_url: window.location.href,
          referrer: document.referrer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Could not send your details. Please try again or message us on WhatsApp.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || "Could not send your details. Please try again or message us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="lead" className="reveal" style={{ padding: "64px 0" }}>
      <div className="wrap" style={{ maxWidth: "560px" }}>
        <div className="sec-head">
          <div className="divider"></div>
          <h2>Begin the 30 Days Hard Challenge</h2>
          <p>Fill in your details — our medical team will get you started.</p>
        </div>

        <div className={`form-card ${submitted ? "sent" : ""}`}>
          <span className="tag">⚡ Limited Seats — Today Only</span>
          <h3>Join the 30 Days Hard Challenge</h3>
          <div className="fsub">Our medical team will call you back within 24 hours.</div>

          <form onSubmit={handleSubmit} noValidate style={{ display: submitted ? "none" : "block" }}>
            <div className={`field ${errors.name ? "err" : ""}`}>
              <label htmlFor="ln">Full name</label>
              <input
                id="ln"
                name="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              <div className="msg">{errors.name || "Please enter your name"}</div>
            </div>

            <div className={`field ${errors.phone ? "err" : ""}`}>
              <label htmlFor="lp">Phone (WhatsApp)</label>
              <div className="phone-wrap">
                <span className="cc">+91</span>
                <input
                  id="lp"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile"
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </div>
              <div className="msg">{errors.phone || "Enter a valid 10-digit mobile number"}</div>
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="lcity">City</label>
                <input
                  id="lcity"
                  name="city"
                  type="text"
                  placeholder="e.g. Delhi"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="lg">Goal</label>
                <select id="lg" name="goal" value={form.goal} onChange={(e) => updateField("goal", e.target.value)}>
                  <option value="" disabled>Select</option>
                  <option>Lose 5–10 kg</option>
                  <option>Lose 10–20 kg</option>
                  <option>Lose 20 kg+</option>
                  <option>Health condition</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="lt">Best time for our team to call</label>
              <select
                id="lt"
                name="preferred_time"
                value={form.preferred_time}
                onChange={(e) => updateField("preferred_time", e.target.value)}
              >
                <option value="" disabled>Select a time</option>
                <option>Morning (9am–12pm)</option>
                <option>Afternoon (12pm–4pm)</option>
                <option>Evening (4pm–8pm)</option>
                <option>Anytime</option>
              </select>
            </div>

            {/* Honeypot field — invisible to real users, catches simple bots */}
            <div className="hp" aria-hidden="true">
              <label>
                Leave empty
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </label>
            </div>

            <label className="consent">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
              />
              <span>
                I agree to be contacted by Lean Protocol and accept the{" "}
                <a href="https://www.leanprotocol.in/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {submitError && (
              <div className="msg" style={{ display: "block", marginBottom: "10px" }}>{submitError}</div>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting…" : "Begin the Challenge"} <span className="arrow">›</span>
            </button>
            <div className="form-note">
              Prefer to talk now? <a href="https://wa.link/3s1upf">Chat on WhatsApp →</a>
            </div>
          </form>

          <div className="lead-success">
            <div className="check">✓</div>
            <h3>You&apos;re in!</h3>
            <p>Our medical team will call you within 24 hours. Want to start now?</p>
            <a href="/challenge/checkout" className="btn btn-primary" style={{ width: "100%", marginBottom: "10px" }}>
              Continue to checkout →
            </a>
            <a href="https://wa.link/3s1upf" className="btn btn-wa" style={{ width: "100%" }}>
              💬 Chat with us on WhatsApp now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
