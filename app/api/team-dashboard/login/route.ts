export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  TEAM_COOKIE, TEAM_SESSION_DAYS, teamConfigured, checkLogin, loginDiagnosis, makeSession,
} from "../../../../lib/team-dashboard";

export async function POST(request: NextRequest) {
  if (!teamConfigured()) {
    return NextResponse.json({ error: "Dashboard login is not set up yet" }, { status: 500 });
  }
  const body = (await request.json().catch(() => ({}))) as { name?: string; password?: string };
  const user = checkLogin(String(body.name || ""), String(body.password || ""));
  if (user === null) {
    // Audit trail in the Vercel logs, with the reason. Never logs a password or hash.
    console.warn(`[team-dashboard] failed sign-in ${loginDiagnosis(String(body.name || ""))}`);
    // Slows down password guessing.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "That name and password do not match" }, { status: 401 });
  }
  console.info(`[team-dashboard] sign-in user=${user || "shared-password"}`);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(TEAM_COOKIE, makeSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TEAM_SESSION_DAYS * 86_400,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(TEAM_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
