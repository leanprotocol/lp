"use client";

import { useEffect, useRef, useState, Suspense } from "react";

/* ─── Data ─────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { initial: "M", name: "Manav", age: "24 yrs", quote: "The food noise went quiet.", result: "−20 kg", when: "in 5 months", type: "video" as const, src: "/before-after/manav.mp4" },
  { initial: "U", name: "Uday", age: "", quote: "Structured, doctor-led, and genuinely effective.", result: "Transformation", when: "journey", type: "video" as const, src: "/before-after/uday.mp4" },
  { initial: "A", name: "Ayushi", age: "22 yrs", quote: "First plan with actual science behind it.", result: "−15 kg", when: "in 6 months", type: "video" as const, src: "/before-after/ayushi.mp4" },
  { initial: "A", name: "Ananya", age: "20 yrs", quote: "The blood test found what years of dieting missed.", result: "−14 kg", when: "in 7 months", type: "video" as const, src: "/before-after/ananya.mp4" },
  { initial: "A", name: "Aditya", age: "", quote: "Doorstep delivery made it easy.", result: "Transformation", when: "journey", type: "video" as const, src: "/before-after/aditya.mp4" },
  { initial: "R", name: "Roshni", age: "23 yrs", quote: "Doctor-led made all the difference.", result: "−15 kg", when: "in 6 months", type: "video" as const, src: "/before-after/roshni.mp4" },
  { initial: "A", name: "Atreyee", age: "28 yrs", quote: "The constant motivation made all the difference.", result: "−6 kg", when: "in 1 month", type: "video" as const, src: "/before-after/atreyee.mp4" },
];

/* ─── Doctor Carousel ──────────────────────────────────────────── */
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

  const resultRef = useRef<HTMLDivElement>(null);

  const handleCheck = () => {
    setEligible(bmiEligible);
    setShowResult(true);
    if (bmiEligible) (window as any).lpConfetti?.();
    /* Bring the result and the form into view so nobody has to hunt for it.
       A frame of delay lets the block render before we scroll to it. */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
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
            <div className="bmi-result show" ref={resultRef}>
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
      {/* Pinned call-to-action styles */}
      <style>{`
        .start-page .pinned-head { position: sticky; top: 0; z-index: 60; }
        .start-page .pinned-head .nav { gap: 12px; }
        .start-page .head-cta { flex-shrink: 0; white-space: nowrap; font-size: 14px; padding: 11px 20px; }
        @media (max-width: 560px) { .start-page .head-cta { font-size: 12.5px; padding: 10px 14px; } }

        /* Pinned strip along the bottom. Sits above the footer content so it
           never hides the disclaimer: the footer carries matching padding. */
        .start-page .elig-strip {
          position: fixed; left: 12px; right: 12px; bottom: 12px; z-index: 70;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          min-height: 56px; padding: 14px 22px; border-radius: 999px;
          background: linear-gradient(135deg, #D9B65C, #C9A24B); color: #2b1f06;
          font-family: var(--display); font-size: 16px; letter-spacing: .04em; text-transform: uppercase;
          text-decoration: none; box-shadow: 0 14px 36px rgba(21,96,63,.34);
        }
        .start-page .elig-strip:hover { transform: translateY(-2px); }
        .start-page .elig-strip:focus-visible { outline: 3px solid var(--green); outline-offset: 3px; }
        .start-page .elig-arrow {
          display: inline-flex; align-items: center; justify-content: center; flex: none;
          width: 26px; height: 26px; border-radius: 999px; background: rgba(0,0,0,.14);
        }
        .start-page footer { padding-bottom: 104px; }
        @media (min-width: 900px) { .start-page .elig-strip { left: auto; right: 24px; bottom: 24px; padding: 15px 30px; } }
        @media (prefers-reduced-motion: reduce) { .start-page .elig-strip:hover { transform: none; } }
      `}</style>

      <header className="pinned-head">
        <div className="wrap nav">
          <div className="logo" style={{ flexShrink: 0 }}>
            <img src="/logo.png" alt="Lean Protocol" style={{ height: "70px", width: "auto", display: "block", alignSelf: "center" }} />
          </div>
          <a className="btn btn-primary head-cta" href="#bmi">Check my eligibility</a>
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

      {/* Stats — roll-up counter */}
      <RollupStats />

      {/* BMI Calculator */}
      <BMICalculator />

      {/* Testimonial rail */}
      <style>{`
        .start-page .testi-rail {
          display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory;
          padding: 4px 24px 18px; margin: 0 -24px;
          -webkit-overflow-scrolling: touch; scrollbar-width: thin;
        }
        .start-page .testi-rail::-webkit-scrollbar { height: 8px; }
        .start-page .testi-rail::-webkit-scrollbar-thumb { background: rgba(21,96,63,.28); border-radius: 99px; }
        .start-page .testi-rail::-webkit-scrollbar-track { background: transparent; }
        .start-page .testi-rail:focus-visible { outline: 3px solid var(--green); outline-offset: 4px; border-radius: 16px; }
        .start-page .testi-rail > .testi { flex: 0 0 clamp(250px, 74vw, 296px); scroll-snap-align: start; }
        .start-page .rail-hint { text-align: center; font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: var(--sage); font-weight: 700; margin: 2px 0 0; }
        @media (min-width: 1100px) { .start-page .rail-hint { display: none; } }
      `}</style>

      {/* Testimonials — real media */}
      <section>
        <div className="wrap">
          <div className="sec-head reveal"><div className="divider"></div><h2>Real transformations</h2></div>
          {/* Horizontal scroller: one row, swipe or drag, snapping to each card. */}
          <div className="testi-rail" role="region" aria-label="Member stories" tabIndex={0}>
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
          <p className="rail-hint">Swipe to see more</p>
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
              <span className="eyebrow" style={{ display: "block" }}>One Small Step. A Leaner You</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pinned eligibility strip */}
      <a className="elig-strip" href="#bmi">
        <span>Check my eligibility</span>
        <span className="elig-arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </span>
      </a>

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








