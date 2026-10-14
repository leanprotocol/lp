"use client";

// app/course/offer-countdown.tsx
// Counts down to the real end of the offer (OFFER.endsAt in content/course.ts).
// It is the same for every visitor and does not restart on refresh. Renders
// nothing if no end date is set or the date has passed.
// Pure ASCII file.

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

export default function OfferCountdown({ endsAt }: { endsAt: string }) {
  const end = Date.parse(endsAt);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!endsAt || Number.isNaN(end) || now === null) return null;
  const left = end - now;
  if (left <= 0) return null;

  const s = Math.floor(left / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const dateText = new Date(end).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit",
  });

  return (
    <div className="countdown" role="timer" aria-live="off">
      <p className="cd-label">Offer ends in</p>
      <p className="cd-time">
        {d > 0 && <><b>{d}</b><small>d</small></>}
        <b>{pad(h)}</b><small>h</small><b>{pad(m)}</b><small>m</small><b>{pad(sec)}</b><small>s</small>
      </p>
      <p className="cd-valid">Offer valid till {dateText}</p>
    </div>
  );
}