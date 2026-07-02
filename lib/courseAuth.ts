import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/* Self-contained auth for the GLP-1 Masterclass.
   Reuses your existing Prisma client (lib/prisma.ts) so it matches your Prisma v7 setup.
   Session = a signed JWT stored in an httpOnly cookie. */

export { prisma };

const SECRET = process.env.COURSE_SESSION_SECRET || "dev-insecure-secret-change-me";
export const COOKIE = "lp_course_session";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export function hashPassword(pw: string) { return bcrypt.hash(pw, 10); }
export function checkPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash); }
export function signToken(uid: string) { return jwt.sign({ uid }, SECRET, { expiresIn: "30d" }); }
export function verifyToken(t: string): string | null {
  try { return (jwt.verify(t, SECRET) as { uid: string }).uid; } catch { return null; }
}

/** Reads the session cookie and returns the CourseUser, or null. */
export async function getSessionUser() {
  const store = await cookies();
  const tok = store.get(COOKIE)?.value;
  if (!tok) return null;
  const uid = verifyToken(tok);
  if (!uid) return null;
  return prisma.courseUser.findUnique({ where: { id: uid } });
}
