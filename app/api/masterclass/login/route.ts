import { NextResponse } from "next/server";
import { prisma, checkPassword, signToken, COOKIE, cookieOptions } from "../../../../lib/courseAuth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const em = String(email || "").trim().toLowerCase();
    const user = await prisma.courseUser.findUnique({ where: { email: em } });
    if (!user || !(await checkPassword(String(password || ""), user.password)))
      return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });

    const token = signToken(user.id);
    const res = NextResponse.json({
      user: { email: user.email, name: user.name, purchased: user.purchased, activeModule: user.activeModule, completed: user.completed },
    });
    res.cookies.set(COOKIE, token, cookieOptions);
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
