"use client";

import { useEffect, useState } from "react";

// Countdown resets to a fresh ~18-22 hour window each time it would hit zero,
// so the "urgency" timer always reads as live and ending soon.
function getInitialSeconds() {
  const stored = typeof window !== "undefined" ? sessionStorage.getItem("challengeCountdownEnd") : null;
  const now = Date.now();

  if (stored) {
    const end = parseInt(stored, 10);
    if (end > now) {
      return Math.floor((end - now) / 1000);
    }
  }

  const randomHours = 18 + Math.random() * 4; // 18–22 hours
  const endTime = now + randomHours * 3600 * 1000;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("challengeCountdownEnd", String(endTime));
  }
  return Math.floor(randomHours * 3600);
}

export function UrgencyBar() {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    setSeconds(getInitialSeconds());
    const interval = setInterval(() => {
      setSeconds((s) => (s !== null && s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (seconds === null) return null;

  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return (
    <div className="urgency-bar">
      <span className="ribbon">🔥 ₹449</span>
      <span>₹449 doctor consultation — limited seats today</span>
      <span className="countdown">
        Ends in <b>{h}</b>:<b>{m}</b>:<b>{s}</b>
      </span>
    </div>
  );
}
