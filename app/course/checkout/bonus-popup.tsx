"use client";

// app/course/checkout/bonus-popup.tsx
// Tap-to-reveal checkout bonus. Shown once, within the visitor's real offer
// window. Revealing asks the server for a signed coupon (valid until the
// window ends); closing without revealing keeps the normal price.
// Every visitor who reveals gets the same bonus - there are no other prizes.
// Pure ASCII file.

import { useState } from "react";
import { BONUS, COURSE } from "@/content/course";

type Props = { windowEnd: number; onCoupon: (token: string, expiresAt: number) => void; onClose: () => void };

const RUPEE = "\u20b9";

export default function BonusPopup({ windowEnd, onCoupon, onClose }: Props) {
  const [state, setState] = useState<"idle" | "opening" | "revealed" | "error">("idle");

  async function reveal() {
    if (state !== "idle") return;
    setState("opening");
    try {
      const [r] = await Promise.all([
        fetch("/api/course/coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ windowEnd }) }),
        new Promise((res) => setTimeout(res, 900)), // let the gift animation play
      ]);
      const d = await (r as Response).json().catch(() => ({}));
      if (!(r as Response).ok || !d?.token) throw new Error();
      onCoupon(d.token, d.expiresAt);
      setState("revealed");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="bp-scrim" role="dialog" aria-modal="true" aria-labelledby="bp-title">
      <div className="bp-box">
        <button type="button" className="bp-close" onClick={onClose} aria-label="Close">{"\u00d7"}</button>
        {state !== "revealed" ? (
          <>
            <p className="bp-eyebrow">Before you pay</p>
            <h2 id="bp-title">Your bonus is waiting</h2>
            <button type="button" className={`bp-gift${state === "opening" ? " open" : ""}`} onClick={reveal} disabled={state === "opening"} aria-label="Tap to reveal your bonus">
              <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#193231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="8" width="18" height="4" rx="1" fill="#C8D9A7"></rect>
                <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" fill="#E7EFD9"></path>
                <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"></path>
              </svg>
            </button>
            <p className="bp-hint">{state === "opening" ? "Unwrapping..." : "Tap the gift to reveal it"}</p>
            {state === "error" && <p className="err">This offer is no longer available. You can continue at {RUPEE}{COURSE.priceInr}.</p>}
          </>
        ) : (
          <>
            <p className="bp-eyebrow">Bonus unlocked</p>
            <h2 id="bp-title">{BONUS.title}</h2>
            <div className="bp-code">Code <b>{BONUS.code}</b> applied</div>
            <p className="bp-price">You pay <s>{RUPEE}{COURSE.priceInr}</s> <b>{RUPEE}{COURSE.priceInr - BONUS.discountInr}</b></p>
            <button type="button" className="bp-go" onClick={onClose}>Continue to payment</button>
          </>
        )}
      </div>
    </div>
  );
}