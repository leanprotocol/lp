"use client";

import { useEffect, useRef, useState } from "react";

/* Brides Edit — 5-step funnel (timeline → body → results → name/phone + spin → offer) + success.
   Self-contained: owns its state, pricing, BMI/eligibility, Razorpay payment and lead capture.
   Controlled by the landing page via `open` / `initialMonths`. */

function css(str: string): React.CSSProperties {
  const out: Record<string, string> = {};
  for (const decl of str.split(";")) {
    if (!decl.trim()) continue;
    const i = decl.indexOf(":");
    if (i < 0) continue;
    const key = decl.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = decl.slice(i + 1).trim();
  }
  return out as React.CSSProperties;
}

const RED = "#B5202C";

const CONSULT = {
  name: "Bridal Doctor Consultation",
  price: 449,
  blurb: "A private consult with our GLP-1 doctors, mapped to your wedding date and body.",
  feat: [
    "1:1 video consultation with a GLP-1 doctor",
    "Personalised eligibility & safety review",
    "Your bridal glow protocol & next steps",
    "Prescription guidance, if medically suitable",
  ],
};

const PROGRAM_POINTS = [
  "Doctor-led GLP-1 protocol mapped to your wedding date",
  "At-home advanced blood test & root-cause review",
  "Personalised bridal glow nutrition plan",
  "Weekly camera-ready check-ins",
  "Dedicated dietitian + 24×7 health coach",
];

const monthLabels: Record<number, string> = { 1: "1 month", 2: "2 months", 3: "3 months", 4: "4 months", 5: "5 months", 6: "6+ months" };
const inr = (n: number) => "₹" + Number(n).toLocaleString("en-IN");
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const makePromo = () => "BRIDE" + Math.random().toString(36).slice(2, 7).toUpperCase();

export default function BridesFunnel({ open, initialMonths, onClose }: { open: boolean; initialMonths: number | null; onClose: () => void; }) {
  const [step, setStep] = useState(1);
  const [months, setMonths] = useState<number | null>(null);
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(162);
  const [weight, setWeight] = useState(68);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [wheelDeg, setWheelDeg] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [promo, setPromo] = useState("");
  const leadSentRef = useRef(false);

  // (re)initialise each time the funnel is opened
  useEffect(() => {
    if (!open) return;
    setSuccess(false); setSpun(false); setSpinning(false); setWheelDeg(0);
    setPayError(null); setFormError(null); setPromo("");
    setAge(28); setHeight(162); setWeight(68); setName(""); setPhone("");
    leadSentRef.current = false;
    if (initialMonths) { setMonths(initialMonths); setStep(2); }
    else { setMonths(null); setStep(1); }
  }, [open, initialMonths]);

  // ---- derived values ----
  const bmiNum = weight / Math.pow(height / 100, 2);
  const bmi = bmiNum.toFixed(1);
  let bmiCat = "—";
  let elig = "";
  if (bmiNum < 18.5) { bmiCat = "underweight"; elig = "Your BMI is on the lighter side — our doctors will tailor a gentle glow & toning plan for you."; }
  else if (bmiNum < 23) { bmiCat = "healthy"; elig = "You're in a healthy range — a focused glow & sculpt plan will get you camera-ready."; }
  else if (bmiNum < 25) { bmiCat = "slightly high"; elig = "You're eligible for the doctor-led GLP-1 bridal protocol — ideal for visible, safe loss."; }
  else if (bmiNum < 30) { bmiCat = "overweight"; elig = "You're a strong fit for the doctor-led GLP-1 bridal protocol — expect visible loss by your date."; }
  else { bmiCat = "obese"; elig = "You're eligible for the full doctor-led GLP-1 bridal protocol with close medical supervision."; }

  const phoneDigits = phone.replace(/\D/g, "");
  const validPhone = /^[6-9]\d{9}$/.test(phoneDigits);
  const validForm = name.trim().length > 0 && validPhone;

  // ---- navigation ----
  const setMonthsNext = (m: number) => { setMonths(m); setStep(3); };
  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => { if (step <= 1) onClose(); else setStep((s) => s - 1); };

  const spin = () => {
    if (spinning || spun) return;
    if (!validForm) { setFormError("Please enter your name and a valid 10-digit mobile number."); return; }
    setFormError(null);
    const idx = Math.floor(Math.random() * 6);
    setSpinning(true);
    setWheelDeg(360 * 5 - (idx * 60 + 30));
    const code = makePromo();
    setTimeout(() => { setSpinning(false); setSpun(true); setPromo(code); }, 4400);
  };

  // ---- lead capture on reaching the offer step (now includes name + phone) ----
  useEffect(() => {
    if (open && step === 5 && !leadSentRef.current) {
      leadSentRef.current = true;
      fetch("/api/brides/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), phone: phoneDigits ? `+91${phoneDigits}` : "",
          months, age, height, weight,
          bmi: Number(bmiNum.toFixed(1)),
          product: "brides-consultation", promo, amount: CONSULT.price,
          source: "brides-funnel",
          page_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      }).catch(() => {});
    }
  }, [open, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Razorpay payment (prefilled with the name/phone from step 4) ----
  const buy = async () => {
    setPaying(true);
    setPayError(null);
    try {
      const createRes = await fetch("/api/brides/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "brides-consultation", name: name.trim(), phone: phoneDigits }),
      });
      const order = await createRes.json();
      if (!createRes.ok) throw new Error(order?.error || "Could not start payment. Please try again.");

      await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existing || (window as unknown as { Razorpay?: unknown }).Razorpay) { resolve(); return; }
        const sc = document.createElement("script");
        sc.src = "https://checkout.razorpay.com/v1/checkout.js";
        sc.async = true;
        sc.onload = () => resolve();
        sc.onerror = () => reject(new Error("Failed to load payment gateway"));
        document.body.appendChild(sc);
      });

      const RZP = (window as unknown as { Razorpay: new (o: unknown) => { open: () => void; on: (e: string, cb: (x: unknown) => void) => void } }).Razorpay;
      const rzp = new RZP({
        key: order.keyId,
        currency: order.currency,
        amount: Math.round(order.amount * 100),
        name: "Lean Protocol — Brides Edit",
        description: "Bridal Doctor Consultation",
        order_id: order.orderId,
        prefill: { name: name.trim(), contact: phoneDigits },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch("/api/brides/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                product: "brides-consultation", amount: CONSULT.price, promo, name: name.trim(), phone: phoneDigits,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData?.error || "Payment verification failed");
            setSuccess(true);
          } catch (err) {
            setPayError(err instanceof Error ? err.message : "Payment verification failed. Please contact support.");
          } finally { setPaying(false); }
        },
      } as unknown);
      (rzp as unknown as { on: (e: string, cb: (x: { error?: { description?: string } }) => void) => void }).on("payment.failed", (evt) => {
        setPayError(evt?.error?.description || "Payment failed. Please try again.");
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
      setPaying(false);
    }
  };

  if (!open) return null;

  const sStbtn = css("width:40px;height:40px;border-radius:50%;background:#FAF3E6;border:1px solid #ECE0C8;color:#B5202C;font-size:20px;cursor:pointer;line-height:1;flex:none");
  const inputStyle = css("width:100%;box-sizing:border-box;background:#fff;border:1.5px solid #ECE0C8;color:#2A2020;font-family:'Jost',sans-serif;font-size:15px;padding:13px;border-radius:4px;outline:none");
  const labelStyle = css("display:block;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#B5202C;margin-bottom:7px");
  const footerBtn = css("width:100%;border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:600;font-size:15px;letter-spacing:.06em;text-transform:uppercase;padding:16px;border-radius:4px;box-shadow:0 10px 24px -12px rgba(181,32,44,.5)");

  const Stepper = ({ label, value, set, min, max }: { label: string; value: number; set: (n: number) => void; min: number; max: number; }) => (
    <div style={css("display:flex;align-items:center;justify-content:space-between;padding:16px 0;border-bottom:1px solid #FFFDF9")}>
      <span style={css("font-size:14px;color:#2A2020")}>{label}</span>
      <span style={css("display:flex;align-items:center;gap:14px")}>
        <button onClick={() => set(clamp(value - 1, min, max))} style={sStbtn}>−</button>
        <b style={css("font-family:'Playfair Display',serif;font-size:23px;font-weight:600;color:#B5202C;min-width:54px;text-align:center")}>{value}</b>
        <button onClick={() => set(clamp(value + 1, min, max))} style={sStbtn}>+</button>
      </span>
    </div>
  );

  return (
    <div style={css("position:fixed;inset:0;z-index:200;background:#fff;display:flex;flex-direction:column;font-family:'Jost',sans-serif")}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Playfair+Display:wght@500;600&display=swap');`}</style>

      {success ? (
        <div style={css("flex:1;overflow-y:auto;padding:60px 28px;text-align:center")}>
          <div style={{ ...css("width:78px;height:78px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:38px;margin:0 auto 22px;color:#fff"), background: RED }}>✓</div>
          <h2 style={css("font-family:'Playfair Display',serif;font-weight:600;font-size:32px;margin:0 0 12px")}>You&rsquo;re booked!</h2>
          <p style={css("font-size:14px;color:#5F574F;line-height:1.6;font-weight:300;max-width:320px;margin:0 auto 24px")}>Your <strong style={css("color:#2A2020")}>Bridal Doctor Consultation</strong> is confirmed.{promo ? <> Your promo code <strong style={css("color:#B5202C")}>{promo}</strong> is saved to your booking.</> : null} Our team will reach out shortly to schedule your call.</p>
          <a href="https://wa.link/3s1upf" style={css("display:inline-block;background:#1FBF5B;color:#fff;text-decoration:none;font-family:'Jost',sans-serif;font-weight:600;font-size:14px;letter-spacing:.04em;text-transform:uppercase;padding:14px 26px;border-radius:4px")}>Message us on WhatsApp</a>
          <div style={css("margin-top:14px")}><a href="/" style={css("color:#B5202C;font-size:13px;text-decoration:none")}>← Back to home</a></div>
        </div>
      ) : (
        <>
          {/* funnel header */}
          <div style={css("flex-shrink:0;padding:16px 20px 14px;border-bottom:1px solid #FFFDF9;background:#fff")}>
            <div style={css("max-width:460px;margin:0 auto;width:100%")}>
            <div style={css("display:flex;align-items:center;justify-content:space-between;margin-bottom:12px")}>
              <button onClick={back} style={css("border:none;background:none;cursor:pointer;font-size:22px;color:#B5202C;line-height:1;padding:0;width:24px;text-align:left")}>‹</button>
              <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#2A2020;font-weight:500")}>Lean Protocol</div>
              <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.06em;color:#9A8F84")}>Step {step} of 5</div>
            </div>
            <div style={css("height:3px;background:#FDF6EA;border-radius:999px;overflow:hidden")}><div style={{ ...css("height:100%;background:#B5202C;transition:width .3s"), width: `${(step / 5) * 100}%` }} /></div>
            </div>
          </div>

          <div style={css("flex:1;overflow-y:auto")}>
            <div style={css("max-width:460px;margin:0 auto;width:100%")}>
            {/* STEP 1: months */}
            {step === 1 && (
              <div style={css("padding:34px 24px 40px")}>
                <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Your timeline</div>
                <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.1;margin:0 0 8px")}>How many months until your big day?</h2>
                <p style={css("font-size:13.5px;color:#7A6F66;font-weight:300;margin:0 0 26px")}>We&rsquo;ll map your protocol to peak exactly on time.</p>
                <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:12px")}>
                  {[1, 2, 3, 4, 5, 6].map((v) => {
                    const sel = months === v;
                    return <button key={v} onClick={() => setMonthsNext(v)} style={{ ...css("cursor:pointer;font-family:'Jost',sans-serif;font-size:15px;font-weight:500;padding:20px 4px;border-radius:4px;text-align:center"), background: sel ? RED : "#fff", color: sel ? "#fff" : RED, border: `1.5px solid ${sel ? RED : "#ECE0C8"}` }}>{monthLabels[v]}</button>;
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: body (steppers) */}
            {step === 2 && (
              <div style={css("padding:34px 24px 40px")}>
                <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>About you</div>
                <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.1;margin:0 0 8px")}>A few details to personalise it</h2>
                <p style={css("font-size:13.5px;color:#7A6F66;font-weight:300;margin:0 0 16px")}>Used only to estimate your BMI &amp; eligibility.</p>
                <div style={css("border-top:1px solid #FFFDF9")}>
                  <Stepper label="Age (years)" value={age} set={setAge} min={16} max={90} />
                  <Stepper label="Height (cm)" value={height} set={setHeight} min={130} max={210} />
                  <Stepper label="Weight (kg)" value={weight} set={setWeight} min={35} max={200} />
                </div>
              </div>
            )}

            {/* STEP 3: results (snapshot + program points, no recommended plan) */}
            {step === 3 && (
              <div style={css("padding:34px 24px 40px")}>
                <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Your results</div>
                <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.1;margin:0 0 24px")}>Here&rsquo;s your bridal snapshot</h2>
                <div style={css("display:flex;gap:12px;margin-bottom:14px")}>
                  <div style={css("flex:1;border:1px solid #FFFDF9;border-radius:4px;padding:18px;text-align:center")}><div style={css("font-family:'Playfair Display',serif;font-size:34px;font-weight:600;color:#B5202C;line-height:1")}>{bmi}</div><div style={css("font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#7A6F66;margin-top:8px")}>BMI · {bmiCat}</div></div>
                  <div style={css("flex:1;border:1px solid #FFFDF9;border-radius:4px;padding:18px;text-align:center")}><div style={css("font-family:'Playfair Display',serif;font-size:34px;font-weight:600;color:#B5202C;line-height:1")}>{months ? (months === 6 ? "6+" : String(months)) : "—"}</div><div style={css("font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#7A6F66;margin-top:8px")}>{months === 1 ? "month" : "months"} to the aisle</div></div>
                </div>
                <div style={css("background:#FAF3E6;border-radius:4px;padding:16px 18px;margin-bottom:22px;display:flex;gap:10px;align-items:flex-start")}>
                  <span style={css("color:#B5202C;font-size:15px;line-height:1.2")}>✓</span>
                  <div style={css("font-size:13px;color:#B5202C;line-height:1.5;font-weight:400")}>{elig}</div>
                </div>
                <div style={css("border:1px solid #FFFDF9;border-radius:4px;padding:22px 20px")}>
                  <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#C9A24B;margin-bottom:14px")}>Your program includes</div>
                  <ul style={css("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px")}>
                    {PROGRAM_POINTS.map((t) => <li key={t} style={css("display:flex;gap:10px;font-size:13.5px;color:#2A2020;line-height:1.45;font-weight:400")}><span style={css("color:#B5202C;font-weight:600")}>✓</span>{t}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 4: name/phone form + raised 3D wheel */}
            {step === 4 && (
              <div style={css("padding:34px 24px 44px;text-align:center")}>
                <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Your bridal bonus</div>
                <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.1;margin:0 0 8px")}>Spin to unlock free time</h2>
                <p style={css("font-size:13px;color:#7A6F66;font-weight:300;margin:0 0 24px")}>Enter your details, then spin for a bonus on top of your plan.</p>

                {/* short form */}
                <div style={css("text-align:left;display:grid;gap:14px;margin-bottom:32px")}>
                  <div>
                    <label style={labelStyle}>Full name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Mobile number</label>
                    <div style={css("display:flex;align-items:stretch")}>
                      <span style={css("display:flex;align-items:center;padding:0 12px;background:#FAF3E6;border:1.5px solid #ECE0C8;border-right:none;border-radius:4px 0 0 4px;font-size:15px;color:#B5202C")}>+91</span>
                      <input type="tel" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" style={{ ...inputStyle, borderRadius: "0 4px 4px 0" }} />
                    </div>
                  </div>
                  {formError && <div style={css("color:#B5202C;font-size:12px")}>{formError}</div>}
                </div>

                {/* raised / 3D wheel */}
                <div style={css("position:relative;width:248px;height:262px;margin:0 auto 8px")}>
                  <div style={css("position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:188px;height:22px;border-radius:50%;background:#B5202C;opacity:.16;box-shadow:0 0 22px 10px rgba(181,32,44,.16)")} />
                  <div style={css("position:absolute;top:-2px;left:50%;transform:translateX(-50%);z-index:5;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:20px solid #2A2020")} />
                  <div style={{ ...css("position:absolute;top:8px;left:0;width:248px;height:248px;border-radius:50%;border:7px solid #fff;background:conic-gradient(#B5202C 0 60deg,#FAF3E6 60deg 120deg,#B5202C 120deg 180deg,#FAF3E6 180deg 240deg,#B5202C 240deg 300deg,#FAF3E6 300deg 360deg);box-shadow:0 26px 55px -16px rgba(181,32,44,.6),0 0 0 3px #B5202C,inset 0 4px 10px rgba(255,255,255,.45),inset 0 -10px 22px rgba(140,20,32,.35)"), transform: `rotate(${wheelDeg}deg)`, transition: "transform 4.2s cubic-bezier(.16,.86,.28,1)" }}>
                    {(["PROMO", "GLOW", "GIFT", "BONUS", "VIP", "OFFER"] as const).map((lbl, i) => (
                      <span key={i} style={{ ...css("position:absolute;left:50%;top:50%;width:74px;font-family:'Jost',sans-serif;font-size:11px;font-weight:600;letter-spacing:.04em"), color: i % 2 === 0 ? "#fff" : RED, transform: `translate(-50%,-50%) rotate(${i * 60 + 30}deg) translateY(-78px)` }}>{lbl}</span>
                    ))}
                  </div>
                  <div style={css("position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:4;width:50px;height:50px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px #B5202C,0 6px 14px rgba(181,32,44,.4);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:21px;color:#B5202C")}>L</div>
                </div>

                {spun && (
                  <div style={css("margin-top:18px")}>
                    <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#C9A24B;margin-bottom:6px")}>Your promo code</div>
                    <div style={css("font-family:'Playfair Display',serif;font-size:30px;font-weight:600;color:#B5202C;letter-spacing:.02em")}>{promo}</div>
                    <div style={css("font-family:'Jost',sans-serif;font-size:11px;color:#7A6F66;font-weight:300;margin-top:4px")}>Saved to your bridal consultation</div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: bridal doctor consultation + Razorpay */}
            {step === 5 && (
              <div style={css("padding:34px 24px 40px")}>
                <div style={css("text-align:center;margin-bottom:24px")}>
                  <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Your bridal offer</div>
                  <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.1;margin:0")}>Book your consultation</h2>
                </div>
                <div style={css("border:1.5px solid #B5202C;border-radius:4px;overflow:hidden")}>
                  <div style={css("background:#B5202C;color:#fff;padding:18px 22px")}>
                    <div style={css("font-family:'Playfair Display',serif;font-size:24px;font-weight:600;line-height:1.1")}>{CONSULT.name}</div>
                    <div style={css("font-family:'Jost',sans-serif;font-size:11px;letter-spacing:.04em;color:#F3E6C8;margin-top:4px")}>Exclusively for brides · with our GLP-1 doctors</div>
                  </div>
                  <div style={css("padding:22px")}>
                    <div style={css("font-size:12.5px;color:#7A6F66;font-weight:300;margin-bottom:14px")}>{CONSULT.blurb}</div>
                    <div style={css("display:flex;align-items:baseline;gap:10px;margin-bottom:16px;flex-wrap:wrap")}>
                      <div style={css("font-family:'Playfair Display',serif;font-size:38px;font-weight:600;color:#B5202C")}>{inr(CONSULT.price)}</div>
                      <div style={css("font-family:'Jost',sans-serif;font-size:12px;color:#7A6F66;font-weight:300")}>one-time · fully redeemable against your plan</div>
                    </div>
                    {promo && (
                      <div style={css("display:flex;align-items:center;gap:8px;background:#FAF3E6;border:1px dashed #C9A24B;border-radius:4px;padding:10px 12px;margin-bottom:16px")}>
                        <span style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#7A6F66")}>Promo code</span>
                        <span style={css("font-family:'Playfair Display',serif;font-size:16px;font-weight:600;color:#B5202C;letter-spacing:.03em")}>{promo}</span>
                      </div>
                    )}
                    <ul style={css("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px")}>
                      {CONSULT.feat.map((f) => <li key={f} style={css("display:flex;gap:9px;font-size:12.5px;color:#5F574F;line-height:1.4;font-weight:300")}><span style={css("color:#B5202C;font-weight:600")}>✓</span>{f}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>

          {step !== 1 && (
            <div style={css("flex-shrink:0;border-top:1px solid #FFFDF9;background:#fff;padding:14px 20px")}>
              <div style={css("max-width:460px;margin:0 auto;width:100%")}>
                {step === 2 && <button onClick={next} style={footerBtn}>See my results →</button>}
                {step === 3 && <button onClick={next} style={footerBtn}>Spin for a promo code →</button>}
                {step === 4 && (!spun
                  ? <button onClick={spin} style={{ ...footerBtn, background: validForm ? RED : "#D8A9AE" }}>{spinning ? "Spinning…" : "Spin the wheel"}</button>
                  : <button onClick={next} style={footerBtn}>Book my consultation →</button>)}
                {step === 5 && (
                  <>
                    {payError && <p style={css("color:#B5202C;font-size:12px;margin:0 0 8px;text-align:center")}>{payError}</p>}
                    <button onClick={buy} disabled={paying} style={footerBtn}>{paying ? "Processing…" : `Pay ${inr(CONSULT.price)} & book`}</button>
                    <div style={css("font-family:'Jost',sans-serif;font-size:10px;color:#9A8F84;margin-top:8px;text-align:center;font-weight:300")}>Secure UPI / card · pick your slot after payment</div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
