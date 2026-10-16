/* Signed, expiring coupon for the master class checkout bonus. Server only.
   Token format: CODE.EXPIRY_MS.SIGNATURE. The order route charges the
   discounted price only when the signature checks out and it has not expired,
   so the browser cannot invent or extend a discount.
   Secret: COURSE_COUPON_SECRET if set, otherwise RAZORPAY_KEY_SECRET.
   Pure ASCII file. */

import crypto from "crypto";
import { BONUS } from "../content/course";

const secret = () => process.env.COURSE_COUPON_SECRET || process.env.RAZORPAY_KEY_SECRET || "";
const sign = (payload: string) => crypto.createHmac("sha256", secret()).update(`course-coupon.${payload}`).digest("hex");

export function issueCoupon(expiresAt: number): string | null {
  if (!secret()) return null;
  const payload = `${BONUS.code}.${Math.floor(expiresAt)}`;
  return `${payload}.${sign(payload)}`;
}

export function validCoupon(token: unknown): boolean {
  if (typeof token !== "string" || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [code, exp, sig] = parts;
  if (code !== BONUS.code || !(Number(exp) > Date.now())) return false;
  const want = Buffer.from(sign(`${code}.${exp}`));
  const got = Buffer.from(sig);
  return want.length === got.length && crypto.timingSafeEqual(want, got);
}