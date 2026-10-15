"use client";

// app/course/checkout/checkout-form.tsx
// Name + mobile + consent, then Razorpay for Rs 99. The amount is set on the
// server (/api/course/order) and re-checked when verifying, so the browser
// cannot change it. Pure ASCII file.

import { useState } from "react";
import { COURSE } from "@/content/course";
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
.co .ok{width:72px;height:72px;border-radius:999px;background:#193231;color:#C8D9A7;display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto}
`;

export default function CheckoutForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paidRef, setPaidRef] = useState<string | null>(null);
  const price = `${RUPEE}${COURSE.priceInr}`;
  const valid = name.trim().length > 1 && /^[6-9]\d{9}$/.test(phone) && consent;

  async function pay() {
    if (!valid || busy) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/course/order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, attribution: readAttribution() }),
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
            const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
            try { w.gtag?.("event", "purchase", { transaction_id: resp.razorpay_payment_id, value: COURSE.priceInr, currency: "INR" }); } catch {}
            try { w.fbq?.("track", "Purchase", { value: COURSE.priceInr, currency: "INR" }); } catch {}
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
          <div className="sum"><span>Full master class, one-time</span><b>{price}</b></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="nm">Your name</label>
            <input id="nm" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor="ph">Mobile number (you will sign in to the app with this)</label>
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