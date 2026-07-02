import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/courseAuth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ loggedIn: false });
  return NextResponse.json({
    loggedIn: true,
    user: { email: user.email, name: user.name, purchased: user.purchased, activeModule: user.activeModule, completed: user.completed },
  });
}
