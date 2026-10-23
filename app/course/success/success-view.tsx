"use client";

// app/course/success/success-view.tsx
// Reads what the checkout stored, then shows the confirmation and the app
// links. Visiting this page without a recent payment shows a gentle fallback
// rather than a broken screen.
// Pure ASCII file.

import { useEffect, useState } from "react";
import { COURSE, isReady } from "@/content/course";
import { PAID_KEY, type Paid } from "./paid-key";

const CSS = `


.co{min-height:100vh;background:#193231;font-family:var(--font-sans,Inter),Inter,system-ui,sans-serif;color:#1C2B22;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}

.co *{box-sizing:border-box}

.co .box{width:100%;max-width:460px;background:#F9F7F2;border-radius:28px;padding:34px 30px;box-shadow:0 30px 80px rgba(0,0,0,.3);display:flex;flex-direction:column;gap:16px}

.co h1{margin:0;font-size:28px;line-height:1.15;letter-spacing:-.03em;font-weight:800}

.co h1 i{font-family:var(--font-serif,'Libre Baskerville'),'Libre Baskerville',Georgia,serif;font-weight:400;color:#2D5A4E}

.co .sum{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid rgba(28,43,34,.1);border-radius:16px;padding:14px 18px;font-weight:700}

.co .sum b{font-size:26px;letter-spacing:-.03em}

.co label{font-weight:700;font-size:14px}

.co input[type=text],.co input[type=tel]{width:100%;background:#fff;border:1.5px solid rgba(28,43,34,.16);border-radius:14px;padding:14px 16px;font:inherit;font-size:16px}

.co .ph{display:flex;gap:10px}.co .ph span{background:#fff;border:1.5px solid rgba(28,43,34,.16);border-radius:14px;padding:14px;font-weight:700}

.co .consent{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:#4A5A52;font-weight:400}

.co .consent input{margin-top:3px;width:18px;height:18px;flex:none}

.co button.pay{border:0;border-radius:999px;background:#193231;color:#F9F7F2;font:inherit;font-weight:800;font-size:17px;padding:17px;cursor:pointer;min-height:52px}

.co button.pay:disabled{opacity:.55;cursor:default}

.co .err{margin:0;color:#B3402F;font-size:14px}

.co .fine{margin:0;font-size:12.5px;color:#5A6A62}

.co a{color:#2D5A4E}

.co .bonus-on{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center;background:#E7EFD9;border:1px solid #C8D9A7;border-radius:14px;padding:10px 14px;font-size:13.5px;color:#193231}

.co .bonus-time{font-weight:800;color:#C0392B;font-variant-numeric:tabular-nums}

.bp-scrim{position:fixed;inset:0;z-index:1000;background:rgba(10,20,19,.7);display:flex;align-items:center;justify-content:center;padding:20px}

.bp-box{position:relative;width:100%;max-width:400px;background:#F9F7F2;border-radius:26px;padding:34px 28px 28px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;box-shadow:0 30px 80px rgba(0,0,0,.4);animation:bpIn .25s ease-out}

.bp-close{position:absolute;top:12px;right:14px;width:40px;height:40px;border:0;background:transparent;font-size:28px;line-height:1;color:#5A6A62;cursor:pointer;border-radius:999px}

.bp-eyebrow{margin:0;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#2D5A4E}

.bp-box h2{margin:0;font-size:24px;line-height:1.2;letter-spacing:-.02em;font-weight:800;color:#193231}

.bp-gift{margin:10px 0 0;border:0;background:radial-gradient(circle,#fff 0%,#F1F5EA 70%);width:150px;height:150px;border-radius:999px;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:bpBob 1.6s ease-in-out infinite}

.bp-gift.open{animation:bpShake .9s ease-in-out}

.bp-hint{margin:0;font-weight:700;color:#4A5A52}

.bp-code{background:#193231;color:#C8D9A7;border-radius:12px;padding:10px 16px;font-weight:700}

.bp-code b{color:#F9F7F2;letter-spacing:.08em}

.bp-price{margin:4px 0 0;font-size:18px;color:#193231}

.bp-price s{color:#7A867F;margin-right:6px}

.bp-price b{font-size:28px}

.bp-go{margin-top:6px;width:100%;border:0;border-radius:999px;background:#193231;color:#F9F7F2;font:inherit;font-weight:800;font-size:16px;padding:15px;cursor:pointer;min-height:48px}

@keyframes bpIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}

@keyframes bpBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

@keyframes bpShake{0%,100%{transform:rotate(0)}20%{transform:rotate(-10deg) scale(1.05)}40%{transform:rotate(10deg) scale(1.08)}60%{transform:rotate(-8deg) scale(1.1)}80%{transform:rotate(6deg) scale(1.12)}}

@media (prefers-reduced-motion:reduce){.bp-box,.bp-gift,.bp-gift.open{animation:none}}

.co .ok{width:72px;height:72px;border-radius:999px;background:#193231;color:#C8D9A7;display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto}

.co .stores{display:flex;flex-direction:column;gap:10px;margin-top:4px}

.co .store{display:flex;align-items:center;justify-content:center;gap:11px;background:#193231;color:#F9F7F2;text-decoration:none;border-radius:14px;padding:13px 20px;min-height:56px}

.co .store:hover{background:#234b43}

.co .store .lbl{display:flex;flex-direction:column;line-height:1.15;text-align:left}

.co .store .lbl small{font-size:11px;font-weight:600;opacity:.82}

.co .store .lbl b{font-size:17px;font-weight:800;letter-spacing:-.01em}

.co .steps{list-style:none;margin:2px 0 0;padding:0;display:flex;flex-direction:column;gap:9px;text-align:left}

.co .steps li{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:#4A5A52}

.co .steps .n{flex:none;width:21px;height:21px;border-radius:999px;background:#C8D9A7;color:#193231;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:1px}

`;

export default function SuccessView() {
  const [paid, setPaid] = useState<Paid | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PAID_KEY);
      if (raw) setPaid(JSON.parse(raw) as Paid);
    } catch {
      /* storage blocked */
    }
    setChecked(true);
  }, []);

  if (!checked) return <main className="co" />;

  const firstName = paid?.name?.trim().split(" ")[0] || "";
  const phone = paid?.phone || "";
  const reference = paid?.reference || "";

  return (
    <main className="co">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {paid ? (


        <div className="box" style={{ textAlign: "center" }}>

          <span className="ok" aria-hidden="true">{"\u2713"}</span>

          <h1>You are in, <i>{firstName}.</i></h1>

          <p style={{ margin: 0, color: "#4A5A52" }}>Two steps and you are watching.</p>

          <ol className="steps">

            <li><span className="n">1</span><span>Download the Lean Protocol app.</span></li>

            <li><span className="n">2</span><span>Sign in with <b>+91 {phone}</b> and every chapter is unlocked.</span></li>

          </ol>

          <div className="stores">

            {isReady(COURSE.app.playStore) && (

              <a className="store" href={COURSE.app.playStore} target="_blank" rel="noopener noreferrer">

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">

                  <path d="M3.6 2.3 13 11.7l-9.4 9.4A1.7 1.7 0 0 1 3 19.9V3.5c0-.46.23-.89.6-1.2z" fill="#34A853" />

                  <path d="M16.5 8.2 13 11.7 3.6 2.3c.42-.3.97-.35 1.43-.1l11.47 6z" fill="#EA4335" />

                  <path d="M20.6 10.4c.9.5.9 1.8 0 2.3l-4.1 2.2L13 11.7l3.5-3.5 4.1 2.2z" fill="#FBBC04" />

                  <path d="M16.5 15.2 5.03 21.2c-.46.25-1 .2-1.43-.1L13 11.7l3.5 3.5z" fill="#4285F4" />

                </svg>

                <span className="lbl"><small>Get it on</small><b>Google Play</b></span>

              </a>

            )}

            {isReady(COURSE.app.appStore) && (

              <a className="store" href={COURSE.app.appStore} target="_blank" rel="noopener noreferrer">

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F9F7F2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></svg>

                <span className="lbl"><small>Download on the</small><b>App Store</b></span>

              </a>

            )}

          </div>

          <p className="fine">Payment reference: {reference}</p>

        </div>
      ) : (
        <div className="box" style={{ textAlign: "center" }}>
          <h1>Nothing to show here.</h1>
          <p style={{ margin: 0, color: "#4A5A52" }}>
            We cannot find a recent payment in this browser. If you have paid, download the app and sign in with the
            mobile number you used, and the master class will be there.
          </p>
          <div className="stores">
            {isReady(COURSE.app.playStore) && (
              <a className="store" href={COURSE.app.playStore} target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3.6 2.3 13 11.7l-9.4 9.4A1.7 1.7 0 0 1 3 19.9V3.5c0-.46.23-.89.6-1.2z" fill="#34A853" />
                  <path d="M16.5 8.2 13 11.7 3.6 2.3c.42-.3.97-.35 1.43-.1l11.47 6z" fill="#EA4335" />
                  <path d="M20.6 10.4c.9.5.9 1.8 0 2.3l-4.1 2.2L13 11.7l3.5-3.5 4.1 2.2z" fill="#FBBC04" />
                  <path d="M16.5 15.2 5.03 21.2c-.46.25-1 .2-1.43-.1L13 11.7l3.5 3.5z" fill="#4285F4" />
                </svg>
                <span className="lbl"><small>Get it on</small><b>Google Play</b></span>
              </a>
            )}
          </div>
          <p className="fine">Questions? Email support@leanprotocol.in</p>
        </div>
      )}
    </main>
  );
}