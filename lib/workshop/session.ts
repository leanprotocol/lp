// lib/workshop/session.ts
// A short-lived signed cookie carrying the verified phone plus the name and
// email captured at sign-in. Signing the whole payload means the name that
// ends up on the certificate cannot be swapped after verification.
//
// Env: WORKSHOP_SESSION_SECRET
//   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

import crypto from "crypto";

const SECRET = process.env.WORKSHOP_SESSION_SECRET || "";
const TTL_MS = 1000 * 60 * 60 * 4; // 4 hours

export const SESSION_COOKIE = "workshop_session";

export type SessionData = {
  phone: string;
  name: string;
  email: string;
};

/** Digits only, with the country code, e.g. 919650491267 */
export function normalisePhone(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length === 13 && digits.startsWith("091")) return digits.slice(1);
  return digits;
}

export function isValidIndianPhone(phone: string): boolean {
  return /^91[6-9]\d{9}$/.test(phone);
}

export function normaliseName(raw: string): string {
  return (raw || "").trim().replace(/\s+/g, " ");
}

export function normaliseEmail(raw: string): string {
  return (raw || "").trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isValidName(name: string): boolean {
  return (
    name.length >= 2 &&
    name.length <= 60 &&
    /^[\p{L}\p{M}.'\- ]+$/u.test(name)
  );
}

export function createSessionToken(data: SessionData): string {
  const exp = Date.now() + TTL_MS;
  const payload =
    Buffer.from(JSON.stringify(data)).toString("base64url") + "." + exp;
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");
  return payload + "." + sig;
}

export function readSessionToken(
  token: string | undefined
): SessionData | null {
  if (!token || !SECRET) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [dataB64, expStr, sig] = parts;
  const payload = dataB64 + "." + expStr;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Number(expStr) < Date.now()) return null;

  try {
    const data = JSON.parse(
      Buffer.from(dataB64, "base64url").toString("utf8")
    ) as SessionData;
    if (!data?.phone) return null;
    return data;
  } catch {
    return null;
  }
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: TTL_MS / 1000,
};
