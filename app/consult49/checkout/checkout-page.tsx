"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const CONSULT_PRICE = 49;

function CheckoutContent() {
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const bmi = searchParams.get("bmi") || "";

  useEffect(() => {
    const urlName = searchParams.get("name");
    const urlPhone = searchParams.get("phone");
    if (urlName) setName(urlName);
    if (urlPhone) setPhone(urlPhone.replace(/\D/g, "").slice(0, 10));
  }, []);

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name";
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) next.phone = "Enter a valid 10-digit number";
    const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) next.email = "Enter a valid email";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    if (!consent) { alert("Please accept the Terms & Privacy Policy to continue."); return; }

    setPaying(true);
    setPayError(null);

    try {
      const createRes = await fetch("/api/consult49/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.replace(/\D/g, ""),
          email: email.trim(),
          city: city.trim(),
          preferred_time: preferredTime,
          bmi,
        }),
      });

      const order = await createRes.json();
      if (!createRes.ok) throw new Error(order?.error || "Could not start payment. Please try again.");

      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) { resolve(); return; }
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load payment gateway"));
        document.body.appendChild(s);
      });

      const razorpay = new (window as any).Razorpay({
        key: order.keyId,
        currency: order.currency,
        amount: Math.round(order.amount * 100),
        name: "Lean Protocol — GLP-1 Doctor Consultation",
        description: "1:1 GLP-1 Doctor Consultation · ₹49",
        order_id: order.orderId,
        prefill: { name: name.trim(), contact: phone.replace(/\D/g, ""), email: email.trim() || undefined },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/consult49/verify", {
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
                preferred_time: preferredTime,
                bmi,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData?.error || "Payment verification failed");
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (err: any) {
            setPayError(err.message || "Payment verification failed. Please contact support.");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: "#15603F" },
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
      <div className="urgency-bar">🔒 Secure checkout — your GLP-1 Doctor Consultation for just ₹49</div>

      <header>
        <div className="wrap nav">
          <a href="/consult49" className="logo">
            <div className="mark">LP</div>
            <div className="name">LEAN <b>PROTOCOL</b></div>
          </a>
          <div className="secure">🔒 256-bit secure</div>
        </div>
      </header>

      {!success ? (
        <div>
          <div className="page-h">
            <h1>Confirm your consultation</h1>
            <p>You&apos;re one step away — book your GLP-1 doctor consultation for just ₹49.</p>
          </div>

          <div className="wrap checkout-grid">
            {/* Details */}
            <div className="c-card">
              <h3>Your details</h3>

              <div className={`c-field ${errors.name ? "err" : ""}`}>
                <label>Full name</label>
                <input type="text" placeholder="Your name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
                <div className="c-msg">{errors.name}</div>
              </div>

              <div className="c-row2">
                <div className={`c-field ${errors.phone ? "err" : ""}`}>
                  <label>Phone (WhatsApp)</label>
                  <div className="c-phone">
                    <span className="cc">+91</span>
                    <input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" autoComplete="tel-national" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
                  </div>
                  <div className="c-msg">{errors.phone}</div>
                </div>
                <div className={`c-field ${errors.email ? "err" : ""}`}>
                  <label>Email</label>
                  <input type="email" placeholder="you@email.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                  <div className="c-msg">{errors.email}</div>
                </div>
              </div>

              <div className="c-row2">
                <div className="c-field">
                  <label>City</label>
                  <input type="text" placeholder="e.g. Delhi" autoComplete="address-level2" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div className="c-field">
                  <label>Preferred call time</label>
                  <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)}>
                    <option value="" disabled>Select</option>
                    <option>Morning (9am–12pm)</option>
                    <option>Afternoon (12pm–4pm)</option>
                    <option>Evening (4pm–8pm)</option>
                    <option>Anytime</option>
                  </select>
                </div>
              </div>

              <label className="c-consent">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                <span>
                  I agree to the{" "}
                  <a href="https://www.leanprotocol.in/terms" target="_blank" rel="noopener noreferrer">Terms</a>
                  {" "}&amp;{" "}
                  <a href="https://www.leanprotocol.in/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                  , and consent to be contacted about my consultation.
                </span>
              </label>
            </div>

            {/* Summary */}
            <div className="c-card summary" style={{ position: "sticky", top: "84px" }}>
              <span className="kicker">GLP-1 Expert</span>
              <h3 style={{ marginTop: "4px" }}>Order summary</h3>
              <div className="line-item">
                <div className="pinfo">
                  <b>GLP-1 Doctor Consultation</b>
                  <small>Live 1:1 video call with a certified doctor</small>
                  {bmi && <small>Your BMI: {bmi}</small>}
                </div>
                <div className="amt"><s>₹1,500</s>₹49</div>
              </div>
              <ul className="incl">
                <li><b>✓</b> Live 1:1 video call with a GLP-1 expert</li>
                <li><b>✓</b> Personalised fat-loss plan</li>
                <li><b>✓</b> Root cause analysis</li>
                <li><b>✓</b> Prescription right at your inbox</li>
                <li><b>✓</b> WhatsApp support to get started</li>
              </ul>
              <div className="totals">
                <div className="tot-row"><span>Subtotal</span><span>₹49</span></div>
                <div className="tot-row"><span>Taxes</span><span>Included</span></div>
                <div className="grand"><span>Total payable</span><span className="amt">₹49</span></div>
              </div>

              {payError && (
                <p style={{ color: "var(--danger)", fontSize: "13px", marginTop: "10px", textAlign: "center" }}>{payError}</p>
              )}

              <button className="btn btn-primary" style={{ width: "100%", marginTop: "18px", fontSize: "17px" }} onClick={handlePay} disabled={paying}>
                {paying ? "Processing…" : "Pay ₹49 & Book"}
              </button>
              <div className="guarantee">🛡️ <span>If you&apos;re not eligible after your consult, our team guides you on the right next step — no pressure.</span></div>
              <div className="trust-row"><span>🔒 256-bit secure</span><span>·</span><span>UPI / Cards / Netbanking</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="c-success" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="ic">✓</div>
          <h2>Consultation booked!</h2>
          <p>Thank you — your ₹49 GLP-1 doctor consultation is confirmed. Our medical team will reach out on WhatsApp shortly to schedule your call.</p>
          <a href="https://wa.link/3s1upf" className="btn btn-wa" style={{ marginBottom: "10px" }}>💬 Message us on WhatsApp</a>
          <br />
          <a href="/consult49" style={{ color: "var(--sage)", fontSize: "13px", display: "inline-block", marginTop: "10px" }}>← Back to home</a>
        </div>
      )}

      <footer>
        <div className="wrap">
          <p className="legal">
            GLP-1 medications are prescription-only and dispensed solely when a licensed physician determines they are clinically appropriate.
            The consultation fee is non-refundable once the consultation is delivered. Results vary and are not guaranteed.
            Lean Protocol is not affiliated with Novo Nordisk A/S or Eli Lilly &amp; Co. © {new Date().getFullYear()} Lean Protocol Pvt Ltd.
          </p>
          <p style={{ textAlign: "center", marginTop: "10px", fontSize: "13px", color: "var(--sage)" }}>
            Need help?{" "}
            <a href="tel:+919650401267" style={{ color: "var(--green)" }}>+91 96504 01267</a>
            {" · "}
            <a href="mailto:support@leanprotocol.in" style={{ color: "var(--green)" }}>support@leanprotocol.in</a>
            {" · "}
            <a href="https://wa.link/3s1upf" style={{ color: "var(--green)" }}>WhatsApp</a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default function Consult49Checkout() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
