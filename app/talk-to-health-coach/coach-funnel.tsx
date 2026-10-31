"use client";

// app/talk-to-health-coach/coach-funnel.tsx
//
// Served at forms.leanprotocol.in/talk-to-health-coach via a beforeFiles host
// rewrite in next.config.mjs (the plain array form runs after filesystem
// routing and never fires - HANDOVER s5).
//
// This is the senior-health-coach funnel, split out of /users so the Rs 49
// call can be sold and measured on its own. Five questions, a BMI result,
// lead capture, then the paid call.
//
// It reuses two things rather than duplicating them:
//   /api/users/lead               already accepts height_cm, bmi, conditions
//   /api/users/coach-order|verify already price and verify the Rs 49 call
// The lead carries source "talk-to-health-coach", so this funnel can be told
// apart from /users in TeleCRM even though the payment routes are shared.
//
// Pure ASCII file.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { COACH_AMOUNT_INR } from "@/content/users-next";

const RUPEE = "\u20b9";
const LEAD_SOURCE = "talk-to-health-coach";
const OFFER_SECONDS = 300;      /* 5 minutes on the offer screen */
const LIST_PRICE_INR = 499;     /* struck through above the offer price */

type RzpWindow = Window & {
  Razorpay?: new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (x: { error?: { description?: string } }) => void) => void };
};

const S = {
  INTRO: 0, HEIGHT: 1, WEIGHT: 2, LOADING: 3, BMI: 4,
  COMORBID: 5, TARGET: 6, TIMING: 7, LEAD: 8, OFFER: 9, PAID: 10,
} as const;
type Step = (typeof S)[keyof typeof S];

const QUESTION_STEPS: Step[] = [S.HEIGHT, S.WEIGHT, S.COMORBID, S.TARGET, S.TIMING];

const LEAD_DOCTOR = { img: "/lp-assets/experts/siddharth.jpeg", name: "Dr. Siddharth Garg", role: "MD \u00b7 Internal Medicine" };

const DOCTORS = [
  { img: "/lp-assets/experts/nishant.jpeg", name: "Dr. Nishant Jain", role: "MD, DM \u00b7 Endocrinologist" },
  { img: "/lp-assets/experts/akhil.jpeg", name: "Dr. Akhil Konduru", role: "MD \u00b7 Internal Medicine" },
  { img: "/lp-assets/experts/siddharth.jpeg", name: "Dr. Siddharth Garg", role: "MD \u00b7 Internal Medicine" },
];

/* The same three the /users funnel shows, with their real roles. */
const TEAM = [
  { name: "Alka Bharti", role: "GLP-1 Dietitian", img: "/lp-assets/experts/alka.jpeg" },
  { name: "Richa Singh", role: "Yoga & Fat Loss", img: "/lp-assets/experts/richa-singh.jpeg" },
  { name: "Aparna Tandon", role: "Weight Loss Expert", img: "/lp-assets/experts/aparna.jpeg" },
];

const STORIES = [
  { name: "Pratima, 37", result: "Lost 7 kg in 2.5 months*", img: "/testimonials/pratima.webp",
    quote: "The first month I barely noticed. By the third my clothes did." },
  { name: "Atreyee, 28", result: "Lost 6 kg*", img: "/before-after/atreyee-before-after.jpeg",
    quote: "My wedding approached and I lost more than I thought I would." },
  { name: "Neema, 46", result: "Lost 10.8 kg in 4 months*", img: "/testimonials/neema.webp",
    quote: "At 46 I thought it was too late. The plan proved me wrong." },
];

const LOAD_MSGS = [
  "Reading your inputs",
  "Checking Indian BMI cut-offs",
  "Comparing to member outcomes",
  "Preparing your result",
];

/* Eight conditions, 4 rows x 2 columns. Icons rather than emoji: emoji render
   differently on every handset and read as flippant next to "Type 2 diabetes". */
const CONDITIONS: { key: string; label: string; path: React.ReactNode }[] = [
  { key: "Type 2 diabetes", label: "Type 2 diabetes", path: <path d="M12 3c3.5 4 6 6.7 6 9.8A6 6 0 0 1 6 12.8C6 9.7 8.5 7 12 3z" /> },
  { key: "High blood pressure", label: "High blood pressure", path: <path d="M20.8 6.6a5 5 0 0 0-8.8-1.9 5 5 0 0 0-8.8 1.9c-1 3.6 3 7.4 8.8 11.4 5.8-4 9.8-7.8 8.8-11.4z" /> },
  { key: "PCOS or PCOD", label: "PCOS or PCOD", path: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></> },
  { key: "Thyroid", label: "Thyroid", path: <path d="M12 7v10M12 9c-2-3-7-3-7 2s4 6 7 6 7-1 7-6-5-5-7-2z" /> },
  { key: "High cholesterol", label: "High cholesterol", path: <><path d="M5 5h9a5 5 0 0 1 0 10H9a4 4 0 0 0 0 8" /><circle cx="17" cy="19" r="2.5" /></> },
  { key: "Fatty liver", label: "Fatty liver", path: <><path d="M4 6h16l-2 9a4 4 0 0 1-4 3h-4a4 4 0 0 1-4-3z" /><path d="M9 11h6" /></> },
  { key: "Sleep apnoea", label: "Sleep apnoea", path: <path d="M20 14a8 8 0 0 1-10.5-10A8.5 8.5 0 1 0 20 14z" /> },
  { key: "Something else", label: "Something else", path: <><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></> },
];

const TARGETS = ["Up to 5 kg", "5 to 10 kg", "10 to 20 kg", "More than 20 kg"];
const TIMINGS = ["Within 3 months", "3 to 6 months", "6 to 12 months", "No deadline, just properly"];

/* Indian cut-offs (ICMR), not WHO: obesity begins at 25 here, and at the same
   BMI Indians carry more visceral fat than Europeans. */
function classify(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 23) return "Healthy range";
  if (bmi < 25) return "Overweight";
  if (bmi < 30) return "Obesity, class I";
  if (bmi < 35) return "Obesity, class II";
  return "Obesity, class III";
}

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

type Attribution = Record<string, string>;

function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const pick = (k: string) => q.get(k) || "";
  return {
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
    campaign_id: pick("campaign_id"),
    gclid: pick("gclid"),
    fbclid: pick("fbclid"),
    page_url: window.location.href.slice(0, 1000),
    referrer: document.referrer.slice(0, 500),
  };
}

function Brand() {
  return (
    <div className="brand">
      <Image src="/logo-cropped.png" alt="" width={34} height={34} priority />
      <span>LEAN PROTOCOL</span>
    </div>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="back" onClick={onClick} aria-label="Go back">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
  );
}

export default function CoachFunnel() {
  const [step, setStep] = useState<Step>(S.INTRO);
  const [cm, setCm] = useState(168);
  const [kg, setKg] = useState(82);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [noneOf, setNoneOf] = useState(false);
  const [other, setOther] = useState("");
  const [target, setTarget] = useState<string | null>(null);
  const [timing, setTiming] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyIdx, setStoryIdx] = useState(0);
  const [load, setLoad] = useState(0);
  const [secsLeft, setSecsLeft] = useState(OFFER_SECONDS);
  const [confetti, setConfetti] = useState(false);
  const attribution = useRef<Attribution>({});

  useEffect(() => { attribution.current = readAttribution(); }, []);

  const bmi = Math.round((kg / Math.pow(cm / 100, 2)) * 10) / 10;
  const bmiClass = classify(bmi);

  /* The loading screen is a real pause, not theatre: the result is ready
     immediately, so it holds for 3.2s and rotates the stories while it waits. */
  useEffect(() => {
    if (step !== S.LOADING) return;
    setLoad(0);
    const rot = window.setInterval(() => setStoryIdx((i) => (i + 1) % STORIES.length), 1400);
    const bar = window.setInterval(() => setLoad((v) => (v >= 100 ? 100 : v + 2)), 92);
    const done = window.setTimeout(() => setStep(S.BMI), 4900);
    return () => { window.clearInterval(rot); window.clearInterval(bar); window.clearTimeout(done); };
  }, [step]);

  /* The countdown and the confetti both start the moment the offer appears.
     At zero the price does NOT change: expiring a real discount on a timer is
     a promise we would have to keep, and nobody wants a refund argument. */
  useEffect(() => {
    if (step !== S.OFFER) return;
    setSecsLeft(OFFER_SECONDS);
    setConfetti(true);
    const hide = window.setTimeout(() => setConfetti(false), 4200);
    const tick = window.setInterval(() => setSecsLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => { window.clearTimeout(hide); window.clearInterval(tick); };
  }, [step]);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const qIndex = QUESTION_STEPS.indexOf(step);
  const showProgress = qIndex >= 0;

  /* Every screen after the first can go back, including the result screens.
     LOADING and PAID are deliberately left out: one is transient, the other
     sits after a payment. */
  const BACK_TO: Partial<Record<Step, Step>> = {
    [S.HEIGHT]: S.INTRO,
    [S.WEIGHT]: S.HEIGHT,
    [S.BMI]: S.WEIGHT,
    [S.COMORBID]: S.BMI,
    [S.TARGET]: S.COMORBID,
    [S.TIMING]: S.TARGET,
    [S.LEAD]: S.TIMING,
    [S.OFFER]: S.LEAD,
  };
  const backTo = BACK_TO[step];

  const mm = Math.floor(secsLeft / 60);
  const ss = String(secsLeft % 60).padStart(2, "0");

  const toggleCondition = (key: string) => {
    setNoneOf(false);
    setPicked((p) => {
      const next = { ...p };
      if (next[key]) { delete next[key]; } else { next[key] = true; }
      return next;
    });
  };

  const conditionList = Object.keys(picked);
  const phoneOk = /^[6-9]\d{9}$/.test(phone);
  const leadReady = name.trim().length > 1 && phoneOk && agreed;

  async function submitLead() {
    if (!leadReady || busy) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/users/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          height_cm: String(cm),
          weight: String(kg),
          bmi: String(bmi),
          conditions: noneOf ? "None" : conditionList.join(", "),
          conditions_other: picked["Something else"] ? other.trim().slice(0, 200) : "",
          goal: target || "",
          timeline: timing || "",
          source: LEAD_SOURCE,
          consent_contact: "Yes",
          consent_age_18_plus: "Yes",
          consent_marketing: marketing ? "Yes" : "No",
          consent_recorded_at: new Date().toISOString(),
          ...attribution.current,
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d?.success) throw new Error(d?.error || "Could not save your details. Please try again.");
      setStep(S.OFFER);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your details. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function payForCall() {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/users/coach-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone }),
      });
      const order = await r.json().catch(() => ({}));
      if (!r.ok || !order?.success) throw new Error(order?.error || "Could not start payment. Please try again.");
      await loadRazorpay();
      const W = window as RzpWindow;
      if (!W.Razorpay) throw new Error("The payment window did not load. Please try again.");
      const rzp = new W.Razorpay({
        key: order.keyId,
        amount: order.amount * 100,
        currency: "INR",
        order_id: order.orderId,
        name: "Lean Protocol",
        description: "Senior health coach call",
        prefill: { name: name.trim(), contact: phone },
        theme: { color: "#193231" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const v = await fetch("/api/users/coach-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: resp.razorpay_order_id,
                razorpayPaymentId: resp.razorpay_payment_id,
                razorpaySignature: resp.razorpay_signature,
              }),
            });
            const d = await v.json().catch(() => ({}));
            if (!v.ok || !d?.success) throw new Error("verify");
            const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
            try { w.gtag?.("event", "purchase", { transaction_id: resp.razorpay_payment_id, value: order.amount, currency: "INR" }); } catch {}
            try { w.fbq?.("track", "Purchase", { value: order.amount, currency: "INR" }); } catch {}
            setStep(S.PAID);
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

  const dark = step === S.OFFER || step === S.PAID;

  return (
    <main className={"coach-page" + (dark ? " dark" : "")} style={dark ? { background: "#193231" } : undefined}>
      {confetti && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 44 }).map((_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 2.27 + (i % 5) * 3) % 100}%`,
                background: ["#C8D9A7", "#C9A84C", "#F9F7F2", "#8DB87A"][i % 4],
                animationDuration: `${2.2 + ((i % 7) * 0.22)}s`,
                animationDelay: `${(i % 11) * 0.12}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="wrap">

        <div className="topbar">
          {dark ? (
            <div className="brand">
              <Image src="/logo-cropped.png" alt="" width={34} height={34} />
              <span style={{ color: "#C8D9A7" }}>LEAN PROTOCOL</span>
            </div>
          ) : <Brand />}
          {backTo !== undefined ? <Back onClick={() => setStep(backTo)} /> : <span />}
        </div>

        {showProgress && (
          <div className="prog">
            <div className="prog-bars">
              {QUESTION_STEPS.map((_, i) => (
                <span key={i} className={"prog-bar" + (i <= qIndex ? " on" : "")} />
              ))}
            </div>
            <p className="prog-meta">QUESTION {qIndex + 1} OF {QUESTION_STEPS.length}</p>
          </div>
        )}

        {/* ---------------- intro ---------------- */}
        {step === S.INTRO && (
          <div className="step">
            <h1 className="q">Find out where your weight actually stands.</h1>
            <p className="lede">A few quick answers, and you will see where you stand.</p>
            <div className="hero-doc">
              <div className="hero-img">
                <Image src={LEAD_DOCTOR.img} alt="" fill sizes="470px" style={{ objectFit: "cover", objectPosition: "50% 12%" }} priority />
                <span className="hero-veil" />
                <span className="hero-cap">
                  <b>{LEAD_DOCTOR.name}</b>
                  <i>{LEAD_DOCTOR.role}</i>
                </span>
              </div>
            </div>
            <div className="cta-wrap">
              <button type="button" className="cta" onClick={() => setStep(S.HEIGHT)}>Check my eligibility</button>
              <p className="fine">Free. No payment at this stage.</p>
            </div>
          </div>
        )}

        {/* ---------------- height ---------------- */}
        {step === S.HEIGHT && (
          <div className="step">
            <h2 className="q">How tall are you?</h2>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
              <div className="dial">
                <div className="dial-row">
                  <button type="button" className="nub" onClick={() => setCm((v) => Math.max(120, v - 1))} aria-label="Decrease height">&#8722;</button>
                  <div style={{ textAlign: "center" }}>
                    <div className="dial-val">{cm}</div>
                    <div className="dial-unit">cm &middot; {Math.floor(Math.round(cm / 2.54) / 12)}&apos; {Math.round(cm / 2.54) % 12}&quot;</div>
                  </div>
                  <button type="button" className="nub" onClick={() => setCm((v) => Math.min(220, v + 1))} aria-label="Increase height">+</button>
                </div>
              </div>
              <p className="hint">Used with your weight to work out your BMI.</p>
            </div>
            <div className="cta-wrap"><button type="button" className="cta" onClick={() => setStep(S.WEIGHT)}>Continue</button></div>
          </div>
        )}

        {/* ---------------- weight ---------------- */}
        {step === S.WEIGHT && (
          <div className="step">
            <h2 className="q">What do you weigh today?</h2>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
              <div className="dial">
                <div className="dial-row">
                  <button type="button" className="nub" onClick={() => setKg((v) => Math.max(35, v - 1))} aria-label="Decrease weight">&#8722;</button>
                  <div style={{ textAlign: "center" }}>
                    <div className="dial-val">{kg}</div>
                    <div className="dial-unit">kg</div>
                  </div>
                  <button type="button" className="nub" onClick={() => setKg((v) => Math.min(250, v + 1))} aria-label="Increase weight">+</button>
                </div>
              </div>
              <p className="hint">Roughly is fine. Nobody checks.</p>
            </div>
            <div className="cta-wrap"><button type="button" className="cta" onClick={() => setStep(S.LOADING)}>See my BMI</button></div>
          </div>
        )}

        {/* ---------------- loading ---------------- */}
        {step === S.LOADING && (
          <div className="step">
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "26px 0 18px" }}>
              <span className="spin" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: "#193231", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {LOAD_MSGS[Math.min(3, Math.floor(load / 26))]}
                </div>
                <div style={{ height: 3, borderRadius: 3, background: "rgba(28,43,34,.12)", marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${load}%`, background: "#2D5A4E", transition: "width .12s linear" }} />
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "rgba(28,43,34,.5)", flex: "none" }}>{load}%</div>
            </div>

            <div className="story" key={`st-${storyIdx}`}>
              <div className="story-img">
                <Image src={STORIES[storyIdx].img} alt={STORIES[storyIdx].name} fill sizes="470px" style={{ objectFit: "cover", objectPosition: "center 22%" }} />
                <span className="story-veil" />
                <div className="story-cap">
                  <span className="story-pill">{STORIES[storyIdx].result}</span>
                  <div className="story-name">{STORIES[storyIdx].name}</div>
                </div>
              </div>
              <div style={{ padding: "18px 22px 20px" }}>
                <p className="story-quote">{"\u201C"}{STORIES[storyIdx].quote}{"\u201D"}</p>
              </div>
            </div>

            <div className="dots" style={{ marginTop: 18 }}>
              {STORIES.map((_, i) => (
                <button key={i} type="button" className={"dot" + (i === storyIdx ? " on" : "")} onClick={() => setStoryIdx(i)} aria-label={`Story ${i + 1}`} />
              ))}
            </div>

            <p className="fine" style={{ marginTop: "auto", paddingTop: 18 }}>*Individual results vary.</p>
          </div>
        )}

        {/* ---------------- bmi ---------------- */}
        {step === S.BMI && (
          <div className="step">
            <h2 className="q">Your BMI is {bmi}</h2>
            <div className="bmi-card">
              <span className="bmi-badge">{bmiClass.toUpperCase()}</span>
              <p className="bmi-note">
                By Indian cut-offs, obesity starts at 25, not 30. At the same BMI, Indians carry more visceral fat than Europeans.
              </p>
            </div>
            <div className="scale-wrap" style={{ marginTop: 22 }}>
              <span className="marker" style={{ left: `${Math.min(97, Math.max(3, ((Math.min(bmi, 35) - 14) / 21) * 100))}%` }}>you</span>
              <div className="scale">
                <span style={{ flex: 185, background: "#BFD3C4" }} />
                <span style={{ flex: 20, background: "#E3D9A8" }} />
                <span style={{ flex: 50, background: "#D9A066" }} />
                <span style={{ flex: 50, background: "#B3402F" }} />
              </div>
              <div className="scale-meta"><span>Healthy</span><span>23</span><span>25</span><span>30+</span></div>
            </div>
            <div className="panel" style={{ marginTop: 20 }}>
              <p>BMI is a starting point, not a diagnosis. What matters next is what else is going on.</p>
            </div>
            <div className="cta-wrap"><button type="button" className="cta" onClick={() => setStep(S.COMORBID)}>Continue</button></div>
          </div>
        )}

        {/* ---------------- conditions ---------------- */}
        {step === S.COMORBID && (
          <div className="step">
            <h2 className="q" style={{ marginTop: 26, fontSize: 29, lineHeight: "35px" }}>Any of these diagnosed?</h2>
            <p className="hint">Pick all that apply.</p>
            <div className="grid">
              {CONDITIONS.map((c) => (
                <button key={c.key} type="button" className={"cell" + (picked[c.key] ? " on" : "")} onClick={() => toggleCondition(c.key)} aria-pressed={!!picked[c.key]}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{c.path}</svg>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
            {picked["Something else"] && (
              <div className="field-wrap" style={{ marginBottom: 12 }}>
                <label className="lab" htmlFor="other">What is it?</label>
                <input id="other" className="field" type="text" value={other} maxLength={200}
                  onChange={(e) => setOther(e.target.value)} placeholder="Type it here" />
              </div>
            )}
            <button type="button" className={"none-btn" + (noneOf ? " on" : "")} onClick={() => { setPicked({}); setNoneOf((v) => !v); }} aria-pressed={noneOf}>
              None of these
            </button>
            <button type="button" className="cta" onClick={() => setStep(S.TARGET)}>Continue</button>
          </div>
        )}

        {/* ---------------- target ---------------- */}
        {step === S.TARGET && (
          <div className="step">
            <h2 className="q">How much would you like to lose?</h2>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="opts">
                {TARGETS.map((t) => (
                  <button key={t} type="button" className={"opt" + (target === t ? " on" : "")} onClick={() => setTarget(t)} aria-pressed={target === t}>
                    <span className="opt-mark">{target === t ? "\u2713" : ""}</span>
                    <span className="opt-label">{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="cta-wrap">
              <button type="button" className="cta" disabled={!target} onClick={() => setStep(S.TIMING)}>Continue</button>
            </div>
          </div>
        )}

        {/* ---------------- timing ---------------- */}
        {step === S.TIMING && (
          <div className="step">
            <h2 className="q">How soon do you want to get there?</h2>
            <p className="hint">So we can tell you what is realistic.</p>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="opts">
                {TIMINGS.map((t) => (
                  <button key={t} type="button" className={"opt" + (timing === t ? " on" : "")} onClick={() => setTiming(t)} aria-pressed={timing === t}>
                    <span className="opt-mark">{timing === t ? "\u2713" : ""}</span>
                    <span className="opt-label">{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="cta-wrap">
              <button type="button" className="cta" disabled={!timing} onClick={() => setStep(S.LEAD)}>Continue</button>
            </div>
          </div>
        )}

        {/* ---------------- lead ---------------- */}
        {step === S.LEAD && (
          <div className="step">
            <h2 className="q" style={{ fontSize: 30, lineHeight: "36px" }}>Where shall we send your result?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 20 }}>
              <div className="field-wrap">
                <label className="lab" htmlFor="nm">Your name</label>
                <input id="nm" className="field" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="field-wrap">
                <label className="lab" htmlFor="ph">WhatsApp number</label>
                <div className="phone-row">
                  <span className="cc">+91</span>
                  <input id="ph" className="field" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national"
                    value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" />
                </div>
              </div>
              <p className="notice">
                We use your name, number and the answers above so a Lean Protocol expert can call you. We do not sell your data.
              </p>
              <label className="consent">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I am 18 or older, agree to be contacted, and accept the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms</a>.</span>
              </label>
              <label className="consent">
                <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                <span>Send me health tips and offers on WhatsApp. Optional.</span>
              </label>
              {error && <p className="err" role="alert">{error}</p>}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingTop: 16 }}>
              <p className="team-label">YOUR CARE TEAM</p>
              <div className="team">
                {TEAM.map((m) => (
                  <div className="team-m" key={m.name}>
                    <Image src={m.img} alt={m.name} fill sizes="150px" style={{ objectFit: "cover", objectPosition: "center 12%" }} />
                    <span className="team-veil" />
                    <div className="team-cap">
                      <b>{m.name}</b>
                      <i>{m.role}</i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cta-wrap" style={{ paddingTop: 18 }}>
              <button type="button" className="cta" disabled={!leadReady || busy} onClick={submitLead}>
                {busy ? "Saving..." : "See my result"}
              </button>
            </div>
          </div>
        )}

        {/* ---------------- offer ---------------- */}
        {step === S.OFFER && (
          <div className="step">
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 26 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#C8D9A7", color: "#193231", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5.5 5.5L20 7" /></svg>
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#C8D9A7" }}>Answers saved</span>
            </div>
            <h2 className="q" style={{ marginTop: 20, fontSize: 31, lineHeight: "37px", color: "#F9F7F2" }}>
              Want to know why your weight is stuck?
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 15.5, fontWeight: 300, lineHeight: 1.6, color: "#B9CBC0" }}>
              Book 20 minutes with a senior health coach and go through what is actually driving it.
            </p>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "18px 0" }}>
              <div className="offer-steps">
                {["Where your weight sits, and what is holding it there",
                  "What is realistic to expect, and how quickly",
                  "Whether a doctor consultation is worth your time"].map((t, i) => (
                  <div className="offer-step" key={i}>
                    <span className="offer-n">{i + 1}</span>
                    <span style={{ fontSize: 14.5, lineHeight: 1.5, color: "#D7E2DA" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={"timer-big" + (secsLeft === 0 ? " out" : "")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" />
              </svg>
              {secsLeft > 0 ? <>This price is held for <b>{mm}:{ss}</b></> : <>Your held price has run out</>}
            </div>
            <div className="price-box">
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".12em", color: "#8FA79A" }}>20-MINUTE CALL</div>
                <div style={{ marginTop: 5, display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="mrp">{RUPEE}{LIST_PRICE_INR}</span>
                  <span style={{ fontWeight: 800, fontSize: 34, letterSpacing: "-.02em", color: "#F9F7F2" }}>{RUPEE}{COACH_AMOUNT_INR}</span>
                </div>
              </div>
            </div>
            {error && <p className="err" style={{ color: "#F3B5AC" }} role="alert">{error}</p>}
            <div style={{ paddingTop: 14 }}>
              <button type="button" className="cta cta-sage" disabled={busy} onClick={payForCall}>
                {busy ? "Opening secure payment..." : `Book my call for ${RUPEE}${COACH_AMOUNT_INR}`}
              </button>
              <p className="fine" style={{ color: "#8FA79A" }}>A coaching call, not a medical consultation.</p>
            </div>
          </div>
        )}

        {/* ---------------- paid ---------------- */}
        {step === S.PAID && (
          <div className="step">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
              <div className="tick">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5.5 5.5L20 7" /></svg>
              </div>
              <h2 className="q" style={{ margin: 0, fontSize: 34, lineHeight: "40px", color: "#F9F7F2" }}>Your call is booked.</h2>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 300, lineHeight: 1.6, color: "#B9CBC0" }}>
                A senior health coach will call you on +91 {phone} to arrange a time that suits you.
              </p>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "#8FA79A" }}>
                Save our number so the call does not come up as unknown.
              </p>
            </div>
            <div>
              <a className="cta cta-sage" href="https://wa.me/919650491267">Message us on WhatsApp</a>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}