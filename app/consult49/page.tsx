"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/* ─── Data ─────────────────────────────────────────────────────── */
const DOCTORS = [
  { initials: "NJ", name: "Dr. Nishant Jain", role: "MD, DM · Endocrinologist", hosp: "Kailash Deepak Hospital", img: "https://www.leanprotocol.in/lp-assets/experts/nishant.jpeg" },
  { initials: "AK", name: "Dr. Akhil Konduru", role: "MD · Internal Medicine", hosp: "Medanta (former)", img: "https://www.leanprotocol.in/lp-assets/experts/akhil.jpeg" },
  { initials: "SG", name: "Dr. Siddharth Garg", role: "MD · Internal Medicine", hosp: "Yashoda Hospital", img: "https://www.leanprotocol.in/lp-assets/experts/siddharth.jpeg" },
];

const EXPERTS = [
  { initials: "NJ", name: "Dr. Nishant Jain", title: "MD, DM Endocrinology", img: "https://www.leanprotocol.in/lp-assets/experts/nishant.jpeg" },
  { initials: "GK", name: "Dr. Gautam Kumar", title: "MD, DM Endocrinology", img: "https://www.leanprotocol.in/lp-assets/experts/gautam.jpeg" },
  { initials: "AK", name: "Dr. Akhil Konduru", title: "MD, Internal Medicine", img: "https://www.leanprotocol.in/lp-assets/experts/akhil.jpeg" },
  { initials: "SG", name: "Dr. Siddharth Garg", title: "MD, Internal Medicine", img: "https://www.leanprotocol.in/lp-assets/experts/siddharth.jpeg" },
  { initials: "AG", name: "Alisha Gupta", title: "GLP-1 Expert Dietitian", img: "https://www.leanprotocol.in/lp-assets/experts/alisha.jpeg" },
  { initials: "SK", name: "Simran Kumawat", title: "Weight Loss Dietitian", img: "https://www.leanprotocol.in/lp-assets/experts/simran.jpeg" },
  { initials: "RS", name: "Richa Sharma", title: "Senior Dietitian", img: "https://www.leanprotocol.in/lp-assets/experts/richa-sharma.jpeg" },
  { initials: "AT", name: "Aparna Tandon", title: "Weight Loss Expert", img: "https://www.leanprotocol.in/lp-assets/experts/aparna.jpeg" },
  { initials: "RS2", name: "Richa Singh", title: "Yoga & Fat Loss", img: "https://www.leanprotocol.in/lp-assets/experts/richa-singh.jpeg" },
  { initials: "AB", name: "Alka Bharti", title: "GLP-1 Dietitian", img: "https://www.leanprotocol.in/lp-assets/experts/alka.jpeg" },
];

const TESTIMONIALS = [
  { initial: "P", name: "Pratima", age: "37 yrs", quote: "I finally found a program that understood my body.", result: "−7 kg", when: "in 2.5 months", type: "image" as const, src: "/before-after/Pratima, 37 Lost 7Kgs in 2.5 months.jpeg" },
  { initial: "M", name: "Manav", age: "24 yrs", quote: "The food noise went quiet. My doctor adjusted my plan every week.", result: "−20 kg", when: "in 5 months", type: "video" as const, src: "/before-after/manav.mp4" },
  { initial: "U", name: "Uday", age: "", quote: "Structured, doctor-led, and genuinely effective.", result: "Transformation", when: "journey", type: "video" as const, src: "/before-after/uday.mp4" },
  { initial: "A", name: "Ayushi", age: "22 yrs", quote: "First plan with actual science behind it. The check-ins kept me going.", result: "−15 kg", when: "in 6 months", type: "video" as const, src: "/before-after/ayushi.mp4" },
  { initial: "A", name: "Ananya", age: "20 yrs", quote: "The at-home blood test found what years of dieting missed.", result: "−14 kg", when: "in 7 months", type: "video" as const, src: "/before-after/ananya.mp4" },
  { initial: "A", name: "Aditya", age: "", quote: "Doorstep delivery and constant support made this easy.", result: "Transformation", when: "journey", type: "video" as const, src: "/before-after/Aditya .mp4" },
  { initial: "R", name: "Roshni", age: "23 yrs", quote: "Doctor-led made all the difference.", result: "−15 kg", when: "in 6 months", type: "video" as const, src: "/before-after/roshni.mp4" },
  { initial: "R", name: "Rohit", age: "39 yrs", quote: "Labs, doctor, dietitian, delivery — everything in one place.", result: "−9.1 kg", when: "in 15 weeks", type: "image" as const, src: "/before-after/Rohit, 39 Lost 9.1 kg in 15 weeks.png" },
  { initial: "A", name: "Atreyee", age: "28 yrs", quote: "The constant motivation made all the difference.", result: "−6 kg", when: "in 1 month", type: "video" as const, src: "/before-after/atreyee.mp4" },
];

const REVIEW_IMAGES = [
  "/challenge/reviews/review-reema-updated.png",
  "/challenge/reviews/review-vishwas.png",
  "/challenge/reviews/review-ujjawal.png",
  "/challenge/reviews/review-4-atharva.png",
  "/challenge/reviews/review-5-shrestha-gupta.png",
  "/challenge/reviews/review-6-shashi-bala.png",
  "/challenge/reviews/review-7-reema-tikadar.png",
];

const PRESS_LOGOS = [
  { className: "zee", href: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html", content: (<><span className="box">ZEE</span><span className="t">NEWS</span></>) },
  { className: "n24", href: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/", content: (<span className="t">NEWS<b>24</b></span>) },
  { className: "ntoday", href: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html", content: (<span className="t">News Today<b> 24x7</b></span>) },
  { className: "startup", href: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/", content: (<span className="t">The <b>Startup</b> Story</span>) },
  { className: "tribune", href: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/", content: (<span className="t">The Tribune</span>) },
  { className: "republic", href: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html", content: (<span className="t">The <b>Republic</b> News</span>) },
];

/* ─── Doctor Carousel ──────────────────────────────────────────── */
function DoctorCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = DOCTORS.length;

  const go = (i: number) => {
    setActive(((i % n) + n) % n);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(a => (a + 1) % n), 3800);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(a => (a + 1) % n), 3800);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [n]);

  function cardStyle(i: number): React.CSSProperties {
    const raw = ((i - active) % n + n) % n;
    const d = raw > n / 2 ? raw - n : raw;
    if (d === 0) return { transform: "translateX(0) translateZ(0) rotateY(0deg) scale(1)", opacity: 1, zIndex: 5 };
    if (d === 1) return { transform: "translateX(145px) translateZ(-180px) rotateY(-30deg) scale(.84)", opacity: 0.5, zIndex: 3 };
    if (d === -1) return { transform: "translateX(-145px) translateZ(-180px) rotateY(30deg) scale(.84)", opacity: 0.5, zIndex: 3 };
    return { transform: "translateX(0) translateZ(-380px) scale(.5)", opacity: 0, zIndex: 1 };
  }

  return (
    <>
      <div className="doc-carousel">
        <div className="dc-track" style={{ transformStyle: "preserve-3d" }}>
          {DOCTORS.map((doc, i) => (
            <div key={i} className={`dc-card ${i === active ? "active-card" : ""}`} style={cardStyle(i)} onClick={() => go(i)}>
              <div className="ph" style={{ position: "relative" }}>
                <img src={doc.img} alt={doc.name} loading="lazy" onError={(e) => { (e.target as HTMLElement).parentElement!.textContent = doc.initials; }} />
                <svg style={{ position: "absolute", bottom: "4px", right: "4px", width: "48px", height: "48px", pointerEvents: "none" }} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="46" fill="none" stroke="#15603F" strokeWidth="5" strokeDasharray="4 2" /><circle cx="50" cy="50" r="38" fill="none" stroke="#15603F" strokeWidth="2" /><rect x="12" y="38" width="76" height="24" rx="4" fill="#15603F" transform="rotate(-15 50 50)" /><text x="50" y="55" textAnchor="middle" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18" fill="#fff" letterSpacing="2" transform="rotate(-15 50 50)">VERIFIED</text></svg>
              </div>
              <div className="info">
                <b>{doc.name}</b>
                <div className="role">{doc.role}</div>
                <div className="hosp">{doc.hosp}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="dc-arrow prev" onClick={() => go(active - 1)} aria-label="Previous">‹</button>
        <button className="dc-arrow next" onClick={() => go(active + 1)} aria-label="Next">›</button>
      </div>
      <div className="dc-dots">
        {DOCTORS.map((_, i) => (
          <button key={i} className={`dc-dot ${i === active ? "on" : ""}`} onClick={() => go(i)} aria-label={`Doctor ${i + 1}`} />
        ))}
      </div>

    </>
  );
}

/* ─── BMI Calculator ───────────────────────────────────────────── */
function BMICalculator({ onOpenModal }: { onOpenModal: (name?: string, phone?: string, bmi?: string) => void }) {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(82);
  const [hasCondition, setHasCondition] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [phoneErr, setPhoneErr] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checkoutHref, setCheckoutHref] = useState("/consult49/checkout");

  const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
  const bmiCategory = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";
  const bmiEligible = hasCondition ? bmi >= 27 : bmi >= 30;

  function bmiColor() {
    if (bmi < 18.5) return "#3E8FD0";
    if (bmi < 25) return "#15603F";
    if (bmi < 30) return "#E8973A";
    return "#E2574B";
  }

  function needleDeg() { return Math.max(0, Math.min(1, (bmi - 12) / 30)) * 180 - 90; }

  const handleCheck = () => {
    setEligible(bmiEligible);
    setShowResult(true);
    if (bmiEligible) (window as any).lpConfetti?.();
  };

  const handleBMILead = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = formPhone.replace(/\D/g, "");
    const nOk = formName.trim().length > 0;
    const pOk = /^[6-9]\d{9}$/.test(phoneDigits);
    setNameErr(!nOk); setPhoneErr(!pOk);
    if (!nOk || !pOk) return;
    if (!consent) { alert("Please agree to be contacted."); return; }
    try {
      await fetch("/api/consult49/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), phone: `+91${phoneDigits}`, bmi: bmi.toFixed(1), bmi_category: bmiCategory, has_comorbidities: hasCondition, eligible: bmiEligible, source: "bmi-calculator", page_url: window.location.href, referrer: document.referrer }),
      });
    } catch {}
    setCheckoutHref(`/consult49/checkout?bmi=${bmi.toFixed(1)}&name=${encodeURIComponent(formName.trim())}&phone=${encodeURIComponent(phoneDigits)}`);
    setSubmitted(true);
    (window as any).lpConfetti?.(160);
  };

  function polar(cx: number, cy: number, r: number, deg: number) { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) { const s = polar(cx, cy, r, a0), e = polar(cx, cy, r, a1); const large = Math.abs(a1 - a0) > 180 ? 1 : 0; return `M${s[0].toFixed(1)} ${s[1].toFixed(1)} A${r} ${r} 0 ${large} 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`; }
  function deg(b: number) { return Math.max(0, Math.min(1, (b - 12) / 30)) * 180 - 90; }
  const segs: [string, number, number][] = [["#3E8FD0", -90, deg(18.5)], ["#15603F", deg(18.5), deg(25)], ["#E8973A", deg(25), deg(30)], ["#E2574B", deg(30), 90]];

  return (
    <section id="bmi" style={{ padding: "26px 0 48px" }}>
      <div className="wrap">
        <div className="sec-head"><div className="divider"></div><h2>Check your BMI &amp; Eligibility</h2><p>Check your qualification for the GLP-1 Fat Loss Protocol.</p></div>
        <div className="bmi-card">
          <div className="bmi-top">
            <div>
              <div className="bmi-field"><label>Height <b>{height} cm</b></label><input type="range" className="bmi-slider" min={130} max={210} value={height} onChange={e => setHeight(Number(e.target.value))} /></div>
              <div className="bmi-field"><label>Weight <b>{weight} kg</b></label><input type="range" className="bmi-slider" min={40} max={160} value={weight} onChange={e => setWeight(Number(e.target.value))} /></div>
              <label className="cond-toggle">
                <input type="checkbox" checked={hasCondition} onChange={e => setHasCondition(e.target.checked)} />
                <span className="cond-sw"></span>
                <span className="cond-label">If you have conditions like PCOS, Thyroid, Hypertension or Diabetes?</span>
              </label>
              <button className="btn btn-primary" style={{ width: "100%", fontSize: "17px" }} onClick={handleCheck}>Check my eligibility <span className="arrow">›</span></button>
            </div>
            <div className="gauge-wrap">
              <svg viewBox="0 0 300 185" style={{ width: "100%", maxWidth: "300px", margin: "0 auto", display: "block" }} aria-hidden="true">
                {segs.map(([color, a0, a1], i) => (<path key={i} d={arcPath(150, 150, 120, a0, a1)} stroke={color} strokeWidth={20} fill="none" strokeLinecap="butt" />))}
                <g transform={`rotate(${needleDeg()} 150 150)`}>
                  <line x1="150" y1="150" x2="150" y2="48" stroke="#1A2620" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="150" cy="150" r="9" fill="#1A2620" />
                </g>
              </svg>
              <div className="bmi-num">{bmi.toFixed(1)}</div>
              <div className="bmi-cat" style={{ color: bmiColor() }}>{bmiCategory}</div>
            </div>
          </div>
          {showResult && (
            <div className="bmi-result show">
              <div className={`elig ${eligible ? "yes" : "no"}`}>{eligible ? "🎉 You are eligible for the GLP-1 / Mounjaro plan" : "😔 Based on your BMI, you are not eligible yet"}</div>
              {eligible && (<div className="glp-box show"><h4>You&apos;re eligible for the GLP-1 / Mounjaro plan 🎯</h4><p>A doctor-supervised path shown to deliver up to ~22% body-weight loss. Your ₹49 consultation is the first step.</p></div>)}
              <details className="faq-dropdown" id="dropdown" open={eligible}><summary>What Your BMI Means?</summary><div className="para">BMI above 27 with comorbidities, or above 30 without, makes you eligible for GLP-1 / Mounjaro plans (barring rare cases), with minimal side effects.</div></details>
              {!submitted ? (
                <div className="lead-mini">
                  <h4>Get your personalised report</h4>
                  <div className="sub">Enter your details — our team shares your report &amp; books your ₹49 consultation.</div>
                  <form onSubmit={handleBMILead} noValidate>
                    <div className={`bmi-field2 ${nameErr ? "err" : ""}`}><label>Full name</label><input type="text" placeholder="Your name" autoComplete="name" value={formName} onChange={e => { setFormName(e.target.value); setNameErr(false); }} /></div>
                    <div className={`bmi-field2 ${phoneErr ? "err" : ""}`}><label>Phone (WhatsApp)</label><div className="phone-wrap"><span className="cc">+91</span><input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" autoComplete="tel-national" value={formPhone} onChange={e => { setFormPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setPhoneErr(false); }} /></div></div>
                    <label className="bmi-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /><span>I agree to be contacted by Lean Protocol and accept the <a href="https://www.leanprotocol.in/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span></label>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Get my report &amp; book ₹49 consult <span className="arrow">›</span></button>
                  </form>
                </div>
              ) : (
                <div className="lead-mini"><div className="lead-done show"><div className="check-ic">✓</div><h4>You&apos;re all set!</h4><p style={{ color: "var(--sage)", fontSize: "14px", margin: "6px 0 14px" }}>Continue to confirm your ₹49 consultation.</p><button className="btn btn-primary zoom" style={{ width: "100%" }} onClick={() => onOpenModal(formName, formPhone, bmi.toFixed(1))}>Continue to ₹49 checkout →</button></div></div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Scroll reveal + Confetti ─────────────────────────────────── */
function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll(".consult49-page .reveal");
    if (!("IntersectionObserver" in window)) { elements.forEach(el => el.classList.add("in")); return; }
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); } }); }, { threshold: 0.12 });
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    function tick() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.rot += p.vr; p.life--; if (p.life <= 0 || p.y > canvas!.height + 40) { parts.splice(i, 1); continue; } ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore(); }
      if (parts.length > 0) rafRef.current = requestAnimationFrame(tick); else rafRef.current = null;
    }
    (window as any).lpConfetti = (n?: number) => {
      const colors = ["#C9A24B", "#15603F", "#E8CB85", "#E2574B", "#1A2620"];
      for (let i = 0; i < (n || 120); i++) particlesRef.current.push({ x: window.innerWidth / 2 + (Math.random() - 0.5) * 220, y: window.innerHeight / 3, vx: (Math.random() - 0.5) * 9, vy: Math.random() * -9 - 3, s: 6 + Math.random() * 7, c: colors[~~(Math.random() * colors.length)], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 120 });
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    return () => { window.removeEventListener("resize", resize); if (rafRef.current) cancelAnimationFrame(rafRef.current); delete (window as any).lpConfetti; };
  }, []);
  return <canvas ref={canvasRef} className="confetti-canvas" />;
}

function ViewingCounter({ extra = 0 }: { extra?: number }) {
  
  return (<div className="viewing"><span className="dot"></span> <b>{Math.min(60 + extra, 120)}</b>&nbsp;people booked a consultation today</div>);
}


/* ─── Joiner Toast ─────────────────────────────────────────────── */
const JOINERS: [string, string][] = [
  ["Priya", "Delhi"], ["Arjun", "Mumbai"], ["Sneha", "Bengaluru"],
  ["Rohit", "Pune"], ["Ananya", "Hyderabad"], ["Kabir", "Jaipur"],
  ["Meera", "Kolkata"], ["Vikram", "Chennai"], ["Neha", "Lucknow"],
  ["Aditya", "Surat"],
];
const JOINER_ACTIONS = ["booked a ₹49 consultation", "joined the program", "checked their BMI eligibility", "requested a callback"];

function JoinerToast({ onJoin }: { onJoin: () => void }) {
  const [toast, setToast] = useState<{ name: string; city: string; action: string } | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function fire() {
      const [name, city] = JOINERS[Math.floor(Math.random() * JOINERS.length)];
      const action = JOINER_ACTIONS[Math.floor(Math.random() * JOINER_ACTIONS.length)];
      setToast({ name, city, action });
      setShow(true);
      onJoin();
      setTimeout(() => setShow(false), 5000);
    }
    const initial = setTimeout(() => {
      fire();
      const interval = setInterval(fire, Math.random() * 17000 + 7000);
      return () => clearInterval(interval);
    }, 6000);
    return () => clearTimeout(initial);
  }, [onJoin]);

  if (!toast) return null;
  return (
    <div className={`joiner ${show ? "show" : ""}`}>
      <b>{toast.name}</b> from {toast.city} just {toast.action}
      <small>a few minutes ago</small>
    </div>
  );
}

/* ─── Roll-up stats counter ────────────────────────────────────── */
function RollupStats() {
  const [vals, setVals] = useState([0, 0, 0, 0]);
  const targets = [22, 10000, 4.8, 99];
  const suffixes = ["%", "+", "★", "+"];
  const labels = ["avg body-weight loss*", "transformations", "rated by members", "countries approved"];
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1800;
        const steps = 60;
        const interval = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = Math.min(step / steps, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setVals(targets.map(t => parseFloat((t * ease).toFixed(t < 10 ? 1 : 0))));
          if (step >= steps) clearInterval(timer);
        }, interval);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-strip" ref={ref}>
      <div className="wrap">
        <div className="stats-row">
          {vals.map((v, i) => (
            <div className="stat" key={i}>
              <b className="counting">{v.toLocaleString("en-IN")}{suffixes[i]}</b>
              <span>{labels[i]}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "11px", color: "var(--sage)", marginTop: "8px" }}>*Individual results vary, based on our internal data.</p>
      </div>
    </div>
  );
}


/* ─── Checkout Modal ───────────────────────────────────────────── */
function CheckoutModal({ onClose, prefillName = "", prefillPhone = "", prefillBmi = "" }: {
  onClose: () => void;
  prefillName?: string;
  prefillPhone?: string;
  prefillBmi?: string;
}) {
  const [name, setName] = useState(prefillName);
  const [phone, setPhone] = useState(prefillPhone);
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name";
    const digits = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) next.phone = "Enter a valid 10-digit number";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    if (!consent) { alert("Please accept the Terms & Privacy Policy to continue."); return; }
    setPaying(true); setPayError(null);
    try {
      const createRes = await fetch("/api/consult49/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.replace(/\D/g, ""), email: email.trim(), city: city.trim(), preferred_time: preferredTime, bmi: prefillBmi }),
      });
      const order = await createRes.json();
      if (!createRes.ok) throw new Error(order?.error || "Could not start payment.");

      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) { resolve(); return; }
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.async = true; s.onload = () => resolve(); s.onerror = () => reject(new Error("Failed to load payment gateway"));
        document.body.appendChild(s);
      });

      const razorpay = new (window as any).Razorpay({
        key: order.keyId, currency: order.currency, amount: Math.round(order.amount * 100),
        name: "Lean Protocol — GLP-1 Doctor Consultation", description: "1:1 GLP-1 Doctor Consultation · ₹49",
        order_id: order.orderId,
        prefill: { name: name.trim(), contact: phone.replace(/\D/g, ""), email: email.trim() || undefined },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/consult49/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature, name: name.trim(), phone: phone.replace(/\D/g, ""), email: email.trim(), city: city.trim(), preferred_time: preferredTime, bmi: prefillBmi }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData?.error || "Payment verification failed");
            setSuccess(true);
            (window as any).lpConfetti?.(160);
          } catch (err: any) {
            setPayError(err.message || "Payment verification failed. Please contact support.");
          } finally { setPaying(false); }
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: "#15603F" },
      });
      razorpay.on("payment.failed", (evt: any) => { setPayError(evt?.error?.description || "Payment failed."); setPaying(false); });
      razorpay.open();
    } catch (err: any) { setPayError(err.message || "Could not start payment."); setPaying(false); }
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {!success ? (
          <>
            <div className="modal-head">
              <h3>Book your consultation</h3>
              <div className="modal-price">₹49 <span>₹1,500</span></div>
            </div>
            <div className={`c-field ${errors.name ? "err" : ""}`}>
              <label>Full name</label>
              <input type="text" placeholder="Your name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
              <div className="c-msg">{errors.name}</div>
            </div>
            <div className={`c-field ${errors.phone ? "err" : ""}`}>
              <label>Phone (WhatsApp)</label>
              <div className="c-phone"><span className="cc">+91</span>
                <input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" autoComplete="tel-national" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} />
              </div>
              <div className="c-msg">{errors.phone}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="c-field">
                <label>Email</label>
                <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="c-field">
                <label>City</label>
                <input type="text" placeholder="e.g. Delhi" value={city} onChange={e => setCity(e.target.value)} />
              </div>
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
            <ul className="modal-incl">
              <li><b>✓</b> Live 1:1 video call with a GLP-1 expert</li>
              <li><b>✓</b> Personalised fat-loss plan</li>
              <li><b>✓</b> Root cause analysis</li>
              <li><b>✓</b> Prescription right at your inbox</li>
            </ul>
            <label className="c-consent">
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <span>I agree to the <a href="https://www.leanprotocol.in/terms" target="_blank" rel="noopener noreferrer">Terms</a> &amp; <a href="https://www.leanprotocol.in/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span>
            </label>
            {payError && <p style={{ color: "var(--danger)", fontSize: "13px", margin: "8px 0" }}>{payError}</p>}
            <button className="btn btn-primary" style={{ width: "100%", marginTop: "12px", fontSize: "17px" }} onClick={handlePay} disabled={paying}>
              {paying ? "Processing…" : "Pay ₹49 & Book"}
            </button>
            <p style={{ fontSize: "11px", color: "var(--sage)", textAlign: "center", marginTop: "10px" }}>🔒 256-bit secure · UPI / Cards / Netbanking</p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div className="c-success-ic">✓</div>
            <h3 style={{ marginTop: "14px" }}>Consultation booked!</h3>
            <p style={{ color: "var(--sage)", margin: "8px 0 18px", fontSize: "14px" }}>Our medical team will reach out on WhatsApp shortly to schedule your call.</p>
            <a href="https://wa.link/3s1upf" className="btn btn-wa" style={{ width: "100%" }}>💬 Message us on WhatsApp</a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────── */
function Consult49Content() {
  const [extraCount, setExtraCount] = useState(0);
  const handleJoin = useCallback(() => setExtraCount(c => c + 1), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalBmi, setModalBmi] = useState("");
  const openModal = (name = "", phone = "", bmi = "") => { setModalName(name); setModalPhone(phone); setModalBmi(bmi); setModalOpen(true); };

  return (
    <>
      <div className="urgency-bar">🔒 GLP-1 Doctor Consultation — Now at Just ₹49 (Was ₹1,500)</div>

      <header>
        <div className="wrap nav">
          <div className="logo" style={{ flexShrink: 0 }}>
            <div className="mark">LP</div>
            <div className="name">LEAN <b>PROTOCOL</b><span>DOCTOR-LED · SCIENCE-BACKED</span></div>
          </div>
          <button className="btn btn-primary" style={{ flexShrink: 0, whiteSpace: "nowrap", fontSize: "13px", padding: "10px 16px" }} onClick={() => openModal()}>
            Book ₹49 <span className="pill49" style={{ fontSize: "12px", padding: "2px 8px" }}>₹49</span>
          </button>
        </div>
      </header>

      {/* Doctor carousel */}
      <section className="docs-first">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: "22px" }}><div className="divider"></div><h2>Your GLP-1 Fat-Loss Doctors</h2><p>Consult certified doctors (Internal Medicine &amp; Endocrinologist) — live 1:1.</p></div>
          <DoctorCarousel />
        </div>
      </section>

      {/* Hero */}
      <section className="hero">
        <div className="wrap hero-center">
          <h1>Your Transformation Plan!</h1>
          <div className="offer-card">
            <div className="oc-h">GLP-1 Expert Doctor Consultation</div>
            <div className="price-row">
              <span className="price-at">At Just</span>
              <span className="price-big">₹49</span>
              <span className="price-was">₹1,500</span>
              <span className="price-save">97% OFF</span>
            </div>
            <ul>
              <li><b>✓</b> Live 1:1 Video Call</li>
              <li><b>✓</b> Personalized Fat Loss Plan</li>
              <li><b>✓</b> Root Cause Analysis</li>
              <li><b>✓</b> Prescription right at your inbox</li>
            </ul>
            <div className="tagline">ONE SMALL STEP. TO A LEANER YOU.</div>
            <button className="btn btn-primary" onClick={() => openModal()}>Book Now at Just <span className="pill49">₹49</span></button>
          </div>
          <ViewingCounter extra={extraCount} />
        </div>
      </section>

      {/* Stats — roll-up counter */}
      <RollupStats />

      {/* Testimonials — real media */}
      <section>
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Real transformations</h2><p>10,000+ people have already started. Here are some of them.</p></div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testi" key={i}>
                <div className="testi-media">
                  {t.type === "video"
                    ? <video src={t.src} controls playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <img src={t.src} alt={`${t.name} result`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  }
                  <span className="badge">{t.type === "video" ? "Video story" : "Before & After"}</span>
                </div>
                <div className="who"><div className="ava">{t.initial}</div><div><b>{t.name}</b>{t.age && <small>{t.age}</small>}</div></div>
                <div className="res"><div className="big">{t.result}</div><div className="when">{t.when}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews — real screenshots */}
      <section id="reviews" className="alt">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Loved on Google</h2><p>Real ratings from people on their Lean Protocol journey.</p></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "30px", flexWrap: "wrap" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" aria-label="Google"><path d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.9z" fill="#4285F4" /><path d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1-3.6 1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23z" fill="#34A853" /><path d="M6 14.3a6.6 6.6 0 0 1 0-4.2V7.3H2.3a11 11 0 0 0 0 9.8L6 14.3z" fill="#FBBC05" /><path d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 12 1 11 11 0 0 0 2.3 7.3L6 10.1c.9-2.5 3.2-4.4 6-4.4z" fill="#EA4335" /></svg>
            <div style={{ fontFamily: "var(--display)", fontSize: "38px", color: "var(--green)", lineHeight: 1 }}>4.8 <span style={{ color: "#FBBC05", fontSize: "22px" }}>★★★★★</span></div>
          </div>
          <div className="reviews-grid reveal">
            {REVIEW_IMAGES.map((src, i) => (
              <div className="greview-ss" key={i}><img src={src} alt={`Google review ${i + 1}`} loading="lazy" /></div>
            ))}
          </div>
        </div>
      </section>

      {/* Press / Publications */}
      <section className="press reveal">
        <div className="wrap">
          <div className="label">Lean Protocol — Featured across India&apos;s leading publications</div>
          <p style={{ fontSize: "11px", color: "var(--sage)", marginBottom: "18px", textAlign: "center" }}>(click to read)</p>
          <div className="press-logos">
            {PRESS_LOGOS.map((logo, i) => (
              <a key={i} className={`plogo ${logo.className}`} href={logo.href} target="_blank" rel="noopener noreferrer">{logo.content}</a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>How it works</h2><p>From booking to your personalised prescription — four simple steps.</p></div>
          <div className="steps reveal">
            {[
              { ic: "📱", h: "Book your consultation", p: "Reserve your ₹49 consultation slot (150 consultations a day)." },
              { ic: "🩺", h: "Talk to GLP-1 Expert Doctors", p: "1-to-1 live video consultation with reputed doctors." },
              { ic: "🔬", h: "Root Cause Analysis", p: "Get root cause analysis and a GLP-1 / Mounjaro roadmap." },
              { ic: "📝", h: "Get your Prescription", p: "A personalised plan with a prescription." },
            ].map((s, i) => (<div className="step" key={i}><div className="step-num">{i + 1}</div><div className="ic">{s.ic}</div><h4>{s.h}</h4><p>{s.p}</p></div>))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="alt" style={{ padding: "40px 0 22px" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", fontSize: "11px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--sage)", fontWeight: 700, marginBottom: "24px" }}>Trusted partners</div>
          <div className="partner-logos reveal">
            <div className="plg"><img src="/lp-assets/logo-cult.png" alt="Cult" style={{ height: "28px", width: "auto", objectFit: "contain" }} /><div><span className="wm" style={{ color: "#111" }}>cult</span><small>For Cult Pass Home</small></div></div>
            <div className="plg"><img src="/lp-assets/logo-redcliffe.png" alt="Redcliffe Labs" style={{ height: "28px", width: "auto", objectFit: "contain" }} /><div><span className="wm"><span style={{ color: "#C0202E" }}>Redcliffe</span> <span style={{ color: "#1B9CCB" }}>labs</span></span><small>For Blood Tests</small></div></div>
            <div className="plg"><img src="/lp-assets/logo-mrmed.jpg" alt="Mr.Med" style={{ height: "28px", width: "auto", objectFit: "contain" }} /><div><span className="wm"><span style={{ color: "#16B5C4" }}>mr</span><span style={{ color: "#2E6FB0" }}>med</span><span style={{ color: "#16B5C4" }}>.in</span></span><small>For Medicine Delivery</small></div></div>
          </div>
        </div>
      </section>

      {/* BMI Calculator */}
      <BMICalculator onOpenModal={openModal} />

      {/* Experts — full image cards */}
      <section id="experts" className="alt">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Meet your expert team</h2><p>Endocrinologists, physicians &amp; GLP-1 specialist dietitians guide every plan.</p></div>
          <div className="docs-grid reveal">
            {EXPERTS.map((e, i) => (
              <div className="doc" key={i}>
                <div className="ava">
                  <img src={e.img} alt={e.name} loading="lazy" onError={(ev) => { const parent = (ev.target as HTMLElement).parentElement!; parent.textContent = e.initials; }} />
                </div>
                <h4>{e.name}</h4>
                <p>{e.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="alt">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Your program roadmap</h2><p>From your first consultation to lasting results.</p></div>
          <div className="roadmap reveal">
            {[
              { h: "Book your ₹49 consultation", p: "Reserve your ₹49 slot in under a minute." },
              { h: "Talk to a GLP-1 expert doctor", p: "Live 1:1 video call with a certified internal medicine or endocrinology doctor." },
              { h: "Get your root cause analysis", p: "Doctor understands your medical history and builds a weight-loss protocol based on your future goals." },
              { h: "Receive your prescription", p: "Get custom GLP-1 / Mounjaro prescription in your inbox." },
              { h: "First step to a leaner you", p: "Regular check-ins with experts, so you lose weight smartly." },
            ].map((rm, i) => (<div className="rm-step" key={i}><div className="rm-node">{i + 1}</div><div className="rm-body"><h4>{rm.h}</h4><p>{rm.p}</p></div></div>))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="alt">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Everything you wanted to ask</h2><p>Still curious? Here&apos;s the honest detail.</p></div>
          <div className="faq-list reveal">
            {[
              { q: "Who is eligible for the weight-loss program?", a: "Generally a BMI of 30 or above qualifies — or 27+ with a weight-related condition like PCOS, thyroid, hypertension or diabetes. Final eligibility is always decided by your doctor during the consultation." },
              { q: "Is the program safe?", a: "It's doctor-supervised from day one. Medicines are prescription-only, started after reviewing your health and labs, and adjusted with regular check-ins." },
              { q: "What happens after I book?", a: "You'll get a 1-on-1 video call with a certified doctor, a root-cause assessment, and a personalised plan." },
              { q: "How soon will I see results?", a: "It varies by person, starting point, and consistency. Many members notice changes within the first few weeks." },
              { q: "Are medicines included in the ₹49?", a: "No — ₹49 covers the consultation and root cause analysis only. If the doctor recommends medicines or tests, you'll see transparent pricing and can decide before anything is dispensed." },
            ].map((faq, i) => (<details className="faq-item" key={i}><summary>{faq.q}</summary><div className="a">{faq.a}</div></details>))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final" style={{ overflow: "hidden" }}>
        <div className="wrap">
          <div className="final-inner">
            <div className="final-text">
              <span className="eyebrow">One Small Step. A Leaner You</span>
              <h2 style={{ marginTop: "14px" }}>Now or Never Deal</h2>
              <p>Live 1:1 video call with a GLP-1 expert doctor, root cause analysis, and a personalised prescription.</p>
              <button className="btn btn-primary zoom" style={{ fontSize: "18px", padding: "17px 40px", marginTop: "8px" }} onClick={() => openModal()}>Book Now <span className="pill49">₹49</span></button>
            </div>
            <div className="final-img">
              <img
                src="/lp-assets/doctor-patient.png"
                alt="Doctor consultation"
                style={{ width: "100%", maxWidth: "480px", display: "block", mixBlendMode: "multiply" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div style={{ maxWidth: "300px" }}>
              <div className="logo" style={{ marginBottom: "14px" }}><div className="mark">LP</div><div className="name">LEAN <b>PROTOCOL</b><span>DOCTOR-LED · SCIENCE-BACKED</span></div></div>
              <p style={{ fontSize: "13px", color: "var(--sage)" }}>Doctor-led, science-backed weight care — consultations, prescriptions, and support.</p>
            </div>
            <div className="foot-col"><h5>Program</h5><a href="#how">How it works</a><a href="#bmi">BMI check</a><a href="#experts">Our doctors</a><a href="#reviews">Reviews</a></div>
            <div className="foot-col"><h5>Contact</h5><a href="mailto:support@leanprotocol.in">support@leanprotocol.in</a><a href="tel:+919650401267">+91 96504 01267</a><a href="https://wa.link/3s1upf">WhatsApp our experts</a><a href="https://www.instagram.com/leanprotocol.og">Instagram</a></div>
          </div>
          <p className="legal">GLP-1 medications are prescription-only and dispensed solely when a licensed physician determines they are clinically appropriate; they are not suitable for everyone and may carry side effects. The BMI tool is for general awareness only and is not medical advice or a diagnosis. Results vary and are not guaranteed. Lean Protocol is not affiliated with Novo Nordisk A/S or Eli Lilly &amp; Co. © {new Date().getFullYear()} Lean Protocol Pvt Ltd.</p>
        </div>
      </footer>

      {/* Sticky CTA */}
      <div className="sticky-cta">
        <div className="txt">Very limited slots today<b>GLP-1 Consultation · ₹49</b></div>
        <button className="btn btn-primary" onClick={() => openModal()}>Book ₹49 →</button>
      </div>

      <JoinerToast onJoin={handleJoin} />
      <Confetti />
      <ScrollReveal />
      {modalOpen && <CheckoutModal onClose={() => setModalOpen(false)} prefillName={modalName} prefillPhone={modalPhone} prefillBmi={modalBmi} />}
    </>
  );
}

export default function Consult49Page() {
  return (
    <Suspense fallback={null}>
      <Consult49Content />
    </Suspense>
  );
}







