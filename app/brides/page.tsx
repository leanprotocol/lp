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
  { end: 22, prefix: "18–", suffix: "%", label: "Avg weight loss" },
  { end: 98, suffix: "%", label: "Success rate" },
  { end: 88, suffix: "%", label: "Faced natural skin glow" },
  { end: 78, suffix: "%", label: "Got two shades lighter" },
];

const BENEFITS = [
  { no: "01", t: "Real fat & weight loss", d: "A doctor-guided GLP-1 protocol that targets stored fat — not crash dieting — so the loss is real and visible." },
  { no: "02", t: "Faster metabolism", d: "Root-cause diagnostics fix what slows you down, so your body keeps burning long after the wedding." },
  { no: "03", t: "Glowing skin", d: "Better metabolic health, hydration and nutrition show up where it matters most — your face, on camera." },
  { no: "04", t: "Tighter skin", d: "Gradual, supervised loss plus targeted support helps skin firm and tighten as you transform." },
];

const STEPS = [
  { w: "Week 1", t: "Test & map", d: "At-home blood test + doctor and dietitian consult to build your protocol." },
  { w: "Week 2", t: "Protocol begins", d: "GLP-1 (if prescribed) delivered home; glow nutrition starts." },
  { w: "Week 3", t: "Visible shift", d: "Inches drop, energy lifts, skin starts to brighten." },
  { w: "Week 4", t: "Camera-ready", d: "Peak glow check-in and final tweaks before your big day." },
];

const BRIDES = [
  { n: "Atreyee", loss: "−8.2 kg", m: "in 1 month", q: "My lehenga fitting felt like a different person. The glow was unreal in every photo.", video: "/brides/atreyee.mp4" },
  { n: "Ananya", loss: "−7.4 kg", m: "in 1 month", q: "Started 5 weeks before the wedding. Tighter face, zero bloat, all my candids look editorial.", video: "/brides/ananya.mp4" },
  { n: "Roshni", loss: "−9.1 kg", m: "in 5 weeks", q: "The doctor-led plan made me feel safe — and the metabolism change has lasted past the honeymoon.", video: "/brides/roshni.mp4" },
];

const EXPERTS = [
  { n: "Dr. Nishant Jain", r: "MD, DM (Endocrinology)", img: "/brides/doctors/nishant.jpeg" },
  { n: "Dr. Akhil Konduru", r: "MD, Internal Medicine", img: "/brides/doctors/akhil.jpeg" },
  { n: "Dr. Siddharth Garg", r: "Physician", img: "/brides/doctors/siddharth.jpeg" },
  { n: "Dr. Gautam Kumar", r: "Physician", img: "/brides/doctors/gautam.jpeg" },
  { n: "Alisha Gupta", r: "GLP-1 Expert Dietitian", img: "/brides/doctors/alisha.jpeg" },
  { n: "Simran Kumawat", r: "Weight Loss Dietitian", img: "/brides/doctors/simran.jpeg" },
  { n: "Richa Sharma", r: "Senior Dietitian", img: "/brides/doctors/richa-sharma.jpeg" },
  { n: "Aparna Tandon", r: "Dietitian", img: "/brides/doctors/aparna.jpeg" },
  { n: "Richa Singh", r: "Fat Loss & Yoga Expert", img: "/brides/doctors/richa-singh.jpeg" },
  { n: "Alka Bharti", r: "Dietitian", img: "/brides/doctors/alka.jpeg" },
];

const PRESS = [
  { name: "Zee News", url: "https://zeenews.india.com/consumer-connect/the-glp-1-hype-how-lean-protocol-is-building-a-sustainable-weight-loss-ecosystem-3055350.html" },
  { name: "News24", url: "https://news24online.com/information/the-entrepreneurial-journey-behind-a-glp-1-startup-lean-protocol/860995/" },
  { name: "The Tribune", url: "https://www.tribuneindia.com/partner-exclusives/is-lean-protocol-building-a-sustainable-weight-loss-ecosystem-or-another-weight-loss-hype/" },
  { name: "The Startup Story", url: "https://thestartupstory.co.in/why-india-needs-a-new-approach-to-weight-loss-the-lean-protocol-perspective/" },
  { name: "News Today 24x7", url: "https://www.newstoday24x7.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
  { name: "The Republic News", url: "https://www.therepublicnews.co.in/2026/04/from-gimmicks-to-ethics-entrepreneurial.html" },
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
        .lp-card{ position:relative; background:#fff; width:100%; max-width:460px; margin:0 auto; overflow:hidden; }
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
          <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:500;font-size:12px;letter-spacing:.06em;text-transform:uppercase;padding:11px 18px;border-radius:2px;white-space:nowrap")}>Claim 62% off</button>
        </header>

        {/* HERO */}
        <section className="sec">
          <div className="hero">
            <div>
              <div style={css("display:flex;align-items:center;gap:10px;margin-bottom:22px")}>
                <span style={{ ...css("width:6px;height:6px;border-radius:50%;background:#C9A24B"), animation: "meblink 2s ease-in-out infinite" }} />
                <span style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.26em;text-transform:uppercase;color:#7A6F66")}>Doctor-guided GLP-1 · made for the aisle</span>
              </div>
              <h1 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:46px;line-height:1.04;letter-spacing:-.01em;margin:0 0 22px")}>Glow into the most <span style={css("font-style:italic;color:#B5202C")}>photographed</span> day of your life.</h1>
              <p style={css("font-size:15px;line-height:1.65;color:#5F574F;margin:0 0 30px;font-weight:300")}>A doctor-designed GLP-1 program mapped to your wedding timeline — real fat &amp; weight loss, a faster metabolism, and visibly tighter, glowing skin. Engineered to peak on your big day.</p>
              <div style={css("display:flex;align-items:center;gap:18px;flex-wrap:wrap")}>
                <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#B5202C;color:#fff;font-family:'Jost',sans-serif;font-weight:500;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:15px 28px;border-radius:2px")}>Build my bridal plan</button>
                <div style={css("font-size:12px;color:#7A6F66;line-height:1.4;font-weight:300")}><strong style={css("color:#2A2020;font-weight:600")}>1,000+ brides</strong><sup style={css("color:#C9A24B")}>*</sup><br />transformed before the aisle</div>
              </div>
            </div>
            <div style={css("position:relative")}>
              <img src="/brides/bridal-1.png" alt="Lean Protocol bride" style={css("display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center 30%;border-radius:3px;border:1px solid #FFFDF9")} />
              <div style={css("position:absolute;left:18px;bottom:18px;right:18px;background:#fff;border:1px solid #FFFDF9;border-radius:3px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center")}>
                <div style={css("text-align:left")}><div style={css("font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:#B5202C;line-height:1")}>7–9 kg<sup style={css("font-size:11px;color:#C9A24B")}>*</sup></div><div style={css("font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#7A6F66;margin-top:5px")}>typical loss / 1-month</div></div>
                <div style={css("width:1px;align-self:stretch;background:#FFFDF9")} />
                <div style={css("text-align:right")}><div style={css("font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:#B5202C;line-height:1")}>98%<sup style={css("font-size:11px;color:#C9A24B")}>*</sup></div><div style={css("font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#7A6F66;margin-top:5px")}>felt camera-ready</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <div style={css("border-top:1px solid #FFFDF9;border-bottom:1px solid #FFFDF9;padding:16px;text-align:center;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#7A6F66;font-weight:400;line-height:2")}>Doctor-Guided &nbsp;·&nbsp; GLP-1 Backed &nbsp;·&nbsp; At-Home Blood Test &nbsp;·&nbsp; 1,000+ Transformations &nbsp;·&nbsp; Personalised</div>

        {/* STATS */}
        <section className="sec">
          <div style={css("text-align:center;font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:28px")}>Clinically proven</div>
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
                <button key={v} onClick={() => openFunnelWithMonths(v)} style={css("cursor:pointer;background:#fff;border:1px solid #ECE0C8;color:#B5202C;font-family:'Jost',sans-serif;font-size:14px;font-weight:500;padding:14px 4px;border-radius:3px")}>{v === 6 ? "6+" : String(v)}</button>
              ))}
            </div>
            <div style={css("font-family:'Jost',sans-serif;font-size:11px;color:#7A6F66;margin-top:14px;font-weight:300;text-align:center")}>Tap your timeline — we&rsquo;ll build your plan &amp; unlock your offer.</div>
          </div>
        </section>

        {/* EDITORIAL */}
        <section className="sec">
          <div className="editorial">
            <img src="/brides/bridal-2.jpg" alt="Bride getting ready" style={css("display:block;width:100%;aspect-ratio:5/4;object-fit:cover;border-radius:3px;border:1px solid #FFFDF9")} />
            <div>
              <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:#C9A24B;margin-bottom:14px")}>The day you&rsquo;ll relive for decades</div>
              <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:31px;line-height:1.08;margin:0 0 18px")}>Let&rsquo;s make these photos ones you love.</h2>
              <p style={css("font-size:14.5px;line-height:1.68;color:#5F574F;margin:0 0 16px;font-weight:300")}>Crash diets leave you drained, dull and bloated for the very week you can&rsquo;t afford it. The Brides Edit is the opposite — a calm, doctor-led protocol that has you looking and feeling your most radiant the moment the cameras come out.</p>
              <p style={css("font-size:14.5px;line-height:1.68;color:#5F574F;margin:0;font-weight:300")}>No starving. No guesswork. Just a protocol mapped to your date, your body, and your big entrance.</p>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:34px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>The Bridal Glow Protocol</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:30px;line-height:1.06;margin:0")}>Four shifts your mirror will notice</h2>
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
            <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Why brides choose us</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:28px;margin:0 0 6px")}>Bridal package vs other GLP-1</h2>
            <p style={css("font-size:12.5px;color:#7A6F66;font-weight:300;margin:0")}>An honest look at what sets the Brides Edit apart.</p>
          </div>
          <div className="narrow" style={css("border:1px solid #FFFDF9;border-radius:4px;overflow:hidden")}>
            <div style={css("display:grid;grid-template-columns:1.6fr 1fr 1fr;background:#FAF3E6;border-bottom:1px solid #FFFDF9")}>
              <div style={css("padding:13px 14px;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.06em;color:#7A6F66;text-transform:uppercase;font-weight:500")}>What you get</div>
              <div style={css("font-family:'Playfair Display',serif;padding:13px 6px;text-align:center;font-size:13px;font-weight:600;color:#B5202C;line-height:1.1")}>Lean Protocol<br /><span style={css("font-family:'Jost',sans-serif;font-size:8.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:500")}>Bridal</span></div>
              <div style={css("padding:13px 6px;text-align:center;font-family:'Jost',sans-serif;font-size:11px;color:#9A8F84;font-weight:500;line-height:1.2")}>Other<br />GLP-1</div>
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

        {/* TIMELINE */}
        <section className="sec">
          <div style={css("text-align:center;margin-bottom:34px")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Your 30 days to the aisle</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:29px;line-height:1.08;margin:0 0 10px")}>Results that move fast, because your date won&rsquo;t.</h2>
            <p style={css("font-size:13px;color:#7A6F66;font-weight:300;margin:0")}>Most brides start the 1-Month Program 4–8 weeks out.</p>
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
            <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Real brides · Real results</div>
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
            <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Your team, not an app</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:28px;margin:0")}>Doctors &amp; dietitians in your corner</h2>
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
          <div style={css("text-align:center;font-family:'Jost',sans-serif;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:#9A8F84;margin-bottom:8px")}>Featured across India&rsquo;s leading publications</div>
          <p style={css("text-align:center;font-size:12.5px;color:#7A6F66;font-weight:300;margin:0 0 20px")}>Click any publication to read the full coverage.</p>
          <div style={css("display:flex;flex-wrap:wrap;justify-content:center;gap:10px")}>
            {PRESS.map((pr) => (
              <a key={pr.name} href={pr.url || "#"} target="_blank" rel="noopener noreferrer" style={css("text-decoration:none;display:flex;align-items:center;justify-content:center;background:#B5202C;border:1px solid #B5202C;border-radius:3px;padding:11px 16px")}>
                <span style={css("font-family:'Playfair Display',serif;font-size:15px;font-weight:500;color:#fff")}>{pr.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* FUNNEL INTRO */}
        <section className="sec">
          <div className="boxed" style={css("background:#B5202C;border-radius:4px;padding:32px 24px;color:#fff;text-align:center")}>
            <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#F3E6C8;margin-bottom:14px")}>Personalised in 60 seconds</div>
            <h2 style={css("font-family:'Playfair Display',serif;font-weight:500;font-size:29px;line-height:1.08;margin:0 0 12px")}>Build your bridal plan &amp; spin for a bonus</h2>
            <p style={css("font-size:13.5px;line-height:1.6;color:#F3E6C8;font-weight:300;margin:0 0 22px")}>Tell us your timeline and a few details — we&rsquo;ll check your eligibility, recommend your plan, and let you spin the wheel for an exclusive bridal bonus.</p>
            <button onClick={openFunnel} style={css("border:none;cursor:pointer;background:#fff;color:#B5202C;font-family:'Jost',sans-serif;font-weight:600;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:16px 30px;border-radius:3px")}>Start &amp; unlock my offer</button>
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
            <div style={css("font-family:'Jost',sans-serif;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:12px")}>Before you say yes</div>
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
            <img src="/brides/bridal-3.jpg" alt="Radiant bride" style={css("display:block;width:100%;aspect-ratio:3/2;object-fit:cover;border-radius:3px;margin:0 0 28px")} />
            <div style={css("font-family:'Jost',sans-serif;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:#C9A24B;margin-bottom:18px")}>Limited seats</div>
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
