/* Per-visitor bonus window. Starts on the visitor's first visit and is kept
   in localStorage, so it does NOT restart on refresh. Used by the landing-page
   timer and the checkout bonus pop-up. A revealed coupon is also kept in
   localStorage, so it stays applied until the window ends even if the
   visitor goes back, closes the tab or opens a new one.
   Browser-only helpers. Pure ASCII. */

import { BONUS } from "@/content/course";

const KEY = "lp_course_offer_end";
export const DISMISS_KEY = "lp_course_bonus_dismissed";
export const COUPON_KEY = "lp_course_coupon";

/* ===================== TESTING MODE - REMOVE BEFORE DEPLOYING =====================
   While TESTING is true, every page load starts a fresh 5-minute window and
   clears any revealed coupon, so the timer and the bonus pop-up appear every
   time. Set TESTING to false (or delete this block and the branch below)
   before pushing live: on the real site the window must start once per
   visitor and must NOT restart on refresh.
   ================================================================================= */
const TESTING = true;

export function getWindowEnd(): number {
  const fresh = Date.now() + BONUS.windowMinutes * 60_000;
  if (TESTING) {
    try {
      localStorage.setItem(KEY, String(fresh));
      localStorage.removeItem(DISMISS_KEY);
      localStorage.removeItem(COUPON_KEY);
    } catch { /* ignore */ }
    return fresh;
  }
  try {
    const saved = Number(localStorage.getItem(KEY));
    if (saved > 0) return saved;
    localStorage.setItem(KEY, String(fresh));
    return fresh;
  } catch {
    return fresh; // storage blocked: this visit only
  }
}

export const fmt = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};