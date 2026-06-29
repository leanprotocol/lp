"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lean Protocol — 30 Days Hard Challenge "unlock" funnel.
 * Standalone 7-step quiz funnel that replaces the old lead form.
 * Reached from every "Begin / Start the Challenge" button via /challenge/unlock.
 *
 * Self-contained styling (white + green) — does not depend on challenge.css,
 * and paints its own full-viewport background so it overrides the dark
 * challenge-page theme inherited from app/challenge/layout.tsx.
 */

const STEPS = 7;
const AVG_LOSS = 7;            // average kg lost (from internal data)

const C = {
  green: "#C9A24B",        // accent → gold
  dark: "#F4F0E6",         // primary text → cream
  muted: "#9CB0A5",        // muted text → sage
  page: "#0E1A15",         // page background
  surface: "#13211B",      // column background
  card: "#1A2D26",         // card background
  cta: "#C9A24B",
  ctaText: "#1a1208",
  ctaBorder: "#C9A24B",
  soft: "#22392F",         // back button / steppers / progress track
  border: "rgba(201,162,75,.22)",
  border2: "rgba(201,162,75,.44)",
  glow: "#37C871",
  warnBg: "rgba(201,162,75,.12)",
  warnText: "#E8CB85",
  badBg: "rgba(226,59,73,.14)",
  badText: "#E23B49",
};

const display = "'Oswald','Arial Narrow',sans-serif";

type Vals = { age: number; wt: number; ht: number };

export default function UnlockFunnel() {
  const [step, setStep] = useState(1);
  const [vals, setVals] = useState<Vals>({ age: 28, wt: 96, ht: 67 });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comorbid, setComorbid] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [secs, setSecs] = useState(300); // 5-minute offer countdown
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const bmi = vals.wt / Math.pow(vals.ht * 0.0254, 2);
  const bmiCat = bmi >= 30 ? "Obese" : bmi >= 25 ? "Overweight" : bmi < 18.5 ? "Underweight" : "Normal";
  const bmiPos = Math.max(4, Math.min(95, ((bmi - 15) / 25) * 100));
  const target = Math.round(vals.wt - AVG_LOSS);
  const eligible = bmi >= 30 || (bmi >= 27 && comorbid);

  const go = (d: number) => {
    const n = step + d;
    if (n < 1) {
      window.location.href = "/challenge";
      return;
    }
    if (n > STEPS) return;
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const adj = (k: keyof Vals, d: number) => {
    const min: Vals = { age: 16, wt: 40, ht: 48 };
    const max: Vals = { age: 90, wt: 200, ht: 84 };
    setVals((v) => ({ ...v, [k]: Math.max(min[k], Math.min(max[k], v[k] + d)) }));
  };

  const leadSentRef = useRef(false);

  const captureLead = async () => {
    if (leadSentRef.current) return; // fire once only
    leadSentRef.current = true;
    const digits = phone.replace(/\D/g, "");
    try {
      await fetch("/api/challenge/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: digits ? `+91${digits}` : "",
          age: vals.age,
          weight: vals.wt,
          height: Math.round(vals.ht * 2.54),
          bmi: Number(bmi.toFixed(1)),
          comorbidity: comorbid,
          source: "unlock-funnel",
          page_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
    } catch {
      // non-blocking: never block the user on lead capture
    }
  };

  // Capture the lead the moment the user reaches the final offer page (step 7)
  useEffect(() => {
    if (step === 7) captureLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // 5-minute offer countdown on the final page
  useEffect(() => {
    if (step !== 7) return;
    const id = setInterval(() => setSecs((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  const unlock = () => {
    const next: { name?: string; phone?: string } = {};
    if (!name.trim()) next.name = "Please enter your name";
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) next.phone = "Enter a valid 10-digit mobile number";
    setErrors(next);
    if (Object.keys(next).length) return;
    go(1);
  };

  const spin = () => {
    if (spinning || spun) return;
    setSpinning(true);
    setRotation(2070); // lands on the "Mystery" segment
    setTimeout(() => {
      setSpinning(false);
      setSpun(true);
      (window as any).lpConfetti?.(140);
    }, 4700);
  };

  const claim = async () => {
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || !/^[6-9]\d{9}$/.test(digits)) {
      // shouldn't happen (validated on step 5), but guard anyway
      setStep(5);
      setErrors({
        name: !name.trim() ? "Please enter your name" : undefined,
        phone: !/^[6-9]\d{9}$/.test(digits) ? "Enter a valid 10-digit mobile number" : undefined,
      });
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
          phone: digits,
          city: "",
          promoApplied: true,
        }),
      });
      const order = await createRes.json();
      if (!createRes.ok) throw new Error(order?.error || "Could not start payment. Please try again.");

      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existing || (window as any).Razorpay) { resolve(); return; }
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
        description: "30 + 15 Days FREE bonus",
        order_id: order.orderId,
        prefill: { name: name.trim(), contact: digits },
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
                phone: digits,
                city: "",
                promoApplied: true,
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
        theme: { color: "#1E8E5A" },
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
  };

  // chart geometry (day 1 -> day 30)
  const chart = (() => {
    const start = vals.wt;
    const end = vals.wt - AVG_LOSS;
    const n = 8;
    const W = 300;
    const H = 124;
    const pad = 16;
    const slot = (W - 2 * pad) / n;
    const bw = slot - 5;
    const maxW = start;
    const minW = end - 1.5;
    const bars: { x: number; y: number; h: number }[] = [];
    const pts: string[] = [];
    for (let i = 0; i < n; i++) {
      const fr = i / (n - 1);
      const w = start - (start - end) * (1 - Math.pow(1 - fr, 1.8));
      const x = pad + i * slot + 2;
      const h = ((w - minW) / (maxW - minW)) * (H - 34) + 8;
      const y = H - 14 - h;
      bars.push({ x, y, h });
      pts.push(`${(x + bw / 2).toFixed(1)},${y.toFixed(1)}`);
    }
    return { bars, pts: pts.join(" "), bw };
  })();

  // ---- shared style objects ----
  const sCta: React.CSSProperties = {
    width: "100%",
    marginTop: 22,
    background: C.green,
    color: "#1a1208",
    fontFamily: display,
    textTransform: "uppercase",
    letterSpacing: ".04em",
    fontSize: 16,
    fontWeight: 600,
    border: `1px solid ${C.green}`,
    borderRadius: 12,
    padding: 15,
    cursor: "pointer",
    boxShadow: "0 12px 26px rgba(201,162,75,.34), 0 3px 8px rgba(0,0,0,.2)",
    transition: "transform .16s ease, box-shadow .16s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };
  const sStep: React.CSSProperties = {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 24px rgba(20,64,46,.10), 0 2px 6px rgba(20,64,46,.06)",
    transition: "transform .18s ease, box-shadow .18s ease",
  };
  // stronger elevation for hero stat / forecast / BMI / price cards
  const sPop: React.CSSProperties = {
    ...{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 },
    boxShadow: "0 18px 40px rgba(20,64,46,.16), 0 6px 14px rgba(20,64,46,.10)",
    transition: "transform .18s ease, box-shadow .18s ease",
  };
  const sStbtn: React.CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: C.soft,
    border: `1px solid ${C.border2}`,
    color: C.green,
    fontSize: 20,
    cursor: "pointer",
    flex: "none",
    boxShadow: "0 4px 10px rgba(20,64,46,.14)",
  };
  const sEb: React.CSSProperties = {
    fontFamily: display,
    fontSize: 12,
    letterSpacing: ".18em",
    color: C.green,
    textTransform: "uppercase",
    textAlign: "center",
  };
  const sH2: React.CSSProperties = {
    fontFamily: display,
    fontSize: 31,
    lineHeight: 1.06,
    textTransform: "uppercase",
    textAlign: "center",
    margin: "8px 0 6px",
    color: C.dark,
  };
  const sSub: React.CSSProperties = { fontSize: 13, color: C.muted, textAlign: "center" };
  const big: React.CSSProperties = { fontFamily: display, textTransform: "uppercase", lineHeight: 1 };

  const Stepper = ({ k, w }: { k: keyof Vals; w: number }) => (
    <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button style={sStbtn} onClick={() => adj(k, -1)}>−</button>
      <b style={{ ...big, color: C.green, fontSize: 20, width: w, textAlign: "center" }}>{vals[k]}</b>
      <button style={sStbtn} onClick={() => adj(k, 1)}>+</button>
    </span>
  );

  const wheelSeg = (label: string, angle: number, bold = false) => (
    <span
      key={angle}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 74,
        textAlign: "center",
        fontFamily: display,
        fontSize: 11,
        color: (Math.round((angle - 30) / 60)) % 2 === 1 ? "#15241e" : "#F4F0E6",
        textShadow: (Math.round((angle - 30) / 60)) % 2 === 1 ? "none" : "0 1px 3px rgba(0,0,0,.5)",
        fontWeight: bold ? 600 : 400,
        transform: `translate(-50%,-50%) rotate(${angle}deg) translate(0,-78px) rotate(${-angle}deg)`,
      }}
    >
      {label}
    </span>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.page, padding: "0 0 40px", fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        .lpf-col button { transition: transform .16s ease, box-shadow .16s ease; }
        .lpf-col button:hover { transform: translateY(-2px); }
        .lpf-col button:active { transform: translateY(0) scale(.99); }
      `}</style>
      <div className="lpf-col" style={{ maxWidth: 440, margin: "0 auto", background: C.surface, minHeight: "100vh", color: C.dark, boxShadow: "0 0 70px rgba(20,64,46,.14)" }}>
        {success ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#E1F5EA", border: `2px solid ${C.glow}`, color: C.glow, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 14px 34px rgba(55,200,113,.32)" }}>✓</div>
            <h2 style={{ ...sH2, fontSize: 30 }}>You&apos;re in! 🎉</h2>
            <p style={{ fontSize: 14, color: C.muted, maxWidth: 320, margin: "10px auto 0", lineHeight: 1.6 }}>
              Your 30 Days Hard Challenge <b style={{ color: C.dark }}>+ 15 bonus days</b> are confirmed. Our medical team will reach out shortly to get you started.
            </p>
            <div style={{ ...sPop, marginTop: 24, textAlign: "left" }}>
              <p style={{ fontFamily: display, fontSize: 12, letterSpacing: ".06em", marginBottom: 12, color: C.green }}>WHAT HAPPENS NEXT</p>
              {[
                "Our doctor reviews your details",
                "You get a call within 24 hours",
                "Your at-home blood test is scheduled",
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", borderTop: i ? `1px solid ${C.border}` : "none", paddingTop: i ? 11 : 0, paddingBottom: i === 2 ? 0 : 11 }}>
                  <span style={{ color: C.green }}>●</span>
                  <span style={{ fontSize: 13 }}>{t}</span>
                </div>
              ))}
            </div>
            <a
              href="https://wa.link/3s1upf"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", marginTop: 18, background: "#1FBF5B", color: "#fff", fontFamily: display, textTransform: "uppercase", letterSpacing: ".04em", fontSize: 15, fontWeight: 600, border: "none", borderRadius: 12, padding: 14, textDecoration: "none", boxShadow: "0 10px 24px rgba(31,191,91,.4)" }}
            >
              💬 Message us on WhatsApp
            </a>
            <a
              href="/challenge"
              style={{ display: "block", marginTop: 12, color: C.green, fontSize: 13, textDecoration: "none" }}
            >
              ← Back to home
            </a>
          </div>
        ) : (
        <>
        {/* top nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
          <button
            onClick={() => go(-1)}
            aria-label="Back"
            style={{ width: 30, height: 30, borderRadius: "50%", background: C.soft, border: `1px solid ${C.border}`, color: C.green, cursor: "pointer" }}
          >
            ‹
          </button>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 16, letterSpacing: ".03em", color: C.dark }}>
            LEAN <span style={{ color: C.green }}>PROTOCOL</span>
          </span>
          <span style={{ fontSize: 11, color: C.muted }}>{step === STEPS ? "Almost done" : `Step ${step} of ${STEPS}`}</span>
        </div>
        <div style={{ height: 5, background: C.soft, borderRadius: 5, margin: "12px 20px 0", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#46A877,#37C871)", width: `${(step / STEPS) * 100}%`, transition: "width .3s", borderRadius: 5 }} />
        </div>

        <div style={{ padding: "18px 20px 24px" }}>
          {/* STEP 1 — hook */}
          {step === 1 && (
            <>
              <p style={{ ...sEb, marginTop: 16 }}>The 30-day average</p>
              <h2 style={sH2}>Find out how much <span style={{ color: C.dark }}>weight loss</span> to expect from this challenge</h2>
              <div style={{ ...sPop, marginTop: 16, textAlign: "center" }}>
                <div style={{ ...big, fontSize: 52, color: C.green }}>6&ndash;8 Kg</div>
                <p style={{ fontSize: 12, color: C.muted }}>average weight lost · based on our internal data</p>
              </div>
              <div style={{ marginTop: 14 }}>
                <img
                  src="/lp-assets/doctor-patient.png"
                  alt="Doctor consulting with a patient"
                  style={{ width: "100%", borderRadius: 16, display: "block", boxShadow: "0 14px 34px rgba(20,64,46,.16)" }}
                />
              </div>
              <div style={{ ...sStep, marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>💉</span>
                <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>
                  A plan led by <span style={{ color: C.green, fontWeight: 500 }}>GLP-1 meds, doctors, dietitians &amp; health coaches</span>
                </div>
              </div>
              <button style={sCta} onClick={() => go(1)}>Check eligibility →</button>
            </>
          )}

          {/* STEP 2 — about you */}
          {step === 2 && (
            <>
              <p style={{ ...sEb, marginTop: 18 }}>About you</p>
              <h2 style={sH2}>Check your <span style={{ color: C.dark }}>eligibility</span> for your goal</h2>
              <div style={{ ...sStep, marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 500 }}>Age</span>
                  <Stepper k="age" w={34} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <span style={{ fontWeight: 500 }}>Weight (kg)</span>
                  <Stepper k="wt" w={40} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                  <span style={{ fontWeight: 500 }}>Height</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button style={sStbtn} onClick={() => adj("ht", -1)}>−</button>
                    <b style={{ ...big, color: C.green, fontSize: 20, width: 52, textAlign: "center" }}>{Math.floor(vals.ht / 12)}&apos;{vals.ht % 12}&quot;</b>
                    <button style={sStbtn} onClick={() => adj("ht", 1)}>+</button>
                  </span>
                </div>
              </div>
              <button style={sCta} onClick={() => go(1)}>Show my results →</button>
            </>
          )}

          {/* STEP 3 — forecast */}
          {step === 3 && (
            <>
              <p style={{ ...sEb, marginTop: 18 }}>Your forecast</p>
              <div style={{ ...sPop, marginTop: 14, textAlign: "center" }}>
                <p style={{ fontSize: 11, letterSpacing: ".1em", color: C.muted, textTransform: "uppercase" }}>You could reach</p>
                <div style={{ ...big, fontSize: 52, color: C.green, margin: "4px 0" }}>{target} Kg</div>
                <span style={{ display: "inline-block", background: "#E1F5EA", color: C.green, fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 100 }}>
                  ~{AVG_LOSS} kg projected over 30 days
                </span>
              </div>
              <div style={{ ...sStep, marginTop: 14 }}>
                <p style={{ fontFamily: display, fontSize: 12, letterSpacing: ".06em", marginBottom: 8 }}>DAY 1 → DAY 30</p>
                <svg viewBox="0 0 300 124" style={{ width: "100%" }}>
                  {chart.bars.map((b, i) => (
                    <rect key={i} x={b.x} y={b.y} width={chart.bw} height={b.h} rx="3" fill="#C9E9D6" />
                  ))}
                  <polyline points={chart.pts} fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" />
                  <text x="16" y="122" fill={C.muted} fontSize="9">Day 1</text>
                  <text x="250" y="122" fill={C.muted} fontSize="9">Day 30</text>
                </svg>
              </div>
              <p style={{ ...sSub, marginTop: 12 }}>A science-backed plan to reach your goal and sustain it. Individual results vary.</p>
              <button style={sCta} onClick={() => go(1)}>Continue →</button>
            </>
          )}

          {/* STEP 4 — BMI + eligibility */}
          {step === 4 && (
            <>
              <p style={{ ...sEb, marginTop: 18 }}>Your BMI &amp; eligibility</p>
              <div style={{ ...sPop, marginTop: 14, textAlign: "center" }}>
                <p style={{ fontSize: 11, letterSpacing: ".1em", color: C.muted, textTransform: "uppercase" }}>Your BMI is</p>
                <div style={{ ...big, fontSize: 52, color: C.green }}>{bmi.toFixed(1)}</div>
                <span style={{ display: "inline-block", background: C.badBg, color: C.badText, fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 100 }}>
                  ⚠ {bmiCat}
                </span>
              </div>
              <div style={{ ...sStep, marginTop: 12 }}>
                <div style={{ position: "relative", height: 10, borderRadius: 5, background: "linear-gradient(90deg,#378ADD,#37C871,#C9A24B,#EF9F27,#E23B49)", marginBottom: 16 }}>
                  <div style={{ position: "absolute", top: -6, left: `${bmiPos}%`, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `9px solid ${C.dark}` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.muted }}>
                  <span>Under</span><span>Normal</span><span>Over</span><span>Obese</span><span>Extreme</span>
                </div>
              </div>
              <div style={{ ...sStep, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>
                  I have a health condition
                  <br />
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>diabetes, BP, PCOS, etc.</span>
                </span>
                <div
                  onClick={() => setComorbid((v) => !v)}
                  style={{ position: "relative", width: 46, height: 26, borderRadius: 100, background: comorbid ? C.green : "#D5E5DC", transition: "background .2s", cursor: "pointer", flex: "none" }}
                >
                  <span style={{ position: "absolute", top: 3, left: comorbid ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: C.page, transition: "left .2s" }} />
                </div>
              </div>
              <div style={{ ...sStep, marginTop: 12, textAlign: "center", background: eligible ? "#E1F5EA" : C.warnBg, borderColor: eligible ? C.border2 : "#BA751744" }}>
                <span style={{ ...big, fontSize: 16, color: eligible ? C.green : C.warnText }}>
                  {eligible ? "✓ You may be eligible" : "Let’s check with a doctor"}
                </span>
                <p style={{ fontSize: 12, color: eligible ? C.dark : C.warnText, marginTop: 4 }}>
                  {eligible
                    ? "Our doctor will confirm during your consultation."
                    : "You may still benefit — our doctor can advise on the right plan."}
                </p>
              </div>
              <button style={sCta} onClick={() => go(1)}>Start my weight loss →</button>
            </>
          )}

          {/* STEP 5 — register */}
          {step === 5 && (
            <>
              <p style={{ ...sEb, marginTop: 18 }}>Register</p>
              <h2 style={sH2}>Unlock your <span style={{ color: C.dark }}>personalised plan</span></h2>
              <p style={sSub}>Takes 10 seconds, no card needed</p>
              <div style={{ marginTop: 18 }}>
                <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: ".05em" }}>Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  style={{ width: "100%", marginTop: 6, background: C.page, border: `1px solid ${errors.name ? C.badText : C.border2}`, color: C.dark, borderRadius: 10, padding: 12, fontFamily: "'Inter'" }}
                />
                {errors.name && <div style={{ fontSize: 11, color: C.badText, marginTop: 4 }}>{errors.name}</div>}
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: ".05em" }}>Phone number</label>
                <div style={{ display: "flex", marginTop: 6 }}>
                  <span style={{ background: C.soft, border: `1px solid ${C.border2}`, borderRight: "none", borderRadius: "10px 0 0 10px", padding: 12, color: C.green }}>+91</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile"
                    style={{ flex: 1, background: C.page, border: `1px solid ${errors.phone ? C.badText : C.border2}`, color: C.dark, borderRadius: "0 10px 10px 0", padding: 12, fontFamily: "'Inter'" }}
                  />
                </div>
                {errors.phone && <div style={{ fontSize: 11, color: C.badText, marginTop: 4 }}>{errors.phone}</div>}
              </div>
              <div style={{ ...sStep, marginTop: 16, textAlign: "center", opacity: name.trim() ? 1 : 0.4 }}>
                <span style={{ display: "inline-block", background: "#E1F5EA", color: C.green, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>✓ You qualify</span>
                <p style={{ ...big, fontSize: 20, color: C.green, marginTop: 8 }}>Good news!</p>
                <p style={{ fontSize: 13, color: C.dark, marginTop: 4 }}>You qualify for the challenge plus an exclusive joining offer.</p>
              </div>
              <button style={sCta} onClick={unlock}>Unlock my plan →</button>
            </>
          )}

          {/* STEP 6 — spin */}
          {step === 6 && (
            <>
              <p style={{ ...sEb, marginTop: 18 }}>One last thing</p>
              <h2 style={sH2}>Spin to <span style={{ color: C.dark }}>unlock</span> your offer</h2>
              <p style={sSub}>Everybody wins something</p>
              <div style={{ position: "relative", width: 230, height: 230, margin: "20px auto 0" }}>
                <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: "20px solid #C0392B", zIndex: 4 }} />
                <div
                  style={{
                    width: 230,
                    height: 230,
                    borderRadius: "50%",
                    border: `7px solid ${C.green}`,
                    boxShadow: `0 0 0 4px ${C.soft}`,
                    transition: "transform 4.6s cubic-bezier(.12,.85,.25,1)",
                    transform: `rotate(${rotation}deg)`,
                    position: "relative",
                    overflow: "hidden",
                    background: "conic-gradient(#22392F 0 60deg,#C9A24B 60deg 120deg,#22392F 120deg 180deg,#C9A24B 180deg 240deg,#22392F 240deg 300deg,#C9A24B 300deg 360deg)",
                  }}
                >
                  {wheelSeg("Free Consult", 30)}
                  {wheelSeg("Mystery", 90, true)}
                  {wheelSeg("90% OFF", 150)}
                  {wheelSeg("1 Month Free", 210)}
                  {wheelSeg("1+1 Month", 270)}
                  {wheelSeg("Free Plan", 330)}
                </div>
                <div style={{ position: "absolute", left: "50%", top: "50%", width: 48, height: 48, margin: -24, borderRadius: "50%", background: C.green, color: "#fff", border: "3px solid #fff", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 12 }}>
                  SPIN
                </div>
              </div>
              {spun && (
                <div style={{ textAlign: "center", marginTop: 14 }}>
                  <span style={{ ...big, fontSize: 20, color: C.green }}>🎁 Mystery box: +15 days FREE!</span>
                </div>
              )}
              {!spun ? (
                <button style={sCta} onClick={spin} disabled={spinning}>{spinning ? "Spinning…" : "Spin the wheel"}</button>
              ) : (
                <button style={sCta} onClick={() => go(1)}>Continue to offer →</button>
              )}
            </>
          )}

          {/* STEP 7 — offer (roadmap + includes) */}
          {step === 7 && (
            <>
              <p style={{ ...sEb, marginTop: 18, fontSize: 18 }}>Your roadmap</p>
              <div style={{ ...sStep, marginTop: 12 }}>
                <p style={{ fontFamily: display, fontSize: 15, marginBottom: 14 }}>YOUR 30-DAY JOURNEY</p>
                {[
                  "1 · Doctor consultation",
                  "2 · Root cause analysis",
                  "3 · GLP-1 dietitian consultation",
                  "4 · GLP-1 medications (cold-chain delivered)",
                  "5 · Your weight-loss goal achieved",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 11, alignItems: "center", borderTop: i ? `1px solid ${C.border}` : "none", paddingTop: i ? 13 : 0, marginTop: i ? 0 : 0, paddingBottom: i === 4 ? 0 : 13 }}>
                    <span style={{ color: i === 4 ? C.glow : C.green, fontSize: 18 }}>{i === 4 ? "✓" : "●"}</span>
                    <span style={{ fontSize: 13 }}>{t}</span>
                  </div>
                ))}
              </div>

              <img
  src="/challenge/plan-poster.png"
  alt="30 Days Hard Challenge plan"
  style={{ width: "100%", borderRadius: 16, display: "block", margin: "10px 0", boxShadow: "0 14px 34px rgba(0,0,0,.3)" }}
/>
              <div style={{ ...sStep, marginTop: 10 }}>
                {[
                  ["GLP-1 medications", "₹3000"],
                  ["Doctor consultation", "₹1500"],
                  ["Dietitian consultation (₹1000×3)", "₹3000"],
                  ["24×7 health coach", "₹2000"],
                ].map(([l, p], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderTop: i ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ fontSize: 13 }}>{l}</span>
                    <b style={{ color: C.green }}>{p}</b>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0 2px", borderTop: `1px solid ${C.border2}` }}>
                  <span style={{ fontSize: 12, color: C.muted, textTransform: "uppercase" }}>Total value</span>
                  <b style={{ color: C.muted, textDecoration: "line-through" }}>₹9500</b>
                </div>
              </div>

              <div style={{ ...sPop, marginTop: 12, textAlign: "center", borderColor: C.green, background: C.soft }}>
                <div style={{ ...big, fontSize: 42, color: C.dark }}>
                  ₹3999 <span style={{ fontSize: 16, color: C.muted, textDecoration: "line-through" }}>₹9500</span>
                </div>
                <span style={{ display: "inline-block", background: C.green, color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, marginTop: 6 }}>
                  🎁 Promo applied: 30 + 15 days
                </span>
                <div style={{ marginTop: 12, background: C.page, border: `1px solid ${C.border2}`, borderRadius: 10, padding: "8px 10px", fontFamily: display }}>
                  <span style={{ color: C.badText, fontSize: 12, letterSpacing: ".04em" }}>⏱ OFFER ENDS IN </span>
                  <span style={{ color: secs === 0 ? C.badText : C.dark, fontSize: 20, fontWeight: 600 }}>{mmss}</span>
                </div>
              </div>
              <p style={{ ...sSub, marginTop: 10 }}>🔒 Secure checkout · money-back guarantee</p>
              {payError && (
                <p style={{ color: C.badText, fontSize: 13, marginTop: 10, textAlign: "center" }}>{payError}</p>
              )}
              <button style={sCta} onClick={claim} disabled={paying}>
                {paying ? "Processing…" : "Claim my offer & pay ₹3999 →"}
              </button>
            </>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
