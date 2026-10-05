export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import {
  BG_COOKIE, BG_SESSION_DAYS, bgConfigured, checkPassword, makeSession,
} from "../../../../lib/bg-dashboard";

export async function POST(request: NextRequest) {
  if (!bgConfigured()) {
    return NextResponse.json({ error: "Dashboard login is not set up yet" }, { status: 500 });
  }
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!checkPassword(String(body.password || ""))) {
    // Slows down password guessing.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "That password is not right" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BG_COOKIE, makeSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: BG_SESSION_DAYS * 86_400,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(BG_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}