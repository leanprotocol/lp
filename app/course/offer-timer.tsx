"use client";

// app/course/offer-timer.tsx
// "Time left to avail your offer" under the price strip. Counts down the
// visitor's real bonus window (offer-window.ts); it does not restart on
// refresh, and when it ends the checkout bonus is genuinely gone.
// Pure ASCII file.

import { useEffect, useState } from "react";
import { fmt, getWindowEnd } from "./offer-window";

export default function OfferTimer() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = getWindowEnd();
    const tick = () => setLeft(end - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  if (left === null || left <= 0) return null;
  return (
    <div className="countdown" role="timer" aria-live="off">
      <p className="cd-label">Time left to avail your offer</p>
      <p className="cd-time"><b>{fmt(left)}</b></p>
    </div>
  );
}