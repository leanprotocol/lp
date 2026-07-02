"use client";

import { useEffect, useRef, useState } from "react";

/* GLP-1 Masterclass — public landing + email/password login + gated course player.
   Progress (active lesson + completed) is stored per user on the server, so students
   resume across devices. Theme: blue (#2563eb) / slate. */

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

const BLUE = "#2563eb";

/* Page shell — module-level so it never remounts on re-render (keeps input focus). */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={css("background:#f8fafc;min-height:100vh;font-family:'Inter',system-ui,sans-serif;color:#0f172a")}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .mc-in{ max-width:1080px; margin:0 auto; padding:0 20px; }
        .mc-grid2{ display:grid; grid-template-columns:1fr; gap:22px; }
        .mc-get{ display:grid; grid-template-columns:1fr; gap:12px; }
        .mc-experts{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .mc-testi{ display:grid; grid-template-columns:1fr; gap:14px; }
        .mc-player{ display:grid; grid-template-columns:1fr; gap:20px; align-items:start; }
        @media (min-width:900px){
          .mc-grid2{ grid-template-columns:1.05fr .95fr; gap:44px; align-items:center; }
          .mc-get{ grid-template-columns:1fr 1fr 1fr; gap:16px; }
          .mc-experts{ grid-template-columns:repeat(4,1fr); gap:16px; }
          .mc-testi{ grid-template-columns:1fr 1fr; gap:18px; }
          .mc-player{ grid-template-columns:320px 1fr; gap:28px; }
        }
      `}</style>
      {children}
    </div>
  );
}

const LESSONS = [
  { t: "Understanding Obesity", d: "Why weight gain happens — hormones, metabolism, and the real science of appetite." },
  { t: "The Science Behind GLP-1", d: "What GLP-1 actually is and the biology that makes it effective." },
  { t: "How GLP-1 Medicines Work", d: "Appetite, blood sugar and digestion — explained in plain language." },
  { t: "Available GLP-1 Medicines", d: "Ozempic, Wegovy, Mounjaro and more — how the options differ." },
  { t: "Who Should & Shouldn't Take Them", d: "Eligibility, contraindications and the red flags to know." },
  { t: "Managing Side Effects", d: "Nausea, fatigue and how to minimise them safely." },
  { t: "Nutrition While Using GLP-1", d: "Protein, hydration and eating well on a smaller appetite." },
  { t: "Exercise & Muscle Preservation", d: "Training to keep muscle while you lose fat." },
  { t: "Common Myths", d: "Separating internet noise from the actual evidence." },
  { t: "Your Weight Loss Journey", d: "What to realistically expect, month by month." },
  { t: "Long-Term Success", d: "Maintaining results and life after medication." },
  { t: "Everything You Need Before Starting", d: "Your pre-start checklist and doctor conversation guide." },
];
// Optional: add a video embed URL per lesson (YouTube/Vimeo/hosted). Empty = placeholder.
const LESSON_VIDEOS: (string | null)[] = LESSONS.map(() => null);

const GET = [
  { t: "12 Expert Video Lessons", d: "Structured, doctor-led curriculum." },
  { t: "2 Hours of Learning", d: "Concise lessons, ~10 min each." },
  { t: "Downloadable Notes", d: "PDF summary for every lesson." },
  { t: "GLP-1 Beginner Handbook", d: "Your plain-language starter guide." },
  { t: "Side Effect Guide", d: "Manage symptoms with confidence." },
  { t: "Diet Guide", d: "What to eat during treatment." },
  { t: "Progress Tracker", d: "Stay on top of your journey." },
  { t: "Lifetime Access", d: "Watch anytime, forever." },
  { t: "Mobile & Desktop Access", d: "Learn on any device." },
];

const EXPERTS = [
  { n: "Dr. Nishant Jain", r: "MD, DM (Endocrinology)" },
  { n: "Dr. Akhil Konduru", r: "MD, Internal Medicine" },
  { n: "Dr. Siddharth Garg", r: "MD, Internal Medicine" },
  { n: "Dr. Gautam Kumar", r: "MD, DM (Endocrinology)" },
  { n: "Alisha Gupta", r: "GLP-1 Expert Dietitian" },
  { n: "Simran Kumawat", r: "Weight Loss Dietitian" },
  { n: "Richa Sharma", r: "Senior Dietitian" },
  { n: "Richa Singh", r: "Yoga & Fat Loss Expert" },
];

const TESTI = [
  { name: "Pratima", meta: "37 · Lost 7 kg in 2.5 months", initials: "PR", quote: "I finally understood how GLP-1 actually works before starting. Everything is explained so simply." },
  { name: "Manav", meta: "24 · Lost 20 kg in 5 months", initials: "MA", quote: "The myths lesson alone changed my mind. I went in informed and felt in control the whole way." },
];

const FAQS = [
  { q: "How long is the course?", a: "12 lessons of about 10 minutes each — roughly 2 hours of focused learning in total." },
  { q: "Will I get lifetime access?", a: "Yes. One payment gives you lifetime access, and you can resume from where you left off on any device." },
  { q: "How do I access it after buying?", a: "At checkout you set an email and password. Use them to log in anytime and pick up where you left off." },
  { q: "Do I need to already be on GLP-1?", a: "No. The course is useful whether you're considering GLP-1, already taking it, or just want science-backed information." },
  { q: "Is this medical advice?", a: "No — it's educational. Always consult a qualified doctor before starting or changing any medication." },
];

type Me = { email: string; name: string | null; purchased: boolean; activeModule: number; completed: unknown };

export default function MasterclassPage() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<Me | null>(null);

  // auth card
  const [mode, setMode] = useState<"buy" | "login">("buy");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // player state
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [openFaq, setOpenFaq] = useState(0);
  const savingRef = useRef(false);

  useEffect(() => {
    fetch("/api/masterclass/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.loggedIn) {
          setMe(d.user);
          setActive(d.user.activeModule || 0);
          setCompleted(Array.isArray(d.user.completed) ? d.user.completed : []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveProgress = (am: number, comp: number[]) => {
    if (savingRef.current) return;
    savingRef.current = true;
    fetch("/api/masterclass/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeModule: am, completed: comp }),
    }).catch(() => {}).finally(() => { savingRef.current = false; });
  };

  const goTo = (i: number) => { setActive(i); saveProgress(i, completed); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const markComplete = () => {
    const comp = completed.includes(active) ? completed : [...completed, active];
    setCompleted(comp);
    const nextIdx = Math.min(LESSONS.length - 1, active + 1);
    setActive(nextIdx);
    saveProgress(nextIdx, comp);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = async () => { await fetch("/api/masterclass/logout", { method: "POST" }); setMe(null); };

  const login = async () => {
    setBusy(true); setAuthError(null);
    try {
      const r = await fetch("/api/masterclass/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Login failed");
      setMe(d.user); setActive(d.user.activeModule || 0); setCompleted(Array.isArray(d.user.completed) ? d.user.completed : []);
      window.scrollTo({ top: 0 });
    } catch (e) { setAuthError(e instanceof Error ? e.message : "Login failed"); } finally { setBusy(false); }
  };

  const buy = async () => {
    setAuthError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setAuthError("Please enter a valid email."); return; }
    if (password.length < 6) { setAuthError("Password must be at least 6 characters."); return; }
    setBusy(true);
    try {
      const createRes = await fetch("/api/masterclass/create-order", { method: "POST" });
      const order = await createRes.json();
      if (!createRes.ok) throw new Error(order.error || "Could not start payment.");
      await new Promise<void>((resolve, reject) => {
        if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve();
        const sc = document.createElement("script");
        sc.src = "https://checkout.razorpay.com/v1/checkout.js";
        sc.onload = () => resolve(); sc.onerror = () => reject(new Error("Failed to load payment gateway"));
        document.body.appendChild(sc);
      });
      const RZP = (window as unknown as { Razorpay: new (o: unknown) => { open: () => void; on: (e: string, cb: (x: unknown) => void) => void } }).Razorpay;
      const rzp = new RZP({
        key: order.keyId, currency: order.currency, amount: Math.round(order.amount * 100),
        name: "GLP-1 Masterclass", description: "Lifetime access · 12 lessons", order_id: order.orderId,
        prefill: { name, email },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const vr = await fetch("/api/masterclass/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpayOrderId: resp.razorpay_order_id, razorpayPaymentId: resp.razorpay_payment_id, razorpaySignature: resp.razorpay_signature, name, email, password }),
            });
            const d = await vr.json();
            if (!vr.ok || !d.success) throw new Error(d.error || "Verification failed");
            setMe(d.user); setActive(0); setCompleted([]); window.scrollTo({ top: 0 });
          } catch (e) { setAuthError(e instanceof Error ? e.message : "Verification failed"); } finally { setBusy(false); }
        },
      } as unknown);
      (rzp as unknown as { on: (e: string, cb: (x: { error?: { description?: string } }) => void) => void }).on("payment.failed", (evt) => { setAuthError(evt?.error?.description || "Payment failed."); setBusy(false); });
      rzp.open();
    } catch (e) { setAuthError(e instanceof Error ? e.message : "Something went wrong."); setBusy(false); }
  };

  const input = css("width:100%;box-sizing:border-box;border:1.5px solid #e2e8f0;border-radius:9px;padding:12px 14px;font-size:15px;color:#0f172a;outline:none;font-family:inherit;margin-bottom:10px");
  const pct = Math.round((completed.length / LESSONS.length) * 100);

  if (loading) {
    return <Shell><div style={css("display:flex;align-items:center;justify-content:center;height:100vh;color:#94a3b8;font-size:14px")}>Loading…</div></Shell>;
  }

  /* ---------------- COURSE PLAYER (logged in + purchased) ---------------- */
  if (me?.purchased) {
    const L = LESSONS[active];
    const vid = LESSON_VIDEOS[active];
    return (
      <Shell>
        <header style={css("background:#fff;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:20")}>
          <div className="mc-in" style={css("display:flex;align-items:center;justify-content:space-between;padding-top:14px;padding-bottom:14px")}>
            <div style={css("font-weight:800;font-size:17px;letter-spacing:-.01em")}>GLP-1 <span style={{ color: BLUE }}>Masterclass</span></div>
            <div style={css("display:flex;align-items:center;gap:16px")}>
              <span style={css("font-size:13px;color:#64748b")}>{me.name ? me.name : me.email}</span>
              <button onClick={logout} style={css("border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:13px;font-weight:600;padding:8px 14px;border-radius:8px;cursor:pointer;font-family:inherit")}>Log out</button>
            </div>
          </div>
        </header>

        <div className="mc-in" style={css("padding-top:26px;padding-bottom:60px")}>
          <div style={css("margin-bottom:20px")}>
            <div style={css("display:flex;justify-content:space-between;align-items:center;margin-bottom:8px")}>
              <span style={css("font-size:13px;font-weight:600;color:#475569")}>Your progress</span>
              <span style={css("font-size:13px;font-weight:700;color:#2563eb")}>{completed.length} / {LESSONS.length} lessons · {pct}%</span>
            </div>
            <div style={css("height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden")}><div style={{ ...css("height:100%;background:#2563eb;transition:width .3s"), width: `${pct}%` }} /></div>
          </div>

          <div className="mc-player">
            {/* sidebar */}
            <div style={css("background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:10px;display:grid;gap:4px;align-self:start")}>
              {LESSONS.map((l, i) => {
                const done = completed.includes(i);
                const isActive = i === active;
                return (
                  <button key={i} onClick={() => goTo(i)} style={{ ...css("display:flex;gap:11px;align-items:center;text-align:left;border:none;cursor:pointer;border-radius:10px;padding:11px 12px;font-family:inherit;width:100%"), background: isActive ? "#eff4ff" : "transparent" }}>
                    <span style={{ ...css("flex:none;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700"), background: done ? "#16a34a" : isActive ? BLUE : "#f1f5f9", color: done || isActive ? "#fff" : "#94a3b8" }}>{done ? "✓" : i + 1}</span>
                    <span style={{ ...css("font-size:13.5px;font-weight:600;line-height:1.3;min-width:0;overflow:hidden;text-overflow:ellipsis"), color: isActive ? "#0f172a" : "#475569" }}>{l.t}</span>
                  </button>
                );
              })}
            </div>

            {/* main */}
            <div>
              <div style={css("background:#0f172a;border-radius:14px;overflow:hidden;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center")}>
                {vid ? (
                  <iframe src={vid} title={L.t} allow="accelerated-encoder; autoplay; encrypted-media; picture-in-picture" allowFullScreen style={css("width:100%;height:100%;border:0")} />
                ) : (
                  <div style={css("text-align:center;color:#64748b;font-size:13px")}><div style={css("font-size:40px;margin-bottom:8px")}>▶</div>Lesson video<br /><span style={css("font-size:11px;color:#475569")}>Add the embed URL in LESSON_VIDEOS</span></div>
                )}
              </div>
              <div style={css("display:flex;align-items:center;gap:10px;margin-top:18px")}>
                <span style={css("font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#2563eb")}>Lesson {active + 1}</span>
                {completed.includes(active) && <span style={css("font-size:11px;font-weight:700;color:#16a34a;background:#dcfce7;padding:3px 9px;border-radius:999px")}>Completed</span>}
              </div>
              <h1 style={css("font-size:27px;font-weight:800;letter-spacing:-.02em;margin:8px 0 10px")}>{L.t}</h1>
              <p style={css("font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px")}>{L.d}</p>
              <div style={css("display:flex;gap:12px;flex-wrap:wrap")}>
                <button onClick={markComplete} style={css("border:none;cursor:pointer;background:#2563eb;color:#fff;font-family:inherit;font-weight:700;font-size:14px;padding:13px 22px;border-radius:10px")}>{active === LESSONS.length - 1 ? "Mark complete ✓" : "Mark complete & next →"}</button>
                {active < LESSONS.length - 1 && <button onClick={() => goTo(active + 1)} style={css("border:1px solid #e2e8f0;cursor:pointer;background:#fff;color:#475569;font-family:inherit;font-weight:600;font-size:14px;padding:13px 20px;border-radius:10px")}>Skip →</button>}
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  /* ---------------- LANDING + AUTH (not purchased) ---------------- */
  const authCard = (
    <div style={css("background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;box-shadow:0 30px 60px -40px rgba(37,99,235,.4)")}>
      <div style={css("display:flex;align-items:baseline;gap:10px;margin-bottom:4px")}>
        <span style={css("font-size:30px;font-weight:800;letter-spacing:-.02em")}>₹89</span>
        <span style={css("font-size:16px;color:#94a3b8;text-decoration:line-through;font-weight:600")}>₹999</span>
        <span style={css("font-size:12px;font-weight:700;color:#16a34a;background:#dcfce7;padding:3px 8px;border-radius:6px")}>91% off</span>
      </div>
      <div style={css("font-size:13px;color:#64748b;margin-bottom:18px")}>One payment · lifetime access</div>

      {mode === "buy" ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={input} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (your login)" style={input} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Create a password" style={input} />
          {authError && <div style={css("color:#dc2626;font-size:12.5px;margin-bottom:10px")}>{authError}</div>}
          <button onClick={buy} disabled={busy} style={css("width:100%;border:none;cursor:pointer;background:#2563eb;color:#fff;font-family:inherit;font-weight:700;font-size:15px;padding:14px;border-radius:10px")}>{busy ? "Processing…" : "Pay ₹89 & get instant access"}</button>
          <div style={css("text-align:center;font-size:13px;color:#64748b;margin-top:14px")}>Already bought?{" "}
            <span onClick={() => { setMode("login"); setAuthError(null); }} style={{ ...css("font-weight:700;cursor:pointer"), color: BLUE }}>Log in</span>
          </div>
        </>
      ) : (
        <>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" style={input} />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" style={input} />
          {authError && <div style={css("color:#dc2626;font-size:12.5px;margin-bottom:10px")}>{authError}</div>}
          <button onClick={login} disabled={busy} style={css("width:100%;border:none;cursor:pointer;background:#2563eb;color:#fff;font-family:inherit;font-weight:700;font-size:15px;padding:14px;border-radius:10px")}>{busy ? "…" : "Log in & resume"}</button>
          <div style={css("text-align:center;font-size:13px;color:#64748b;margin-top:14px")}>New here?{" "}
            <span onClick={() => { setMode("buy"); setAuthError(null); }} style={{ ...css("font-weight:700;cursor:pointer"), color: BLUE }}>Get the course</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Shell>
      {/* header */}
      <header style={css("background:#fff;border-bottom:1px solid #e2e8f0;position:sticky;top:0;z-index:20")}>
        <div className="mc-in" style={css("display:flex;align-items:center;justify-content:space-between;padding-top:14px;padding-bottom:14px")}>
          <div style={css("font-weight:800;font-size:17px;letter-spacing:-.01em")}>GLP-1 <span style={{ color: BLUE }}>Masterclass</span></div>
          <button onClick={() => { setMode("login"); setAuthError(null); document.getElementById("get")?.scrollIntoView({ behavior: "smooth" }); }} style={css("border:1px solid #e2e8f0;background:#fff;color:#475569;font-size:13px;font-weight:600;padding:8px 14px;border-radius:8px;cursor:pointer;font-family:inherit")}>Log in</button>
        </div>
      </header>

      {/* hero */}
      <section className="mc-in" style={css("padding-top:50px;padding-bottom:50px")} id="get">
        <div className="mc-grid2">
          <div>
            <div style={css("display:inline-block;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#2563eb;background:#eff4ff;padding:6px 12px;border-radius:999px;margin-bottom:18px")}>Doctor-led · 12 lessons</div>
            <h1 style={css("font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1.05;margin:0 0 18px")}>The GLP-1 Masterclass</h1>
            <p style={css("font-size:17px;color:#475569;line-height:1.6;margin:0 0 12px")}>Everything you need to understand GLP-1 for weight loss — the science, the medicines, side effects, nutrition and long-term success. 12 lessons. From basics to confident action.</p>
            <p style={css("font-size:15px;color:#64748b;margin:0")}>Roughly 10 minutes each — watch at your own pace, lifetime access.</p>
          </div>
          {authCard}
        </div>
      </section>

      {/* what you get */}
      <section className="mc-in" style={css("padding-top:20px;padding-bottom:50px")}>
        <h2 style={css("font-size:26px;font-weight:800;letter-spacing:-.02em;text-align:center;margin:0 0 8px")}>Everything included</h2>
        <p style={css("text-align:center;color:#64748b;font-size:15px;margin:0 0 30px")}>One payment. Yours forever.</p>
        <div className="mc-get">
          {GET.map((g) => (
            <div key={g.t} style={css("background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:18px")}>
              <div style={css("width:34px;height:34px;border-radius:9px;background:#eff4ff;color:#2563eb;display:flex;align-items:center;justify-content:center;font-weight:800;margin-bottom:12px")}>✓</div>
              <div style={css("font-size:15px;font-weight:700;margin-bottom:4px")}>{g.t}</div>
              <div style={css("font-size:13px;color:#64748b;line-height:1.5")}>{g.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* curriculum */}
      <section className="mc-in" style={css("padding-top:20px;padding-bottom:50px")} id="curriculum">
        <h2 style={css("font-size:26px;font-weight:800;letter-spacing:-.02em;text-align:center;margin:0 0 8px")}>12 lessons. From basics to confident action.</h2>
        <p style={css("text-align:center;color:#64748b;font-size:15px;margin:0 0 30px")}>Roughly 10 minutes each — watch at your own pace, lifetime access.</p>
        <div style={css("display:grid;gap:10px;max-width:760px;margin:0 auto")}>
          {LESSONS.map((l, i) => (
            <div key={i} style={css("display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px")}>
              <span style={css("flex:none;width:30px;height:30px;border-radius:8px;background:#eff4ff;color:#2563eb;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px")}>{i + 1}</span>
              <div><div style={css("font-size:15px;font-weight:700;margin-bottom:3px")}>{l.t}</div><div style={css("font-size:13px;color:#64748b;line-height:1.5")}>{l.d}</div></div>
              <span style={css("margin-left:auto;flex:none;color:#cbd5e1;font-size:16px")}>🔒</span>
            </div>
          ))}
        </div>
      </section>

      {/* experts */}
      <section className="mc-in" style={css("padding-top:20px;padding-bottom:50px")} id="experts">
        <h2 style={css("font-size:26px;font-weight:800;letter-spacing:-.02em;text-align:center;margin:0 0 30px")}>Built with doctors & dietitians</h2>
        <div className="mc-experts">
          {EXPERTS.map((e) => (
            <div key={e.n} style={css("background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:18px;text-align:center")}>
              <div style={css("width:54px;height:54px;border-radius:50%;background:#eff4ff;color:#2563eb;font-weight:800;font-size:18px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px")}>{e.n.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
              <div style={css("font-size:14px;font-weight:700")}>{e.n}</div>
              <div style={css("font-size:12px;color:#64748b;margin-top:3px")}>{e.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* testimonials */}
      <section className="mc-in" style={css("padding-top:20px;padding-bottom:50px")}>
        <h2 style={css("font-size:26px;font-weight:800;letter-spacing:-.02em;text-align:center;margin:0 0 30px")}>What students say</h2>
        <div className="mc-testi">
          {TESTI.map((t) => (
            <div key={t.name} style={css("background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:22px")}>
              <div style={css("color:#f59e0b;font-size:14px;letter-spacing:2px;margin-bottom:12px")}>★★★★★</div>
              <p style={css("font-size:15px;color:#334155;line-height:1.6;margin:0 0 16px")}>&ldquo;{t.quote}&rdquo;</p>
              <div style={css("display:flex;align-items:center;gap:11px")}>
                <div style={css("width:38px;height:38px;border-radius:50%;background:#eff4ff;color:#2563eb;font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center")}>{t.initials}</div>
                <div><div style={css("font-size:13.5px;font-weight:700")}>{t.name}</div><div style={css("font-size:12px;color:#64748b")}>{t.meta}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* faq */}
      <section className="mc-in" style={css("padding-top:20px;padding-bottom:40px")}>
        <h2 style={css("font-size:26px;font-weight:800;letter-spacing:-.02em;text-align:center;margin:0 0 26px")}>Questions</h2>
        <div style={css("max-width:720px;margin:0 auto;display:grid;gap:10px")}>
          {FAQS.map((f, i) => (
            <div key={i} onClick={() => setOpenFaq((o) => (o === i ? -1 : i))} style={css("background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;cursor:pointer")}>
              <div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px")}><span style={css("font-size:14.5px;font-weight:700")}>{f.q}</span><span style={{ ...css("font-size:20px;font-weight:400;flex:none"), color: BLUE }}>{openFaq === i ? "–" : "+"}</span></div>
              {openFaq === i && <p style={css("font-size:13.5px;color:#64748b;line-height:1.6;margin:10px 0 0")}>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* final cta */}
      <section className="mc-in" style={css("padding-top:20px;padding-bottom:70px")}>
        <div style={css("background:#2563eb;border-radius:18px;padding:44px 24px;text-align:center;color:#fff")}>
          <h2 style={css("font-size:28px;font-weight:800;letter-spacing:-.02em;margin:0 0 10px")}>Start learning today for ₹89</h2>
          <p style={css("font-size:15px;color:#dbe6ff;margin:0 0 22px")}>12 doctor-led lessons · lifetime access · resume anytime</p>
          <button onClick={() => { setMode("buy"); document.getElementById("get")?.scrollIntoView({ behavior: "smooth" }); }} style={css("border:none;cursor:pointer;background:#fff;color:#2563eb;font-family:inherit;font-weight:800;font-size:15px;padding:15px 32px;border-radius:11px")}>Get the course</button>
        </div>
        <p style={css("text-align:center;font-size:11px;color:#94a3b8;margin:22px auto 0;max-width:680px;line-height:1.6")}>This course is educational and is not medical advice. Always consult a qualified doctor before starting or changing any medication. © 2026 Lean Protocol.</p>
      </section>
    </Shell>
  );
}
