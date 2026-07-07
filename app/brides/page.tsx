"use client";

import { useState, useEffect, useRef } from "react";
import BridesFunnel from "./BridesFunnel";

/* Brides Edit — responsive landing page (mobile single-column, desktop multi-column).
   Funnel lives in ./BridesFunnel. Theme: white / red (#B5202C) / gold (#C9A24B). */

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

/* Rolls a number from 0 → end when it scrolls into view (once). */
function CountUp({ end, prefix = "", suffix = "", duration = 1400 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          setVal(Math.round(eased * end));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

const STATS: { end: number; prefix?: string; suffix?: string; label: string }[] = [
  { end: 17, suffix: " kg", label: "Avg fat loss - 6 months*" },
  { end: 98, suffix: "%", label: "Success rate" },
  { end: 88, suffix: "%", label: "Faced natural skin glow" },
  { end: 78, suffix: "%", label: "Got two shades lighter" },
];

const BENEFITS = [
  { no: "01", t: "Doctor guided", d: "GLP-1 — Ozempic or Mounjaro — on a protocol designed by doctors from top institutions." },
  { no: "02", t: "Metabolic reset", d: "Root-cause diagnostics identify exactly what's slowing you down, so we can hit the nail on the head." },
  { no: "03", t: "Skin glow & tightening", d: "Supplements and at-home essentials that keep your skin bright and glowing as you transform." },
  { no: "04", t: "Accountability & side-effect management", d: "24×7 health-coach support plus weekly detailed consults with a registered dietitian — so there's always accountability." },
];

const STEPS = [
  { w: "Step 1", t: "Book your ₹449 consult", d: "Reserve your slot and share a few details — a GLP-1 doctor reviews them before your call." },
  { w: "Step 2", t: "1:1 doctor consultation", d: "A live video consult: eligibility & safety review and your personalised bridal protocol." },
  { w: "Step 3", t: "Tests & protocol", d: "At-home blood test, GLP-1 (if prescribed) delivered home, and your glow nutrition plan begins." },
  { w: "Step 4", t: "Support to your big day", d: "Weekly check-ins with your dietitian and 24×7 coach, with tweaks right up to the wedding." },
];

const BRIDES = [
  { n: "Atreyee", loss: "−8.2 kg", m: "in 1 month", q: "My lehenga fitting felt like a different person. The glow was unreal in every photo.", video: "/brides/atreyee.mp4" },
  
];

const EXPERTS = [
  { n: "Dr. Nishant Jain", r: "MD, DM (Endocrinology)", img: "/brides/doctors/nishant.jpeg" },
  { n: "Dr. Akhil Konduru", r: "MD, Internal Medicine", img: "/brides/doctors/akhil.jpeg" },
  { n: "Dr. Siddharth Garg", r: "MD, Internal Medicine", img: "/brides/doctors/siddharth.jpeg" },
  { n: "Dr. Gautam Kumar", r: "MD, DM (Endocrinology)", img: "/brides/doctors/gautam.jpeg" },
  { n: "Alisha Gupta", r: "GLP-1 Expert Dietitian", img: "/brides/doctors/alisha.jpeg" },
  { n: "Simran Kumawat", r: "Weight Loss Dietitian", img: "/brides/doctors/simran.jpeg" },
  { n: "Richa Sharma", r: "Senior Dietitian", img: "/brides/doctors/richa-sharma.jpeg" },
  { n: "Aparna Tandon", r: "Dietitian", img: "/brides/doctors/aparna.jpeg" },
  { n: "Richa Singh", r: "Fat Loss & Yoga Expert", img: "/brides/doctors/richa-singh.jpeg" },
  { n: "Alka Bharti", r: "Dietitian", img: "/brides/doctors/alka.jpeg" },
];

const PRESS = [
  { className: "zee", url: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html", content: (<><span className="box">ZEE</span><span className="t">NEWS</span></>) },
  { className: "n24", url: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/", content: (<span className="t">NEWS<b>24</b></span>) },
  { className: "ntoday", url: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html", content: (<span className="t">News Today<b> 24x7</b></span>) },
  { className: "startup", url: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/", content: (<span className="t">The <b>Startup</b> Story</span>) },
  { className: "tribune", url: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/", content: (<span className="t">The Tribune</span>) },
  { className: "republic", url: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html", content: (<span className="t">The <b>Republic</b> News</span>) },
];

const COMPARE_RAW = [
  { l: "Skin glow & focus", lp: 1, ot: 0 },
  { l: "Fast & safe weight loss", lp: 1, ot: 1, note: "takes longer than usual" },
  { l: "Designed only for women", lp: 1, ot: 0 },
  { l: "Dedicated diets", lp: 1, ot: 1 },
  { l: "Cult (home pass)", lp: 1, ot: 0 },
  { l: "Money-back guarantee", lp: 1, ot: 0 },
  { l: "Dedicated dietitians", lp: 1, ot: 0 },
  { l: "24×7 health coach", lp: 1, ot: 0 },
  { l: "GLP-1 expert doctors", lp: 1, ot: 0 },
];

const FAQ_DATA = [
  { q: "Will I lose weight in time for my wedding?", a: "Most brides start the 1-Month Program 4–8 weeks before their date and see visible change within the first few weeks. Your runway and plan are mapped to your exact wedding date." },
  { q: "Is GLP-1 safe? Do I need a prescription?", a: "Yes — the protocol is fully doctor-led. Medication is delivered only if our doctors prescribe it after your blood test and consultation." },
  { q: "Will my skin sag or look dull after losing weight?", a: "Our protocol is built for gradual, supervised loss with nutrition and hydration support designed to firm and brighten skin." },
  { q: "What if I have very little time before the wedding?", a: "The 1-Month Program is our wedding sprint, engineered to peak your glow fast. Pick your timeline above to see what's possible." },
  { q: "What does the price include?", a: "At-home advanced blood test, doctor + dietitian consults, your personalised GLP-1 protocol (if prescribed), weekly glow check-ins and a bridal nutrition plan." },
  { q: "Is there a refund if it doesn't work for me?", a: "Yes — we offer a guaranteed refund policy. Speak to our team for the full terms before you start." },
];

export default function BridesEditPage() {
  const [faqOpen, setFaqOpen] = useState(0);
  const [funnelOpen, setFunnelOpen] = useState(false);
  const [funnelMonths, setFunnelMonths] = useState<number | null>(null);

  const openFunnel = () => { setFunnelMonths(null); setFunnelOpen(true); };
  const openFunnelWithMonths = (m: number) => { setFunnelMonths(m); setFunnelOpen(true); };

  const hatch = "repeating-linear-gradient(135deg,#ffffff,#ffffff 13px,#FDF6EA 13px,#FDF6EA 26px)";

  return (
    <div className="lp-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Playfair+Display:wght@500;600&display=swap');
        @keyframes meblink { 0%,100%{opacity:.35} 50%{opacity:1} }
        .lp-page{ background:#FDF6EA; min-height:100vh; font-family:'Jost',sans-serif; color:#2A2020; padding:0; }
        .lp-card{ position:relative; background:#fff; width:100%; max-width:460px; margin:0 auto; overflow:visible; }
        .lp-card input::placeholder{ color:#C2B6A6; }
        .hdr{ padding-left:22px; padding-right:22px; }
        .sec{ padding:48px 22px; }
        .hero{ display:grid; gap:30px; grid-template-columns:1fr; }
        .editorial{ display:grid; gap:26px; grid-template-columns:1fr; }
        .g-stats{ display:grid; grid-template-columns:1fr 1fr; }
        .g-months{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .g-benefits{ display:grid; grid-template-columns:1fr; }
        .g-timeline{ display:grid; grid-template-columns:1fr; }
        .tl-item{ display:flex; gap:16px; padding:18px 2px; border-bottom:1px solid #FFFDF9; align-items:baseline; }
        .g-testi{ display:grid; gap:18px; grid-template-columns:1fr; }
        .g-experts{ display:grid; gap:14px; grid-template-columns:1fr 1fr; }
        .g-guard{ display:grid; grid-template-columns:1fr; }
        .gd-item{ padding:22px 2px; border-bottom:1px solid #FFFDF9; }
        .boxed{ width:100%; }
        .narrow{ width:100%; }
        @media (min-width:900px){
          .lp-page{ padding:32px 20px; }
          .lp-card{ max-width:1140px; box-shadow:0 40px 90px -60px rgba(181,32,44,.4); border-radius:6px; }
          .hdr{ padding-left:56px; padding-right:56px; }
          .sec{ padding:74px 56px; }
          .hero{ grid-template-columns:1.05fr .95fr; align-items:center; gap:56px; }
          .editorial{ grid-template-columns:1fr 1fr; align-items:center; gap:52px; }
          .g-stats{ grid-template-columns:repeat(4,1fr); }
          .g-months{ grid-template-columns:repeat(6,1fr); }
          .g-benefits{ grid-template-columns:1fr 1fr; column-gap:48px; }
          .g-timeline{ grid-template-columns:repeat(4,1fr); gap:20px; }
          .tl-item{ flex-direction:column; border:1px solid #FFFDF9; border-radius:8px; padding:24px; gap:9px; align-items:flex-start; }
          .g-testi{ grid-template-columns:repeat(3,1fr); }
          .g-experts{ grid-template-columns:repeat(4,1fr); gap:22px; }
          .g-guard{ grid-template-columns:repeat(3,1fr); column-gap:30px; }
          .gd-item{ border:1px solid #FFFDF9; border-radius:8px; padding:26px 24px; }
          .boxed{ max-width:760px; margin-left:auto; margin-right:auto; }
          .narrow{ max-width:840px; margin-left:auto; margin-right:auto; }
        }
        .plogo{ display:inline-flex; align-items:center; gap:6px; background:#fff; border-radius:10px; padding:0 18px; height:54px; box-shadow:0 4px 14px rgba(181,32,44,.12); border:1px solid #ece0c8; text-decoration:none; transition:transform .16s ease, box-shadow .16s ease; }
        .plogo:hover{ transform:translatey(-3px); box-shadow:0 10px 26px rgba(181,32,44,.18); }
        .plogo .t{ line-height:1; }
        .plartner{ display:inline-flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; background:#fff; border-radius:10px; padding:14px 22px; box-shadow:0 4px 14px rgba(181,32,44,.12); border:1px solid #ece0c8; transition:transform .16s ease, box-shadow .16s ease; }
        .plartner:hover{ transform:translatey(-3px); box-shadow:0 10px 26px rgba(181,32,44,.18); }
        .plartner img{ height:26px; width:auto; object-fit:contain; }
        .plartner .cap{ font-family:'Jost',sans-serif; font-size:8.5px; letter-spacing:.1em; text-transform:uppercase; color:#7A6F66; font-weight:400; }
        .partners-row{ display:flex; flex-wrap:nowrap; justify-content:center; align-items:stretch; gap:10px; }
        @media(max-width:520px){ .partners-row{ gap:7px; } .plartner{ padding:11px 12px; } .plartner img{ height:20px; } }
        .plogo.zee .box{ background:#e5202e; color:#fff; font-family:'playfair display',serif; font-weight:700; padding:3px 7px; border-radius:4px; font-size:17px; }
        .plogo.zee .t{ color:#141414; font-family:'playfair display',serif; font-weight:700; font-size:17px; }
        .plogo.n24 .t{ color:#0a3d91; font-weight:800; font-size:19px; letter-spacing:-.02em; }
        .plogo.n24 .t b{ color:#e5202e; }
        .plogo.ntoday .t{ color:#141414; font-weight:800; font-size:14px; }
        .plogo.ntoday .t b{ color:#1a8f4c; }
        .plogo.startup .t{ color:#141414; font-family:georgia,serif; font-weight:700; font-size:14px; font-style:italic; }
        .plogo.startup .t b{ color:#e5202e; font-style:normal; }
        .plogo.tribune .t{ color:#141414; font-family:georgia,serif; font-weight:700; font-size:17px; }
        .plogo.republic .t{ color:#0a3d91; font-family:georgia,serif; font-weight:700; font-size:14px; }
        .plogo.republic .t b{ color:#e5202e; }
      `}</style>

      <div className="lp-card">

        {/* ANNOUNCE */}
        <div style={css("background:#FAF3E6;color:#B5202C;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;text-align:center;padding:10px 14px;font-weight:500;border-bottom:1px solid rgba(181,32,44,.12)")}>First 50 brides · free Bridal Glow Panel · 62% off</div>

        {/* HEADER */}
        <header className="hdr" style={css("display:flex;align-items:center;justify-content:space-between;padding-top:18px;padding-bottom:18px;background:#fff;position:sticky;top:0;z-index:30;border-bottom:1px solid #FFFDF9")}>
          <div style={css("line-height:1")}>
            <div style={css("font-family:'Playfair Display',serif;font-size:20px;font-weight:600;letter-spacing:.01em")}>Lean Protocol</div>
            <div style={css("font-family:'Jost',sans-serif;font-size:9px;letter-spacing:.4em;color:#C9A24B;text-transform:uppercase;margin-top:3px")}>Brides Edit</div>
          </div>
          <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:600;font-size:12px;letter-spacing:.06em;text-transform:uppercase;padding:11px 18px;border-radius:2px;white-space:nowrap")}>Consult @ ₹449</button>
        </header>

        {/* HERO */}
        <section className="sec">
          <div className="hero">
            <div>
              <div style={css("display:flex;align-items:center;gap:10px;margin-bottom:22px")}>
                <span style={{ ...css("width:6px;height:6px;border-radius:50%;background:#C9A24B"), animation: "meblink 2s ease-in-out infinite" }} />
                <span style={css("font-family:'Jost',sans-serif;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5F574F;white-space:nowrap")}>Doctor guided GLP 1 · Designed for Brides · Avg 17kg Weight Loss</span>
              </div>
              <h1 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:46px;line-height:1.04;letter-spacing:-.01em;margin:0 0 22px")}>Meet your <span style={css("font-style:italic;color:#B5202C")}>Bridal Goals</span> with GLP 1</h1>
              
              <div style={css("display:flex;align-items:center;gap:18px;flex-wrap:wrap")}>
                <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:500;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:15px 28px;border-radius:2px")}>Build my bridal plan</button>
                <div style={css("font-size:12px;color:#7A6F66;line-height:1.4;font-weight:300")}><strong style={css("color:#2A2020;font-weight:600")}>1,000+ brides</strong><sup style={css("color:#C9A24B")}>*</sup><br />transformed before the aisle</div>
              </div>
            </div>
            <div style={css("position:relative")}>
              <img src="/brides/bridal-1.png" alt="Lean Protocol bride" style={css("display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center 30%;border-radius:3px;border:1px solid #FFFDF9")} />
              <div style={css("position:absolute;left:18px;bottom:18px;right:18px;background:#fff;border:1px solid #FFFDF9;border-radius:3px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center")}>
                <div style={css("text-align:left")}><div style={css("font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:#B5202C;line-height:1")}>17 kg<sup style={css("font-size:11px;color:#C9A24B")}>*</sup></div><div style={css("font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#7A6F66;margin-top:5px")}>typical loss / 5 months</div></div>
                <div style={css("width:1px;align-self:stretch;background:#FFFDF9")} />
                <div style={css("text-align:right")}><div style={css("font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:#B5202C;line-height:1")}>98%<sup style={css("font-size:11px;color:#C9A24B")}>*</sup></div><div style={css("font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#7A6F66;margin-top:5px")}>felt camera-ready</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <div style={css("background:#B5202C;padding:16px;text-align:center;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#fff;font-weight:600;line-height:2")}>Doctor-Guided &nbsp;·&nbsp; GLP-1 Backed &nbsp;·&nbsp; At-Home Blood Test &nbsp;·&nbsp; 1,000+ Transformations &nbsp;·&nbsp; Personalised</div>

        {/* STATS */}
        <section className="sec">
          <div style={css("text-align:center;font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:28px")}>Results that set us apart</div>
          <div className="g-stats" style={css("border-top:1px solid #FFFDF9;border-left:1px solid #FFFDF9")}>
            {STATS.map((s) => (
              <div key={s.label} style={css("padding:22px 14px;text-align:center;border-right:1px solid #FFFDF9;border-bottom:1px solid #FFFDF9")}>
                <div style={css("font-family:'Playfair Display',serif;font-size:36px;font-weight:500;color:#B5202C;line-height:1")}><CountUp end={s.end} prefix={s.prefix} suffix={s.suffix} /></div>
                <div style={css("font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#7A6F66;margin-top:8px")}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={css("font-size:10px;color:#9A8F84;margin:12px 2px 0;line-height:1.6;font-weight:300")}>*Based on Lean Protocol &amp; GLP-1 clinical trial data. Individual results vary.</p>
        </section>

        {/* MONTHS LEFT */}
        <section className="sec" style={css("padding-top:0;padding-bottom:0")}>
          <div className="boxed" style={css("background:#FAF3E6;border-radius:4px;padding:24px 20px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#B5202C;margin-bottom:6px")}>Your timeline</div>
            <h3 style={css("font-family:'Playfair Display',serif;font-size:23px;font-weight:500;margin:0 0 16px;line-height:1.1")}>How many months left in your special day?</h3>
            <div className="g-months">
              {[1, 2, 3, 4, 5, 6].map((v) => (
                <button key={v} onClick={() => openFunnelWithMonths(v)} style={css("cursor:pointer;background:#B5202C;border:1px solid #B5202C;color:#fff;font-family:'Playfair Display',serif;font-size:20px;font-weight:600;padding:14px 4px;border-radius:3px")}>{v === 6 ? "6+" : String(v)}</button>
              ))}
            </div>
            <div style={css("font-family:'Jost',sans-serif;font-size:11px;color:#7A6F66;margin-top:14px;font-weight:300;text-align:center")}>Tap on your timeline and we&rsquo;ll give you the bridal transformation strategy.</div>
          </div>
        </section>

        {/* EDITORIAL */}
        <section className="sec">
          <div className="editorial">
            <img src="/brides/bridal-2.png" alt="Bride getting ready" style={css("display:block;width:100%;aspect-ratio:5/4;object-fit:cover;border-radius:3px;border:1px solid #FFFDF9")} />
            <div>
              <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#7D5E1F;margin-bottom:14px")}>Start with a doctor, not a guess</div>
              <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:31px;line-height:1.08;margin:0 0 10px")}>Your bridal doctor consultation</h2>
              <div style={css("display:flex;align-items:baseline;gap:10px;margin-bottom:16px;flex-wrap:wrap")}>
                <span style={css("font-family:'Playfair Display',serif;font-size:38px;font-weight:600;color:#B5202C;line-height:1")}>₹449</span>
                <span style={css("font-family:'Jost',sans-serif;font-size:12px;letter-spacing:.03em;color:#7A6F66;font-weight:300")}>one-time · fully redeemable against your plan</span>
              </div>
              <ul style={css("list-style:none;margin:0 0 22px;padding:0;display:flex;flex-direction:column;gap:11px")}>
                <li style={css("display:flex;gap:10px;font-size:14px;color:#5F574F;line-height:1.4;font-weight:300")}><span style={css("color:#B5202C;font-weight:600")}>✓</span>1:1 video consultation with a GLP-1 doctor</li>
                <li style={css("display:flex;gap:10px;font-size:14px;color:#5F574F;line-height:1.4;font-weight:300")}><span style={css("color:#B5202C;font-weight:600")}>✓</span>Personalised fat-loss plan</li>
                <li style={css("display:flex;gap:10px;font-size:14px;color:#5F574F;line-height:1.4;font-weight:300")}><span style={css("color:#B5202C;font-weight:600")}>✓</span>Skin glow protocol &amp; next steps</li>
                <li style={css("display:flex;gap:10px;font-size:14px;color:#5F574F;line-height:1.4;font-weight:300")}><span style={css("color:#B5202C;font-weight:600")}>✓</span>Valid prescription straight in your inbox</li>
              </ul>
              <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:500;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:15px 30px;border-radius:3px")}>Book my ₹449 consultation</button>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:34px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:12px")}>The Bridal Glow Protocol</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.06;margin:0")}>4 Ways We Make This Happen</h2>
          </div>
          <div className="g-benefits" style={css("border-top:1px solid #FFFDF9")}>
            {BENEFITS.map((b) => (
              <div key={b.no} style={css("display:flex;gap:18px;padding:22px 2px;border-bottom:1px solid #FFFDF9")}>
                <div style={css("font-family:'Playfair Display',serif;font-size:22px;font-weight:500;color:#C9A24B;line-height:1;flex-shrink:0;width:34px")}>{b.no}</div>
                <div><h3 style={css("font-family:'Playfair Display',serif;font-size:22px;font-weight:500;margin:0 0 7px;line-height:1.1")}>{b.t}</h3><p style={css("font-size:13px;line-height:1.6;color:#5F574F;margin:0;font-weight:300")}>{b.d}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:30px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:12px")}>Why brides choose us</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:28px;margin:0 0 6px")}>Bridal package vs other GLP-1 programs</h2>
            <p style={css("font-size:12.5px;color:#7A6F66;font-weight:300;margin:0")}>An honest look at what sets the Brides Edit apart.</p>
          </div>
          <div className="narrow" style={css("border:1px solid #FFFDF9;border-radius:4px;overflow:hidden")}>
            <div style={css("display:grid;grid-template-columns:1.6fr 1fr 1fr;background:#FAF3E6;border-bottom:1px solid #FFFDF9")}>
              <div style={css("padding:13px 14px;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.06em;color:#7A6F66;text-transform:uppercase;font-weight:500")}>What you get</div>
              <div style={css("font-family:'Playfair Display',serif;padding:13px 6px;text-align:center;font-size:13px;font-weight:600;color:#B5202C;line-height:1.1")}>Lean Protocol<br /><span style={css("font-family:'Jost',sans-serif;font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:500")}>Bridal</span></div>
              <div style={css("padding:13px 6px;text-align:center;font-family:'Jost',sans-serif;font-size:11px;color:#9A8F84;font-weight:500;line-height:1.2")}>Other GLP-1<br />programs</div>
            </div>
            {COMPARE_RAW.map((r) => (
              <div key={r.l} style={css("display:grid;grid-template-columns:1.6fr 1fr 1fr;border-bottom:1px solid #FDF6EA;align-items:center")}>
                <div style={css("padding:14px;font-size:12.5px;color:#2A2020;font-weight:400")}>{r.l}</div>
                <div style={{ ...css("padding:14px 6px;text-align:center;font-size:16px;font-weight:600"), color: r.lp ? RED : "#E2D6C2" }}>{r.lp ? "✓" : "✕"}</div>
                <div style={css("padding:11px 6px;text-align:center")}>
                  <div style={{ ...css("font-size:16px;font-weight:600"), color: r.ot ? RED : "#E2D6C2" }}>{r.ot ? "✓" : "✕"}</div>
                  {r.note && <div style={css("font-family:'Jost',sans-serif;font-size:8.5px;letter-spacing:.02em;color:#9A8F84;margin-top:3px;line-height:1.2;font-weight:300")}>{r.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PARTNERS */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:30px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:12px")}>The company we keep</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:28px;margin:0 0 6px")}>Our trusted partners</h2>
            <p style={css("font-size:12.5px;color:#7A6F66;font-weight:300;margin:0")}>Labs, medicines and fitness, handled by names you already trust.</p>
          </div>
          <div className="partners-row">
            <div className="plartner">
              <img src="/lp-assets/logo-cult.png" alt="Cult" />
              <div className="cap">For Cult Pass Home</div>
            </div>
            <div className="plartner">
              <img src="/lp-assets/logo-redcliffe.png" alt="Redcliffe Labs" />
              <div className="cap">For Blood Tests</div>
            </div>
            <div className="plartner">
              <img src="/lp-assets/logo-mrmed.jpg" alt="Mr.Med" />
              <div className="cap">For Medicine Delivery</div>
            </div>
          </div>
        </section>
        {/* TIMELINE */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:34px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:12px")}>Your 30 days to the aisle</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:29px;line-height:1.08;margin:0 0 10px")}>From consult to camera-ready.</h2>
            <p style={css("font-size:13px;color:#7A6F66;font-weight:300;margin:0")}>It all starts with one ₹449 doctor consultation.</p>
          </div>
          <div className="g-timeline">
            {STEPS.map((s) => (
              <div key={s.w} className="tl-item">
                <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#C9A24B;font-weight:500;width:64px;flex-shrink:0")}>{s.w}</div>
                <div><h4 style={css("font-family:'Playfair Display',serif;font-size:19px;font-weight:500;color:#2A2020;margin:0 0 5px")}>{s.t}</h4><p style={css("font-size:12.5px;line-height:1.55;color:#7A6F66;margin:0;font-weight:300")}>{s.d}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:34px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:12px")}>Real brides · Real results</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;margin:0")}>1,000+ transformations<sup style={css("font-size:16px;color:#C9A24B")}>*</sup></h2>
          </div>
          <div className="g-testi">
            {BRIDES.map((t) => (
              <div key={t.n} style={css("border:1px solid #FFFDF9;border-radius:4px;overflow:hidden")}>
                <div style={css("position:relative;background:#000;aspect-ratio:3/2")}>
                  <video controls playsInline preload="metadata" src={t.video} style={css("width:100%;height:100%;display:block;object-fit:cover")} />
                  <div style={css("position:absolute;top:12px;right:12px;background:#fff;border:1px solid #ECE0C8;color:#B5202C;font-family:'Jost',sans-serif;font-size:11px;font-weight:500;padding:4px 11px;border-radius:999px;pointer-events:none")}>{t.loss}</div>
                </div>
                <div style={css("padding:20px 22px")}>
                  <div style={css("color:#C9A24B;font-size:13px;margin-bottom:10px;letter-spacing:3px")}>★★★★★</div>
                  <p style={css("font-family:'Playfair Display',serif;line-height:1.5;color:#5F574F;font-style:italic;font-size:18px;margin:0 0 14px")}>&ldquo;{t.q}&rdquo;</p>
                  <div style={css("display:flex;justify-content:space-between;align-items:center;border-top:1px solid #FFFDF9;padding-top:12px")}><div style={css("font-family:'Jost',sans-serif;font-weight:600;font-size:12.5px")}>{t.n}</div><div style={css("font-family:'Jost',sans-serif;font-size:11px;color:#9A8F84;font-weight:300")}>{t.m}</div></div>
                </div>
              </div>
            ))}
          </div>
          <p style={css("text-align:center;font-size:10px;color:#9A8F84;margin-top:18px;line-height:1.6;font-weight:300")}>*Based on Lean Protocol internal data. Individual results vary; medication is prescribed at a doctor&rsquo;s discretion.</p>
        </section>

        {/* EXPERTS */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:32px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:12px")}>Your team, not an app</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:28px;margin:0")}>Doctors &amp; dietitians in your corner</h2>
            <p style={css("font-family:'Jost',sans-serif;font-size:13.5px;line-height:1.6;color:#5F574F;font-weight:300;max-width:600px;margin:14px auto 0")}>Not general physicians. Not pharmacy counters. Every prescription comes from an NMC-registered endocrinologist or internal medicine doctor who treats metabolic conditions every day.</p>
          </div>
          <div className="g-experts">
            {EXPERTS.map((e) => (
              <div key={e.n} style={css("text-align:center")}>
                <img src={e.img} alt={e.n} style={css("display:block;width:100%;aspect-ratio:1/1;object-fit:cover;object-position:center top;border-radius:3px;border:1px solid #FFFDF9;margin-bottom:12px")} />
                <div style={css("font-family:'Playfair Display',serif;font-size:18px;font-weight:500")}>{e.n}</div>
                <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.04em;color:#7A6F66;margin-top:4px;font-weight:300")}>{e.r}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PRESS */}
        <section className="sec" style={css("padding-bottom:0")}>
          <h2 style={css("text-align:center;font-family:'Playfair Display',serif;font-weight:500;font-size:28px;line-height:1.1;margin:0 0 6px")}>Lean Protocol — Featured across India&rsquo;s leading publications</h2>
          <p style={css("text-align:center;font-size:12.5px;color:#7A6F66;font-weight:300;margin:0 0 20px")}>Click any publication to read the full coverage.</p>
          <div style={css("display:flex;flex-wrap:wrap;justify-content:center;gap:10px")}>
            {PRESS.map((pr, i) => (
              <a key={i} className={`plogo ${pr.className}`} href={pr.url} target="_blank" rel="noopener noreferrer">{pr.content}</a>
            ))}
          </div>
        </section>

        {/* FUNNEL INTRO */}
        <section className="sec">
          <div className="boxed" style={css("background:#B5202C;border-radius:4px;padding:32px 24px;color:#fff;text-align:center")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#F3E6C8;margin-bottom:14px")}>Personalised in 60 seconds</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:29px;line-height:1.08;margin:0 0 12px")}>Build your bridal plan &amp; spin for a bonus</h2>
            <p style={css("font-size:13.5px;line-height:1.6;color:#F3E6C8;font-weight:300;margin:0 0 22px")}>Tell us your timeline and a few details — we&rsquo;ll check your eligibility, recommend your plan, and let you spin the wheel for an exclusive bridal bonus.</p>
            <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#fff;color:#B5202C;font-family:'Jost',sans-serif;font-weight:600;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:16px 30px;border-radius:3px")}>Unlock my offers</button>
          </div>
        </section>

        {/* GUARANTEES */}
        <section className="sec" style={css("padding-bottom:0")}>
          <div className="g-guard">
            {[["Refund policy", "A guaranteed refund policy backs your program. Start with confidence — ask our team for full terms."], ["Doctor-only meds", "Medication is delivered strictly when prescribed by our doctors after diagnostics — never over the counter."], ["Made for India", "Protocols tuned to Indian bodies, diets and wedding timelines — with 1,000+ bridal transformations."]].map(([t, d]) => (
              <div key={t} className="gd-item"><div style={css("font-family:'Playfair Display',serif;font-size:21px;color:#B5202C;font-weight:500;margin-bottom:6px")}>{t}</div><p style={css("font-size:12.5px;line-height:1.6;color:#5F574F;margin:0;font-weight:300")}>{d}</p></div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:30px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:12px")}>Before you say yes</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:29px;margin:0")}>Bride&rsquo;s questions, answered</h2>
          </div>
          <div className="narrow" style={css("border-top:1px solid #FFFDF9")}>
            {FAQ_DATA.map((f, i) => (
              <div key={i} onClick={() => setFaqOpen((o) => (o === i ? -1 : i))} style={css("cursor:pointer;padding:20px 2px;border-bottom:1px solid #FFFDF9")}>
                <div style={css("display:flex;justify-content:space-between;align-items:center;gap:14px")}><h4 style={css("font-family:'Jost',sans-serif;font-size:14px;font-weight:500;color:#2A2020;margin:0")}>{f.q}</h4><span style={css("color:#B5202C;font-size:20px;font-weight:300;flex-shrink:0")}>{faqOpen === i ? "–" : "+"}</span></div>
                {faqOpen === i && <p style={css("font-size:13px;line-height:1.65;color:#5F574F;margin:12px 0 0;font-weight:300")}>{f.a}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="sec" style={css("text-align:center")}>
          <div className="boxed" style={css("background:#FAF3E6;border-radius:4px;padding:40px 22px 48px")}>
            <img src="/brides/bridal-3.png" alt="Radiant bride" style={css("display:block;width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:3px;margin:0 0 28px")} />
            <div style={css("font-family:'Jost',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#7D5E1F;margin-bottom:18px")}>Limited seats</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.06;margin:0 0 14px")}>Your glow has a deadline.<br />So does this offer.</h2>
            <p style={css("font-size:14px;color:#5F574F;max-width:300px;margin:0 auto 26px;font-weight:300")}>Lock your bridal seat before this month&rsquo;s 50 fill up.</p>
            <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:500;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:16px 32px;border-radius:3px")}>Build my bridal plan</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="hdr" style={css("border-top:1px solid #FFFDF9;padding-top:30px;padding-bottom:30px")}>
          <div style={css("font-family:'Playfair Display',serif;font-size:19px;font-weight:600;margin-bottom:12px")}>Lean Protocol <span style={css("color:#C9A24B;font-size:10px;font-family:'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase")}>Brides Edit</span></div>
          <div style={css("font-size:9.5px;color:#9A8F84;line-height:1.7;font-weight:300")}>*All transformations, statistics, weight-loss figures and success rates shown are based on Lean Protocol&rsquo;s internal data and are not a guarantee of results. Individual outcomes vary. GLP-1 medication is prescribed solely at a qualified doctor&rsquo;s discretion following diagnostics and consultation. This page is informational and is not medical advice. © 2026 Lean Protocol Pvt Ltd.</div>
        </footer>

        {/* STICKY BAR (hidden while the funnel is open) */}
        {!funnelOpen && (
          <div className="hdr" style={css("position:sticky;bottom:0;background:rgba(255,255,255,.97);backdrop-filter:blur(8px);border-top:1px solid #FFFDF9;padding-top:13px;padding-bottom:13px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;z-index:30")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:12px;color:#7A6F66;font-weight:300;line-height:1.3")}>Only 17 of 50 bridal seats left<br /><span style={css("color:#B5202C;font-weight:500")}>Free Bridal Glow Panel inside</span></div>
            <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:500;font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;padding:12px 22px;border-radius:3px;white-space:nowrap")}>Build my plan</button>
          </div>
        )}
      </div>

      {/* FUNNEL — separate component */}
      <BridesFunnel open={funnelOpen} initialMonths={funnelMonths} onClose={() => setFunnelOpen(false)} />
    </div>
  );
}
