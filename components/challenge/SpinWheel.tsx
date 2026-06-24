"use client";

import { useState } from "react";

interface Offer {
  icon: string;
  label: string;
}

const OFFERS: Offer[] = [
  { icon: "🩺", label: "Free Consult" },
  { icon: "🎁", label: "Mystery" },
  { icon: "%", label: "90% OFF" },
  { icon: "🆓", label: "1 Month Free" },
  { icon: "", label: "1+1 Month" },
  { icon: "🥗", label: "Free Plan" },
];

// The wheel always lands on this segment — every visitor "wins" the same
// real reward (30 + 15 days free), framed as a game for engagement.
const WIN_SEGMENT = 1;
const REWARD_LABEL = "30 + 15 Days FREE";
const PROMO_CODE = "30+15HARD";

type Phase = "idle" | "spinning" | "claim" | "claimed";

export function SpinWheel() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rotation, setRotation] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [checkoutHref, setCheckoutHref] = useState("/challenge/checkout?promo=30%2B15HARD");

  const handleSpin = () => {
    if (phase !== "idle") return;
    setPhase("spinning");
    const targetAngle = WIN_SEGMENT * 60 + 30;
    const fullSpins = 360 * 6;
    setRotation(fullSpins - targetAngle);

    setTimeout(() => {
      setPhase("claim");
      (window as any).lpConfetti?.(150);
    }, 4750);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = "Please enter your name";
    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) next.phone = "Enter a valid 10-digit mobile number";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!consent) {
      alert("Please agree to be contacted so we can apply your reward.");
      return;
    }

    setSubmitting(true);

    try {
      await fetch("/api/challenge/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: `+91${phoneDigits}`,
          prize: "30+15 Days Free",
          promo: PROMO_CODE,
          source: "spin-wheel",
          page_url: window.location.href,
          referrer: document.referrer,
        }),
      });
    } catch {
      // Non-blocking — still show the reward even if the network call fails;
      // the lead is also recoverable from server logs / CRM retries.
    }

    setCheckoutHref(
      `/challenge/checkout?promo=30%2B15HARD&name=${encodeURIComponent(name.trim())}&phone=${encodeURIComponent(phoneDigits)}`
    );
    setPhase("claimed");
    setSubmitting(false);
    (window as any).lpConfetti?.(130);
  };

  return (
    <section className="spin reveal" id="spin">
      <div className="wrap">
        <div className="sec-head">
          <div className="divider"></div>
          <h2>🎉 Spin to unlock your challenge offer</h2>
          <p>Give the wheel a spin and lock in your exclusive joining offer for the 30 Days Hard Challenge!</p>
        </div>

        <div className="spin-card">
          <div className="wheel-stage">
            <div className="wheel-pointer"></div>
            <div
              className="wheel"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {OFFERS.map((o, i) => {
                const angle = i * 60 + 30;
                return (
                  <span
                    key={i}
                    className="seg-label"
                    style={{
                      color: i % 2 === 1 ? "#15241e" : "#F4F0E6",
                      textShadow: i % 2 === 1 ? "none" : "0 1px 3px rgba(0,0,0,.5)",
                      transform: `translate(-50%,-50%) rotate(${angle}deg) translate(0,-90px) rotate(${-angle}deg)`,
                    }}
                  >
                    {o.icon && <span className="ico">{o.icon}</span>}
                    {o.label}
                  </span>
                );
              })}
            </div>
            <div className="wheel-center">SPIN</div>
          </div>

          <div>
            {phase === "idle" && (
              <div>
                <h3 style={{ fontFamily: "var(--display)", textTransform: "uppercase", color: "var(--cream)", fontSize: "24px", marginBottom: "8px" }}>
                  Ready to win?
                </h3>
                <p style={{ color: "var(--sage)", fontSize: "15px", marginBottom: "20px" }}>
                  Tap the button, spin the wheel, and see what you&apos;ve unlocked. Everybody wins something!
                </p>
                <button className="btn btn-primary" style={{ width: "100%", fontSize: "18px", padding: "16px" }} onClick={handleSpin}>
                  SPIN THE WHEEL 🎯
                </button>
              </div>
            )}

            {phase === "spinning" && (
              <div>
                <h3 style={{ fontFamily: "var(--display)", textTransform: "uppercase", color: "var(--cream)", fontSize: "24px", marginBottom: "8px" }}>
                  Ready to win?
                </h3>
                <p style={{ color: "var(--sage)", fontSize: "15px", marginBottom: "20px" }}>
                  Tap the button, spin the wheel, and see what you&apos;ve unlocked. Everybody wins something!
                </p>
                <button className="btn btn-primary" style={{ width: "100%", fontSize: "18px", padding: "16px" }} disabled>
                  Spinning…
                </button>
              </div>
            )}

            {phase === "claim" && (
              <form onSubmit={handleClaim} className="spin-form" noValidate>
                <div className="prize-banner">
                  🎉 You unlocked <b style={{ color: "var(--green-glow)" }}>{REWARD_LABEL}</b>
                </div>
                <p style={{ color: "var(--sage)", fontSize: "14px", margin: "10px 0 14px" }}>
                  Enter your details to claim it and get your promo code.
                </p>

                <div className={`field ${errors.name ? "err" : ""}`}>
                  <label htmlFor="sn">Full name</label>
                  <input
                    id="sn"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="msg">{errors.name || "Please enter your name"}</div>
                </div>

                <div className={`field ${errors.phone ? "err" : ""}`}>
                  <label htmlFor="sp">Phone (WhatsApp)</label>
                  <div className="phone-wrap">
                    <span className="cc">+91</span>
                    <input
                      id="sp"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    />
                  </div>
                  <div className="msg">{errors.phone || "Enter a valid 10-digit mobile number"}</div>
                </div>

                <label className="consent">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>
                    I agree to be contacted by Lean Protocol and accept the{" "}
                    <a href="https://www.leanprotocol.in/privacy-policy" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
                  {submitting ? "Claiming…" : "Claim my offer →"}
                </button>
              </form>
            )}

            {phase === "claimed" && (
              <div className="prize-result show">
                <div style={{ fontSize: "13px", color: "var(--sage)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700 }}>
                  Your promo code
                </div>
                <div className="promo-code">{PROMO_CODE}</div>
                <p style={{ color: "var(--sage)", fontSize: "13px", margin: "6px 0 14px" }}>
                  Apply it at checkout to get <b style={{ color: "var(--cream)" }}>30 + 15 days FREE</b> on your 30
                  Days Hard Challenge.
                </p>
                <a href={checkoutHref} className="btn btn-primary" style={{ width: "100%" }}>
                  Continue to checkout →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
