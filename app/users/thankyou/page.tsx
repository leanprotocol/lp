"use client";

// app/users/thankyou/page.tsx
//
// The screens after the /users lead form: the paid senior-health-coach call,
// then a confirmation. Copy and price live in content/users-next.ts.
//
// Served at forms.leanprotocol.in/thankyou through a host rewrite, and at
// /users/thankyou on the main domain.
//
// WHY THIS IS STILL THE /thankyou URL. Meta classifies this domain as a
// health and wellness provider and blocks the Lead standard event. PageView
// is not restricted, so a custom conversion on "URL contains /thankyou"
// counts completed enquiries. The coach screen therefore opens here, with a
// real page load (see the navigation note in ../page.tsx).
//
// WHY THE SCREENS DO NOT CHANGE THE URL. They switch in place, without
// history.pushState. Meta's pixel can treat a history change as a fresh
// PageView, which would count one lead two or three times. Drop-off between
// screens goes to GA4 and GTM as virtual pageviews instead.
//
// WHY NAME AND PHONE ARE NOT IN THE URL. They are read from session storage.
// Every pixel on this page records the URL, and personal details in a query
// string would hand them to ad platforms.
//
// Metadata (title, noindex) comes from the /users layout.

import { useEffect, useState } from "react";
import { AFTER, COACH, COACH_AMOUNT_INR, COACH_MRP_INR } from "../../../content/users-next";

const TICK = "\u2713";
const ARROW = "\u2192";
const BACK = "\u2190";
const RUPEE = "\u20B9";
const KEY = "lp_thanks";

type Stored = { name?: string; fullName?: string; phone?: string; fired?: boolean };
type View = "coach" | "paid" | "later";

type PixelWindow = {
  oaiq?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  Razorpay?: new (opts: Record<string, unknown>) => {
    open: () => void;
    on: (evt: string, cb: (e: { error?: { description?: string } }) => void) => void;
  };
};

/** Where the form lives, relative to whichever host served this page. */
function formHome(): string {
  return window.location.pathname.startsWith("/users") ? "/users" : "/";
}

/**
 * Call `fire` once `ready` reports the SDK has loaded, or give up after 6s.
 *
 * The pixels load from the layout with strategy="afterInteractive", which
 * can run AFTER this component's effect. Calling straight away would find
 * the SDK undefined and skip it silently - the optional call hides the miss.
 */
function whenReady(ready: () => boolean, fire: () => void) {
  if (ready()) {
    try { fire(); } catch { /* a blocked pixel must not break the page */ }
    return;
  }
  let tries = 0;
  const id = window.setInterval(() => {
    tries += 1;
    if (ready()) {
      window.clearInterval(id);
      try { fire(); } catch { /* as above */ }
    } else if (tries >= 40) {
      window.clearInterval(id);
    }
  }, 150);
}

/** GA4 and GTM pageview for a screen. The real page load covers "coach". */
function trackView(view: View) {
  const w = window as unknown as PixelWindow;
  const path = `${window.location.pathname.replace(/\/$/, "")}/${view}`;
  try {
    w.gtag?.("event", "page_view", { page_path: path, page_title: `Post-lead ${view}` });
  } catch { /* analytics must not break the page */ }
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "virtual_pageview", page_path: path, funnel_step: `post-lead-${view}` });
}

function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as PixelWindow).Razorpay) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("The payment window did not load. Check your connection and try again."));
    document.body.appendChild(s);
  });
}

export default function ThankYouPage() {
  const [data, setData] = useState<Stored | null>(null);
  const [view, setView] = useState<View>("coach");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState("");

  useEffect(() => {
    let stored: Stored | null = null;
    try {
      stored = JSON.parse(sessionStorage.getItem(KEY) || "null");
    } catch {
      stored = null;
    }

    // Nobody arrives here without submitting. A direct visit or a bookmark
    // goes back to the form, so it cannot pass for a completed enquiry.
    if (!stored) {
      window.location.replace(formHome());
      return;
    }

    setData({ ...stored, name: stored.name || "friend" });

    // Once per submission. Marked before firing, so a refresh while the
    // pixels are still loading cannot count the same lead twice.
    if (stored.fired) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ ...stored, fired: true }));
    } catch {
      /* storage full or locked: fire anyway, a double count beats none */
    }

    const w = window as unknown as PixelWindow;

    // Each SDK on its own. In one shared block a throw from the first would
    // skip the rest, which is what happened on the form page.
    whenReady(() => typeof w.oaiq === "function", () => {
      w.oaiq?.("measure", "lead_created", { type: "customer_action" });
      w.oaiq?.("measure", "page_viewed", { type: "contents" });
    });
    // Suppressed by Meta while the domain is health-restricted. Kept so it
    // starts counting the moment a review lifts the restriction.
    whenReady(() => typeof w.fbq === "function", () => {
      w.fbq?.("track", "Lead");
    });
    whenReady(() => typeof w.gtag === "function", () => {
      w.gtag?.("event", "generate_lead", { currency: "INR" });
    });
  }, []);

  const go = (v: View) => {
    setPayError(null);
    setView(v);
    trackView(v);
  };

  async function pay() {
    if (paying || !data) return;
    const phone = (data.phone || "").replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPayError(AFTER.noPhone);
      return;
    }
    const fullName = (data.fullName || data.name || "").trim();

    setPaying(true);
    setPayError(null);
    try {
      const res = await fetch("/api/users/coach-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, phone }),
      });
      const order = await res.json().catch(() => ({}));
      if (!res.ok || !order?.success) throw new Error(order?.error || "Could not start payment. Please try again.");

      await loadRazorpay();
      const w = window as unknown as PixelWindow;
      if (!w.Razorpay) throw new Error("The payment window did not load. Please try again.");

      const rzp = new w.Razorpay({
        key: order.keyId,
        currency: order.currency,
        amount: Math.round(order.amount * 100),
        name: "Lean Protocol",
        description: "Senior health coach call",
        order_id: order.orderId,
        prefill: { name: fullName, contact: phone },
        theme: { color: "#193231" },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setPaymentRef(resp.razorpay_payment_id);
          try {
            const vr = await fetch("/api/users/coach-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              }),
            });
            const vd = await vr.json().catch(() => ({}));
            if (!vr.ok || !vd?.success) throw new Error("verify");

            go("paid");
            const pw = window as unknown as PixelWindow;
            whenReady(() => typeof pw.gtag === "function", () => {
              pw.gtag?.("event", "purchase", {
                transaction_id: resp.razorpay_payment_id,
                value: COACH_AMOUNT_INR,
                currency: "INR",
                items: [{ item_name: "Senior health coach call", price: COACH_AMOUNT_INR, quantity: 1 }],
              });
            });
            // Likely suppressed for the same health classification as Lead.
            whenReady(() => typeof pw.fbq === "function", () => {
              pw.fbq?.("track", "Purchase", { value: COACH_AMOUNT_INR, currency: "INR" });
            });
          } catch {
            setPayError(AFTER.verifyFailed);
          } finally {
            setPaying(false);
          }
        },
      });

      rzp.on("payment.failed", (e) => {
        setPayError(e?.error?.description || "Payment failed. No money was taken. Please try again.");
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setPaying(false);
    }
  }

  const name = data?.name || "friend";
  const confirmed = view === "paid" || view === "later";

  return (
    <div className="stage">
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <div className="card">
        <div className="card-wash" />
        <div className="blob blob-a" />
        <div className="blob blob-b" />

        <div className="topbar">
          <span className="back" aria-hidden="true" style={{ opacity: 0, pointerEvents: "none" }}>
            {BACK}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cropped.png" alt="Lean Protocol" />
        </div>

        <div className="step" key={`post-${view}`}>
          {data !== null && view === "coach" && (
            <div className="pane">
              <div className="badge">{COACH.badge}</div>
              <h2 className="q-h2" style={{ margin: "0 0 8px" }}>
                {COACH.title} <span className="serif">{COACH.titleSerif}</span>
              </h2>
              {COACH.sub && <p className="q-hint">{COACH.sub}</p>}

              <div className="panel" style={{ padding: "4px 18px", marginTop: 16 }}>
                {COACH.includes.map((it, i) => (
                  <div
                    key={it.title}
                    style={{ display: "flex", gap: 12, padding: "13px 0", borderTop: i ? "1px solid rgba(28,43,34,.08)" : "none" }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ width: 22, height: 22, borderRadius: "50%", background: "#2D5A4E", color: "#F9F7F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flex: "none", marginTop: 1 }}
                    >
                      {TICK}
                    </span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#193231", lineHeight: 1.3 }}>{it.title}</div>
                      <div style={{ fontSize: 13, color: "rgba(28,43,34,.6)", lineHeight: 1.45, marginTop: 2 }}>{it.body}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="panel-dark"
                style={{ marginTop: 14, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#F9F7F2" }}>{COACH.priceLabel}</div>
                  {COACH.priceNote && (
                    <div style={{ fontSize: 12.5, color: "#A8BEB7", marginTop: 3 }}>{COACH.priceNote}</div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flex: "none" }}>
                  {COACH_MRP_INR > COACH_AMOUNT_INR && (
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#A8BEB7" }}>
                      {COACH.mrpLabel}{" "}
                      <s aria-label={`was ${COACH_MRP_INR} rupees`} style={{ textDecorationThickness: 2 }}>{RUPEE}{COACH_MRP_INR}</s>
                    </span>
                  )}
                  <span style={{ fontWeight: 800, fontSize: 40, color: "#C8D9A7", letterSpacing: "-.04em", lineHeight: 1 }}>
                    {RUPEE}{COACH_AMOUNT_INR}
                  </span>
                </div>
              </div>

              {payError && <p className="err" role="alert">{payError}</p>}
              {payError && paymentRef && (
                <p className="fine" style={{ marginTop: 6 }}>{AFTER.paymentRef}: {paymentRef}</p>
              )}

              <div className="cta-wrap" style={{ paddingTop: 18 }}>
                <button
                  type="button"
                  className={`cta ${paying ? "cta-idle" : "cta-primary"}`}
                  onClick={pay}
                  disabled={paying}
                  style={{ padding: 18, fontSize: 17 }}
                >
                  {paying ? COACH.paying : `${COACH.cta} ${ARROW}`}
                </button>
              </div>
              <p className="fine" style={{ marginTop: 10 }}>{COACH.secure}</p>
              <button
                type="button"
                onClick={() => go("later")}
                style={{ alignSelf: "center", background: "none", border: 0, padding: "8px 4px", marginTop: 2, color: "rgba(28,43,34,.55)", fontSize: 13.5, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}
              >
                {COACH.skip}
              </button>
              <p className="fine" style={{ fontSize: 10.5, marginTop: 8 }}>{COACH.fine}</p>
            </div>
          )}

          {data !== null && confirmed && (
            <div className="pane" style={{ justifyContent: "center", textAlign: "center" }}>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: "50%",
                  background: "#193231",
                  color: "#C8D9A7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 38,
                  margin: "0 auto 26px",
                  boxShadow: "0 20px 46px rgba(25,50,49,.3)",
                  animation: "fnPop .5s both",
                }}
              >
                {TICK}
              </div>
              <h1 style={{ fontWeight: 800, fontSize: "clamp(30px,8.5vw,44px)", letterSpacing: "-.035em", lineHeight: 1.04, margin: "0 0 14px", color: "#193231" }}>
                {view === "paid" ? (
                  <>{AFTER.paidTitle} <span className="serif">{AFTER.paidTitleSerif}</span></>
                ) : (
                  <>{AFTER.laterTitle} <span className="serif">{name}.</span></>
                )}
              </h1>
              <p style={{ fontSize: 18, lineHeight: 1.5, color: "rgba(28,43,34,.62)", margin: "0 0 18px" }}>
                {view === "paid" ? AFTER.paidBody : AFTER.laterBody}
              </p>
              {view === "paid" && paymentRef && (
                <p className="fine">{AFTER.paymentRef}: {paymentRef}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}