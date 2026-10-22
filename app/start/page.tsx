"use client";

import { useEffect, useRef, useState, Suspense } from "react";

/* ─── Data ─────────────────────────────────────────────────────── */
const DOCTORS = [
  { initials: "NJ", name: "Dr. Nishant Jain", role: "MD, DM · Endocrinologist", hosp: "Kailash Deepak Hospital", img: "/lp-assets/experts/nishant.jpeg" },
  { initials: "AK", name: "Dr. Akhil Konduru", role: "MD · Internal Medicine", hosp: "Medanta (former)", img: "/lp-assets/experts/akhil.jpeg" },
  { initials: "SG", name: "Dr. Siddharth Garg", role: "MD · Internal Medicine", hosp: "Yashoda Hospital", img: "/lp-assets/experts/siddharth.jpeg" },
];

const EXPERTS = [
  { initials: "NJ", name: "Dr. Nishant Jain", title: "MD, DM Endocrinology", img: "/lp-assets/experts/nishant.jpeg" },
  { initials: "GK", name: "Dr. Gautam Kumar", title: "MD, DM Endocrinology", img: "/lp-assets/experts/gautam.jpeg" },
  { initials: "AK", name: "Dr. Akhil Konduru", title: "MD, Internal Medicine", img: "/lp-assets/experts/akhil.jpeg" },
  { initials: "SG", name: "Dr. Siddharth Garg", title: "MD, Internal Medicine", img: "/lp-assets/experts/siddharth.jpeg" },
  { initials: "AG", name: "Alisha Gupta", title: "GLP-1 Expert Dietitian", img: "/lp-assets/experts/alisha.jpeg" },
  { initials: "SK", name: "Simran Kumawat", title: "Weight Loss Dietitian", img: "/lp-assets/experts/simran.jpeg" },
  { initials: "RS", name: "Richa Sharma", title: "Senior Dietitian", img: "/lp-assets/experts/richa-sharma.jpeg" },
  { initials: "AT", name: "Aparna Tandon", title: "Weight Loss Expert", img: "/lp-assets/experts/aparna.jpeg" },
  { initials: "RS2", name: "Richa Singh", title: "Yoga & Fat Loss", img: "/lp-assets/experts/richa-singh.jpeg" },
  { initials: "AB", name: "Alka Bharti", title: "GLP-1 Dietitian", img: "/lp-assets/experts/alka.jpeg" },
  { initials: "ArG", name: "Dr. Archna Gupta", title: "Senior Dietitian", img: "/lp-assets/experts/archna-gupta.png" },
  { initials: "FS", name: "Dt. Florence Singh", title: "Weight Loss Dietitian", img: "/lp-assets/experts/florence-singh.jpeg" },
  { initials: "SuG", name: "Dt. Suruchi Gupta", title: "Weight Loss Expert", img: "/lp-assets/experts/suruchi-gupta.jpeg" },
  { initials: "DS", name: "Dt. Sarani", title: "Weight Loss Dietitian", img: "/lp-assets/experts/sarani.jpeg" },
];

const TESTIMONIALS = [
  { initial: "M", name: "Manav", age: "24 yrs", quote: "The food noise went quiet. My doctor adjusted my plan every week.", result: "−20 kg", when: "in 5 months", type: "video" as const, src: "/before-after/manav.mp4" },
  { initial: "U", name: "Uday", age: "", quote: "Structured, doctor-led, and genuinely effective.", result: "Transformation", when: "journey", type: "video" as const, src: "/before-after/uday.mp4" },
  { initial: "A", name: "Ayushi", age: "22 yrs", quote: "First plan with actual science behind it. The check-ins kept me going.", result: "−15 kg", when: "in 6 months", type: "video" as const, src: "/before-after/ayushi.mp4" },
  { initial: "A", name: "Ananya", age: "20 yrs", quote: "The at-home blood test found what years of dieting missed.", result: "−14 kg", when: "in 7 months", type: "video" as const, src: "/before-after/ananya.mp4" },
  { initial: "A", name: "Aditya", age: "", quote: "Doorstep delivery and constant support made this easy.", result: "Transformation", when: "journey", type: "video" as const, src: "/before-after/aditya.mp4" },
  { initial: "R", name: "Roshni", age: "23 yrs", quote: "Doctor-led made all the difference.", result: "−15 kg", when: "in 6 months", type: "video" as const, src: "/before-after/roshni.mp4" },
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
function BMICalculator() {
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
  const [checkoutHref, setCheckoutHref] = useState("/start/checkout");

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
      await fetch("/api/start/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), phone: `+91${phoneDigits}`, bmi: bmi.toFixed(1), bmi_category: bmiCategory, has_comorbidities: hasCondition, eligible: bmiEligible, source: "bmi-calculator", page_url: window.location.href, referrer: document.referrer }),
      });
    } catch {}
    setCheckoutHref(`/start/checkout?bmi=${bmi.toFixed(1)}&name=${encodeURIComponent(formName.trim())}&phone=${encodeURIComponent(phoneDigits)}`);
    setSubmitted(true);
    (window as any).lpConfetti?.(160);
  };
  const bmiFormValid = formName.trim().length > 0 && /^[6-9]\d{9}$/.test(formPhone.replace(/\D/g, "")) && consent;

  function polar(cx: number, cy: number, r: number, deg: number) { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) { const s = polar(cx, cy, r, a0), e = polar(cx, cy, r, a1); const large = Math.abs(a1 - a0) > 180 ? 1 : 0; return `M${s[0].toFixed(1)} ${s[1].toFixed(1)} A${r} ${r} 0 ${large} 1 ${e[0].toFixed(1)} ${e[1].toFixed(1)}`; }
  function deg(b: number) { return Math.max(0, Math.min(1, (b - 12) / 30)) * 180 - 90; }
  const segs: [string, number, number][] = [["#3E8FD0", -90, deg(18.5)], ["#15603F", deg(18.5), deg(25)], ["#E8973A", deg(25), deg(30)], ["#E2574B", deg(30), 90]];

  return (
    <section id="bmi" style={{ padding: "26px 0 48px" }}>
      <div className="wrap">
        <div className="sec-head"><div className="divider"></div><h2>Check your BMI &amp; Eligibility</h2><p>Check your qualification for the GLP weight management protocol.</p></div>
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
              <div className={`elig ${eligible ? "yes" : "no"}`}>{eligible ? "🎉 You are eligible for the weight management program" : "😔 Based on your BMI, you are not eligible yet"}</div>
              {eligible && (<div className="glp-box show"><h4>You are eligible for the program 🎯</h4><p>A doctor-supervised path, with your plan decided by a clinician after reviewing your history and labs.</p></div>)}
              <details className="faq-dropdown" id="dropdown" open={eligible}><summary>What Your BMI Means?</summary><div className="para">BMI above 27 with comorbidities, or above 30 without, makes you eligible for the program (barring rare cases). Final eligibility is decided by your doctor.</div></details>
              {!submitted ? (
                <div className="lead-mini">
                  <h4>Get your personalised report</h4>
                  <form onSubmit={handleBMILead} noValidate>
                    <div className={`bmi-field2 ${nameErr ? "err" : ""}`}><label>Full name</label><input type="text" placeholder="Your name" autoComplete="name" value={formName} onChange={e => { setFormName(e.target.value); setNameErr(false); }} /></div>
                    <div className={`bmi-field2 ${phoneErr ? "err" : ""}`}><label>Phone (WhatsApp)</label><div className="phone-wrap"><span className="cc">+91</span><input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" autoComplete="tel-national" value={formPhone} onChange={e => { setFormPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setPhoneErr(false); }} /></div></div>
                    <label className="bmi-consent"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} /><span>I agree to be contacted by Lean Protocol and accept the <a href="https://www.leanprotocol.in/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span></label>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", opacity: bmiFormValid ? 1 : 0.5, cursor: bmiFormValid ? "pointer" : "not-allowed" }} disabled={!bmiFormValid}>Submit <span className="arrow">›</span></button>
                  </form>
                </div>
              ) : (
                <div className="lead-mini"><div className="lead-done show"><div className="check-ic">✓</div><h4>You&apos;re all set!</h4><p style={{ color: "var(--sage)", fontSize: "14px", margin: "6px 0 0" }}>Our team will be in touch shortly.</p></div></div>
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
    const elements = document.querySelectorAll(".start-page .reveal");
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
  const KEY = "lp_start_booked";
  const [base, setBase] = useState(72); // stable value for the server render
  useEffect(() => {
    // a baseline that grows through the day, so first-time visitors see a live number
    const now = new Date();
    const dayTarget = 60 + Math.floor((now.getHours() * 60 + now.getMinutes()) / 12);
    let stored = 0;
    try { stored = parseInt(localStorage.getItem(KEY) || "0", 10) || 0; } catch {}
    const next = Math.min(Math.max(dayTarget, stored), 110); // never below what was seen before
    setBase(next);
    try { localStorage.setItem(KEY, String(next)); } catch {}
  }, []);
  const shown = Math.min(base + extra, 110);
  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem(KEY) || "0", 10) || 0;
      if (shown > stored) localStorage.setItem(KEY, String(shown)); // remember the new high
    } catch {}
  }, [shown]);
  return (<div className="viewing"><span className="dot"></span> <b>{shown}</b>&nbsp;people booked a consultation today</div>);
}


/* ─── Joiner Toast ─────────────────────────────────────────────── */

/* ─── Roll-up stats counter ────────────────────────────────────── */
function RollupStats() {
  const [vals, setVals] = useState([0, 0, 0, 0]);
  const targets = [98, 1000, 4.8, 99];
  const suffixes = ["%", "+", "★", "+"];
  const labels = ["member success rate*", "transformations", "on Google", "countries approved"];
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
/* ─── 10-minute offer timer (persists across refresh) ─────────────────── */
/* ─── Main page ────────────────────────────────────────────────── */
function StartContent() {

  return (
    <>
      <header>
        <div className="wrap nav">
          <div className="logo" style={{ flexShrink: 0 }}>
            <img src="/logo.png" alt="Lean Protocol" style={{ height: "70px", width: "auto", display: "block", alignSelf: "center" }} />
          </div>
        </div>
      </header>

      {/* Doctor carousel */}
      <section className="docs-first" style={{ background: "linear-gradient(180deg, #EAF3EE 0%, #F4F9F6 45%, #FFFFFF 100%)" }}>
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: "22px" }}><div className="divider"></div><h2>Talk to real GLP doctors before you spend ₹15,000 on the program</h2></div>
          <style>{`
            .doc-row { display:flex; justify-content:center; align-items:flex-end; gap:6px; flex-wrap:nowrap; width:100%; }
            .doc-col { display:flex; flex-direction:column; align-items:center; flex:1 1 0; min-width:0; }
            .doc-cutout { width:100%; height:auto; max-height:230px; object-fit:contain; }
            .doc-name { margin-top:2px !important; }
            @media (min-width:768px){
              .doc-row { gap:32px; }
              .doc-col { flex:1 1 0; min-width:0; }
              .doc-cutout { width:100%; height:auto; max-height:460px; }
              .doc-name { margin-top:4px !important; }
            }
          `}</style>
          <div className="doc-row">
            {[
              { img: "/start/doctor-1.webp", name: "Dr. Nishant Jain", role: "MD, DM · Endocrinologist", hospital: "Kailash Hospital" },
              { img: "/start/doctor-2.webp", name: "Dr. Akhil Konduru", role: "MD · Internal Medicine", hospital: "Yashoda Hospital" },
              { img: "/start/doctor-3.webp", name: "Dr. Siddharth Garg", role: "MD · Internal Medicine", hospital: "Former Medanta, Gurgaon" },
            ].map((d, i) => (
              <div key={i} className="doc-col">
                <img
                  src={d.img}
                  alt={d.name}
                  loading="lazy"
                  className="doc-cutout"
                  style={{ display: "block" }}
                />
                <div className="doc-name" style={{ fontFamily: "var(--display)", fontSize: "clamp(13px, 2vw, 20px)", fontWeight: 700, color: "var(--green)", textAlign: "center", lineHeight: 1.2 }}>{d.name}</div>
                <div style={{ fontSize: "clamp(11px, 1.4vw, 13px)", color: "var(--sage)", marginTop: "4px", textAlign: "center", lineHeight: 1.3 }}>{d.role}</div>
                <div style={{ fontSize: "clamp(10px, 1.2vw, 12px)", color: "var(--green)", fontWeight: 600, marginTop: "2px", textAlign: "center", lineHeight: 1.3 }}>{d.hospital}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient app */}
      <section className="app-sec">
        <div className="app-stage">
          <div className="app-copy">
            <p className="app-eyebrow">Your patient app</p>
            <h2>Your whole<br />programme, in<br />one app.</h2>
            <ul className="app-list">
              <li><b>✓</b><div><strong>Track what matters</strong><span>Weight, BMI, doses and side effects, logged in seconds.</span></div></li>
              <li><b>✓</b><div><strong>See your progress</strong><span>Every weigh-in plotted, so the trend is clear long before the mirror shows it.</span></div></li>
              <li><b>✓</b><div><strong>Your diet, written for you</strong><span>A day-by-day chart from your dietitian, around Indian food and your routine.</span></div></li>
              <li><b>✓</b><div><strong>Everything in one place</strong><span>Consultations, lab reports, prescriptions and check-ins.</span></div></li>
            </ul>
            <div className="app-ctas">
              <a className="btn btn-store" href="https://play.google.com/store/apps/details?id=in.leanprotocol.patient" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.6 2.3 13 11.7l-9.4 9.4A1.7 1.7 0 0 1 3 19.9V3.5c0-.46.23-.89.6-1.2z" fill="#34A853"/><path d="M16.5 8.2 13 11.7 3.6 2.3c.42-.3.97-.35 1.43-.1l11.47 6z" fill="#EA4335"/><path d="M20.6 10.4c.9.5.9 1.8 0 2.3l-4.1 2.2L13 11.7l3.5-3.5 4.1 2.2z" fill="#FBBC04"/><path d="M16.5 15.2 5.03 21.2c-.46.25-1 .2-1.43-.1L13 11.7l3.5 3.5z" fill="#4285F4"/></svg>
                <span><small>Get it on</small><b>Google Play</b></span>
              </a>
              <a className="btn btn-primary" href="#bmi">Request a call back</a>
            </div>
          </div>
          <div className="app-shots">
            <img className="shot-a" src="/start/app-today.webp" alt="Daily tracking and progress in the Lean Protocol app" loading="lazy" />
            <img className="shot-b" src="/start/app-diet.webp" alt="A personalised diet chart in the Lean Protocol app" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Stats — roll-up counter */}
      <RollupStats />

      {/* Testimonials — real media */}
      <section>
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Real transformations</h2></div>
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

       {/* Roadmap */}
      <section className="alt" id="roadmap">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Your program roadmap</h2><p>From your first consultation to lasting results.</p></div>
          <div className="rmap reveal">
            {[
              { eyebrow: "STEP 1", h: "Check your eligibility", p: "A two-minute check tells you whether a medical weight-loss protocol is appropriate for you." },
              { eyebrow: "STEP 2", h: "Talk to a senior health coach", p: "A root-cause conversation about your history, your habits and what has not worked before." },
              { eyebrow: "STEP 3", h: "Get your 75+ parameter blood test", p: "At-home sample collection through our partner labs, covering metabolic, thyroid, liver and lipid markers." },
              { eyebrow: "STEP 4", h: "Consult a GLP expert doctor", p: "A live 1:1 video consultation. Your doctor reviews your labs and decides what is clinically appropriate." },
              { eyebrow: "STEP 5", h: "Receive a personalised diet chart", p: "Written for you by a GLP expert dietitian, around Indian food and your routine." },
              { eyebrow: "ONGOING", h: "First step to a leaner you", p: "Regular check-ins with your coach, doctor and dietitian as you go." },
            ].map((rm, i) => (
              <div className="rmap-step" key={i}>
                <div className="rmap-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="rmap-body">
                  <div className="rmap-eyebrow">{rm.eyebrow}</div>
                  <h4>{rm.h}</h4>
                  <p>{rm.p}</p>
                </div>
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

      

      {/* Partners */}
      <section className="alt" style={{ padding: "40px 0 22px" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", fontSize: "11px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--sage)", fontWeight: 700, marginBottom: "24px" }}>Trusted partners</div>
          <div className="partner-logos reveal">
            <div className="plg"><img src="/lp-assets/logo-cult.png" alt="Cult" style={{ height: "28px", width: "auto", objectFit: "contain" }} /><div><small>For Cult Pass Home</small></div></div>
            <div className="plg"><img src="/lp-assets/logo-redcliffe.png" alt="Redcliffe Labs" style={{ height: "28px", width: "auto", objectFit: "contain" }} /><div><span className="wm"><span style={{ color: "#C0202E" }}>Redcliffe</span> <span style={{ color: "#1B9CCB" }}>labs</span></span><small>For Blood Tests</small></div></div>
            <div className="plg"><img src="/lp-assets/logo-mrmed.jpg" alt="Mr.Med" style={{ height: "28px", width: "auto", objectFit: "contain" }} /><div><span className="wm"><span style={{ color: "#16B5C4" }}>mr</span><span style={{ color: "#2E6FB0" }}>med</span><span style={{ color: "#16B5C4" }}>.in</span></span><small>For Medicine Delivery</small></div></div>
          </div>
        </div>
      </section>

      {/* BMI Calculator */}
      <BMICalculator />

      {/* Experts — full image cards */}
      <section id="experts" className="alt">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Meet your expert team</h2><p>Not general physicians. Not pharmacy counters. Every prescription comes from an NMC-registered endocrinologist or internal medicine doctor who treats metabolic conditions every day.</p></div>
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

     

      {/* FAQ */}
      <section id="faq" className="alt">
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Everything you wanted to ask</h2><p>Still curious? Here&apos;s the honest detail.</p></div>
          <div className="faq-list reveal">
            {[
              { q: "Who is eligible for the weight-loss program?", a: "Generally a BMI of 30 or above qualifies — or 27+ with a weight-related condition like PCOS, thyroid, hypertension or diabetes. Final eligibility is always decided by your doctor during the consultation." },
              { q: "Is the program safe?", a: "It's doctor-supervised from day one. Medicines are prescription-only, started after reviewing your health and labs, and adjusted with regular check-ins." },
              { q: "How soon will I see results?", a: "It varies by person, starting point, and consistency. Many members notice changes within the first few weeks." },
            ].map((faq, i) => (<details className="faq-item" key={i}><summary>{faq.q}</summary><div className="a">{faq.a}</div></details>))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final" style={{ overflow: "hidden" }}>
        <div className="wrap">
          <div className="final-inner">
            <div className="final-text">
              <a className="btn btn-primary zoom" style={{ fontSize: "18px", padding: "17px 40px", marginTop: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }} href="#bmi">Request a call back</a>
              <span className="eyebrow" style={{ display: "block", marginTop: "14px" }}>One Small Step. A Leaner You</span>
            </div>
            <div className="final-img">
              <img
                src="/journey/funnel-doctor-patient.webp"
                alt="Doctor consultation"
                style={{ width: "100%", maxWidth: "480px", display: "block", margin: "0 auto", mixBlendMode: "multiply" }}
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

      <Confetti />
      <ScrollReveal />
    </>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <StartContent />
    </Suspense>
  );
}









