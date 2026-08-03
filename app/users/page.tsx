"use client";

import { useState } from "react";

/* ── The six kept steps, renumbered 1-6 ─────────────────────────────
   Originals 1, 2, 3, 6, 8, 9. Dropped: programme duration, call-time
   window and city.                                                    */

type Choice = { q: string; sub: string; options: string[]; field: string };

const CHOICE_STEPS: Choice[] = [
  {
    field: "goal",
    q: "What's your main reason for wanting to lose weight?",
    sub: "Help us personalise your programme from the start.",
    options: [
      "To have more energy & feel active",
      "My doctor recommended it",
      "To look and feel better",
      "Not sure yet",
    ],
  },
  {
    field: "timeline",
    q: "How soon would you like to get started?",
    sub: "We'll prioritise your slot accordingly.",
    options: ["As soon as possible", "Within the next month", "Not sure yet"],
  },
  {
    field: "support_type",
    q: "What kind of support are you looking for?",
    sub: "Pick what resonates most with you.",
    options: [
      "A complete, doctor-guided programme",
      "Expert nutrition & diet coaching",
      "Accountability & progress tracking",
      "An initial consultation to explore options",
    ],
  },
];

const TOTAL = 6;

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function UsersFunnel() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [weight, setWeight] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const pct = Math.round((Math.min(step, TOTAL) / TOTAL) * 100);

  function pick(field: string, value: string) {
    setAnswers((a) => ({ ...a, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
    // small pause so the tick is visible before advancing
    setTimeout(() => setStep((s) => s + 1), 180);
  }

  function next() {
    const e: Record<string, string> = {};

    if (step >= 1 && step <= 3) {
      const f = CHOICE_STEPS[step - 1].field;
      if (!answers[f]) e[f] = "Please choose an option to continue";
    }
    if (step === 4) {
      const w = Number(weight);
      if (!weight.trim() || Number.isNaN(w) || w < 30 || w > 300) {
        e.weight = "Enter a weight between 30 and 300 kg";
      }
    }
    if (step === 5 && name.trim().length < 2) {
      e.name = "Please enter your name";
    }

    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => s + 1);
  }

  async function submit() {
    const e: Record<string, string> = {};
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) e.phone = "Enter a valid 10-digit mobile number";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Enter a valid email address";
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/users/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: `+91${digits}`,
          email: email.trim(),
          weight: weight.trim(),
          goal: answers.goal || "",
          timeline: answers.timeline || "",
          support_type: answers.support_type || "",
          source: "users-questionnaire",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Could not submit. Please try again.");
      }
      setStep(TOTAL + 1);
    } catch (err: any) {
      setSendError(err.message || "Could not submit. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const done = step > TOTAL;

  return (
    <div className="shell">
      <div className="top">
        <div className="brand">
          <img src="/logo-cropped.png" alt="Lean Protocol" />
          <span className="brand-text">Lean Protocol</span>
        </div>
        {!done && (
          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-label">{Math.min(step, TOTAL)} / {TOTAL}</span>
          </div>
        )}
      </div>

      <div className="card">
        {/* Steps 1-3: choice questions */}
        {step >= 1 && step <= 3 && (
          <div className="slide" key={step}>
            <div className="q-eyebrow">Question {step}</div>
            <div className="q-title">{CHOICE_STEPS[step - 1].q}</div>
            <div className="q-sub">{CHOICE_STEPS[step - 1].sub}</div>
            <div className="options">
              {CHOICE_STEPS[step - 1].options.map((opt) => {
                const f = CHOICE_STEPS[step - 1].field;
                const on = answers[f] === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    className={`option ${on ? "on" : ""}`}
                    onClick={() => pick(f, opt)}
                    aria-pressed={on}
                  >
                    <span className="opt-check"><Check /></span>
                    <span className="opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>
            {errors[CHOICE_STEPS[step - 1].field] && (
              <p className="err-msg">{errors[CHOICE_STEPS[step - 1].field]}</p>
            )}
            <div className="btn-next">
              <button className="btn" onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 4: weight */}
        {step === 4 && (
          <div className="slide" key="w">
            <div className="q-eyebrow">Question 4</div>
            <div className="q-title">What is your current weight?</div>
            <div className="q-sub">This helps us estimate your personalised goal.</div>
            <div className="input-wrap">
              <input
                className={`field ${errors.weight ? "err" : ""}`}
                type="number" inputMode="decimal" min={30} max={300}
                placeholder="e.g. 85"
                value={weight}
                onChange={(ev) => { setWeight(ev.target.value); setErrors((x) => ({ ...x, weight: "" })); }}
                autoFocus
              />
              <div className="input-unit">Kilograms (kg)</div>
              {errors.weight && <p className="err-msg">{errors.weight}</p>}
            </div>
            <div className="btn-next">
              <button className="btn" onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 5: name */}
        {step === 5 && (
          <div className="slide" key="n">
            <div className="q-eyebrow">Question 5</div>
            <div className="q-title">What's your name?</div>
            <div className="q-sub">So our experts can greet you properly.</div>
            <div className="input-wrap">
              <input
                className={`field ${errors.name ? "err" : ""}`}
                type="text" autoComplete="name" placeholder="Your full name"
                value={name}
                onChange={(ev) => { setName(ev.target.value); setErrors((x) => ({ ...x, name: "" })); }}
                autoFocus
              />
              {errors.name && <p className="err-msg">{errors.name}</p>}
            </div>
            <div className="btn-next">
              <button className="btn" onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* Step 6: contact + submit */}
        {step === 6 && (
          <div className="slide" key="c">
            <div className="q-eyebrow">Last step!</div>
            <div className="q-title">How should we reach you?</div>
            <div className="q-sub">Your details are safe with us. No spam, ever.</div>
            <div className="input-row">
              <div>
                <input
                  className={`field ${errors.phone ? "err" : ""}`}
                  type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national"
                  placeholder="Phone number (e.g. 9876543210)"
                  value={phone}
                  onChange={(ev) => {
                    setPhone(ev.target.value.replace(/\D/g, "").slice(0, 10));
                    setErrors((x) => ({ ...x, phone: "" }));
                  }}
                  autoFocus
                />
                {errors.phone && <p className="err-msg">{errors.phone}</p>}
              </div>
              <div>
                <input
                  className={`field ${errors.email ? "err" : ""}`}
                  type="email" autoComplete="email"
                  placeholder="Email address (optional)"
                  value={email}
                  onChange={(ev) => { setEmail(ev.target.value); setErrors((x) => ({ ...x, email: "" })); }}
                />
                {errors.email && <p className="err-msg">{errors.email}</p>}
              </div>
            </div>

            <div className="trust">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2D5A4E" aria-hidden>
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span>100% private &amp; secure. No spam, ever.</span>
            </div>

            {sendError && <p className="err-msg">{sendError}</p>}

            <div className="btn-next">
              <button className="btn" onClick={submit} disabled={sending}>
                {sending ? "Submitting…" : "Get My Personalised Plan 🎯"}
              </button>
            </div>
          </div>
        )}

        {/* Thank you */}
        {done && (
          <div className="slide thankyou" key="ty">
            <div className="ty-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2D5A4E"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="ty-title">You&apos;re all set! 🎉</div>
            <div className="ty-sub">
              One of our Lean Protocol experts will call you shortly. Get ready to begin
              your transformation.
            </div>
            <div className="next-steps">
              <div className="next-steps-label">What happens next</div>
              <div className="step-row">
                <div className="step-num">1</div>
                <span className="step-text">An expert calls you to understand your goals</span>
              </div>
              <div className="step-row">
                <div className="step-num">2</div>
                <span className="step-text">Free consultation &amp; personalised plan shared</span>
              </div>
              <div className="step-row">
                <div className="step-num">3</div>
                <span className="step-text">Begin your weight loss journey 🚀</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "var(--lp-muted)", marginTop: 18 }}>
        <a href="/users/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--lp-muted)", textDecoration: "underline" }}>
          Privacy Policy
        </a>
        {"  "}&middot;{"  "}
        <a href="/users/terms" target="_blank" rel="noopener noreferrer" style={{ color: "var(--lp-muted)", textDecoration: "underline" }}>
          Terms
        </a>
      </p>

      {step > 1 && !done && (
        <button className="nav-back" onClick={() => setStep((s) => s - 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}
    </div>
  );
}
