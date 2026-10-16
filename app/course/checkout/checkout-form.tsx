"use client";

// app/course/checkout/checkout-form.tsx
// Name + mobile + consent, then Razorpay for Rs 99. The amount is set on the
// server (/api/course/order) and re-checked when verifying, so the browser
// cannot change it. Pure ASCII file.

import { useEffect, useState } from "react";
import { BONUS, COURSE } from "@/content/course";
import BonusPopup from "./bonus-popup";
import { COUPON_KEY, DISMISS_KEY, fmt, getWindowEnd } from "../offer-window";
import AttributionCapture, { readAttribution } from "../attribution";

type RzpWindow = Window & {
  Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (x: { error?: { description?: string } }) => void) => void };
};

const RUPEE = "\u20b9";

function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as RzpWindow).Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("The payment window did not load. Check your connection and try again."));
    document.body.appendChild(s);
  });
}

const CSS = `
.co{min-height:100vh;background:#193231;font-family:var(--font-sans,Inter),Inter,system-ui,sans-serif;color:#1C2B22;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
.co *{box-sizing:border-box}
.co .box{width:100%;max-width:460px;background:#F9F7F2;border-radius:28px;padding:34px 30px;box-shadow:0 30px 80px rgba(0,0,0,.3);display:flex;flex-direction:column;gap:16px}
.co h1{margin:0;font-size:28px;line-height:1.15;letter-spacing:-.03em;font-weight:800}
.co h1 i{font-family:var(--font-serif,'Libre Baskerville'),'Libre Baskerville',Georgia,serif;font-weight:400;color:#2D5A4E}
.co .sum{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid rgba(28,43,34,.1);border-radius:16px;padding:14px 18px;font-weight:700}
.co .sum b{font-size:26px;letter-spacing:-.03em}
.co label{font-weight:700;font-size:14px}
.co input[type=text],.co input[type=tel]{width:100%;background:#fff;border:1.5px solid rgba(28,43,34,.16);border-radius:14px;padding:14px 16px;font:inherit;font-size:16px}
.co .ph{display:flex;gap:10px}.co .ph span{background:#fff;border:1.5px solid rgba(28,43,34,.16);border-radius:14px;padding:14px;font-weight:700}
.co .consent{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:#4A5A52;font-weight:400}
.co .consent input{margin-top:3px;width:18px;height:18px;flex:none}
.co button.pay{border:0;border-radius:999px;background:#193231;color:#F9F7F2;font:inherit;font-weight:800;font-size:17px;padding:17px;cursor:pointer;min-height:52px}
.co button.pay:disabled{opacity:.55;cursor:default}
.co .err{margin:0;color:#B3402F;font-size:14px}
.co .fine{margin:0;font-size:12.5px;color:#5A6A62}
.co a{color:#2D5A4E}
.co .bonus-on{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;background:#E7EFD9;border:1px solid #C8D9A7;border-radius:14px;padding:10px 14px;font-size:13.5px;color:#193231}
.co .bonus-time{font-weight:800;color:#C0392B;font-variant-numeric:tabular-nums}
.bp-scrim{position:fixed;inset:0;z-index:1000;background:rgba(10,20,19,.7);display:flex;align-items:center;justify-content:center;padding:20px}
.bp-box{position:relative;width:100%;max-width:400px;background:#F9F7F2;border-radius:26px;padding:34px 28px 28px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;box-shadow:0 30px 80px rgba(0,0,0,.4);animation:bpIn .25s ease-out}
.bp-close{position:absolute;top:12px;right:14px;width:40px;height:40px;border:0;background:transparent;font-size:28px;line-height:1;color:#5A6A62;cursor:pointer;border-radius:999px}
.bp-eyebrow{margin:0;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#2D5A4E}
.bp-box h2{margin:0;font-size:24px;line-height:1.2;letter-spacing:-.02em;font-weight:800;color:#193231}
.bp-gift{margin:10px 0 0;border:0;background:radial-gradient(circle,#fff 0%,#F1F5EA 70%);width:150px;height:150px;border-radius:999px;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:bpBob 1.6s ease-in-out infinite}
.bp-gift.open{animation:bpShake .9s ease-in-out}
.bp-hint{margin:0;font-weight:700;color:#4A5A52}
.bp-code{background:#193231;color:#C8D9A7;border-radius:12px;padding:10px 16px;font-weight:700}
.bp-code b{color:#F9F7F2;letter-spacing:.08em}
.bp-price{margin:4px 0 0;font-size:18px;color:#193231}
.bp-price s{color:#7A867F;margin-right:6px}
.bp-price b{font-size:28px}
.bp-go{margin-top:6px;width:100%;border:0;border-radius:999px;background:#193231;color:#F9F7F2;font:inherit;font-weight:800;font-size:16px;padding:15px;cursor:pointer;min-height:48px}
@keyframes bpIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
@keyframes bpBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes bpShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-10deg) scale(1.05)}40%{transform:rotate(10deg) scale(1.08)}60%{transform:rotate(-8deg) scale(1.1)}80%{transform:rotate(6deg) scale(1.12)}}
@media (prefers-reduced-motion:reduce){.bp-box,.bp-gift,.bp-gift.open{animation:none}}
.co .ok{width:72px;height:72px;border-radius:999px;background:#193231;color:#C8D9A7;display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto}
`;

export default function CheckoutForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidRef, setPaidRef] = useState<string | null>(null);
  const [windowEnd, setWindowEnd] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const [coupon, setCoupon] = useState<{ token: string; expiresAt: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const end = getWindowEnd();
    setWindowEnd(end);
    let saved: { token: string; expiresAt: number } | null = null;
    try { saved = JSON.parse(localStorage.getItem(COUPON_KEY) || "null"); } catch {}
    if (saved && saved.expiresAt > Date.now()) setCoupon(saved);
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === "1"; } catch {}
    if (!saved && !dismissed && end > Date.now()) setShowBonus(true);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const bonusActive = Boolean(coupon && coupon.expiresAt > now);
  const amount = bonusActive ? COURSE.priceInr - BONUS.discountInr : COURSE.priceInr;
  const price = `${RUPEE}${amount}`;

  const onCoupon = (token: string, expiresAt: number) => {
    const c = { token, expiresAt };
    setCoupon(c);
    try { localStorage.setItem(COUPON_KEY, JSON.stringify(c)); } catch {}
  };
  const closeBonus = () => {
    setShowBonus(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  };
  const valid = name.trim().length > 1 && /^[6-9]\d{9}$/.test(phone) && consent;

  async function pay() {
    if (!valid || busy) return;
    setBusy(true); setError(null);
    /* Checkout started. Not a lead event: the programme funnel owns those. */
    const w0 = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; oaiq?: (...a: unknown[]) => void };
    try { w0.fbq?.("track", "InitiateCheckout", { value: amount, currency: "INR" }); } catch {}
    try { w0.gtag?.("event", "begin_checkout", { value: amount, currency: "INR" }); } catch {}
    try {
      const r = await fetch("/api/course/order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, attribution: readAttribution(), coupon: bonusActive ? coupon?.token : undefined }),
      });
      const order = await r.json().catch(() => ({}));
      if (!r.ok || !order?.success) throw new Error(order?.error || "Could not start payment. Please try again.");
      await loadRazorpay();
      const W = window as RzpWindow;
      if (!W.Razorpay) throw new Error("The payment window did not load. Please try again.");
      const rzp = new W.Razorpay({
        key: order.keyId, amount: order.amount * 100, currency: "INR", order_id: order.orderId,
        name: "Lean Protocol", description: "GLP weight loss master class",
        prefill: { name: name.trim(), contact: phone }, theme: { color: "#193231" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const v = await fetch("/api/course/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpayOrderId: resp.razorpay_order_id, razorpayPaymentId: resp.razorpay_payment_id, razorpaySignature: resp.razorpay_signature }),
            });
            const d = await v.json().catch(() => ({}));
            if (!v.ok || !d?.success) throw new Error("verify");
            setPaidRef(resp.razorpay_payment_id);
            const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; oaiq?: (...a: unknown[]) => void };
            try { w.gtag?.("event", "purchase", { transaction_id: resp.razorpay_payment_id, value: order.amount, currency: "INR" }); } catch {}
            try { w.fbq?.("track", "Purchase", { value: order.amount, currency: "INR" }); } catch {}
            try { w.oaiq?.("measure", "purchase", { value: order.amount, currency: "INR" }); } catch {}
          } catch {
            setError(`Your payment went through, but we could not confirm it. Do not pay again. Email support@leanprotocol.in with reference ${resp.razorpay_payment_id}.`);
          } finally { setBusy(false); }
        },
      });
      rzp.on("payment.failed", (e) => { setError(e?.error?.description || "Payment failed. No money was taken. Please try again."); setBusy(false); });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="co">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <AttributionCapture />
      {showBonus && !paidRef && <BonusPopup windowEnd={windowEnd} onCoupon={onCoupon} onClose={closeBonus} />}
      {paidRef ? (
        <div className="box" style={{ textAlign: "center" }}>
          <span className="ok" aria-hidden="true">{"\u2713"}</span>
          <h1>You are in, <i>{name.trim().split(" ")[0]}.</i></h1>
          <p style={{ margin: 0, color: "#4A5A52" }}>
            Download the Lean Protocol app and sign in with <b>+91 {phone}</b> to watch the full master class.
          </p>
          <p className="fine">Payment reference: {paidRef}</p>
        </div>
      ) : (
        <div className="box">
          <h1>Get the GLP weight loss <i>master class.</i></h1>
          <div className="sum">
            <span>Full master class</span>
            <span style={{ textAlign: "right" }}>
              {bonusActive && <s style={{ color: "#7A867F", fontWeight: 700, marginRight: 8 }}>{RUPEE}{COURSE.priceInr}</s>}
              <b>{price}</b>
            </span>
          </div>
          {bonusActive && coupon && (
            <div className="bonus-on">
              <span>Code <b>{BONUS.code}</b> applied: {BONUS.title}</span>
              <span className="bonus-time">Valid for {fmt(coupon.expiresAt - now)}</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="nm">Your name</label>
            <input id="nm" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="ph">Mobile number</label>
            <div className="ph">
              <span>+91</span>
              <input id="ph" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
            </div>
          </div>
          <label className="consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>I am 18 or older and accept the <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms</a>, <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/refund-policy" target="_blank" rel="noopener noreferrer">Refund Policy</a>.</span>
          </label>
          {error && <p className="err" role="alert">{error}</p>}
          <button type="button" className="pay" onClick={pay} disabled={!valid || busy}>
            {busy ? "Opening secure payment..." : `Pay ${price} securely`}
          </button>
          <p className="fine">Secure payment by Razorpay: UPI, cards and netbanking. Educational content, not medical advice.</p>
        </div>
      )}
    </main>
  );
}