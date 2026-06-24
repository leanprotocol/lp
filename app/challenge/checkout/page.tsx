"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const PROMO_CODE = "30+15HARD";
const FIXED_PRICE = 3999;

interface MiniOffer {
  label: string;
}

const MINI_OFFERS: MiniOffer[] = [
  { label: "Free Consult" },
  { label: "Mystery" },
  { label: "90% OFF" },
  { label: "Free Month" },
  { label: "1+1 Month" },
  { label: "Free Diet" },
];
const MINI_WIN = 1;

function normalizePromo(v: string) {
  return v.trim().toUpperCase().replace(/\s+/g, "+");
}

function CheckoutContent() {
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ type: "ok" | "bad"; text: string } | null>(null);

  const [miniSpinning, setMiniSpinning] = useState(false);
  const [miniSpun, setMiniSpun] = useState(false);
  const [miniRotation, setMiniRotation] = useState(0);
  const [miniLabel, setMiniLabel] = useState("Spin to unlock 🎯");

  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Prefill from URL (passed from the spin wheel on the landing page)
  useEffect(() => {
    const urlName = searchParams.get("name");
    const urlPhone = searchParams.get("phone");
    const urlPromo = searchParams.get("promo");

    if (urlName) setName(urlName);
    if (urlPhone) setPhone(urlPhone.replace(/\D/g, "").slice(0, 10));
    if (urlPromo) {
      setPromoInput(normalizePromo(urlPromo));
      applyPromo(urlPromo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyPromo(code: string) {
    if (promoApplied) return;
    if (normalizePromo(code) === PROMO_CODE) {
      setPromoApplied(true);
      setPromoMsg({ type: "ok", text: "✓ Promo 30+15HARD applied — 15 extra days free!" });
      setPromoInput(PROMO_CODE);
    } else {
      setPromoMsg({ type: "bad", text: "That code isn't valid. Try 30+15HARD or spin below." });
    }
  }

  function handleMiniSpin() {
    if (miniSpun) return;
    setMiniSpun(true);
    setMiniSpinning(true);
    setMiniLabel("Spinning…");

    const targetAngle = MINI_WIN * 60 + 30;
    const fullSpins = 360 * 6;
    setTimeout(() => setMiniRotation(fullSpins - targetAngle), 60);

    // Fire-and-forget lead capture for the checkout-page spin
    fetch("/api/challenge/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone ? `+91${phone.replace(/\D/g, "")}` : "",
        prize: "30+15 Days Free",
        promo: PROMO_CODE,
        source: "checkout-spin",
        page_url: window.location.href,
        referrer: document.referrer,
      }),
    }).catch(() => {});

    setTimeout(() => {
      setMiniLabel("You won 30+15 Days Free!");
      applyPromo(PROMO_CODE);
    }, 4600);
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name";
    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) next.phone = "Enter a valid 10-digit mobile number";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePay() {
    if (!validate()) {
      alert("Please enter your name and a valid 10-digit mobile number.");
      return;
    }

    setPaying(true);
    setPayError(null);

    try {
      const createRes = await fetch("/api/challenge/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.replace(/\D/g, ""),
          email: email.trim(),
          city: city.trim(),
          promoApplied,
        }),
      });

      const order = await createRes.json();

      if (!createRes.ok) {
        throw new Error(order?.error || "Could not start payment. Please try again.");
      }

      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existing || (window as any).Razorpay) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load payment gateway"));
        document.body.appendChild(script);
      });

      const razorpay = new (window as any).Razorpay({
        key: order.keyId,
        currency: order.currency,
        amount: Math.round(order.amount * 100),
        name: "Lean Protocol — 30 Days Hard Challenge",
        description: promoApplied ? "30 + 15 Days FREE bonus" : "30 Days Hard Challenge",
        order_id: order.orderId,
        prefill: {
          name: name.trim(),
          contact: phone.replace(/\D/g, ""),
          email: email.trim() || undefined,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/challenge/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                name: name.trim(),
                phone: phone.replace(/\D/g, ""),
                email: email.trim(),
                city: city.trim(),
                promoApplied,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData?.error || "Payment verification failed");
            }

            setSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (err: any) {
            setPayError(err.message || "Payment verification failed. Please contact support.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
        theme: { color: "#C9A24B" },
      });

      razorpay.on("payment.failed", (evt: any) => {
        setPayError(evt?.error?.description || "Payment failed. Please try again.");
        setPaying(false);
      });

      razorpay.open();
    } catch (err: any) {
      setPayError(err.message || "Could not start payment. Please try again.");
      setPaying(false);
    }
  }

  return (
    <>
      <header>
        <div className="wrap nav">
          <div className="logo">
            <div className="mark">LP</div>
            <div className="name">
              LEAN <b>PROTOCOL</b>
              <span>DOCTOR-LED · SCIENCE-BACKED</span>
            </div>
          </div>
          <div className="secure">🔒 Secure checkout</div>
        </div>
      </header>

      <div className="wrap">
        <div className="page-h">
          <h1>
            Join the <span className="g">30 Days Hard Challenge</span>
          </h1>
          <p>You&apos;re one step away. Complete your details to lock in your spot.</p>
        </div>

        {!success ? (
          <div className="checkout-grid">
            {/* Left: details */}
            <div className="card">
              <h2>Your details</h2>
              <div className={`field ${errors.name ? "err" : ""}`}>
                <label htmlFor="cn">Full name</label>
                <input
                  id="cn"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={`field ${errors.phone ? "err" : ""}`}>
                <label htmlFor="cp">Phone (WhatsApp)</label>
                <div className="phone-wrap">
                  <span className="cc">+91</span>
                  <input
                    id="cp"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </div>
              </div>
              <div className="row2">
                <div className="field">
                  <label htmlFor="ce">Email</label>
                  <input
                    id="ce"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="ccity">City</label>
                  <input
                    id="ccity"
                    type="text"
                    placeholder="e.g. Delhi"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <p className="trust-line" style={{ textAlign: "left", marginTop: "6px" }}>
                By continuing you agree to our{" "}
                <a href="https://www.leanprotocol.in/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold)" }}>
                  Privacy Policy
                </a>{" "}
                and to be contacted by our medical team.
              </p>
            </div>

            {/* Right: summary */}
            <div className="card summary">
              <h2>Order summary</h2>
              <div className="plan-row">
                <span className="default-tag">Default</span>
                <div className="radio"></div>
                <div className="pinfo">
                  <b>30 Days Hard Challenge</b>
                  <small>{promoApplied ? "45 days (30 + 15 days FREE)" : "1 Month · 30 days"}</small>
                  <div style={{ fontSize: "12px", color: "var(--sage)", marginTop: "3px" }}>
                    Includes ₹449 doctor consultation
                  </div>
                  <span className={`free-badge ${promoApplied ? "show" : ""}`}>+15 days free</span>
                </div>
                <div className="pprice">
                  <span className="amt">₹{FIXED_PRICE.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="promo">
                <label className="promo-label" htmlFor="promoInput">Promo code</label>
                <div className="promo-in">
                  <input
                    id="promoInput"
                    placeholder="ENTER CODE"
                    autoComplete="off"
                    value={promoInput}
                    disabled={promoApplied}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyPromo(promoInput);
                      }
                    }}
                  />
                  <button className="btn btn-ghost" onClick={() => applyPromo(promoInput)}>
                    Apply
                  </button>
                </div>
                {promoMsg && <div className={`promo-msg ${promoMsg.type}`}>{promoMsg.text}</div>}
              </div>

              {!promoApplied && (
                <div className="spin-box">
                  <h3>🎁 Didn&apos;t spin yet?</h3>
                  <p>Try your luck for an exclusive joining offer.</p>
                  <div className={`mini-stage ${miniSpinning ? "show" : ""}`}>
                    <div className="mpointer"></div>
                    <div className="mwheel" style={{ transform: `rotate(${miniRotation}deg)` }}>
                      {MINI_OFFERS.map((o, i) => {
                        const angle = i * 60 + 30;
                        return (
                          <span
                            key={i}
                            className="sl"
                            style={{
                              color: i % 2 === 1 ? "#15241e" : "#F4F0E6",
                              textShadow: i % 2 === 1 ? "none" : "0 1px 2px rgba(0,0,0,.55)",
                              transform: `translate(-50%,-50%) rotate(${angle}deg) translate(0,-58px) rotate(${-angle}deg)`,
                            }}
                          >
                            {o.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleMiniSpin} disabled={miniSpun}>
                    {miniLabel}
                  </button>
                </div>
              )}

              <div className="checkout-totals">
                <div className="line">
                  <span>Subtotal</span>
                  <span>₹{FIXED_PRICE.toLocaleString("en-IN")}</span>
                </div>
                {promoApplied && (
                  <div className="line" style={{ color: "var(--green-glow)" }}>
                    <span>15 bonus days</span>
                    <span>FREE</span>
                  </div>
                )}
                <div className="line grand">
                  <span>Total today</span>
                  <span className="amt">₹{FIXED_PRICE.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {payError && (
                <p style={{ color: "var(--red-bright)", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>
                  {payError}
                </p>
              )}

              <button
                className="btn btn-primary"
                style={{ width: "100%", fontSize: "18px", padding: "16px", marginTop: "12px" }}
                onClick={handlePay}
                disabled={paying}
              >
                {paying ? "Processing…" : `Pay ₹${FIXED_PRICE.toLocaleString("en-IN")} & Start`}
              </button>
              <p className="trust-line">🔒 Safe &amp; secure · Cancel anytime · Our team confirms within 24 hrs</p>
            </div>
          </div>
        ) : (
          <div className="checkout-success" style={{ display: "block" }}>
            <div className="ic">✓</div>
            <h2>You&apos;re in! 🎉</h2>
            <p>
              {promoApplied
                ? "Your 30 Days Hard Challenge + 15 bonus days are reserved! Our medical team will reach out shortly to confirm payment and get you started."
                : "Your spot in the 30 Days Hard Challenge is reserved. Our medical team will reach out shortly to confirm payment and get you started."}
            </p>
            <a href="https://wa.link/3s1upf" className="btn btn-wa" style={{ marginBottom: "10px" }}>
              💬 Message us on WhatsApp
            </a>
            <br />
            <a href="/challenge" className="btn btn-ghost">
              Back to home
            </a>
          </div>
        )}
      </div>

      <footer>
        <div className="wrap">
          <p className="legal">
            GLP-1 medications are prescription-only and dispensed solely when a licensed physician determines they
            are clinically appropriate; they are not suitable for everyone and may carry side effects. Information
            here is not medical advice. Results vary and are not guaranteed. Lean Protocol is not affiliated with
            Novo Nordisk A/S or Eli Lilly &amp; Co. © {new Date().getFullYear()} Lean Protocol Pvt Ltd.
          </p>
        </div>
      </footer>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
